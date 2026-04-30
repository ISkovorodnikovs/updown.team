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
}