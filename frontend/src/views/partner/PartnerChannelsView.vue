<script setup>
import { ref, computed, onMounted } from 'vue'
import { partnersApi, paymentApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/partnerChannels'

const channels = ref([])
const loading = ref(true)

// Self-service connect
const showConnect = ref(false)
const form = ref({ name: '', asset: 'crypto', timeframe: 'M15', direction: 'both', durationMonths: 1 })
const monthly = ref(null)
const paying = ref(false)
const payUrl = ref('')
const connectErr = ref('')

// Template editor
const tplModal = ref(null)
const tplText = ref('')
const tplSaving = ref(false)

const SCALP = ['M1','M3','M5','M10']
const monthlyCalc = computed(() => {
  let base = 500
  if (form.value.asset === 'gold') base += 200
  if (SCALP.includes(form.value.timeframe)) base += 200
  return base
})
const periodDiscount = computed(() => ({ 1:0, 3:3, 6:5, 12:15 }[form.value.durationMonths] || 0))
const totalPrice = computed(() => +(monthlyCalc.value * form.value.durationMonths * (1 - periodDiscount.value/100)).toFixed(2))

onMounted(load)
async function load() {
  loading.value = true
  channels.value = await partnersApi.myChannels().then(r => r.data).catch(() => [])
  loading.value = false
}

const isActive = (c) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date())
const fmtDate = (d) => d ? new Date(d).toISOString().slice(0, 10) : '—'

async function payConnect() {
  if (!form.value.name) { connectErr.value = t.value.enterName; return }
  paying.value = true; connectErr.value = ''; payUrl.value = ''
  try {
    const { data } = await paymentApi.createChannelInvoice({ ...form.value })
    payUrl.value = data.paymentUrl
  } catch (e) {
    connectErr.value = e.response?.data?.message || 'Error'
  } finally { paying.value = false }
}

function openTpl(c) {
  tplModal.value = c
  tplText.value = c.messageTemplate || defaultTpl()
}
function defaultTpl() {
  return '{emoji} #{symbol} {direction}\n⏰ Timeframe: {timeframe}\n\n✅ Entry: {entry}\n\n🎯 Targets:\n{targets}\n\n⛔ Stop: {stop}'
}
async function saveTpl() {
  tplSaving.value = true
  try {
    await partnersApi.updateTemplate(tplModal.value.id, tplText.value)
    await load()
    tplModal.value = null
  } finally { tplSaving.value = false }
}

// Live preview: подставляем демо-значения в плейсхолдеры
const preview = computed(() => {
  const demo = {
    emoji: '🟢', symbol: 'BTCUSDT.P', direction: 'long', timeframe: 'M15',
    entry: '61000-60800', targets: '1) 61500\n2) 62000\n3) 62800', stop: '60200',
  }
  let out = tplText.value || ''
  for (const [k, v] of Object.entries(demo)) out = out.replaceAll(`{${k}}`, v)
  return out
})

const t = useT(dict)
</script>

<template>
  <div class="pch">
    <div class="pch-head">
      <div>
        <h1>{{ t.title }}</h1>
        <p>{{ t.sub }}</p>
      </div>
      <button class="pch-btn" @click="showConnect = !showConnect">{{ t.connect }}</button>
    </div>

    <!-- Self-service connect -->
    <div v-if="showConnect" class="pch-connect">
      <div class="pch-form">
        <label>{{ t.name }}<input v-model="form.name" type="text" /></label>
        <div class="pch-grid">
          <label>{{ t.asset }}
            <select v-model="form.asset">
              <option value="crypto">{{ t.crypto }}</option>
              <option value="forex">{{ t.forex }}</option>
              <option value="stocks">{{ t.stocks }}</option>
              <option value="gold">{{ t.gold }}</option>
            </select>
          </label>
          <label>{{ t.tf }}
            <select v-model="form.timeframe">
              <option>M1</option><option>M3</option><option>M5</option><option>M10</option>
              <option>M15</option><option>H1</option><option>H4</option>
            </select>
          </label>
          <label>{{ t.dir }}
            <select v-model="form.direction">
              <option value="both">{{ t.both }}</option><option value="long">Long</option><option value="short">Short</option>
            </select>
          </label>
          <label>{{ t.period }}
            <select v-model.number="form.durationMonths">
              <option :value="1">1 {{ t.mo }}</option>
              <option :value="3">3 {{ t.mo }}</option>
              <option :value="6">6 {{ t.mo }}</option>
              <option :value="12">12 {{ t.mo }}</option>
            </select>
          </label>
        </div>
        <div class="pch-total">
          <span>{{ monthlyCalc }} USDT/{{ t.mo }} × {{ form.durationMonths }}<span v-if="periodDiscount"> · −{{ periodDiscount }}%</span></span>
          <b>{{ t.total }}: {{ totalPrice }} USDT</b>
        </div>
        <p class="pch-after">{{ t.afterPay }}</p>
        <p v-if="connectErr" class="pch-err">{{ connectErr }}</p>
        <div class="pch-actions">
          <a v-if="payUrl" :href="payUrl" target="_blank" class="pch-btn">{{ t.payLink }} →</a>
          <button v-else class="pch-btn" :disabled="paying" @click="payConnect">{{ paying ? '…' : t.pay }}</button>
          <button class="pch-btn pch-btn--ghost" @click="showConnect = false">{{ t.cancel }}</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="pch-empty">{{ t.loading }}</div>
    <div v-else-if="!channels.length" class="pch-empty">{{ t.empty }}</div>

    <div v-else class="pch-cards">
      <div v-for="c in channels" :key="c.id" class="pch-card" :class="{ 'pch-card--off': !isActive(c) }">
        <div class="pch-card__top">
          <h3>{{ c.name }}</h3>
          <span class="pch-badge" :class="isActive(c) ? 'pch-badge--on' : 'pch-badge--off'">
            {{ isActive(c) ? t.active : t.inactive }}
          </span>
        </div>
        <div class="pch-meta"><span>{{ c.asset }}</span>·<span>{{ c.timeframe }}</span>·<span>{{ c.direction }}</span></div>
        <div class="pch-row"><span>{{ t.price }}</span><b>{{ c.price }} USDT</b></div>
        <div class="pch-row"><span>{{ t.until }}</span><b>{{ fmtDate(c.expiresAt) }}</b></div>
        <button class="pch-btn pch-btn--sm" @click="openTpl(c)">{{ t.tpl }}</button>
      </div>
    </div>

    <!-- Template editor -->
    <div v-if="tplModal" class="pch-overlay" @click.self="tplModal = null">
      <div class="pch-modal">
        <h2>{{ t.editTpl }} — {{ tplModal.name }}</h2>
        <p class="pch-hint">{{ t.tplHint }}</p>
        <div class="pch-tpl-grid">
          <textarea v-model="tplText" rows="12" class="pch-tpl-area"></textarea>
          <div class="pch-preview">
            <div class="pch-preview__label">{{ t.livePreview }}</div>
            <pre class="pch-preview__box">{{ preview }}</pre>
          </div>
        </div>
        <div class="pch-actions" style="margin-top:14px">
          <button class="pch-btn" :disabled="tplSaving" @click="saveTpl">{{ tplSaving ? '…' : t.save }}</button>
          <button class="pch-btn pch-btn--ghost" @click="tplModal = null">{{ t.cancel }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pch { padding: 4px; }
.pch-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 800; margin: 0; }
  p { color: var(--text-2); font-size: 13px; margin: 4px 0 0; } }
