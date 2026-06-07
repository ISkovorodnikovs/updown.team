import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '../database/entities/partner.entity';
import { PartnerChannel } from '../database/entities/partner-channel.entity';
import { SignalsDbService } from './signals-db.service';

const MAX_RANGE_DAYS_PARTNER = 92; // ~3 месяца — лимит для партнёра
const START_DEPOSIT = 1000;
const POS_VOLUME_PCT = 1;

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Partner) private partnerRepo: Repository<Partner>,
    @InjectRepository(PartnerChannel) private channelRepo: Repository<PartnerChannel>,
    private signalsDb: SignalsDbService,
  ) {}

  // ─── Отчёт для ПАРТНЁРА: только его каналы, период ≤ 3 мес ─────────────────
  async partnerReport(userId: string, signalsChannelId: string, dateFrom: string, dateTo: string) {
    const partner = await this.partnerRepo.findOne({ where: { userId } });
    if (!partner) throw new ForbiddenException('Not a partner');

    // Проверка принадлежности канала этому партнёру + активности
    const channel = await this.channelRepo.findOne({
      where: { partnerId: partner.id, signalsChannelId },
    });
    if (!channel) {
      throw new ForbiddenException('Этот канал вам не принадлежит или не подключён');
    }
    if (!channel.signalsChannelId) {
      throw new BadRequestException('Канал не настроен (нет signalsChannelId)');
    }

    this.validateRange(dateFrom, dateTo, MAX_RANGE_DAYS_PARTNER);
    return this.buildReport(signalsChannelId, dateFrom, dateTo);
  }

  // ─── Отчёт для АДМИНА: любой канал, любой период ───────────────────────────
  async adminReport(signalsChannelId: string, dateFrom: string, dateTo: string) {
    this.validateRange(dateFrom, dateTo, null);
    return this.buildReport(signalsChannelId, dateFrom, dateTo);
  }

  private validateRange(dateFrom: string, dateTo: string, maxDays: number | null) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new BadRequestException('Некорректные даты');
    }
    if (from > to) throw new BadRequestException('dateFrom позже dateTo');
    if (maxDays != null) {
      const days = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
      if (days > maxDays) {
        throw new BadRequestException(`Период не может превышать 3 месяца. Для большего — обратитесь напрямую.`);
      }
    }
  }

  // ─── Ядро отчёта (порт из программы поставщика, безопасный) ─────────────────
  private async buildReport(channelId: string, dateFrom: string, dateTo: string) {
    // channelId = ключ в jsonb "channelMessages"
    const sql = `
      SELECT s.*
      FROM "Signals" s
      WHERE s."channelMessages" ? $1
        AND (
              s."createdAt" BETWEEN $2::timestamptz AND $3::timestamptz
           OR s."closedAt"  BETWEEN $2::timestamptz AND $3::timestamptz
        )
      ORDER BY s."createdAt" ASC
    `;
    const signals = await this.signalsDb.query(sql, [channelId, dateFrom, dateTo]);

    // Running deposit + таблица
    let dep = START_DEPOSIT;
    const tableRows = signals.map((s: any) => {
      const totalProfitNum = parseFloat(s.totalProfit) || 0;
      const posVolumeUsdt = (POS_VOLUME_PCT / 100) * dep;
      const profitUsdt = posVolumeUsdt * (totalProfitNum / 100);
      const row = {
        createdAt: s.createdAt,
        closedAt: s.closedAt,
        symbol: s.symbol,
        direction: s.direction,
        timeframe: s.timeframe,
        status: s.status,
        reachedTargets: Array.isArray(s.reachedTargets) ? s.reachedTargets.length : 0,
        totalProfit: totalProfitNum,
        deposit: +dep.toFixed(2),
        posVolumeUsdt: +posVolumeUsdt.toFixed(2),
        profitUsdt: +profitUsdt.toFixed(2),
      };
      dep += profitUsdt;
      return row;
    });
    const finalDep = dep;

    // Статистика — из того же массива
    const totalDeals = signals.length;
    const closedProfit = signals.filter((s: any) => s.status === 'closed' && parseFloat(s.totalProfit) >= 0).length;
    const closedLoss = signals.filter((s: any) => s.status === 'closed' && parseFloat(s.totalProfit) < 0).length;
    const activeCount = signals.filter((s: any) => s.status === 'active').length;
    const winLossRatio = closedLoss === 0 ? null : +(closedProfit / closedLoss).toFixed(2);
    const longCount = signals.filter((s: any) => s.direction === 'LONG').length;
    const shortCount = signals.filter((s: any) => s.direction === 'SHORT').length;
    const tp = [0, 1, 2, 3, 4, 5].map((n) =>
      signals.filter((s: any) => (Array.isArray(s.reachedTargets) ? s.reachedTargets.length : 0) === n).length,
    );
    const roi = signals.reduce((sum: number, s: any) => sum + (parseFloat(s.totalProfit) || 0), 0);
    const pnl = ((finalDep - START_DEPOSIT) / START_DEPOSIT) * 100;

    return {
      channelId,
      period: { from: dateFrom, to: dateTo },
      stats: {
        totalDeals, closedProfit, closedLoss, activeCount,
        winLossRatio, longCount, shortCount, tp,
        roi: +roi.toFixed(2),
        pnl: +pnl.toFixed(2),
        finalDeposit: +finalDep.toFixed(2),
      },
      tableRows,
    };
  }
}
