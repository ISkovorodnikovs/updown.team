<script setup>
import { ref, onMounted, computed } from 'vue'
import { shopApi } from '@/api'
import { useT, tDb, lang, fmtDate } from '@/i18n'
import dict from '@/i18n/dicts/access'

const t = useT(dict)
const SUPPORT_URL = 'https://t.me/Agent_x_support'

const products = ref([])
const hasSupport = ref(false)
const loading = ref(true)

const tvName = ref('')
const tvBusy = ref(false)
const tvSaved = ref(false)
const tvError = ref('')

const showContact = ref(false)
const contactMsg = ref('')
const contactBusy = ref(false)
const contactSent = ref(false)
const chanRequested = ref({})

const indicators = computed(() => products.value.filter(p => p.type === 'indicator'))
const channels = computed(() => products.value.filter(p => p.type === 'signal_channel'))
const educations = computed(() => products.value.filter(p => p.type === 'education'))

onMounted(async () => {
  try {
    const d = await shopApi.getMyAccess().then(r => r.data)
    products.value = d.products || []
    hasSupport.value = !!d.hasSupport
    tvName.value = d.tvUsername || ''
    tvSaved.value = !!d.tvUsername
  } catch { /* ignore */ }
  loading.value = false
})

async function submitTv() {
  const val = (tvName.value || '').trim()
  if (!val) return
  tvBusy.value = true; tvError.value = ''
  try {
    await shopApi.setTvUsername({ tvUsername: val, language: lang.value })
    tvSaved.value = true
  } catch { tvError.value = t.value.errTv } finally { tvBusy.value = false }
}

async function requestChannel(it) {
  try {
    await shopApi.contactRequest({ message: `Запрос доступа к каналу: ${it.name}`, language: lang.value })
    chanRequested.value[it.productId] = true
  } catch { /* ignore */ }
}

async function sendContact() {
  contactBusy.value = true
  try {
    await shopApi.contactRequest({ message: contactMsg.value, language: lang.value })
    contactSent.value = true; contactMsg.value = ''
    setTimeout(() => { showContact.value = false; contactSent.value = false }, 1800)
  } catch { /* ignore */ } finally { contactBusy.value = false }
}
</script>

<template>
  <div class="acc">
    <div class="acc-head">
      <h1>{{ t.title }}</h1>
      <p>{{ t.sub }}</p>
    </div>

    <!-- Общие действия -->
    <div class="acc-actions">
      <div class="acc-help">{{ t.needHelp }}</div>
      <button class="acc-btn acc-btn--ghost" @click="showContact = true">{{ t.contactBtn }}</button>
      <a v-if="hasSupport" class="acc-btn acc-btn--tg" :href="SUPPORT_URL" target="_blank" rel="noopener">{{ t.supportBtn }}</a>
    </div>

    <div v-if="loading" class="acc-empty">{{ t.loading }}</div>
    <div v-else-if="!products.length" class="acc-empty">
      {{ t.empty }}
      <router-link class="acc-btn acc-btn--primary" to="/dashboard/shop">{{ t.goShop }}</router-link>
    </div>

    <template v-else>
      <!-- TradingView: одно имя на все индикаторы -->
      <div v-if="indicators.length" class="acc-card">
        <div class="acc-card__name">{{ t.tvTitle }}</div>
        <p class="acc-block__hint">{{ t.tvHint }}</p>
        <p class="acc-block__where">{{ t.tvWhere }}</p>
        <ul class="acc-inds">
          <li v-for="it in indicators" :key="it.productId">
            <span>✦ {{ tDb(it, 'name') }}</span>
            <a v-if="it.tradingViewUrl" class="acc-link" :href="it.tradingViewUrl" target="_blank" rel="noopener">{{ t.openTv }} →</a>
          </li>
        </ul>
        <div class="acc-tv">
          <input v-model="tvName" :placeholder="t.tvPh" class="acc-input" />
          <button class="acc-btn acc-btn--primary" :disabled="tvBusy" @click="submitTv">
            {{ tvBusy ? '…' : (tvSaved ? t.tvChange : t.tvSubmit) }}
          </button>
        </div>
        <div v-if="tvSaved" class="acc-ok">✓ {{ t.tvPending }}</div>
        <div v-if="tvError" class="acc-err">{{ tvError }}</div>
      </div>

      <!-- Каналы: доступ в Telegram (по каждому) -->
      <div v-for="it in channels" :key="it.productId" class="acc-card">
        <div class="acc-card__top">
          <div class="acc-card__name">{{ tDb(it, 'name') }}</div>
          <div class="acc-card__until">{{ t.until }}: {{ fmtDate(it.expiresAt) }}</div>
        </div>
        <div class="acc-block">
          <div class="acc-block__title">{{ t.tgTitle }}</div>
          <p class="acc-block__hint">{{ t.tgHint }}</p>
          <button class="acc-btn acc-btn--tg" :disabled="chanRequested[it.productId]" @click="requestChannel(it)">
            {{ chanRequested[it.productId] ? '✓' : t.tgRequest }}
          </button>
        </div>
      </div>

      <!-- Обучение -->
      <div v-if="educations.length" class="acc-card">
        <div class="acc-card__name">{{ t.eduTitle }}</div>
        <p class="acc-block__hint">{{ t.eduHint }}</p>
        <router-link class="acc-btn acc-btn--ghost" to="/dashboard/education">{{ t.eduOpen }}</router-link>
      </div>
    </template>

    <!-- Модалка «связаться» -->
    <div v-if="showContact" class="acc-overlay" @click.self="showContact = false">
      <div class="acc-modal">
        <h2>{{ t.contactTitle }}</h2>
        <p class="acc-modal__hint">{{ t.contactHint }}</p>
        <div v-if="contactSent" class="acc-ok">✓ {{ t.contactSent }}</div>
        <template v-else>
          <textarea v-model="contactMsg" :placeholder="t.contactPh" rows="4"></textarea>
          <div class="acc-modal__actions">
            <button class="acc-btn acc-btn--ghost" @click="showContact = false">{{ t.cancel }}</button>
            <button class="acc-btn acc-btn--primary" :disabled="contactBusy" @click="sendContact">{{ contactBusy ? '…' : t.send }}</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.acc { padding: 4px; max-width: 900px; }
