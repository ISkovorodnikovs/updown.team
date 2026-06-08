import { Injectable, OnModuleInit, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ShopProduct, ProductType } from '../database/entities/shop-product.entity';
import { UserProduct, UserProductStatus } from '../database/entities/user-product.entity';
import { CreateShopProductDto, UpdateShopProductDto } from './dto/shop-product.dto';
import { TelegramMainService } from '../telegram/telegram-main.service';

const INDICATORS_SEED = [
  {
    name: 'UpDown Table Predictor (Light)',
    tradingViewUrl: 'https://ru.tradingview.com/script/b0QMRPSg-updown-table-predictor-light/',
    price: 50,
    sortOrder: 1,
    features: ['Прогнозная таблица движений', 'Работает на любом TF', 'Визуальная индикация направления'],
    description: 'Мощный инструмент прогнозирования на основе паттернов. Отображает вероятные направления в удобной табличной форме — идеально для быстрого анализа перед входом в сделку. Поддерживает все таймфреймы и торговые пары.',
  },
  {
    name: 'UpDown Liquidity Zones',
    tradingViewUrl: 'https://ru.tradingview.com/script/NCfSaooq-updown-liquidity-zones/',
    price: 50,
    sortOrder: 2,
    features: ['Автоматическое выявление зон ликвидности', 'Поддержка и сопротивление', 'Визуализация sweep зон'],
    description: 'Автоматически выявляет и отображает ключевые зоны ликвидности на графике. Видит где рынок собирает стопы и разворачивается. Незаменим при торговле с концепцией Smart Money.',
  },
  {
    name: 'UpDown Strong Levels Finder',
    tradingViewUrl: 'https://ru.tradingview.com/script/AXB8VsvM-updown-strong-levels-finder/',
    price: 50,
    sortOrder: 3,
    features: ['Поиск сильных уровней', 'Исторические данные', 'Автообновление'],
    description: 'Находит сильнейшие ценовые уровни основываясь на исторических данных. Уровни, от которых цена реагировала многократно — приоритетные точки входа и выхода.',
  },
  {
    name: 'UpDown Pump&MM Target (Lite)',
    tradingViewUrl: 'https://ru.tradingview.com/script/2ceyLqUH-updown-pump-mm-target-lite/',
    price: 50,
    sortOrder: 4,
    features: ['Цели маркет-мейкера', 'Прогноз памп-зон', 'Lite версия'],
    description: 'Определяет потенциальные цели маркет-мейкера и памп-зоны. Помогает выстраивать сделки в направлении "умных денег". Lite-версия с ключевыми функциями основного инструмента.',
  },
  {
    name: 'UpDown OI Engine',
    tradingViewUrl: 'https://ru.tradingview.com/script/rF1wtKvL-updown-oi-engine/',
    price: 50,
    sortOrder: 5,
    features: ['Анализ открытого интереса', 'Дивергенции OI/Price', 'Сигналы разворота'],
    description: 'Анализирует динамику открытого интереса и выявляет дивергенции с ценой. Ранние сигналы разворота и продолжения тренда на основе данных деривативов.',
  },
  {
    name: 'UpDown [FIB] by SK TRADE v3',
    tradingViewUrl: 'https://ru.tradingview.com/script/Z5q65byi-updown-fib-by-sk-trade-v3/',
    price: 50,
    sortOrder: 6,
    features: ['Автоматические уровни Фибоначчи', 'Версия v3', 'SK TRADE методология'],
    description: 'Автоматически строит уровни Фибоначчи по авторской методологии SK TRADE. Третья версия инструмента с улучшенным алгоритмом определения экстремумов и точностью уровней.',
  },
  {
    name: 'UpDown Pump Trap Hunter',
    tradingViewUrl: 'https://ru.tradingview.com/script/6RqoLJzu-updown-pump-trap-hunter/',
    price: 50,
    sortOrder: 7,
    features: ['Поиск ловушек памп', 'False breakout детектор', 'Алерты'],
    description: 'Специализированный инструмент для выявления памп-ловушек и ложных пробоев. Защищает от входа в манипулятивные движения и помогает находить лучшие точки входа после трапа.',
  },
  {
    name: 'UpDown TF Reaction Map v2',
    tradingViewUrl: 'https://ru.tradingview.com/script/5s1UWvKx-updown-tf-reaction-map-v2/',
    price: 50,
    sortOrder: 8,
    features: ['Карта реакций по таймфреймам', 'Multi-TF анализ', 'v2 улучшенный'],
    description: 'Карта реакций цены на ключевых таймфреймах в одном индикаторе. Видите как рынок реагирует на уровни сразу на нескольких ТФ — незаменимо для построения multi-timeframe торговой системы.',
  },
  {
    name: 'UpDown TF Reaction Map Tester',
    tradingViewUrl: 'https://ru.tradingview.com/script/Om9RAqHn-updown-tf-reaction-map-tester/',
    price: 50,
    sortOrder: 9,
    features: ['Бэктест карты реакций', 'Статистика точности', 'Оптимизация стратегий'],
    description: 'Тестер для карты реакций TF — позволяет проверить точность сигналов на исторических данных. Получите статистику по каждому уровню и оптимизируйте свою торговую систему.',
  },
];

