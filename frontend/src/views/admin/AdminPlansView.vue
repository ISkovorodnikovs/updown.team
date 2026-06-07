<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { plansApi } from '@/api'

const lang = computed(() => localStorage.getItem('ud-lang') || 'en')
const plans = ref([])
const showForm = ref(false)
const editing = ref(null)
const saving = ref(false)
const loading = ref(true)
const formError = ref('')

const FEATURE_FLAGS = [
  ['hasSignalsCrypto', 'Crypto signals'],
  ['hasSignalsForex', 'Forex signals'],
  ['hasAiAnalytics', 'AI analytics'],
  ['hasTablePredictor', 'Table Predictor'],
  ['hasStrongLevels', 'Strong Levels'],
  ['hasLiquidityZones', 'Liquidity Zones'],
  ['hasPumpMM', 'Pump & MM'],
  ['hasFibonacci', 'Fibonacci'],
  ['hasCopytrading', 'Copytrading'],
  ['hasEducation', 'Education'],
  ['hasCommunity', 'Community'],
  ['hasSupport', 'Support'],
]

const defaultForm = () => {
  const f = {
    type: 'CUSTOM', name: '', description: '', price: 0,
    currency: 'USDT', features: '', isActive: true, sortOrder: 0,
  }
  FEATURE_FLAGS.forEach(([k]) => (f[k] = false))
  return f
}
const form = reactive(defaultForm())

onMounted(load)

async function load() {
  loading.value = true
  plans.value = await plansApi.getAllAdmin().then(r => r.data).catch(() => [])
  loading.value = false
}

function openForm(plan) {
  editing.value = plan ?? null
  formError.value = ''
  const base = defaultForm()
  if (plan && plan.id) {
    Object.assign(base, {
      type: plan.type ?? 'CUSTOM',
      name: plan.name ?? '',
      description: plan.description ?? '',
      price: Number(plan.price) ?? 0,
      currency: plan.currency ?? 'USDT',
      features: (plan.features ?? []).join('\n'),
      isActive: plan.isActive ?? true,
      sortOrder: plan.sortOrder ?? 0,
    })
    FEATURE_FLAGS.forEach(([k]) => (base[k] = !!plan[k]))
  }
  Object.assign(form, base)
  showForm.value = true
}

async function save() {
  if (!form.name || form.price === '' || form.price === null) {
    formError.value = lang.value === 'ru' ? 'Заполните название и цену' : 'Name and price are required'
    return
  }
  if (Number(form.price) < 0) {
    formError.value = lang.value === 'ru' ? 'Цена не может быть отрицательной' : 'Price cannot be negative'
    return
  }
  saving.value = true; formError.value = ''
  try {
    const payload = {
      type: form.type,
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      currency: form.currency || 'USDT',
      features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
    }
    FEATURE_FLAGS.forEach(([k]) => (payload[k] = form[k]))
    if (editing.value) await plansApi.update(editing.value.id, payload)
    else await plansApi.create(payload)
    await load()
    showForm.value = false
  } catch (e) {
    formError.value = e.response?.data?.message
      ? (Array.isArray(e.response.data.message) ? e.response.data.message.join(', ') : e.response.data.message)
      : 'Error'
  } finally { saving.value = false }
}

async function removePlan(p) {
  const msg = lang.value === 'ru'
    ? `Деактивировать тариф "${p.name}"? Существующие подписки продолжат работать.`
    : `Deactivate plan "${p.name}"? Existing subscriptions keep working.`
  if (!confirm(msg)) return
  await plansApi.remove(p.id).catch(() => {})
  await load()
}

const t = computed(() => {
  const r = lang.value === 'ru'
  return {
    title: r ? 'Управление тарифами' : 'Manage Plans',
    sub: r ? 'Создание, редактирование и деактивация тарифов в реальном времени' : 'Create, edit and deactivate plans in real time',
    add: r ? '+ Новый тариф' : '+ New Plan',
    name: r ? 'Название' : 'Name',
    type: r ? 'Тип' : 'Type',
    price: r ? 'Цена (USDT/мес)' : 'Price (USDT/mo)',
    desc: r ? 'Описание' : 'Description',
    features: r ? 'Фичи (по одной на строку)' : 'Features (one per line)',
    sort: r ? 'Порядок' : 'Sort order',
    active: r ? 'Активен' : 'Active',
    includes: r ? 'Что включено' : 'Included',
    edit: r ? 'Изменить' : 'Edit',
    deactivate: r ? 'Деактивировать' : 'Deactivate',
    save: r ? 'Сохранить' : 'Save',
    cancel: r ? 'Отмена' : 'Cancel',
    inactive: r ? 'НЕАКТИВЕН' : 'INACTIVE',
    empty: r ? 'Тарифов пока нет' : 'No plans yet',
    loading: r ? 'Загрузка…' : 'Loading…',
  }
})
</script>