.acc-head { margin-bottom: 18px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 26px; font-weight: 800; margin: 0; }
  p { color: var(--text-2); font-size: 14px; margin: 6px 0 0; } }
.acc-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 22px;
  padding: 14px 16px; background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; }
.acc-help { font-weight: 700; font-size: 14px; margin-right: auto; }
.acc-empty { color: var(--text-2); text-align: center; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.acc-list { display: flex; flex-direction: column; gap: 16px; }
.acc-card { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 16px; padding: 20px; }
.acc-card__top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.acc-card__name { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; }
.acc-card__until { font-size: 13px; color: var(--text-2); }
.acc-inds { list-style: none; padding: 0; margin: 10px 0 14px; display: flex; flex-direction: column; gap: 8px;
  li { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 14px; flex-wrap: wrap; }
  .acc-link { margin: 0; } }
.acc-block { border-top: 1px solid var(--border, #2a2a30); padding-top: 14px; }
.acc-block__title { font-weight: 700; font-size: 14px; margin-bottom: 6px; }
.acc-block__hint { color: var(--text-2); font-size: 13px; margin: 0 0 8px; line-height: 1.5; }
.acc-block__where { color: var(--text-3); font-size: 12px; margin: 0 0 12px; line-height: 1.5;
  background: var(--bg-1, #131316); border-radius: 8px; padding: 10px 12px; }
.acc-tv { display: flex; gap: 10px; flex-wrap: wrap; }
.acc-input { flex: 1; min-width: 200px; background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30);
  border-radius: 10px; padding: 11px 14px; color: var(--text-1); font-size: 14px;
  &:focus { outline: none; border-color: var(--accent); } }
.acc-ok { color: #1E9E5A; font-size: 13px; margin-top: 10px; font-weight: 600; }
.acc-err { color: #E5484D; font-size: 13px; margin-top: 8px; }
.acc-link { display: inline-block; margin-top: 12px; color: var(--accent); font-size: 13px; text-decoration: none; }
.acc-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer;
  border-radius: 10px; padding: 11px 18px; font-weight: 700; font-size: 14px; text-decoration: none; transition: opacity .15s;
  &:hover { opacity: .9; } &:disabled { opacity: .6; cursor: default; }
  &--primary { background: var(--accent); color: #0a0a0b; }
  &--ghost { background: transparent; color: var(--text-1); border: 1px solid var(--border, #333); }
  &--tg { background: #229ED9; color: #fff; } }
.acc-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: flex-start; justify-content: center; padding: 60px 16px; z-index: 200; }
.acc-modal { background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 16px; padding: 24px; width: 100%; max-width: 440px;
  h2 { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; margin: 0 0 6px; }
  &__hint { font-size: 13px; color: var(--text-2); margin: 0 0 14px; }
  textarea { width: 100%; background: var(--bg-2); border: 1px solid var(--border, #2a2a30); border-radius: 10px; padding: 11px 14px; color: var(--text-1); font-size: 14px; font-family: inherit; resize: vertical;
    &:focus { outline: none; border-color: var(--accent); } }
  &__actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 14px; } }
</style>
