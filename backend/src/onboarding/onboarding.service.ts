import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';
import { Subscription, SubscriptionStatus } from '../database/entities/subscription.entity';
import { ShopProduct } from '../database/entities/shop-product.entity';
import { UserProduct, UserProductStatus } from '../database/entities/user-product.entity';
import { ChannelAccess } from '../database/entities/channel-access.entity';
import { TvAccessRequest } from '../database/entities/tv-access-request.entity';

export type OnboardingMode = 'manual' | 'new' | 'all';
const GOALS = ['indicators', 'signals', 'learn'];
const HINT_RE = /^[a-z0-9_-]{1,32}$/;

export interface ChecklistItem {
  key: 'tv' | 'digest' | 'channel' | 'telegram' | 'shop';
  done: boolean;
  name?: string;
}

@Injectable()
export class OnboardingService {
  constructor(
    private config: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    @InjectRepository(ShopProduct) private productRepo: Repository<ShopProduct>,
    @InjectRepository(UserProduct) private userProductRepo: Repository<UserProduct>,
    @InjectRepository(ChannelAccess) private channelRepo: Repository<ChannelAccess>,
    @InjectRepository(TvAccessRequest) private tvRepo: Repository<TvAccessRequest>,
  ) {}

  /** manual — только тем, кому выдал админ; new — новым (не legacy); all — всем. */
  mode(): OnboardingMode {
    const m = String(this.config.get('ONBOARDING_MODE', 'manual')).trim().toLowerCase();
    return (['manual', 'new', 'all'].includes(m) ? m : 'manual') as OnboardingMode;
  }

  private isStaff(u: User) {
    return u.role === UserRole.ADMIN || u.role === UserRole.OWNER;
  }

  /** Обучение включено для пользователя (тур, чек-лист, подсказки на страницах). */
  private active(u: User, st: Record<string, any>) {
    const mode = this.mode();
    return !!st.forced || mode === 'all' || (mode === 'new' && !st.legacy);
  }

  async getState(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const st = user.onboarding || {};
    const active = this.active(user, st);
    const checklist = active ? await this.checklist(user, st) : [];
    const doneCount = checklist.filter((i) => i.done).length;
    return {
      mode: this.mode(),
      active,
      // Пункт меню «Пройти обучение»: у кого обучение включено, кто его уже видел, и у админов
      canRestart: active || !!st.tourDone || this.isStaff(user),
      showTour: active && !st.tourDone,
      showWelcome: active && !st.welcomeDone && !st.tourDone,
      goal: st.goal || null,
      tourDone: st.tourDone || null,
      hints: active ? (Array.isArray(st.hints) ? st.hints : []) : null,
      checklist: {
        items: checklist,
        done: doneCount,
        total: checklist.length,
        visible: active && !st.checklistHidden && checklist.length > 0 && doneCount < checklist.length,
      },
    };
  }

  /** Пять шагов «Первые шаги». Выполнение считаем по реальным данным, а не по кликам. */
  private async checklist(user: User, st: Record<string, any>): Promise<ChecklistItem[]> {
    const now = new Date();
    const items: ChecklistItem[] = [];

    // 1. Заявка на индикатор в TradingView (Magnet Pro)
    const tv = await this.tvRepo.count({ where: { userId: user.id, status: In(['pending', 'granted']) } });
    items.push({ key: 'tv', done: tv > 0 });

    // Доступные пользователю каналы с Telegram-группой
    const ups = await this.userProductRepo.find({
      where: { userId: user.id, status: UserProductStatus.ACTIVE, expiresAt: MoreThan(now) },
    });
    const subs = await this.subRepo.find({
      where: { userId: user.id, status: SubscriptionStatus.ACTIVE, expiresAt: MoreThan(now) },
      relations: ['plan'],
    });
    const ids = new Set<string>(ups.map((u) => u.shopProductId));
    for (const s of subs) (s.plan?.includedProductIds || []).forEach((id) => ids.add(id));
    const channels = ids.size
      ? await this.productRepo.find({
          where: { id: In([...ids]), type: 'signal_channel' as any, isActive: true, telegramChatId: Not(IsNull()) },
          order: { sortOrder: 'ASC' },
        })
      : [];
    const usable = channels.filter((c) => !c.customInstrument);
    const joined = usable.length
      ? await this.channelRepo.find({
          where: { userId: user.id, shopProductId: In(usable.map((c) => c.id)), joinedTelegramUserId: Not(IsNull()) },
        })
      : [];
    const joinedIds = new Set(joined.map((j) => j.shopProductId));

    // 2. Бесплатный канал (UpDown Digest)
    const free = usable.find((c) => c.meta && (c.meta as any).freeForever === true);
    if (free) items.push({ key: 'digest', done: joinedIds.has(free.id), name: free.name });

    // 3. Первый платный / пробный канал (UpDown PRO по FREE)
    const paid = usable.find((c) => !(c.meta && (c.meta as any).freeForever === true));
    if (paid) items.push({ key: 'channel', done: joinedIds.has(paid.id), name: paid.name });

    // 4. Уведомления в Telegram
    items.push({ key: 'telegram', done: !!user.telegramUserId });

    // 5. Посмотрел тарифы и продукты
    items.push({ key: 'shop', done: !!st.shopVisited });
    return items;
  }

  /** Пользователь сообщает о своих действиях в обучении. Принимаем только известные поля. */
  async patch(userId: string, body: any) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const st: Record<string, any> = { ...(user.onboarding || {}) };
    const now = new Date().toISOString();
    const b = body || {};

    if (b.restart === true) {
      // Запуск заново из меню: показываем тур даже в режиме manual
      delete st.tourDone; delete st.welcomeDone; delete st.checklistHidden;
      st.forced = true;
      st.restartedAt = now;
    }
    if (typeof b.goal === 'string' && GOALS.includes(b.goal)) st.goal = b.goal;
    if (b.welcomeDone === true) st.welcomeDone = now;
    if (b.tourDone === 'completed' || b.tourDone === 'skipped') {
      st.tourDone = b.tourDone;
      st.tourDoneAt = now;
      if (!st.welcomeDone) st.welcomeDone = now;
    }
    if (typeof b.hint === 'string' && HINT_RE.test(b.hint)) {
      const hints = new Set<string>(Array.isArray(st.hints) ? st.hints : []);
      hints.add(b.hint);
      st.hints = [...hints].slice(0, 50);
    }
    if (typeof b.checklistHidden === 'boolean') st.checklistHidden = b.checklistHidden;
    if (b.shopVisited === true) st.shopVisited = st.shopVisited || now;

    user.onboarding = st;
    await this.userRepo.save(user);
    return this.getState(userId);
  }

  /** Админ: показать обучение пользователю заново (при следующем входе). */
  async adminReset(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const prev = user.onboarding || {};
    user.onboarding = {
      ...(prev.legacy ? { legacy: true } : {}),
      ...(prev.shopVisited ? { shopVisited: prev.shopVisited } : {}),
      forced: true,
      resetAt: new Date().toISOString(),
    };
    await this.userRepo.save(user);
    return { ok: true };
  }
}
