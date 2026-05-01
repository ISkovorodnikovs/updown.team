import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Transaction, TransactionStatus, TransactionType } from '../database/entities/transaction.entity';
import { User } from '../database/entities/user.entity';
import { Plan } from '../database/entities/plan.entity';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { ReferralEarning } from '../database/entities/referral-earning.entity';
import { Subscription, SubscriptionStatus } from '../database/entities/subscription.entity';
import { TelegramMainService } from '../telegram/telegram-main.service';

const REFERRAL_PERCENT = 20;

// Месяцы → скидка (базовая, если нет баннера)
const PERIOD_DISCOUNTS: Record<number, number> = { 1: 0, 3: 3, 6: 5, 12: 15 };

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private config: ConfigService,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(ShopProduct) private productRepo: Repository<ShopProduct>,
    @InjectRepository(ReferralEarning) private refEarningRepo: Repository<ReferralEarning>,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    private telegramService: TelegramMainService,
  ) {}

  // ─── Создать инвойс ────────────────────────────────────────────────────────

  async createInvoice(dto: {
    userId: string;
    type: TransactionType;
    planId?: string;
    shopProductId?: string;
    periodMonths?: number;
    bannerDiscountPercent?: number;
  }) {
    const { userId, type, planId, shopProductId, periodMonths = 1 } = dto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    let basePrice = 0;
    let description = '';

    if (type === TransactionType.SUBSCRIPTION && planId) {
      const plan = await this.planRepo.findOne({ where: { id: planId } });
      if (!plan) throw new BadRequestException('Plan not found');
      basePrice = Number(plan.price);
      description = `${plan.name} × ${periodMonths} мес.`;
    } else if ((type === TransactionType.INDICATOR || type === TransactionType.CHANNEL) && shopProductId) {
      const product = await this.productRepo.findOne({ where: { id: shopProductId } });
      if (!product) throw new BadRequestException('Product not found');
      basePrice = Number(product.price);
      description = `${product.name} × ${periodMonths} мес.`;
    } else {
      throw new BadRequestException('Invalid payment params');
    }

    // Считаем скидку: берём максимум из баннерной и периодной
    const periodDiscount = PERIOD_DISCOUNTS[periodMonths] ?? 0;
    const discountPercent = Math.max(periodDiscount, dto.bannerDiscountPercent ?? 0);
    const originalAmount = +(basePrice * periodMonths).toFixed(2);
    const amount = +(originalAmount * (1 - discountPercent / 100)).toFixed(2);

    const orderId = uuidv4();

    // Сохраняем pending транзакцию
    const tx = await this.txRepo.save(
      this.txRepo.create({
        userId,
        planId,
        shopProductId,
        amount,
        originalAmount,
        discountPercent,
        periodMonths,
        currency: 'USDT',
        status: TransactionStatus.PENDING,
        type,
        orderId,
        description,
      }),
    );

    // Генерируем ссылку Heleket
    const paymentUrl = await this.createHeleketInvoice(userId, amount, orderId, type);

    return { transactionId: tx.id, orderId, amount, originalAmount, discountPercent, paymentUrl };
  }

  // ─── Создать инвойс в Heleket ──────────────────────────────────────────────

  private async createHeleketInvoice(userId: string, amount: number, orderId: string, type: string): Promise<string> {
    const merchantId = this.config.get('MERCHANT_ID');
    const paymentApi = this.config.get('PAYMENT_API');

    if (!merchantId || !paymentApi) {
      this.logger.warn('MERCHANT_ID или PAYMENT_API не заданы — оплата недоступна');
      throw new BadRequestException('Платёжный сервис временно недоступен');
    }

    const data = {
      amount: amount.toString(),
      currency: 'USD',
      order_id: orderId,
      url_callback: `${this.config.get('BACKEND_URL', 'https://updown.team')}/api/payment/webhook`,
      additional_data: `${userId} ${type}`,
    };

    const jsonData = JSON.stringify(data);
    const base64Data = Buffer.from(jsonData).toString('base64');
    const sign = crypto.createHash('md5').update(base64Data + paymentApi).digest('hex');

    const response = await axios.post('https://api.heleket.com/v1/payment', data, {
      headers: { merchant: merchantId, sign, 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    return response.data?.result?.url;
  }

  // ─── Обработка вебхука ────────────────────────────────────────────────────

  async handleWebhook(body: any) {
    try {
      const data = { ...body };
      const receivedSign = data.sign;
      delete data.sign;

      // Верификация подписи
      const jsonData = JSON.stringify(data).replace(/\//g, '\\/');
      const base64Data = Buffer.from(jsonData).toString('base64');
      const paymentApi = this.config.get('PAYMENT_API');
      const expectedSign = crypto.createHash('md5').update(base64Data + paymentApi).digest('hex');

      if (expectedSign !== receivedSign) {
        this.logger.error(`❌ Heleket webhook: неверная подпись. order_id=${data.order_id}`);
        await this.telegramService.sendMessage(`❌ Heleket webhook: неверная подпись\norder_id: ${data.order_id}`);
        return { ok: false };
      }

      // Находим транзакцию
      const tx = await this.txRepo.findOne({
        where: { orderId: data.order_id },
        relations: ['user', 'plan'],
      });

      if (!tx) {
        this.logger.warn(`Webhook: транзакция не найдена order_id=${data.order_id}`);
        return { ok: true };
      }

      const status = data.status as TransactionStatus;
      await this.txRepo.update(tx.id, { status, webhookPayload: data });

      const userTag = `[${tx.user?.email || tx.userId}]`;

      if (status === TransactionStatus.PAID || status === TransactionStatus.PAID_OVER) {
        await this.onPaymentSuccess(tx, data);
        const emoji = status === TransactionStatus.PAID_OVER ? '💰+' : '✅';
        await this.telegramService.sendMessage(
          `${emoji} Оплата подтверждена\n👤 ${userTag}\n💵 ${tx.amount} USDT\n📦 ${tx.description || tx.type}\n🆔 ${tx.orderId}`,
        );
      } else if (status === TransactionStatus.WRONG_AMOUNT || status === TransactionStatus.WRONG_AMOUNT_WAITING) {
        await this.telegramService.sendMessage(
          `⚠️ Оплачено неверно (меньше)\n👤 ${userTag}\n💵 ожидалось ${tx.amount}, получено ${data.payment_amount ?? '?'}\n🆔 ${tx.orderId}`,
        );
      } else if ([TransactionStatus.FAILED, TransactionStatus.CANCEL, TransactionStatus.SYSTEM_FAIL].includes(status as any)) {
        await this.telegramService.sendMessage(
          `❌ Ошибка оплаты [${status}]\n👤 ${userTag}\n💵 ${tx.amount} USDT\n🆔 ${tx.orderId}`,
        );
      } else if (status === TransactionStatus.LOCKED) {
        await this.telegramService.sendMessage(
          `🔒 Средства заблокированы (AML)\n👤 ${userTag}\n💵 ${tx.amount} USDT\n🆔 ${tx.orderId}`,
        );
      } else if (status === TransactionStatus.REFUND_PAID) {
        await this.telegramService.sendMessage(
          `↩️ Возврат выплачен\n👤 ${userTag}\n💵 ${tx.amount} USDT\n🆔 ${tx.orderId}`,
        );
      } else {
        // process, check, confirm_check — промежуточные
        this.logger.log(`Heleket webhook: статус ${status} для ${tx.orderId}`);
      }

      return { ok: true };
    } catch (e) {
      this.logger.error('Webhook error:', e.message);
      await this.telegramService.sendMessage(`❗ Ошибка обработки webhook Heleket: ${e.message}`);
      throw e;
    }
  }

  // ─── Активация после успешной оплаты ─────────────────────────────────────

  private async onPaymentSuccess(tx: Transaction, webhookData: any) {
    const periodMonths = tx.periodMonths || 1;
    const durationDays = periodMonths * 30;

    if (tx.type === TransactionType.SUBSCRIPTION && tx.planId) {
      const startsAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      await this.subRepo.save(
        this.subRepo.create({
          userId: tx.userId,
          planId: tx.planId,
          status: SubscriptionStatus.ACTIVE,
          startsAt,
          expiresAt,
          grantedBy: 'payment',
          notes: `Heleket order ${tx.orderId}`,
        }),
      );
    }
    // TODO: для indicator/channel — аналогичная логика когда появится UserProduct entity

    // Начисляем реферальный бонус
    await this.processReferralBonus(tx);
  }

  // ─── Реферальный бонус ────────────────────────────────────────────────────

  async processReferralBonus(tx: Transaction, customPercent?: number) {
    if (tx.type !== TransactionType.SUBSCRIPTION) return;

    const user = tx.user || await this.userRepo.findOne({ where: { id: tx.userId } });
    if (!user?.referredBy) return;

    const referrer = await this.userRepo.findOne({ where: { id: user.referredBy } });
    if (!referrer) return;

    const percent = customPercent ?? REFERRAL_PERCENT;
    const bonusAmount = +(Number(tx.amount) * percent / 100).toFixed(2);

    await this.refEarningRepo.save(
      this.refEarningRepo.create({
        referrerId: referrer.id,
        fromUserId: tx.userId,
        sourceTransactionId: tx.id,
        amount: bonusAmount,
        percent,
        isManual: false,
      }),
    );

    await this.userRepo.update(referrer.id, {
      referralBalance: () => `"referralBalance" + ${bonusAmount}`,
    });

    this.logger.log(`💰 Реферальный бонус ${bonusAmount} USDT → ${referrer.email}`);
  }
  // ─── Каждый час помечать pending транзакции старше 3 часов как cancel ──────
  @Cron(CronExpression.EVERY_HOUR)
  async expireStalePendingTransactions() {
    const cutoff = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 часа назад
    const stale = await this.txRepo.find({
      where: {
        status: TransactionStatus.PENDING,
        createdAt: LessThan(cutoff),
      },
    });

    if (!stale.length) return;

    for (const tx of stale) {
      await this.txRepo.update(tx.id, { status: TransactionStatus.CANCEL });
    }

    this.logger.log(`⏱ Expired ${stale.length} stale pending transactions`);
  }
}
