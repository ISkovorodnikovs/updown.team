import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Transaction, TransactionStatus, TransactionType } from '../database/entities/transaction.entity';
import { TransactionItem } from '../database/entities/transaction-item.entity';
import { User } from '../database/entities/user.entity';
import { Plan } from '../database/entities/plan.entity';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { ReferralEarning } from '../database/entities/referral-earning.entity';
import { Subscription, SubscriptionStatus } from '../database/entities/subscription.entity';
import { UserProduct, UserProductStatus } from '../database/entities/user-product.entity';
import { PartnerChannel } from '../database/entities/partner-channel.entity';
import { Partner } from '../database/entities/partner.entity';
import { Banner, BannerTargetType } from '../database/entities/banner.entity';
import { TelegramMainService } from '../telegram/telegram-main.service';

const REFERRAL_PERCENT = 20;

// Месяцы → скидка (базовая, если нет баннера)
const PERIOD_DISCOUNTS: Record<number, number> = { 1: 0, 3: 3, 6: 5, 12: 15 };
const ALLOWED_PERIODS = [1, 3, 6, 12];

// Ценообразование white-label каналов
const CHANNEL_BASE_PRICE = 500;
const GOLD_SURCHARGE = 200;
const SCALP_SURCHARGE = 200;
const SCALP_TIMEFRAMES = ['M1', 'M3', 'M5', 'M10'];

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private config: ConfigService,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(TransactionItem) private txItemRepo: Repository<TransactionItem>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(ShopProduct) private productRepo: Repository<ShopProduct>,
    @InjectRepository(ReferralEarning) private refEarningRepo: Repository<ReferralEarning>,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(UserProduct) private userProductRepo: Repository<UserProduct>,
    @InjectRepository(PartnerChannel) private partnerChannelRepo: Repository<PartnerChannel>,
    @InjectRepository(Partner) private partnerRepo: Repository<Partner>,
    @InjectRepository(Banner) private bannerRepo: Repository<Banner>,
    private dataSource: DataSource,
    private telegramService: TelegramMainService,
  ) {}

  // ─── Расчёт цены одной позиции ─────────────────────────────────────────────

  /**
   * Серверный расчёт скидки баннера для данного типа позиции и периода.
   * Клиентское значение полностью игнорируется. Возвращает 0, если активного
   * применимого баннера нет. targetType баннера должен быть ALL или совпадать
   * с типом позиции (планы / индикаторы / каналы).
   */
  private async serverBannerDiscount(type: TransactionType, months: number): Promise<number> {
    const now = new Date();
    const banners = await this.bannerRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    const banner = banners.find((b) => b.isActive && (!b.endsAt || new Date(b.endsAt) > now));
    if (!banner) return 0;

    // Соответствие типа позиции и targetType баннера
    const map: Record<string, BannerTargetType> = {
      [TransactionType.SUBSCRIPTION]: BannerTargetType.PLANS,
      [TransactionType.INDICATOR]: BannerTargetType.INDICATORS,
      [TransactionType.CHANNEL]: BannerTargetType.CHANNELS,
    };
    const applies =
      banner.targetType === BannerTargetType.ALL || banner.targetType === map[type];
    if (!applies) return 0;

    // Скидка по периоду, иначе базовая; жёстко ограничиваем 0..90
    const pd = banner.periodDiscounts;
    const raw = pd && pd[months] != null ? Number(pd[months]) : Number(banner.discountPercent || 0);
    if (!Number.isFinite(raw) || raw <= 0) return 0;
    return Math.min(90, Math.max(0, raw));
  }

  private async priceLineItem(item: {
    type: TransactionType;
    planId?: string;
    shopProductId?: string;
    periodMonths?: number;
    bannerDiscountPercent?: number;
  }): Promise<{
    type: TransactionType;
    planId?: string;
    shopProductId?: string;
    periodMonths: number;
    amount: number;
    originalAmount: number;
    discountPercent: number;
    description: string;
  }> {
    const periodMonths = item.periodMonths ?? 1;
    if (!ALLOWED_PERIODS.includes(periodMonths)) {
      throw new BadRequestException('Invalid period. Allowed: 1, 3, 6, 12 months');
    }
    // ВНИМАНИЕ: скидку баннера НЕ берём из запроса клиента (это позволяло бы
    // указать любой процент и заплатить меньше). Считаем её на сервере ниже,
    // сверяясь с реально активным баннером и его targetType.

    let basePrice = 0;
    let description = '';

    if (item.type === TransactionType.SUBSCRIPTION && item.planId) {
      const plan = await this.planRepo.findOne({ where: { id: item.planId } });
      if (!plan) throw new BadRequestException('Plan not found');
      if (plan.isActive === false) throw new BadRequestException('Plan is not available');
      basePrice = Number(plan.price);
      description = `${plan.name} × ${periodMonths} мес.`;
    } else if (
      (item.type === TransactionType.INDICATOR || item.type === TransactionType.CHANNEL) &&
      item.shopProductId
    ) {
      const product = await this.productRepo.findOne({ where: { id: item.shopProductId } });
      if (!product) throw new BadRequestException('Product not found');
      if (product.isActive === false) throw new BadRequestException('Product is not available');
      basePrice = Number(product.price);
      description = `${product.name} × ${periodMonths} мес.`;
    } else {
      throw new BadRequestException('Invalid payment params');
    }

    // Скидка баннера — только серверная, из активного применимого баннера
    const bannerDiscount = await this.serverBannerDiscount(item.type, periodMonths);
    const periodDiscount = PERIOD_DISCOUNTS[periodMonths] ?? 0;
    const discountPercent = Math.max(periodDiscount, bannerDiscount);
    const originalAmount = +(basePrice * periodMonths).toFixed(2);
    const amount = +(originalAmount * (1 - discountPercent / 100)).toFixed(2);

    return {
      type: item.type,
      planId: item.planId,
      shopProductId: item.shopProductId,
      periodMonths,
      amount,
      originalAmount,
      discountPercent,
      description,
    };
  }

  // ─── Создать инвойс (одна позиция) ─────────────────────────────────────────

  async createInvoice(dto: {
    userId: string;
    type: TransactionType;
    planId?: string;
    shopProductId?: string;
    periodMonths?: number;
    bannerDiscountPercent?: number;
  }) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new BadRequestException('User not found');

    const line = await this.priceLineItem(dto);
    const orderId = uuidv4();

    const tx = await this.txRepo.save(
      this.txRepo.create({
        userId: dto.userId,
        planId: line.planId,
        shopProductId: line.shopProductId,
        amount: line.amount,
        originalAmount: line.originalAmount,
        discountPercent: line.discountPercent,
        periodMonths: line.periodMonths,
        currency: 'USDT',
        status: TransactionStatus.PENDING,
        type: line.type,
        orderId,
        description: line.description,
        isBatch: false,
      }),
    );

    const paymentUrl = await this.createHeleketInvoice(dto.userId, line.amount, orderId, line.type);

    return {
      transactionId: tx.id,
      orderId,
      amount: line.amount,
      originalAmount: line.originalAmount,
      discountPercent: line.discountPercent,
      paymentUrl,
    };
  }

  // ─── Создать батч-инвойс (вся корзина одной оплатой) ───────────────────────

  async createBatchInvoice(dto: {
    userId: string;
    items: Array<{
      type: TransactionType;
      planId?: string;
      shopProductId?: string;
      periodMonths?: number;
      bannerDiscountPercent?: number;
    }>;
  }) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new BadRequestException('User not found');

    if (!Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    if (dto.items.length > 20) {
      throw new BadRequestException('Too many items in cart');
    }
    // Если позиция одна — используем обычный инвойс (проще, без лишней сущности)
    if (dto.items.length === 1) {
      return this.createInvoice({ userId: dto.userId, ...dto.items[0] });
    }

    // Считаем все позиции
    const lines = [];
    for (const item of dto.items) {
      lines.push(await this.priceLineItem(item));
    }

    const totalAmount = +lines.reduce((sum, l) => sum + l.amount, 0).toFixed(2);
    const totalOriginal = +lines.reduce((sum, l) => sum + l.originalAmount, 0).toFixed(2);
    if (totalAmount <= 0) throw new BadRequestException('Invalid cart total');

    const orderId = uuidv4();
    const description = `Корзина: ${lines.length} поз. (${lines.map((l) => l.description).join('; ')})`.slice(0, 250);

    // Родительская транзакция + позиции (cascade сохранит items)
    const tx = await this.txRepo.save(
      this.txRepo.create({
        userId: dto.userId,
        amount: totalAmount,
        originalAmount: totalOriginal,
        currency: 'USDT',
        status: TransactionStatus.PENDING,
        type: TransactionType.SUBSCRIPTION, // тип родителя номинальный; реальные типы — в items
        orderId,
        description,
        isBatch: true,
        items: lines.map((l) =>
          this.txItemRepo.create({
            type: l.type,
            planId: l.planId,
            shopProductId: l.shopProductId,
            periodMonths: l.periodMonths,
            amount: l.amount,
            description: l.description,
          }),
        ),
      }),
    );

    const paymentUrl = await this.createHeleketInvoice(dto.userId, totalAmount, orderId, 'batch');

    return {
      transactionId: tx.id,
      orderId,
      amount: totalAmount,
      originalAmount: totalOriginal,
      itemsCount: lines.length,
      paymentUrl,
    };
  }

  // ─── Self-service оплата подключения партнёрского канала ────────────────────

  calcChannelPrice(asset: string, timeframe: string, discountPercent = 0) {
    let base = CHANNEL_BASE_PRICE;
    if (asset === 'gold') base += GOLD_SURCHARGE;
    if (SCALP_TIMEFRAMES.includes(timeframe)) base += SCALP_SURCHARGE;
    const final = +(base * (1 - (discountPercent || 0) / 100)).toFixed(2);
    return { base, final };
  }

  async createChannelInvoice(dto: {
    userId: string;
    name: string;
    asset?: string;
    timeframe?: string;
    direction?: string;
    durationMonths?: number;
  }) {
    const partner = await this.partnerRepo.findOne({ where: { userId: dto.userId } });
    if (!partner) throw new BadRequestException('Только партнёр может подключать каналы');

    const asset = dto.asset || 'crypto';
    const timeframe = dto.timeframe || 'M15';
    const direction = dto.direction || 'both';
    const months = ALLOWED_PERIODS.includes(dto.durationMonths || 1) ? (dto.durationMonths || 1) : 1;
    if (!dto.name || dto.name.length > 120) throw new BadRequestException('Некорректное название канала');

    const { final: monthly } = this.calcChannelPrice(asset, timeframe, 0);
    // Цена за период с учётом периодной скидки (как у тарифов)
    const periodDiscount = PERIOD_DISCOUNTS[months] ?? 0;
    const originalAmount = +(monthly * months).toFixed(2);
    const amount = +(originalAmount * (1 - periodDiscount / 100)).toFixed(2);

    const orderId = uuidv4();
    const tx = await this.txRepo.save(
      this.txRepo.create({
        userId: dto.userId,
        amount,
        originalAmount,
        discountPercent: periodDiscount,
        periodMonths: months,
        currency: 'USDT',
        status: TransactionStatus.PENDING,
        type: TransactionType.CHANNEL, // переиспользуем существующий enum-тип
        orderId,
        description: `Канал «${dto.name}» [${asset}/${timeframe}/${direction}] × ${months} мес.`,
        channelMeta: {
          partnerId: partner.id,
          name: dto.name,
          asset,
          timeframe,
          direction,
          durationDays: months * 30,
        },
      }),
    );

    const paymentUrl = await this.createHeleketInvoice(dto.userId, amount, orderId, 'partner_channel');
    return { transactionId: tx.id, orderId, amount, originalAmount, monthly, paymentUrl };
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
        relations: ['user', 'plan', 'items'],
      });

      if (!tx) {
        this.logger.warn(`Webhook: транзакция не найдена order_id=${data.order_id}`);
        return { ok: true };
      }

      const status = data.status as TransactionStatus;

      // Идемпотентность: если транзакция уже была успешно проведена — не активируем повторно
      const alreadyPaid = tx.status === TransactionStatus.PAID || tx.status === TransactionStatus.PAID_OVER;
      await this.txRepo.update(tx.id, { status, webhookPayload: data });

      const userTag = `[${tx.user?.email || tx.userId}]`;

      if ((status === TransactionStatus.PAID || status === TransactionStatus.PAID_OVER) && alreadyPaid) {
        this.logger.log(`Webhook повтор для уже оплаченной ${tx.orderId} — пропуск активации`);
        return { ok: true };
      }

      if (status === TransactionStatus.PAID || status === TransactionStatus.PAID_OVER) {
        // Защита от недоплаты: сверяем фактически оплаченную сумму с ожидаемой
        const paidAmount = parseFloat(data.payment_amount ?? data.amount ?? '0');
        const expected = Number(tx.amount);
        if (status === TransactionStatus.PAID && paidAmount > 0 && paidAmount + 0.01 < expected) {
          this.logger.warn(`Недоплата order=${tx.orderId}: ожидалось ${expected}, получено ${paidAmount}`);
          await this.telegramService.sendMessage(
            `⚠️ Недоплата — доступ НЕ выдан\n👤 ${userTag}\n💵 ожидалось ${expected}, получено ${paidAmount}\n🆔 ${tx.orderId}`,
          );
          return { ok: true };
        }

        await this.onPaymentSuccess(tx, data);
        const emoji = status === TransactionStatus.PAID_OVER ? '💰+' : '✅';
        await this.telegramService.sendMessage(
          `${emoji} Оплата подтверждена\n👤 ${userTag}\n💵 ${tx.amount} USDT\n📦 ${tx.description || tx.type}\n🆔 ${tx.orderId}`,
        );
      } else if (status === TransactionStatus.WRONG_AMOUNT || status === TransactionStatus.WRONG_AMOUNT_WAITING) {
        await this.telegramService.sendMessage(
          `⚠️ Оплачено неверно (меньше)\n👤 ${userTag}\n💵 ожидалось ${tx.amount}, получено ${data.payment_amount ?? '?'}\n🆔 ${tx.orderId}`,
        );
      } else if (status === TransactionStatus.CANCEL) {
        // Счёт не оплачен: пользователь закрыл окно или истекло время. Это НЕ ошибка.
        this.logger.log(`Счёт не оплачен (cancel/expired): ${tx.orderId}`);
        await this.telegramService.sendMessage(
          `⏳ Счёт не оплачен (отменён или истёк по времени)\n👤 ${userTag}\n💵 ${tx.amount} USDT\n📦 ${tx.description || tx.type}\n🆔 ${tx.orderId}`,
        );
      } else if ([TransactionStatus.FAILED, TransactionStatus.SYSTEM_FAIL].includes(status as any)) {
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
    // Self-service оплата партнёрского канала
    if (tx.channelMeta) {
      const cm = tx.channelMeta;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (cm.durationDays || 30));
      const channel = this.partnerChannelRepo.create({
        partnerId: cm.partnerId,
        name: cm.name,
        asset: cm.asset,
        timeframe: cm.timeframe,
        direction: cm.direction,
        price: Number(tx.amount),
        discountPercent: 0,
        paidAt: new Date(),
        expiresAt,
        // Ключевое правило: signalsChannelId ещё нет → канал НЕактивен (ожидает настройки)
        isActive: false,
        notes: `Оплачен self-service, order ${tx.orderId}`,
      });
      await this.partnerChannelRepo.save(channel);

      await this.telegramService.sendMessage(
        `🟣 Оплачено подключение канала (нужна настройка!)\n` +
        `🏷 ${cm.name} [${cm.asset}/${cm.timeframe}/${cm.direction}]\n` +
        `💵 ${tx.amount} USDT\n` +
        `👤 ${tx.user?.email || tx.userId}\n` +
        `⚙️ Впишите signalsChannelId в админке, чтобы активировать.`,
      ).catch(() => {});

      await this.processReferralBonus(tx);
      return;
    }

    if (tx.isBatch) {
      // Батч: выдаём каждую позицию корзины
      const items = tx.items?.length
        ? tx.items
        : await this.txItemRepo.find({ where: { transactionId: tx.id } });
      for (const item of items) {
        await this.deliverItem(tx, {
          type: item.type,
          planId: item.planId,
          shopProductId: item.shopProductId,
          periodMonths: item.periodMonths,
        });
      }
    } else {
      // Одна позиция (legacy / обычный инвойс)
      await this.deliverItem(tx, {
        type: tx.type,
        planId: tx.planId,
        shopProductId: tx.shopProductId,
        periodMonths: tx.periodMonths,
      });
    }

    // Реферальный бонус считается от полной суммы транзакции (один раз на транзакцию)
    await this.processReferralBonus(tx);
  }

  // Выдача одной единицы доступа (подписка / индикатор / канал)
  private async deliverItem(
    tx: Transaction,
    item: { type: TransactionType; planId?: string; shopProductId?: string; periodMonths?: number },
  ) {
    const periodMonths = item.periodMonths || 1;
    const durationDays = periodMonths * 30;
    const startsAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    if (item.type === TransactionType.SUBSCRIPTION && item.planId) {
      await this.subRepo.save(
        this.subRepo.create({
          userId: tx.userId,
          planId: item.planId,
          status: SubscriptionStatus.ACTIVE,
          startsAt,
          expiresAt,
          grantedBy: 'payment',
          notes: `Heleket order ${tx.orderId}`,
        }),
      );
    } else if (
      (item.type === TransactionType.INDICATOR || item.type === TransactionType.CHANNEL) &&
      item.shopProductId
    ) {
      // Если уже есть активный доступ — продлеваем от текущей даты окончания
      const existing = await this.userProductRepo.findOne({
        where: {
          userId: tx.userId,
          shopProductId: item.shopProductId,
          status: UserProductStatus.ACTIVE,
        },
        order: { expiresAt: 'DESC' },
      });

      if (existing && new Date(existing.expiresAt) > startsAt) {
        const newExpiry = new Date(existing.expiresAt);
        newExpiry.setDate(newExpiry.getDate() + durationDays);
        await this.userProductRepo.update(existing.id, { expiresAt: newExpiry });
      } else {
        await this.userProductRepo.save(
          this.userProductRepo.create({
            userId: tx.userId,
            shopProductId: item.shopProductId,
            status: UserProductStatus.ACTIVE,
            startsAt,
            expiresAt,
            grantedBy: 'payment',
            notes: `Heleket order ${tx.orderId}`,
          }),
        );
      }
    }
  }

  // ─── Реферальный бонус ────────────────────────────────────────────────────

  async processReferralBonus(tx: Transaction, customPercent?: number) {
    // Бонус начисляется за любую реальную оплату (подписки и товары)
    if (Number(tx.amount) <= 0) return;
    if (tx.type === TransactionType.ADMIN_GRANT || tx.type === TransactionType.REFERRAL) return;

    const user = tx.user || await this.userRepo.findOne({ where: { id: tx.userId } });
    if (!user?.referredBy) return;

    const referrer = await this.userRepo.findOne({ where: { id: user.referredBy } });
    if (!referrer) return;

    const percent = customPercent ?? REFERRAL_PERCENT;
    const bonusAmount = +(Number(tx.amount) * percent / 100).toFixed(2);
    if (bonusAmount <= 0) return;

    // Атомарно: запись начисления + инкремент баланса в одной транзакции БД
    await this.dataSource.transaction(async (manager) => {
      // Защита от двойного начисления по одной и той же транзакции-основанию
      const existing = await manager.findOne(ReferralEarning, {
        where: { sourceTransactionId: tx.id },
      });
      if (existing) return;

      await manager.save(
        manager.create(ReferralEarning, {
          referrerId: referrer.id,
          fromUserId: tx.userId,
          sourceTransactionId: tx.id,
          amount: bonusAmount,
          percent,
          isManual: false,
        }),
      );

      await manager.increment(User, { id: referrer.id }, 'referralBalance', bonusAmount);
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