.pch-btn { background: var(--accent); color: #0a0a0b; border: none; border-radius: 9px; padding: 9px 16px; font-weight: 700; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-block;
  &:hover { opacity: .9; } &:disabled { opacity: .5; }
  &--ghost { background: transparent; color: var(--text-1); border: 1px solid var(--border, #333); }
  &--sm { padding: 6px 12px; font-size: 12px; margin-top: 10px; } }
.pch-connect { background: var(--bg-2); border: 1px solid var(--accent); border-radius: 14px; padding: 18px; margin-bottom: 18px; }
.pch-form { display: flex; flex-direction: column; gap: 12px;
  label { display: flex; flex-direction: column; gap: 5px; font-size: 12px; color: var(--text-2); font-weight: 600; }
  input, select { background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 8px; padding: 9px 11px; color: var(--text-1); font-size: 13px; &:focus { outline: none; border-color: var(--accent); } } }
.pch-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.pch-total { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-2); border-top: 1px solid var(--border, #2a2a30); padding-top: 12px;
  b { color: var(--accent); font-size: 16px; } }
.pch-after { font-size: 12px; color: var(--text-2); margin: 0; }
.pch-err { color: #e74c3c; font-size: 12px; margin: 0; }
.pch-actions { display: flex; gap: 10px; }
.pch-empty { color: var(--text-2); text-align: center; padding: 48px; font-size: 14px; }
.pch-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 16px; }
.pch-card { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; padding: 18px;
  &--off { opacity: .6; }
  &__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;
    h3 { font-family: 'Montserrat',sans-serif; font-size: 16px; font-weight: 800; margin: 0; } } }
.pch-badge { font-size: 9px; font-weight: 800; border-radius: 5px; padding: 3px 7px; white-space: nowrap;
  &--on { color: #1E8449; border: 1px solid #1E8449; }
  &--off { color: #B9770E; border: 1px solid #B9770E; } }
.pch-meta { color: var(--accent); font-size: 12px; font-weight: 600; margin: 8px 0; display: flex; gap: 6px; }
.pch-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-2); padding: 3px 0; b { color: var(--text-1); } }
.pch-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: flex-start; justify-content: center; padding: 40px 16px; z-index: 200; overflow-y: auto; }
.pch-modal { background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 16px; padding: 24px; width: 100%; max-width: 760px;
  h2 { font-family: 'Montserrat',sans-serif; font-size: 17px; font-weight: 800; margin: 0 0 6px; } }
.pch-hint { font-size: 11px; color: var(--text-2); margin: 0 0 14px; }
.pch-tpl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pch-tpl-area { background: var(--bg-2); border: 1px solid var(--border, #2a2a30); border-radius: 8px; padding: 12px; color: var(--text-1); font-family: monospace; font-size: 13px; resize: vertical; &:focus { outline: none; border-color: var(--accent); } }
.pch-preview { &__label { font-size: 11px; color: var(--text-2); margin-bottom: 6px; font-weight: 600; }
  &__box { background: #17212b; color: #fff; border-radius: 10px; padding: 14px; font-size: 13px; white-space: pre-wrap; word-break: break-word; min-height: 200px; margin: 0; font-family: inherit; } }
@media (max-width: 700px) { .pch-grid { grid-template-columns: 1fr 1fr; } .pch-tpl-grid { grid-template-columns: 1fr; } }
</style>
