<template>
  <div class="landing" :class="theme">

    <!-- ===== NAVBAR ===== -->
    <nav class="nav" :class="{ 'nav--scrolled': scrolled }">
      <div class="nav__inner">
        <div class="nav__logo">
          <span class="logo-icon">↑↓</span>
          <span class="logo-text">UpDown</span>
        </div>

        <div class="nav__links">
          <a href="#products" @click.prevent="scrollTo('products')">{{ t.nav.products }}</a>
          <a href="#how" @click.prevent="scrollTo('how')">{{ t.nav.how }}</a>
          <a href="#team" @click.prevent="scrollTo('team')">{{ t.nav.team }}</a>
          <a href="#partners" @click.prevent="scrollTo('partners')">{{ t.nav.partners }}</a>
          <a href="https://charts.updown.team" target="_blank" rel="noopener" class="nav__charts-link">{{ t.nav.charts }} ↗</a>
        </div>

        <div class="nav__actions">
          <button class="icon-btn" @click="toggleTheme" :title="theme === 'dark' ? 'Light mode' : 'Dark mode'">
            <svg v-if="theme === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <button class="lang-btn" @click="toggleLang">{{ lang === 'ru' ? 'EN' : 'RU' }}</button>
          <router-link to="/login" class="btn-nav btn-nav--login">{{ t.nav.login }}</router-link>
          <router-link to="/partner-apply" class="btn-nav btn-nav--accent">{{ t.nav.partner }}</router-link>
          <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen" :class="{ 'hamburger--open': mobileMenuOpen }">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div class="nav__mobile" :class="{ 'nav__mobile--open': mobileMenuOpen }">
        <a href="#products" @click.prevent="scrollTo('products'); mobileMenuOpen=false">{{ t.nav.products }}</a>
        <a href="#how" @click.prevent="scrollTo('how'); mobileMenuOpen=false">{{ t.nav.how }}</a>
        <a href="#team" @click.prevent="scrollTo('team'); mobileMenuOpen=false">{{ t.nav.team }}</a>
        <a href="#partners" @click.prevent="scrollTo('partners'); mobileMenuOpen=false">{{ t.nav.partners }}</a>
        <a href="https://charts.updown.team" target="_blank" rel="noopener" class="nav__charts-link">{{ t.nav.charts }} ↗</a>
        <router-link to="/login" @click="mobileMenuOpen=false">{{ t.nav.login }}</router-link>
        <router-link to="/partner-apply" @click="mobileMenuOpen=false" class="mobile-partner-link">{{ t.nav.partner }}</router-link>
      </div>
    </nav>

    <!-- ===== HERO ===== -->
    <section class="hero">
      <!-- Animated grid background -->
      <div class="hero__grid"></div>
      <!-- Floating orbs -->
      <div class="orb orb--1"></div>
      <div class="orb orb--2"></div>
      <div class="orb orb--3"></div>

      <div class="hero__content">
        <div class="hero__badge reveal">
          <span class="badge-dot"></span>
          {{ t.hero.badge }}
        </div>
        <h1 class="hero__title reveal reveal--delay-1">
          <span class="title-line">{{ t.hero.title1 }}</span>
          <span class="title-line title-line--accent">{{ t.hero.title2 }}</span>
          <span class="title-line">{{ t.hero.title3 }}</span>
        </h1>
        <p class="hero__sub reveal reveal--delay-2">{{ t.hero.sub }}</p>
        <div class="hero__cta reveal reveal--delay-3">
          <router-link to="/register" class="btn-hero btn-hero--primary">
            {{ t.hero.cta1 }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
          <router-link to="/partner-apply" class="btn-hero btn-hero--ghost">{{ t.hero.cta2 }}</router-link>
        </div>

        <div class="hero__stats reveal reveal--delay-4">
          <div class="hero-stat" v-for="s in t.hero.stats" :key="s.label">
            <span class="hero-stat__num">{{ s.num }}</span>
            <span class="hero-stat__label">{{ s.label }}</span>
          </div>
        </div>
      </div>

      <!-- Floating cards -->
      <div class="hero__cards">
        <div class="float-card float-card--1 reveal reveal--delay-2">
          <div class="float-card__icon">📈</div>
          <div class="float-card__text">
            <span>+247%</span>
            <small>{{ t.hero.card1 }}</small>
          </div>
        </div>
        <div class="float-card float-card--2 reveal reveal--delay-3">
          <div class="float-card__icon">🤖</div>
          <div class="float-card__text">
            <span>AI Signals</span>
            <small>{{ t.hero.card2 }}</small>
          </div>
        </div>
        <div class="float-card float-card--3 reveal reveal--delay-4">
          <div class="float-card__icon">🔐</div>
          <div class="float-card__text">
            <span>White Label</span>
            <small>{{ t.hero.card3 }}</small>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TICKER ===== -->
    <div class="ticker">
      <div class="ticker__track">
        <span v-for="item in tickerItems" :key="item" class="ticker__item">{{ item }}</span>
        <span v-for="item in tickerItems" :key="'b'+item" class="ticker__item">{{ item }}</span>
      </div>
    </div>

    <!-- ===== PRODUCTS ===== -->
    <section class="products" id="products">
      <div class="section-container">
        <div class="section-label reveal">{{ t.products.label }}</div>
        <h2 class="section-title reveal reveal--delay-1">{{ t.products.title }}</h2>
        <p class="section-sub reveal reveal--delay-2">{{ t.products.sub }}</p>

        <div class="products__grid">
          <div
            class="product-card reveal"
            v-for="(p, i) in t.products.items"
            :key="p.id"
            :class="`reveal--delay-${i+1} product-card--${p.id}`"
            @mouseenter="hoveredProduct = p.id"
            @mouseleave="hoveredProduct = null"
          >
            <div class="product-card__glow"></div>
            <div class="product-card__header">
              <div class="product-card__icon">{{ p.icon }}</div>
              <div class="product-card__tag">{{ p.tag }}</div>
            </div>
            <h3>{{ p.title }}</h3>
            <p>{{ p.desc }}</p>
            <ul class="product-card__features">
              <li v-for="f in p.features" :key="f">
                <span class="check">✦</span> {{ f }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CHART SECTION ===== -->
    <section class="chart-section" id="chart">
      <div class="section-container">
        <div class="chart-section__head">
          <div>
            <div class="section-label reveal">{{ t.chart.label }}</div>
            <h2 class="section-title reveal reveal--delay-1">{{ t.chart.title }}</h2>
            <p class="section-sub reveal reveal--delay-2">{{ t.chart.sub }}</p>
          </div>
          <!-- TradingView attribution -->
          <a class="tv-badge reveal reveal--delay-2" href="https://www.tradingview.com/" target="_blank" rel="noopener">
            <svg width="18" height="14" viewBox="0 0 36 28" fill="none"><path d="M14 28H0l7-12 7 12ZM36 16H22l7-12 7 12ZM25 28H11l7-12 7 12Z" fill="#2962FF"/></svg>
            TradingView
          </a>
        </div>

        <!-- Controls -->
        <div class="chart-controls reveal reveal--delay-2">
          <div class="chart-controls__group">
            <span class="chart-controls__label">{{ t.chart.asset }}</span>
            <div class="chart-controls__btns">
              <button
                v-for="s in chartSymbols"
                :key="s.value"
                class="chart-btn"
                :class="{ 'chart-btn--active': activeSymbol === s.value }"
                @click="setSymbol(s.value)"
              >
                <span class="chart-btn__icon">{{ s.icon }}</span>
                {{ s.label }}
              </button>
            </div>
          </div>
          <div class="chart-controls__group">
            <span class="chart-controls__label">{{ t.chart.timeframe }}</span>
            <div class="chart-controls__btns">
              <button
                v-for="tf in chartTimeframes"
                :key="tf.value"
                class="chart-btn"
                :class="{ 'chart-btn--active': activeTf === tf.value }"
                @click="setTimeframe(tf.value)"
              >
                {{ tf.label }}
              </button>
            </div>
          </div>
          <!-- Индикатор тег -->
          <div class="chart-controls__indicator-tag">
            <span class="ind-tag">
              <span class="ind-tag__dot"></span>
              UpDown Short Liquidity Entries
            </span>
          </div>
        </div>

        <!-- Demo chart: Lightweight Charts + наш индикатор -->
        <div class="chart-wrapper reveal reveal--delay-3">
          <div class="chart-canvas" ref="lwChartContainer"></div>
          <div class="chart-overlay" v-if="chartLoading">
            <div class="chart-spinner"></div>
            <span class="chart-spinner__text">{{ t.chart.loading }}</span>
          </div>
          <div class="chart-overlay chart-overlay--error" v-if="!chartLoading && chartError">
            <span class="chart-error-icon">⚠️</span>
            <span class="chart-error-text">{{ chartError }}</span>
            <button class="chart-retry-btn" @click="buildLWChart()">{{ t.chart.retry }}</button>
          </div>

          <!-- Легенда сигнала поверх графика -->
          <div class="chart-legend" v-if="!chartLoading">
            <div class="chart-legend__item">
              <span class="legend-line legend-line--kl"></span> KL
            </div>
            <div class="chart-legend__item">
              <span class="legend-line legend-line--fib0"></span> Fib 0 / 1
            </div>
            <div class="chart-legend__item">
              <span class="legend-line legend-line--fib2"></span> Fib 2 / 3
            </div>
            <div class="chart-legend__item">
              <span class="legend-line legend-line--entry"></span> Entry / SL / TP
            </div>
          </div>

          <!-- Инфо о последнем сигнале -->
          <div class="chart-signal-info" v-if="lastSignalInfo && !chartLoading">
            <div class="signal-badge">
              <span class="signal-badge__dot"></span>
              SHORT
            </div>
            <div class="signal-badge__detail">{{ lastSignalInfo }}</div>
          </div>
        </div>

        <!-- Промо-блок индикатора -->
        <div class="indicator-promo reveal reveal--delay-3">
          <div class="indicator-promo__card">
            <div class="indicator-promo__glow"></div>

            <!-- Левая часть: описание логики -->
            <div class="indicator-promo__left">
              <div class="indicator-promo__badge">{{ t.chart.promo.badge }}</div>
              <h3>{{ t.chart.promo.title }}</h3>
              <p>{{ t.chart.promo.desc }}</p>
              <ul class="indicator-promo__features">
                <li v-for="f in t.chart.promo.features" :key="f">
                  <span class="check">✦</span> {{ f }}
                </li>
              </ul>
            </div>

            <!-- Правая часть: TradingView CTA -->
            <div class="indicator-promo__right">
              <div class="indicator-promo__tv">
                <div class="tv-logo">
                  <svg width="32" height="25" viewBox="0 0 36 28" fill="none"><path d="M14 28H0l7-12 7 12ZM36 16H22l7-12 7 12ZM25 28H11l7-12 7 12Z" fill="#2962FF"/></svg>
                  <span>TradingView</span>
                </div>
                <p class="tv-note">{{ t.chart.promo.tvNote }}</p>
                <div class="tv-pine-preview">
                  <div class="tv-pine-preview__header">
                    <span class="tv-pine-preview__dot tv-pine-preview__dot--red"></span>
                    <span class="tv-pine-preview__dot tv-pine-preview__dot--yellow"></span>
                    <span class="tv-pine-preview__dot tv-pine-preview__dot--green"></span>
                    <span class="tv-pine-preview__title">Pine Script™ v6</span>
                  </div>
                  <pre class="tv-pine-preview__code"><span class="ps-comment">// UpDown [FIB] by SK TRADE v3</span>
<span class="ps-kw">indicator</span>(<span class="ps-str">"UpDown [FIB]"</span>, overlay=<span class="ps-kw">true</span>)
<span class="ps-comment">// Stage 1: структурные ноги UP/DOWN</span>
<span class="ps-comment">// Stage 2: KL — GREEN→RED pair activation</span>
<span class="ps-comment">// Stage 3: log Fib -0.157 … 3.414</span>
<span class="ps-comment">// Stage 7: Entry 1-4 / SL / TP1-2 plan</span></pre>
                </div>
                <a
                  href="https://www.tradingview.com/script/"
                  target="_blank"
                  rel="noopener"
                  class="btn-hero btn-hero--primary"
                >
                  {{ t.chart.promo.cta }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <p class="tv-pine-note">{{ t.chart.promo.pineNote }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="stats-section">
      <div class="stats-section__bg"></div>
      <div class="section-container">
        <div class="stats-grid">
          <div class="big-stat reveal" v-for="(s, i) in t.stats" :key="s.num" :class="`reveal--delay-${i+1}`">
            <span class="big-stat__num">{{ s.num }}</span>
            <span class="big-stat__label">{{ s.label }}</span>
            <span class="big-stat__desc">{{ s.desc }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="how" id="how">
      <div class="section-container">
        <div class="section-label reveal">{{ t.how.label }}</div>
        <h2 class="section-title reveal reveal--delay-1">{{ t.how.title }}</h2>

        <div class="how__steps">
          <div class="how__step reveal" v-for="(step, i) in t.how.steps" :key="i" :class="`reveal--delay-${i+1}`">
            <div class="how__step-num">{{ String(i+1).padStart(2,'0') }}</div>
            <div class="how__step-icon">{{ step.icon }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
            <div class="how__step-connector" v-if="i < t.how.steps.length - 1"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TEAM ===== -->
    <section class="team" id="team">
      <div class="section-container">
        <div class="section-label reveal">{{ t.team.label }}</div>
        <h2 class="section-title reveal reveal--delay-1">{{ t.team.title }}</h2>

        <div class="team__grid">
          <div class="team-card reveal" v-for="(m, i) in t.team.members" :key="m.name" :class="`reveal--delay-${i+1}`">
            <div class="team-card__avatar">{{ m.initials }}</div>
            <div class="team-card__info">
              <h3>{{ m.name }}</h3>
              <span class="team-card__role">{{ m.role }}</span>
              <p>{{ m.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PARTNERS / FRANCHISE ===== -->
    <section class="partners" id="partners">
      <div class="section-container">
        <div class="partners__inner">
          <div class="partners__text">
            <div class="section-label reveal">{{ t.partners.label }}</div>
            <h2 class="section-title reveal reveal--delay-1">{{ t.partners.title }}</h2>
            <p class="partners__sub reveal reveal--delay-2">{{ t.partners.sub }}</p>
            <ul class="partners__perks reveal reveal--delay-3">
              <li v-for="p in t.partners.perks" :key="p">
                <span class="perk-dot"></span>{{ p }}
              </li>
            </ul>
            <router-link to="/partner-apply" class="btn-hero btn-hero--primary reveal reveal--delay-4">
              {{ t.partners.cta }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </router-link>
          </div>
          <div class="partners__visual reveal reveal--delay-2">
            <div class="revenue-card">
              <div class="revenue-card__label">{{ t.partners.card.label }}</div>
              <div class="revenue-card__model" v-for="m in t.partners.card.models" :key="m.name">
                <span class="model-name">{{ m.name }}</span>
                <div class="model-bar">
                  <div class="model-bar__fill" :style="`width:${m.pct}%`"></div>
                </div>
                <span class="model-pct">{{ m.pct }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="cta-section">
      <div class="cta-section__bg"></div>
      <div class="section-container">
        <h2 class="cta-section__title reveal">{{ t.cta.title }}</h2>
        <p class="cta-section__sub reveal reveal--delay-1">{{ t.cta.sub }}</p>
        <div class="cta-section__actions reveal reveal--delay-2">
          <router-link to="/register" class="btn-hero btn-hero--primary">{{ t.cta.btn1 }}</router-link>
          <router-link to="/partner-apply" class="btn-hero btn-hero--ghost">{{ t.cta.btn2 }}</router-link>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="section-container">
        <div class="footer__top">
          <div class="footer__brand">
            <div class="nav__logo">
              <span class="logo-icon">↑↓</span>
              <span class="logo-text">UpDown</span>
            </div>
            <p>{{ t.footer.desc }}</p>
          </div>
          <div class="footer__cols">
            <div class="footer__col">
              <strong>{{ t.footer.platform }}</strong>
              <router-link to="/login">{{ t.nav.login }}</router-link>
              <router-link to="/register">{{ t.footer.register }}</router-link>
              <router-link to="/partner-apply">{{ t.nav.partner }}</router-link>
            </div>
            <div class="footer__col">
              <strong>{{ t.footer.ecosystem }}</strong>
              <a href="#products">{{ t.footer.signals }}</a>
              <a href="#products">{{ t.footer.whitelabel }}</a>
              <a href="#products">{{ t.footer.indicators }}</a>
              <a href="https://charts.updown.team" target="_blank" rel="noopener">{{ t.nav.charts }} ↗</a>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© {{ new Date().getFullYear() }} UpDown / AiView Platform</span>
          <span>{{ t.footer.rights }}</span>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// ---- THEME ----
const theme = ref(localStorage.getItem('ud-theme') || 'dark')
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('ud-theme', theme.value)
  // Применяем тему и к html для страниц авторизации
  document.documentElement.setAttribute('data-theme', theme.value)
  reapplyReveal()
}

// ---- LANG ----
const lang = ref(localStorage.getItem('ud-lang') || 'en')
const mobileMenuOpen = ref(false)
function toggleLang() {
  lang.value = lang.value === 'ru' ? 'en' : 'ru'
  localStorage.setItem('ud-lang', lang.value)
  reapplyReveal()
}

// ---- SCROLL ----
const scrolled = ref(false)
function onScroll() { scrolled.value = window.scrollY > 40 }
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ---- SCROLL REVEAL ----
let observer
function initReveal() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed')
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.08 })
  // Наблюдаем все reveal-элементы, включая уже видимые на экране
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('revealed')
    } else {
      observer.observe(el)
    }
  })
}

// При смене темы или языка — Vue перерисовывает DOM.
// Используем watch чтобы после nextTick переприменить revealed к видимым элементам.
function reapplyReveal() {
  nextTick(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('revealed')
      }
    })
    initReveal()
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  setTimeout(initReveal, 150)
  nextTick(() => buildLWChart())
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})

