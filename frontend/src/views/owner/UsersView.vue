<template>
  <div class="users-page">
    <div class="page-header">
      <h1>Пользователи</h1>
      <span class="user-count">{{ total }} всего</span>
    </div>

    <div class="search-bar">
      <input class="input" v-model="search" placeholder="Поиск по email..." @input="debouncedLoad" />
    </div>

    <div v-if="loading" class="spinner-wrap"><div class="spinner"></div></div>
    <div v-else class="users-table-wrap">
      <table class="users-table">
        <colgroup>
          <col style="min-width:180px">
          <col style="min-width:100px">
          <col style="min-width:120px">
          <col style="min-width:100px">
          <col style="min-width:110px">
          <col style="min-width:90px">
          <col style="min-width:80px">
          <col style="min-width:70px">
          <col style="min-width:90px">
          <col style="min-width:200px">
        </colgroup>
        <thead>
          <tr>
            <th>Email</th>
            <th>Имя</th>
            <th>UUID</th>
            <th>Реф. код</th>
            <th>Реферер</th>
            <th>Реф. баланс</th>
            <th>Роль</th>
            <th>✓</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.email }}</td>
            <td>{{ [u.firstName, u.lastName].filter(Boolean).join(' ') || '—' }}</td>
            <td class="td-uuid">
              <span class="uuid-val" :title="u.id">{{ u.id.substring(0,8) }}…</span>
              <button class="btn-copy-sm" @click="copy(u.id)" :title="'Скопировать UUID: ' + u.id">📋</button>
            </td>
            <td class="td-code">
              <span v-if="u.referralCode">{{ u.referralCode }}</span>
              <span v-else class="text-dim">—</span>
              <button v-if="u.referralCode" class="btn-copy-sm" @click="copy(u.referralCode)" title="Скопировать код">📋</button>
            </td>
            <td class="td-ref">
              <span v-if="u.referredBy" class="uuid-val" :title="u.referredBy">{{ u.referredBy.substring(0,8) }}…</span>
              <span v-else class="text-dim">—</span>
            </td>
            <td class="td-balance">
              <span :class="{ 'text-acc': Number(u.referralBalance) > 0 }">
                {{ Number(u.referralBalance || 0).toFixed(2) }} $
              </span>
            </td>
            <td><span :class="['badge', roleColor(u.role)]">{{ u.role }}</span></td>
            <td>{{ u.isActive ? '✅' : '❌' }}</td>
            <td>{{ formatDate(u.createdAt) }}</td>
            <td>
              <div class="td-actions">
                <button class="btn btn--accent btn--sm" @click="openGrant(u)" title="Выдать товар">🎁 Выдать</button>
                <button v-if="u.role !== 'ADMIN' && u.role !== 'OWNER'" class="btn btn--outline btn--sm" @click="assign(u)">→ Admin</button>
                <button v-if="u.role === 'ADMIN'" class="btn btn--outline btn--sm" @click="revoke(u)">← User</button>
                <button v-if="u.isActive && u.role !== 'OWNER'" class="btn btn--danger btn--sm" @click="deactivate(u)">🚫</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="total > limit">
      <button class="btn btn--outline btn--sm" :disabled="page === 1" @click="page--; load()">← Пред</button>
      <span>{{ page }} / {{ Math.ceil(total / limit) }}</span>
      <button class="btn btn--outline btn--sm" :disabled="page * limit >= total" @click="page++; load()">След →</button>
    </div>

    <!-- Grant modal -->
    <div class="modal-overlay" v-if="showGrant" @click.self="showGrant = false">
      <div class="modal-card">
        <button class="modal-close" @click="showGrant = false">×</button>
        <h2>🎁 Выдать пользователю</h2>
        <p class="modal-user">{{ grantTarget?.email }}</p>

        <!-- Cart -->
        <div class="grant-cart" v-if="grantCart.length">
          <div class="grant-cart__label">Корзина выдачи:</div>
          <div class="grant-cart__items">
            <div class="grant-tag" v-for="(item, idx) in grantCart" :key="idx">
              {{ item.label }}
              <button @click="grantCart.splice(idx, 1)">×</button>
            </div>
          </div>
        </div>

        <div class="grant-tabs">
          <button :class="['tab', { 'tab--active': grantTab === 'plan' }]" @click="grantTab = 'plan'">Тариф</button>
          <button :class="['tab', { 'tab--active': grantTab === 'product' }]" @click="grantTab = 'product'">Товар (индикатор / канал)</button>
        </div>

        <!-- Plan tab -->
        <div v-if="grantTab === 'plan'" class="grant-form">
          <div class="form-group">
            <label>Тариф</label>
            <select class="input" v-model="grantPlan.planId">
              <option value="" disabled>Выбрать тариф</option>
              <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }} ({{ p.price }} $)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Дней доступа</label>
            <input class="input" type="number" v-model.number="grantPlan.durationDays" min="1" max="3650" />
          </div>
          <div class="form-group">
            <label>Примечание</label>
            <input class="input" v-model="grantPlan.notes" placeholder="Причина выдачи..." />
          </div>
          <button class="btn btn--accent" @click="addPlanToCart">+ Добавить в корзину</button>
        </div>

        <!-- Product tab -->
        <div v-if="grantTab === 'product'" class="grant-form">
          <div class="form-group">
            <label>Товар</label>
            <select class="input" v-model="grantProduct.productId">
              <option value="" disabled>Выбрать товар</option>
              <optgroup label="Индикаторы">
                <option v-for="p in indicators" :key="p.id" :value="p.id">{{ p.name }} ({{ p.price }} $)</option>
              </optgroup>
              <optgroup label="Каналы">
                <option v-for="p in channels" :key="p.id" :value="p.id">{{ p.name }} ({{ p.price }} $)</option>
              </optgroup>
            </select>
          </div>
          <div class="form-group">
            <label>Дней доступа</label>
            <input class="input" type="number" v-model.number="grantProduct.durationDays" min="1" max="3650" />
          </div>
          <button class="btn btn--accent" @click="addProductToCart">+ Добавить в корзину</button>
        </div>

        <div class="modal-footer">
          <div v-if="grantError" class="err-msg">❌ {{ grantError }}</div>
          <div v-if="grantSuccess" class="ok-msg">✅ Выдано!</div>
          <button class="btn btn--primary" @click="executeGrant" :disabled="granting || !grantCart.length">
            {{ granting ? '...' : `Выдать (${grantCart.length} поз.)` }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="copyMsg" class="copy-toast">{{ copyMsg }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi, plansApi, shopApi, subscriptionsApi } from '@/api'

const users = ref([])
const loading = ref(true)
const search = ref('')
const page = ref(1)
const limit = 50
const total = ref(0)
let searchTimer = null

// Grant
const showGrant = ref(false)
const grantTarget = ref(null)
const grantTab = ref('plan')
const grantCart = ref([])
const grantPlan = ref({ planId: '', durationDays: 30, notes: '' })
const grantProduct = ref({ productId: '', durationDays: 30 })
const granting = ref(false)
const grantError = ref('')
const grantSuccess = ref(false)
const plans = ref([])
const indicators = ref([])
const channels = ref([])

const copyMsg = ref('')

async function load() {
  loading.value = true
  const { data } = await adminApi.getUsers({ search: search.value || undefined, limit, page: page.value })
  users.value = data.items
  total.value = data.total
  loading.value = false
}

function debouncedLoad() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; load() }, 400)
}

