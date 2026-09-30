<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { shopApi, subscriptionsApi, tvApi } from '@/api'
import { useT, tDb, lang, fmtDate, fmtDateTime } from '@/i18n'
import { track } from '@/utils/attribution'
import dict from '@/i18n/dicts/access'

const t = useT(dict)
const SUPPORT_URL = 'https://t.me/Agent_x_support'

const activePlan = ref(null)
const products = ref([])
const hasSupport = ref(false)
const loading = ref(true)

const route = useRoute()
const tvName = ref('')
const tvBusy = ref(false)
const tvError = ref('')
const confirmNick = ref('')
const requests = ref([])
const tvCard = ref(null)
const focusTv = ref(false)

const fill = (tpl, vars) => String(tpl || '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')
const isForever = (d) => d && new Date(d).getUTCFullYear() >= 2099
const untilLabel = (d) => (isForever(d) ? t.value.forever : fmtDate(d))

// Статус выдачи конкретного индикатора — по последней заявке, где он есть
function itemState(it) {
  for (const r of requests.value) {
    const item = (r.items || []).find((i) => i.productId === it.productId)
    if (!item) continue
    if (r.status === 'granted' && item.until && new Date(item.until) < new Date()) return { status: 'none' }
    return { status: r.status, req: r }
  }
  return { status: 'none' }
}
function stateLabel(st) {
  return { none: t.value.tvStNone, pending: t.value.tvStPending, granted: t.value.tvStGranted, not_found: t.value.tvStNotFound }[st] || ''
}
const needRequest = computed(() => indicators.value.some((it) => ['none', 'not_found'].includes(itemState(it).status)))
const pendingReq = computed(() => requests.value.find((r) => r.status === 'pending') || null)
const notFoundReq = computed(() => (requests.value[0]?.status === 'not_found' ? requests.value[0] : null))
const anyGranted = computed(() => indicators.value.some((it) => itemState(it).status === 'granted'))
const allGranted = computed(() => indicators.value.length > 0 && indicators.value.every((it) => itemState(it).status === 'granted'))
const grantedNick = computed(() => requests.value.find((r) => r.status === 'granted')?.tvUsername || '')

async function loadRequests() {
  try { requests.value = await tvApi.my().then((r) => r.data) } catch { requests.value = [] }
}

const showContact = ref(false)
const contactMsg = ref('')
const contactBusy = ref(false)
const contactSent = ref(false)
const chanRequested = ref({})
const instrument = ref({})
const scalpBusy = ref({})
const scalpSent = ref({})
const scalpInfo = ref({})

async function submitInstrument(it) {
  const val = (instrument.value[it.productId] || '').trim()
  if (!val) return
  scalpBusy.value[it.productId] = true
  try {
    await shopApi.instrumentRequest({ shopProductId: it.productId, instrument: val, language: lang.value })
    scalpSent.value[it.productId] = true
  } catch { /* ignore */ } finally { scalpBusy.value[it.productId] = false }
}

const indicators = computed(() => products.value.filter(p => p.type === 'indicator'))
const channels = computed(() => products.value.filter(p => p.type === 'signal_channel'))
const educations = computed(() => products.value.filter(p => p.type === 'education'))

onMounted(async () => {
  try {
    const d = await shopApi.getMyAccess().then(r => r.data)
    products.value = d.products || []
    hasSupport.value = !!d.hasSupport
    tvName.value = d.tvUsername || ''
  } catch { /* ignore */ }
  try { activePlan.value = await subscriptionsApi.getActivePlan().then(r => r.data) } catch { /* ignore */ }
  await loadRequests()
  loading.value = false
  // Пришли по кнопке «Получить Magnet Pro» — сразу показываем заявку
  if (route.query.focus === 'tv') {
    await nextTick()
    tvCard.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    focusTv.value = true
    setTimeout(() => { focusTv.value = false }, 2500)
  }
})

function daysLeft(date) {
  return Math.max(0, Math.ceil((new Date(date) - new Date()) / 86400000))
}

