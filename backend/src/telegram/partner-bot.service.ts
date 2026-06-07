import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import { Bot, BotStatus } from '../database/entities/bot.entity';
import { BotUser } from '../database/entities/bot-user.entity';
import { LinkClick } from '../database/entities/link-click.entity';
import { PartnerChannel } from '../database/entities/partner-channel.entity';
import { TelegramMainService } from './telegram-main.service';

const TG_API = 'https://api.telegram.org';

@Injectable()
export class PartnerBotService {
  private readonly logger = new Logger(PartnerBotService.name);

  constructor(
    private config: ConfigService,
    @InjectRepository(Bot) private botRepo: Repository<Bot>,
    @InjectRepository(BotUser) private botUserRepo: Repository<BotUser>,
    @InjectRepository(LinkClick) private clickRepo: Repository<LinkClick>,
    @InjectRepository(PartnerChannel) private channelRepo: Repository<PartnerChannel>,
    private telegramMain: TelegramMainService,
  ) {}

  // ─── Telegram API helpers (stateless, без polling-инстансов) ────────────────

  private async tg(token: string, method: string, payload: any) {
    const { data } = await axios.post(`${TG_API}/bot${token}/${method}`, payload, {
      timeout: 10000,
    });
    return data;
  }

  private async sendMessage(token: string, chatId: string | number, text: string, extra: any = {}) {
    return this.tg(token, 'sendMessage', { chat_id: chatId, text, ...extra });
  }

  // ─── Webhook lifecycle ──────────────────────────────────────────────────────

  // Включить webhook для бота: регистрируем URL в Telegram с секретом
  async startBot(bot: Bot): Promise<void> {
    const backendUrl = this.config.get('BACKEND_URL');
    if (!backendUrl) {
      await this.botRepo.update(bot.id, {
        status: BotStatus.ERROR,
        errorMessage: 'BACKEND_URL не задан — webhook невозможен',
      });
      throw new Error('BACKEND_URL is not configured');
    }

    // Секрет webhook (если ещё нет) — Telegram пришлёт его в заголовке
    let secret = bot.webhookSecret;
    if (!secret) {
      secret = crypto.randomBytes(24).toString('hex');
    }

    const url = `${backendUrl}/api/bots/webhook/${bot.id}`;

    try {
      const res = await this.tg(bot.token, 'setWebhook', {
        url,
        secret_token: secret,
        allowed_updates: ['message', 'callback_query'],
        drop_pending_updates: false,
      });
      if (!res.ok) throw new Error(res.description || 'setWebhook failed');

      await this.botRepo.update(bot.id, {
        status: BotStatus.RUNNING,
        errorMessage: null,
        webhookSecret: secret,
      });
      this.logger.log(`Bot ${bot.username || bot.id} webhook set → ${url}`);
    } catch (e) {
      await this.botRepo.update(bot.id, {
        status: BotStatus.ERROR,
        errorMessage: e.message,
      });
      throw e;
    }
  }

  // Выключить webhook
  async stopBot(botId: string): Promise<void> {
    const bot = await this.botRepo.findOne({ where: { id: botId } });
    if (!bot) return;
    try {
      await this.tg(bot.token, 'deleteWebhook', { drop_pending_updates: false });
    } catch (e) {
      this.logger.warn(`deleteWebhook failed for ${botId}: ${e.message}`);
    }
  }

  // ─── Обработка входящего webhook-апдейта ────────────────────────────────────

  async handleUpdate(botId: string, secretHeader: string, update: any): Promise<void> {
    const bot = await this.botRepo.findOne({ where: { id: botId } });
    if (!bot) return;

    // Верификация секрета — отбрасываем поддельные запросы
    if (!bot.webhookSecret || secretHeader !== bot.webhookSecret) {
      this.logger.warn(`Webhook ${botId}: неверный secret_token`);
      return;
    }

    try {
      if (update.message) {
        await this.onMessage(bot, update.message);
      } else if (update.callback_query) {
        await this.onCallback(bot, update.callback_query);
      }
    } catch (e) {
      this.logger.error(`Bot ${botId} update error: ${e.message}`);
    }
  }

  // Может ли бот отвечать этому пользователю (whitelist получателей)
  private isAllowed(bot: Bot, from: any): boolean {
    const list = bot.allowedRecipients || [];
    if (list.length === 0) return true; // пусто = всем
    const uid = String(from.id);
    const uname = from.username ? '@' + from.username.toLowerCase() : null;
    return list.some((entry) => {
      const e = String(entry).trim().toLowerCase();
      return e === uid || (uname && e === uname);
    });
  }

