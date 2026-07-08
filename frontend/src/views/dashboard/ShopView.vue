<template>
  <div class="shop">
    <!-- Promo banner -->
    <div v-if="banner" class="promo-banner" :style="banner.imageUrl ? `--bb: url(${banner.imageUrl})` : ''">
      <div class="promo-banner__body">
        <div class="promo-badge">🔥 {{ t.promo }}</div>
        <h2>{{ banner.title }}</h2>
        <p>{{ banner.message }}</p>
        <div class="promo-timer" v-if="banner.endsAt">⏱ {{ t.endsIn }}: <strong>{{ countdown }}</strong></div>
      </div>
    </div>

    <!-- Period + Cart header -->
    <div class="shop-top">
      <div class="period-selector">
        <span class="period-label">{{ t.period }}</span>
        <div class="period-btns">
          <button v-for="p in periods" :key="p.months"
            class="period-btn" :class="{ 'period-btn--active': cart.selectedPeriod === p.months }"
            @click="cart.selectedPeriod = p.months">
            {{ p.label }}
            <span v-if="p.discount > 0" class="period-disc">-{{ getDiscount(p.months) }}%</span>
          </button>
        </div>
      </div>
      <button class="cart-btn" v-if="cart.count > 0" @click="showCart = true">
        🛒 {{ t.cart }} ({{ cart.count }}) — {{ cartTotal }} USDT
      </button>
    </div>

    <!-- Plans -->
    <section class="shop-section">
      <h2 class="section-h">🎯 {{ t.plans }}</h2>
      <div class="plans-grid">
        <div class="plan-card" v-for="plan in plans" :key="plan.id" :class="`plan-card--${plan.type?.toLowerCase()}`">
          <div class="plan-badge" v-if="plan.type === 'ELITE'">{{ t.popular }}</div>
          <div class="plan-type">{{ plan.type }}</div>
          <div class="plan-price-row">
            <span class="plan-price">{{ calcPrice(plan.price) }}</span>
            <span class="plan-currency">USDT</span>
          </div>
          <div class="plan-orig" v-if="getDiscount(cart.selectedPeriod) > 0">{{ +(plan.price * cart.selectedPeriod).toFixed(0) }} USDT</div>
          <p class="plan-desc">{{ plan.description }}</p>
          <ul class="plan-features">
            <li v-for="f in plan.features" :key="f"><span class="feat-dot">✦</span>{{ f }}</li>
          </ul>
          <button class="btn-add" @click="addPlan(plan)">
            {{ isInCart(plan.id) ? '✓ ' + t.inCart : '+ ' + t.addToCart }}
          </button>
        </div>
      </div>
    </section>

    <!-- Signal channels — compact -->
    <section class="shop-section">
      <h2 class="section-h">📡 {{ t.channels }}</h2>
      <p class="section-sub">{{ t.channelsSub }} <router-link to="/dashboard/signals">{{ t.detailsInSignals }}</router-link></p>
      <div class="channels-compact-grid">
        <div class="channel-compact" v-for="ch in channels" :key="ch.id">
          <div class="channel-compact__badge" v-if="ch.badge">{{ ch.badge }}</div>
          <div class="channel-compact__name">📡 {{ ch.name }}</div>
          <div class="channel-compact__price-row">
            <span class="ch-price">{{ calcPrice(ch.price) }} USDT</span>
            <span class="ch-orig" v-if="getDiscount(cart.selectedPeriod) > 0">{{ +(ch.price * cart.selectedPeriod).toFixed(0) }}</span>
          </div>
          <button class="btn-add btn-add--sm" @click="addProduct(ch, 'channel')">
            {{ isInCart(ch.id) ? '✓ ' + t.inCart : '+ ' + t.addToCart }}
          </button>
        </div>
      </div>
    </section>

    <!-- Indicators — compact -->
    <section class="shop-section">
      <h2 class="section-h">📊 {{ t.indicators }}</h2>
      <p class="section-sub">{{ t.indicatorsSub }} <router-link to="/dashboard/indicators">{{ t.detailsInIndicators }}</router-link></p>
      <div class="indicators-compact-grid">
        <div class="indicator-compact" v-for="ind in indicators" :key="ind.id">
          <div class="indicator-compact__name">{{ ind.name }}</div>
          <div class="indicator-compact__price">{{ calcPrice(ind.price) }} USDT</div>
          <button class="btn-add btn-add--sm" @click="addProduct(ind, 'indicator')">
            {{ isInCart(ind.id) ? '✓ ' + t.inCart : '+ ' + t.addToCart }}
          </button>
        </div>
      </div>
    </section>

    <!-- Cart slide-in -->
      <div class="cart-overlay" v-if="showCart" @click.self="showCart=false">
        <div class="cart-panel">
          <div class="cart-panel__header">
            <h3>🛒 {{ t.yourCart }}</h3>
            <button class="cart-close" @click="showCart=false">×</button>
          </div>

          <div class="cart-period">
            <span>{{ t.period }}</span>
            <div class="period-btns">
              <button v-for="p in periods" :key="p.months"
                class="period-btn period-btn--sm" :class="{ 'period-btn--active': cart.selectedPeriod === p.months }"
                @click="cart.selectedPeriod = p.months">
                {{ p.label }}
                <span v-if="p.discount > 0" class="period-disc">-{{ getDiscount(p.months) }}%</span>
              </button>
            </div>
          </div>

          <div class="cart-items">
            <div class="cart-item" v-for="item in cart.items" :key="item.id">
              <div class="cart-item__name">{{ item.name }}</div>
              <div class="cart-item__price">{{ calcPrice(item.price) }} USDT</div>
              <button class="cart-item__remove" @click="cart.remove(item.id)">×</button>
            </div>
          </div>

          <div class="cart-footer">
            <div class="cart-total">{{ t.total }}: <strong>{{ cartTotal }} USDT</strong></div>
            <div v-if="getDiscount(cart.selectedPeriod) > 0" class="cart-saving">
              {{ t.saving }}: {{ cartSaving }} USDT (-{{ getDiscount(cart.selectedPeriod) }}%)
            </div>
            <button class="btn-checkout" @click="checkout" :disabled="paying">
              {{ paying ? '...' : t.payNow }}
            </button>
            <button class="btn-clear" @click="cart.clear()">{{ t.clearCart }}</button>
          </div>
        </div>
      </div>
    

    <!-- Pay modal -->
      <div class="pay-modal-overlay" v-if="paymentUrl" @click.self="paymentUrl=null">
        <div class="pay-modal">
          <h3>{{ t.payTitle }}</h3>
          <p>{{ t.payDesc }}</p>
          <a :href="paymentUrl" target="_blank" class="btn-checkout" style="display:block;text-align:center;text-decoration:none">💳 {{ t.payNowLink }}</a>
          <button class="btn-clear" @click="paymentUrl=null">{{ t.close }}</button>
        </div>
      </div>
    

    <div v-if="error" class="shop-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { plansApi, paymentApi, shopApi, bannersApi } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/shop'

