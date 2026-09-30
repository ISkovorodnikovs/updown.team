import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, MoreThan, In } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Plan } from '../database/entities/plan.entity';
import { Subscription, SubscriptionStatus } from '../database/entities/subscription.entity';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { UserProduct, UserProductStatus } from '../database/entities/user-product.entity';
import { TvAccessRequest } from '../database/entities/tv-access-request.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../database/entities/notification.entity';
import { MailService } from '../mail/mail.service';
import { TelegramMainService } from '../telegram/telegram-main.service';
import { normalizeLang } from '../mail/templates';

/** Бессрочный доступ = до конца 2099 года. */
export const FOREVER = new Date('2099-12-31T00:00:00Z');

const TEXTS = {
  en: {
    title: 'Your free access is active',
    body: (d: string | null) => (d ? `Magnet Pro and UpDown PRO until ${d}. UpDown Digest with no expiration.` : 'UpDown Digest with no expiration.'),
  },
  ru: {
    title: 'Бесплатный доступ активирован',
    body: (d: string | null) => (d ? `Magnet Pro и UpDown PRO до ${d}. UpDown Digest — бессрочно.` : 'UpDown Digest — бессрочно.'),
  },
  uk: {
    title: 'Безкоштовний доступ активовано',
    body: (d: string | null) => (d ? `Magnet Pro і UpDown PRO до ${d}. UpDown Digest — безстроково.` : 'UpDown Digest — безстроково.'),
  },
  de: {
    title: 'Ihr kostenloser Zugang ist aktiv',
    body: (d: string | null) => (d ? `Magnet Pro und UpDown PRO bis ${d}. UpDown Digest unbefristet.` : 'UpDown Digest unbefristet.'),
  },
  es: {
    title: 'Su acceso gratuito está activo',
    body: (d: string | null) => (d ? `Magnet Pro y UpDown PRO hasta el ${d}. UpDown Digest sin vencimiento.` : 'UpDown Digest sin vencimiento.'),
  },
  it: {
    title: 'Il tuo accesso gratuito è attivo',
    body: (d: string | null) => (d ? `Magnet Pro e UpDown PRO fino al ${d}. UpDown Digest senza scadenza.` : 'UpDown Digest senza scadenza.'),
  },
  pt: {
    title: 'Seu acesso gratuito está ativo',
    body: (d: string | null) => (d ? `Magnet Pro e UpDown PRO até ${d}. UpDown Digest sem prazo.` : 'UpDown Digest sem prazo.'),
  },
  zh: {
    title: '您的免费访问已激活',
    body: (d: string | null) => (d ? `Magnet Pro 和 UpDown PRO 有效期至 ${d}。UpDown Digest 永久有效。` : 'UpDown Digest 永久有效。'),
  },
  ar: {
    title: 'تم تفعيل وصولك المجاني',
    body: (d: string | null) => (d ? `Magnet Pro وUpDown PRO حتى ${d}. UpDown Digest دون تاريخ انتهاء.` : 'UpDown Digest دون تاريخ انتهاء.'),
  },
};

export interface GrantResult {
  trialUntil: Date | null;
  foreverGranted: number;
}