const hoveredProduct = ref(null)

// ---- CHART: LIGHTWEIGHT CHARTS + FIB INDICATOR VISUALIZATION ----
const lwChartContainer = ref(null)
const chartLoading = ref(true)
const chartError = ref('')
const activeSymbol = ref('BTC')
const activeTf = ref('1H')
const lastSignalInfo = ref('')

const chartSymbols = [
  { value: 'BTC', label: 'BTC / USDT', icon: '₿' },
  { value: 'XAU', label: 'XAU / USD',  icon: '🥇' },
]
const chartTimeframes = [
  { value: '1H', label: '1H' },
  { value: '1D', label: '1D' },
]

let lwChart = null
let lwLines = []
let lwPriceLine = null
let roChart = null

// ── Цвета индикатора (из Pine Script)
const CLR = {
  fibLime:      '#00ff0a',
  fibRed:       '#e12828',
  fibGreenZone: 'rgba(16,190,129,0.13)',
  fibGreenBord: 'rgba(16,190,129,0.4)',
  fibRedZone:   'rgba(225,40,40,0.12)',
  fibRedBord:   'rgba(225,40,40,0.35)',
  kl:           '#00ff0a',
  entry:        '#f5c842',
  sl:           '#ef4444',
  tp:           '#22c55e',
  trigger:      '#f5c842',
  up:           '#22c55e',
  down:         '#ef4444',
}