<template>
  <div class="plans-admin">
    <div class="pa-head">
      <div>
        <h1>{{ t.title }}</h1>
        <p>{{ t.sub }}</p>
      </div>
      <button class="btn-primary" @click="openForm(null)">{{ t.add }}</button>
    </div>

    <div v-if="loading" class="pa-empty">{{ t.loading }}</div>
    <div v-else-if="!plans.length" class="pa-empty">{{ t.empty }}</div>

    <div v-else class="pa-grid">
      <div v-for="p in plans" :key="p.id" class="pa-card" :class="{ 'pa-card--off': !p.isActive }">
        <div class="pa-card__top">
          <span class="pa-card__type">{{ p.type }}</span>
          <span v-if="!p.isActive" class="pa-card__badge">{{ t.inactive }}</span>
        </div>
        <h3 class="pa-card__name">{{ p.name }}</h3>
        <div class="pa-card__price">{{ p.price }} <span>USDT / mo</span></div>
        <p class="pa-card__desc">{{ p.description }}</p>
        <ul class="pa-card__feats">
          <li v-for="f in (p.features || [])" :key="f">{{ f }}</li>
        </ul>
        <div class="pa-card__actions">
          <button class="btn-ghost" @click="openForm(p)">{{ t.edit }}</button>
          <button v-if="p.isActive" class="btn-danger" @click="removePlan(p)">{{ t.deactivate }}</button>
        </div>
      </div>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="pa-overlay" @click.self="showForm = false">
      <div class="pa-modal">
        <h2>{{ editing ? t.edit : t.add }}</h2>
        <div class="pa-form">
          <div class="pa-row">
            <label>{{ t.name }}
              <input v-model="form.name" type="text" />
            </label>
            <label>{{ t.type }}
              <select v-model="form.type">
                <option value="START">START</option>
                <option value="PRO">PRO</option>
                <option value="ELITE">ELITE</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>
            </label>
          </div>
          <div class="pa-row">
            <label>{{ t.price }}
              <input v-model.number="form.price" type="number" min="0" step="1" />
            </label>
            <label>{{ t.sort }}
              <input v-model.number="form.sortOrder" type="number" min="0" />
            </label>
          </div>
          <label>{{ t.desc }}
            <textarea v-model="form.description" rows="2"></textarea>
          </label>
          <label>{{ t.features }}
            <textarea v-model="form.features" rows="4" placeholder="Signals\nAI analytics\n…"></textarea>
          </label>
          <div class="pa-flags">
            <span class="pa-flags__h">{{ t.includes }}</span>
            <label v-for="[k, lbl] in FEATURE_FLAGS" :key="k" class="pa-chk">
              <input type="checkbox" v-model="form[k]" /> {{ lbl }}
            </label>
          </div>
          <label class="pa-chk pa-chk--wide">
            <input type="checkbox" v-model="form.isActive" /> {{ t.active }}
          </label>
          <div v-if="formError" class="pa-err">{{ formError }}</div>
          <div class="pa-modal__actions">
            <button class="btn-ghost" @click="showForm = false">{{ t.cancel }}</button>
            <button class="btn-primary" :disabled="saving" @click="save">{{ saving ? '…' : t.save }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.plans-admin { padding: 4px; }
.pa-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 22px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 800; margin: 0; }
  p { color: var(--text-2); font-size: 13px; margin: 4px 0 0; }
}
.pa-empty { color: var(--text-2); text-align: center; padding: 48px; font-size: 14px; }
.pa-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.pa-card { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; padding: 18px;
  display: flex; flex-direction: column; transition: border-color .2s;
  &:hover { border-color: var(--accent); }
  &--off { opacity: 0.55; }
  &__top { display: flex; justify-content: space-between; align-items: center; }
  &__type { font-size: 11px; font-weight: 700; letter-spacing: .08em; color: var(--accent); }
  &__badge { font-size: 9px; font-weight: 800; color: #e74c3c; border: 1px solid #e74c3c; border-radius: 5px; padding: 2px 6px; }
  &__name { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; margin: 8px 0 2px; }
  &__price { font-size: 20px; font-weight: 800; span { font-size: 11px; color: var(--text-2); font-weight: 500; } }
  &__desc { color: var(--text-2); font-size: 12px; margin: 8px 0; min-height: 32px; }
  &__feats { list-style: none; padding: 0; margin: 4px 0 14px; flex: 1;
    li { font-size: 12px; color: var(--text-2); padding: 2px 0 2px 14px; position: relative;
      &:before { content: '✦'; position: absolute; left: 0; color: var(--accent); } } }
  &__actions { display: flex; gap: 8px; }
}
.btn-primary { background: var(--accent); color: #0a0a0b; border: none; border-radius: 9px; padding: 9px 16px; font-weight: 700; font-size: 13px; cursor: pointer; font-family: 'Montserrat',sans-serif; &:hover { opacity: .9; } &:disabled { opacity: .5; } }
.btn-ghost { background: transparent; color: var(--text-1); border: 1px solid var(--border, #333); border-radius: 9px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer; &:hover { border-color: var(--accent); } }
.btn-danger { background: transparent; color: #e74c3c; border: 1px solid #e74c3c44; border-radius: 9px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer; &:hover { background: #e74c3c18; } }
.pa-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: flex-start; justify-content: center; padding: 40px 16px; z-index: 200; overflow-y: auto; }
.pa-modal { background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 16px; padding: 24px; width: 100%; max-width: 560px;
  h2 { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; margin: 0 0 16px; } }
.pa-form { display: flex; flex-direction: column; gap: 12px;
  label { display: flex; flex-direction: column; gap: 5px; font-size: 12px; color: var(--text-2); font-weight: 600; }
  input, select, textarea { background: var(--bg-2); border: 1px solid var(--border, #2a2a30); border-radius: 8px; padding: 9px 11px; color: var(--text-1); font-size: 13px; font-family: inherit; &:focus { outline: none; border-color: var(--accent); } }
  textarea { resize: vertical; }
}
.pa-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pa-flags { border: 1px solid var(--border, #2a2a30); border-radius: 10px; padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  &__h { grid-column: 1 / -1; font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: .05em; } }
.pa-chk { flex-direction: row !important; align-items: center; gap: 7px; font-size: 12px; color: var(--text-1) !important; cursor: pointer;
  input { width: auto; }
  &--wide { padding: 4px 0; } }
.pa-err { color: #e74c3c; font-size: 12px; }
.pa-modal__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
@media (max-width: 600px) { .pa-row, .pa-flags { grid-template-columns: 1fr; } }
</style>
