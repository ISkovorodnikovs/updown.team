import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as TelegramBot from 'node-telegram-bot-api';
import { Bot, BotStatus } from '../database/entities/bot.entity';
import { BotUser } from '../database/entities/bot-user.entity';
import { LinkClick } from '../database/entities/link-click.entity';

interface ActiveBot {
  instance: TelegramBot;
  botId: string;
}

@Injectable()
export class PartnerBotService {
  private readonly logger = new Logger(PartnerBotService.name);
  private activeBots: Map<string, ActiveBot> = new Map();

  constructor(
    @InjectRepository(Bot) private botRepo: Repository<Bot>,
    @InjectRepository(BotUser) private botUserRepo: Repository<BotUser>,
    @InjectRepository(LinkClick) private clickRepo: Repository<LinkClick>,
  ) {}

  async startBot(bot: Bot): Promise<void> {
    if (this.activeBots.has(bot.id)) {
      await this.stopBot(bot.id);
    }

    try {
      const instance = new TelegramBot(bot.token, { polling: true });
      this.activeBots.set(bot.id, { instance, botId: bot.id });

      instance.on('message', async (msg) => {
        if (msg.text === '/start') {
          await this.handleStart(bot.id, msg, instance);
        }
      });

      instance.on('callback_query', async (query) => {
        await this.handleCallback(bot.id, query, instance);
      });

      instance.on('polling_error', async (err) => {
        this.logger.error(`Bot ${bot.id} polling error: ${err.message}`);
        await this.botRepo.update(bot.id, {
          status: BotStatus.ERROR,
          errorMessage: err.message,
        });
      });

      await this.botRepo.update(bot.id, {
        status: BotStatus.RUNNING,
        errorMessage: null,
      });

      this.logger.log(`Bot ${bot.username || bot.id} started`);
    } catch (e) {
      await this.botRepo.update(bot.id, {
        status: BotStatus.ERROR,
        errorMessage: e.message,
      });
      throw e;
    }
  }

  async stopBot(botId: string): Promise<void> {
    const active = this.activeBots.get(botId);
    if (active) {
      try {
        await active.instance.stopPolling();
      } catch {}
      this.activeBots.delete(botId);
    }
  }

  private async handleStart(
    botId: string,
    msg: TelegramBot.Message,
    instance: TelegramBot,
  ) {
    const bot = await this.botRepo.findOne({ where: { id: botId } });
    if (!bot) return;

    // Register user if new
    const existing = await this.botUserRepo.findOne({
      where: { botId, telegramUserId: msg.from.id },
    });

    if (!existing) {
      await this.botUserRepo.save({
        botId,
        telegramUserId: msg.from.id,
        username: msg.from.username,
        firstName: msg.from.first_name,
      });
      await this.botRepo.increment({ id: botId }, 'totalUsers', 1);
    }

    // Send welcome message with inline keyboard
    const keyboard = bot.buttonUrls.map((btn, idx) => [
      {
        text: btn.label,
        callback_data: `link_${idx}`,
      },
    ]);

    await instance.sendMessage(
      msg.chat.id,
      `👋 Welcome! Choose a link below:`,
      {
        reply_markup: {
          inline_keyboard: keyboard,
        },
      },
    );
  }

  private async handleCallback(
    botId: string,
    query: TelegramBot.CallbackQuery,
    instance: TelegramBot,
  ) {
    const bot = await this.botRepo.findOne({ where: { id: botId } });
    if (!bot || !query.data?.startsWith('link_')) return;

    const idx = parseInt(query.data.replace('link_', ''));
    const button = bot.buttonUrls[idx];
    if (!button) return;

    await instance.answerCallbackQuery(query.id);

    // Track first click only
    const exists = await this.clickRepo.findOne({
      where: { botId, telegramUserId: query.from.id, buttonIndex: idx },
    });

    if (!exists) {
      await this.clickRepo.save({
        botId,
        telegramUserId: query.from.id,
        buttonIndex: idx,
        url: button.url,
      });
      await this.botRepo.increment({ id: botId }, 'totalClicks', 1);
    }

    await instance.sendMessage(query.message.chat.id, `🔗 ${button.url}`);
  }

  async sendBroadcast(botId: string, message: string): Promise<{ sent: number; failed: number }> {
    const active = this.activeBots.get(botId);
    if (!active) return { sent: 0, failed: 0 };

    const users = await this.botUserRepo.find({ where: { botId } });
    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        await active.instance.sendMessage(user.telegramUserId.toString(), message);
        sent++;
        // Rate limiting: 25 messages/second Telegram limit
        await new Promise((r) => setTimeout(r, 40));
      } catch {
        failed++;
      }
    }

    return { sent, failed };
  }

  isRunning(botId: string): boolean {
    return this.activeBots.has(botId);
  }
}
