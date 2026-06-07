import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Subscription, SubscriptionStatus } from '../database/entities/subscription.entity';
import { UserProduct, UserProductStatus } from '../database/entities/user-product.entity';
import { PartnerChannel } from '../database/entities/partner-channel.entity';
import { ExpiryReminder } from '../database/entities/expiry-reminder.entity';
import { TelegramMainService } from '../telegram/telegram-main.service';

@Injectable()
export class ExpiryService {
  private readonly logger = new Logger(ExpiryService.name);

  constructor(
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(UserProduct) private userProductRepo: Repository<UserProduct>,
    @InjectRepository(PartnerChannel) private channelRepo: Repository<PartnerChannel>,
    @InjectRepository(ExpiryReminder) private reminderRepo: Repository<ExpiryReminder>,
    private telegram: TelegramMainService,
  ) {}

  // ─── 1. Пометка истёкших (ежедневно в 5:30 UTC, до дайджеста) ──────────────
  @Cron('30 5 * * *')
  async markExpired() {
    const now = new Date();
    try {
      const s = await this.subRepo.update(
        { status: SubscriptionStatus.ACTIVE, expiresAt: LessThan(now) },
        { status: SubscriptionStatus.EXPIRED },
      );
      const p = await this.userProductRepo.update(
        { status: UserProductStatus.ACTIVE, expiresAt: LessThan(now) },
        { status: UserProductStatus.EXPIRED },
      );
      // Партнёрские каналы: статуса нет, гасим isActive
      const c = await this.channelRepo.update(
        { isActive: true, expiresAt: LessThan(now) },
        { isActive: false },
      );
      this.logger.log(`Expiry: subs=${s.affected ?? 0}, products=${p.affected ?? 0}, channels=${c.affected ?? 0}`);
    } catch (e) {
      this.logger.error(`markExpired error: ${e.message}`);
      await this.telegram.sendMessage(`❗ Ошибка крона истечения: ${e.message}`).catch(() => {});
    }
  }

  // ─── 2. Дайджест просрочек в техчат (время из .env, по умолчанию 6:00 UTC) ──
  @Cron(process.env.EXPIRY_DIGEST_CRON || '0 6 * * *')
  async sendExpiryDigest() {
    try {
      const stages: { key: string; label: string; daysAhead: number }[] = [
        { key: 'd3', label: 'через 3 дня', daysAhead: 3 },
        { key: 'd1', label: 'завтра', daysAhead: 1 },
        { key: 'd0', label: 'сегодня', daysAhead: 0 },
      ];

      const lines: string[] = [];

      for (const stage of stages) {
        const { start, end } = this.dayWindow(stage.daysAhead);

        // Подписки
        const subs = await this.subRepo.find({
          where: { status: SubscriptionStatus.ACTIVE, expiresAt: Between(start, end) },
          relations: ['user', 'plan'],
        });
        for (const s of subs) {
          if (await this.alreadyNotified('subscription', s.id, stage.key)) continue;
          lines.push(`📋 Подписка «${s.plan?.name || s.planId}» — ${s.user?.email || s.userId} — истекает ${stage.label}`);
          await this.markNotified('subscription', s.id, stage.key);
        }

        // Продукты (индикаторы/каналы)
        const prods = await this.userProductRepo.find({
          where: { status: UserProductStatus.ACTIVE, expiresAt: Between(start, end) },
          relations: ['user', 'product'],
        });
        for (const p of prods) {
          if (await this.alreadyNotified('user_product', p.id, stage.key)) continue;
          lines.push(`🛍 Продукт «${p.product?.name || p.shopProductId}» — ${p.user?.email || p.userId} — истекает ${stage.label}`);
          await this.markNotified('user_product', p.id, stage.key);
        }

        // Партнёрские каналы
        const channels = await this.channelRepo.find({
          where: { isActive: true, expiresAt: Between(start, end) },
          relations: ['partner', 'partner.user'],
        });
        for (const c of channels) {
          if (await this.alreadyNotified('partner_channel', c.id, stage.key)) continue;
          const who = c.partner?.user?.email || c.partnerId;
          lines.push(`📡 Канал партнёра «${c.name}» — ${who} — истекает ${stage.label}`);
          await this.markNotified('partner_channel', c.id, stage.key);
        }
      }

      if (lines.length) {
        // Бьём на части, чтобы не упереться в лимит длины сообщения Telegram
        const header = `⏰ Сводка по истечению доступов (${new Date().toISOString().slice(0, 10)})\n\n`;
        const chunks = this.chunk(lines, 30);
        for (let i = 0; i < chunks.length; i++) {
          const prefix = i === 0 ? header : '';
          await this.telegram.sendMessage(prefix + chunks[i].join('\n'));
        }
      } else {
        this.logger.log('Expiry digest: ничего не истекает в ближайшие окна');
      }
    } catch (e) {
      this.logger.error(`sendExpiryDigest error: ${e.message}`);
      await this.telegram.sendMessage(`❗ Ошибка дайджеста истечения: ${e.message}`).catch(() => {});
    }
  }

  // Окно суток для «через N дней» (по UTC)
  private dayWindow(daysAhead: number) {
    const base = new Date();
    base.setUTCHours(0, 0, 0, 0);
    const start = new Date(base.getTime() + daysAhead * 86400000);
    const end = new Date(start.getTime() + 86400000 - 1);
    return { start, end };
  }

  private async alreadyNotified(entityType: string, entityId: string, stage: string): Promise<boolean> {
    const existing = await this.reminderRepo.findOne({ where: { entityType, entityId, stage } });
    return !!existing;
  }

  private async markNotified(entityType: string, entityId: string, stage: string) {
    try {
      await this.reminderRepo.save(this.reminderRepo.create({ entityType, entityId, stage }));
    } catch {
      // уникальный индекс мог сработать при гонке — не критично
    }
  }

  private chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }
}
