<template>
  <div class="admin-ref">
    <h1 class="page-h">{{ t.title }}</h1>

    <!-- User search table -->
    <div class="card">
      <h3 class="card-title">🔍 {{ t.searchTitle }}</h3>
      <div class="search-row">
        <input class="inp" v-model="userSearch" :placeholder="t.searchPh" @input="searchUsers" />
      </div>
      <div class="users-mini-table" v-if="userList.length">
        <table class="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>UUID</th>
              <th>Реф. код</th>
              <th>Реферер UUID</th>
              <th>Баланс</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in userList" :key="u.id">
              <td>{{ u.email }}</td>
              <td class="mono-cell">
                {{ u.id.substring(0,10) }}…
                <button class="btn-cp" @click="copy(u.id)" title="Копировать UUID">📋</button>
              </td>
              <td class="mono-cell">
                <span v-if="u.referralCode">{{ u.referralCode }}</span>
                <span v-else class="dim">—</span>
                <button v-if="u.referralCode" class="btn-cp" @click="copy(u.referralCode)">📋</button>
              </td>
              <td class="mono-cell">
                <span v-if="u.referredBy">{{ u.referredBy.substring(0,10) }}…</span>
                <span v-else class="dim">—</span>
                <button v-if="u.referredBy" class="btn-cp" @click="copy(u.referredBy)">📋</button>
              </td>
              <td :class="{ 'acc': Number(u.referralBalance) > 0 }">{{ Number(u.referralBalance||0).toFixed(2) }} $</td>
              <td>
                <div class="row-actions">
                  <button class="btn btn--sm btn--accent" @click="prefillCredit(u)">💰 Начислить</button>
                  <button class="btn btn--sm btn--outline" @click="prefillReassign(u)">🔄 Реферер</button>
                  <button class="btn btn--sm btn--outline" @click="loadUserEarnings(u)">📋 История</button>
                  <button class="btn btn--sm btn--danger" @click="prefillZero(u)">🔴 Обнулить</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="searched" class="empty">{{ t.noUsers }}</div>
    </div>

    <!-- Manual credit -->
    <div class="card" id="credit-card">
      <h3 class="card-title">💰 {{ t.creditTitle }}</h3>
      <div class="form-row">
        <div class="form-group">
          <label>{{ t.userId }}</label>
          <input class="inp" v-model="credit.targetUserId" placeholder="User UUID" />
        </div>
        <div class="form-group">
          <label>{{ t.amount }}</label>
          <input class="inp" type="number" v-model.number="credit.amount" min="0.01" step="0.01" />
        </div>
        <div class="form-group">
          <label>{{ t.percent }}</label>
          <input class="inp" type="number" v-model.number="credit.percent" min="0" max="100" />
        </div>
        <div class="form-group">
          <label>{{ t.note }}</label>
          <input class="inp" v-model="credit.note" :placeholder="t.notePh" />
        </div>
      </div>
      <button class="btn btn--accent" @click="doCredit" :disabled="creditLoading">{{ creditLoading ? '...' : t.creditBtn }}</button>
      <div class="ok-msg" v-if="creditOk">✅ {{ t.creditOk }}</div>
      <div class="err-msg" v-if="creditErr">❌ {{ creditErr }}</div>
    </div>

    <!-- Reassign -->
    <div class="card" id="reassign-card">
      <h3 class="card-title">🔄 {{ t.reassignTitle }}</h3>
      <div class="form-row">
        <div class="form-group">
          <label>{{ t.userId }}</label>
          <input class="inp" v-model="reassign.userId" placeholder="User UUID" />
        </div>
        <div class="form-group">
          <label>{{ t.newReferrer }}</label>
          <input class="inp" v-model="reassign.newReferrerId" placeholder="Referrer UUID (пусто = сброс)" />
        </div>
      </div>
      <button class="btn btn--accent" @click="doReassign" :disabled="reassignLoading">{{ reassignLoading ? '...' : t.reassignBtn }}</button>
      <div class="ok-msg" v-if="reassignOk">✅ {{ t.reassignOk }}</div>
      <div class="err-msg" v-if="reassignErr">❌ {{ reassignErr }}</div>
    </div>

    <!-- Zero balance -->
    <div class="card" id="zero-card">
      <h3 class="card-title">🔴 {{ t.zeroTitle }}</h3>
      <p class="card-sub">{{ t.zeroSub }}</p>
      <div class="form-row">
        <div class="form-group">
          <label>{{ t.userId }}</label>
          <input class="inp" v-model="zeroUserId" placeholder="User UUID" />
        </div>
      </div>
      <button class="btn btn--danger" @click="doZero" :disabled="zeroLoading">{{ zeroLoading ? '...' : t.zeroBtn }}</button>
      <div class="ok-msg" v-if="zeroOk">✅ {{ t.zeroOk }}</div>
      <div class="err-msg" v-if="zeroErr">❌ {{ zeroErr }}</div>
    </div>

    <!-- Earnings history -->
    <div class="card" id="earnings-card">
      <h3 class="card-title">📋 {{ t.earningsTitle }}</h3>
      <div class="form-row" style="align-items:flex-end">
        <div class="form-group">
          <label>{{ t.userId }}</label>
          <input class="inp" v-model="earningsUserId" placeholder="User UUID" />
        </div>
        <button class="btn btn--accent" @click="loadEarnings" :disabled="earningsLoading">{{ earningsLoading ? '...' : t.load }}</button>
      </div>
      <div v-if="earnings.length" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>{{ t.date }}</th><th>{{ t.amount }}</th><th>{{ t.percent }}</th>
              <th>{{ t.type }}</th><th>{{ t.zeroed }}</th><th>{{ t.note }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in earnings" :key="e.id" :class="{ 'zeroed': e.isZeroed }">
              <td>{{ new Date(e.createdAt).toLocaleDateString() }}</td>
              <td class="acc">+{{ Number(e.amount).toFixed(2) }} USDT</td>
              <td>{{ e.percent }}%</td>
              <td>{{ e.isManual ? t.manual : t.auto }}</td>
              <td>{{ e.isZeroed ? '🗑 '+t.yes : '—' }}</td>
              <td>{{ e.note || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="earningsLoaded" class="empty">{{ t.noEarnings }}</div>
    </div>

    <div v-if="copyMsg" class="copy-toast">{{ copyMsg }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { referralApi } from '@/api'

const lang = computed(() => localStorage.getItem('ud-lang') || 'en')
const userSearch = ref(''); const userList = ref([]); const searched = ref(false)
const copyMsg = ref('')
let searchTimer = null

function searchUsers() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    if (!userSearch.value.trim()) { userList.value = []; searched.value = false; return }
    const data = await referralApi.getUsers(userSearch.value).then(r => r.data).catch(() => [])
    userList.value = data; searched.value = true
  }, 400)
}

function prefillCredit(u) {
  credit.value.targetUserId = u.id
  document.getElementById('credit-card')?.scrollIntoView({ behavior: 'smooth' })
}
function prefillReassign(u) {
  reassign.value.userId = u.id
  document.getElementById('reassign-card')?.scrollIntoView({ behavior: 'smooth' })
}
function prefillZero(u) {
  zeroUserId.value = u.id
  document.getElementById('zero-card')?.scrollIntoView({ behavior: 'smooth' })
}
function loadUserEarnings(u) {
  earningsUserId.value = u.id
  loadEarnings()
  document.getElementById('earnings-card')?.scrollIntoView({ behavior: 'smooth' })
}

function copy(text) {
  navigator.clipboard.writeText(text)
  copyMsg.value = 'Скопировано!'
  setTimeout(() => copyMsg.value = '', 2000)
}

// Credit
const credit = ref({ targetUserId: '', amount: 0, percent: 0, note: '' })
const creditLoading = ref(false); const creditOk = ref(false); const creditErr = ref('')
async function doCredit() {
  creditLoading.value = true; creditOk.value = false; creditErr.value = ''
  try { await referralApi.manualCredit(credit.value); creditOk.value = true; credit.value = { targetUserId: '', amount: 0, percent: 0, note: '' } }
  catch (e) { creditErr.value = e.response?.data?.message || 'Error' }
  finally { creditLoading.value = false }
}

// Reassign
const reassign = ref({ userId: '', newReferrerId: '' })
const reassignLoading = ref(false); const reassignOk = ref(false); const reassignErr = ref('')
async function doReassign() {
  reassignLoading.value = true; reassignOk.value = false; reassignErr.value = ''
  try { await referralApi.reassign({ userId: reassign.value.userId, newReferrerId: reassign.value.newReferrerId || null }); reassignOk.value = true }
  catch (e) { reassignErr.value = e.response?.data?.message || 'Error' }
  finally { reassignLoading.value = false }
}

// Zero
const zeroUserId = ref(''); const zeroLoading = ref(false); const zeroOk = ref(false); const zeroErr = ref('')
async function doZero() {
  if (!confirm(lang.value === 'ru' ? 'Обнулить баланс? Данные аудита сохранятся.' : 'Zero balance? Audit data is preserved.')) return
  zeroLoading.value = true; zeroOk.value = false; zeroErr.value = ''
  try { await referralApi.zeroBalance(zeroUserId.value); zeroOk.value = true; zeroUserId.value = '' }
  catch (e) { zeroErr.value = e.response?.data?.message || 'Error' }
  finally { zeroLoading.value = false }
}

// Earnings
const earningsUserId = ref(''); const earnings = ref([]); const earningsLoading = ref(false); const earningsLoaded = ref(false)
async function loadEarnings() {
  earningsLoading.value = true; earningsLoaded.value = false
  try { earnings.value = await referralApi.getEarnings(earningsUserId.value).then(r => r.data); earningsLoaded.value = true }
  catch { earnings.value = [] }
  finally { earningsLoading.value = false }
}

const t = computed(() => {
  const r = lang.value === 'ru'
  return {
    title: r ? 'Управление рефералами' : 'Referral Management',
    searchTitle: r ? 'Поиск пользователя' : 'Find User',
    searchPh: r ? 'Email или реферальный код...' : 'Email or referral code...',
    noUsers: r ? 'Пользователи не найдены' : 'No users found',
    userId: r ? 'UUID пользователя' : 'User UUID',
    creditTitle: r ? 'Ручное начисление' : 'Manual Credit',
    amount: r ? 'Сумма (USDT)' : 'Amount (USDT)',
    percent: r ? 'Процент' : 'Percent',
    note: r ? 'Примечание' : 'Note',
    notePh: r ? 'Причина...' : 'Reason...',
    creditBtn: r ? 'Начислить' : 'Credit',
    creditOk: r ? 'Начислено' : 'Credited',
    reassignTitle: r ? 'Переназначить реферера' : 'Reassign Referrer',
    newReferrer: r ? 'Новый реферер UUID' : 'New Referrer UUID',
    reassignBtn: r ? 'Переназначить' : 'Reassign',
    reassignOk: r ? 'Обновлено' : 'Updated',
    zeroTitle: r ? 'Обнулить баланс' : 'Zero Balance',
    zeroSub: r ? 'Записи получают isZeroed=true, история сохраняется.' : 'Records get isZeroed=true, history preserved.',
    zeroBtn: r ? 'Обнулить' : 'Zero Out',
    zeroOk: r ? 'Обнулено' : 'Zeroed',
    earningsTitle: r ? 'История начислений' : 'Earnings History',
    load: r ? 'Загрузить' : 'Load',
    date: r ? 'Дата' : 'Date',
    amount2: r ? 'Сумма' : 'Amount',
    percent2: r ? '%' : '%',
    type: r ? 'Тип' : 'Type',
    zeroed: r ? 'Обнулено' : 'Zeroed',
    manual: r ? 'Ручное' : 'Manual',
    auto: r ? 'Авто' : 'Auto',
    yes: r ? 'да' : 'yes',
    noEarnings: r ? 'Нет записей' : 'No records',
  }
})
</script>

<style lang="scss" scoped>
.admin-ref { max-width: 960px; }
.page-h { font-family: 'Montserrat',sans-serif; font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 20px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; margin-bottom: 20px; }
.card-title { font-family: 'Montserrat',sans-serif; font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 14px; }
.card-sub { font-size: 12px; color: var(--text-2); margin-bottom: 12px; margin-top: -8px; }
.search-row { margin-bottom: 14px; }
.inp { padding: 10px 13px; background: var(--bg-3,#18181c); border: 1px solid var(--border-2); border-radius: 9px; color: var(--text); font-size: 13px; outline: none; font-family: inherit; width: 100%; max-width: 380px; &:focus { border-color: var(--accent); } }
.form-group { label { display: block; font-size: 11px; font-weight: 600; color: var(--text-2); margin-bottom: 5px; } .inp { max-width: 220px; } }
.form-row { display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-start; margin-bottom: 14px; }
.btn { padding: 9px 18px; border-radius: 9px; font-family: 'Montserrat',sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s;
  &--sm { padding: 6px 11px; font-size: 11px; }
  &--accent { background: var(--accent); color: #0a0a0b; &:hover { opacity: 0.9; } &:disabled { opacity: 0.5; cursor: not-allowed; } }
  &--outline { background: transparent; border: 1px solid var(--border-2); color: var(--text-2); &:hover { color: var(--text); } }
  &--danger { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); &:hover { background: rgba(239,68,68,0.2); } }
}
.ok-msg { margin-top: 10px; font-size: 12px; color: #4ade80; }
.err-msg { margin-top: 10px; font-size: 12px; color: #f87171; }
.empty { padding: 16px; text-align: center; font-size: 13px; color: var(--text-3); }
.table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid var(--border); margin-top: 14px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 12px;
  th { padding: 9px 12px; background: var(--bg-2); color: var(--text-3); font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; text-align: left; border-bottom: 1px solid var(--border); }
  td { padding: 9px 12px; border-bottom: 1px solid var(--border); color: var(--text-2); }
  tr:last-child td { border-bottom: none; }
  .zeroed td { opacity: 0.4; text-decoration: line-through; }
  .acc { color: var(--accent); font-weight: 700; }
}
.mono-cell { font-family: monospace; font-size: 11px; display: flex; align-items: center; gap: 5px; }
.dim { color: var(--text-3); }
.btn-cp { background: none; border: none; cursor: pointer; opacity: 0.5; font-size: 12px; padding: 2px; transition: opacity 0.2s; &:hover { opacity: 1; } }
.row-actions { display: flex; gap: 5px; flex-wrap: wrap; }
.copy-toast { position: fixed; bottom: 24px; right: 24px; background: var(--accent); color: #0a0a0b; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Montserrat',sans-serif; z-index: 9999; }
</style>
