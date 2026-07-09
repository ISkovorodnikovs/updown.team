<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { shopApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/adminShop'

const products = ref([])
const showForm = ref(false)
const editing = ref(null)
const saving = ref(false)
const loading = ref(true)
const formError = ref('')
const filter = ref('all')

const defaultForm = () => ({
  type: 'indicator', name: '', description: '', tradingViewUrl: '',
  price: 0, currency: 'USDT', imageUrl: '', features: '', badge: '',
  isActive: true, sortOrder: 0, seatsTotal: 10, seatsTaken: 0,
})
const form = reactive(defaultForm())

onMounted(load)

async function load() {
  loading.value = true
  products.value = await shopApi.getAll().then(r => r.data).catch(() => [])
  loading.value = false
}

const filtered = computed(() => {
  if (filter.value === 'all') return products.value
  return products.value.filter(p => p.type === filter.value)
})

function openForm(p) {
  editing.value = p ?? null
  formError.value = ''
  const base = defaultForm()
  if (p && p.id) {
    Object.assign(base, {
      type: p.type ?? 'indicator',
      name: p.name ?? '',
      description: p.description ?? '',
      tradingViewUrl: p.tradingViewUrl ?? '',
      price: Number(p.price) ?? 0,
      currency: p.currency ?? 'USDT',
      imageUrl: p.imageUrl ?? '',
      features: (p.features ?? []).join('\n'),
      badge: p.badge ?? '',
      isActive: p.isActive ?? true,
      sortOrder: p.sortOrder ?? 0,
      seatsTotal: p.meta?.seatsTotal ?? 10,
      seatsTaken: p.meta?.seatsTaken ?? 0,
    })
  }
  Object.assign(form, base)
  showForm.value = true
}

async function save() {
  if (!form.name || form.price === '' || form.price === null) {
    formError.value = t.value.errNamePrice
    return
  }
  if (Number(form.price) < 0) {
    formError.value = t.value.errNegPrice
    return
  }
  saving.value = true; formError.value = ''
  try {
    const payload = {
      type: form.type,
      name: form.name,
      description: form.description || undefined,
      tradingViewUrl: form.tradingViewUrl || undefined,
      price: Number(form.price),
      currency: form.currency || 'USDT',
      imageUrl: form.imageUrl || undefined,
      features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
      badge: form.badge || undefined,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
      meta: form.type === 'education'
        ? { seatsTotal: Number(form.seatsTotal) || 0, seatsTaken: Number(form.seatsTaken) || 0 }
        : undefined,
    }
    if (editing.value) await shopApi.update(editing.value.id, payload)
    else await shopApi.create(payload)
    await load()
    showForm.value = false
  } catch (e) {
    formError.value = e.response?.data?.message
      ? (Array.isArray(e.response.data.message) ? e.response.data.message.join(', ') : e.response.data.message)
      : 'Error'
  } finally { saving.value = false }
}

async function removeProduct(p) {
  const msg = t.value.confirmDeactivate.replace('{name}', p.name)
  if (!confirm(msg)) return
  await shopApi.remove(p.id).catch(() => {})
  await load()
}

const typeLabel = (tp) => {
  if (tp === 'education') return t.value.tEducation
  if (tp === 'signal_channel') return t.value.tChannel
  return t.value.tIndicator
}

const t = useT(dict)
</script>

<template>
  <div class="shop-admin">
    <div class="sa-head">
      <div>
        <h1>{{ t.title }}</h1>
        <p>{{ t.sub }}</p>
      </div>
      <button class="btn-primary" @click="openForm(null)">{{ t.add }}</button>
    </div>

    <div class="sa-filters">
      <button :class="{ on: filter==='all' }" @click="filter='all'">{{ t.all }}</button>
      <button :class="{ on: filter==='indicator' }" @click="filter='indicator'">{{ t.ind }}</button>
      <button :class="{ on: filter==='signal_channel' }" @click="filter='signal_channel'">{{ t.ch }}</button>
      <button :class="{ on: filter==='education' }" @click="filter='education'">{{ t.edu }}</button>
    </div>

    <div v-if="loading" class="sa-empty">{{ t.loading }}</div>
    <div v-else-if="!filtered.length" class="sa-empty">{{ t.empty }}</div>

    <div v-else class="sa-grid">
      <div v-for="p in filtered" :key="p.id" class="sa-card" :class="{ 'sa-card--off': !p.isActive }">
        <div class="sa-card__top">
          <span class="sa-card__type">{{ typeLabel(p.type) }}</span>
          <span v-if="p.badge" class="sa-card__pill">{{ p.badge }}</span>
          <span v-if="!p.isActive" class="sa-card__badge">{{ t.inactive }}</span>
        </div>
        <h3 class="sa-card__name">{{ p.name }}</h3>
        <div class="sa-card__price">{{ p.price }} <span>USDT / mo</span></div>
        <p class="sa-card__desc">{{ p.description }}</p>
        <div class="sa-card__actions">
          <button class="btn-ghost" @click="openForm(p)">{{ t.edit }}</button>
          <button v-if="p.isActive" class="btn-danger" @click="removeProduct(p)">{{ t.deactivate }}</button>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="sa-overlay" @click.self="showForm = false">
      <div class="sa-modal">
        <h2>{{ editing ? t.edit : t.add }}</h2>
        <div class="sa-form">
          <div class="sa-row">
            <label>{{ t.name }}<input v-model="form.name" type="text" /></label>
            <label>{{ t.type }}
              <select v-model="form.type">
                <option value="indicator">{{ t.ind }}</option>
                <option value="signal_channel">{{ t.ch }}</option>
                <option value="education">{{ t.edu }}</option>
              </select>
            </label>
          </div>
          <div class="sa-row">
            <label>{{ t.price }}<input v-model.number="form.price" type="number" min="0" step="1" /></label>
            <label>{{ t.sort }}<input v-model.number="form.sortOrder" type="number" min="0" /></label>
          </div>
          <label v-if="form.type==='indicator'">{{ t.tv }}<input v-model="form.tradingViewUrl" type="text" /></label>
          <div v-if="form.type==='education'" class="sa-row">
            <label>{{ t.seatsTotal }}<input v-model.number="form.seatsTotal" type="number" min="0" /></label>
            <label>{{ t.seatsTaken }}<input v-model.number="form.seatsTaken" type="number" min="0" /></label>
          </div>
          <label>{{ t.badge }}<input v-model="form.badge" type="text" /></label>
          <label>{{ t.desc }}<textarea v-model="form.description" rows="2"></textarea></label>
          <label>{{ t.features }}<textarea v-model="form.features" rows="4"></textarea></label>
          <label class="sa-chk">
            <input type="checkbox" v-model="form.isActive" /> {{ t.active }}
          </label>
          <div v-if="formError" class="sa-err">{{ formError }}</div>
          <div class="sa-modal__actions">
            <button class="btn-ghost" @click="showForm = false">{{ t.cancel }}</button>
            <button class="btn-primary" :disabled="saving" @click="save">{{ saving ? '…' : t.save }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shop-admin { padding: 4px; }
.sa-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 800; margin: 0; }
  p { color: var(--text-2); font-size: 13px; margin: 4px 0 0; } }