  private async onMessage(bot: Bot, msg: any) {
    const text = (msg.text || '').trim();
    const from = msg.from || {};
    const chatId = msg.chat.id;

    // Регистрация нового пользователя бота (по /start)
    if (text === '/start') {
      const existing = await this.botUserRepo.findOne({
        where: { botId: bot.id, telegramUserId: from.id },
      });
      if (!existing) {
        await this.botUserRepo.save({
          botId: bot.id,
          telegramUserId: from.id,
          username: from.username,
          firstName: from.first_name,
        });
        await this.botRepo.increment({ id: bot.id }, 'totalUsers', 1);
      }

      if (!this.isAllowed(bot, from)) {
        await this.sendMessage(bot.token, chatId, '👋 Привет! Бот настраивается партнёром.');
        return;
      }

      const keyboard = (bot.buttonUrls || []).map((btn, idx) => [
        { text: btn.label, callback_data: `link_${idx}` },
      ]);
      await this.sendMessage(bot.token, chatId, '👋 Добро пожаловать! Выберите действие:', {
        reply_markup: { inline_keyboard: keyboard },
      });
      return;
    }

    // Команды-помощники. Отвечаем только разрешённым.
    if (text.startsWith('/')) {
      if (!this.isAllowed(bot, from)) return;

      if (text === '/help') {
        await this.sendMessage(bot.token, chatId,
          'Доступные команды:\n/mychannels — мои каналы\n/stats — статистика за период\n/help — помощь');
        return;
      }
      if (text === '/mychannels') {
        await this.sendMyChannels(bot, chatId);
        return;
      }
      if (text === '/stats' || text.startsWith('/stats')) {
        await this.sendStats(bot, chatId);
        return;
      }
    }
  }

  private async onCallback(bot: Bot, query: any) {
    if (!query.data?.startsWith('link_')) {
      await this.tg(bot.token, 'answerCallbackQuery', { callback_query_id: query.id }).catch(() => {});
      return;
    }
    const idx = parseInt(query.data.replace('link_', ''));
    const button = (bot.buttonUrls || [])[idx];
    await this.tg(bot.token, 'answerCallbackQuery', { callback_query_id: query.id }).catch(() => {});
    if (!button) return;

    // Считаем только первый клик
    const exists = await this.clickRepo.findOne({
      where: { botId: bot.id, telegramUserId: query.from.id, buttonIndex: idx },
    });
    if (!exists) {
      await this.clickRepo.save({
        botId: bot.id,
        telegramUserId: query.from.id,
        buttonIndex: idx,
        url: button.url,
      });
      await this.botRepo.increment({ id: bot.id }, 'totalClicks', 1);
    }
    await this.sendMessage(bot.token, query.message.chat.id, `🔗 ${button.url}`);
  }

  // Список каналов партнёра (из нашей БД). Реальная аналитика — в Спринте 3.5.
  private async sendMyChannels(bot: Bot, chatId: string | number) {
    const channels = await this.channelRepo.find({ where: { partnerId: bot.partnerId } });
    if (!channels.length) {
      await this.sendMessage(bot.token, chatId, '📡 У вас пока нет подключённых каналов.');
      return;
    }
    const lines = channels.map((c) => {
      const exp = c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : '—';
      const active = c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date());
      return `• ${c.name} [${c.asset}/${c.timeframe}/${c.direction}] — ${active ? 'активен' : 'неактивен'}, до ${exp}`;
    });
    await this.sendMessage(bot.token, chatId, `📡 Ваши каналы:\n${lines.join('\n')}`);

    // Уведомляем админа, что партнёр запросил инфо (живое управление)
    await this.notifyAdminPartnerActivity(bot, 'запросил список каналов');
  }

  private async sendStats(bot: Bot, chatId: string | number) {
    // На первом этапе статистика подключается в Спринте 3.5 (прокси к signals_db).
    await this.sendMessage(bot.token, chatId,
      '📊 Статистика готовится. Подробные отчёты доступны в личном кабинете на платформе.');
    await this.notifyAdminPartnerActivity(bot, 'запросил статистику через бота');
  }

  private async notifyAdminPartnerActivity(bot: Bot, action: string) {
    await this.telegramMain.sendMessage(
      `🤝 Партнёр (bot @${bot.username || bot.id}) ${action}`,
    ).catch(() => {});
  }

  // ─── Рассылка (теперь stateless, по токену) ─────────────────────────────────

  async sendBroadcast(botId: string, message: string): Promise<{ sent: number; failed: number }> {
    const bot = await this.botRepo.findOne({ where: { id: botId } });
    if (!bot) return { sent: 0, failed: 0 };

    const users = await this.botUserRepo.find({ where: { botId } });
    let sent = 0;
    let failed = 0;
    for (const user of users) {
      try {
        await this.sendMessage(bot.token, user.telegramUserId.toString(), message);
        sent++;
        await new Promise((r) => setTimeout(r, 40)); // лимит Telegram
      } catch {
        failed++;
      }
    }
    return { sent, failed };
  }

  // Статус для UI: webhook-режим не держит инстанс, статус берём из БД
  isRunning(_botId: string): boolean {
    return false;
  }
}