const cart = useCartStore()
const plans = ref([])
const indicators = ref([])
const channels = ref([])
const paying = ref(false)
const error = ref('')
const paymentUrl = ref(null)
const banner = ref(null)
const showCart = ref(false)
const countdown = ref('')
let timerInterval = null

const periods = computed(() => [
  { months: 1,  label: t.value.mo1,  discount: 0 },
  { months: 3,  label: t.value.mo3,  discount: 3 },
  { months: 6,  label: t.value.mo6,  discount: 5 },
  { months: 12, label: t.value.mo12, discount: 15 },
])

function getDiscount(months) {
  const base = cart.PERIOD_DISCOUNTS[months] ?? 0
  const bannerD = banner.value?.periodDiscounts?.[months] ?? 0
  return Math.max(base, bannerD)
}

function calcPrice(basePrice) {
  const d = getDiscount(cart.selectedPeriod)
  return +((basePrice * cart.selectedPeriod) * (1 - d / 100)).toFixed(0)
}

const cartTotal = computed(() => cart.items.reduce((s, i) => s + calcPrice(i.price), 0).toFixed(0))
const cartSaving = computed(() => {
  const full = cart.items.reduce((s, i) => s + i.price * cart.selectedPeriod, 0)
  return (full - Number(cartTotal.value)).toFixed(0)
})

function isInCart(id) { return !!cart.items.find(i => i.id === id) }

function addPlan(plan) {
  cart.add({ id: plan.id, name: plan.name, price: plan.price, type: 'subscription', planId: plan.id })
}
function addProduct(product, type) {
  cart.add({ id: product.id, name: product.name, price: product.price, type, shopProductId: product.id })
}

onMounted(async () => {
  ;[plans.value, indicators.value, channels.value] = await Promise.all([
    plansApi.getAll().then(r => r.data).catch(() => []),
    shopApi.getIndicators().then(r => r.data).catch(() => []),
    shopApi.getChannels().then(r => r.data).catch(() => []),
  ])
  try {
    const b = await bannersApi.getActive().then(r => r.data)
    if (b) { banner.value = b; if (b.endsAt) startTimer() }
  } catch {}
})

