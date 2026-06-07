<script setup>
import { ref, computed, onMounted } from 'vue'
import { partnersApi } from '@/api'

const lang = computed(() => localStorage.getItem('ud-lang') || 'en')
const channels = ref([])
const loading = ref(true)

onMounted(async () => {
  channels.value = await partnersApi.myChannels().then(r => r.data).catch(() => [])
  loading.value = false
})

const isActive = (c) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date())
const fmtDate = (d) => d ? new Date(d).toISOString().slice(0, 10) : '—'

const t = computed(() => {
  const r = lang.value === 'ru'
  return {
    title: r ? 'Мои каналы' : 'My Channels',
    sub: r ? 'Каналы с поставкой сигналов под вашим брендом' : 'Channels with white-label signal delivery',
    empty: r ? 'У вас пока нет подключённых каналов. Для подключения обратитесь к администратору.' : 'No channels yet. Contact admin to set up.',
    loading: r ? 'Загрузка…' : 'Loading…',
    active: r ? 'Активен' : 'Active',
    inactive: r ? 'Ожидает настройки' : 'Pending setup',
    until: r ? 'до' : 'until',
    price: r ? 'Стоимость' : 'Price',
    note: r ? 'Статистика по каналу появится в кабинете после настройки администратором.' : 'Channel statistics will appear after admin setup.',
  }
})
</script>

<template>
  <div class="pch">
    <div class="pch-head">
      <h1>{{ t.title }}</h1>
      <p>{{ t.sub }}</p>
    </div>

    <div v-if="loading" class="pch-empty">{{ t.loading }}</div>
    <div v-else-if="!channels.length" class="pch-empty">{{ t.empty }}</div>

    <div v-else class="pch-grid">
      <div v-for="c in channels" :key="c.id" class="pch-card" :class="{ 'pch-card--off': !isActive(c) }">
        <div class="pch-card__top">
          <h3>{{ c.name }}</h3>
          <span class="pch-badge" :class="isActive(c) ? 'pch-badge--on' : 'pch-badge--off'">
            {{ isActive(c) ? t.active : t.inactive }}
          </span>
        </div>
        <div class="pch-meta">
          <span>{{ c.asset }}</span>·<span>{{ c.timeframe }}</span>·<span>{{ c.direction }}</span>
        </div>
        <div class="pch-row"><span>{{ t.price }}</span><b>{{ c.price }} USDT</b></div>
        <div class="pch-row"><span>{{ t.until }}</span><b>{{ fmtDate(c.expiresAt) }}</b></div>
        <p class="pch-note">{{ t.note }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pch { padding: 4px; }
.pch-head { margin-bottom: 20px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 800; margin: 0; }
  p { color: var(--text-2); font-size: 13px; margin: 4px 0 0; } }
.pch-empty { color: var(--text-2); text-align: center; padding: 48px; font-size: 14px; }
.pch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 16px; }
.pch-card { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; padding: 18px;
  &--off { opacity: .6; }
  &__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;
    h3 { font-family: 'Montserrat',sans-serif; font-size: 16px; font-weight: 800; margin: 0; } } }
.pch-badge { font-size: 9px; font-weight: 800; border-radius: 5px; padding: 3px 7px; white-space: nowrap;
  &--on { color: #1E8449; border: 1px solid #1E8449; }
  &--off { color: #B9770E; border: 1px solid #B9770E; } }
.pch-meta { color: var(--accent); font-size: 12px; font-weight: 600; margin: 8px 0; display: flex; gap: 6px; }
.pch-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-2); padding: 3px 0;
  b { color: var(--text-1); } }
.pch-note { color: var(--text-2); font-size: 11px; margin: 10px 0 0; }
</style>
