// Единый источник SEO-строк (без зависимостей от vue), чтобы его могли
// импортировать и клиент (src/i18n), и конфиг сборки (vite.config.js) для
// инъекции локализованных мета-тегов в пререндеренные страницы.

export const LANDING_LANGS = ['en', 'de', 'es', 'it', 'pt', 'ru', 'zh', 'ar']

export const OG_LOCALE = {
  en: 'en_US', de: 'de_DE', es: 'es_ES', it: 'it_IT',
  pt: 'pt_PT', ru: 'ru_RU', zh: 'zh_CN', ar: 'ar_AR',
}

// Путь языковой версии лендинга: en → '/', остальные → '/de' и т.п.
export function langPath(code) {
  return code === 'en' ? '/' : `/${code}`
}

export const SEO = {
  en: {
    title: 'UpDown — AI Trading Signals, Analytics & White-Label Platform',
    desc: 'AI-powered crypto and forex trading signals, analytics, indicators, copy trading and white-label solutions for traders and partners worldwide.',
  },
  de: {
    title: 'UpDown — KI-Trading-Signale, Analytik & White-Label-Plattform',
    desc: 'KI-gestützte Krypto- und Forex-Trading-Signale, Analytik, Indikatoren, Copy-Trading und White-Label-Lösungen für Trader und Partner weltweit.',
  },
  es: {
    title: 'UpDown — Señales de Trading con IA, Analítica y White-Label',
    desc: 'Señales de trading de cripto y forex con IA, analítica, indicadores, copy trading y soluciones white-label para traders y socios de todo el mundo.',
  },
  it: {
    title: 'UpDown — Segnali di Trading con IA, Analisi e White-Label',
    desc: "Segnali di trading crypto e forex basati sull'IA, analisi, indicatori, copy trading e soluzioni white-label per trader e partner in tutto il mondo.",
  },
  pt: {
    title: 'UpDown — Sinais de Trading com IA, Análises e White-Label',
    desc: 'Sinais de trading de cripto e forex com IA, análises, indicadores, copy trading e soluções white-label para traders e parceiros no mundo todo.',
  },
  ru: {
    title: 'UpDown — торговые сигналы на ИИ, аналитика и White-Label',
    desc: 'Торговые сигналы по крипте и форекс на базе ИИ, аналитика, индикаторы, копитрейдинг и white-label решения для трейдеров и партнёров по всему миру.',
  },
  zh: {
    title: 'UpDown — AI 交易信号、分析与白标平台',
    desc: '基于 AI 的加密货币与外汇交易信号、分析、指标、跟单交易及白标解决方案，服务全球交易者与合作伙伴。',
  },
  ar: {
    title: 'UpDown — إشارات تداول بالذكاء الاصطناعي وتحليلات ومنصة White-Label',
    desc: 'إشارات تداول للعملات الرقمية والفوركس مدعومة بالذكاء الاصطناعي، وتحليلات، ومؤشرات، ونسخ تداول، وحلول White-Label للمتداولين والشركاء حول العالم.',
  },
}
