import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramMainService implements OnModuleInit {
  private readonly logger = new Logger(TelegramMainService.name);
  private bot: TelegramBot | null = null;
  private chatId: string | null = null;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const token = this.config.get<string>('MAIN_BOT_TOKEN');
    const chatId = this.config.get<string>('MAIN_BOT_CHAT_ID');

    if (!token) {
      this.logger.warn('[Telegram] MAIN_BOT_TOKEN not set — disabled');
      return;
    }
    if (!chatId) {
      this.logger.warn('[Telegram] MAIN_BOT_CHAT_ID not set — disabled');
      return;
    }

    try {
      this.bot = new TelegramBot(token, {
        polling: {
          params: {
            // ВАЖНО: Telegram ждёт allowed_updates как JSON-строку. Массив библиотека
            // кодирует как поля формы, и Telegram его игнорирует → chat_member не приходит.
            allowed_updates: JSON.stringify(['message', 'callback_query', 'chat_member', 'chat_join_request']) as any,
          },
        },
      });
      this.chatId = chatId;

      const me = await this.bot.getMe();
      this.logger.log(`[Telegram] ✅ Bot @${me.username} ready, chatId=${this.chatId}`);

      await this.sendMessage('🚀 UpDown сервер запущен');
    } catch (e) {
      this.logger.error(`[Telegram] ❌ Init failed: ${e.message}`);
      this.bot = null;
      this.chatId = null;
    }
  }

  async sendMessage(text: string): Promise<void> {
    if (!this.bot || !this.chatId) return;
    try {
      await this.bot.sendMessage(this.chatId, text);
      this.logger.log(`[Telegram] ✉️  ${text.slice(0, 80)}`);
    } catch (e) {
      this.logger.error(`[Telegram] ❌ Send failed: ${e.message}`);
    }
  }

  /** Отправить сообщение конкретному пользователю (по его telegram id). */
  async sendToUser(telegramUserId: string | number, text: string): Promise<boolean> {
    if (!this.bot || !telegramUserId) return false;
    try {
      await this.bot.sendMessage(telegramUserId, text);
      return true;
    } catch (e) {
      this.logger.warn(`[Telegram] user send failed (${telegramUserId}): ${e.message}`);
      return false;
    }
  }

  /** Username бота (для deep-link привязки), напр. "updown_bot". */
  async getBotUsername(): Promise<string | null> {
    if (!this.bot) return null;
    try {
      const me = await this.bot.getMe();
      return me.username || null;
    } catch {
      return null;
    }
  }

  /**
   * Подписаться на /start <token> для привязки Telegram к аккаунту сайта.
   * resolver(token, telegramUserId) должен вернуть true при успешной привязке.
   */
  onLinkStart(resolver: (token: string, telegramUserId: string) => Promise<boolean>) {
    if (!this.bot) return;
    this.bot.onText(/^\/start\s+(.+)$/, async (msg, match) => {
      const token = (match?.[1] || '').trim();
      const tgId = String(msg.from?.id || msg.chat?.id || '');
      if (!token || !tgId) return;
      try {
        const ok = await resolver(token, tgId);
        await this.bot.sendMessage(
          msg.chat.id,
          ok
            ? '✅ Telegram привязан. Теперь вы будете получать уведомления здесь.'
            : '⚠️ Ссылка недействительна или устарела. Откройте привязку в личном кабинете заново.',
        );
      } catch (e) {
        this.logger.warn(`[Telegram] link resolver failed: ${e.message}`);
      }
    });
  }

  /** Создать одноразовую инвайт-ссылку (member_limit=1) с опциональным сроком. */
  async createChatInviteLink(chatId: string, expireDate?: Date, name?: string): Promise<string | null> {
    if (!this.bot || !chatId) return null;
    try {
      const opts: any = { member_limit: 1 };
      if (expireDate) opts.expire_date = Math.floor(new Date(expireDate).getTime() / 1000);
      if (name) opts.name = String(name).slice(0, 32);
      const res: any = await this.bot.createChatInviteLink(chatId, opts);
      return res?.invite_link || null;
    } catch (e: any) {
      this.logger.warn(`[Telegram] createChatInviteLink failed (${chatId}): ${e.message}`);
      return null;
    }
  }

  /** Удалить пользователя из чата без «чёрного списка»: ban + сразу unban. */
  async kickUser(chatId: string, telegramUserId: string | number): Promise<boolean> {
    if (!this.bot || !chatId || !telegramUserId) return false;
    try {
      await this.bot.banChatMember(chatId, Number(telegramUserId));
      await this.bot.unbanChatMember(chatId, Number(telegramUserId), { only_if_banned: true } as any);
      return true;
    } catch (e: any) {
      this.logger.warn(`[Telegram] kick failed (${chatId}/${telegramUserId}): ${e.message}`);
      return false;
    }
  }

  /** Снять бан (перед повторной выдачей доступа). */
  async unban(chatId: string, telegramUserId: string | number): Promise<void> {
    if (!this.bot || !chatId || !telegramUserId) return;
    try {
      await this.bot.unbanChatMember(chatId, Number(telegramUserId), { only_if_banned: true } as any);
    } catch { /* игнорируем */ }
  }

  /** Статус пользователя в чате: 'member'/'administrator'/'creator'/'restricted'/'left'/'kicked' или null. */
  async getChatMemberStatus(chatId: string, telegramUserId: string | number): Promise<string | null> {
    if (!this.bot || !chatId || !telegramUserId) return null;
    try {
      const m: any = await this.bot.getChatMember(chatId, Number(telegramUserId));
      return m?.status || null;
    } catch {
      return null;
    }
  }

  /**
   * Подписка на chat_member-апдейты (кто вступил/вышел, по какой ссылке).
   * handler(chatId, telegramUserId, inviteLink, status).
   */
  onChatMember(handler: (chatId: string, telegramUserId: string, inviteLink: string | null, status: string) => Promise<void>) {
    if (!this.bot) return;
    this.bot.on('chat_member', async (u: any) => {
      try {
        const chatId = String(u?.chat?.id || '');
        const tgUserId = String(u?.new_chat_member?.user?.id || '');
        const inviteLink = u?.invite_link?.invite_link || null;
        const status = u?.new_chat_member?.status || '';
        if (chatId && tgUserId) await handler(chatId, tgUserId, inviteLink, status);
      } catch (e: any) {
        this.logger.warn(`[Telegram] chat_member handler failed: ${e.message}`);
      }
    });
  }
}