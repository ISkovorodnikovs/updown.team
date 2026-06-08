import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import { DailySignal } from '../database/entities/daily-signal.entity';
import { parseSignal, parseOutcome } from './signals-parser';

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
      // Логируем ТЕЛО ответа Telegram — там точная причина (description), а не только статус
      const tgError = e.response?.data
        ? JSON.stringify(e.response.data)
        : e.message;
      this.logger.error(`[Signals] setWebhook error: ${tgError}`);

      // Повторная попытка минимальным запросом (как ручной curl, который сработал)
      try {
        const { data } = await axios.post(`${TG_API}/bot${token}/setWebhook`, {
          url,
          secret_token: this.webhookSecret,
        }, { timeout: 10000 });
        if (data.ok) {
          this.logger.log(`[Signals] webhook set (retry, minimal) → ${url}`);
        } else {
          this.logger.error(`[Signals] setWebhook retry failed: ${data.description}`);
        }
      } catch (e2) {
        const tgError2 = e2.response?.data ? JSON.stringify(e2.response.data) : e2.message;
        this.logger.error(`[Signals] setWebhook retry error: ${tgError2}`);
      }
    }

    // В любом случае показываем фактическое состояние webhook
    await this.logWebhookInfo(token);
  }

  getWebhookSecret() {
    return this.webhookSecret;
  }

  // Диагностика: текущее состояние webhook у Telegram (видно в логах при старте)
  private async logWebhookInfo(token: string) {
    try {
      const { data } = await axios.get(`${TG_API}/bot${token}/getWebhookInfo`, { timeout: 8000 });
      if (data.ok) {
        const info = data.result;
        this.logger.log(
          `[Signals] webhookInfo: url=${info.url || '(none)'}, pending=${info.pending_update_count}, lastError=${info.last_error_message || '—'}`,
        );
      }
    } catch {}
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

    // Диагностика входящих апдейтов (видно в логах, помогает при отладке)
    this.logger.log(
      `[Signals] update: chat=${msg.chat?.id} thread=${msg.message_thread_id} ` +
      `reply=${msg.reply_to_message ? msg.reply_to_message.message_id : '-'} ` +
      `topicCreated=${msg.reply_to_message?.forum_topic_created ? 'yes' : 'no'}`,
    );

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

    // В форум-супергруппе у КАЖДОГО сообщения в топике есть reply_to_message,
    // указывающий на служебное сообщение создания топика (forum_topic_created).
    // Поэтому НЕЛЬЗЯ отсекать по самому факту reply.
    // Настоящая отработка = reply на РЕАЛЬНОЕ сообщение (не на создание топика).
    // В 2.2 обрабатываем только исходный сигнал; настоящие reply-отработки — 2.3.
    const replyTo = msg.reply_to_message;
    const isRealReply =
      replyTo &&
      !replyTo.forum_topic_created &&        // не псевдо-reply на создание топика
      replyTo.message_id !== msg.message_thread_id; // не корень топика

    if (isRealReply) {
      // Настоящий ответ — это отработка (TP / все цели / закрыт по противоположному)
      try {
        await this.applyOutcome(topic, replyTo.message_id, text);
      } catch (e) {
        this.logger.error(`[Signals] outcome error: ${e.message}`);
      }
      return;
    }

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

  // Применяем отработку (reply на исходное сообщение сигнала) к сигналу дня
  private async applyOutcome(
    topic: { topicId: string; label: string },
    repliedMessageId: number,
    text: string,
  ) {
    // Находим сигнал дня этого топика, чьё исходное сообщение = тому, на которое ответили
    const signal = await this.signalRepo.findOne({
      where: { topicId: topic.topicId, sourceMessageId: String(repliedMessageId) },
    });
    if (!signal) {
      // Отработка не на наш сигнал дня (или на сигнал прошлого окна) — игнор
      return;
    }
    if (signal.status === 'closed') {
      // Уже закрыт — больше не меняем
      return;
    }

    const outcome = parseOutcome(text);
    if (outcome.kind === 'none') return;

    const TP_ORDER = ['given', 'in_zone', 'tp1', 'tp2', 'tp3', 'tp4', 'tp5'];
    const rank = (pos: string) => {
      const i = TP_ORDER.indexOf(pos);
      return i === -1 ? 0 : i;
    };

    if (outcome.kind === 'tp' && outcome.tpNumber) {
      const newPos = `tp${outcome.tpNumber}`;
      // Применяем только если новый TP «дальше» текущего (без отката от дублей/гонки)
      if (rank(newPos) > rank(signal.position)) {
        signal.position = newPos;
        if (outcome.profitPercent) signal.profitPercent = outcome.profitPercent;
      }
      // status остаётся active — сигнал ещё в работе
    } else if (outcome.kind === 'all_targets') {
      signal.position = 'all_targets';
      signal.status = 'closed';
      if (outcome.profitPercent) signal.profitPercent = outcome.profitPercent;
    } else if (outcome.kind === 'closed_opposite') {
      signal.position = 'closed_opposite';
      signal.status = 'closed';
      if (outcome.profitPercent) signal.profitPercent = outcome.profitPercent;
    }

    await this.signalRepo.save(signal);
    this.logger.log(
      `[Signals] отработка: ${topic.label} ${signal.symbol} → ${signal.position} (${signal.status}) ${signal.profitPercent || ''}`,
    );
  }
}