function startTimer() {
  timerInterval = setInterval(() => {
    const diff = new Date(banner.value.endsAt) - new Date()
    if (diff <= 0) { countdown.value = '00:00:00'; return }
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000).toString().padStart(2,'0')
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2,'0')
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2,'0')
    countdown.value = d > 0 ? `${d}${t.value.daysShort} ${h}:${m}:${s}` : `${h}:${m}:${s}`
  }, 1000)
}

async function checkout() {
  if (!cart.items.length) return
  paying.value = true; error.value = ''
  try {
    const bannerDiscountPercent = getDiscount(cart.selectedPeriod)
    // Отправляем ВСЮ корзину одной оплатой (batch). Бэкенд суммирует все позиции.
    const items = cart.items.map(i => ({
      type: i.type,
      planId: i.planId,
      shopProductId: i.shopProductId,
      periodMonths: cart.selectedPeriod,
      bannerDiscountPercent,
    }))
    const res = await paymentApi.createBatchInvoice({ items })
    paymentUrl.value = res.data.paymentUrl
    showCart.value = false
  } catch (e) {
    error.value = e.response?.data?.message || t.value.paymentError
  } finally { paying.value = false }
}

const t = useT(dict)
</script>

<style lang="scss" scoped>
.shop { max-width: 1100px; }