const CHANNELS_SEED = [
  {
    name: 'AiView — Крипто, Форекс, Сырьё и Золото',
    price: 150,
    sortOrder: 1,
    badge: 'AI Powered',
    features: ['Крипто сигналы (BTC, ETH, альты)', 'Форекс пары', 'Сырьевые активы', 'Золото (XAU)', 'AI-аналитика'],
    description: 'Флагманский сигнальный канал AiView — полное покрытие крипто, форекс, сырьё и золото. Сигналы генерируются на основе AI-анализа рынка с подтверждением от команды трейдеров. Ежедневные торговые идеи с точными уровнями входа, стопа и тейков.',
  },
  {
    name: 'UpDown PRO',
    price: 75,
    sortOrder: 2,
    badge: 'PRO',
    features: ['Профессиональные сигналы', 'Эксклюзивный анализ', 'Разборы сделок'],
    description: 'Профессиональный сигнальный канал от команды UpDown. Качественные торговые идеи с подробными обоснованиями, разборами входов и сопровождением открытых позиций.',
  },
  {
    name: 'Золото — 4 Таймфрейма (1М, 5М, 15М, 60М)',
    price: 100,
    sortOrder: 3,
    badge: 'Gold',
    features: ['Сигналы XAU/USD', '4 таймфрейма: 1M 5M 15M 60M', 'Интрадей и swing', 'Точные уровни'],
    description: 'Специализированный канал по золоту (XAU/USD) сразу на 4 таймфреймах. Покрывает как скальпинг (1M, 5M), так и более длинные движения (15M, 60M). Идеально для трейдеров, специализирующихся на золоте.',
  },
  {
    name: 'Скальпинг — Любой инструмент на выбор',
    price: 250,
    sortOrder: 4,
    badge: '>80% точность',
    features: ['Персональный инструмент', 'Крипто / Форекс / Сырьё / Индексы', 'Точность более 80%', 'Скальпинг стратегии'],
    description: 'Эксклюзивный скальпинговый канал под любую торговую пару, валютную пару, сырьё или индекс на ваш выбор. Точность сигналов превышает 80%. Специализация под конкретный инструмент обеспечивает максимальную эффективность.',
  },
];

@Injectable()
export class ShopService implements OnModuleInit {
  private readonly logger = new Logger(ShopService.name);

  constructor(
    @InjectRepository(ShopProduct) private productRepo: Repository<ShopProduct>,
    @InjectRepository(UserProduct) private userProductRepo: Repository<UserProduct>,
    private telegram: TelegramMainService,
  ) {}

