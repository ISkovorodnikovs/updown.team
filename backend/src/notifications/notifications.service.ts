import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { randomBytes } from 'crypto';
import { Notification } from '../database/entities/notification.entity';
import { User, UserRole } from '../database/entities/user.entity';
import { TelegramMainService } from '../telegram/telegram-main.service';

interface NotifyPayload {
  type: string;
  title: string;
  body?: string;
  meta?: Record<string, any>;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger('Notifications');
  // Короткоживущие токены привязки Telegram: token -> { userId, exp }
  private linkTokens = new Map<string, { userId: string; exp: number }>();

  constructor(
    @InjectRepository(Notification) private repo: Repository<Notification>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private telegram: TelegramMainService,
  ) {}

  onModuleInit() {
    // Привязка Telegram по /start <token>
    this.telegram.onLinkStart((token, tgId) => this.resolveLink(token, tgId));
  }

  /** Создать уведомление одному пользователю (+ доставка в Telegram, если включено). */
  async create(userId: string, p: NotifyPayload): Promise<Notification> {
    const n = await this.repo.save(
      this.repo.create({
        userId,
        type: p.type,
        title: p.title,
        body: p.body ?? null,
        meta: p.meta ?? null,
      }),
    );
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user?.telegramUserId && user.notifyTelegram) {
        await this.telegram.sendToUser(
          user.telegramUserId,
          `🔔 ${p.title}${p.body ? `\n${p.body}` : ''}`,
        );
      }
    } catch (e: any) {
      this.logger.warn(`tg deliver failed: ${e.message}`);
    }
    return n;
  }

  /** Нескольким пользователям. */
  async createForUsers(userIds: string[], p: NotifyPayload) {
    for (const id of userIds) await this.create(id, p);
  }

  /** Всем пользователям (для объявлений/акций). */
  async createForAll(p: NotifyPayload) {
    const users = await this.userRepo.find({ select: ['id'] as any });
    await this.createForUsers(users.map((u) => u.id), p);
  }

  /** Всем администраторам/владельцам (напр. новый тикет). */
  async createForAdmins(p: NotifyPayload) {
    const admins = await this.userRepo.find({
      where: [{ role: UserRole.ADMIN }, { role: UserRole.OWNER }],
      select: ['id'] as any,
    });
    await this.createForUsers(admins.map((a) => a.id), p);
  }

  async list(userId: string, limit = 30, before?: string) {
    const where: any = { userId };
    if (before) where.createdAt = LessThan(new Date(before));
    return this.repo.find({ where, order: { createdAt: 'DESC' }, take: Math.min(limit, 50) });
  }

  async unreadCount(userId: string) {
    return this.repo.count({ where: { userId, isRead: false } });
  }

  async markRead(userId: string, id: string) {
    await this.repo.update({ id, userId }, { isRead: true });
    return { ok: true };
  }

  async markAllRead(userId: string) {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
    return { ok: true };
  }

  // ─── Telegram привязка ───
  genLinkToken(userId: string): string {
    const token = randomBytes(12).toString('hex');
    this.linkTokens.set(token, { userId, exp: Date.now() + 15 * 60 * 1000 });
    return token;
  }

  private async resolveLink(token: string, tgId: string): Promise<boolean> {
    const e = this.linkTokens.get(token);
    if (!e || e.exp < Date.now()) return false;
    this.linkTokens.delete(token);
    await this.userRepo.update({ id: e.userId }, { telegramUserId: tgId, notifyTelegram: true });
    return true;
  }
}
