<template>
  <div class="signals-page">
    <h1 class="page-h">{{ t.title }}</h1>

    <!-- Signal of the Day -->
    <section class="sigday">
      <h2 class="section-h">🔔 {{ t.signalDay }}</h2>
      <div class="sigday-grid">
        <div v-for="row in dailySignals" :key="row.topicId" class="sigday-card"
             :class="{ 'sigday-card--empty': !row.signal }">
          <div class="sigday-card__head">
            <span class="sigday-card__topic">{{ row.label || row.topicId }}</span>
            <span class="sigday-card__status"
                  :class="row.signal && row.signal.status === 'active' ? 'is-active' : 'is-closed'">
              {{ statusLabel(row.signal) }}
            </span>
          </div>

          <template v-if="row.signal">
            <div class="sigday-card__sym">
              {{ dirIcon(row.signal.direction) }} {{ row.signal.symbol || '—' }}
              <span class="sigday-card__dir">{{ row.signal.direction }}</span>
            </div>
            <div class="sigday-row"><span>{{ t.given }}</span><b>{{ fmtUtc(row.signal.signalAt) }}</b></div>
            <div class="sigday-row"><span>{{ t.zone }}</span><b>{{ row.signal.entryZone || '—' }}</b></div>
            <div class="sigday-row sigday-row--col" v-if="row.signal.targets && row.signal.targets.length">
              <span>{{ t.targets }}</span>
              <div class="sigday-tps">
                <span v-for="(tp, i) in row.signal.targets" :key="i" class="sigday-tp">{{ i+1 }}) {{ tp }}</span>
              </div>
            </div>
            <div class="sigday-row"><span>{{ t.stop }}</span><b>{{ row.signal.stopLoss || '—' }}</b></div>
            <div class="sigday-row"><span>{{ t.position }}</span><b class="sigday-pos">{{ positionLabel(row.signal) }}</b></div>
            <div class="sigday-row" v-if="row.signal.profitPercent"><span>{{ t.profit }}</span><b class="sigday-profit">{{ row.signal.profitPercent }}</b></div>
            <div class="sigday-card__upd">{{ t.updated }}: {{ fmtUtc(row.signal.updatedAt) }}</div>
          </template>

          <div v-else class="sigday-card__empty">
            <div class="sigday-card__sym">{{ row.label || row.topicId }}</div>
            <p>{{ t.awaiting }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Channels -->
    <section class="channels-section">
      <h2 class="section-h">📡 {{ t.channels }}</h2>
      <div class="channels-grid">
        <div class="channel-card" v-for="ch in channels" :key="ch.id">
          <div class="channel-card__badge" v-if="ch.badge">{{ ch.badge }}</div>
          <div class="channel-card__icon">📡</div>
          <div class="channel-card__body">
            <h3>{{ ch.name }}</h3>
            <p>{{ ch.description }}</p>
            <ul class="ch-features">
              <li v-for="f in ch.features" :key="f"><span>✦</span>{{ f }}</li>
            </ul>
          </div>
          <div class="channel-card__footer">
            <div class="ch-price">
              <span class="ch-price__val">{{ ch.price }}</span>
              <span class="ch-price__unit">USDT / {{ t.mo }}</span>
            </div>
            <button v-if="ch.owned" class="btn-cart btn-cart--owned" disabled>
              ✓ {{ t.owned }}
            </button>
            <button v-else class="btn-cart" @click="addToCart(ch)" :class="{ 'btn-cart--added': isInCart(ch.id) }">
              {{ isInCart(ch.id) ? '✓ ' + t.inCart : '+ ' + t.addToCart }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Cart toast -->
    <div class="cart-toast" v-if="cartStore.count > 0">
      🛒 {{ t.cart }}: {{ cartStore.count }} {{ t.items }}
      <router-link to="/dashboard/shop" class="cart-toast__link">{{ t.goToCheckout }} →</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { shopApi, signalsApi } from '@/api'
import { useCartStore } from '@/stores/cart'

const lang = computed(() => localStorage.getItem('ud-lang') || 'en')
const channels = ref([])
const dailySignals = ref([])
const cartStore = useCartStore()

onMounted(async () => {
  channels.value = await shopApi.getChannels().then(r => r.data).catch(() => [])
  dailySignals.value = await signalsApi.getDaily().then(r => r.data).catch(() => [])
})

const fmtUtc = (d) => d ? new Date(d).toISOString().slice(0, 16).replace('T', ' ') + ' UTC' : '—'

function statusLabel(sig) {
  const r = lang.value === 'ru'
  if (!sig) return r ? 'Ожидание сигнала' : 'Awaiting signal'
  return sig.status === 'closed' ? (r ? 'Закрыт' : 'Closed') : (r ? 'Активен' : 'Active')
}
function positionLabel(sig) {
  const r = lang.value === 'ru'
  const map = {
    given: r ? 'Сигнал дан' : 'Signal given',
    in_zone: r ? 'В зоне набора' : 'In entry zone',
    tp1: 'TP1', tp2: 'TP2', tp3: 'TP3', tp4: 'TP4', tp5: 'TP5', sl: 'Stop Loss',
    all_targets: r ? 'Все цели достигнуты' : 'All targets hit',
    closed_opposite: r ? 'Закрыт по противоположному' : 'Closed by opposite',
  }
  return map[sig?.position] || (r ? '—' : '—')
}
function dirIcon(dir) { return dir === 'long' ? '🟢' : dir === 'short' ? '🔴' : '⚪' }

function addToCart(ch) {
  cartStore.add({ id: ch.id, name: ch.name, price: ch.price, type: 'channel', shopProductId: ch.id })
}
function isInCart(id) { return !!cartStore.items.find(i => i.id === id) }

const t = computed(() => {
  const r = lang.value === 'ru'
  return {
    title: r ? 'Сигналы' : 'Signals',
    signalDay: r ? 'Сигнал дня' : 'Signal of the Day',
    given: r ? 'Дан' : 'Given',
    zone: r ? 'Зона набора' : 'Entry zone',
    targets: r ? 'Тейки' : 'Targets',
    stop: 'Stop',
    position: r ? 'Положение' : 'Position',
    profit: r ? 'Профит' : 'Profit',
    updated: r ? 'Обновлён' : 'Updated',
    awaiting: r ? 'Сигнал ещё не поступил в этом окне (с 5:00 UTC).' : 'No signal yet in this window (since 5:00 UTC).',
    channels: r ? 'Сигнальные каналы' : 'Signal Channels',
    mo: r ? 'мес' : 'mo',
    addToCart: r ? 'В корзину' : 'Add to Cart',
    owned: r ? 'Куплено' : 'Owned',
    inCart: r ? 'В корзине' : 'In Cart',
    cart: r ? 'Корзина' : 'Cart',
    items: r ? 'тов.' : 'items',
    goToCheckout: r ? 'Перейти к оплате' : 'Go to Checkout',
  }
})
</script>

<style lang="scss" scoped>
.signals-page { max-width: 1000px; }
.page-h { font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 24px; }

/* Signal Day Stub */
.sigday { margin-bottom: 36px; }
.sigday-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.sigday-card { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 16px; padding: 20px;
  &--empty { border-style: dashed; opacity: .8; }
  &__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  &__topic { font-family: 'Montserrat',sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 1px; color: var(--accent); }
  &__status { font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 20px;
    &.is-active { color: #1E8449; border: 1px solid #1E8449; }
    &.is-closed { color: var(--text-2); border: 1px solid var(--border, #444); } }
  &__sym { font-size: 18px; font-weight: 800; margin-bottom: 10px; }
  &__dir { font-size: 12px; color: var(--text-2); text-transform: uppercase; margin-left: 6px; }
  &__upd { font-size: 11px; color: var(--text-2); margin-top: 12px; }
  &__empty { text-align: center; padding: 16px 0; p { color: var(--text-2); font-size: 13px; margin: 8px 0 0; } } }
.sigday-row { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; color: var(--text-2); padding: 4px 0;
  b { color: var(--text); text-align: right; }
  &--col { flex-direction: column; b { text-align: left; } } }
.sigday-tps { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.sigday-tp { background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 6px; padding: 3px 8px; font-size: 12px; color: var(--text); }
.sigday-pos { color: var(--accent) !important; }
.sigday-profit { color: #1E8449 !important; }
@media (max-width: 700px) { .sigday-grid { grid-template-columns: 1fr; } }

/* Channels */
.section-h { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 18px; }
.channels-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 18px; }

.channel-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px;
  display: flex; flex-direction: column; gap: 14px; position: relative; transition: border-color 0.2s;
  &:hover { border-color: var(--border-2); }
  &__badge { position: absolute; top: 12px; right: 14px; background: var(--accent); color: #0a0a0b; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; font-family: 'Montserrat',sans-serif; }
  &__icon { font-size: 28px; }
  &__body { flex: 1; h3 { font-family: 'Montserrat',sans-serif; font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 8px; } p { font-size: 13px; color: var(--text-2); line-height: 1.7; margin-bottom: 12px; } }
  &__footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
}
.ch-features { list-style: none; display: flex; flex-direction: column; gap: 5px; li { font-size: 12px; color: var(--text-2); display: flex; gap: 7px; align-items: center; span { color: var(--accent); font-size: 9px; } } }
.ch-price { &__val { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; color: var(--accent); } &__unit { font-size: 12px; color: var(--text-3); margin-left: 3px; } }
.btn-cart { padding: 10px 18px; background: var(--accent); color: #0a0a0b; border: none; border-radius: 9px; font-family: 'Montserrat',sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: opacity 0.2s; &:hover { opacity: 0.9; } &--added { opacity: 0.7; } &--owned { background: var(--bg-3, #1a1a1c); color: var(--accent); border: 1px solid var(--accent); cursor: default; opacity: 1; } }

/* Cart toast */
.cart-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-2); border: 1px solid var(--accent); border-radius: 12px; padding: 12px 20px; font-size: 13px; color: var(--text-2); display: flex; align-items: center; gap: 14px; z-index: 100; box-shadow: 0 4px 24px rgba(0,0,0,0.3); &__link { color: var(--accent); font-weight: 700; text-decoration: none; &:hover { text-decoration: underline; } } }

@media (max-width: 700px) { .channels-grid { grid-template-columns: 1fr; } }
</style>