onMounted(async () => {
  await load()
  ;[plans.value, indicators.value, channels.value] = await Promise.all([
    plansApi.getAll().then(r => r.data).catch(() => []),
    shopApi.getIndicators().then(r => r.data).catch(() => []),
    shopApi.getChannels().then(r => r.data).catch(() => []),
  ])
})

function openGrant(user) {
  grantTarget.value = user
  grantCart.value = []
  grantPlan.value = { planId: '', durationDays: 30, notes: '' }
  grantProduct.value = { productId: '', durationDays: 30 }
  grantError.value = ''; grantSuccess.value = false
  showGrant.value = true
}

function addPlanToCart() {
  if (!grantPlan.value.planId) return
  const plan = plans.value.find(p => p.id === grantPlan.value.planId)
  grantCart.value.push({
    type: 'plan',
    planId: grantPlan.value.planId,
    durationDays: grantPlan.value.durationDays,
    notes: grantPlan.value.notes,
    label: `${plan?.name} × ${grantPlan.value.durationDays}д`,
  })
  grantPlan.value = { planId: '', durationDays: 30, notes: '' }
}

function addProductToCart() {
  if (!grantProduct.value.productId) return
  const all = [...indicators.value, ...channels.value]
  const prod = all.find(p => p.id === grantProduct.value.productId)
  grantCart.value.push({
    type: 'product',
    productId: grantProduct.value.productId,
    durationDays: grantProduct.value.durationDays,
    label: `${prod?.name} × ${grantProduct.value.durationDays}д`,
  })
  grantProduct.value = { productId: '', durationDays: 30 }
}

async function executeGrant() {
  granting.value = true; grantError.value = ''; grantSuccess.value = false
  try {
    for (const item of grantCart.value) {
      if (item.type === 'plan') {
        await subscriptionsApi.grant({
          userId: grantTarget.value.id,
          planId: item.planId,
          durationDays: item.durationDays,
          notes: item.notes,
        })
      }
      // TODO: product grant endpoint when UserProduct entity is ready
    }
    grantSuccess.value = true
    grantCart.value = []
  } catch (e) {
    grantError.value = e.response?.data?.message || 'Ошибка'
  } finally { granting.value = false }
}

async function assign(u) { await adminApi.assignAdmin(u.id); u.role = 'ADMIN' }
async function revoke(u) { await adminApi.revokeAdmin(u.id); u.role = 'USER' }
async function deactivate(u) {
  if (!confirm(`Деактивировать ${u.email}?`)) return
  await adminApi.deactivateUser(u.id); u.isActive = false
}

function copy(text) {
  navigator.clipboard.writeText(text)
  copyMsg.value = 'Скопировано!'
  setTimeout(() => copyMsg.value = '', 2000)
}