// ── Загрузка свечей с Binance
async function fetchCandles(symbol, tf) {
  const interval = tf === '1H' ? '1h' : '1d'
  const sym = symbol === 'BTC' ? 'BTCUSDT' : 'PAXGUSDT'
  const url = `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=${interval}&limit=300`
  const r = await fetch(url)
  if (!r.ok) throw new Error(`Binance ${r.status}`)
  const raw = await r.json()
  if (!Array.isArray(raw) || raw.length < 20) throw new Error('Мало данных')
  const candles = raw.map(k => ({
    time:  Math.floor(k[0] / 1000),
    open:  parseFloat(k[1]),
    high:  parseFloat(k[2]),
    low:   parseFloat(k[3]),
    close: parseFloat(k[4]),
  }))
  // Убираем дубли по времени
  const seen = new Set()
  return candles.filter(c => { if (seen.has(c.time)) return false; seen.add(c.time); return true })
}

// ── Stage 1: поиск структурных ног (pivot high/low → UP/DOWN legs)
function buildLegs(candles) {
  const n = candles.length
  const PL = 2 // pivot lookback/lookforward

  function isPivotHigh(i) {
    if (i < PL || i > n - PL - 1) return false
    for (let j = 1; j <= PL; j++)
      if (candles[i].high <= candles[i-j].high || candles[i].high <= candles[i+j].high) return false
    return true
  }
  function isPivotLow(i) {
    if (i < PL || i > n - PL - 1) return false
    for (let j = 1; j <= PL; j++)
      if (candles[i].low >= candles[i-j].low || candles[i].low >= candles[i+j].low) return false
    return true
  }

  // ATR для подтверждения
  function atr(i, p=14) {
    let sum = 0, cnt = 0
    for (let k = Math.max(1, i-p+1); k <= i; k++) {
      sum += Math.max(candles[k].high - candles[k].low,
        Math.abs(candles[k].high - candles[k-1].close),
        Math.abs(candles[k].low  - candles[k-1].close))
      cnt++
    }
    return cnt ? sum / cnt : candles[i].high - candles[i].low
  }

  const legs = []
  let dir = 0, startP = null, startI = null, endP = null, endI = null
  const CONF_MULT = 0.6

  for (let i = PL; i < n - PL; i++) {
    const ph = isPivotHigh(i)
    const pl = isPivotLow(i)
    const a = atr(i)

    if (dir === 0) {
      if (ph) { dir = -1; startP = candles[i].high; startI = i; endP = candles[i].high; endI = i }
      else if (pl) { dir = 1; startP = candles[i].low; startI = i; endP = candles[i].low; endI = i }
    } else if (dir === 1) {
      if (candles[i].high > endP) { endP = candles[i].high; endI = i }
      if (ph) {
        const confirm = (endP - candles[i].low) >= a * CONF_MULT
        if (confirm) {
          legs.push({ dir: 'UP', startP, startI, endP, endI })
          startP = endP; startI = endI; endP = candles[i].low; endI = i; dir = -1
        }
      }
    } else {
      if (candles[i].low < endP) { endP = candles[i].low; endI = i }
      if (pl) {
        const confirm = (candles[i].high - endP) >= a * CONF_MULT
        if (confirm) {
          legs.push({ dir: 'DOWN', startP, startI, endP, endI })
          startP = endP; startI = endI; endP = candles[i].high; endI = i; dir = 1
        }
      }
    }
  }
  return legs
}

// ── Stage 2: KL — лучшая GREEN→RED пара в DOWN-ноге
function findKL(candles, leg) {
  if (leg.dir !== 'DOWN') return null
  let bestPbt = null, bestBar = null
  for (let red = leg.startI; red <= leg.endI; red++) {
    const green = red - 1
    if (green < 0) continue
    const isGreen = candles[green].close > candles[green].open
    const isRed   = candles[red].close   < candles[red].open
    if (isGreen && isRed) {
      const pbt = Math.max(candles[green].close, candles[red].open)
      if (bestPbt === null || pbt > bestPbt) { bestPbt = pbt; bestBar = green }
    }
  }
  return bestPbt ? { price: bestPbt, bar: bestBar } : null
}

// ── Stage 3: логарифмическая Fib сетка
function calcFibLevel(a, b, level) {
  if (!a || !b || a <= 0 || b <= 0 || b <= a) return null
  return Math.exp(Math.log(a) + level * (Math.log(b) - Math.log(a)))
}

function buildFib(candles, downLeg, klPrice) {
  // A = минимальный low DOWN-ноги, B = KL price
  let minLow = Infinity
  for (let i = downLeg.startI; i <= downLeg.endI; i++)
    if (candles[i].low < minLow) minLow = candles[i].low
  const A = minLow, B = klPrice
  if (!A || !B || A <= 0 || B <= A) return null

  const levels = [
    { name: '-0.157', v: -0.157 },
    { name: '0',      v: 0      },
    { name: '0.236',  v: 0.236  },
    { name: '0.382',  v: 0.382  },
    { name: '0.618',  v: 0.618  },
    { name: '0.786',  v: 0.786  },
    { name: '1',      v: 1.0    },
    { name: '1.414',  v: 1.414  },
    { name: '1.618',  v: 1.618  },
    { name: '2',      v: 2.0    },
    { name: '2.414',  v: 2.414  },
    { name: '2.618',  v: 2.618  },
    { name: '3',      v: 3.0    },
    { name: '3.414',  v: 3.414  },
  ]
  const result = {}
  for (const l of levels) {
    result[l.name] = calcFibLevel(A, B, l.v)
  }
  result._A = A; result._B = B; result._startBar = downLeg.startI
  return result
}

// ── Найти активированный KL (close пробил выше KL price)
function findActivatedKL(candles, legs) {
  // Ищем последнюю DOWN-ногу у которой KL был пробит ценой закрытия
  for (let i = legs.length - 1; i >= 0; i--) {
    const leg = legs[i]
    if (leg.dir !== 'DOWN') continue
    const kl = findKL(candles, leg)
    if (!kl) continue
    // Проверяем: было ли close > kl.price после ноги
    for (let j = leg.endI + 1; j < candles.length; j++) {
      if (candles[j].close > kl.price) {
        return { leg, kl }
      }
    }
  }
  return null
}

// ── Pump detector (Stage 5)
function detectPumps(candles) {
  const rsiLen = 14
  const pumpMinPct = 2.0, pumpMinRsi = 60.0

  // Wilder's RSI
  const rsi = new Array(candles.length).fill(50)
  let ag = 0, al = 0
  for (let i = 1; i <= rsiLen && i < candles.length; i++) {
    const d = candles[i].close - candles[i-1].close
    if (d > 0) ag += d; else al -= d
  }
  ag /= rsiLen; al /= rsiLen
  if (rsiLen < candles.length) rsi[rsiLen] = al === 0 ? 100 : 100 - 100 / (1 + ag/al)
  for (let i = rsiLen + 1; i < candles.length; i++) {
    const d = candles[i].close - candles[i-1].close
    ag = (ag * (rsiLen-1) + Math.max(d,0)) / rsiLen
    al = (al * (rsiLen-1) + Math.max(-d,0)) / rsiLen
    rsi[i] = al === 0 ? 100 : 100 - 100 / (1 + ag/al)
  }

  const pumps = []
  for (let i = 1; i < candles.length; i++) {
    const c = candles[i]
    const pct = c.low > 0 ? (c.high - c.low) / c.low * 100 : 0
    if (c.close > c.open && pct >= pumpMinPct && rsi[i] >= pumpMinRsi) {
      pumps.push({ bar: i, high: c.high, pct, rsi: rsi[i] })
    }
  }
  return pumps
}

