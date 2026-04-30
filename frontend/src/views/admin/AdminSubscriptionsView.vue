<template>
  <div class="admin-subs">
    <!-- Grant subscription form -->
    <div class="grant-form">
      <h3 class="form-title">{{ t.grantTitle }}</h3>
      <div class="form-row">
        <div class="form-group">
          <label>{{ t.userId }}</label>
          <input class="input" v-model="grant.userId" placeholder="UUID пользователя" />
        </div>
        <div class="form-group">
          <label>{{ t.plan }}</label>
          <select class="input" v-model="grant.planId">
            <option value="" disabled>{{ t.selectPlan }}</option>
            <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }} ({{ p.price }} USDT)</option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ t.days }}</label>
          <input class="input" type="number" v-model="grant.durationDays" min="1" max="3650" />
        </div>
        <div class="form-group">
          <label>{{ t.notes }}</label>
          <input class="input" v-model="grant.notes" :placeholder="t.notesPlaceholder" />
        </div>
      </div>
      <button class="btn-grant" @click="grantSub" :disabled="granting">
        {{ granting ? '...' : t.grant }}
      </button>
      <div class="success-msg" v-if="grantSuccess">✅ {{ t.grantSuccess }}</div>
      <div class="error-msg" v-if="grantError">❌ {{ grantError }}</div>
    </div>

    <!-- All subscriptions table -->
    <h3 class="section-title">{{ t.allSubs }}</h3>
    <div class="filter-row">
      <input class="input input--sm" v-model="filter" :placeholder="t.filterPlaceholder" />
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>{{ t.user }}</th>
            <th>{{ t.plan }}</th>
            <th>{{ t.status }}</th>
            <th>{{ t.started }}</th>
            <th>{{ t.expires }}</th>
            <th>{{ t.grantedBy }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filteredSubs" :key="s.id">
            <td>{{ s.user?.email }}</td>
            <td><span class="plan-tag">{{ s.plan?.name }}</span></td>
            <td><span class="status-badge" :class="`status-badge--${s.status}`">{{ s.status }}</span></td>
            <td>{{ formatDate(s.startsAt) }}</td>
            <td :class="{ 'text-warn': daysLeft(s.expiresAt) < 7 && s.status === 'active' }">{{ formatDate(s.expiresAt) }}</td>
            <td>{{ s.grantedBy ? t.admin : t.payment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { subscriptionsApi, plansApi } from '@/api'

const lang = computed(() => localStorage.getItem('ud-lang') || 'ru')
const plans = ref([])
const allSubs = ref([])
const filter = ref('')
const granting = ref(false)
const grantSuccess = ref(false)
const grantError = ref('')
const grant = ref({ userId: '', planId: '', durationDays: 30, notes: '' })

onMounted(async () => {
  plans.value = await plansApi.getAll().then(r => r.data).catch(() => [])
  allSubs.value = await subscriptionsApi.getAll().then(r => r.data).catch(() => [])
})

const filteredSubs = computed(() => {
  if (!filter.value) return allSubs.value
  const f = filter.value.toLowerCase()
  return allSubs.value.filter(s => s.user?.email?.includes(f) || s.plan?.name?.toLowerCase().includes(f))
})

async function grantSub() {
  grantSuccess.value = false; grantError.value = ''
  if (!grant.value.userId || !grant.value.planId) { grantError.value = t.value.fillAll; return }
  granting.value = true
  try {
    await subscriptionsApi.grant(grant.value)
    grantSuccess.value = true
    allSubs.value = await subscriptionsApi.getAll().then(r => r.data)
    grant.value = { userId: '', planId: '', durationDays: 30, notes: '' }
  } catch (e) { grantError.value = e.response?.data?.message || t.value.error }
  finally { granting.value = false }
}

function formatDate(d) { return new Date(d).toLocaleDateString(lang.value === 'ru' ? 'ru-RU' : 'en-US') }
function daysLeft(d) { return Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000)) }

const t = computed(() => ({
  ru: { grantTitle: 'Выдать подписку', userId: 'ID пользователя', plan: 'Тариф', selectPlan: 'Выберите тариф', days: 'Дней', notes: 'Примечание', notesPlaceholder: 'Тест, промо и т.д.', grant: 'Выдать', grantSuccess: 'Подписка выдана!', fillAll: 'Заполните все поля', error: 'Ошибка', allSubs: 'Все подписки', filterPlaceholder: 'Фильтр по email или тарифу...', user: 'Email', status: 'Статус', started: 'Начало', expires: 'Истекает', grantedBy: 'Источник', admin: 'Админ', payment: 'Оплата' },
  en: { grantTitle: 'Grant subscription', userId: 'User ID', plan: 'Plan', selectPlan: 'Select plan', days: 'Days', notes: 'Notes', notesPlaceholder: 'Test, promo, etc.', grant: 'Grant', grantSuccess: 'Subscription granted!', fillAll: 'Fill all fields', error: 'Error', allSubs: 'All subscriptions', filterPlaceholder: 'Filter by email or plan...', user: 'Email', status: 'Status', started: 'Started', expires: 'Expires', grantedBy: 'Source', admin: 'Admin', payment: 'Payment' },
}[lang.value]))
</script>

<style lang="scss" scoped>
.admin-subs { max-width: 1100px; }
.grant-form { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
.form-title { font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 18px; }
.form-row { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 14px; margin-bottom: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; label { font-size: 12px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; } }
.input { padding: 10px 14px; border: 1px solid var(--border-2); border-radius: 8px; background: var(--bg-3); color: var(--text); font-family: 'Roboto', sans-serif; font-size: 13px; outline: none; &:focus { border-color: var(--accent); } &--sm { max-width: 320px; } }
select.input { cursor: pointer; }
.btn-grant { padding: 11px 28px; background: var(--accent); color: #0a0a0b; border: none; border-radius: 8px; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; &:disabled { opacity: 0.5; } }
.success-msg { margin-top: 12px; font-size: 13px; color: #22c55e; }
.error-msg { margin-top: 12px; font-size: 13px; color: #ef4444; }
.section-title { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-3); margin-bottom: 14px; }
.filter-row { margin-bottom: 14px; }
.table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-3); background: var(--bg-3); border-bottom: 1px solid var(--border); } td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-2); } tr:last-child td { border-bottom: none; } tr:hover td { background: var(--bg-3); } }
.plan-tag { background: rgba(var(--accent-rgb),0.1); color: var(--accent); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 5px; }
.status-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 5px; &--active { background: rgba(34,197,94,0.1); color: #22c55e; } &--expired { background: rgba(239,68,68,0.1); color: #ef4444; } }
.text-warn { color: #f59e0b !important; font-weight: 600; }
@media (max-width: 800px) { .form-row { grid-template-columns: 1fr; } }
</style>