function roleColor(role) {
  return { OWNER: 'badge--blue', ADMIN: 'badge--blue', PARTNER: 'badge--green', USER: 'badge--gray' }[role] || 'badge--gray'
}
function formatDate(d) { return new Date(d).toLocaleDateString('ru-RU') }
</script>

<style lang="scss" scoped>
.users-page { max-width: 100%; }
.page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; h1 { font-family: 'Montserrat',sans-serif; font-size: 20px; font-weight: 800; color: var(--text); } }
.user-count { font-size: 12px; color: var(--text-3); background: var(--surface); border: 1px solid var(--border); padding: 3px 10px; border-radius: 20px; }
.search-bar { margin-bottom: 16px; }
.input { padding: 10px 14px; background: var(--bg-2); border: 1px solid var(--border-2); border-radius: 9px; color: var(--text); font-size: 13px; outline: none; font-family: inherit; &:focus { border-color: var(--accent); } }
.spinner-wrap { display: flex; justify-content: center; padding: 40px; }

.users-table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid var(--border); }
.users-table {
  width: 100%; border-collapse: collapse; font-size: 12px;
  th { padding: 10px 12px; background: var(--bg-2); color: var(--text-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap; }
  td { padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--text-2); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }
}
.td-uuid, .td-ref { white-space: nowrap; }
.td-code { white-space: nowrap; }
.uuid-val { font-family: monospace; font-size: 11px; color: var(--text-3); }
.btn-copy-sm { background: none; border: none; cursor: pointer; font-size: 13px; padding: 2px 4px; opacity: 0.6; transition: opacity 0.2s; &:hover { opacity: 1; } }
.td-balance { font-weight: 600; }
.text-acc { color: var(--accent); }
.text-dim { color: var(--text-3); }
.td-actions { display: flex; gap: 6px; flex-wrap: wrap; }

.pagination { display: flex; align-items: center; gap: 12px; justify-content: center; margin-top: 16px; font-size: 13px; color: var(--text-2); }
.badge { padding: 3px 8px; border-radius: 5px; font-size: 10px; font-weight: 700; font-family: 'Montserrat',sans-serif; }
.badge--blue { background: rgba(79,110,247,0.15); color: #7b9cff; }
.badge--green { background: rgba(34,197,94,0.12); color: #4ade80; }
.badge--gray { background: var(--surface); color: var(--text-3); }

.btn { padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; font-family: 'Montserrat',sans-serif; white-space: nowrap;
  &--sm { padding: 5px 10px; font-size: 11px; }
  &--outline { background: transparent; border: 1px solid var(--border-2); color: var(--text-2); &:hover { color: var(--text); border-color: var(--text); } }
  &--danger { background: rgba(239,68,68,0.12); color: #f87171; &:hover { background: rgba(239,68,68,0.2); } }
  &--accent { background: var(--accent); color: #0a0a0b; &:hover { opacity: 0.9; } &:disabled { opacity: 0.5; cursor: not-allowed; } }
  &--primary { background: var(--accent); color: #0a0a0b; width: 100%; padding: 12px; font-size: 13px; &:disabled { opacity: 0.5; cursor: not-allowed; } }
}

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px; overflow-y: auto; }
.modal-card { background: var(--bg-2); border: 1px solid var(--border); border-radius: 18px; padding: 28px; max-width: 520px; width: 100%; position: relative; h2 { font-family: 'Montserrat',sans-serif; font-size: 17px; font-weight: 800; color: var(--text); margin-bottom: 4px; } }
.modal-close { position: absolute; top: 14px; right: 16px; background: none; border: none; color: var(--text-3); font-size: 20px; cursor: pointer; &:hover { color: var(--text); } }
.modal-user { font-size: 13px; color: var(--accent); margin-bottom: 16px; font-weight: 600; }
.modal-footer { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; }

.grant-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
.tab { padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text-2); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &--active { border-color: var(--accent); color: var(--accent); background: rgba(201,243,29,0.08); }
}

.grant-cart { background: var(--bg-3,#18181c); border: 1px solid var(--border); border-radius: 10px; padding: 12px; margin-bottom: 16px; }
.grant-cart__label { font-size: 11px; color: var(--text-3); font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
.grant-cart__items { display: flex; flex-wrap: wrap; gap: 6px; }
.grant-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(201,243,29,0.08); border: 1px solid rgba(201,243,29,0.2); border-radius: 6px; font-size: 12px; color: var(--text-2); button { background: none; border: none; color: var(--text-3); cursor: pointer; font-size: 14px; &:hover { color: var(--text); } } }

.grant-form { display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; }
.form-group { label { display: block; font-size: 11px; font-weight: 600; color: var(--text-2); margin-bottom: 5px; } .input { width: 100%; } }
.err-msg { font-size: 12px; color: #f87171; }
.ok-msg { font-size: 12px; color: #4ade80; }

.copy-toast { position: fixed; bottom: 24px; right: 24px; background: var(--accent); color: #0a0a0b; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Montserrat',sans-serif; z-index: 9999; animation: fadeInUp 0.2s ease; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
