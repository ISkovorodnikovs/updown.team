<script setup>
import { ref, computed, onMounted } from 'vue'
import { botsApi, referralApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const lang = computed(() => localStorage.getItem('ud-lang') || 'en')
const bot = ref(null)
const ref_ = ref(null)
const loading = ref(true)

onMounted(async () => {
  const [b, r] = await Promise.all([
    botsApi.getMyBot().then(x => x.data).catch(() => null),
    referralApi.getMy().then(x => x.data).catch(() => null),
  ])
  bot.value = b
  ref_.value = r
  loading.value = false
})

const refLink = computed(() => {
  const code = ref_.value?.referralCode || auth.user?.referralCode
  return code ? `${window.location.origin}/register?ref=${code}` : ''
})

function copyLink() {
  if (refLink.value) navigator.clipboard?.writeText(refLink.value)
}

const t = computed(() => {
  const r = lang.value === 'ru'
  return {
    title: r ? 'Аффилиат' : 'Affiliate',
    sub: r ? 'Ваша партнёрская статистика и реферальная программа' : 'Your partner stats and referral program',
    botStats: r ? 'Статистика бота' : 'Bot Stats',
    users: r ? 'Пользователей' : 'Users',
    clicks: r ? 'Кликов' : 'Clicks',
    conversion: r ? 'Конверсия' : 'Conversion',
    noBot: r ? 'Бот не подключён.' : 'No bot connected.',
    setupBot: r ? 'Настроить бота' : 'Set up bot',
    refProgram: r ? 'Реферальная программа' : 'Referral Program',
    refLink: r ? 'Ваша реферальная ссылка' : 'Your referral link',
    copy: r ? 'Копировать' : 'Copy',
    balance: r ? 'Реферальный баланс' : 'Referral balance',
    invited: r ? 'Приглашено' : 'Invited',
    loading: r ? 'Загрузка…' : 'Loading…',
  }
})
</script>

<template>
  <div class="aff">
    <div class="aff-head">
      <h1>{{ t.title }}</h1>
      <p>{{ t.sub }}</p>
    </div>

    <div v-if="loading" class="aff-empty">{{ t.loading }}</div>

    <template v-else>
      <!-- Bot stats -->
      <div class="aff-card">
        <h3>{{ t.botStats }}</h3>
        <div v-if="bot" class="aff-stats">
          <div class="aff-stat"><div class="aff-stat__v">{{ bot.totalUsers ?? 0 }}</div><div class="aff-stat__l">{{ t.users }}</div></div>
          <div class="aff-stat"><div class="aff-stat__v">{{ bot.totalClicks ?? 0 }}</div><div class="aff-stat__l">{{ t.clicks }}</div></div>
          <div class="aff-stat"><div class="aff-stat__v">{{ bot.conversion ?? 0 }}%</div><div class="aff-stat__l">{{ t.conversion }}</div></div>
        </div>
        <div v-else class="aff-nobot">
          <p>{{ t.noBot }}</p>
          <router-link to="/dashboard/partner/bot" class="aff-btn">{{ t.setupBot }}</router-link>
        </div>
      </div>

      <!-- Referral -->
      <div class="aff-card">
        <h3>{{ t.refProgram }}</h3>
        <div class="aff-stats">
          <div class="aff-stat"><div class="aff-stat__v">{{ ref_?.referralBalance ?? 0 }} USDT</div><div class="aff-stat__l">{{ t.balance }}</div></div>
          <div class="aff-stat"><div class="aff-stat__v">{{ ref_?.referralsCount ?? 0 }}</div><div class="aff-stat__l">{{ t.invited }}</div></div>
        </div>
        <div v-if="refLink" class="aff-link">
          <label>{{ t.refLink }}</label>
          <div class="aff-link__row">
            <input :value="refLink" readonly />
            <button class="aff-btn" @click="copyLink">{{ t.copy }}</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.aff { padding: 4px; }
.aff-head { margin-bottom: 20px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 800; margin: 0; }
  p { color: var(--text-2); font-size: 13px; margin: 4px 0 0; } }
.aff-empty { color: var(--text-2); text-align: center; padding: 48px; }
.aff-card { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; padding: 20px; margin-bottom: 16px;
  h3 { font-family: 'Montserrat',sans-serif; font-size: 15px; font-weight: 800; margin: 0 0 14px; } }
.aff-stats { display: flex; gap: 28px; flex-wrap: wrap; }
.aff-stat { &__v { font-size: 24px; font-weight: 800; color: var(--accent); } &__l { font-size: 12px; color: var(--text-2); margin-top: 2px; } }
.aff-nobot { p { color: var(--text-2); font-size: 13px; margin: 0 0 12px; } }
.aff-btn { display: inline-block; background: var(--accent); color: #0a0a0b; border: none; border-radius: 8px; padding: 9px 16px; font-weight: 700; font-size: 13px; cursor: pointer; text-decoration: none; &:hover { opacity: .9; } }
.aff-link { margin-top: 16px;
  label { font-size: 12px; color: var(--text-2); display: block; margin-bottom: 6px; }
  &__row { display: flex; gap: 8px;
    input { flex: 1; background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 8px; padding: 9px 11px; color: var(--text-1); font-size: 12px; } } }
@media (max-width: 600px) { .aff-link__row { flex-direction: column; } }
</style>
