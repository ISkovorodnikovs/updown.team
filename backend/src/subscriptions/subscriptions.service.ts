import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Subscription, SubscriptionStatus } from '../database/entities/subscription.entity';
import { Transaction, TransactionStatus } from '../database/entities/transaction.entity';
import { Plan } from '../database/entities/plan.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // Активные подписки пользователя
  async getMySubscriptions(userId: string) {
    return this.subRepo.find({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
      order: { expiresAt: 'DESC' },
    });
  }

  // Все подписки пользователя (история)
  async getMySubscriptionHistory(userId: string) {
    return this.subRepo.find({
      where: { userId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  // Транзакции пользователя
  async getMyTransactions(userId: string) {
    return this.txRepo.find({
      where: { userId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  // Проверка доступа к фиче
  async hasAccess(userId: string, feature: keyof Plan): Promise<boolean> {
    const now = new Date();
    const subs = await this.subRepo.find({
      where: { userId, status: SubscriptionStatus.ACTIVE, expiresAt: MoreThan(now) },
      relations: ['plan'],
    });
    return subs.some(s => s.plan[feature] === true);
  }

  // Получить текущий тариф (самый высокий активный)
  async getActivePlan(userId: string) {
    const now = new Date();
    const subs = await this.subRepo.find({
      where: { userId, status: SubscriptionStatus.ACTIVE, expiresAt: MoreThan(now) },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
    if (!subs.length) return null;
    // Возвращаем самый дорогой активный тариф
    return subs.sort((a, b) => Number(b.plan.price) - Number(a.plan.price))[0];
  }

  // === ADMIN: выдать подписку пользователю ===
  async grantSubscription(dto: {
    userId: string;
    planId: string;
    durationDays: number;
    grantedBy: string;
    notes?: string;
  }) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const plan = await this.planRepo.findOne({ where: { id: dto.planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    const startsAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + dto.durationDays);

    const sub = this.subRepo.create({
      userId: dto.userId,
      planId: dto.planId,
      status: SubscriptionStatus.ACTIVE,
      startsAt,
      expiresAt,
      grantedBy: dto.grantedBy,
      notes: dto.notes,
    });

    await this.subRepo.save(sub);

    // Запись транзакции (бесплатно от админа)
    await this.txRepo.save({
      userId: dto.userId,
      planId: dto.planId,
      amount: 0,
      currency: 'USDT',
      status: TransactionStatus.COMPLETED,
      description: `Выдано администратором на ${dto.durationDays} дней. ${dto.notes || ''}`,
    });

    return sub;
  }

  // === ADMIN: все подписки (для управления) ===
  async getAllSubscriptions(filters: { userId?: string; status?: string }) {
    const qb = this.subRepo.createQueryBuilder('sub')
      .leftJoinAndSelect('sub.plan', 'plan')
      .leftJoinAndSelect('sub.user', 'user')
      .orderBy('sub.createdAt', 'DESC');

    if (filters.userId) qb.andWhere('sub.userId = :uid', { uid: filters.userId });
    if (filters.status) qb.andWhere('sub.status = :status', { status: filters.status });

    const subs = await qb.getMany();
    // Убираем passwordHash
    return subs.map(s => ({ ...s, user: s.user ? { ...s.user, passwordHash: undefined } : null }));
  }

  // === Заглушка для оплаты через Heleket ===
  async initiatePayment(userId: string, planId: string) {
    const plan = await this.planRepo.findOne({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    // Создаём pending транзакцию
    const tx = await this.txRepo.save({
      userId,
      planId,
      amount: plan.price,
      currency: 'USDT',
      status: TransactionStatus.PENDING,
      description: `Оплата тарифа ${plan.name}`,
    });

    // TODO: интеграция с Heleket
    return {
      transactionId: tx.id,
      amount: plan.price,
      currency: 'USDT',
      status: 'pending',
      message: 'Оплата временно недоступна. Свяжитесь с поддержкой для активации тарифа.',
      // paymentUrl: 'https://heleket.com/pay/...' // будет после интеграции
    };
  }
}