// ── Главная функция: найти последний сетап для демо
function findDemoSetup(candles) {
  const legs = buildLegs(candles)
  if (legs.length < 2) return null

  const activated = findActivatedKL(candles, legs)
  if (!activated) return null

  const { leg: downLeg, kl } = activated
  const fib = buildFib(candles, downLeg, kl.price)
  if (!fib || !fib['1.414'] || !fib['1.618']) return null

  // Ищем pump + trigger в истории после активации KL
  const pumps = detectPumps(candles)
  let triggerBar = null, triggerPrice = null, pumpBar = null

  for (const pump of pumps) {
    if (pump.bar <= downLeg.endI) continue
    // Ищем trigger: high пересёк 1.414 снизу вверх, close <= 1.618
    for (let j = pump.bar; j < Math.min(pump.bar + 30, candles.length); j++) {
      if (j < 1) continue
      if (candles[j].high >= fib['1.414'] &&
          candles[j-1].high < fib['1.414'] &&
          candles[j].close <= fib['1.618']) {
        triggerBar = j; triggerPrice = fib['1.414']
        pumpBar = pump.bar
        break
      }
    }
    if (triggerBar) break
  }

  // Fallback trigger: просто ищем бар где цена вошла в зону 1.414-1.618
  if (!triggerBar) {
    for (let j = downLeg.endI + 1; j < candles.length; j++) {
      if (candles[j].high >= fib['1.414'] && candles[j].low <= fib['1.618']) {
        triggerBar = j; triggerPrice = fib['1.414']
        break
      }
    }
  }

  // Вычисляем план: Entry в зоне 1.414-1.618, SL выше 1.618, TP в зоне 0.618-0.786
  const entry1 = fib['1.414']
  const entry2 = fib['1.618']
  const sl     = fib['1.618'] ? fib['1.618'] * 1.03 : null
  const tp1    = fib['0.786']
  const tp2    = fib['0.618']

  return {
    fib, kl, downLeg, legs,
    triggerBar, triggerPrice, pumpBar,
    entry1, entry2, sl, tp1, tp2,
  }
}

// ── Рисуем горизонтальную линию через LW Charts series
function addHLine(price, color, style, width, fromTime, toTime) {
  if (!price || !lwChart) return
  const s = lwChart.addLineSeries({
    color, lineWidth: width, lineStyle: style,
    priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
  })
  s.setData([{ time: fromTime, value: price }, { time: toTime, value: price }])
  lwLines.push(s)
}

// ── Построение графика
async function buildLWChart() {
  if (!lwChartContainer.value) return
  chartLoading.value = true
  chartError.value = ''
  lastSignalInfo.value = ''

  if (roChart) { roChart.disconnect(); roChart = null }
  if (lwChart) { try { lwChart.remove() } catch {} lwChart = null; lwLines = [] }
  lwChartContainer.value.innerHTML = ''

  // Загружаем Lightweight Charts
  if (!window.LightweightCharts) {
    await new Promise((res, rej) => {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js'
      s.onload = res; s.onerror = rej
      document.head.appendChild(s)
    })
  }

  // Загружаем свечи
  let candles
  try {
    candles = await fetchCandles(activeSymbol.value, activeTf.value)
  } catch(e) {
    chartError.value = `Ошибка загрузки: ${e.message}`
    chartLoading.value = false
    return
  }

  const isDark = theme.value === 'dark'

  lwChart = window.LightweightCharts.createChart(lwChartContainer.value, {
    width:  lwChartContainer.value.clientWidth,
    height: lwChartContainer.value.clientHeight,
    layout: {
      background: { color: isDark ? '#0d0d0f' : '#f4f6fb' },
      textColor:  isDark ? '#a0a0b0' : '#4a4a6a',
    },
    grid: {
      vertLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' },
      horzLines: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)' },
    },
    crosshair: { mode: 1 },
    rightPriceScale: { borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' },
    timeScale: {
      borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
      timeVisible: true, secondsVisible: false,
    },
  })

  const candleSeries = lwChart.addCandlestickSeries({
    upColor: '#22c55e', downColor: '#ef4444',
    borderUpColor: '#22c55e', borderDownColor: '#ef4444',
    wickUpColor: '#22c55e', wickDownColor: '#ef4444',
  })
  candleSeries.setData(candles)

  // ── Запускаем индикатор
  const setup = findDemoSetup(candles)

  if (setup) {
    const { fib, kl, downLeg, triggerBar, entry1, entry2, sl, tp1, tp2 } = setup
    const n = candles.length
    const t0 = candles[Math.max(0, downLeg.startI - 5)].time
    const t1 = candles[n - 1].time
    // Линии начинаем от бара пивота DOWN-ноги
    const tFib = candles[downLeg.startI].time

    // ── Fib зоны (boxes через серии с fill)
    // Зона 0.236–0.382 (зелёная)
    const drawFibZone = (loKey, hiKey, fillColor, borderColor) => {
      const lo = fib[loKey], hi = fib[hiKey]
      if (!lo || !hi) return
      const top = Math.max(lo, hi), bot = Math.min(lo, hi)
      // Верхняя граница зоны
      const sTop = lwChart.addLineSeries({ color: borderColor, lineWidth: 1, lineStyle: 0, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false })
      sTop.setData([{ time: tFib, value: top }, { time: t1, value: top }])
      lwLines.push(sTop)
      // Нижняя граница
      const sBot = lwChart.addLineSeries({ color: borderColor, lineWidth: 1, lineStyle: 0, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false })
      sBot.setData([{ time: tFib, value: bot }, { time: t1, value: bot }])
      lwLines.push(sBot)
    }

    // 4 зоны Fib
    drawFibZone('0.236', '0.382',  CLR.fibGreenZone, CLR.fibGreenBord)
    drawFibZone('0.618', '0.786',  CLR.fibGreenZone, CLR.fibGreenBord)
    drawFibZone('1.414', '1.618',  CLR.fibRedZone,   CLR.fibRedBord)
    drawFibZone('2.414', '2.618',  CLR.fibRedZone,   CLR.fibRedBord)

    // Ключевые Fib линии (0, 1 — lime dashed; 2, 3 — red solid)
    // LineStyle: 0=solid, 2=dashed
    addHLine(fib['0'],     CLR.fibLime, 2, 2, tFib, t1)
    addHLine(fib['1'],     CLR.fibLime, 2, 2, tFib, t1)
    addHLine(fib['2'],     CLR.fibRed,  0, 2, tFib, t1)
    addHLine(fib['3'],     CLR.fibRed,  0, 2, tFib, t1)

    // KL линия (lime, dashed)
    addHLine(kl.price, CLR.kl, 2, 2, candles[kl.bar].time, t1)

    // Trigger (если нашли)
    if (triggerBar) {
      const tTrig = candles[triggerBar].time
      addHLine(fib['1.414'], CLR.trigger, 2, 1, tTrig, t1)
    }

    // Entry / SL / TP линии
    const tPlan = candles[triggerBar || Math.max(0, n - 60)].time
    if (entry1) addHLine(entry1, CLR.entry, 2, 2, tPlan, t1)
    if (entry2) addHLine(entry2, CLR.entry, 2, 1, tPlan, t1)
    if (sl)     addHLine(sl,     CLR.sl,    0, 2, tPlan, t1)
    if (tp1)    addHLine(tp1,    CLR.tp,    2, 1, tPlan, t1)
    if (tp2)    addHLine(tp2,    CLR.tp,    2, 1, tPlan, t1)

    // Инфо строка
    const sym = activeSymbol.value === 'BTC' ? 'BINANCE:BTCUSDT' : 'BINANCE:PAXGUSDT'
    const fmt = v => v?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '—'
    lastSignalInfo.value = `${sym} | KL: $${fmt(kl.price)} | Entry: $${fmt(entry1)} | SL: $${fmt(sl)} | TP1: $${fmt(tp1)}`
  }

  lwChart.timeScale().fitContent()

  roChart = new ResizeObserver(() => {
    if (lwChart && lwChartContainer.value)
      lwChart.resize(lwChartContainer.value.clientWidth, lwChartContainer.value.clientHeight)
  })
  roChart.observe(lwChartContainer.value)

  chartLoading.value = false
}

function setSymbol(val) {
  if (activeSymbol.value === val) return
  activeSymbol.value = val
  buildLWChart()
}
function setTimeframe(val) {
  if (activeTf.value === val) return
  activeTf.value = val
  buildLWChart()
}