  // Заявка на обучение («Записаться») — уведомление админу в техчат
  async enrollEducation(user: any, productId: string, note?: string) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product || product.type !== ProductType.EDUCATION) {
      throw new NotFoundException('Курс не найден');
    }
    await this.telegram.sendMessage(
      `🎓 Заявка на обучение\n📚 ${product.name}\n👤 ${user.email}\n💵 ${product.price} ${product.currency}` +
      (note ? `\n📝 ${String(note).slice(0, 500)}` : ''),
    ).catch(() => {});
    return { ok: true };
  }

  async onModuleInit() {
    // Retry до 5 раз с задержкой — TypeORM synchronize может не успеть создать таблицы
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await this.seedProducts();
        return;
      } catch (e) {
        if (e.code === '42P01' && attempt < 5) {
          this.logger.warn(`Shop tables not ready yet, retrying in 2s... (attempt ${attempt}/5)`);
          await new Promise(r => setTimeout(r, 2000));
        } else {
          throw e;
        }
      }
    }
  }

  private async seedProducts() {
    const existing = await this.productRepo.count();
    if (existing > 0) return;

    for (const item of INDICATORS_SEED) {
      await this.productRepo.save(this.productRepo.create({ ...item, type: ProductType.INDICATOR }));
    }
    for (const item of CHANNELS_SEED) {
      await this.productRepo.save(this.productRepo.create({ ...item, type: ProductType.SIGNAL_CHANNEL }));
    }

    this.logger.log('✅ Shop products seeded');
  }

  async getIndicators() {
    return this.productRepo.find({
      where: { type: ProductType.INDICATOR, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getChannels() {
    return this.productRepo.find({
      where: { type: ProductType.SIGNAL_CHANNEL, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getAll() {
    return this.productRepo.find({ order: { type: 'ASC', sortOrder: 'ASC' } });
  }

  // ─── Админ CRUD ────────────────────────────────────────────────────────────

  async createProduct(dto: CreateShopProductDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async updateProduct(id: string, dto: UpdateShopProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  // Мягкое удаление: деактивируем, чтобы не рвать активные доступы пользователей
  async softDeleteProduct(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    product.isActive = false;
    await this.productRepo.save(product);
    return { id, isActive: false, deleted: true };
  }

  // ─── Гейтинг доступа ───────────────────────────────────────────────────────

  // ID товаров, к которым у пользователя есть активный доступ
  async getActiveProductIds(userId: string): Promise<Set<string>> {
    const now = new Date();
    const rows = await this.userProductRepo.find({
      where: { userId, status: UserProductStatus.ACTIVE, expiresAt: MoreThan(now) },
      select: ['shopProductId'],
    });
    return new Set(rows.map((r) => r.shopProductId));
  }

  // Купленные пользователем товары (с деталями) — для раздела «Мои продукты»
  async getMyProducts(userId: string) {
    const now = new Date();
    const rows = await this.userProductRepo.find({
      where: { userId, status: UserProductStatus.ACTIVE, expiresAt: MoreThan(now) },
      relations: ['product'],
      order: { expiresAt: 'DESC' },
    });
    return rows.map((r) => ({
      id: r.id,
      productId: r.shopProductId,
      name: r.product?.name,
      type: r.product?.type,
      tradingViewUrl: r.product?.tradingViewUrl ?? null,
      startsAt: r.startsAt,
      expiresAt: r.expiresAt,
    }));
  }

  async hasProductAccess(userId: string, productId: string): Promise<boolean> {
    const ids = await this.getActiveProductIds(userId);
    return ids.has(productId);
  }

  // Каталог с флагом владения и скрытием секретных ссылок для не-владельцев
  async getIndicatorsGated(userId: string) {
    const [items, owned] = await Promise.all([this.getIndicators(), this.getActiveProductIds(userId)]);
    return items.map((p) => this.gateProduct(p, owned.has(p.id)));
  }

  async getChannelsGated(userId: string) {
    const [items, owned] = await Promise.all([this.getChannels(), this.getActiveProductIds(userId)]);
    return items.map((p) => this.gateProduct(p, owned.has(p.id)));
  }

  // Обучение — отдельный раздел магазина
  async getEducation() {
    return this.productRepo.find({
      where: { type: ProductType.EDUCATION, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getEducationGated(userId: string) {
    const [items, owned] = await Promise.all([this.getEducation(), this.getActiveProductIds(userId)]);
    return items.map((p) => this.gateProduct(p, owned.has(p.id)));
  }

  // Для не-владельца вырезаем tradingViewUrl (платный доступ), добавляем флаг owned
  private gateProduct(p: ShopProduct, owned: boolean) {
    const { tradingViewUrl, ...rest } = p as any;
    return {
      ...rest,
      owned,
      // ссылку отдаём ТОЛЬКО владельцу
      tradingViewUrl: owned ? tradingViewUrl : null,
    };
  }
}
