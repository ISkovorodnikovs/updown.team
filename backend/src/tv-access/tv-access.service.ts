import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Repository, In, LessThan, IsNull, MoreThan } from 'typeorm';
import axios from 'axios';
import { TvAccessRequest, TvProfileCheck, TvRequestItem } from '../database/entities/tv-access-request.entity';
import { User } from '../database/entities/user.entity';
import { ProductType } from '../database/entities/shop-product.entity';
import { ShopService } from '../shop/shop.service';
import { TelegramMainService } from '../telegram/telegram-main.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../database/entities/notification.entity';
import { MailService } from '../mail/mail.service';
import { normalizeLang } from '../mail/templates';

const NICK_RE = /^[A-Za-z0-9_.-]{2,40}$/;
const REMIND_AFTER_MS = 6 * 3600 * 1000; // пользователю обещаем «не позднее 12 часов»

const TEXTS = {
  en: {
    grantedTitle: 'TradingView access granted',
    grantedBody: (p: string, n: string) => `${p} is available for TradingView user ${n}. Open TradingView → Indicators → Invite-only scripts.`,
    nfTitle: 'Please check your TradingView username',
    nfBody: (n: string) => `We could not find the TradingView profile "${n}". Open My Access and enter your username again.`,
  },
  uk: {
    grantedTitle: 'Доступ у TradingView видано',
    grantedBody: (p: string, n: string) => `${p} доступний для акаунта TradingView ${n}. Відкрийте TradingView → Індикатори → Скрипти лише за запрошенням.`,
    nfTitle: 'Перевірте нік TradingView',
    nfBody: (n: string) => `Ми не знайшли профіль TradingView «${n}». Відкрийте «Мої доступи» та вкажіть нік ще раз.`,
  },
  de: {
    grantedTitle: 'TradingView-Zugang freigeschaltet',
    grantedBody: (p: string, n: string) => `${p} ist für den TradingView-Nutzer ${n} verfügbar. Öffnen Sie TradingView → Indikatoren → Nur-auf-Einladung-Skripte.`,
    nfTitle: 'Bitte prüfen Sie Ihren TradingView-Benutzernamen',
    nfBody: (n: string) => `Wir konnten das TradingView-Profil „${n}“ nicht finden. Öffnen Sie „Meine Zugänge“ und geben Sie den Namen erneut ein.`,
  },
  es: {
    grantedTitle: 'Acceso en TradingView concedido',
    grantedBody: (p: string, n: string) => `${p} está disponible para el usuario de TradingView ${n}. Abra TradingView → Indicadores → Scripts solo por invitación.`,
    nfTitle: 'Revise su usuario de TradingView',
    nfBody: (n: string) => `No encontramos el perfil de TradingView «${n}». Abra Mis accesos e introduzca el usuario de nuevo.`,
  },
  it: {
    grantedTitle: 'Accesso TradingView concesso',
    grantedBody: (p: string, n: string) => `${p} è disponibile per l’utente TradingView ${n}. Apri TradingView → Indicatori → Script solo su invito.`,
    nfTitle: 'Controlla il tuo nome utente TradingView',
    nfBody: (n: string) => `Non abbiamo trovato il profilo TradingView «${n}». Apri I miei accessi e inserisci di nuovo il nome utente.`,
  },
  pt: {
    grantedTitle: 'Acesso no TradingView liberado',
    grantedBody: (p: string, n: string) => `${p} está disponível para o usuário do TradingView ${n}. Abra o TradingView → Indicadores → Scripts somente por convite.`,
    nfTitle: 'Verifique seu usuário do TradingView',
    nfBody: (n: string) => `Não encontramos o perfil do TradingView «${n}». Abra Meus acessos e informe o usuário novamente.`,
  },
  zh: {
    grantedTitle: 'TradingView 访问已开通',
    grantedBody: (p: string, n: string) => `TradingView 用户 ${n} 现可使用 ${p}。打开 TradingView → 指标 → 仅限邀请脚本。`,
    nfTitle: '请检查您的 TradingView 用户名',
    nfBody: (n: string) => `未找到 TradingView 个人资料“${n}”。请打开“我的访问”重新填写用户名。`,
  },
  ar: {
    grantedTitle: 'تم تفعيل الوصول على TradingView',
    grantedBody: (p: string, n: string) => `${p} متاح لمستخدم TradingView ${n}. افتح TradingView ← المؤشرات ← نصوص بالدعوة فقط.`,
    nfTitle: 'يرجى التحقق من اسم المستخدم في TradingView',
    nfBody: (n: string) => `لم نعثر على ملف TradingView «${n}». افتح «وصولي» وأدخل الاسم مرة أخرى.`,
  },
  ru: {
    grantedTitle: 'Доступ в TradingView выдан',
    grantedBody: (p: string, n: string) => `${p} доступен для аккаунта TradingView ${n}. Откройте TradingView → Индикаторы → Скрипты только по приглашению.`,
    nfTitle: 'Проверьте ник TradingView',
    nfBody: (n: string) => `Мы не нашли профиль TradingView «${n}». Откройте «Мои доступы» и укажите ник ещё раз.`,
  },
};