watch(theme, () => { nextTick(() => buildLWChart()) })

// ---- TICKER ----
const tickerItems = ['AiView Crypto', '✦', 'AiView Forex', '✦', 'UpDown PRO', '✦', 'White Label', '✦', 'Copy Trading', '✦', 'AI Signals', '✦', 'Fibonacci Strategy', '✦', 'Table Predictor', '✦']

// ---- TRANSLATIONS ----
const translations = {
  ru: {
    nav: { products: 'Продукты', how: 'Как работает', team: 'Команда', partners: 'Партнёрство', login: 'Войти', partner: 'Стать партнёром', charts: 'Chart Platform' },
    hero: {
      badge: 'Инфраструктурная торговая платформа',
      title1: 'Торгуй умнее.',
      title2: 'Масштабируй быстрее.',
      title3: 'Зарабатывай больше.',
      sub: 'UpDown / AiView — экосистема торговых сигналов, AI-аналитики, индикаторов и B2B-решений для трейдеров и партнёров по всему миру.',
      cta1: 'Начать сейчас', cta2: 'Стать партнёром',
      card1: 'Доходность партнёров', card2: 'Активно', card3: 'Ready',
      stats: [
        { num: '1000+', label: 'Пользователей' }, { num: '50+', label: 'Партнёров' },
        { num: '6', label: 'Продуктов' }, { num: '99.9%', label: 'Uptime' }
      ]
    },
    products: {
      label: 'Экосистема',
      title: 'Полный арсенал для трейдинга',
      sub: 'От сигналов до собственного бренда — всё в одной экосистеме',
      items: [
        { id: 'signals', icon: '📡', tag: 'B2C', title: 'Сигнальные продукты', desc: 'Crypto, Forex, PRO и FIB стратегии. Доставка через Telegram, Discord и другие платформы.', features: ['AiView Crypto', 'AiView Forex', 'UpDown PRO & FIB', 'Подписочная модель'] },
        { id: 'whitelabel', icon: '🏷️', tag: 'B2B', title: 'White Label', desc: 'Поставка сигналов под вашим брендом. Кастомизация активов, частоты, риск-менеджмента.', features: ['Ваш бренд', 'Telegram / Discord / X', 'Гибкий риск-менеджмент', 'Быстрый запуск'] },
        { id: 'indicators', icon: '📊', tag: 'Tools', title: 'Индикаторы', desc: 'Проприетарные аналитические инструменты: Table Predictor, Strong Levels, Liquidity Zones и другие.', features: ['Table Predictor', 'Strong Levels Finder', 'Liquidity Zones', 'Pump & MM Target'] },
        { id: 'education', icon: '🎓', tag: 'Academy', title: 'Обучение', desc: 'Стратегии, работа с индикаторами, практическая торговля. Живые разборы и комьюнити.', features: ['Fibonacci стратегия', 'Живые разборы', 'Регулярные созвоны', 'Активное комьюнити'] },
        { id: 'copy', icon: '⚡', tag: 'Auto', title: 'Копитрейдинг', desc: 'Автоматизация торговли через копирование сделок лучших трейдеров платформы.', features: ['Подключение к трейдерам', 'Интеграция с ботами', 'Revenue share модель', 'Низкий порог входа'] },
        { id: 'dev', icon: '🔧', tag: 'B2B', title: 'Разработка', desc: 'Торговые боты, индикаторы, AI-агенты, сигнальные системы и аналитические платформы под ключ.', features: ['Торговые боты', 'AI-агенты', 'Сигнальные системы', 'Интеграция в бизнес'] },
      ]
    },
    stats: [
      { num: '6+', label: 'Бизнес-направлений', desc: 'От сигналов до разработки' },
      { num: '∞', label: 'Масштабируемость', desc: 'Партнёрская сеть без лимитов' },
      { num: '24/7', label: 'Мониторинг', desc: 'Стабильная инфраструктура' },
      { num: 'AI', label: 'Аналитика', desc: 'AiView + ручная аналитика' },
    ],
    how: {
      label: 'Процесс',
      title: 'Как работает платформа',
      steps: [
        { icon: '🔐', title: 'Регистрация', desc: 'Создайте аккаунт и получите доступ к панели управления за несколько минут.' },
        { icon: '🤝', title: 'Выбор формата', desc: 'Подключитесь как партнёр, подпишитесь на сигналы или запустите White Label продукт.' },
        { icon: '🚀', title: 'Запуск', desc: 'Настройте инструменты, подключите аудиторию и начните получать сигналы.' },
        { icon: '📈', title: 'Рост', desc: 'Масштабируйте аудиторию, увеличивайте доходность и расширяйте линейку продуктов.' },
      ]
    },
    team: {
      label: 'Команда',
      title: 'Люди за платформой',
      members: [
        { initials: 'Д', name: 'Дмитрий', role: 'Co-Founder / Product & Strategy', desc: 'Продуктовая архитектура, развитие экосистемы, логика индикаторов и стратегические партнёрства.' },
        { initials: 'И', name: 'Иван', role: 'Co-Founder / CTO', desc: 'Вся техническая инфраструктура, разработка ключевых продуктов, архитектура и масштабируемость.' },
        { initials: 'С', name: 'Сергей', role: 'Lead Trader / Educator', desc: 'Торговые стратегии, обучение пользователей, аналитика и публичный контент.' },
        { initials: 'К', name: 'Кирилл', role: 'Operations / Junior Dev', desc: 'Операционная деятельность, поддержка продуктов, тестирование и участие в разработке.' },
      ]
    },
    partners: {
      label: 'Партнёрство',
      title: 'Запусти свой продукт с нашей инфраструктурой',
      sub: 'Франшиза, White Label, revenue share — масштабируй бизнес без построения инфраструктуры с нуля.',
      perks: ['Доступ к сигналам и индикаторам', 'Revenue share с первого клиента', 'Технические ресурсы и поддержка', 'Запуск нишевых продуктов (Crypto / Forex)', 'Масштабирование через партнёрскую сеть'],
      cta: 'Стать партнёром',
      card: {
        label: 'Модели монетизации',
        models: [
          { name: 'Revenue Share', pct: 85 }, { name: 'White Label', pct: 70 }, { name: 'Подписка', pct: 95 }, { name: 'Разработка', pct: 60 }
        ]
      }
    },
    cta: { title: 'Готов начать?', sub: 'Присоединяйся к экосистеме UpDown / AiView и масштабируй свой торговый бизнес.', btn1: 'Создать аккаунт', btn2: 'Узнать о партнёрстве' },
    chart: {
      label: 'Индикатор',
      title: 'UpDown [FIB] — в действии',
      sub: 'Реальные данные с Binance. Логарифмическая сетка Фибоначчи, Key Level, зоны входа и план сделки — всё как в TradingView.',
      asset: 'Инструмент',
      timeframe: 'Таймфрейм',
      loading: 'Загрузка данных с Binance...',
      retry: 'Повторить',
      promo: {
        badge: 'Pine Script™ v6',
        title: 'UpDown [FIB] by SK TRADE v3',
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
    footer: { desc: 'Инфраструктурная торговая платформа', platform: 'Платформа', register: 'Регистрация', ecosystem: 'Экосистема', signals: 'Сигналы', whitelabel: 'White Label', indicators: 'Индикаторы', rights: 'Все права защищены' }
  },
  en: {
    nav: { products: 'Products', how: 'How it works', team: 'Team', partners: 'Partnership', login: 'Sign In', partner: 'Become a Partner', charts: 'Chart Platform' },
    hero: {
      badge: 'Infrastructure Trading Platform',
      title1: 'Trade smarter.',
      title2: 'Scale faster.',
      title3: 'Earn more.',
      sub: 'UpDown / AiView — ecosystem of trading signals, AI analytics, indicators and B2B solutions for traders and partners worldwide.',
      cta1: 'Get Started', cta2: 'Become a Partner',
      card1: 'Partner ROI', card2: 'Active', card3: 'Ready',
      stats: [
        { num: '1000+', label: 'Users' }, { num: '50+', label: 'Partners' },
        { num: '6', label: 'Products' }, { num: '99.9%', label: 'Uptime' }
      ]
    },
    products: {
      label: 'Ecosystem',
      title: 'Full arsenal for trading',
      sub: 'From signals to your own brand — everything in one ecosystem',
      items: [
        { id: 'signals', icon: '📡', tag: 'B2C', title: 'Signal Products', desc: 'Crypto, Forex, PRO and FIB strategies. Delivered via Telegram, Discord and other platforms.', features: ['AiView Crypto', 'AiView Forex', 'UpDown PRO & FIB', 'Subscription model'] },
        { id: 'whitelabel', icon: '🏷️', tag: 'B2B', title: 'White Label', desc: 'Signals delivered under your brand. Customize assets, frequency, and risk management.', features: ['Your brand', 'Telegram / Discord / X', 'Flexible risk management', 'Fast launch'] },
        { id: 'indicators', icon: '📊', tag: 'Tools', title: 'Indicators', desc: 'Proprietary analytical tools: Table Predictor, Strong Levels, Liquidity Zones and more.', features: ['Table Predictor', 'Strong Levels Finder', 'Liquidity Zones', 'Pump & MM Target'] },
        { id: 'education', icon: '🎓', tag: 'Academy', title: 'Education', desc: 'Strategies, indicator training, live market analysis. Community-driven learning.', features: ['Fibonacci strategy', 'Live analysis', 'Regular calls', 'Active community'] },
        { id: 'copy', icon: '⚡', tag: 'Auto', title: 'Copy Trading', desc: 'Automate trading by copying top platform traders with bot integration.', features: ['Connect to traders', 'Bot integration', 'Revenue share model', 'Low entry barrier'] },
        { id: 'dev', icon: '🔧', tag: 'B2B', title: 'Development', desc: 'Trading bots, indicators, AI agents, signal systems and analytics platforms built to order.', features: ['Trading bots', 'AI agents', 'Signal systems', 'Business integration'] },
      ]
    },
    stats: [
      { num: '6+', label: 'Business directions', desc: 'From signals to development' },
      { num: '∞', label: 'Scalability', desc: 'Unlimited partner network' },
      { num: '24/7', label: 'Monitoring', desc: 'Stable infrastructure' },
      { num: 'AI', label: 'Analytics', desc: 'AiView + manual analytics' },
    ],
    how: {
      label: 'Process',
      title: 'How the platform works',
      steps: [
        { icon: '🔐', title: 'Register', desc: 'Create an account and get dashboard access in minutes.' },
        { icon: '🤝', title: 'Choose Format', desc: 'Join as a partner, subscribe to signals or launch your White Label product.' },
        { icon: '🚀', title: 'Launch', desc: 'Configure tools, connect your audience and start receiving signals.' },
        { icon: '📈', title: 'Scale', desc: 'Grow your audience, increase profitability and expand your product line.' },
      ]
    },
    team: {
      label: 'Team',
      title: 'People behind the platform',
      members: [
        { initials: 'D', name: 'Dmitry', role: 'Co-Founder / Product & Strategy', desc: 'Product architecture, ecosystem development, indicator logic and strategic partnerships.' },
        { initials: 'I', name: 'Ivan', role: 'Co-Founder / CTO', desc: 'Full technical infrastructure, development of key products, architecture and scalability.' },
        { initials: 'S', name: 'Sergey', role: 'Lead Trader / Educator', desc: 'Trading strategies, user education, analytics and public content.' },
        { initials: 'K', name: 'Kirill', role: 'Operations / Junior Dev', desc: 'Operations, product support, testing and development participation.' },
      ]
    },
    partners: {
      label: 'Partnership',
      title: 'Launch your product with our infrastructure',
      sub: 'Franchise, White Label, revenue share — scale your business without building infrastructure from scratch.',
      perks: ['Access to signals and indicators', 'Revenue share from day one', 'Technical resources and support', 'Launch niche products (Crypto / Forex)', 'Scale through partner network'],
      cta: 'Become a Partner',
      card: {
        label: 'Monetization models',
        models: [
          { name: 'Revenue Share', pct: 85 }, { name: 'White Label', pct: 70 }, { name: 'Subscription', pct: 95 }, { name: 'Development', pct: 60 }
        ]
      }
    },
    cta: { title: 'Ready to start?', sub: 'Join the UpDown / AiView ecosystem and scale your trading business.', btn1: 'Create account', btn2: 'Learn about partnership' },
    chart: {
      label: 'Indicator',
      title: 'UpDown [FIB] — in action',
      sub: 'Live data from Binance. Logarithmic Fibonacci grid, Key Level, entry zones and trade plan — exactly as seen in TradingView.',
      asset: 'Instrument',
      timeframe: 'Timeframe',
      loading: 'Loading data from Binance...',
      retry: 'Retry',
      promo: {
        badge: 'Pine Script™ v6',
        title: 'UpDown [FIB] by SK TRADE v3',
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
    footer: { desc: 'Infrastructure trading platform', platform: 'Platform', register: 'Register', ecosystem: 'Ecosystem', signals: 'Signals', whitelabel: 'White Label', indicators: 'Indicators', rights: 'All rights reserved' }
  }
}

const t = computed(() => translations[lang.value])
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Roboto:wght@300;400;500;700&display=swap');

/* ============================================================
   CSS VARIABLES — THEMES
============================================================ */
.landing {
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden;

  /* DARK THEME (default) */
  --bg:          #0a0a0b;
  --bg-2:        #111114;
  --bg-3:        #18181d;
  --surface:     #1c1c22;
  --surface-2:   #242430;
  --border:      rgba(255,255,255,0.07);
  --border-2:    rgba(255,255,255,0.12);
  --text:        #f0f0f0;
  --text-2:      #a0a0b0;
  --text-3:      #606070;
  --accent:      #c9a84c;
  --accent-2:    #e8c96a;
  --accent-glow: rgba(201,168,76,0.25);
  --blue:        #3b5bdb;
  --blue-glow:   rgba(59,91,219,0.3);

  /* LIGHT THEME */
  &.light {
    --bg:          #f4f6fb;
    --bg-2:        #ffffff;
    --bg-3:        #eef1f8;
    --surface:     #ffffff;
    --surface-2:   #f0f4ff;
    --border:      rgba(0,0,0,0.07);
    --border-2:    rgba(0,0,0,0.12);
    --text:        #0f0f1a;
    --text-2:      #4a4a6a;
    --text-3:      #9090aa;
    --accent:      #3b5bdb;
    --accent-2:    #1d3db5;
    --accent-glow: rgba(59,91,219,0.2);
    --blue:        #3b5bdb;
    --blue-glow:   rgba(59,91,219,0.25);
  }

  background: var(--bg);
  color: var(--text);
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;

  &.revealed { opacity: 1; transform: none; }

  @for $i from 1 through 6 {
    &--delay-#{$i} { transition-delay: #{$i * 0.1}s; }
  }
}

/* ============================================================
   NAVBAR
============================================================ */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  transition: background 0.3s, border-color 0.3s;
  border-bottom: 1px solid transparent;

  &--scrolled {
    background: rgba(10,10,11,0.85);
    backdrop-filter: blur(20px);
    border-color: var(--border);

    .landing.light & {
      background: rgba(244,246,251,0.9);
    }
  }

  &__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__links {
    display: flex;
    gap: 32px;

    a {
      color: var(--text-2);
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s;
      &:hover { color: var(--text); }
    }

    .nav__charts-link {
      color: #4f6ef7;
      font-weight: 600;
      &:hover { color: #7b9cff; }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: default;
}

.logo-icon {
  font-size: 20px;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  color: var(--accent);
  line-height: 1;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  color: var(--text);
  letter-spacing: -0.3px;
}

.icon-btn {
  width: 34px; height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border-2);
  background: var(--surface);
  color: var(--text-2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  &:hover { color: var(--text); border-color: var(--accent); }
}

.lang-btn {
  height: 34px; padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--border-2);
  background: var(--surface);
  color: var(--text-2);
  font-size: 12px; font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;
  &:hover { color: var(--accent); border-color: var(--accent); }
}

.btn-nav {
  height: 34px; padding: 0 16px;
  border-radius: 8px;
  border: 1px solid var(--border-2);
  background: transparent;
  color: var(--text-2);
  font-size: 13px; font-weight: 500;
  font-family: 'Roboto', sans-serif;
  text-decoration: none;
  display: inline-flex; align-items: center;
  transition: all 0.2s;
  &:hover { color: var(--text); border-color: var(--border-2); text-decoration: none; }

  &--accent {
    background: var(--accent);
    color: #000;
    border-color: var(--accent);
    font-weight: 600;
    &:hover { background: var(--accent-2); border-color: var(--accent-2); color: #000; }

    .landing.light & {
      color: #fff;
      &:hover { color: #fff; }
    }
  }
}

/* ============================================================
   HERO
============================================================ */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 120px 32px 80px;

  &__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%);
  }

  &__content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 800px;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 99px;
    border: 1px solid var(--border-2);
    background: var(--surface);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
    margin-bottom: 32px;
    letter-spacing: 0.3px;
  }

  &__title {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(32px, 4.5vw, 58px);
    font-weight: 800;
    line-height: 1.12;
    margin-bottom: 24px;
    letter-spacing: -1.5px;
    font-stretch: normal;
  }

  &__sub {
    font-family: 'Roboto', sans-serif;
    font-size: 17px;
    font-weight: 400;
    color: var(--text-2);
    line-height: 1.8;
    max-width: 600px;
    margin: 0 auto 40px;
  }

  &__cta {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 64px;
  }

  &__stats {
    display: flex;
    gap: 48px;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__cards {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }
}

.badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.title-line {
  display: block;
  &--accent {
    color: var(--accent);
    text-shadow: 0 0 60px var(--accent-glow);
  }
}

.hero-stat {
  text-align: center;
  &__num {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: var(--accent);
  }
  &__label {
    font-size: 12px;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

/* Orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: float 8s ease-in-out infinite;

  &--1 {
    width: 400px; height: 400px;
    background: var(--accent-glow);
    top: 10%; left: -10%;
    animation-delay: 0s;
  }
  &--2 {
    width: 300px; height: 300px;
    background: var(--blue-glow);
    top: 20%; right: -5%;
    animation-delay: -3s;
  }
  &--3 {
    width: 250px; height: 250px;
    background: var(--accent-glow);
    bottom: 10%; left: 30%;
    animation-delay: -6s;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

/* Float cards */
.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--border-2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  animation: floatCard 6s ease-in-out infinite;

  &--1 { top: 25%; left: 5%; animation-delay: 0s; }
  &--2 { top: 40%; right: 5%; animation-delay: -2s; }
  &--3 { bottom: 25%; left: 8%; animation-delay: -4s; }

  &__icon { font-size: 22px; }
  &__text {
    span { display: block; font-size: 14px; font-weight: 700; font-family: 'Montserrat', sans-serif; color: var(--text); }
    small { font-size: 11px; color: var(--text-3); }
  }
}

@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* ============================================================
   BUTTONS
============================================================ */
.btn-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 10px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &--primary {
    background: var(--accent);
    color: #000;
    box-shadow: 0 4px 24px var(--accent-glow);
    &:hover { background: var(--accent-2); transform: translateY(-1px); box-shadow: 0 8px 32px var(--accent-glow); text-decoration: none; color: #000; }

    .landing.light & { color: #fff; &:hover { color: #fff; } }
  }

  &--ghost {
    background: transparent;
    color: var(--text-2);
    border: 1px solid var(--border-2);
    &:hover { color: var(--text); border-color: var(--accent); text-decoration: none; }
  }
}

/* ============================================================
   TICKER
============================================================ */
.ticker {
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 14px 0;
  background: var(--bg-2);

  &__track {
    display: flex;
    gap: 48px;
    white-space: nowrap;
    animation: ticker 25s linear infinite;
  }

  &__item {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-3);
    text-transform: uppercase;
    letter-spacing: 1px;
    flex-shrink: 0;
  }
}

@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ============================================================
   SECTION COMMONS
============================================================ */
.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
}

.section-label {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(24px, 3vw, 38px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin-bottom: 16px;
  color: var(--text);
  font-stretch: normal;
}

.section-sub {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--text-2);
  max-width: 560px;
  margin-bottom: 60px;
  line-height: 1.7;
}

/* ============================================================
   PRODUCTS
============================================================ */
.products {
  padding: 120px 0;
  background: var(--bg);
}

.products__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-card {
  position: relative;
  padding: 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
  cursor: default;

  &:hover {
    border-color: var(--accent);
    transform: translateY(-4px);
    .product-card__glow { opacity: 1; }
  }

  &__glow {
    position: absolute;
    top: -60px; left: -60px;
    width: 200px; height: 200px;
    background: var(--accent-glow);
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__icon { font-size: 32px; }

  &__tag {
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 4px;
    background: var(--surface-2);
    color: var(--accent);
    border: 1px solid var(--border);
  }

  h3 {
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--text);
    letter-spacing: 0;
  }

  p {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.65;
    margin-bottom: 20px;
    font-weight: 400;
  }

  &__features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;

    li {
      font-family: 'Roboto', sans-serif;
      font-size: 13px;
      color: var(--text-3);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .check {
      color: var(--accent);
      font-size: 10px;
    }
  }
}

/* ============================================================
   STATS SECTION
============================================================ */
.stats-section {
  position: relative;
  padding: 100px 0;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--bg-3), var(--bg-2));
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
}

.stats-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.big-stat {
  padding: 48px 40px;
  background: var(--surface);
  text-align: center;

  &__num {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-size: 44px;
    font-weight: 800;
    color: var(--accent);
    line-height: 1.1;
    margin-bottom: 12px;
    text-shadow: 0 0 40px var(--accent-glow);
    font-stretch: normal;
    letter-spacing: -0.5px;
  }

  &__label {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 6px;
    font-stretch: normal;
  }

  &__desc {
    font-size: 12px;
    color: var(--text-3);
  }
}

/* ============================================================
   HOW IT WORKS
============================================================ */
.how {
  padding: 120px 0;
  background: var(--bg);

  &__steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 60px;
  }

  &__step {
    position: relative;
    padding: 32px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    transition: border-color 0.3s;
    &:hover { border-color: var(--accent); }

    &-num {
      font-family: 'Montserrat', sans-serif;
      font-size: 48px;
      font-weight: 800;
      color: var(--border-2);
      line-height: 1;
      margin-bottom: 16px;
    }

    &-icon { font-size: 28px; margin-bottom: 16px; }

    h3 {
      font-family: 'Montserrat', sans-serif;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--text);
    }

    p { font-family: 'Roboto', sans-serif; font-size: 14px; color: var(--text-2); line-height: 1.7; font-weight: 400; }
  }
}