.sa-filters { display: flex; gap: 8px; margin-bottom: 18px;
  button { background: var(--bg-2); border: 1px solid var(--border, #2a2a30); color: var(--text-2); border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
    &.on { background: var(--accent); color: #0a0a0b; border-color: var(--accent); } } }
.sa-empty { color: var(--text-2); text-align: center; padding: 48px; font-size: 14px; }
.sa-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.sa-card { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; padding: 18px; display: flex; flex-direction: column;
  transition: border-color .2s; &:hover { border-color: var(--accent); } &--off { opacity: 0.55; }
  &__top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  &__type { font-size: 11px; font-weight: 700; letter-spacing: .06em; color: var(--accent); }
  &__pill { font-size: 9px; font-weight: 700; background: var(--accent); color: #0a0a0b; border-radius: 5px; padding: 2px 6px; }
  &__badge { font-size: 9px; font-weight: 800; color: #e74c3c; border: 1px solid #e74c3c; border-radius: 5px; padding: 2px 6px; margin-left: auto; }
  &__name { font-family: 'Montserrat',sans-serif; font-size: 16px; font-weight: 800; margin: 8px 0 2px; }
  &__price { font-size: 19px; font-weight: 800; span { font-size: 11px; color: var(--text-2); font-weight: 500; } }
  &__desc { color: var(--text-2); font-size: 12px; margin: 8px 0; flex: 1; }
  &__actions { display: flex; gap: 8px; }
}
.btn-primary { background: var(--accent); color: #0a0a0b; border: none; border-radius: 9px; padding: 9px 16px; font-weight: 700; font-size: 13px; cursor: pointer; font-family: 'Montserrat',sans-serif; &:hover { opacity: .9; } &:disabled { opacity: .5; } }
.btn-ghost { background: transparent; color: var(--text-1); border: 1px solid var(--border, #333); border-radius: 9px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer; &:hover { border-color: var(--accent); } }
.btn-danger { background: transparent; color: #e74c3c; border: 1px solid #e74c3c44; border-radius: 9px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer; &:hover { background: #e74c3c18; } }
.sa-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: flex-start; justify-content: center; padding: 40px 16px; z-index: 200; overflow-y: auto; }
.sa-modal { background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 16px; padding: 24px; width: 100%; max-width: 540px;
  h2 { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; margin: 0 0 16px; } }
.sa-form { display: flex; flex-direction: column; gap: 12px;
  label { display: flex; flex-direction: column; gap: 5px; font-size: 12px; color: var(--text-2); font-weight: 600; }
  input, select, textarea { background: var(--bg-2); border: 1px solid var(--border, #2a2a30); border-radius: 8px; padding: 9px 11px; color: var(--text-1); font-size: 13px; font-family: inherit; &:focus { outline: none; border-color: var(--accent); } }
  textarea { resize: vertical; } }
.sa-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.sa-chk { flex-direction: row !important; align-items: center; gap: 7px; color: var(--text-1) !important; cursor: pointer; input { width: auto; } }
.sa-err { color: #e74c3c; font-size: 12px; }
.sa-modal__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
@media (max-width: 600px) { .sa-row { grid-template-columns: 1fr; } }
</style>
