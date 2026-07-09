import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ChannelAccess, ChannelAccessStatus } from '../database/entities/channel-access.entity';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { TelegramMainService } from '../telegram/telegram-main.service';

@Injectable()
export class ChannelAccessService implements OnModuleInit {
  private readonly logger = new Logger('ChannelAccess');

  constructor(
    @InjectRepository(ChannelAccess) private repo: Repository<ChannelAccess>,
    private telegram: TelegramMainService,
  ) {}

  onModuleInit() {
    // Трекинг вступлений по инвайт-ссылкам
    this.telegram.onChatMember((chatId, tgUserId, inviteLink, status) =>
      this.onChatMember(chatId, tgUserId, inviteLink, status),
    );
  }

  /**
   * Вернуть постоянную инвайт-ссылку для (пользователь, канал), создав её при
   * первом обращении. Переиспользуется между перезапусками (1 доступ = 1 ссылка).
   */
  async getOrCreateLink(
    userId: string,
    product: Pick<ShopProduct, 'id' | 'telegramChatId'>,
    expiresAt: Date,
    email?: string,
  ): Promise<ChannelAccess | null> {
    if (!product?.telegramChatId) return null;

    let acc = await this.repo.findOne({ where: { userId, shopProductId: product.id } });

    if (acc) {
      let changed = false;

      if (acc.status !== ChannelAccessStatus.ACTIVE) {
        // Повторная выдача (новая оплата после истечения/кика):
        // старая одноразовая ссылка уже потрачена → генерируем свежую и сбрасываем вступление.
        acc.status = ChannelAccessStatus.ACTIVE;
        if (acc.joinedTelegramUserId) await this.telegram.unban(acc.telegramChatId, acc.joinedTelegramUserId);
        const link = await this.telegram.createChatInviteLink(product.telegramChatId, expiresAt, acc.inviteLinkName || email);
        if (link) acc.inviteLink = link;
        acc.joinedTelegramUserId = null;
        acc.joinedAt = null;
        acc.expiresAt = expiresAt;
        changed = true;
      } else {
        // Тот же активный период: продлеваем срок, ссылку НЕ меняем (1 ссылка = 1 период).
        if (expiresAt && new Date(acc.expiresAt).getTime() < new Date(expiresAt).getTime()) {
          acc.expiresAt = expiresAt;
          changed = true;
        }
        // Если ссылка ранее не создалась (напр. бот тогда не был админом) — пробуем сейчас.
        if (!acc.inviteLink) {
          const link = await this.telegram.createChatInviteLink(product.telegramChatId, acc.expiresAt, acc.inviteLinkName || email);
          if (link) { acc.inviteLink = link; changed = true; }
        }
      }

      if (changed) await this.repo.save(acc);
      return acc;
    }

    // Новая ссылка
    const name = (email || '').slice(0, 32);
    const link = await this.telegram.createChatInviteLink(product.telegramChatId, expiresAt, name);
    if (!link) return null;

    acc = this.repo.create({
      userId,
      shopProductId: product.id,
      telegramChatId: product.telegramChatId,
      inviteLink: link,
      inviteLinkName: name,
      expiresAt,
      status: ChannelAccessStatus.ACTIVE,
    });
    try {
      return await this.repo.save(acc);
    } catch {
      // гонка/дубликат по (userId, shopProductId) — вернём существующую запись
      return this.repo.findOne({ where: { userId, shopProductId: product.id } });
    }
  }

  /** chat_member: зафиксировать, кто вступил по нашей ссылке. */
  private async onChatMember(chatId: string, tgUserId: string, inviteLink: string | null, status: string) {
    // 1) Вступил по нашей ссылке — фиксируем
    if (status === 'member') {
      if (!inviteLink) return;
      const acc = await this.repo.findOne({ where: { inviteLink } });
      if (!acc) return;
      acc.joinedTelegramUserId = tgUserId;
      acc.joinedAt = new Date();
      await this.repo.save(acc);
      this.logger.log(`join tracked: user=${acc.userId} product=${acc.shopProductId} tg=${tgUserId}`);
      return;
    }

    // 2) Вышел/удалён/забанен — если доступ ещё активен, это преждевременное удаление:
    //    unban + свежая ссылка, чтобы человек мог зайти снова (без «ссылка недействительна»).
    if (status === 'left' || status === 'kicked' || status === 'banned') {
      const acc = await this.repo.findOne({
        where: { telegramChatId: chatId, joinedTelegramUserId: tgUserId },
      });
      if (!acc) return;
      const now = Date.now();
      const stillActive = acc.status === ChannelAccessStatus.ACTIVE && new Date(acc.expiresAt).getTime() > now;
      if (!stillActive) return; // истёкший доступ — это наш плановый кик, ничего не делаем

      await this.telegram.unban(chatId, tgUserId);
      const link = await this.telegram.createChatInviteLink(chatId, acc.expiresAt, acc.inviteLinkName);
      if (link) acc.inviteLink = link;
      acc.joinedTelegramUserId = null;
      acc.joinedAt = null;
      await this.repo.save(acc);
      this.logger.log(`premature removal recovered: user=${acc.userId} product=${acc.shopProductId} (fresh link)`);
    }
  }

  /** Кик истёкших доступов (ban+unban). Вызывается кроном истечения. */
  async kickExpired(): Promise<number> {
    const now = new Date();
    const expired = await this.repo.find({
      where: { status: ChannelAccessStatus.ACTIVE, expiresAt: LessThan(now) },
    });
    let kicked = 0;
    for (const acc of expired) {
      if (acc.joinedTelegramUserId) {
        const ok = await this.telegram.kickUser(acc.telegramChatId, acc.joinedTelegramUserId);
        if (ok) { acc.status = ChannelAccessStatus.KICKED; kicked++; }
        else acc.status = ChannelAccessStatus.EXPIRED;
      } else {
        acc.status = ChannelAccessStatus.EXPIRED;
      }
      await this.repo.save(acc);
      await new Promise((r) => setTimeout(r, 50)); // пейсинг под лимиты Telegram
    }
    if (kicked) this.logger.log(`kicked ${kicked} expired channel members`);
    return kicked;
  }
}
