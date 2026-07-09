<template>
  <div class="home">
    <!-- Welcome + plan status -->
    <div class="welcome-row">
      <div class="welcome-text">
        <h2>{{ t.welcome }}, {{ auth.user?.firstName || auth.user?.email?.split('@')[0] }} 👋</h2>
        <p>{{ t.welcomeSub }}</p>
      </div>
      <div class="plan-badge" v-if="activePlan" :class="`plan-badge--${activePlan.plan?.type?.toLowerCase()}`">
        <span class="plan-name">{{ activePlan.plan?.name }}</span>
        <span class="plan-expires">{{ t.expiresIn }} {{ daysLeft(activePlan.expiresAt) }} {{ t.days }}</span>
      </div>
      <router-link to="/dashboard/shop" class="upgrade-btn" v-else>
        {{ t.getStarted }} →
      </router-link>
    </div>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat-card" v-for="s in stats" :key="s.label">
        <div class="stat-icon" v-html="s.icon"></div>
        <div class="stat-body">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- Products grid -->
    <h3 class="section-title">{{ t.products }}</h3>
    <div class="products-grid">
      <div class="product-tile" v-for="p in products" :key="p.key"
        :class="{ 'product-tile--locked': !p.available }"
        @click="p.available ? $router.push(p.route) : $router.push('/dashboard/shop')">
        <div class="product-tile__icon">{{ p.icon }}</div>
        <div class="product-tile__name">{{ p.name }}</div>
        <div class="product-tile__status" v-if="!p.available">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          {{ t.upgrade }}
        </div>
        <div class="product-tile__status product-tile__status--active" v-else>{{ t.active }}</div>
      </div>
    </div>

    <!-- Quick actions -->
    <h3 class="section-title">{{ t.quickActions }}</h3>
    <div class="actions-row">
      <router-link to="/dashboard/subscriptions" class="action-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        <span>{{ t.mySubscriptions }}</span>
      </router-link>
      <router-link to="/dashboard/support" class="action-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>{{ t.support }}</span>
      </router-link>
      <router-link to="/dashboard/profile" class="action-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>{{ t.profile }}</span>
      </router-link>
      <router-link to="/dashboard/finances" class="action-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span>{{ t.finances }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { subscriptionsApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/dashboardHome'

const auth = useAuthStore()
const activePlan = ref(null)
const subscriptions = ref([])

onMounted(async () => {
  try {
    activePlan.value = await subscriptionsApi.getActivePlan().then(r => r.data)
    subscriptions.value = await subscriptionsApi.getMy().then(r => r.data)
  } catch {}
})

function daysLeft(date) {
  return Math.max(0, Math.ceil((new Date(date) - new Date()) / 86400000))
}

const hasFeature = (key) => subscriptions.value.some(s => s.plan?.[key])

const t = useT(dict)

const stats = computed(() => [
  { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>', value: subscriptions.value.length, label: t.value.activeSubscriptions },
  { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', value: hasFeature('hasSignalsCrypto') ? '∞' : '—', label: 'Crypto Signals' },
  { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', value: hasFeature('hasTablePredictor') ? '✓' : '—', label: 'Table Predictor' },
  { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/></svg>', value: hasFeature('hasCopytrading') ? '✓' : '—', label: t.value.copytrading },
])

const products = computed(() => [
  { key: 'signals', icon: '📡', name: t.value.signals, available: hasFeature('hasSignalsCrypto'), route: '/dashboard/signals' },
  { key: 'predictor', icon: '📊', name: 'Table Predictor', available: hasFeature('hasTablePredictor'), route: '/dashboard/indicators' },
  { key: 'levels', icon: '📈', name: 'Strong Levels', available: hasFeature('hasStrongLevels'), route: '/dashboard/indicators' },
  { key: 'liquidity', icon: '💧', name: 'Liquidity Zones', available: hasFeature('hasLiquidityZones'), route: '/dashboard/indicators' },
  { key: 'pump', icon: '🚀', name: 'Pump & MM', available: hasFeature('hasPumpMM'), route: '/dashboard/indicators' },
  { key: 'copy', icon: '⚡', name: t.value.copytrading, available: hasFeature('hasCopytrading'), route: '/dashboard/copytrading' },
  { key: 'education', icon: '🎓', name: t.value.education, available: hasFeature('hasEducation'), route: '/dashboard/education' },
  { key: 'ai', icon: '🤖', name: 'AI Analytics', available: hasFeature('hasAiAnalytics'), route: '/dashboard/analytics' },
])
</script>

<style lang="scss" scoped>
.home { max-width: 1100px; }

.welcome-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;

  h2 { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  p { font-size: 14px; color: var(--text-2); }
}

.plan-badge {
  display: flex; flex-direction: column; align-items: flex-end;
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid var(--border-2);
  background: var(--surface);

  &--start { border-color: rgba(var(--accent-rgb),0.3); }
  &--pro { border-color: rgba(99,102,241,0.4); background: rgba(99,102,241,0.06); }
  &--elite { border-color: rgba(var(--accent-rgb),0.5); background: rgba(var(--accent-rgb),0.08); }
}

.plan-name { font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 800; color: var(--accent); }
.plan-expires { font-size: 11px; color: var(--text-3); margin-top: 2px; }

.upgrade-btn {
  padding: 12px 24px;
  background: var(--accent);
  color: #0a0a0b;
  border-radius: 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; text-decoration: none; }
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;

  svg { color: var(--accent); }
}

.stat-value { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 800; color: var(--text); }
.stat-label { font-size: 12px; color: var(--text-3); margin-top: 2px; }

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
  color: var(--text-3);
  margin-bottom: 14px;
  margin-top: 28px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.product-tile {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover { border-color: var(--accent); transform: translateY(-2px); }
  &--locked { opacity: 0.5; }
  &--locked:hover { border-color: var(--border-2); transform: none; }

  &__icon { font-size: 28px; margin-bottom: 10px; }
  &__name { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
  &__status {
    font-size: 11px; color: var(--text-3);
    display: flex; align-items: center; justify-content: center; gap: 4px;
    &--active { color: #22c55e; }
  }
}

.actions-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.action-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-2);
  font-size: 13px; font-weight: 500;
  transition: all 0.2s;

  svg { color: var(--accent); }
  &:hover { border-color: var(--accent); color: var(--text); text-decoration: none; transform: translateY(-2px); }
}

@media (max-width: 900px) {
  .stats-row, .products-grid, .actions-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .stats-row, .products-grid, .actions-row { grid-template-columns: 1fr; }
}
</style>
