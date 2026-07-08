<template>
  <div class="admin-banners">
    <div class="page-header">
      <h1>🎨 {{ t.title }}</h1>
      <button class="btn-new" @click="openForm(null)">+ {{ t.create }}</button>
    </div>

    <div class="banners-list" v-if="banners.length">
      <div class="banner-item" v-for="b in banners" :key="b.id" :class="{ 'banner-item--inactive': !b.isActive }">
        <div class="banner-item__img" v-if="b.imageUrl">
          <img :src="b.imageUrl" />
        </div>
        <div class="banner-item__body">
          <div class="banner-item__status" :class="b.isActive ? 'status--on' : 'status--off'">
            {{ b.isActive ? t.active : t.inactive }}
          </div>
          <div class="banner-item__title">{{ b.title }}</div>
          <div class="banner-item__msg">{{ b.message }}</div>
          <div class="banner-item__meta">
            <span v-if="b.endsAt">⏱ {{ new Date(b.endsAt).toLocaleString() }}</span>
            <span>🎯 {{ b.targetType }}</span>
            <span v-if="b.periodDiscounts">
              💸 {{ Object.entries(b.periodDiscounts).map(([m,p]) => `${m}${t.mo}: ${p}%`).join(' | ') }}
            </span>
          </div>
        </div>
        <div class="banner-item__actions">
          <button class="btn-toggle" @click="toggle(b)">{{ b.isActive ? t.disable : t.enable }}</button>
          <button class="btn-icon" @click="openForm(b)">✏️</button>
          <button class="btn-icon btn-icon--danger" @click="remove(b.id)">🗑</button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">{{ t.empty }}</div>

    <!-- Form Modal -->
    <div class="modal-overlay" v-if="showForm" @click.self="showForm=false">
      <div class="modal-card">
        <button class="modal-close" @click="showForm=false">×</button>
        <h2>{{ editing ? t.edit : t.create }}</h2>

        <div class="form-group">
          <label>{{ t.fTitle }} *</label>
          <input class="inp" v-model="form.title" :placeholder="t.fTitlePh" />
        </div>
        <div class="form-group">
          <label>{{ t.fMsg }} *</label>
          <textarea class="inp inp--ta" v-model="form.message" rows="3" :placeholder="t.fMsgPh"></textarea>
        </div>

        <div class="form-group">
          <label>{{ t.fImage }}</label>
          <input class="inp" v-model="form.imageUrl" placeholder="https://..." />
          <p class="field-hint">{{ t.imageHint }}</p>
          <div class="img-preview" v-if="form.imageUrl">
            <img :src="form.imageUrl" alt="preview" @error="form.imageUrl=''" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t.fTarget }}</label>
            <select class="inp" v-model="form.targetType">
              <option value="all">{{ t.targetAll }}</option>
              <option value="plans">{{ t.targetPlans }}</option>
              <option value="indicators">{{ t.targetIndicators }}</option>
              <option value="channels">{{ t.targetChannels }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ t.fEnds }}</label>
            <input class="inp" type="datetime-local" v-model="form.endsAt" />
            <p class="field-hint" style="color:#4ade80" v-if="form.endsAt">✓ {{ new Date(form.endsAt).toLocaleString() }}</p>
            <p class="field-hint" v-else style="color:#52526a">{{ t.noExpiry }}</p>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t.fDiscounts }}</label>
          <p class="field-hint">{{ t.discountHint }}</p>
          <div class="discounts-grid">
            <div class="disc-cell" v-for="months in [1,3,6,12]" :key="months">
              <span class="disc-period">{{ months }} {{ t.mo }}</span>
              <div class="disc-inp-wrap">
                <input class="inp inp--xs" type="number" min="0" max="100"
                  v-model.number="form.periodDiscounts[months]" placeholder="0" />
                <span class="disc-pct">%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-checks">
          <label class="check-label">
            <input type="checkbox" v-model="form.showOnLanding" />
            {{ t.fLanding }}
          </label>
          <label class="check-label">
            <input type="checkbox" v-model="form.showInDashboard" />
            {{ t.fDashboard }}
          </label>
          <label class="check-label">
            <input type="checkbox" v-model="form.isActive" />
            {{ t.fActive }}
          </label>
        </div>

        <div v-if="formError" class="form-error">{{ formError }}</div>
        <div class="modal-actions">
          <button class="btn-save" @click="save" :disabled="saving">
            {{ saving ? '...' : t.save }}
          </button>
          <button class="btn-cancel" @click="showForm=false">{{ t.cancel }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { bannersApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/adminBanners'

const banners = ref([])
const showForm = ref(false)
const editing = ref(null)
const saving = ref(false)
const formError = ref('')

const defaultEndsAt = () => {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 16)
}

const defaultForm = () => ({
  title: '', message: '', imageUrl: '',
  targetType: 'all',
  discountPercent: 0,
  periodDiscounts: { 1: 0, 3: 3, 6: 5, 12: 15 },
  endsAt: defaultEndsAt(),
  showOnLanding: true,
  showInDashboard: true,
  isActive: true,
})

const form = reactive(defaultForm())

onMounted(load)

async function load() {
  banners.value = await bannersApi.getAll().then(r => r.data).catch(() => [])
}

function openForm(banner) {
  editing.value = banner ?? null
  formError.value = ''
  if (banner && banner.id) {
    Object.assign(form, {
      title:           banner.title           ?? '',
      message:         banner.message         ?? '',
      imageUrl:        banner.imageUrl        ?? '',
      targetType:      banner.targetType      ?? 'all',
      discountPercent: banner.discountPercent ?? 0,
      periodDiscounts: banner.periodDiscounts ? { ...banner.periodDiscounts } : { 1: 0, 3: 3, 6: 5, 12: 15 },
      endsAt:          banner.endsAt ? new Date(banner.endsAt).toISOString().slice(0, 16) : defaultEndsAt(),
      showOnLanding:   banner.showOnLanding   ?? true,
      showInDashboard: banner.showInDashboard ?? true,
      isActive:        banner.isActive        ?? true,
    })
  } else {
    Object.assign(form, defaultForm())
  }
  showForm.value = true
}

async function save() {
  if (!form.title || !form.message) {
    formError.value = t.value.errTitleMsg
    return
  }
  saving.value = true; formError.value = ''
  try {
    const payload = {
      title:           form.title,
      message:         form.message,
      imageUrl:        form.imageUrl,
      targetType:      form.targetType,
      discountPercent: form.discountPercent,
      periodDiscounts: { ...form.periodDiscounts },
      endsAt:          form.endsAt ? new Date(form.endsAt).toISOString() : null,
      showOnLanding:   form.showOnLanding,
      showInDashboard: form.showInDashboard,
      isActive:        form.isActive,
    }
    if (editing.value) {
      await bannersApi.update(editing.value.id, payload)
    } else {
      await bannersApi.create(payload)
    }
    await load()
    showForm.value = false
  } catch (e) {
    formError.value = e.response?.data?.message || 'Error'
  } finally { saving.value = false }
}

async function toggle(b) {
  await bannersApi.toggle(b.id)
  b.isActive = !b.isActive
}

async function remove(id) {
  if (!confirm(t.value.confirmDelete)) return
  await bannersApi.remove(id)
  banners.value = banners.value.filter(b => b.id !== id)
}

const t = useT(dict)
</script>

<style lang="scss" scoped>
.admin-banners { max-width: 920px; }
.page-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 20px; font-weight: 800; color: var(--text); }
}
.btn-new { padding: 10px 22px; background: var(--accent); color: #0a0a0b; border: none; border-radius: 10px; font-family: 'Montserrat',sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; &:hover { opacity: 0.9; } }

.banners-list { display: flex; flex-direction: column; gap: 12px; }
.banner-item {
  background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
  padding: 18px 20px; display: flex; gap: 16px; align-items: flex-start;
  transition: border-color 0.2s;
  &--inactive { opacity: 0.55; }
  &:hover { border-color: var(--border-2); }
  &__img { width: 90px; height: 56px; border-radius: 8px; overflow: hidden; flex-shrink: 0; img { width: 100%; height: 100%; object-fit: cover; } }
  &__body { flex: 1; min-width: 0; }
  &__title { font-family: 'Montserrat',sans-serif; font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__msg { font-size: 12px; color: var(--text-2); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  &__meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; color: var(--text-3); }
  &__status { font-size: 11px; font-weight: 700; margin-bottom: 3px; }
  &__actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
}
.status--on { color: #4ade80; }
.status--off { color: var(--text-3); }
.btn-toggle { padding: 7px 14px; border: 1px solid var(--border-2); background: var(--surface); color: var(--text-2); border-radius: 8px; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; &:hover { border-color: var(--accent); color: var(--accent); } }
.btn-icon { width: 34px; height: 34px; border: 1px solid var(--border); background: var(--surface); border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; &:hover { border-color: var(--border-2); } &--danger:hover { border-color: rgba(239,68,68,0.5); } }
.empty-state { padding: 48px; text-align: center; color: var(--text-3); font-size: 14px; background: var(--surface); border: 1px dashed var(--border); border-radius: 14px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px; overflow-y: auto; }
.modal-card {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px;
  padding: 32px; max-width: 560px; width: 100%; position: relative;
  h2 { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 24px; }
}
.modal-close { position: absolute; top: 16px; right: 18px; background: none; border: none; color: var(--text-3); font-size: 22px; cursor: pointer; line-height: 1; &:hover { color: var(--text); } }
.form-group { margin-bottom: 18px; label { display: block; font-size: 12px; font-weight: 600; color: var(--text-2); margin-bottom: 6px; letter-spacing: 0.3px; } }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field-hint { font-size: 11px; color: var(--text-3); margin-top: 4px; line-height: 1.5; }
.inp { width: 100%; padding: 11px 14px; background: var(--bg-3,#18181c); border: 1px solid var(--border-2); border-radius: 10px; color: var(--text); font-size: 14px; outline: none; font-family: inherit; transition: border-color 0.2s; &:focus { border-color: var(--accent); } &--ta { resize: vertical; min-height: 80px; line-height: 1.6; } &--xs { width: 56px; text-align: center; padding: 8px 6px; } }
.discounts-grid { display: flex; gap: 14px; flex-wrap: wrap; }
.disc-cell { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.disc-period { font-size: 11px; color: var(--text-3); font-weight: 700; font-family: 'Montserrat',sans-serif; }
.disc-inp-wrap { display: flex; align-items: center; gap: 4px; }
.disc-pct { font-size: 12px; color: var(--text-3); }
.img-preview { margin-top: 10px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border); img { width: 100%; max-height: 180px; object-fit: cover; display: block; } }
.form-checks { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
.check-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-2); cursor: pointer; input { accent-color: var(--accent); width: 15px; height: 15px; } }
.form-error { padding: 10px 14px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; font-size: 13px; color: #f87171; margin-bottom: 14px; }
.modal-actions { display: flex; gap: 10px; }
.btn-save { flex: 1; padding: 12px; background: var(--accent); color: #0a0a0b; border: none; border-radius: 10px; font-family: 'Montserrat',sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } }
.btn-cancel { padding: 12px 24px; border: 1px solid var(--border-2); background: transparent; color: var(--text-2); border-radius: 10px; font-size: 13px; cursor: pointer; transition: color 0.2s; &:hover { color: var(--text); } }
</style>
