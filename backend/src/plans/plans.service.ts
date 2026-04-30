import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan, PlanType } from '../database/entities/plan.entity';

@Injectable()
export class PlansService implements OnModuleInit {
  constructor(@InjectRepository(Plan) private planRepo: Repository<Plan>) {}

  // Сидируем дефолтные тарифы при старте
  async onModuleInit() {
    const count = await this.planRepo.count();
    if (count > 0) return;

    await this.planRepo.save([
      {
        type: PlanType.START, name: 'START', price: 49, sortOrder: 1,
        description: 'Базовый пакет для старта в трейдинге',
        features: ['Сигналы UpDown Crypto', 'AI-аналитика по сигналам', 'Чат сообщества + PnL', 'Table Predictor'],
        hasSignalsCrypto: true, hasAiAnalytics: true, hasTablePredictor: true, hasCommunity: true,
      },
      {
        type: PlanType.PRO, name: 'PRO', price: 99, sortOrder: 2,
        description: 'Профессиональный набор инструментов',
        features: ['Всё из START', 'Strong Levels Finder', 'Liquidity Zones', 'Фандинг-алерты', 'Поддержка трейдеров', 'Копитрейдинг', 'Онлайн-разборы'],
        hasSignalsCrypto: true, hasAiAnalytics: true, hasTablePredictor: true, hasCommunity: true,
        hasStrongLevels: true, hasLiquidityZones: true, hasCopytrading: true, hasSupport: true, hasEducation: true,
      },
      {
        type: PlanType.ELITE, name: 'ELITE', price: 149, sortOrder: 3,
        description: 'Максимальный доступ ко всей экосистеме',
        features: ['Всё из PRO', 'Pump & MM Targets', 'Полный копитрейдинг', 'Бесплатные онлайн-разборы', 'Обучение стратегии'],
        hasSignalsCrypto: true, hasSignalsForex: true, hasAiAnalytics: true, hasTablePredictor: true,
        hasCommunity: true, hasStrongLevels: true, hasLiquidityZones: true, hasPumpMM: true,
        hasCopytrading: true, hasSupport: true, hasEducation: true, hasFibonacci: true,
      },
    ]);
  }

  findAll() {
    return this.planRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
  }

  findOne(id: string) {
    return this.planRepo.findOne({ where: { id } });
  }

  // Для админа — создать/обновить тариф
  async upsert(data: Partial<Plan>) {
    return this.planRepo.save(data);
  }
}