async function submitTv(confirm) {
  const val = (tvName.value || '').trim()
  if (!val) return
  tvBusy.value = true; tvError.value = ''
  try {
    const { data } = await tvApi.request({ tvUsername: val, confirm: !!confirm, lang: lang.value })
    if (data && data.ok === false && data.reason === 'profile_not_found') {
      confirmNick.value = data.tvUsername || val
      return
    }
    confirmNick.value = ''
    track('lead_magnet_request', { product: 'tradingview_access' })
    await loadRequests()
  } catch (e) {
    const m = String(e.response?.data?.message || '')
    tvError.value = m.includes('INVALID_USERNAME') ? t.value.tvInvalid
      : m.includes('ALREADY_GRANTED') ? t.value.tvAlready
      : t.value.errTv
  } finally { tvBusy.value = false }
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

    <!-- Активный тариф (объединено с подписками) -->
    <div v-if="activePlan" class="acc-plan" :class="'acc-plan--' + (activePlan.plan?.type || '').toLowerCase()">
      <div class="acc-plan__main">
        <span class="acc-plan__name">{{ tDb(activePlan.plan, 'name') }}</span>
        <span class="acc-plan__badge">● {{ t.subActive }}</span>
      </div>
      <div class="acc-plan__meta">
        <span>{{ t.subExpires }}: {{ fmtDate(activePlan.expiresAt) }} · {{ daysLeft(activePlan.expiresAt) }} {{ t.days }}</span>
        <span v-if="activePlan.plan?.isTrial" class="acc-plan__trial">{{ t.trialNote }}</span>
        <router-link class="acc-plan__hist" to="/dashboard/subscriptions">{{ t.subHistory }} →</router-link>
      </div>
    </div>
    <div v-else-if="!loading" class="acc-plan acc-plan--none">
      <span>{{ t.noSub }}</span>
      <router-link class="acc-btn acc-btn--primary" to="/dashboard/shop">{{ t.goShop }}</router-link>
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
      <!-- TradingView: заявка на доступ (выдаёт администратор вручную) -->
      <div v-if="indicators.length" id="tv" ref="tvCard" class="acc-card" :class="{ 'acc-card--focus': focusTv }">
        <div class="acc-card__name">{{ t.tvTitle }}</div>
        <ul class="acc-inds">
          <li v-for="it in indicators" :key="it.productId">
            <span class="acc-ind__name">✦ {{ tDb(it, 'name') }}</span>
            <span class="acc-ind__meta">
              <span class="tv-state" :class="'tv-state--' + itemState(it).status">{{ stateLabel(itemState(it).status) }}</span>
              <span class="acc-ind__until">{{ t.until }}: {{ untilLabel(it.expiresAt) }}</span>
              <a v-if="it.tradingViewUrl" class="acc-link" :href="it.tradingViewUrl" target="_blank" rel="noopener">{{ t.openTv }} →</a>
            </span>
          </li>
        </ul>

        <div v-if="pendingReq" class="acc-note acc-note--pending">
          {{ fill(t.tvPendingFull, { nick: pendingReq.tvUsername, time: fmtDateTime(pendingReq.createdAt) }) }}
        </div>
        <div v-if="notFoundReq && needRequest" class="acc-note acc-note--warn">
          {{ fill(t.tvNotFoundFull, { nick: notFoundReq.tvUsername }) }}
        </div>
        <div v-if="allGranted" class="acc-note acc-note--ok">
          {{ fill(t.tvGrantedFull, { nick: grantedNick }) }}
          <div class="acc-note__sub">{{ t.tvHowFind }}</div>
        </div>

        <div v-if="anyGranted && !allGranted" class="acc-note acc-note--ok">{{ t.tvHowFind }}</div>

        <template v-if="needRequest">
          <p class="acc-block__hint">{{ t.tvHint }}</p>
          <p class="acc-block__where">{{ t.tvWhere }}</p>
          <div class="acc-tv">
            <input id="tv-username" v-model="tvName" :placeholder="t.tvPh" class="acc-input" autocomplete="off" @keyup.enter="submitTv(false)" />
            <button class="acc-btn acc-btn--primary" :disabled="tvBusy" @click="submitTv(false)">
              {{ tvBusy ? '…' : t.tvSubmit }}
            </button>
          </div>
          <div v-if="confirmNick" class="acc-note acc-note--warn">
            {{ fill(t.tvProfileNotFound, { nick: confirmNick }) }}
            <div class="acc-note__actions">
              <button class="acc-btn acc-btn--primary" :disabled="tvBusy" @click="submitTv(true)">{{ t.tvConfirmSend }}</button>
              <button class="acc-btn acc-btn--ghost" @click="confirmNick = ''">{{ t.tvFix }}</button>
            </div>
          </div>
          <div v-if="tvError" class="acc-err">{{ tvError }}</div>
        </template>
        <p v-if="needRequest || pendingReq" class="acc-block__where acc-timing">{{ t.tvTiming }}</p>
      </div>

      <!-- Каналы: доступ в Telegram (по каждому) -->
      <div v-for="it in channels" :key="it.productId" class="acc-card">
        <div class="acc-card__top">
          <div class="acc-card__name">{{ tDb(it, 'name') }}</div>
          <div class="acc-card__until">{{ t.until }}: {{ untilLabel(it.expiresAt) }}</div>
        </div>

        <!-- Кастомная настройка (Скальпинг): ввод инструмента + поддержка -->
        <div v-if="it.customInstrument" class="acc-block">
          <div class="acc-block__title">
            {{ t.scalpTitle }}
            <span class="acc-q" @click="scalpInfo[it.productId] = !scalpInfo[it.productId]" title="?">?</span>
          </div>
          <p v-if="scalpInfo[it.productId]" class="acc-block__where">{{ t.scalpInfo }}</p>
          <p class="acc-block__hint">{{ t.scalpHint }}</p>
          <div class="acc-tv">
            <input v-model="instrument[it.productId]" :placeholder="t.scalpPh" class="acc-input" />
            <button class="acc-btn acc-btn--primary" :disabled="scalpBusy[it.productId]" @click="submitInstrument(it)">
              {{ scalpBusy[it.productId] ? '…' : t.scalpSend }}
            </button>
          </div>
          <div v-if="scalpSent[it.productId]" class="acc-ok">✓ {{ t.scalpSent }}</div>
          <a class="acc-btn acc-btn--tg" style="margin-top:12px" :href="SUPPORT_URL" target="_blank" rel="noopener">{{ t.supportBtn }}</a>
        </div>

        <!-- Обычный канал: вступил → статус; ещё нет → одноразовая ссылка -->
        <div v-else-if="it.inviteLink || it.joined" class="acc-block">
          <div class="acc-block__title">{{ t.tgTitle }}</div>
          <template v-if="it.joined">
            <div class="acc-ok">✓ {{ t.tgJoined }}</div>
            <p class="acc-block__hint" style="margin-top:8px">{{ t.tgJoinedHint }}</p>
          </template>
          <template v-else>
            <p class="acc-block__hint">{{ t.tgLinkHint }}</p>
            <a class="acc-btn acc-btn--tg" :href="it.inviteLink" target="_blank" rel="noopener">✈ {{ t.tgJoin }}</a>
          </template>
          <!-- Подсказка на случай проблем со ссылкой -->
          <div class="acc-help-note">
            <p>{{ t.tgHelp }}</p>
            <a class="acc-btn acc-btn--ghost acc-btn--sm" :href="SUPPORT_URL" target="_blank" rel="noopener">{{ t.supportBtn }}</a>
          </div>
        </div>

        <!-- Фолбэк: чат ещё не привязан — запрос доступа -->
        <div v-else class="acc-block">
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
.acc-plan { display: flex; flex-direction: column; gap: 8px; padding: 16px 18px; border-radius: 14px; border: 1px solid var(--border, #26262b); background: var(--bg-2); margin-bottom: 18px;
  &--pro { border-color: rgba(99,102,241,0.4); background: rgba(99,102,241,0.06); }
  &--elite { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.07); }
  &--none { flex-direction: row; align-items: center; justify-content: space-between; }
  &__main { display: flex; align-items: center; gap: 12px; }
  &__name { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; }
  &__badge { font-size: 12px; color: #1E9E5A; font-weight: 600; }
  &__meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; font-size: 13px; color: var(--text-2); }
  &__hist { color: var(--accent); text-decoration: none; margin-left: auto; } }
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
.acc-q { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; margin-left: 6px;
  border-radius: 50%; background: var(--accent); color: #0a0a0b; font-size: 11px; font-weight: 800; cursor: pointer; vertical-align: middle; }
.acc-block__hint { color: var(--text-2); font-size: 13px; margin: 0 0 8px; line-height: 1.5; }
.acc-block__where { color: var(--text-3); font-size: 12px; margin: 0 0 12px; line-height: 1.5;
  background: var(--bg-1, #131316); border-radius: 8px; padding: 10px 12px; }
.acc-tv { display: flex; gap: 10px; flex-wrap: wrap; }
.acc-input { flex: 1; min-width: 200px; background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30);
  border-radius: 10px; padding: 11px 14px; color: var(--text-1); font-size: 14px;
  &:focus { outline: none; border-color: var(--accent); } }
.acc-ok { color: #1E9E5A; font-size: 13px; margin-top: 10px; font-weight: 600; }
.acc-card--focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(201,168,76,.25); transition: box-shadow .3s; }
.acc-ind__name { font-weight: 600; }
.acc-ind__meta { display: inline-flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.acc-ind__until { color: var(--text-3); font-size: 12px; }
.tv-state { font-size: 11px; font-weight: 700; letter-spacing: .03em; text-transform: uppercase; padding: 3px 8px; border-radius: 999px;
  border: 1px solid var(--border, #2a2a30); color: var(--text-2); }
.tv-state--pending { color: #D9A11F; border-color: rgba(217,161,31,.5); }
.tv-state--granted { color: #1E9E5A; border-color: rgba(30,158,90,.5); }
.tv-state--not_found { color: #E5484D; border-color: rgba(229,72,77,.5); }
.acc-note { border-radius: 10px; padding: 12px 14px; font-size: 13px; line-height: 1.5; margin: 0 0 12px; border: 1px solid var(--border, #2a2a30); }
.acc-note--pending { border-color: rgba(217,161,31,.45); }
.acc-note--ok { border-color: rgba(30,158,90,.45); }
.acc-note--warn { border-color: rgba(229,72,77,.45); }
.acc-note__sub { color: var(--text-2); margin-top: 6px; }
.acc-note__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
.acc-timing { margin-top: 12px; margin-bottom: 0; }
.acc-plan__trial { display: block; width: 100%; color: var(--text-2); font-size: 12px; margin-top: 4px; }
.acc-err { color: #E5484D; font-size: 13px; margin-top: 8px; }
.acc-link { display: inline-block; margin-top: 12px; color: var(--accent); font-size: 13px; text-decoration: none; }
.acc-help-note { margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--border-2, #33333a);
  p { font-size: 12px; color: var(--text-2); margin: 0 0 8px; line-height: 1.5; } }
.acc-btn--sm { padding: 7px 14px !important; font-size: 12px !important; }
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