/* Promo */
.promo-banner { background: linear-gradient(135deg,#1a1a2e,#0f3460); border: 1px solid rgba(201,243,29,0.3); border-radius: 14px; padding: 24px 28px; margin-bottom: 24px; position: relative; overflow: hidden; &::before { content:''; position:absolute; inset:0; background:var(--bb) center/cover; opacity:0.1; } &__body { position:relative; z-index:1; } h2 { font-family:'Montserrat',sans-serif; font-size:18px; font-weight:800; color:var(--text); margin-bottom:4px; } p { font-size:13px; color:var(--text-2); } }
.promo-badge { display:inline-block; background:var(--accent); color:#0a0a0b; font-size:10px; font-weight:800; padding:3px 10px; border-radius:20px; font-family:'Montserrat',sans-serif; margin-bottom:8px; }
.promo-timer { font-size:13px; color:var(--text-2); margin-top:8px; strong { color:var(--accent); font-family:'Montserrat',sans-serif; font-size:16px; } }

/* Top bar */
.shop-top { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:28px; }
.period-selector { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.period-label { font-size:13px; color:var(--text-2); font-weight:600; }
.period-btns { display:flex; gap:6px; flex-wrap:wrap; }
.period-btn { padding:7px 16px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text-2); font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:5px; &--active { border-color:var(--accent); color:var(--accent); background:rgba(201,243,29,0.08); } &--sm { padding:5px 11px; font-size:11px; } }
.period-disc { background:var(--accent); color:#0a0a0b; font-size:9px; font-weight:800; padding:1px 5px; border-radius:3px; font-family:'Montserrat',sans-serif; }
.cart-btn { padding:10px 20px; background:var(--accent); color:#0a0a0b; border:none; border-radius:10px; font-family:'Montserrat',sans-serif; font-size:13px; font-weight:700; cursor:pointer; white-space:nowrap; transition:opacity 0.2s; &:hover { opacity:0.9; } }

/* Sections */
.shop-section { margin-bottom:40px; }
.section-h { font-family:'Montserrat',sans-serif; font-size:18px; font-weight:800; color:var(--text); margin-bottom:6px; }
.section-sub { font-size:13px; color:var(--text-2); margin-bottom:16px; a { color:var(--accent); text-decoration:none; &:hover { text-decoration:underline; } } }

/* Plans */
.plans-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
.plan-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:24px; position:relative; transition:transform 0.2s; &--elite { border-color:rgba(201,243,29,0.35); } &:hover { transform:translateY(-3px); } }
.plan-badge { position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:var(--accent); color:#0a0a0b; font-size:10px; font-weight:800; padding:3px 14px; border-radius:20px; font-family:'Montserrat',sans-serif; }
.plan-type { font-family:'Montserrat',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; color:var(--accent); margin-bottom:6px; }
.plan-price-row { display:flex; align-items:baseline; gap:5px; margin-bottom:3px; }
.plan-price { font-family:'Montserrat',sans-serif; font-size:32px; font-weight:800; color:var(--text); }
.plan-currency { font-size:13px; color:var(--text-3); }
.plan-orig { font-size:12px; color:var(--text-3); text-decoration:line-through; margin-bottom:10px; }
.plan-desc { font-size:12px; color:var(--text-2); margin-bottom:14px; line-height:1.6; }
.plan-features { list-style:none; display:flex; flex-direction:column; gap:6px; margin-bottom:18px; li { font-size:12px; color:var(--text-2); display:flex; gap:7px; align-items:flex-start; } }
.feat-dot { color:var(--accent); font-size:9px; margin-top:2px; flex-shrink:0; }

/* Channels compact */
.channels-compact-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.channel-compact { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:16px; position:relative; transition:border-color 0.2s; &:hover { border-color:var(--border-2); } &__badge { position:absolute; top:8px; right:10px; background:var(--accent); color:#0a0a0b; font-size:9px; font-weight:800; padding:2px 8px; border-radius:20px; font-family:'Montserrat',sans-serif; } &__name { font-size:12px; font-weight:600; color:var(--text); margin-bottom:8px; line-height:1.4; } &__price-row { display:flex; align-items:baseline; gap:6px; margin-bottom:12px; } }
.ch-price { font-family:'Montserrat',sans-serif; font-size:15px; font-weight:800; color:var(--accent); }
.ch-orig { font-size:11px; color:var(--text-3); text-decoration:line-through; }

/* Indicators compact */
.indicators-compact-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.indicator-compact { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:10px; transition:border-color 0.2s; &:hover { border-color:var(--border-2); } &__name { font-size:12px; font-weight:600; color:var(--text); flex:1; } &__price { font-family:'Montserrat',sans-serif; font-size:13px; font-weight:800; color:var(--accent); white-space:nowrap; } }

/* Add to cart btn */
.btn-add { width:100%; padding:10px; background:var(--accent); color:#0a0a0b; border:none; border-radius:9px; font-family:'Montserrat',sans-serif; font-size:12px; font-weight:700; cursor:pointer; transition:opacity 0.2s; &:hover { opacity:0.9; } &--sm { width:auto; padding:7px 14px; font-size:11px; white-space:nowrap; } }

/* Cart panel */
.cart-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}
.cart-panel { background: var(--bg-2, #111114); border-left:1px solid var(--border); width:380px; max-width:100vw; height:100%; display:flex; flex-direction:column; overflow-y:auto; &__header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--border); h3 { font-family:'Montserrat',sans-serif; font-size:16px; font-weight:800; color:var(--text); } } }
.cart-close { background:none; border:none; font-size:22px; color:var(--text-3); cursor:pointer; &:hover { color:var(--text); } }
.cart-period { padding:16px 24px; border-bottom:1px solid var(--border); span { font-size:12px; color:var(--text-2); font-weight:600; display:block; margin-bottom:8px; } }
.cart-items { flex:1; padding:16px 24px; display:flex; flex-direction:column; gap:10px; }
.cart-item { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:12px 14px; display:flex; align-items:center; gap:10px; &__name { flex:1; font-size:13px; color:var(--text-2); } &__price { font-family:'Montserrat',sans-serif; font-size:13px; font-weight:700; color:var(--accent); white-space:nowrap; } &__remove { background:none; border:none; color:var(--text-3); cursor:pointer; font-size:18px; &:hover { color:var(--text); } } }
.cart-footer { padding:16px 24px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:8px; }
.cart-total { font-size:16px; color:var(--text); strong { font-family:'Montserrat',sans-serif; font-size:20px; font-weight:800; color:var(--accent); } }
.cart-saving { font-size:12px; color:#4ade80; }
.btn-checkout { padding:13px; background:var(--accent); color:#0a0a0b; border:none; border-radius:10px; font-family:'Montserrat',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:opacity 0.2s; &:hover { opacity:0.9; } &:disabled { opacity:0.5; cursor:not-allowed; } }
.btn-clear { padding:10px; background:transparent; border:1px solid var(--border-2); color:var(--text-3); border-radius:10px; font-size:13px; cursor:pointer; text-align:center; &:hover { color:var(--text); } }

/* Pay modal */
.pay-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); z-index:1001; display:flex; align-items:center; justify-content:center; padding:20px; }
.pay-modal { background: var(--bg-2, #111114); border:1px solid var(--border); border-radius:18px; padding:32px; max-width:380px; width:100%; text-align:center; h3 { font-family:'Montserrat',sans-serif; font-size:18px; font-weight:800; color:var(--text); margin-bottom:8px; } p { font-size:13px; color:var(--text-2); margin-bottom:20px; } display:flex; flex-direction:column; gap:10px; }

.shop-error { margin-top:16px; padding:12px 16px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:10px; font-size:13px; color:#f87171; }

@media (max-width:900px) { .plans-grid,.channels-compact-grid { grid-template-columns:repeat(2,1fr); } .indicators-compact-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:600px) { .plans-grid,.channels-compact-grid,.indicators-compact-grid { grid-template-columns:1fr; } .cart-panel { width:100vw; } }
</style>
