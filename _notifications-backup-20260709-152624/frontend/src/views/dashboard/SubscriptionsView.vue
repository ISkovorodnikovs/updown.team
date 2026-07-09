<template>
  <div class="subs-page">
    <div class="subs-grid" v-if="activeSubs.length">
      <div class="sub-card" v-for="sub in activeSubs" :key="sub.id" :class="`sub-card--${sub.plan?.type?.toLowerCase()}`">
        <div class="sub-card__header">
          <div class="sub-plan">{{ tDb(sub.plan, 'name') }}</div>
          <div class="sub-badge">{{ t.active }}</div>
        </div>
        <div class="sub-features">
          <div class="sub-feature" v-for="f in tDb(sub.plan, 'features')" :key="f">
            <span class="check">✦</span> {{ f }}
          </div>
        </div>
        <div class="sub-footer">
          <div class="sub-date">{{ t.expires }}: {{ formatDate(sub.expiresAt) }}</div>
          <div class="sub-timer" :class="{ 'sub-timer--warn': daysLeft(sub.expiresAt) < 7 }">
            {{ daysLeft(sub.expiresAt) }} {{ t.days }}
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">📭</div>
      <h3>{{ t.noSubs }}</h3>
      <p>{{ t.noSubsDesc }}</p>
      <router-link to="/dashboard/shop" class="btn-primary">{{ t.goShop }}</router-link>
    </div>

    <h3 class="section-title" v-if="history.length">{{ t.history }}</h3>
    <div class="history-table" v-if="history.length">
      <div class="history-row history-row--header">
        <span>{{ t.plan }}</span><span>{{ t.status }}</span><span>{{ t.started }}</span><span>{{ t.expires }}</span>
      </div>
      <div class="history-row" v-for="s in history" :key="s.id">
        <span class="plan-name">{{ s.plan?.name }}</span>
        <span class="status-badge" :class="`status-badge--${s.status}`">{{ s.status }}</span>
        <span>{{ formatDate(s.startsAt) }}</span>
        <span>{{ formatDate(s.expiresAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { subscriptionsApi } from '@/api'
import { useT, fmtDate, tDb } from '@/i18n'
import dict from '@/i18n/dicts/subscriptions'

const activeSubs = ref([])
const history = ref([])

onMounted(async () => {
  activeSubs.value = await subscriptionsApi.getMy().then(r => r.data).catch(() => [])
  history.value = await subscriptionsApi.getMyHistory().then(r => r.data).catch(() => [])
})

function formatDate(d) { return fmtDate(d) }
function daysLeft(d) { return Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000)) }

const t = useT(dict)
</script>

<style lang="scss" scoped>
.subs-page { max-width: 900px; }
.subs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 32px; }

.sub-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  transition: border-color 0.2s;

  &--start { border-top: 3px solid var(--accent); }
  &--pro { border-top: 3px solid #6366f1; }
  &--elite { border-top: 3px solid var(--accent); box-shadow: 0 0 20px rgba(var(--accent-rgb),0.1); }

  &__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
}

.sub-plan { font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 800; color: var(--accent); }
.sub-badge { background: rgba(34,197,94,0.1); color: #22c55e; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; }
.sub-features { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.sub-feature { font-size: 13px; color: var(--text-2); display: flex; align-items: center; gap: 8px; }
.check { color: var(--accent); font-size: 10px; }
.sub-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border); }
.sub-date { font-size: 12px; color: var(--text-3); }
.sub-timer { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: var(--accent); &--warn { color: #f59e0b; } }

.empty-state { text-align: center; padding: 60px 20px; h3 { font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 8px; color: var(--text); } p { color: var(--text-2); margin-bottom: 24px; } }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.btn-primary { display: inline-block; padding: 12px 28px; background: var(--accent); color: #0a0a0b; border-radius: 10px; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; &:hover { opacity: 0.9; text-decoration: none; } }

.section-title { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-3); margin-bottom: 14px; }
.history-table { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.history-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; padding: 12px 20px; font-size: 13px; border-bottom: 1px solid var(--border); &:last-child { border-bottom: none; } &--header { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-3); background: var(--bg-3); } }
.plan-name { font-weight: 600; color: var(--accent); }
.status-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; &--active { background: rgba(34,197,94,0.1); color: #22c55e; } &--expired { background: rgba(239,68,68,0.1); color: #ef4444; } &--cancelled { background: rgba(var(--text-3),0.1); color: var(--text-3); } }
</style>
