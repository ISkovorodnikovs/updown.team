import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import { DailySignal } from '../database/entities/daily-signal.entity';
import { parseSignal } from './signals-parser';

const TG_API = 'https://api.telegram.org';

@Injectable()
export class SignalsService implements OnModuleInit {
  private readonly logger = new Logger(SignalsService.name);
  private webhookSecret: string | null = null;

  constructor(
    private config: ConfigService,
    @InjectRepository(DailySignal) private signalRepo: Repository<DailySignal>,
  ) {}

  // Регистрируем webhook для SIGNALS_BOT при старте
  async onModuleInit() {
    const token = this.config.get<string>('SIGNALS_BOT');
    const backendUrl = this.config.get<string>('BACKEND_URL');
    if (!token || !backendUrl) {
      this.logger.warn('[Signals] SIGNALS_BOT или BACKEND_URL не заданы — webhook не активен');
      return;
    }
    this.webhookSecret = crypto.createHash('sha256').update(token).digest('hex').slice(0, 32);
    const url = `${backendUrl}/api/signals/webhook`;
    try {
      const { data } = await axios.post(`${TG_API}/bot${token}/setWebhook`, {
        url,
        secret_token: this.webhookSecret,
        allowed_updates: ['message', 'channel_post'],
        drop_pending_updates: true,
      }, { timeout: 10000 });
      if (data.ok) this.logger.log(`[Signals] webhook set → ${url}`);
      else this.logger.error(`[Signals] setWebhook failed: ${data.description}`);
    } catch (e) {
      this.logger.error(`[Signals] setWebhook error: ${e.message}`);
    }
  }

  getWebhookSecret() {
    return this.webhookSecret;
  }

  // Парсим SIGNAL_TOPICS вида "11:XAU,4237:BTC" → [{ topicId, label }]
  getTopics(): { topicId: string; label: string }[] {
    const raw = this.config.get<string>('SIGNAL_TOPICS') || '';
    return raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const [topicId, label] = p.split(':');
        return { topicId: (topicId || '').trim(), label: (label || '').trim() };
      })
      .filter((t) => t.topicId);
  }

  // Начало текущего окна 5:00 UTC. Если сейчас раньше 5:00 — окно началось вчера в 5:00.
  getCurrentWindowStart(now = new Date()): Date {
    const w = new Date(now);
    w.setUTCHours(5, 0, 0, 0);
    if (now.getUTCHours() < 5) {
      w.setUTCDate(w.getUTCDate() - 1);
    }
    return w;
  }

  // Текущий сигнал дня по топику (за текущее окно)
  async getCurrentForTopic(topicId: string): Promise<DailySignal | null> {
    const windowStart = this.getCurrentWindowStart();
    return this.signalRepo.findOne({ where: { topicId, windowStart } });
  }

  // Для фронта: по всем настроенным топикам — текущий сигнал дня (или пусто)
  async getCurrentSignals() {
    const topics = this.getTopics();
    const windowStart = this.getCurrentWindowStart();
    const result = [];
    for (const t of topics) {
      const signal = await this.signalRepo.findOne({
        where: { topicId: t.topicId, windowStart },
      });
      result.push({
        topicId: t.topicId,
        label: t.label,
        windowStart,
        signal: signal || null,
      });
    }
    return result;
  }

  // ─── Приём апдейтов от SIGNALS_BOT (webhook) ────────────────────────────────
  async handleUpdate(secretHeader: string, update: any): Promise<void> {
    if (!this.webhookSecret || secretHeader !== this.webhookSecret) {
      this.logger.warn('[Signals] webhook: неверный secret_token');
      return;
    }

    const msg = update.message || update.channel_post;
    if (!msg) return;

    // Только наша группа сигналов
    const signalsChat = this.config.get<string>('SIGNALS_CHAT');
    if (signalsChat && String(msg.chat?.id) !== String(signalsChat)) return;

    // Топик = message_thread_id; берём только настроенные топики
    const topicId = msg.message_thread_id != null ? String(msg.message_thread_id) : null;
    if (!topicId) return;
    const topics = this.getTopics();
    const topic = topics.find((t) => t.topicId === topicId);
    if (!topic) return; // не наш топик

    const text = msg.text || msg.caption || '';

    // В 2.2 обрабатываем только ИСХОДНЫЙ сигнал.
    // Reply-отработки (TP/SL/закрытие) — в 2.3.
    if (msg.reply_to_message) return;

    try {
      await this.captureSignal(topic, msg, text);
    } catch (e) {
      this.logger.error(`[Signals] capture error: ${e.message}`);
    }
  }

  // Первый сигнал в окне становится «сигналом дня» для топика
  private async captureSignal(
    topic: { topicId: string; label: string },
    msg: any,
    text: string,
  ) {
    const parsed = parseSignal(text);
    if (!parsed.isSignal) return; // не сигнал (болтовня/реклама/прочее)

    const windowStart = this.getCurrentWindowStart();

    // Уже есть сигнал дня за это окно? Тогда ничего не делаем (берём ПЕРВЫЙ).
    const existing = await this.signalRepo.findOne({
      where: { topicId: topic.topicId, windowStart },
    });
    if (existing) return;

    const signalAt = msg.date ? new Date(msg.date * 1000) : new Date();

    const entity = this.signalRepo.create({
      topicId: topic.topicId,
      topicLabel: topic.label,
      symbol: parsed.symbol || null,
      direction: parsed.direction || null,
      windowStart,
      sourceMessageId: String(msg.message_id),
      signalAt,
      entryZone: parsed.entryZone || null,
      targets: parsed.targets || [],
      stopLoss: parsed.stopLoss || null,
      status: 'active',
      position: 'given',
      profitPercent: null,
      rawText: text.slice(0, 4000),
    });

    try {
      await this.signalRepo.save(entity);
      this.logger.log(`[Signals] сигнал дня зафиксирован: ${topic.label} ${parsed.symbol} ${parsed.direction}`);
    } catch (e) {
      // уникальный индекс мог сработать при гонке — это ок (первый уже записан)
      this.logger.warn(`[Signals] save race: ${e.message}`);
    }
  }
}
