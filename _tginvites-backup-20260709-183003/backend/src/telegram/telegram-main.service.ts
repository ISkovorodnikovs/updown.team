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
      this.bot = new TelegramBot(token, { polling: true });
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
}