<template>
  <div class="signals-page">
    <h1 class="page-h">{{ t.title }}</h1>

    <!-- Signal of the Day -->
    <div class="signal-day-stub">
      <div class="stub-badge">🔔 {{ t.signalDay }}</div>
      <div class="stub-title">СИГНАЛ ДНЯ</div>
      <div class="stub-sub">{{ t.signalDaySub }}</div>
    </div>

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
            <button class="btn-cart" @click="addToCart(ch)" :class="{ 'btn-cart--added': isInCart(ch.id) }">
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
import { shopApi } from '@/api'
import { useCartStore } from '@/stores/cart'

const lang = computed(() => localStorage.getItem('ud-lang') || 'en')
const channels = ref([])
const cartStore = useCartStore()

onMounted(async () => {
  channels.value = await shopApi.getChannels().then(r => r.data).catch(() => [])
})

function addToCart(ch) {
  cartStore.add({ id: ch.id, name: ch.name, price: ch.price, type: 'channel', shopProductId: ch.id })
}
function isInCart(id) { return !!cartStore.items.find(i => i.id === id) }

const t = computed(() => {
  const r = lang.value === 'ru'
  return {
    title: r ? 'Сигналы' : 'Signals',
    signalDay: r ? 'Сигнал дня' : 'Signal of the Day',
    signalDaySub: r ? 'Функция в разработке. Скоро здесь будет ежедневный торговый сигнал.' : 'Coming soon. Daily trading signal will appear here.',
    channels: r ? 'Сигнальные каналы' : 'Signal Channels',
    mo: r ? 'мес' : 'mo',
    addToCart: r ? 'В корзину' : 'Add to Cart',
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
.signal-day-stub { background: linear-gradient(135deg, var(--bg-2) 0%, rgba(201,243,29,0.05) 100%); border: 2px dashed rgba(201,243,29,0.3); border-radius: 16px; padding: 36px; text-align: center; margin-bottom: 36px; }
.stub-badge { display: inline-block; background: rgba(201,243,29,0.1); border: 1px solid rgba(201,243,29,0.3); color: var(--accent); font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; margin-bottom: 12px; }
.stub-title { font-family: 'Montserrat',sans-serif; font-size: 28px; font-weight: 900; color: var(--text); letter-spacing: 2px; margin-bottom: 8px; }
.stub-sub { font-size: 13px; color: var(--text-2); }

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
.btn-cart { padding: 10px 18px; background: var(--accent); color: #0a0a0b; border: none; border-radius: 9px; font-family: 'Montserrat',sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: opacity 0.2s; &:hover { opacity: 0.9; } &--added { opacity: 0.7; } }

/* Cart toast */
.cart-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--bg-2); border: 1px solid var(--accent); border-radius: 12px; padding: 12px 20px; font-size: 13px; color: var(--text-2); display: flex; align-items: center; gap: 14px; z-index: 100; box-shadow: 0 4px 24px rgba(0,0,0,0.3); &__link { color: var(--accent); font-weight: 700; text-decoration: none; &:hover { text-decoration: underline; } } }

@media (max-width: 700px) { .channels-grid { grid-template-columns: 1fr; } }
</style>