/* ============================================================
   TEAM
============================================================ */
.team {
  padding: 120px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);

  &__grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-top: 60px;
    padding-bottom: 8px;
  }
}

.team-card {
  padding: 28px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: border-color 0.3s, transform 0.3s;
  &:hover { border-color: var(--accent); transform: translateY(-4px); }

  &__avatar {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--accent), var(--blue));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 20px; font-weight: 800;
    color: #fff;
    margin-bottom: 16px;
  }

  &__info {
    h3 {
      font-family: 'Montserrat', sans-serif;
      font-size: 15px; font-weight: 700;
      color: var(--text); margin-bottom: 4px;
    }
    p { font-size: 12px; color: var(--text-3); line-height: 1.6; margin-top: 8px; }
  }

  &__role {
    font-size: 11px; font-weight: 600;
    color: var(--accent);
    letter-spacing: 0.2px;
  }
}

/* ============================================================
   PARTNERS
============================================================ */
.partners {
  padding: 120px 0;
  background: var(--bg);
  border-top: 1px solid var(--border);

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  &__sub {
    font-size: 16px;
    color: var(--text-2);
    line-height: 1.8;
    margin-bottom: 32px;
  }

  &__perks {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 40px;

    li {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--text-2);
    }
  }
}

.perk-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  box-shadow: 0 0 6px var(--accent);
}

