<template>
  <div class="indicators-page">
    <div class="indicators-page__header">
      <h1>{{ t.title }}</h1>
      <p>{{ t.sub }}</p>
    </div>
    <div class="indicators-grid">
      <div class="ind-card" v-for="ind in indicators" :key="ind.id">
        <div class="ind-card__num">#{{ ind.sortOrder }}</div>
        <h3 class="ind-card__name">{{ ind.name }}</h3>
        <p class="ind-card__desc">{{ ind.description }}</p>
        <ul class="ind-card__features">
          <li v-for="f in ind.features" :key="f"><span>✦</span>{{ f }}</li>
        </ul>
        <div class="ind-card__footer">
          <a v-if="ind.owned && ind.tradingViewUrl" :href="ind.tradingViewUrl" target="_blank" class="btn-tv">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            {{ t.openTv }}
          </a>
          <div class="ind-card__price">{{ ind.price }} USDT / {{ t.month }}</div>
          <button v-if="ind.owned" class="btn-cart btn-cart--owned" disabled>
            ✓ {{ t.owned }}
          </button>
          <button v-else class="btn-cart" @click="addToCart(ind)" :class="{ 'btn-cart--added': isInCart(ind.id) }">
            {{ isInCart(ind.id) ? '✓ ' + t.inCart : '+ ' + t.addToCart }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { shopApi } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/indicators'

const indicators = ref([])
const cartStore = useCartStore()
function addToCart(ind) { cartStore.add({ id: ind.id, name: ind.name, price: ind.price, type: 'indicator', shopProductId: ind.id }) }
function isInCart(id) { return !!cartStore.items.find(i => i.id === id) }

onMounted(async () => {
  indicators.value = await shopApi.getIndicators().then(r => r.data).catch(() => [])
})

const t = useT(dict)
</script>

<style lang="scss" scoped>
.indicators-page { max-width: 1100px; }
.indicators-page__header { margin-bottom: 28px; h1 { font-family: 'Montserrat',sans-serif; font-size: 24px; font-weight: 800; color: var(--text); margin-bottom: 6px; } p { font-size: 14px; color: var(--text-2); } }

.indicators-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-bottom: 32px; }
.ind-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px;
  transition: border-color 0.2s; position: relative;
  &:hover { border-color: var(--border-2); }
  &__num { position: absolute; top: 14px; right: 16px; font-size: 11px; color: var(--text-3); font-family: 'Montserrat',sans-serif; font-weight: 700; }
  &__name { font-family: 'Montserrat',sans-serif; font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 10px; line-height: 1.4; }
  &__desc { font-size: 13px; color: var(--text-2); line-height: 1.7; margin-bottom: 14px; }
  &__features { list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; li { font-size: 12px; color: var(--text-2); display: flex; gap: 8px; align-items: flex-start; span { color: var(--accent); font-size: 10px; margin-top: 2px; flex-shrink: 0; } } }
  &__footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  &__price { font-family: 'Montserrat',sans-serif; font-size: 14px; font-weight: 800; color: var(--accent); }
}

.btn-cart { padding: 7px 14px; background: var(--accent); color: #0a0a0b; border: none; border-radius: 8px; font-family: 'Montserrat',sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; white-space: nowrap; &:hover { opacity: 0.9; } &--added { opacity: 0.65; } &--owned { background: var(--bg-3, #1a1a1c); color: var(--accent); border: 1px solid var(--accent); cursor: default; opacity: 1; } }
.btn-tv { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #4f6ef7; text-decoration: none; font-weight: 600; transition: color 0.2s; &:hover { color: #7b9cff; } }

.signal-day-stub {
  background: linear-gradient(135deg, var(--bg-2) 0%, rgba(201,243,29,0.05) 100%);
  border: 2px dashed rgba(201,243,29,0.3);
  border-radius: 16px; padding: 40px; text-align: center;
  &__badge { display: inline-block; background: rgba(201,243,29,0.1); border: 1px solid rgba(201,243,29,0.3); color: var(--accent); font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 20px; margin-bottom: 14px; }
  &__title { font-family: 'Montserrat',sans-serif; font-size: 32px; font-weight: 900; color: var(--text); letter-spacing: 2px; margin-bottom: 10px; }
  &__sub { font-size: 14px; color: var(--text-2); }
}

@media (max-width: 900px) { .indicators-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .indicators-grid { grid-template-columns: 1fr; } }
</style>
