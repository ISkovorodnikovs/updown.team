import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySignal } from '../database/entities/daily-signal.entity';

@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  constructor(
    private config: ConfigService,
    @InjectRepository(DailySignal) private signalRepo: Repository<DailySignal>,
  ) {}

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
}
