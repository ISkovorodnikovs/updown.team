// ─────────────────────────────────────────────────────────────────────
// Шаблоны писем UpDown. Один layout, тексты по языкам.
// Стиль: сдержанный деловой (US business), без эмодзи и восклицаний.
// Языки: все 9 (en/ru — исходные, переводы uk/de/es/it/pt/zh/ar — в конце файла).
// ─────────────────────────────────────────────────────────────────────

export type Lang = 'en' | 'ru' | 'uk' | 'de' | 'es' | 'it' | 'pt' | 'zh' | 'ar';
export interface Email { subject: string; html: string; text: string }

const SITE = 'https://updown.team';
const SUPPORT_TG = 'https://t.me/Agent_X_support';
const GOLD = '#c9a84c';
const INK = '#16171d';

const esc = (s: any) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function fmtDate(d: Date | string, lang: Lang): string {
  const locale: Record<Lang, string> = {
    en: 'en-US', ru: 'ru-RU', uk: 'uk-UA', de: 'de-DE', es: 'es-ES', it: 'it-IT', pt: 'pt-PT', zh: 'zh-CN', ar: 'ar',
  };
  return new Date(d).toLocaleDateString(locale[lang] || 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}

// ── Общие строки ─────────────────────────────────────────────────────
const COMMON = {
  en: {
    footerWhy: 'You are receiving this email because an account at updown.team is associated with this address.',
    footerRisk: 'Trading involves substantial risk. Past performance does not guarantee future results.',
    questions: 'Questions? Reply to this email or contact support on Telegram',
    signoff: 'The UpDown Team',
  },
  ru: {
    footerWhy: 'Вы получили это письмо, потому что этот адрес связан с аккаунтом на updown.team.',
    footerRisk: 'Торговля на финансовых рынках связана со значительным риском. Прошлые результаты не гарантируют будущих.',
    questions: 'Есть вопросы? Ответьте на это письмо или напишите в поддержку в Telegram',
    signoff: 'Команда UpDown',
  },
};

// ── Layout ───────────────────────────────────────────────────────────
interface LayoutArgs {
  lang: Lang;
  preheader: string;
  heading: string;
  paragraphs: string[];         // уже экранированный HTML
  code?: string;                // крупный код подтверждения
  details?: [string, string][]; // таблица «параметр — значение»
  cta?: { label: string; url: string };
  after?: string[];             // абзацы после кнопки (экранированный HTML)
}

function layout(a: LayoutArgs): string {
  const c = (COMMON as any)[a.lang] || COMMON.en;
  const dir = a.lang === 'ar' ? 'rtl' : 'ltr';
  const p = (html: string) =>
    `<p style="margin:0 0 16px;font-size:15px;line-height:24px;color:#33343b">${html}</p>`;
  const code = a.code
    ? `<div style="margin:8px 0 24px;padding:18px 0;text-align:center;background:#f6f6f4;border:1px solid #e7e5df;border-radius:8px;font-family:'SFMono-Regular',Consolas,monospace;font-size:32px;letter-spacing:8px;font-weight:700;color:${INK}">${esc(a.code)}</div>`
    : '';
  const details = a.details?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;border-collapse:collapse;font-size:14px">${a.details
        .map(([k, v]) => `<tr><td style="padding:10px 0;border-bottom:1px solid #ecebe7;color:#6b6c74;width:42%">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid #ecebe7;color:${INK};font-weight:600">${esc(v)}</td></tr>`)
        .join('')}</table>`
    : '';
  const cta = a.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="border-radius:6px;background:${INK}"><a href="${esc(a.cta.url)}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px">${esc(a.cta.label)}</a></td></tr></table>`
    : '';
  return `<!doctype html>
<html lang="${a.lang}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(a.heading)}</title></head>
<body style="margin:0;padding:0;background:#f1f0ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(a.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f0ec"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 4px 18px"><span style="font-size:20px;font-weight:700;letter-spacing:-0.3px;color:${INK}"><span style="color:${GOLD}">&#8593;&#8595;</span> UpDown</span></td></tr>
<tr><td style="background:#ffffff;border:1px solid #e4e2dc;border-radius:10px;padding:36px 36px 20px">
<h1 style="margin:0 0 20px;font-size:22px;line-height:30px;font-weight:700;color:${INK}">${esc(a.heading)}</h1>
${a.paragraphs.map(p).join('\n')}
${code}${details}${cta}
${(a.after || []).map(p).join('\n')}
${p(`${esc(c.questions)} <a href="${SUPPORT_TG}" style="color:${INK}">@Agent_X_support</a>.`)}
${p(esc(c.signoff))}
</td></tr>
<tr><td style="padding:20px 8px 0;font-size:12px;line-height:18px;color:#8b8c93">
<p style="margin:0 0 8px">${esc(c.footerWhy)}</p>
<p style="margin:0 0 8px">${esc(c.footerRisk)}</p>
<p style="margin:0"><a href="${SITE}" style="color:#8b8c93">updown.team</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function toText(a: LayoutArgs): string {
  const strip = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  const c = (COMMON as any)[a.lang] || COMMON.en;
  return [
    a.heading, '',
    ...a.paragraphs.map(strip),
    a.code ? `\n${a.code}\n` : '',
    ...(a.details || []).map(([k, v]) => `${k}: ${v}`),
    a.cta ? `\n${a.cta.label}: ${a.cta.url}\n` : '',
    ...(a.after || []).map(strip),
    '', `${c.questions} @Agent_X_support`, '', c.signoff, '', '—', c.footerRisk,
  ].filter((x) => x !== undefined).join('\n');
}

function build(a: LayoutArgs, subject: string): Email {
  return { subject, html: layout(a), text: toText(a) };
}

function pick<T>(dict: Record<string, T>, lang: Lang): { t: T; lang: Lang } {
  if (dict[lang]) return { t: dict[lang], lang };
  return { t: dict.en, lang: 'en' };
}

// ── 1. Коды подтверждения ────────────────────────────────────────────
export type CodePurpose = 'registration' | 'login' | 'reset' | 'email_change';

const CODE = {
  en: {
    registration: {
      subject: (c: string) => `Your UpDown verification code: ${c}`,
      heading: 'Confirm your email address',
      lead: 'Enter this code on updown.team to finish creating your account.',
      ignore: 'If you did not request this, you can safely ignore this email. No account will be created.',
    },
    login: {
      subject: (c: string) => `Your UpDown sign-in code: ${c}`,
      heading: 'Your sign-in code',
      lead: 'Enter this code on updown.team to sign in to your account.',
      ignore: 'If you did not try to sign in, you can ignore this email. Your account remains secure.',
    },
    reset: {
      subject: (c: string) => `Your UpDown password reset code: ${c}`,
      heading: 'Reset your password',
      lead: 'Enter this code on updown.team to set a new password.',
      ignore: 'If you did not request a password reset, you can ignore this email. Your password will not change.',
    },
    email_change: {
      subject: (c: string) => `Confirm your new email address: ${c}`,
      heading: 'Confirm your new email address',
      lead: 'Enter this code in your UpDown profile to confirm this address.',
      ignore: 'If you did not request this change, you can ignore this email.',
    },
    expires: (m: string) => `The code expires in ${m} minutes.`,
    preheader: 'Your one-time code is inside.',
  },
  ru: {
    registration: {
      subject: (c: string) => `Код подтверждения UpDown: ${c}`,
      heading: 'Подтвердите адрес электронной почты',
      lead: 'Введите этот код на updown.team, чтобы завершить создание аккаунта.',
      ignore: 'Если вы не запрашивали код, просто проигнорируйте это письмо. Аккаунт не будет создан.',
    },
    login: {
      subject: (c: string) => `Код для входа в UpDown: ${c}`,
      heading: 'Код для входа',
      lead: 'Введите этот код на updown.team, чтобы войти в аккаунт.',
      ignore: 'Если вы не пытались войти, проигнорируйте это письмо. Ваш аккаунт в безопасности.',
    },
    reset: {
      subject: (c: string) => `Код для сброса пароля UpDown: ${c}`,
      heading: 'Сброс пароля',
      lead: 'Введите этот код на updown.team, чтобы задать новый пароль.',
      ignore: 'Если вы не запрашивали сброс пароля, проигнорируйте это письмо. Пароль не изменится.',
    },
    email_change: {
      subject: (c: string) => `Подтвердите новый адрес: ${c}`,
      heading: 'Подтвердите новый адрес электронной почты',
      lead: 'Введите этот код в профиле UpDown, чтобы подтвердить этот адрес.',
      ignore: 'Если вы не меняли адрес, проигнорируйте это письмо.',
    },
    expires: (m: string) => `Код действует ${m} минут.`,
    preheader: 'Внутри — одноразовый код.',
  },
};

export function codeEmail(lang: Lang, purpose: CodePurpose, code: string, ttlMinutes: string | number = 10): Email {
  const { t, lang: l } = pick(CODE as any, lang);
  const v = (t as any)[purpose];
  return build({
    lang: l, preheader: (t as any).preheader, heading: v.heading,
    paragraphs: [esc(v.lead)], code,
    after: [esc((t as any).expires(String(ttlMinutes))), esc(v.ignore)],
  }, v.subject(code));
}

// ── 2. Приветствие + FREE ────────────────────────────────────────────
const WELCOME = {
  en: {
    subject: 'Welcome to UpDown — your free access is active',
    preheader: 'Your 7-day FREE access and what to do first.',
    heading: 'Welcome to UpDown',
    lead: 'Thank you for creating an account. Your complimentary access is now active:',
    items: {
      magnet: 'Magnet Pro indicator for TradingView',
      pro: 'UpDown PRO signal service',
      digest: 'UpDown Digest market brief',
      days7: '7 days',
      forever: 'no expiration',
    },
    until: (d: string) => `Your 7-day access runs through ${d}.`,
    next: 'To receive Magnet Pro, open My Access and submit your TradingView username. Our team grants indicator access manually, usually within one hour and no later than 12 hours.',
    cta: 'Go to My Access',
  },
  ru: {
    subject: 'Добро пожаловать в UpDown — бесплатный доступ активирован',
    preheader: 'Ваш бесплатный доступ на 7 дней и что сделать в первую очередь.',
    heading: 'Добро пожаловать в UpDown',
    lead: 'Благодарим за регистрацию. Ваш бесплатный доступ уже активирован:',
    items: {
      magnet: 'Индикатор Magnet Pro для TradingView',
      pro: 'Сигнальный сервис UpDown PRO',
      digest: 'Обзор рынка UpDown Digest',
      days7: '7 дней',
      forever: 'бессрочно',
    },
    until: (d: string) => `Доступ на 7 дней действует до ${d} включительно.`,
    next: 'Чтобы получить Magnet Pro, откройте «Мои доступы» и укажите ваш ник в TradingView. Доступ к индикатору выдаёт наша команда вручную — обычно в течение часа, не позднее 12 часов.',
    cta: 'Открыть «Мои доступы»',
  },
};

export function welcomeEmail(lang: Lang, trialEndsAt: Date | null): Email {
  const { t, lang: l } = pick(WELCOME as any, lang) as any;
  const details: [string, string][] = [];
  if (trialEndsAt) {
    details.push([t.items.magnet, t.items.days7]);
    details.push([t.items.pro, t.items.days7]);
  }
  details.push([t.items.digest, t.items.forever]);
  return build({
    lang: l, preheader: t.preheader, heading: t.heading,
    paragraphs: [esc(t.lead)], details,
    after: [trialEndsAt ? esc(t.until(fmtDate(trialEndsAt, l))) : '', esc(t.next)].filter(Boolean),
    cta: { label: t.cta, url: `${SITE}/dashboard/access` },
  }, t.subject);
}

// ── 3. TradingView: доступ выдан ─────────────────────────────────────
const TV_OK = {
  en: {
    subject: (p: string) => `Your TradingView access to ${p} is active`,
    preheader: 'How to find the indicator in TradingView.',
    heading: 'Your indicator access is active',
    lead: (p: string, n: string) => `We have granted access to <strong>${p}</strong> for the TradingView account <strong>${n}</strong>.`,
    until: 'Access valid through',
    how: 'To add it to a chart: open TradingView, click Indicators, select the Invite-only scripts tab, and choose the indicator. If it does not appear, reload the page.',
    cta: 'Open TradingView',
  },
  ru: {
    subject: (p: string) => `Доступ к ${p} в TradingView открыт`,
    preheader: 'Как найти индикатор в TradingView.',
    heading: 'Доступ к индикатору открыт',
    lead: (p: string, n: string) => `Мы открыли доступ к <strong>${p}</strong> для аккаунта TradingView <strong>${n}</strong>.`,
    until: 'Доступ действует до',
    how: 'Чтобы добавить индикатор на график: откройте TradingView, нажмите «Индикаторы», перейдите на вкладку «Скрипты только по приглашению» и выберите индикатор. Если его нет в списке, обновите страницу.',
    cta: 'Открыть TradingView',
  },
};

export function tvGrantedEmail(lang: Lang, products: string[], tvUsername: string, until: Date | null): Email {
  const { t, lang: l } = pick(TV_OK as any, lang) as any;
  const names = products.join(', ');
  return build({
    lang: l, preheader: t.preheader, heading: t.heading,
    paragraphs: [t.lead(esc(names), esc(tvUsername))],
    details: until ? [[t.until, fmtDate(until, l)]] : [],
    after: [esc(t.how)],
    cta: { label: t.cta, url: 'https://www.tradingview.com/chart/' },
  }, t.subject(names));
}

// ── 4. TradingView: ник не найден ────────────────────────────────────
const TV_NF = {
  en: {
    subject: 'Action required: please confirm your TradingView username',
    preheader: 'We could not find the TradingView profile you entered.',
    heading: 'Please check your TradingView username',
    lead: (n: string) => `We could not find a TradingView profile with the username <strong>${n}</strong>, so indicator access has not been granted yet.`,
    how: 'Your username is shown in the top-right menu of TradingView and in your profile address (tradingview.com/u/username). Please enter it exactly as shown and submit it again.',
    cta: 'Update username',
  },
  ru: {
    subject: 'Требуется действие: проверьте ник TradingView',
    preheader: 'Мы не нашли профиль TradingView с указанным ником.',
    heading: 'Проверьте ник в TradingView',
    lead: (n: string) => `Мы не нашли профиль TradingView с ником <strong>${n}</strong>, поэтому доступ к индикатору пока не выдан.`,
    how: 'Ник указан в меню профиля TradingView (справа вверху) и в адресе вашего профиля (tradingview.com/u/ник). Введите его точно так же и отправьте ещё раз.',
    cta: 'Указать ник',
  },
};

export function tvNotFoundEmail(lang: Lang, tvUsername: string): Email {
  const { t, lang: l } = pick(TV_NF as any, lang) as any;
  return build({
    lang: l, preheader: t.preheader, heading: t.heading,
    paragraphs: [t.lead(esc(tvUsername))], after: [esc(t.how)],
    cta: { label: t.cta, url: `${SITE}/dashboard/access` },
  }, t.subject);
}

// ── 5. Оплата получена ───────────────────────────────────────────────
const PAID = {
  en: {
    subject: (id: string) => `Payment received — order ${id}`,
    preheader: 'Your access is active.',
    heading: 'Payment received',
    lead: 'Thank you for your purchase. Your payment has been confirmed and your access is now active.',
    order: 'Order', amount: 'Amount', date: 'Date',
    next: 'Open My Access to connect the Telegram channels and submit your TradingView username for indicators.',
    cta: 'Go to My Access',
  },
  ru: {
    subject: (id: string) => `Оплата получена — заказ ${id}`,
    preheader: 'Ваш доступ активирован.',
    heading: 'Оплата получена',
    lead: 'Благодарим за покупку. Оплата подтверждена, доступ активирован.',
    order: 'Заказ', amount: 'Сумма', date: 'Дата',
    next: 'Откройте «Мои доступы», чтобы подключить Telegram-каналы и указать ник TradingView для индикаторов.',
    cta: 'Открыть «Мои доступы»',
  },
};

export function paymentEmail(lang: Lang, orderId: string, amount: string, currency: string, paidAt: Date = new Date()): Email {
  const { t, lang: l } = pick(PAID as any, lang) as any;
  const id = String(orderId).slice(0, 8).toUpperCase();
  return build({
    lang: l, preheader: t.preheader, heading: t.heading,
    paragraphs: [esc(t.lead)],
    details: [[t.order, id], [t.amount, `${amount} ${currency}`], [t.date, fmtDate(paidAt, l)]],
    after: [esc(t.next)],
    cta: { label: t.cta, url: `${SITE}/dashboard/access` },
  }, t.subject(id));
}

// ── 6. Партнёрская заявка: решение ───────────────────────────────────
const PARTNER = {
  en: {
    approved: { subject: 'Your UpDown partner application has been approved', heading: 'Your partner application is approved', lead: 'We are pleased to confirm your partnership with UpDown. Sign in to set up your Telegram bot and channels.', cta: 'Open partner dashboard' },
    rejected: { subject: 'Update on your UpDown partner application', heading: 'Update on your partner application', lead: 'Thank you for your interest in partnering with UpDown. After review, we are unable to approve your application at this time.', cta: 'Visit updown.team' },
    reason: 'Comment from our team',
    preheader: 'A decision has been made on your application.',
  },
  ru: {
    approved: { subject: 'Ваша заявка на партнёрство с UpDown одобрена', heading: 'Заявка на партнёрство одобрена', lead: 'Рады подтвердить наше партнёрство. Войдите в кабинет, чтобы настроить Telegram-бота и каналы.', cta: 'Открыть кабинет партнёра' },
    rejected: { subject: 'Решение по вашей заявке на партнёрство', heading: 'Решение по заявке на партнёрство', lead: 'Благодарим за интерес к партнёрству с UpDown. По итогам рассмотрения мы не можем одобрить заявку в настоящий момент.', cta: 'Перейти на updown.team' },
    reason: 'Комментарий команды',
    preheader: 'По вашей заявке принято решение.',
  },
};

export function partnerStatusEmail(lang: Lang, approved: boolean, reason?: string): Email {
  const { t, lang: l } = pick(PARTNER as any, lang) as any;
  const v = approved ? t.approved : t.rejected;
  return build({
    lang: l, preheader: t.preheader, heading: v.heading,
    paragraphs: [esc(v.lead)],
    details: reason ? [[t.reason, reason]] : [],
    cta: { label: v.cta, url: approved ? `${SITE}/dashboard/partner/bot` : SITE },
  }, v.subject);
}

export function normalizeLang(x?: string | null): Lang {
  const s = String(x || '').slice(0, 2).toLowerCase();
  return (['en', 'ru', 'uk', 'de', 'es', 'it', 'pt', 'zh', 'ar'] as Lang[]).includes(s as Lang) ? (s as Lang) : 'en';
}

// ── Цепочка писем после регистрации (Спринт 5, ЧЕРНОВИК на согласование) ──
const CHAIN = {
  en: {
    d1: {
      subject: 'Getting started with Magnet Pro',
      preheader: 'What the indicator shows and how to use it on your first chart.',
      heading: 'Getting started with Magnet Pro',
      p: [
        'Magnet Pro maps the areas of market interest above and below the current price, so you know where to pay closer attention.',
        'A practical way to start: open BTC/USDT on the 1H chart, add Magnet Pro, and note the two nearest zones. When price approaches one of them, watch the reaction: a slowdown, a rejection, or a breakout.',
        'Magnet Pro is not a buy or sell signal. It shows where to look; the decision remains yours.',
      ],
      cta: 'Go to My Access',
      url: '/dashboard/access',
    },
    d3: {
      subject: 'How to read an UpDown PRO signal',
      preheader: 'Entry zone, targets, protective level: what each part means.',
      heading: 'How to read an UpDown PRO signal',
      p: [
        'Each signal in UpDown PRO follows the same structure: instrument and direction, entry zone, targets, and a protective level.',
        'Enter within the zone rather than at a single price, take partial profit at the first target, and size your position so that reaching the protective level costs you no more than you are prepared to lose.',
        'Your FREE access to UpDown PRO continues for four more days.',
      ],
      cta: 'Open UpDown PRO',
      url: '/dashboard/access',
    },
    d5: {
      subject: 'Join our live trading session on Wednesday',
      preheader: 'Your first session is complimentary. Registration is required.',
      heading: 'Trade alongside our team on Wednesday',
      p: [
        'Every Wednesday our traders analyze the market and trade in real time on Zoom. You see how context, levels and price reaction come together into a decision.',
        'Your first session is complimentary. Register in advance and we will send you the link one hour before the start.',
      ],
      cta: 'Reserve my seat',
      url: '/dashboard',
    },
    d7: {
      subject: 'Your FREE access ends today',
      preheader: 'What remains available and how to continue.',
      heading: 'Your FREE access ends today',
      p: [
        'Your 7-day access to Magnet Pro and UpDown PRO ends today. UpDown Digest remains available to you at no cost.',
        'To continue, choose a plan: START (49 USDT per month), PRO (99 USDT per month) or ELITE (149 USDT per month). Indicators and signal services are also available individually.',
      ],
      cta: 'Compare plans',
      url: '/dashboard/shop',
    },
  },
  ru: {
    d1: {
      subject: 'Как начать работать с Magnet Pro',
      preheader: 'Что показывает индикатор и как применить его на первом графике.',
      heading: 'Как начать работать с Magnet Pro',
      p: [
        'Magnet Pro показывает области рыночного интереса выше и ниже текущей цены — места, где стоит внимательнее следить за рынком.',
        'Для начала откройте BTC/USDT на часовом графике, добавьте Magnet Pro и отметьте две ближайшие зоны. Когда цена подойдёт к одной из них, наблюдайте за реакцией: замедление, отбой или пробой.',
        'Magnet Pro — не сигнал на покупку или продажу. Он показывает, куда смотреть; решение остаётся за вами.',
      ],
      cta: 'Открыть «Мои доступы»',
      url: '/dashboard/access',
    },
    d3: {
      subject: 'Как читать сигнал UpDown PRO',
      preheader: 'Зона входа, цели, защитный уровень: что означает каждая часть.',
      heading: 'Как читать сигнал UpDown PRO',
      p: [
        'Каждый сигнал в UpDown PRO устроен одинаково: инструмент и направление, зона входа, цели и защитный уровень.',
        'Входите в пределах зоны, а не по одной цене, фиксируйте часть прибыли на первой цели и подбирайте объём так, чтобы достижение защитного уровня стоило вам не больше, чем вы готовы потерять.',
        'Бесплатный доступ к UpDown PRO действует ещё четыре дня.',
      ],
      cta: 'Открыть UpDown PRO',
      url: '/dashboard/access',
    },
    d5: {
      subject: 'Приглашаем на онлайн-торговлю в среду',
      preheader: 'Первое участие бесплатно. Нужна предварительная запись.',
      heading: 'Торгуйте вместе с нашей командой в среду',
      p: [
        'Каждую среду наши трейдеры разбирают рынок и торгуют в реальном времени в Zoom. Вы увидите, как контекст, уровни и реакция цены складываются в решение.',
        'Первое участие бесплатно. Запишитесь заранее — ссылку пришлём за час до начала.',
      ],
      cta: 'Записаться',
      url: '/dashboard',
    },
    d7: {
      subject: 'Сегодня заканчивается бесплатный доступ',
      preheader: 'Что остаётся доступным и как продолжить.',
      heading: 'Сегодня заканчивается бесплатный доступ',
      p: [
        'Сегодня заканчивается 7-дневный доступ к Magnet Pro и UpDown PRO. UpDown Digest остаётся доступен бесплатно.',
        'Чтобы продолжить, выберите тариф: START (49 USDT в месяц), PRO (99 USDT в месяц) или ELITE (149 USDT в месяц). Индикаторы и сигнальные сервисы также доступны по отдельности.',
      ],
      cta: 'Сравнить тарифы',
      url: '/dashboard/shop',
    },
  },
};

export type ChainDay = 'd1' | 'd3' | 'd5' | 'd7';

export function chainEmail(lang: Lang, day: ChainDay): Email {
  const { t, lang: l } = pick(CHAIN as any, lang) as any;
  const v = t[day];
  return build({
    lang: l, preheader: v.preheader, heading: v.heading,
    paragraphs: v.p.map(esc), cta: { label: v.cta, url: `${SITE}${v.url}` },
  }, v.subject);
}

// ═════════════════════════════════════════════════════════════════════
// Переводы утверждённых писем (uk, de, es, it, pt, zh, ar).
// Добавляются к словарям выше; pick() берёт язык пользователя, иначе en.
// ═════════════════════════════════════════════════════════════════════
Object.assign(COMMON as any, {
  uk: {
    footerWhy: 'Ви отримали цей лист, тому що ця адреса пов’язана з акаунтом на updown.team.',
    footerRisk: 'Торгівля на фінансових ринках пов’язана зі значним ризиком. Минулі результати не гарантують майбутніх.',
    questions: 'Маєте запитання? Дайте відповідь на цей лист або напишіть у підтримку в Telegram',
    signoff: 'Команда UpDown',
  },
  de: {
    footerWhy: 'Sie erhalten diese E-Mail, weil diese Adresse mit einem Konto auf updown.team verknüpft ist.',
    footerRisk: 'Der Handel ist mit erheblichen Risiken verbunden. Vergangene Ergebnisse garantieren keine zukünftigen Ergebnisse.',
    questions: 'Fragen? Antworten Sie auf diese E-Mail oder kontaktieren Sie den Support in Telegram',
    signoff: 'Ihr UpDown-Team',
  },
  es: {
    footerWhy: 'Recibe este correo porque esta dirección está asociada a una cuenta en updown.team.',
    footerRisk: 'Operar en los mercados implica un riesgo considerable. Los resultados pasados no garantizan resultados futuros.',
    questions: '¿Tiene preguntas? Responda a este correo o contacte con soporte en Telegram',
    signoff: 'El equipo de UpDown',
  },
  it: {
    footerWhy: 'Ricevi questa email perché questo indirizzo è associato a un account su updown.team.',
    footerRisk: 'Il trading comporta un rischio significativo. I risultati passati non garantiscono quelli futuri.',
    questions: 'Domande? Rispondi a questa email o contatta il supporto su Telegram',
    signoff: 'Il team di UpDown',
  },
  pt: {
    footerWhy: 'Você recebeu este email porque este endereço está associado a uma conta em updown.team.',
    footerRisk: 'Operar nos mercados envolve risco significativo. Resultados passados não garantem resultados futuros.',
    questions: 'Dúvidas? Responda a este email ou fale com o suporte no Telegram',
    signoff: 'Equipe UpDown',
  },
  zh: {
    footerWhy: '您收到此邮件，是因为该地址已关联 updown.team 账户。',
    footerRisk: '交易存在重大风险。过往表现不代表未来结果。',
    questions: '如有疑问，请直接回复此邮件，或通过 Telegram 联系客服',
    signoff: 'UpDown 团队',
  },
  ar: {
    footerWhy: 'تلقيت هذه الرسالة لأن هذا العنوان مرتبط بحساب على updown.team.',
    footerRisk: 'ينطوي التداول على مخاطر كبيرة. النتائج السابقة لا تضمن النتائج المستقبلية.',
    questions: 'لديك أسئلة؟ ردّ على هذه الرسالة أو تواصل مع الدعم عبر Telegram',
    signoff: 'فريق UpDown',
  },
});

Object.assign(CODE as any, {
  uk: {
    registration: { subject: (c: string) => `Код підтвердження UpDown: ${c}`, heading: 'Підтвердьте адресу електронної пошти', lead: 'Введіть цей код на updown.team, щоб завершити створення акаунта.', ignore: 'Якщо ви не запитували код, просто проігноруйте цей лист. Акаунт не буде створено.' },
    login: { subject: (c: string) => `Код для входу в UpDown: ${c}`, heading: 'Код для входу', lead: 'Введіть цей код на updown.team, щоб увійти в акаунт.', ignore: 'Якщо ви не намагалися увійти, проігноруйте цей лист. Ваш акаунт у безпеці.' },
    reset: { subject: (c: string) => `Код для скидання пароля UpDown: ${c}`, heading: 'Скидання пароля', lead: 'Введіть цей код на updown.team, щоб встановити новий пароль.', ignore: 'Якщо ви не запитували скидання пароля, проігноруйте цей лист. Пароль не зміниться.' },
    email_change: { subject: (c: string) => `Підтвердьте нову адресу: ${c}`, heading: 'Підтвердьте нову адресу електронної пошти', lead: 'Введіть цей код у профілі UpDown, щоб підтвердити цю адресу.', ignore: 'Якщо ви не змінювали адресу, проігноруйте цей лист.' },
    expires: (m: string) => `Код дійсний ${m} хвилин.`,
    preheader: 'Усередині — одноразовий код.',
  },
  de: {
    registration: { subject: (c: string) => `Ihr UpDown-Bestätigungscode: ${c}`, heading: 'Bestätigen Sie Ihre E-Mail-Adresse', lead: 'Geben Sie diesen Code auf updown.team ein, um die Erstellung Ihres Kontos abzuschließen.', ignore: 'Wenn Sie diesen Code nicht angefordert haben, können Sie diese E-Mail ignorieren. Es wird kein Konto erstellt.' },
    login: { subject: (c: string) => `Ihr UpDown-Anmeldecode: ${c}`, heading: 'Ihr Anmeldecode', lead: 'Geben Sie diesen Code auf updown.team ein, um sich bei Ihrem Konto anzumelden.', ignore: 'Wenn Sie sich nicht anmelden wollten, können Sie diese E-Mail ignorieren. Ihr Konto bleibt sicher.' },
    reset: { subject: (c: string) => `Ihr UpDown-Code zum Zurücksetzen des Passworts: ${c}`, heading: 'Passwort zurücksetzen', lead: 'Geben Sie diesen Code auf updown.team ein, um ein neues Passwort festzulegen.', ignore: 'Wenn Sie kein Zurücksetzen angefordert haben, können Sie diese E-Mail ignorieren. Ihr Passwort bleibt unverändert.' },
    email_change: { subject: (c: string) => `Bestätigen Sie Ihre neue E-Mail-Adresse: ${c}`, heading: 'Bestätigen Sie Ihre neue E-Mail-Adresse', lead: 'Geben Sie diesen Code in Ihrem UpDown-Profil ein, um diese Adresse zu bestätigen.', ignore: 'Wenn Sie diese Änderung nicht angefordert haben, können Sie diese E-Mail ignorieren.' },
    expires: (m: string) => `Der Code ist ${m} Minuten gültig.`,
    preheader: 'Ihr Einmalcode ist enthalten.',
  },
  es: {
    registration: { subject: (c: string) => `Su código de verificación de UpDown: ${c}`, heading: 'Confirme su dirección de correo', lead: 'Introduzca este código en updown.team para terminar de crear su cuenta.', ignore: 'Si no solicitó este código, puede ignorar este correo. No se creará ninguna cuenta.' },
    login: { subject: (c: string) => `Su código de acceso a UpDown: ${c}`, heading: 'Su código de acceso', lead: 'Introduzca este código en updown.team para acceder a su cuenta.', ignore: 'Si no intentó acceder, puede ignorar este correo. Su cuenta sigue protegida.' },
    reset: { subject: (c: string) => `Su código para restablecer la contraseña de UpDown: ${c}`, heading: 'Restablezca su contraseña', lead: 'Introduzca este código en updown.team para establecer una nueva contraseña.', ignore: 'Si no solicitó restablecer la contraseña, puede ignorar este correo. Su contraseña no cambiará.' },
    email_change: { subject: (c: string) => `Confirme su nueva dirección de correo: ${c}`, heading: 'Confirme su nueva dirección de correo', lead: 'Introduzca este código en su perfil de UpDown para confirmar esta dirección.', ignore: 'Si no solicitó este cambio, puede ignorar este correo.' },
    expires: (m: string) => `El código caduca en ${m} minutos.`,
    preheader: 'Su código de un solo uso está dentro.',
  },
  it: {
    registration: { subject: (c: string) => `Il tuo codice di verifica UpDown: ${c}`, heading: 'Conferma il tuo indirizzo email', lead: 'Inserisci questo codice su updown.team per completare la creazione del tuo account.', ignore: 'Se non hai richiesto questo codice, puoi ignorare questa email. Nessun account verrà creato.' },
    login: { subject: (c: string) => `Il tuo codice di accesso UpDown: ${c}`, heading: 'Il tuo codice di accesso', lead: 'Inserisci questo codice su updown.team per accedere al tuo account.', ignore: 'Se non hai tentato di accedere, puoi ignorare questa email. Il tuo account resta protetto.' },
    reset: { subject: (c: string) => `Il tuo codice per reimpostare la password UpDown: ${c}`, heading: 'Reimposta la password', lead: 'Inserisci questo codice su updown.team per impostare una nuova password.', ignore: 'Se non hai richiesto la reimpostazione, puoi ignorare questa email. La password non cambierà.' },
    email_change: { subject: (c: string) => `Conferma il nuovo indirizzo email: ${c}`, heading: 'Conferma il nuovo indirizzo email', lead: 'Inserisci questo codice nel tuo profilo UpDown per confermare questo indirizzo.', ignore: 'Se non hai richiesto questa modifica, puoi ignorare questa email.' },
    expires: (m: string) => `Il codice scade tra ${m} minuti.`,
    preheader: 'All’interno trovi il tuo codice monouso.',
  },
  pt: {
    registration: { subject: (c: string) => `Seu código de verificação UpDown: ${c}`, heading: 'Confirme seu endereço de email', lead: 'Digite este código em updown.team para concluir a criação da sua conta.', ignore: 'Se você não solicitou este código, pode ignorar este email. Nenhuma conta será criada.' },
    login: { subject: (c: string) => `Seu código de acesso UpDown: ${c}`, heading: 'Seu código de acesso', lead: 'Digite este código em updown.team para entrar na sua conta.', ignore: 'Se você não tentou entrar, pode ignorar este email. Sua conta continua protegida.' },
    reset: { subject: (c: string) => `Seu código para redefinir a senha UpDown: ${c}`, heading: 'Redefina sua senha', lead: 'Digite este código em updown.team para definir uma nova senha.', ignore: 'Se você não solicitou a redefinição, pode ignorar este email. Sua senha não será alterada.' },
    email_change: { subject: (c: string) => `Confirme seu novo endereço de email: ${c}`, heading: 'Confirme seu novo endereço de email', lead: 'Digite este código no seu perfil UpDown para confirmar este endereço.', ignore: 'Se você não solicitou esta alteração, pode ignorar este email.' },
    expires: (m: string) => `O código expira em ${m} minutos.`,
    preheader: 'Seu código de uso único está aqui.',
  },
  zh: {
    registration: { subject: (c: string) => `您的 UpDown 验证码：${c}`, heading: '确认您的邮箱地址', lead: '请在 updown.team 输入此验证码，完成账户创建。', ignore: '如果您没有申请验证码，请忽略此邮件，系统不会创建账户。' },
    login: { subject: (c: string) => `您的 UpDown 登录验证码：${c}`, heading: '您的登录验证码', lead: '请在 updown.team 输入此验证码登录您的账户。', ignore: '如果您没有尝试登录，请忽略此邮件，您的账户仍然安全。' },
    reset: { subject: (c: string) => `您的 UpDown 密码重置验证码：${c}`, heading: '重置密码', lead: '请在 updown.team 输入此验证码设置新密码。', ignore: '如果您没有申请重置密码，请忽略此邮件，密码不会改变。' },
    email_change: { subject: (c: string) => `确认您的新邮箱地址：${c}`, heading: '确认您的新邮箱地址', lead: '请在 UpDown 个人资料中输入此验证码以确认该地址。', ignore: '如果您没有申请此更改，请忽略此邮件。' },
    expires: (m: string) => `验证码 ${m} 分钟内有效。`,
    preheader: '您的一次性验证码在此邮件中。',
  },
  ar: {
    registration: { subject: (c: string) => `رمز التحقق من UpDown: ${c}`, heading: 'أكّد عنوان بريدك الإلكتروني', lead: 'أدخل هذا الرمز على updown.team لإكمال إنشاء حسابك.', ignore: 'إذا لم تطلب هذا الرمز، يمكنك تجاهل هذه الرسالة. لن يتم إنشاء أي حساب.' },
    login: { subject: (c: string) => `رمز تسجيل الدخول إلى UpDown: ${c}`, heading: 'رمز تسجيل الدخول', lead: 'أدخل هذا الرمز على updown.team لتسجيل الدخول إلى حسابك.', ignore: 'إذا لم تحاول تسجيل الدخول، يمكنك تجاهل هذه الرسالة. حسابك آمن.' },
    reset: { subject: (c: string) => `رمز إعادة تعيين كلمة مرور UpDown: ${c}`, heading: 'إعادة تعيين كلمة المرور', lead: 'أدخل هذا الرمز على updown.team لتعيين كلمة مرور جديدة.', ignore: 'إذا لم تطلب إعادة التعيين، يمكنك تجاهل هذه الرسالة. لن تتغير كلمة المرور.' },
    email_change: { subject: (c: string) => `أكّد عنوان بريدك الجديد: ${c}`, heading: 'أكّد عنوان بريدك الإلكتروني الجديد', lead: 'أدخل هذا الرمز في ملفك الشخصي على UpDown لتأكيد هذا العنوان.', ignore: 'إذا لم تطلب هذا التغيير، يمكنك تجاهل هذه الرسالة.' },
    expires: (m: string) => `ينتهي الرمز خلال ${m} دقيقة.`,
    preheader: 'رمزك لمرة واحدة في الداخل.',
  },
});

const WELCOME_ITEMS = (magnet: string, pro: string, digest: string, days7: string, forever: string) => ({ magnet, pro, digest, days7, forever });
Object.assign(WELCOME as any, {
  uk: {
    subject: 'Ласкаво просимо до UpDown — безкоштовний доступ активовано',
    preheader: 'Ваш безкоштовний доступ на 7 днів і що зробити насамперед.',
    heading: 'Ласкаво просимо до UpDown',
    lead: 'Дякуємо за реєстрацію. Ваш безкоштовний доступ уже активовано:',
    items: WELCOME_ITEMS('Індикатор Magnet Pro для TradingView', 'Сигнальний сервіс UpDown PRO', 'Огляд ринку UpDown Digest', '7 днів', 'безстроково'),
    until: (d: string) => `Доступ на 7 днів діє до ${d} включно.`,
    next: 'Щоб отримати Magnet Pro, відкрийте «Мої доступи» та вкажіть ваш нік у TradingView. Доступ до індикатора наша команда видає вручну — зазвичай протягом години, не пізніше 12 годин.',
    cta: 'Відкрити «Мої доступи»',
  },
  de: {
    subject: 'Willkommen bei UpDown – Ihr kostenloser Zugang ist aktiv',
    preheader: 'Ihr 7-tägiger kostenloser Zugang und die ersten Schritte.',
    heading: 'Willkommen bei UpDown',
    lead: 'Vielen Dank für Ihre Registrierung. Ihr kostenloser Zugang ist jetzt aktiv:',
    items: WELCOME_ITEMS('Magnet Pro Indikator für TradingView', 'UpDown PRO Signaldienst', 'UpDown Digest Marktüberblick', '7 Tage', 'unbefristet'),
    until: (d: string) => `Ihr 7-tägiger Zugang gilt bis einschließlich ${d}.`,
    next: 'Um Magnet Pro zu erhalten, öffnen Sie „Meine Zugänge“ und geben Sie Ihren TradingView-Benutzernamen ein. Unser Team schaltet den Indikator manuell frei, in der Regel innerhalb einer Stunde und spätestens nach 12 Stunden.',
    cta: 'Zu meinen Zugängen',
  },
  es: {
    subject: 'Bienvenido a UpDown: su acceso gratuito está activo',
    preheader: 'Su acceso gratuito de 7 días y qué hacer primero.',
    heading: 'Bienvenido a UpDown',
    lead: 'Gracias por crear su cuenta. Su acceso gratuito ya está activo:',
    items: WELCOME_ITEMS('Indicador Magnet Pro para TradingView', 'Servicio de señales UpDown PRO', 'Resumen de mercado UpDown Digest', '7 días', 'sin vencimiento'),
    until: (d: string) => `Su acceso de 7 días es válido hasta el ${d} inclusive.`,
    next: 'Para recibir Magnet Pro, abra Mis accesos e introduzca su usuario de TradingView. Nuestro equipo concede el acceso al indicador manualmente, normalmente en menos de una hora y como máximo en 12 horas.',
    cta: 'Ir a Mis accesos',
  },
  it: {
    subject: 'Benvenuto in UpDown: il tuo accesso gratuito è attivo',
    preheader: 'Il tuo accesso gratuito di 7 giorni e cosa fare per primo.',
    heading: 'Benvenuto in UpDown',
    lead: 'Grazie per aver creato il tuo account. Il tuo accesso gratuito è ora attivo:',
    items: WELCOME_ITEMS('Indicatore Magnet Pro per TradingView', 'Servizio di segnali UpDown PRO', 'Panoramica di mercato UpDown Digest', '7 giorni', 'senza scadenza'),
    until: (d: string) => `Il tuo accesso di 7 giorni è valido fino al ${d} incluso.`,
    next: 'Per ricevere Magnet Pro, apri I miei accessi e inserisci il tuo nome utente TradingView. Il nostro team concede l’accesso all’indicatore manualmente, di solito entro un’ora e non oltre 12 ore.',
    cta: 'Vai a I miei accessi',
  },
  pt: {
    subject: 'Bem-vindo ao UpDown — seu acesso gratuito está ativo',
    preheader: 'Seu acesso gratuito de 7 dias e o que fazer primeiro.',
    heading: 'Bem-vindo ao UpDown',
    lead: 'Obrigado por criar sua conta. Seu acesso gratuito já está ativo:',
    items: WELCOME_ITEMS('Indicador Magnet Pro para TradingView', 'Serviço de sinais UpDown PRO', 'Resumo de mercado UpDown Digest', '7 dias', 'sem prazo'),
    until: (d: string) => `Seu acesso de 7 dias vale até ${d}, inclusive.`,
    next: 'Para receber o Magnet Pro, abra Meus acessos e informe seu usuário do TradingView. Nossa equipe libera o indicador manualmente, geralmente em até uma hora e no máximo em 12 horas.',
    cta: 'Ir para Meus acessos',
  },
  zh: {
    subject: '欢迎加入 UpDown — 您的免费访问已激活',
    preheader: '您的 7 天免费访问及首先要做的事。',
    heading: '欢迎加入 UpDown',
    lead: '感谢您创建账户。您的免费访问现已激活：',
    items: WELCOME_ITEMS('TradingView 指标 Magnet Pro', 'UpDown PRO 信号服务', 'UpDown Digest 市场简报', '7 天', '永久有效'),
    until: (d: string) => `您的 7 天访问有效期至 ${d}（含当天）。`,
    next: '如需获取 Magnet Pro，请打开“我的访问”并填写您的 TradingView 用户名。我们的团队将手动开通指标访问，通常在一小时内完成，最迟不超过 12 小时。',
    cta: '打开“我的访问”',
  },
  ar: {
    subject: 'مرحباً بك في UpDown — تم تفعيل وصولك المجاني',
    preheader: 'وصولك المجاني لمدة 7 أيام وما يجب فعله أولاً.',
    heading: 'مرحباً بك في UpDown',
    lead: 'شكراً لإنشاء حسابك. تم تفعيل وصولك المجاني:',
    items: WELCOME_ITEMS('مؤشر Magnet Pro على TradingView', 'خدمة إشارات UpDown PRO', 'ملخص السوق UpDown Digest', '7 أيام', 'دون تاريخ انتهاء'),
    until: (d: string) => `يسري وصولك لمدة 7 أيام حتى ${d} ضمناً.`,
    next: 'للحصول على Magnet Pro، افتح «وصولي» وأدخل اسم المستخدم في TradingView. يفعّل فريقنا الوصول إلى المؤشر يدوياً، عادةً خلال ساعة وفي موعد أقصاه 12 ساعة.',
    cta: 'فتح «وصولي»',
  },
});

Object.assign(TV_OK as any, {
  uk: { subject: (p: string) => `Доступ до ${p} у TradingView відкрито`, preheader: 'Як знайти індикатор у TradingView.', heading: 'Доступ до індикатора відкрито', lead: (p: string, n: string) => `Ми відкрили доступ до <strong>${p}</strong> для акаунта TradingView <strong>${n}</strong>.`, until: 'Доступ діє до', how: 'Щоб додати індикатор на графік: відкрийте TradingView, натисніть «Індикатори», перейдіть на вкладку «Скрипти лише за запрошенням» і виберіть індикатор. Якщо його немає у списку, оновіть сторінку.', cta: 'Відкрити TradingView' },
  de: { subject: (p: string) => `Ihr TradingView-Zugang zu ${p} ist aktiv`, preheader: 'So finden Sie den Indikator in TradingView.', heading: 'Ihr Indikatorzugang ist aktiv', lead: (p: string, n: string) => `Wir haben den Zugang zu <strong>${p}</strong> für das TradingView-Konto <strong>${n}</strong> freigeschaltet.`, until: 'Zugang gültig bis', how: 'So fügen Sie ihn einem Chart hinzu: Öffnen Sie TradingView, klicken Sie auf Indikatoren, wählen Sie den Reiter Nur-auf-Einladung-Skripte und dann den Indikator. Falls er nicht erscheint, laden Sie die Seite neu.', cta: 'TradingView öffnen' },
  es: { subject: (p: string) => `Su acceso a ${p} en TradingView está activo`, preheader: 'Cómo encontrar el indicador en TradingView.', heading: 'Su acceso al indicador está activo', lead: (p: string, n: string) => `Hemos concedido acceso a <strong>${p}</strong> para la cuenta de TradingView <strong>${n}</strong>.`, until: 'Acceso válido hasta', how: 'Para añadirlo a un gráfico: abra TradingView, haga clic en Indicadores, seleccione la pestaña Scripts solo por invitación y elija el indicador. Si no aparece, recargue la página.', cta: 'Abrir TradingView' },
  it: { subject: (p: string) => `Il tuo accesso a ${p} su TradingView è attivo`, preheader: 'Come trovare l’indicatore su TradingView.', heading: 'Il tuo accesso all’indicatore è attivo', lead: (p: string, n: string) => `Abbiamo concesso l’accesso a <strong>${p}</strong> per l’account TradingView <strong>${n}</strong>.`, until: 'Accesso valido fino al', how: 'Per aggiungerlo a un grafico: apri TradingView, fai clic su Indicatori, seleziona la scheda Script solo su invito e scegli l’indicatore. Se non compare, ricarica la pagina.', cta: 'Apri TradingView' },
  pt: { subject: (p: string) => `Seu acesso a ${p} no TradingView está ativo`, preheader: 'Como encontrar o indicador no TradingView.', heading: 'Seu acesso ao indicador está ativo', lead: (p: string, n: string) => `Liberamos o acesso a <strong>${p}</strong> para a conta do TradingView <strong>${n}</strong>.`, until: 'Acesso válido até', how: 'Para adicioná-lo a um gráfico: abra o TradingView, clique em Indicadores, selecione a aba Scripts somente por convite e escolha o indicador. Se ele não aparecer, recarregue a página.', cta: 'Abrir o TradingView' },
  zh: { subject: (p: string) => `您在 TradingView 中的 ${p} 访问已开通`, preheader: '如何在 TradingView 中找到该指标。', heading: '您的指标访问已开通', lead: (p: string, n: string) => `我们已为 TradingView 账户 <strong>${n}</strong> 开通 <strong>${p}</strong> 的访问权限。`, until: '访问有效期至', how: '添加到图表：打开 TradingView，点击“指标”，选择“仅限邀请脚本”标签页，然后选择该指标。如未显示，请刷新页面。', cta: '打开 TradingView' },
  ar: { subject: (p: string) => `تم تفعيل وصولك إلى ${p} على TradingView`, preheader: 'كيف تجد المؤشر على TradingView.', heading: 'تم تفعيل وصولك إلى المؤشر', lead: (p: string, n: string) => `منحنا الوصول إلى <strong>${p}</strong> لحساب TradingView <strong>${n}</strong>.`, until: 'الوصول صالح حتى', how: 'لإضافته إلى الرسم البياني: افتح TradingView، واضغط «المؤشرات»، واختر تبويب «نصوص بالدعوة فقط»، ثم اختر المؤشر. إن لم يظهر، أعد تحميل الصفحة.', cta: 'فتح TradingView' },
});

Object.assign(TV_NF as any, {
  uk: { subject: 'Потрібна дія: перевірте нік TradingView', preheader: 'Ми не знайшли профіль TradingView із зазначеним ніком.', heading: 'Перевірте нік у TradingView', lead: (n: string) => `Ми не знайшли профіль TradingView з ніком <strong>${n}</strong>, тому доступ до індикатора поки не видано.`, how: 'Нік вказано в меню профілю TradingView (праворуч угорі) та в адресі вашого профілю (tradingview.com/u/нік). Введіть його точно так само й надішліть ще раз.', cta: 'Вказати нік' },
  de: { subject: 'Aktion erforderlich: Bitte bestätigen Sie Ihren TradingView-Benutzernamen', preheader: 'Wir konnten das angegebene TradingView-Profil nicht finden.', heading: 'Bitte prüfen Sie Ihren TradingView-Benutzernamen', lead: (n: string) => `Wir konnten kein TradingView-Profil mit dem Benutzernamen <strong>${n}</strong> finden, daher wurde der Indikatorzugang noch nicht freigeschaltet.`, how: 'Ihr Benutzername steht im Menü oben rechts in TradingView und in Ihrer Profiladresse (tradingview.com/u/benutzername). Geben Sie ihn genau so ein und senden Sie ihn erneut.', cta: 'Benutzernamen aktualisieren' },
  es: { subject: 'Acción necesaria: confirme su usuario de TradingView', preheader: 'No encontramos el perfil de TradingView que indicó.', heading: 'Revise su usuario de TradingView', lead: (n: string) => `No encontramos un perfil de TradingView con el usuario <strong>${n}</strong>, por lo que aún no se ha concedido el acceso al indicador.`, how: 'Su usuario aparece en el menú superior derecho de TradingView y en la dirección de su perfil (tradingview.com/u/usuario). Escríbalo exactamente igual y envíelo de nuevo.', cta: 'Actualizar usuario' },
  it: { subject: 'Azione richiesta: conferma il tuo nome utente TradingView', preheader: 'Non abbiamo trovato il profilo TradingView indicato.', heading: 'Controlla il tuo nome utente TradingView', lead: (n: string) => `Non abbiamo trovato un profilo TradingView con il nome utente <strong>${n}</strong>, quindi l’accesso all’indicatore non è ancora stato concesso.`, how: 'Il nome utente è indicato nel menu in alto a destra di TradingView e nell’indirizzo del tuo profilo (tradingview.com/u/nomeutente). Inseriscilo esattamente così e invialo di nuovo.', cta: 'Aggiorna nome utente' },
  pt: { subject: 'Ação necessária: confirme seu usuário do TradingView', preheader: 'Não encontramos o perfil do TradingView informado.', heading: 'Verifique seu usuário do TradingView', lead: (n: string) => `Não encontramos um perfil do TradingView com o usuário <strong>${n}</strong>, por isso o acesso ao indicador ainda não foi liberado.`, how: 'Seu usuário aparece no menu superior direito do TradingView e no endereço do seu perfil (tradingview.com/u/usuario). Digite-o exatamente assim e envie novamente.', cta: 'Atualizar usuário' },
  zh: { subject: '需要您操作：请确认您的 TradingView 用户名', preheader: '我们未找到您填写的 TradingView 个人资料。', heading: '请检查您的 TradingView 用户名', lead: (n: string) => `我们未找到用户名为 <strong>${n}</strong> 的 TradingView 个人资料，因此尚未开通指标访问。`, how: '用户名显示在 TradingView 右上角的菜单中，也出现在您的个人资料地址里（tradingview.com/u/用户名）。请完全按原样填写并重新提交。', cta: '更新用户名' },
  ar: { subject: 'مطلوب إجراء: يرجى تأكيد اسم المستخدم في TradingView', preheader: 'لم نعثر على ملف TradingView الذي أدخلته.', heading: 'يرجى التحقق من اسم المستخدم في TradingView', lead: (n: string) => `لم نعثر على ملف TradingView باسم المستخدم <strong>${n}</strong>، لذلك لم يتم تفعيل الوصول إلى المؤشر بعد.`, how: 'يظهر اسم المستخدم في القائمة أعلى يمين TradingView وفي عنوان ملفك الشخصي (tradingview.com/u/اسم_المستخدم). أدخله كما هو تماماً وأرسله مرة أخرى.', cta: 'تحديث اسم المستخدم' },
});

Object.assign(PAID as any, {
  uk: { subject: (id: string) => `Оплату отримано — замовлення ${id}`, preheader: 'Ваш доступ активовано.', heading: 'Оплату отримано', lead: 'Дякуємо за покупку. Оплату підтверджено, доступ активовано.', order: 'Замовлення', amount: 'Сума', date: 'Дата', next: 'Відкрийте «Мої доступи», щоб підключити Telegram-канали та вказати нік TradingView для індикаторів.', cta: 'Відкрити «Мої доступи»' },
  de: { subject: (id: string) => `Zahlung erhalten – Bestellung ${id}`, preheader: 'Ihr Zugang ist aktiv.', heading: 'Zahlung erhalten', lead: 'Vielen Dank für Ihren Kauf. Ihre Zahlung wurde bestätigt und Ihr Zugang ist jetzt aktiv.', order: 'Bestellung', amount: 'Betrag', date: 'Datum', next: 'Öffnen Sie „Meine Zugänge“, um die Telegram-Kanäle zu verbinden und Ihren TradingView-Benutzernamen für Indikatoren anzugeben.', cta: 'Zu meinen Zugängen' },
  es: { subject: (id: string) => `Pago recibido: pedido ${id}`, preheader: 'Su acceso está activo.', heading: 'Pago recibido', lead: 'Gracias por su compra. Su pago ha sido confirmado y su acceso ya está activo.', order: 'Pedido', amount: 'Importe', date: 'Fecha', next: 'Abra Mis accesos para conectar los canales de Telegram e indicar su usuario de TradingView para los indicadores.', cta: 'Ir a Mis accesos' },
  it: { subject: (id: string) => `Pagamento ricevuto – ordine ${id}`, preheader: 'Il tuo accesso è attivo.', heading: 'Pagamento ricevuto', lead: 'Grazie per il tuo acquisto. Il pagamento è stato confermato e il tuo accesso è ora attivo.', order: 'Ordine', amount: 'Importo', date: 'Data', next: 'Apri I miei accessi per collegare i canali Telegram e indicare il tuo nome utente TradingView per gli indicatori.', cta: 'Vai a I miei accessi' },
  pt: { subject: (id: string) => `Pagamento recebido — pedido ${id}`, preheader: 'Seu acesso está ativo.', heading: 'Pagamento recebido', lead: 'Obrigado pela sua compra. Seu pagamento foi confirmado e seu acesso já está ativo.', order: 'Pedido', amount: 'Valor', date: 'Data', next: 'Abra Meus acessos para conectar os canais do Telegram e informar seu usuário do TradingView para os indicadores.', cta: 'Ir para Meus acessos' },
  zh: { subject: (id: string) => `已收到付款 — 订单 ${id}`, preheader: '您的访问已激活。', heading: '已收到付款', lead: '感谢您的购买。您的付款已确认，访问权限现已激活。', order: '订单', amount: '金额', date: '日期', next: '打开“我的访问”，连接 Telegram 频道，并为指标填写您的 TradingView 用户名。', cta: '打开“我的访问”' },
  ar: { subject: (id: string) => `تم استلام الدفعة — الطلب ${id}`, preheader: 'تم تفعيل وصولك.', heading: 'تم استلام الدفعة', lead: 'شكراً لشرائك. تم تأكيد دفعتك وتفعيل وصولك.', order: 'الطلب', amount: 'المبلغ', date: 'التاريخ', next: 'افتح «وصولي» لربط قنوات Telegram وإدخال اسم المستخدم في TradingView للمؤشرات.', cta: 'فتح «وصولي»' },
});

Object.assign(PARTNER as any, {
  uk: { approved: { subject: 'Вашу заявку на партнерство з UpDown схвалено', heading: 'Заявку на партнерство схвалено', lead: 'Раді підтвердити наше партнерство. Увійдіть у кабінет, щоб налаштувати Telegram-бота та канали.', cta: 'Відкрити кабінет партнера' }, rejected: { subject: 'Рішення щодо вашої заявки на партнерство', heading: 'Рішення щодо заявки на партнерство', lead: 'Дякуємо за інтерес до партнерства з UpDown. За результатами розгляду ми не можемо схвалити заявку наразі.', cta: 'Перейти на updown.team' }, reason: 'Коментар команди', preheader: 'За вашою заявкою ухвалено рішення.' },
  de: { approved: { subject: 'Ihre Partnerbewerbung bei UpDown wurde angenommen', heading: 'Ihre Partnerbewerbung ist angenommen', lead: 'Wir freuen uns, unsere Partnerschaft zu bestätigen. Melden Sie sich an, um Ihren Telegram-Bot und Ihre Kanäle einzurichten.', cta: 'Partnerbereich öffnen' }, rejected: { subject: 'Neuigkeiten zu Ihrer Partnerbewerbung bei UpDown', heading: 'Neuigkeiten zu Ihrer Partnerbewerbung', lead: 'Vielen Dank für Ihr Interesse an einer Partnerschaft mit UpDown. Nach Prüfung können wir Ihre Bewerbung derzeit nicht annehmen.', cta: 'updown.team besuchen' }, reason: 'Kommentar unseres Teams', preheader: 'Zu Ihrer Bewerbung wurde eine Entscheidung getroffen.' },
  es: { approved: { subject: 'Su solicitud de colaboración con UpDown ha sido aprobada', heading: 'Su solicitud de colaboración está aprobada', lead: 'Nos complace confirmar nuestra colaboración. Inicie sesión para configurar su bot de Telegram y sus canales.', cta: 'Abrir panel de socio' }, rejected: { subject: 'Novedades sobre su solicitud de colaboración con UpDown', heading: 'Novedades sobre su solicitud de colaboración', lead: 'Gracias por su interés en colaborar con UpDown. Tras la revisión, no podemos aprobar su solicitud en este momento.', cta: 'Visitar updown.team' }, reason: 'Comentario de nuestro equipo', preheader: 'Se ha tomado una decisión sobre su solicitud.' },
  it: { approved: { subject: 'La tua richiesta di partnership con UpDown è stata approvata', heading: 'La tua richiesta di partnership è approvata', lead: 'Siamo lieti di confermare la nostra partnership. Accedi per configurare il tuo bot Telegram e i canali.', cta: 'Apri l’area partner' }, rejected: { subject: 'Aggiornamento sulla tua richiesta di partnership con UpDown', heading: 'Aggiornamento sulla tua richiesta di partnership', lead: 'Grazie per l’interesse a collaborare con UpDown. Dopo la valutazione, al momento non possiamo approvare la tua richiesta.', cta: 'Visita updown.team' }, reason: 'Commento del nostro team', preheader: 'È stata presa una decisione sulla tua richiesta.' },
  pt: { approved: { subject: 'Sua solicitação de parceria com o UpDown foi aprovada', heading: 'Sua solicitação de parceria foi aprovada', lead: 'Temos o prazer de confirmar nossa parceria. Entre na sua conta para configurar seu bot do Telegram e seus canais.', cta: 'Abrir painel de parceiro' }, rejected: { subject: 'Atualização sobre sua solicitação de parceria com o UpDown', heading: 'Atualização sobre sua solicitação de parceria', lead: 'Obrigado pelo interesse em ser parceiro do UpDown. Após análise, não podemos aprovar sua solicitação no momento.', cta: 'Visitar updown.team' }, reason: 'Comentário da nossa equipe', preheader: 'Há uma decisão sobre sua solicitação.' },
  zh: { approved: { subject: '您与 UpDown 的合作申请已获批准', heading: '您的合作申请已获批准', lead: '很高兴确认我们的合作。请登录以设置您的 Telegram 机器人和频道。', cta: '打开合作伙伴后台' }, rejected: { subject: '关于您与 UpDown 合作申请的更新', heading: '关于您合作申请的更新', lead: '感谢您对与 UpDown 合作的关注。经审核，我们目前无法批准您的申请。', cta: '访问 updown.team' }, reason: '团队备注', preheader: '您的申请已有结果。' },
  ar: { approved: { subject: 'تمت الموافقة على طلب شراكتك مع UpDown', heading: 'تمت الموافقة على طلب الشراكة', lead: 'يسعدنا تأكيد شراكتنا. سجّل الدخول لإعداد بوت Telegram وقنواتك.', cta: 'فتح لوحة الشريك' }, rejected: { subject: 'مستجدات طلب شراكتك مع UpDown', heading: 'مستجدات طلب الشراكة', lead: 'شكراً لاهتمامك بالشراكة مع UpDown. بعد المراجعة، لا يمكننا الموافقة على طلبك في الوقت الحالي.', cta: 'زيارة updown.team' }, reason: 'تعليق فريقنا', preheader: 'تم اتخاذ قرار بشأن طلبك.' },
});
