// Словарь лендинга. en — базовый (fallback), затем ru, de, es, it, pt, zh, ar.
// Разбит на два файла из-за объёма; здесь языки en/ru/de/es, остальные — в landingB.
import { landingRest } from './landingB'

const base = {
  en: {
    nav: { products: 'Products', how: 'How it works', team: 'Team', partners: 'Partnership', login: 'Sign In', partner: 'Become a Partner', charts: 'Chart Platform' },
    hero: {
      badge: 'Infrastructure Trading Platform',
      title1: 'Trade smarter.', title2: 'Scale faster.', title3: 'Earn more.',
      sub: 'UpDown / AiView — ecosystem of trading signals, AI analytics, indicators and B2B solutions for traders and partners worldwide.',
      cta1: 'Get Started', cta2: 'Become a Partner',
      card1: 'Partner ROI', card2: 'Active', card3: 'Ready',
      stats: [{ num: '1000+', label: 'Users' }, { num: '50+', label: 'Partners' }, { num: '6', label: 'Products' }, { num: '99.9%', label: 'Uptime' }],
    },
    products: {
      label: 'Ecosystem', title: 'Full arsenal for trading',
      sub: 'From signals to your own brand — everything in one ecosystem',
      items: [
        { id: 'signals', icon: '📡', tag: 'B2C', title: 'Signal Products', desc: 'Crypto, Forex, PRO and FIB strategies. Delivered via Telegram, Discord and other platforms.', features: ['AiView Crypto', 'AiView Forex', 'UpDown PRO & FIB', 'Subscription model'] },
        { id: 'whitelabel', icon: '🏷️', tag: 'B2B', title: 'White Label', desc: 'Signals delivered under your brand. Customize assets, frequency, and risk management.', features: ['Your brand', 'Telegram / Discord / X', 'Flexible risk management', 'Fast launch'] },
        { id: 'indicators', icon: '📊', tag: 'Tools', title: 'Indicators', desc: 'Proprietary analytical tools: Table Predictor, Strong Levels, Liquidity Zones and more.', features: ['Table Predictor', 'Strong Levels Finder', 'Liquidity Zones', 'Pump & MM Target'] },
        { id: 'education', icon: '🎓', tag: 'Academy', title: 'Education', desc: 'Strategies, indicator training, live market analysis. Community-driven learning.', features: ['Fibonacci strategy', 'Live analysis', 'Regular calls', 'Active community'] },
        { id: 'copy', icon: '⚡', tag: 'Auto', title: 'Copy Trading', desc: 'Automate trading by copying top platform traders with bot integration.', features: ['Connect to traders', 'Bot integration', 'Revenue share model', 'Low entry barrier'] },
        { id: 'dev', icon: '🔧', tag: 'B2B', title: 'Development', desc: 'Trading bots, indicators, AI agents, signal systems and analytics platforms built to order.', features: ['Trading bots', 'AI agents', 'Signal systems', 'Business integration'] },
      ],
    },
    stats: [
      { num: '6+', label: 'Business directions', desc: 'From signals to development' },
      { num: '∞', label: 'Scalability', desc: 'Unlimited partner network' },
      { num: '24/7', label: 'Monitoring', desc: 'Stable infrastructure' },
      { num: 'AI', label: 'Analytics', desc: 'AiView + manual analytics' },
    ],
    how: {
      label: 'Process', title: 'How the platform works',
      steps: [
        { icon: '🔐', title: 'Register', desc: 'Create an account and get dashboard access in minutes.' },
        { icon: '🤝', title: 'Choose Format', desc: 'Join as a partner, subscribe to signals or launch your White Label product.' },
        { icon: '🚀', title: 'Launch', desc: 'Configure tools, connect your audience and start receiving signals.' },
        { icon: '📈', title: 'Scale', desc: 'Grow your audience, increase profitability and expand your product line.' },
      ],
    },
    team: {
      label: 'Team', title: 'People behind the platform',
      members: [
        { initials: 'D', name: 'Dmitry', role: 'Co-Founder / Product & Strategy', desc: 'Product architecture, ecosystem development, indicator logic and strategic partnerships.' },
        { initials: 'I', name: 'Ivan', role: 'Co-Founder / CTO', desc: 'Full technical infrastructure, development of key products, architecture and scalability.' },
        { initials: 'S', name: 'Sergey', role: 'Lead Trader / Educator', desc: 'Trading strategies, user education, analytics and public content.' },
        { initials: 'K', name: 'Kirill', role: 'Operations / Junior Dev', desc: 'Operations, product support, testing and development participation.' },
      ],
    },
    partners: {
      label: 'Partnership', title: 'Launch your product with our infrastructure',
      sub: 'Franchise, White Label, revenue share — scale your business without building infrastructure from scratch.',
      perks: ['Access to signals and indicators', 'Revenue share from day one', 'Technical resources and support', 'Launch niche products (Crypto / Forex)', 'Scale through partner network'],
      cta: 'Become a Partner',
      card: { label: 'Monetization models', models: [{ name: 'Revenue Share', pct: 85 }, { name: 'White Label', pct: 70 }, { name: 'Subscription', pct: 95 }, { name: 'Development', pct: 60 }] },
    },
    cta: { title: 'Ready to start?', sub: 'Join the UpDown / AiView ecosystem and scale your trading business.', btn1: 'Create account', btn2: 'Learn about partnership' },
    chart: {
      label: 'Indicator', title: 'UpDown [FIB] — in action',
      sub: 'Live data from Binance. Logarithmic Fibonacci grid, Key Level, entry zones and trade plan — exactly as seen in TradingView.',
      asset: 'Instrument', timeframe: 'Timeframe', loading: 'Loading data from Binance...', retry: 'Retry', loadError: 'Loading error',
      promo: {
        badge: 'Pine Script™ v6', title: 'UpDown [FIB] by SK TRADE v3',
        desc: 'Multi-stage indicator: structure analysis → Key Level → logarithmic Fibonacci grid → Confluence → Pump detector → Trigger → automated trade plan.',
        features: [
          'Stage 1: UP/DOWN structural legs via pivot confirmation',
          'Stage 2: KL — best GREEN→RED pair in the DOWN leg',
          'Stage 3: 14-level log Fib grid from -0.157 to 3.414',
          'Stage 4: Confluence — fractals, EQH/EQL, imbalances, MTF',
          'Stage 5-6: Pump detector + Trigger at fib 1.414 cross',
          'Stage 7-8: cluster plan Entry 1-4 / SL / TP1-2 + runtime',
        ],
        tvNote: 'Full version runs exclusively in TradingView (Pine Script v6). Connect to your account — works on any instrument and timeframe.',
        pineNote: 'Pine Script™ is a trademark of TradingView, Inc.',
        cta: 'Open indicator on TradingView →',
      },
    },
    footer: { desc: 'Infrastructure trading platform', platform: 'Platform', register: 'Register', ecosystem: 'Ecosystem', signals: 'Signals', whitelabel: 'White Label', indicators: 'Indicators', rights: 'All rights reserved' },
  },

  ru: {
    nav: { products: 'Продукты', how: 'Как работает', team: 'Команда', partners: 'Партнёрство', login: 'Войти', partner: 'Стать партнёром', charts: 'Chart Platform' },
    hero: {
      badge: 'Инфраструктурная торговая платформа',
      title1: 'Торгуй умнее.', title2: 'Масштабируй быстрее.', title3: 'Зарабатывай больше.',
      sub: 'UpDown / AiView — экосистема торговых сигналов, AI-аналитики, индикаторов и B2B-решений для трейдеров и партнёров по всему миру.',
      cta1: 'Начать сейчас', cta2: 'Стать партнёром',
      card1: 'Доходность партнёров', card2: 'Активно', card3: 'Ready',
      stats: [{ num: '1000+', label: 'Пользователей' }, { num: '50+', label: 'Партнёров' }, { num: '6', label: 'Продуктов' }, { num: '99.9%', label: 'Uptime' }],
    },
    products: {
      label: 'Экосистема', title: 'Полный арсенал для трейдинга',
      sub: 'От сигналов до собственного бренда — всё в одной экосистеме',
      items: [
        { id: 'signals', icon: '📡', tag: 'B2C', title: 'Сигнальные продукты', desc: 'Crypto, Forex, PRO и FIB стратегии. Доставка через Telegram, Discord и другие платформы.', features: ['AiView Crypto', 'AiView Forex', 'UpDown PRO & FIB', 'Подписочная модель'] },
        { id: 'whitelabel', icon: '🏷️', tag: 'B2B', title: 'White Label', desc: 'Поставка сигналов под вашим брендом. Кастомизация активов, частоты, риск-менеджмента.', features: ['Ваш бренд', 'Telegram / Discord / X', 'Гибкий риск-менеджмент', 'Быстрый запуск'] },
        { id: 'indicators', icon: '📊', tag: 'Tools', title: 'Индикаторы', desc: 'Проприетарные аналитические инструменты: Table Predictor, Strong Levels, Liquidity Zones и другие.', features: ['Table Predictor', 'Strong Levels Finder', 'Liquidity Zones', 'Pump & MM Target'] },
        { id: 'education', icon: '🎓', tag: 'Academy', title: 'Обучение', desc: 'Стратегии, работа с индикаторами, практическая торговля. Живые разборы и комьюнити.', features: ['Fibonacci стратегия', 'Живые разборы', 'Регулярные созвоны', 'Активное комьюнити'] },
        { id: 'copy', icon: '⚡', tag: 'Auto', title: 'Копитрейдинг', desc: 'Автоматизация торговли через копирование сделок лучших трейдеров платформы.', features: ['Подключение к трейдерам', 'Интеграция с ботами', 'Revenue share модель', 'Низкий порог входа'] },
        { id: 'dev', icon: '🔧', tag: 'B2B', title: 'Разработка', desc: 'Торговые боты, индикаторы, AI-агенты, сигнальные системы и аналитические платформы под ключ.', features: ['Торговые боты', 'AI-агенты', 'Сигнальные системы', 'Интеграция в бизнес'] },
      ],
    },
    stats: [
      { num: '6+', label: 'Бизнес-направлений', desc: 'От сигналов до разработки' },
      { num: '∞', label: 'Масштабируемость', desc: 'Партнёрская сеть без лимитов' },
      { num: '24/7', label: 'Мониторинг', desc: 'Стабильная инфраструктура' },
      { num: 'AI', label: 'Аналитика', desc: 'AiView + ручная аналитика' },
    ],
    how: {
      label: 'Процесс', title: 'Как работает платформа',
      steps: [
        { icon: '🔐', title: 'Регистрация', desc: 'Создайте аккаунт и получите доступ к панели управления за несколько минут.' },
        { icon: '🤝', title: 'Выбор формата', desc: 'Подключитесь как партнёр, подпишитесь на сигналы или запустите White Label продукт.' },
        { icon: '🚀', title: 'Запуск', desc: 'Настройте инструменты, подключите аудиторию и начните получать сигналы.' },
        { icon: '📈', title: 'Рост', desc: 'Масштабируйте аудиторию, увеличивайте доходность и расширяйте линейку продуктов.' },
      ],
    },
    team: {
      label: 'Команда', title: 'Люди за платформой',
      members: [
        { initials: 'Д', name: 'Дмитрий', role: 'Co-Founder / Product & Strategy', desc: 'Продуктовая архитектура, развитие экосистемы, логика индикаторов и стратегические партнёрства.' },
        { initials: 'И', name: 'Иван', role: 'Co-Founder / CTO', desc: 'Вся техническая инфраструктура, разработка ключевых продуктов, архитектура и масштабируемость.' },
        { initials: 'С', name: 'Сергей', role: 'Lead Trader / Educator', desc: 'Торговые стратегии, обучение пользователей, аналитика и публичный контент.' },
        { initials: 'К', name: 'Кирилл', role: 'Operations / Junior Dev', desc: 'Операционная деятельность, поддержка продуктов, тестирование и участие в разработке.' },
      ],
    },
    partners: {
      label: 'Партнёрство', title: 'Запусти свой продукт с нашей инфраструктурой',
      sub: 'Франшиза, White Label, revenue share — масштабируй бизнес без построения инфраструктуры с нуля.',
      perks: ['Доступ к сигналам и индикаторам', 'Revenue share с первого клиента', 'Технические ресурсы и поддержка', 'Запуск нишевых продуктов (Crypto / Forex)', 'Масштабирование через партнёрскую сеть'],
      cta: 'Стать партнёром',
      card: { label: 'Модели монетизации', models: [{ name: 'Revenue Share', pct: 85 }, { name: 'White Label', pct: 70 }, { name: 'Подписка', pct: 95 }, { name: 'Разработка', pct: 60 }] },
    },
    cta: { title: 'Готов начать?', sub: 'Присоединяйся к экосистеме UpDown / AiView и масштабируй свой торговый бизнес.', btn1: 'Создать аккаунт', btn2: 'Узнать о партнёрстве' },
    chart: {
      label: 'Индикатор', title: 'UpDown [FIB] — в действии',
      sub: 'Реальные данные с Binance. Логарифмическая сетка Фибоначчи, Key Level, зоны входа и план сделки — всё как в TradingView.',
      asset: 'Инструмент', timeframe: 'Таймфрейм', loading: 'Загрузка данных с Binance...', retry: 'Повторить', loadError: 'Ошибка загрузки',
      promo: {
        badge: 'Pine Script™ v6', title: 'UpDown [FIB] by SK TRADE v3',
        desc: 'Многоэтапный индикатор: структурный анализ → Key Level → логарифмическая Fibonacci сетка → Confluence → Pump detector → Trigger → автоматический план входа.',
        features: [
          'Stage 1: структурные ноги UP/DOWN через pivot confirmation',
          'Stage 2: KL — лучшая GREEN→RED пара в DOWN-ноге',
          'Stage 3: 14-уровневая лог. Fib сетка от -0.157 до 3.414',
          'Stage 4: Confluence — фракталы, EQH/EQL, имбалансы, MTF',
          'Stage 5-6: Pump detector + Trigger на пересечении fib 1.414',
          'Stage 7-8: кластерный план Entry 1-4 / SL / TP1-2 + runtime',
        ],
        tvNote: 'Полная версия работает исключительно в TradingView (Pine Script v6). Подключи к своему аккаунту — работает на любом инструменте и таймфрейме.',
        pineNote: 'Pine Script™ является торговой маркой TradingView, Inc.',
        cta: 'Открыть индикатор на TradingView →',
      },
    },
    footer: { desc: 'Инфраструктурная торговая платформа', platform: 'Платформа', register: 'Регистрация', ecosystem: 'Экосистема', signals: 'Сигналы', whitelabel: 'White Label', indicators: 'Индикаторы', rights: 'Все права защищены' },
  },
}

export default { ...base, ...landingRest }
