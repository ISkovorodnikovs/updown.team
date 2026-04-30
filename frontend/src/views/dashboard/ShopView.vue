<template>
  <div class="shop">
    <div class="plans-grid">
      <div class="plan-card" v-for="plan in plans" :key="plan.id" :class="`plan-card--${plan.type?.toLowerCase()}`">
        <div class="plan-card__badge" v-if="plan.type === 'ELITE'">{{ t.popular }}</div>
        <div class="plan-header">
          <div class="plan-type">{{ plan.type }}</div>
          <div class="plan-price">
            <span class="price-amount">{{ plan.price }}</span>
            <span class="price-currency">USDT / {{ t.month }}</span>
          </div>
        </div>
        <p class="plan-desc">{{ plan.description }}</p>
        <ul class="plan-features">
          <li v-for="f in plan.features" :key="f"><span class="check">✦</span>{{ f }}</li>
        </ul>
        <button class="plan-btn" @click="pay(plan)" :disabled="paying === plan.id">
          {{ paying === plan.id ? '...' : t.subscribe }}
        </button>
      </div>
    </div>

    <!-- Payment stub -->
    <div class="payment-notice">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      {{ t.paymentNotice }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { plansApi, subscriptionsApi } from '@/api'

const lang = computed(() => localStorage.getItem('ud-lang') || 'ru')
const plans = ref([])
const paying = ref(null)

onMounted(async () => {
  plans.value = await plansApi.getAll().then(r => r.data).catch(() => [])
})

async function pay(plan) {
  paying.value = plan.id
  try {
    const res = await subscriptionsApi.pay(plan.id)
    alert(res.data.message)
  } catch (e) {
    alert(lang.value === 'ru' ? 'Ошибка. Обратитесь в поддержку.' : 'Error. Contact support.')
  } finally {
    paying.value = null
  }
}

const t = computed(() => ({
  ru: { popular: 'Популярный', month: 'мес', subscribe: 'Оформить подписку', paymentNotice: 'Оплата через Heleket (крипто/карта) — скоро. Для активации обратитесь в поддержку.' },
  en: { popular: 'Popular', month: 'mo', subscribe: 'Subscribe', paymentNotice: 'Payment via Heleket (crypto/card) — coming soon. Contact support to activate.' },
}[lang.value]))
</script>

<style lang="scss" scoped>
.shop { max-width: 1000px; }
.plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 28px; }

.plan-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px;
  position: relative;
  transition: transform 0.2s, border-color 0.2s;

  &--elite { border-color: rgba(var(--accent-rgb), 0.4); box-shadow: 0 0 30px rgba(var(--accent-rgb),0.08); }
  &:hover { transform: translateY(-4px); }

  &__badge {
    position: absolute;
    top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--accent);
    color: #0a0a0b;
    font-size: 11px; font-weight: 800;
    padding: 4px 16px; border-radius: 20px;
    font-family: 'Montserrat', sans-serif;
  }
}

.plan-header { margin-bottom: 8px; }
.plan-type { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
.plan-price { display: flex; align-items: baseline; gap: 6px; margin-bottom: 12px; }
.price-amount { font-family: 'Montserrat', sans-serif; font-size: 40px; font-weight: 800; color: var(--text); }
.price-currency { font-size: 14px; color: var(--text-3); }
.plan-desc { font-size: 13px; color: var(--text-2); margin-bottom: 20px; line-height: 1.6; }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; li { font-size: 13px; color: var(--text-2); display: flex; align-items: flex-start; gap: 8px; } }
.check { color: var(--accent); font-size: 10px; margin-top: 2px; flex-shrink: 0; }
.plan-btn { width: 100%; padding: 13px; background: var(--accent); color: #0a0a0b; border: none; border-radius: 10px; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; &:hover { opacity: 0.9; } &:disabled { opacity: 0.5; cursor: not-allowed; } }

.payment-notice { display: flex; align-items: center; gap: 8px; padding: 14px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; font-size: 13px; color: var(--text-2); svg { color: var(--accent); flex-shrink: 0; } }

@media (max-width: 800px) { .plans-grid { grid-template-columns: 1fr; } }
</style>