.revenue-card {
  background: var(--surface);
  border: 1px solid var(--border-2);
  border-radius: 20px;
  padding: 36px;

  &__label {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 28px;
  }

  &__model {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }
}

.model-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
  min-width: 110px;
}

.model-bar {
  flex: 1;
  height: 6px;
  background: var(--surface-2);
  border-radius: 3px;
  overflow: hidden;

  &__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    border-radius: 3px;
    transition: width 1s ease;
    box-shadow: 0 0 8px var(--accent-glow);
  }
}

.model-pct {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  min-width: 32px;
  text-align: right;
}

/* ============================================================
   CTA SECTION
============================================================ */
.cta-section {
  position: relative;
  padding: 120px 0;
  text-align: center;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--bg-3), var(--bg));
    border-top: 1px solid var(--border);
  }

  &__title {
    position: relative;
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(32px, 5vw, 60px);
    font-weight: 800;
    letter-spacing: -1.5px;
    color: var(--text);
    margin-bottom: 16px;
  }

  &__sub {
    position: relative;
    font-size: 16px;
    color: var(--text-2);
    max-width: 520px;
    margin: 0 auto 40px;
    line-height: 1.7;
  }

  &__actions {
    position: relative;
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
}

/* ============================================================
   FOOTER
============================================================ */
.footer {
  padding: 60px 0 32px;
  background: var(--bg-2);
  border-top: 1px solid var(--border);

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 48px;
    gap: 40px;
    flex-wrap: wrap;
  }

  &__brand {
    p {
      font-size: 13px;
      color: var(--text-3);
      margin-top: 10px;
    }
  }

  &__cols {
    display: flex;
    gap: 60px;
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: 10px;

    strong {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-3);
      margin-bottom: 4px;
    }

    a {
      font-size: 13px;
      color: var(--text-2);
      text-decoration: none;
      transition: color 0.2s;
      &:hover { color: var(--accent); }
    }
  }

  &__bottom {
    border-top: 1px solid var(--border);
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    span { font-size: 12px; color: var(--text-3); }
  }
}

/* ============================================================
   CHART SECTION
============================================================ */
.chart-section {
  padding: 120px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);

  .section-sub { margin-bottom: 0; }
}

.chart-section__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 36px;
}

.tv-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(41, 98, 255, 0.3);
  background: rgba(41, 98, 255, 0.08);
  font-size: 12px;
  font-weight: 700;
  color: #2962FF;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  align-self: flex-start;
  margin-top: 8px;

  &:hover { background: rgba(41, 98, 255, 0.15); text-decoration: none; }
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  &__group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-3);
    white-space: nowrap;
  }

  &__btns {
    display: flex;
    gap: 6px;
  }

  &__indicator-tag {
    margin-left: auto;
  }
}

