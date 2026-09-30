<template>
  <div class="home">
    <!-- Welcome + plan status -->
    <div class="welcome-row">
      <div class="welcome-text">
        <h2>{{ t.welcome }}, {{ auth.user?.firstName || auth.user?.email?.split('@')[0] }} 👋</h2>
        <p>{{ t.welcomeSub }}</p>
      </div>
      <div class="plan-badge" v-if="activePlan" :class="`plan-badge--${activePlan.plan?.type?.toLowerCase()}`">
        <span class="plan-name">{{ tDb(activePlan.plan, 'name') }}</span>
        <span class="plan-expires">{{ t.expiresIn }} {{ daysLeft(activePlan.expiresAt) }} {{ t.days }}</span>
      </div>
      <router-link to="/dashboard/shop" class="upgrade-btn" v-else>
        {{ t.getStarted }} →
      </router-link>
    </div>

    <!-- Первые шаги (обучение) -->
    <FirstSteps />

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

    <!-- Products grid: 4 categories -->
    <h3 class="section-title">{{ t.products }}</h3>
    <div class="cat-grid">
      <div class="cat-tile" v-for="c in categories" :key="c.key"
        :class="{ 'cat-tile--active': c.active, 'cat-tile--has-pop': c.items && c.items.length }"
        @click="$router.push(tileRoute(c))">
        <div class="cat-tile__icon">{{ c.icon }}</div>
        <div class="cat-tile__name">{{ c.name }}</div>
        <div class="cat-tile__status" :class="c.active ? 'is-active' : 'is-locked'">
          <template v-if="c.active">{{ t.active }}</template>
          <template v-else>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {{ o.menu.view }}
          </template>
        </div>
        <!-- Всплывающий список каналов/индикаторов (активные и неактивные) -->
        <div v-if="c.items && c.items.length" class="cat-pop" @click.stop>
          <div class="cat-pop__item" v-for="it in c.items" :key="it.id"
            @click="$router.push(it.active ? '/dashboard/access' : (c.kind === 'signals' ? '/dashboard/signals' : '/dashboard/indicators'))">
            <span class="cat-pop__dot" :class="it.active ? 'on' : 'off'"></span>
            <span class="cat-pop__name">{{ it.name }}</span>
            <span class="cat-pop__tag" v-if="it.active">{{ t.active }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <h3 class="section-title">{{ t.quickActions }}</h3>
    <div class="actions-row">
      <router-link to="/dashboard/access" class="action-card">
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
import { subscriptionsApi, shopApi } from '@/api'
import { useT, tDb } from '@/i18n'
import dict from '@/i18n/dicts/dashboardHome'
import obDict from '@/i18n/dicts/onboarding'
import FirstSteps from '@/components/onboarding/FirstSteps.vue'
import { useOnboardingStore } from '@/stores/onboarding'

const auth = useAuthStore()
const activePlan = ref(null)
const subscriptions = ref([])
const channels = ref([])
const indicators = ref([])
const ownedIds = ref(new Set())
const accessProducts = ref([])

onMounted(async () => {
  try {
    activePlan.value = await subscriptionsApi.getActivePlan().then(r => r.data)
    subscriptions.value = await subscriptionsApi.getMy().then(r => r.data)
  } catch {}
  try {
    const [chans, inds, access] = await Promise.all([
      shopApi.getChannels().then(r => r.data).catch(() => []),
      shopApi.getIndicators().then(r => r.data).catch(() => []),
      shopApi.getMyAccess().then(r => r.data).catch(() => ({ products: [] })),
    ])
    channels.value = chans
    indicators.value = inds
    accessProducts.value = access.products || []
    ownedIds.value = new Set(accessProducts.value.map(p => p.productId))
  } catch {}
})

function daysLeft(date) {
  return Math.max(0, Math.ceil((new Date(date) - new Date()) / 86400000))
}

const hasFeature = (key) => subscriptions.value.some(s => s.plan?.[key])

const t = useT(dict)
const o = useT(obDict)
const ob = useOnboardingStore()

const ownedChannels = computed(() => accessProducts.value.filter(p => p.type === 'signal_channel').length)
const ownedIndicators = computed(() => accessProducts.value.filter(p => p.type === 'indicator').length)

const stats = computed(() => [
  { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>', value: ownedIds.value.size, label: o.value.menu.statAccess },
  { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>', value: ownedIndicators.value, label: o.value.menu.statIndicators },
  { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', value: ownedChannels.value, label: o.value.menu.statChannels },
])

// Товары каталога с пометкой активности (владеет ли пользователь)
const channelItems = computed(() => channels.value.map(c => ({ id: c.id, name: tDb(c, 'name'), active: ownedIds.value.has(c.id) })))
const indicatorItems = computed(() => indicators.value.map(i => ({ id: i.id, name: tDb(i, 'name'), active: ownedIds.value.has(i.id) })))

// Категории; порядок — по цели, выбранной на экране приветствия
const categories = computed(() => {
  const list = [
    { key: 'indicators', icon: '📊', name: t.value.indicators,  kind: 'indicators', items: indicatorItems.value,  active: indicatorItems.value.some(i => i.active) },
    { key: 'signals',    icon: '📡', name: t.value.signals,     kind: 'signals',    items: channelItems.value,   active: channelItems.value.some(i => i.active) },
    { key: 'education',  icon: '🎓', name: t.value.education,    kind: 'education',  items: null,                  active: hasFeature('hasEducation') },
  ]
  const first = { signals: 'signals', learn: 'education' }[ob.state?.goal]
  return first ? [...list.filter(c => c.key === first), ...list.filter(c => c.key !== first)] : list
})

function tileRoute(cat) {
  if (cat.kind === 'education') return cat.active ? '/dashboard/access' : '/dashboard/education'
  // Не куплено — открываем витрину раздела (описания и цены), а не тупик
  if (cat.active) return '/dashboard/access'
  return cat.kind === 'signals' ? '/dashboard/signals' : '/dashboard/indicators'
}
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
  grid-template-columns: repeat(3, 1fr);
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

.cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}
.cat-tile {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border-2);
  border-radius: 14px;
  padding: 20px 16px;
  cursor: pointer;
  transition: border-color .15s, transform .15s;
  text-align: center;
  &:hover { border-color: rgba(var(--accent-rgb),0.5); transform: translateY(-2px); }
  &--active { border-color: rgba(30,158,90,0.35); }
  &__icon { font-size: 28px; margin-bottom: 8px; }
  &__name { font-family: 'Montserrat',sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 8px; }
  &__status { font-size: 12px; display: inline-flex; align-items: center; gap: 5px;
    &.is-active { color: #1E9E5A; font-weight: 600; }
    &.is-locked { color: var(--text-3); } }
}
/* Всплывающий список */
.cat-pop {
  position: absolute; top: calc(100% - 4px); left: 50%; transform: translateX(-50%) translateY(6px);
  width: max-content; min-width: 220px; max-width: 300px; max-height: 280px; overflow-y: auto;
  background: var(--bg-1, #16161a); border: 1px solid var(--border-2); border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,.4); padding: 6px; z-index: 40;
  opacity: 0; visibility: hidden; pointer-events: none; transition: opacity .15s, transform .15s;
}
.cat-tile--has-pop:hover .cat-pop { opacity: 1; visibility: visible; pointer-events: auto; transform: translateX(-50%) translateY(0); }
.cat-pop__item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; cursor: pointer; text-align: left;
  &:hover { background: var(--surface); } }
.cat-pop__dot { width: 7px; height: 7px; border-radius: 50%; flex: 0 0 auto;
  &.on { background: #1E9E5A; box-shadow: 0 0 0 3px rgba(30,158,90,.15); }
  &.off { background: var(--text-3); opacity: .5; } }
.cat-pop__name { font-size: 13px; flex: 1; }
.cat-pop__tag { font-size: 10px; color: #1E9E5A; font-weight: 600; }

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
  .stats-row, .products-grid, .cat-grid, .actions-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .stats-row, .products-grid, .cat-grid, .actions-row { grid-template-columns: 1fr; }
}
</style>
