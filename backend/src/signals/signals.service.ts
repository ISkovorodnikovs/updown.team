import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignalsDbService } from '../analytics/signals-db.service';

// «Актуальный сигнал от индикатора AiView» + бегущая лента закрытых.
// Источник — внешняя база поставщика signals_db (read-only). Никакого Telegram.
@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  // Простой in-memory кэш (TTL из .env SIGNALS_CACHE_TTL, сек; по умолчанию 60)
  private cache: { data: any; expires: number } | null = null;

  constructor(
    private config: ConfigService,
    private signalsDb: SignalsDbService,
  ) {}

  private get groupId(): string {
    // Группа, по которой собираем ленту и ищем темы (SIGNALS_CHAT)
    return this.config.get<string>('SIGNALS_CHAT') || '';
  }

  private get cacheTtlMs(): number {
    const sec = parseInt(this.config.get<string>('SIGNALS_CACHE_TTL', '60'), 10);
    return (isNaN(sec) ? 60 : sec) * 1000;
  }

  // SIGNAL_TOPICS="11:XAU,4513:BTC" → [{ topicId, label }]
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

  // Биржевой символ → красивый вид: BINANCE:BTCUSDT.P → BTC/USDT, VANTAGE:XAUUSD → XAU/USD
  private prettySymbol(symbol: string): string {
    if (!symbol) return '';
    const afterColon = symbol.includes(':') ? symbol.split(':')[1] : symbol;
    const clean = afterColon.replace(/\.P$/i, ''); // убираем суффикс перпетуала
    // XAUUSD → XAU/USD, BTCUSDT → BTC/USDT
    if (/USDT$/i.test(clean)) return clean.replace(/USDT$/i, '/USDT');
    if (/USD$/i.test(clean)) return clean.replace(/USD$/i, '/USD');
    return clean;
  }

  // reachedTargets {0,1,2,3} → position "tp4" (индексы с нуля). Пусто → given.
  private positionFromReached(reached: number[] | null, status: string, closePrice: number | null): string {
    const arr = Array.isArray(reached) ? reached : [];
    if (arr.length > 0) {
      const maxIdx = Math.max(...arr);
      return `tp${maxIdx + 1}`;
    }
    if (status === 'closed') {
      // закрыт без достигнутых TP — вероятно по стопу/противоположному
      return closePrice != null ? 'closed_opposite' : 'given';
    }
    return 'given';
  }

  // Преобразуем строку из signals_db в формат для фронта
  private mapRow(row: any) {
    const targets = Array.isArray(row.profitTargets)
      ? row.profitTargets.map((t: any) => String(t))
      : [];
    return {
      symbol: this.prettySymbol(row.symbol),
      rawSymbol: row.symbol,
      direction: (row.direction || '').toLowerCase(),       // long / short
      timeframe: row.timeframe,                             // минуты
      entryZone: [row.entry1, row.entry2].filter((v) => v != null).join('-'),
      targets,
      stopLoss: row.stopLoss != null ? String(row.stopLoss) : null,
      status: row.status,                                   // active / closed
      position: this.positionFromReached(row.reachedTargets, row.status, row.closePrice),
      profitPercent: row.totalProfit != null ? `${Number(row.totalProfit).toFixed(2)}%` : null,
      closePrice: row.closePrice != null ? String(row.closePrice) : null,
      signalAt: row.createdAt,
      closedAt: row.closedAt,
    };
  }

  // Актуальный (самый свежий) сигнал по теме: channelMessages содержит ключ "<group>_<topic>"
  private async currentForTopic(topicId: string) {
    const key = `${this.groupId}_${topicId}`;
    const rows = await this.signalsDb.query(
      `SELECT * FROM "Signals"
       WHERE "channelMessages" ? $1
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      [key],
    );
    return rows.length ? this.mapRow(rows[0]) : null;
  }

  // Бегущая лента: последние 20 ЗАКРЫТЫХ сигналов нашей группы (по любому ключу группы)
  private async closedTape() {
    // Ключи нашей группы выглядят как "-100...."(сам канал) или "-100..._<topic>".
    // Матчим по префиксу ключа группы среди ключей jsonb channelMessages.
    const rows = await this.signalsDb.query(
      `SELECT * FROM "Signals"
       WHERE "status" = 'closed'
         AND EXISTS (
           SELECT 1 FROM jsonb_object_keys("channelMessages") AS k
           WHERE k = $1 OR k LIKE $2
         )
       ORDER BY "closedAt" DESC NULLS LAST
       LIMIT 20`,
      [this.groupId, `${this.groupId}\\_%`],
    );
    return rows.map((r: any) => ({
      symbol: this.prettySymbol(r.symbol),
      direction: (r.direction || '').toLowerCase(),
      profitPercent: r.totalProfit != null ? Number(r.totalProfit) : 0,
      closedAt: r.closedAt,
    }));
  }

  // Главный метод для фронта: актуальные сигналы по темам + лента. С кэшем.
  async getCurrentSignals() {
    if (this.cache && this.cache.expires > Date.now()) {
      return this.cache.data;
    }

    const topics = this.getTopics();
    const signals = [];
    for (const t of topics) {
      let signal = null;
      try {
        signal = await this.currentForTopic(t.topicId);
      } catch (e) {
        this.logger.error(`currentForTopic ${t.topicId} error: ${e.message}`);
      }
      signals.push({ topicId: t.topicId, label: t.label, signal });
    }

    let tape = [];
    try {
      tape = await this.closedTape();
    } catch (e) {
      this.logger.error(`closedTape error: ${e.message}`);
    }

    const data = { signals, tape, updatedAt: new Date().toISOString() };
    this.cache = { data, expires: Date.now() + this.cacheTtlMs };
    return data;
  }
}