.ind-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 6px;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.25);
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.3px;

  .landing.light & {
    background: rgba(59, 91, 219, 0.08);
    border-color: rgba(59, 91, 219, 0.2);
    color: var(--accent);
  }

  &__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    animation: pulse 2s infinite;
    flex-shrink: 0;
  }
}

.chart-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-2);
  background: var(--surface);
  color: var(--text-2);
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;

  &:hover {
    color: var(--text);
    border-color: var(--accent);
  }

  &--active {
    background: var(--accent);
    color: #000;
    border-color: var(--accent);
    box-shadow: 0 2px 12px var(--accent-glow);
    .landing.light & { color: #fff; }
  }

  &__icon { font-size: 14px; }
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 520px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-2);
  background: var(--surface);
  margin-bottom: 32px;

  @media (max-width: 768px) { height: 340px; }
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

.chart-overlay {
  position: absolute;
  inset: 0;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 5;

  &--error {
    background: rgba(10,10,11,0.92);
    gap: 8px;
  }
}

.chart-error-icon { font-size: 28px; }
.chart-error-text {
  font-size: 13px;
  color: #f59e0b;
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
}
.chart-retry-btn {
  margin-top: 4px;
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: var(--accent); color: #000; }
}

.chart-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  &__text {
    font-size: 13px;
    color: var(--text-3);
  }
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Легенда */
.chart-legend {
  position: absolute;
  top: 12px;
  left: 14px;
  z-index: 4;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  pointer-events: none;

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 600;
    color: var(--text-2);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 3px 8px;
    opacity: 0.9;
  }
}

.legend-line {
  display: inline-block;
  width: 16px;
  height: 2px;
  border-radius: 1px;

  &--kl     { background: #00ff0a; }
  &--fib0   { background: #00ff0a; opacity: 0.7; }
  &--fib2   { background: #e12828; }
  &--entry  { background: #f5c842; }
  &--entry1 { background: #3b82f6; }
  &--entry2 { background: #06b6d4; }
  &--sl     { background: #ef4444; }
  &--tp     { background: #22c55e; border-top: 2px dashed #22c55e; height: 0; }
}

/* Инфо о сигнале */
.chart-signal-info {
  position: absolute;
  bottom: 12px;
  left: 14px;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.signal-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 800;
  color: #ef4444;
  letter-spacing: 1px;

  &__dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 5px #ef4444;
    animation: pulse 2s infinite;
  }

  &__detail {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-2);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 4px 10px;
    font-family: 'Roboto Mono', monospace, 'Roboto', sans-serif;
  }
}

/* ---- Indicator promo ---- */
.indicator-promo {
  &__card {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
    background: var(--surface);
    border: 1px solid var(--border-2);
    border-radius: 20px;
    padding: 48px;
    overflow: hidden;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  &__glow {
    position: absolute;
    top: -80px; left: -80px;
    width: 300px; height: 300px;
    background: var(--accent-glow);
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    opacity: 0.5;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 6px;
    background: rgba(201, 168, 76, 0.12);
    border: 1px solid rgba(201, 168, 76, 0.3);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;

    .landing.light & {
      background: rgba(59, 91, 219, 0.1);
      border-color: rgba(59, 91, 219, 0.25);
    }
  }

  &__left {
    position: relative;
    h3 {
      font-family: 'Montserrat', sans-serif;
      font-size: 20px; font-weight: 800;
      color: var(--text); margin-bottom: 12px;
      letter-spacing: -0.3px; line-height: 1.3;
    }
    p {
      font-size: 14px; color: var(--text-2);
      line-height: 1.7; margin-bottom: 20px;
    }
  }

  &__features {
    list-style: none;
    display: flex; flex-direction: column; gap: 8px;

    li {
      font-size: 13px; color: var(--text-2);
      display: flex; align-items: center; gap: 8px;
      .check { color: var(--accent); font-size: 10px; }
    }
  }

  &__right { position: relative; }

  &__tv {
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
  }
}

.tv-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;

  span {
    font-family: 'Montserrat', sans-serif;
    font-size: 18px; font-weight: 800;
    color: var(--text); letter-spacing: -0.3px;
  }
}

.tv-note {
  font-size: 13px; color: var(--text-2);
  line-height: 1.7; margin-bottom: 20px;
}

/* Pine Script preview */
.tv-pine-preview {
  background: #1e1e2e;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;

  &__header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  &__dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    &--red    { background: #ff5f57; }
    &--yellow { background: #febc2e; }
    &--green  { background: #28c840; }
  }

  &__title {
    margin-left: 6px;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.5px;
    font-family: 'Roboto', sans-serif;
  }

  &__code {
    padding: 14px 16px;
    margin: 0;
    font-family: 'Roboto Mono', 'Courier New', monospace;
    font-size: 11px;
    line-height: 1.7;
    color: #cdd6f4;
    overflow: hidden;
    white-space: pre-wrap;
  }
}

.ps-comment { color: #6c7086; }
.ps-kw      { color: #cba6f7; }
.ps-str     { color: #a6e3a1; }

.tv-pine-note {
  margin-top: 14px;
  font-size: 10px;
  color: var(--text-3);
  text-align: center;
  line-height: 1.5;
}

/* ============================================================
   HAMBURGER + MOBILE MENU
============================================================ */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 34px; height: 34px;
  background: var(--surface);
  border: 1px solid var(--border-2);
  border-radius: 8px;
  cursor: pointer;
  padding: 7px 8px;

  span {
    display: block;
    height: 2px;
    background: var(--text-2);
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  &--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  &--open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  &--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
}

.nav__mobile {
  display: none;
  flex-direction: column;
  padding: 0 20px;
  border-top: 1px solid var(--border);
  background: var(--bg);
  gap: 4px;
  /* Закрыто: нулевая высота + clip, без overflow:hidden на самом блоке */
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.35s ease;

  &--open {
    max-height: 480px;
    padding: 12px 20px 16px;
  }

  a {
    display: block;
    padding: 11px 12px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    color: var(--text-2);
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
    &:hover { background: var(--surface); color: var(--text); text-decoration: none; }
  }

  .nav__charts-link { color: #4f6ef7; font-weight: 600; }

  .mobile-partner-link {
    margin-top: 8px;
    background: var(--accent);
    color: #0a0a0b !important;
    font-weight: 700;
    text-align: center;
    &:hover { background: var(--accent-2); color: #0a0a0b !important; }
  }
}

/* ============================================================
   RESPONSIVE
============================================================ */

/* ── 1100px: скрываем nav-ссылки, показываем бургер ── */
@media (max-width: 1100px) {
  .products__grid { grid-template-columns: repeat(2, 1fr); }
  .team__grid { grid-template-columns: repeat(3, 1fr); }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .how__steps { grid-template-columns: repeat(2, 1fr); }
  .nav__inner { padding: 0 24px; }

  /* Ссылки убираем, показываем бургер — nav остаётся аккуратным */
  .nav__links { display: none; }
  .nav__mobile { display: flex; }
  .hamburger { display: flex; }
  /* На планшете логин-кнопку прячем, оставляем только accent */
  .btn-nav--login { display: none; }
}

/* ── 900px ── */
@media (max-width: 900px) {
  .section-container { padding: 0 24px; }
  .nav__inner { padding: 0 20px; }
}

/* ── 768px: планшет вертикальный ── */
@media (max-width: 768px) {
  .btn-nav { display: none; }

  .hero { padding: 100px 20px 60px; }
  .hero__sub { font-size: 15px; }
  .hero__stats { gap: 28px; }
  .hero__cards { display: none; }
  .float-card { display: none; }

  .products__grid { grid-template-columns: 1fr; }
  .team__grid { grid-template-columns: repeat(2, 1fr); }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .how__steps { grid-template-columns: 1fr; }
  .partners__inner { grid-template-columns: 1fr; }

  .footer__top { flex-direction: column; gap: 32px; }
  .footer__cols { flex-direction: row; gap: 32px; flex-wrap: wrap; }
  .footer__col { min-width: 140px; }
}

/* ── 600px: телефон ── */
@media (max-width: 600px) {
  .hero { padding: 90px 16px 52px; }
  .hero__cta { flex-direction: column; align-items: center; }
  .btn-hero { width: 100%; max-width: 320px; justify-content: center; }
  .hero__stats { gap: 20px; }
  .hero-stat__num { font-size: 22px; }
  .section-container { padding: 0 16px; }
  .section-title { font-size: clamp(20px, 6vw, 30px); }
}

/* ── 480px ── */
@media (max-width: 480px) {
  .team__grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr; }
  .nav__inner { padding: 0 16px; height: 60px; }
  .footer__cols { flex-direction: column; gap: 24px; }
}
</style>