@Injectable()
export class FreeAccessService {
  private readonly logger = new Logger('FreeAccess');

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(ShopProduct) private productRepo: Repository<ShopProduct>,
    @InjectRepository(UserProduct) private userProductRepo: Repository<UserProduct>,
    @InjectRepository(TvAccessRequest) private tvRepo: Repository<TvAccessRequest>,
    private notifications: NotificationsService,
    private mail: MailService,
    private telegram: TelegramMainService,
    private config: ConfigService,
  ) {}

  private trialDays(): number {
    return Math.max(1, parseInt(this.config.get('FREE_TRIAL_DAYS', '7'), 10) || 7);
  }

  /** Тариф FREE (isTrial). Может быть неактивным — он не продаётся, только выдаётся. */
  async getTrialPlan(): Promise<Plan | null> {
    return this.planRepo.findOne({ where: { isTrial: true }, order: { createdAt: 'ASC' } });
  }

  /** Бесплатные навсегда товары (meta.freeForever = true), напр. UpDown Digest. */
  async getForeverProducts(): Promise<ShopProduct[]> {
    return this.productRepo
      .createQueryBuilder('p')
      .where('p."isActive" = true')
      .andWhere(`p.meta ->> 'freeForever' = 'true'`)
      .getMany();
  }

  /** Выдать бессрочные бесплатные товары, которых у пользователя ещё нет. */
  async grantForever(userId: string): Promise<number> {
    const products = await this.getForeverProducts();
    let granted = 0;
    const now = new Date();
    for (const p of products) {
      const has = await this.userProductRepo.findOne({
        where: { userId, shopProductId: p.id, status: UserProductStatus.ACTIVE, expiresAt: MoreThan(now) },
      });
      if (has) continue;
      await this.userProductRepo.save(this.userProductRepo.create({
        userId, shopProductId: p.id, status: UserProductStatus.ACTIVE,
        startsAt: now, expiresAt: FOREVER, grantedBy: 'free', notes: 'Бесплатно навсегда',
      }));
      granted++;
    }
    return granted;
  }

  /**
   * Выдать FREE на N дней. Без force — только если пользователь его ещё не получал.
   * С force (админ) — отменяет текущий FREE и заявки TradingView по нему и выдаёт заново.
   */
  async grantTrial(userId: string, opts: { force?: boolean; by?: string } = {}): Promise<Date | null> {
    const plan = await this.getTrialPlan();
    if (!plan) return null;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.freeTrialAt && !opts.force) return null;

    if (opts.force) {
      await this.subRepo.update(
        { userId, planId: plan.id, status: SubscriptionStatus.ACTIVE },
        { status: SubscriptionStatus.CANCELLED },
      );
      // Заявки TradingView, покрывавшие товары FREE, — отменяем, чтобы пройти путь заново
      const trialIds = new Set(plan.includedProductIds || []);
      const reqs = await this.tvRepo.find({ where: { userId, status: In(['pending', 'granted']) } });
      for (const r of reqs) {
        if ((r.items || []).some((i) => trialIds.has(i.productId))) {
          r.status = 'cancelled';
          await this.tvRepo.save(r);
        }
      }
    }

    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + this.trialDays() * 86400000);
    await this.subRepo.save(this.subRepo.create({
      userId, planId: plan.id, status: SubscriptionStatus.ACTIVE,
      startsAt, expiresAt, grantedBy: opts.by || 'free', notes: 'FREE trial',
    }));
    user.freeTrialAt = startsAt;
    await this.userRepo.save(user);
    return expiresAt;
  }

  private fmt(d: Date, lang: string) {
    const loc: Record<string, string> = { en: 'en-US', ru: 'ru-RU', uk: 'uk-UA', de: 'de-DE', es: 'es-ES', it: 'it-IT', pt: 'pt-PT', zh: 'zh-CN', ar: 'ar' };
    return d.toLocaleDateString(loc[lang] || 'en-US', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  }

  private async notify(user: User, res: GrantResult, email: boolean) {
    const lang = normalizeLang(user.lang);
    const t = (TEXTS as any)[lang] || TEXTS.en;
    await this.notifications.create(user.id, {
      type: NotificationType.ACCESS,
      title: t.title,
      body: t.body(res.trialUntil ? this.fmt(res.trialUntil, lang) : null),
      meta: { link: '/dashboard/access' },
    }).catch(() => {});
    if (email) await this.mail.sendWelcome(user.email, user.lang, res.trialUntil).catch(() => {});
  }

  /** Вызывается сразу после регистрации. Ошибки не прерывают регистрацию. */
  async onSignup(userId: string): Promise<void> {
    try {
      const foreverGranted = await this.grantForever(userId);
      const trialUntil = await this.grantTrial(userId);
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user) await this.notify(user, { trialUntil, foreverGranted }, true);
    } catch (e: any) {
      this.logger.error(`onSignup(${userId}) failed: ${e.message}`);
      await this.telegram.sendMessage(`❗ Не удалось выдать FREE новому пользователю ${userId}: ${e.message}`).catch(() => {});
    }
  }

  /** Админ: выдать FREE одному пользователю заново (как при первой регистрации). */
  async grantForUser(adminId: string, userId: string): Promise<GrantResult> {
    const foreverGranted = await this.grantForever(userId);
    const trialUntil = await this.grantTrial(userId, { force: true, by: adminId });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      await this.notify(user, { trialUntil, foreverGranted }, true);
      await this.telegram.sendMessage(`🎁 FREE выдан заново (админ)\n👤 ${user.email}`).catch(() => {});
    }
    return { trialUntil, foreverGranted };
  }

  /**
   * Владелец: выдать бесплатное всем текущим пользователям.
   * Digest — всем, у кого нет; FREE — всем, кто его ещё не получал (независимо от оплат).
   * Только уведомление в кабинете, без писем.
   */
  async grantAll(adminId: string) {
    const users = await this.userRepo.find({ where: { isActive: true } });
    let trials = 0, forever = 0;
    for (const u of users) {
      try {
        const f = await this.grantForever(u.id);
        const t = await this.grantTrial(u.id, { by: adminId });
        forever += f;
        if (t) trials++;
        if (f || t) await this.notify(u, { trialUntil: t, foreverGranted: f }, false);
      } catch (e: any) {
        this.logger.warn(`grantAll: ${u.id} failed: ${e.message}`);
      }
    }
    await this.telegram.sendMessage(`🎁 Массовая выдача бесплатного доступа\n👥 Пользователей: ${users.length}\n⏳ FREE выдан: ${trials}\n♾ Digest выдан: ${forever}`).catch(() => {});
    return { users: users.length, trials, forever };
  }
}
