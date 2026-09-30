<template>
  <div class="botcheck">
    <div class="bc-head">
      <h1>{{ t.title }}</h1>
      <button class="btn btn--accent btn--sm" :disabled="loading" @click="load">{{ loading ? '…' : t.recheck }}</button>
    </div>
    <p class="bc-sub">{{ t.sub }}</p>

    <div v-if="error" class="alert alert--error">{{ error }}</div>

    <div class="bc-list">
      <div v-for="c in rows" :key="c.chatId" class="bc-card" :class="c.ok ? 'is-ok' : 'is-bad'">
        <div class="bc-top">
          <span class="bc-state">{{ c.ok ? '✅' : '⚠️' }}</span>
          <span class="bc-title">{{ c.title || t.noTitle }}</span>
          <code class="bc-id">{{ c.chatId }}</code>
        </div>
        <div class="bc-used">{{ t.usedBy }}: {{ c.usedBy.join(', ') }}</div>
        <div class="bc-facts">
          <span>{{ t.status }}: <b>{{ c.status || '—' }}</b></span>
          <span>{{ t.invite }}: <b>{{ c.canInvite ? t.yes : t.no }}</b></span>
          <span>{{ t.restrict }}: <b>{{ c.canRestrict ? t.yes : t.no }}</b></span>
        </div>
        <div v-if="c.error" class="bc-err">{{ c.error }}</div>
        <div v-else-if="!c.ok" class="bc-err">{{ t.fix }}</div>
      </div>
    </div>

    <h2 class="bc-h2">{{ t.freeTitle }}</h2>
    <div v-if="free" class="bc-card">
      <div>{{ t.trialPlan }}: <b>{{ free.trialPlan ? free.trialPlan.name : t.notSet }}</b>
        <span v-if="free.trialPlan"> · {{ t.products }}: {{ free.trialPlan.includedProductIds.length }}</span></div>
      <div>{{ t.forever }}: <b>{{ free.forever.length ? free.forever.map(p => p.name).join(', ') : t.notSet }}</b></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api'
import { useT } from '@/i18n'

const dict = {
  en: {
    title: 'Bot check', recheck: 'Check again',
    sub: 'The bot must be an administrator with the rights to invite users and ban users in every group used for access. In the admin group it only needs to be a member.',
    noTitle: 'Chat not available', usedBy: 'Used by', status: 'Bot status', invite: 'Invite via link', restrict: 'Ban users',
    yes: 'yes', no: 'no', fix: 'Make the bot an administrator with both rights enabled.',
    freeTitle: 'Free access setup', trialPlan: 'FREE plan (7 days)', products: 'products', forever: 'Free with no expiration', notSet: 'not configured',
  },
  ru: {
    title: 'Проверка бота', recheck: 'Проверить ещё раз',
    sub: 'Во всех группах, куда выдаётся доступ, бот должен быть администратором с правами «Приглашать через ссылку» и «Блокировать пользователей». В админ-группе достаточно быть участником.',
    noTitle: 'Чат недоступен', usedBy: 'Используется', status: 'Статус бота', invite: 'Приглашать по ссылке', restrict: 'Блокировать',
    yes: 'да', no: 'нет', fix: 'Сделайте бота администратором и включите оба права.',
    freeTitle: 'Настройка бесплатного доступа', trialPlan: 'Тариф FREE (7 дней)', products: 'товаров', forever: 'Бесплатно навсегда', notSet: 'не настроено',
  },
}
const t = useT(dict)
const rows = ref([])
const free = ref(null)
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true; error.value = ''
  try {
    const [a, b] = await Promise.all([adminApi.botCheck(), adminApi.freeConfig()])
    rows.value = a.data; free.value = b.data
  } catch (e) { error.value = e.response?.data?.message || e.message } finally { loading.value = false }
}
onMounted(load)
</script>

<style lang="scss" scoped>
.botcheck { max-width: 900px; }
.bc-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  h1 { font-size: 20px; font-weight: 800; margin: 0; } }
.bc-sub { color: var(--text-2); font-size: 13px; line-height: 1.5; margin: 8px 0 18px; max-width: 70ch; }
.bc-list { display: grid; gap: 12px; }
.bc-card { background: var(--bg-2); border: 1px solid var(--border, #2a2a30); border-radius: 14px; padding: 16px; display: grid; gap: 8px; font-size: 14px; }
.bc-card.is-bad { border-color: rgba(229,72,77,.5); }
.bc-card.is-ok { border-color: rgba(30,158,90,.35); }
.bc-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.bc-title { font-weight: 700; }
.bc-id { font-size: 12px; color: var(--text-3); }
.bc-used { color: var(--text-2); font-size: 13px; }
.bc-facts { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; color: var(--text-2); }
.bc-err { color: #E5484D; font-size: 13px; }
.bc-h2 { font-size: 16px; margin: 28px 0 12px; }
</style>