@Injectable()
export class TvAccessService implements OnModuleInit {
  private readonly logger = new Logger('TvAccess');

  constructor(
    @InjectRepository(TvAccessRequest) private repo: Repository<TvAccessRequest>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private shop: ShopService,
    private telegram: TelegramMainService,
    private notifications: NotificationsService,
    private mail: MailService,
  ) {}

  onModuleInit() {
    this.telegram.onCallback('tv:', (data, who) => this.onButton(data, who));
  }

  // ── Проверка профиля TradingView ──────────────────────────────────
  async checkProfile(nick: string): Promise<TvProfileCheck> {
    try {
      const r = await axios.get(`https://www.tradingview.com/u/${encodeURIComponent(nick)}/`, {
        timeout: 7000,
        maxRedirects: 3,
        validateStatus: () => true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          Accept: 'text/html',
        },
      });
      if (r.status === 200) return 'exists';
      if (r.status === 404) return 'not_found';
      this.logger.warn(`profile check ${nick}: HTTP ${r.status}`);
      return 'unknown';
    } catch (e: any) {
      this.logger.warn(`profile check ${nick} failed: ${e.message}`);
      return 'unknown';
    }
  }

  // ── Заявки пользователя ───────────────────────────────────────────
  async getMy(userId: string) {
    const since = new Date(Date.now() - 180 * 86400000);
    const rows = await this.repo.find({
      where: { userId, status: In(['pending', 'granted', 'not_found']), createdAt: MoreThan(since) },
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return rows.map((r) => ({
      id: r.id, status: r.status, tvUsername: r.tvUsername, profileCheck: r.profileCheck,
      items: r.items, createdAt: r.createdAt, decidedAt: r.decidedAt,
    }));
  }

  /**
   * Новая заявка. confirm=true — пользователь подтвердил ник, хотя профиль не найден.
   * Возвращает { ok:false, reason:'profile_not_found' }, если профиль не найден и нет подтверждения.
   */
  async submit(jwtUser: any, rawNick: string, confirm = false, lang?: string) {
    const nick = String(rawNick || '').trim().replace(/^@/, '').replace(/^https?:\/\/[^/]*tradingview\.com\/u\//i, '').replace(/\/+$/, '');
    if (!NICK_RE.test(nick)) throw new BadRequestException('INVALID_USERNAME');

    const access = await this.shop.getMyAccess(jwtUser);
    let indicators = access.products.filter((p: any) => p.type === ProductType.INDICATOR);
    if (!indicators.length) throw new BadRequestException('NO_INDICATORS');

    // Индикаторы, уже выданные на этот же ник и ещё действующие, повторно не запрашиваем
    const granted = await this.repo.find({ where: { userId: jwtUser.id, status: 'granted', tvUsername: nick } });
    const now = Date.now();
    const covered = new Set<string>();
    for (const g of granted) {
      for (const i of g.items || []) if (!i.until || new Date(i.until).getTime() > now) covered.add(i.productId);
    }
    indicators = indicators.filter((p: any) => !covered.has(p.productId));
    if (!indicators.length) throw new BadRequestException('ALREADY_GRANTED');

    const check = await this.checkProfile(nick);
    if (check === 'not_found' && !confirm) return { ok: false, reason: 'profile_not_found', tvUsername: nick };

    const user = await this.userRepo.findOne({ where: { id: jwtUser.id } });
    if (user) {
      user.tvUsername = nick;
      if (lang && !user.lang) user.lang = normalizeLang(lang);
      await this.userRepo.save(user);
    }

    // Предыдущие ожидающие заявки заменяются новой
    const prev = await this.repo.find({ where: { userId: jwtUser.id, status: 'pending' } });
    for (const p of prev) {
      p.status = 'cancelled';
      await this.repo.save(p);
      if (p.adminMessageId) await this.telegram.editAdminMessage(p.adminMessageId, `${this.adminText(p, user)}\n\n↩️ Заменена новой заявкой пользователя`);
    }

    const items: TvRequestItem[] = indicators.map((p: any) => ({
      productId: p.productId, name: p.name, until: p.expiresAt ? new Date(p.expiresAt).toISOString() : null,
    }));
    let req = await this.repo.save(this.repo.create({ userId: jwtUser.id, tvUsername: nick, items, profileCheck: check, status: 'pending' }));

    const msgId = await this.telegram.sendAdminMessage(this.adminText(req, user), [[
      { text: '✅ Выдал', data: `tv:ok:${req.id}` },
      { text: '❌ Ник не найден', data: `tv:nf:${req.id}` },
    ]]);
    if (msgId) { req.adminMessageId = msgId; req = await this.repo.save(req); }

    return { ok: true, request: { id: req.id, status: req.status, tvUsername: nick, profileCheck: check, items, createdAt: req.createdAt } };
  }

  private fmtUtc(d: Date | string | null) {
    if (!d) return '—';
    const x = new Date(d);
    return `${x.toISOString().slice(0, 10).split('-').reverse().join('.')} ${x.toISOString().slice(11, 16)} UTC`;
  }

  private adminText(r: TvAccessRequest, user?: User | null): string {
    const checkLine = r.profileCheck === 'exists'
      ? '✅ Профиль найден'
      : r.profileCheck === 'not_found'
        ? '⚠️ Профиль НЕ найден — пользователь подтвердил, что ник верный'
        : '❔ Профиль проверить не удалось — проверьте вручную';
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    const lines = [
      '🖥 Заявка на доступ TradingView',
      `👤 ${user?.email || r.userId}${name ? ` (${name})` : ''}`,
      `🔗 Ник: ${r.tvUsername}`,
      `https://www.tradingview.com/u/${encodeURIComponent(r.tvUsername)}/`,
      checkLine,
      '',
      ...r.items.map((i) => `📦 ${i.name} — выдать до ${i.until && new Date(i.until).getUTCFullYear() < 2099 ? this.fmtUtc(i.until).slice(0, 10) : 'бессрочно'}`),
      '',
      `🕒 Заявка: ${this.fmtUtc(r.createdAt)}`,
      `🌐 Язык: ${normalizeLang(user?.lang)}`,
    ];
    return lines.join('\n');
  }

  // ── Кнопки в админ-группе ─────────────────────────────────────────
  private async onButton(data: string, who: string): Promise<string> {
    const [, action, id] = data.split(':');
    const req = await this.repo.findOne({ where: { id } });
    if (!req) return 'Заявка не найдена';
    const user = await this.userRepo.findOne({ where: { id: req.userId } });
    if (req.status !== 'pending') {
      return req.status === 'cancelled' ? 'Заявка уже заменена новой' : `Уже обработано: ${req.decidedBy || '—'}`;
    }

    req.status = action === 'ok' ? 'granted' : 'not_found';
    req.decidedBy = who;
    req.decidedAt = new Date();
    await this.repo.save(req);

    const mark = req.status === 'granted' ? `✅ Выдал: ${who} · ${this.fmtUtc(req.decidedAt)}` : `❌ Ник не найден: ${who} · ${this.fmtUtc(req.decidedAt)}\nПользователь получил просьбу указать ник заново.`;
    if (req.adminMessageId) await this.telegram.editAdminMessage(req.adminMessageId, `${this.adminText(req, user)}\n\n${mark}`);

    if (user) await this.notifyUser(user, req);
    return req.status === 'granted' ? 'Отмечено: доступ выдан' : 'Отмечено: ник не найден';
  }

  private async notifyUser(user: User, req: TvAccessRequest) {
    const lang = normalizeLang(user.lang);
    const t = (TEXTS as any)[lang] || TEXTS.en;
    const names = req.items.map((i) => i.name);
    try {
      if (req.status === 'granted') {
        const untils = req.items.map((i) => (i.until ? new Date(i.until) : null)).filter((d): d is Date => !!d && d.getUTCFullYear() < 2099);
        const until = untils.length ? new Date(Math.min(...untils.map((d) => d.getTime()))) : null;
        await this.notifications.create(user.id, {
          type: NotificationType.ACCESS, title: t.grantedTitle, body: t.grantedBody(names.join(', '), req.tvUsername),
          meta: { link: '/dashboard/access' },
        });
        await this.mail.sendTvGranted(user.email, user.lang, names, req.tvUsername, until);
      } else {
        await this.notifications.create(user.id, {
          type: NotificationType.ACCESS, title: t.nfTitle, body: t.nfBody(req.tvUsername),
          meta: { link: '/dashboard/access' },
        });
        await this.mail.sendTvNotFound(user.email, user.lang, req.tvUsername);
      }
    } catch (e: any) {
      this.logger.warn(`notifyUser failed: ${e.message}`);
    }
  }

  // ── Напоминание админам о зависших заявках ────────────────────────
  @Cron('*/30 * * * *')
  async remindPending() {
    try {
      const old = await this.repo.find({
        where: { status: 'pending', remindedAt: IsNull(), createdAt: LessThan(new Date(Date.now() - REMIND_AFTER_MS)) },
      });
      for (const r of old) {
        const user = await this.userRepo.findOne({ where: { id: r.userId } });
        await this.telegram.replyAdmin(r.adminMessageId, `⏰ Заявка ждёт больше 6 часов: ${user?.email || r.userId}, ник ${r.tvUsername}. Пользователю обещано не позднее 12 часов.`);
        r.remindedAt = new Date();
        await this.repo.save(r);
      }
    } catch (e: any) {
      this.logger.warn(`remindPending failed: ${e.message}`);
    }
  }
}
