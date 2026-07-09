<script setup>
import { ref, onMounted, computed } from 'vue'
import { shopApi } from '@/api'
import { useT, tDb, lang, fmtDate } from '@/i18n'
import dict from '@/i18n/dicts/access'

const t = useT(dict)
const SUPPORT_URL = 'https://t.me/Agent_x_support'

const items = ref([])
const loading = ref(true)
const tvInput = ref({})       // productId -> string
const tvBusy = ref({})        // productId -> bool
const tvError = ref({})       // productId -> string

const showContact = ref(false)
const contactMsg = ref('')
const contactBusy = ref(false)
const contactSent = ref(false)

onMounted(async () => {
  items.value = await shopApi.getMy().then(r => r.data).catch(() => [])
  for (const it of items.value) if (it.tvUsername) tvInput.value[it.productId] = it.tvUsername
  loading.value = false
})

const isIndicator = (it) => it.type === 'indicator'
const isChannel = (it) => it.type === 'signal_channel'
const isEducation = (it) => it.type === 'education'

async function submitTv(it) {
  const val = (tvInput.value[it.productId] || '').trim()
  if (!val) return
  tvBusy.value[it.productId] = true
  tvError.value[it.productId] = ''
  try {
    await shopApi.setTvUsername({ shopProductId: it.productId, tvUsername: val, language: lang.value })
    it.tvUsername = val
  } catch (e) {
    tvError.value[it.productId] = t.value.errTv
  } finally {
    tvBusy.value[it.productId] = false
  }
}

async function requestChannel(it) {
  // канал: запрос доступа = сообщение в админ-чат (пока выдаём вручную)
  try {
    await shopApi.contactRequest({ message: `Запрос доступа к каналу: ${it.name}`, language: lang.value })
    it._requested = true
  } catch { /* ignore */ }
}

async function sendContact() {
  contactBusy.value = true
  try {
    await shopApi.contactRequest({ message: contactMsg.value, language: lang.value })
    contactSent.value = true
    contactMsg.value = ''
    setTimeout(() => { showContact.value = false; contactSent.value = false }, 1800)
  } catch { /* ignore */ } finally {
    contactBusy.value = false
  }
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
      <a class="acc-btn acc-btn--tg" :href="SUPPORT_URL" target="_blank" rel="noopener">{{ t.supportBtn }}</a>
    </div>

    <div v-if="loading" class="acc-empty">{{ t.loading }}</div>
    <div v-else-if="!items.length" class="acc-empty">
      {{ t.empty }}
      <router-link class="acc-btn acc-btn--primary" to="/dashboard/shop">{{ t.goShop }}</router-link>
    </div>

    <div v-else class="acc-list">
      <div v-for="it in items" :key="it.id" class="acc-card">
        <div class="acc-card__top">
          <div class="acc-card__name">{{ tDb(it, 'name') }}</div>
          <div class="acc-card__until">{{ t.until }}: {{ fmtDate(it.expiresAt) }}</div>
        </div>

        <!-- Индикатор: ввод TradingView username -->
        <div v-if="isIndicator(it)" class="acc-block">
          <div class="acc-block__title">{{ t.tvTitle }}</div>
          <p class="acc-block__hint">{{ t.tvHint }}</p>
          <p class="acc-block__where">{{ t.tvWhere }}</p>
          <div class="acc-tv">
            <input v-model="tvInput[it.productId]" :placeholder="t.tvPh" class="acc-input" />
            <button class="acc-btn acc-btn--primary" :disabled="tvBusy[it.productId]" @click="submitTv(it)">
              {{ tvBusy[it.productId] ? '…' : (it.tvUsername ? t.tvChange : t.tvSubmit) }}
            </button>
          </div>
          <div v-if="it.tvUsername" class="acc-ok">✓ {{ t.tvPending }}</div>
          <div v-if="tvError[it.productId]" class="acc-err">{{ tvError[it.productId] }}</div>
          <a v-if="it.tradingViewUrl" class="acc-link" :href="it.tradingViewUrl" target="_blank" rel="noopener">{{ t.openTv }} →</a>
        </div>

        <!-- Канал: доступ в Telegram -->
        <div v-else-if="isChannel(it)" class="acc-block">
          <div class="acc-block__title">{{ t.tgTitle }}</div>
          <p class="acc-block__hint">{{ t.tgHint }}</p>
          <button class="acc-btn acc-btn--tg" :disabled="it._requested" @click="requestChannel(it)">
            {{ it._requested ? '✓' : t.tgRequest }}
          </button>
        </div>

        <!-- Обучение -->
        <div v-else-if="isEducation(it)" class="acc-block">
          <div class="acc-block__title">{{ t.eduTitle }}</div>
          <p class="acc-block__hint">{{ t.eduHint }}</p>
          <router-link class="acc-btn acc-btn--ghost" to="/dashboard/education">{{ t.eduOpen }}</router-link>
        </div>
      </div>
    </div>

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
