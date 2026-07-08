<template>
  <div class="finances-page">
    <div class="finances-header">
      <h1>{{ t.title }}</h1>
    </div>

    <!-- Реферальный блок -->
    <div class="ref-block">
      <div class="ref-block__left">
        <div class="ref-label">{{ t.referralBalance }}</div>
        <div class="ref-balance">{{ referralInfo?.referralBalance?.toFixed(2) ?? '0.00' }} <span>USDT</span></div>
        <div class="ref-count">{{ t.referrals }}: <strong>{{ referralInfo?.referralsCount ?? 0 }}</strong></div>
        <button class="btn-withdraw" @click="showWithdrawHint = true">
          {{ t.withdraw }}
        </button>
        <div v-if="showWithdrawHint" class="withdraw-hint">
          {{ t.withdrawHint }}
          <router-link to="/dashboard/support">{{ t.toSupport }}</router-link>
        </div>
      </div>
      <div class="ref-block__right">
        <div class="ref-label">{{ t.yourLink }}</div>
        <div class="ref-link-box">
          <input readonly :value="referralLink" class="ref-link-input" />
          <button class="btn-copy" @click="copyLink">
            {{ copied ? '✓' : t.copy }}
          </button>
        </div>
        <div class="ref-code">{{ t.code }}: <strong>{{ referralInfo?.referralCode }}</strong></div>
      </div>
    </div>

    <!-- История начислений -->
    <div class="earnings-section">
      <h2>{{ t.earningsHistory }}</h2>
      <div v-if="!referralInfo?.earnings?.length" class="empty-state">
        {{ t.noEarnings }}
      </div>
      <div v-else class="earnings-table-wrap">
        <table class="earnings-table">
          <thead>
            <tr>
              <th>{{ t.date }}</th>
              <th>{{ t.amount }}</th>
              <th>{{ t.percent }}</th>
              <th>{{ t.type }}</th>
              <th>{{ t.note }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in referralInfo.earnings" :key="e.id">
              <td>{{ new Date(e.createdAt).toLocaleDateString() }}</td>
              <td class="td-amount">+{{ e.amount.toFixed(2) }} USDT</td>
              <td>{{ e.percent }}%</td>
              <td>{{ e.isManual ? t.manual : t.auto }}</td>
              <td>{{ e.note || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Транзакции -->
    <div class="transactions-section">
      <h2>{{ t.transactions }}</h2>
      <div v-if="!transactions.length" class="empty-state">{{ t.noTx }}</div>
      <div v-else class="tx-list">
        <div class="tx-item" v-for="tx in transactions" :key="tx.id">
          <div class="tx-item__left">
            <div class="tx-status" :class="`tx-status--${tx.status}`">{{ tx.status }}</div>
            <div class="tx-desc">{{ tx.description || tx.type }}</div>
          </div>
          <div class="tx-item__right">
            <div class="tx-amount">{{ tx.amount }} USDT</div>
            <div class="tx-date">{{ new Date(tx.createdAt).toLocaleDateString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { referralApi, subscriptionsApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/finances'

const referralInfo = ref(null)
const transactions = ref([])
const showWithdrawHint = ref(false)
const copied = ref(false)

const referralLink = computed(() => {
  if (!referralInfo.value?.referralCode) return ''
  return `${window.location.origin}/register?ref=${referralInfo.value.referralCode}`
})

onMounted(async () => {
  [referralInfo.value, transactions.value] = await Promise.all([
    referralApi.getMy().then(r => r.data).catch(() => null),
    subscriptionsApi.getMyTransactions().then(r => r.data).catch(() => []),
  ])
})

function copyLink() {
  navigator.clipboard.writeText(referralLink.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const t = useT(dict)
</script>

<style lang="scss" scoped>
.finances-page { max-width: 900px; }
.finances-header { margin-bottom: 24px; h1 { font-family: 'Montserrat',sans-serif; font-size: 24px; font-weight: 800; color: var(--text); } }

.ref-block {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 28px;
  margin-bottom: 32px;
}
.ref-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-3); margin-bottom: 8px; }
.ref-balance { font-family: 'Montserrat',sans-serif; font-size: 36px; font-weight: 800; color: var(--accent); margin-bottom: 6px; span { font-size: 16px; color: var(--text-3); } }
.ref-count { font-size: 13px; color: var(--text-2); margin-bottom: 20px; strong { color: var(--text); } }

.btn-withdraw { padding: 11px 24px; background: var(--accent); color: #0a0a0b; border: none; border-radius: 10px; font-family: 'Montserrat',sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; &:hover { opacity: 0.9; } }
.withdraw-hint { margin-top: 12px; font-size: 13px; color: var(--text-2); line-height: 1.6; a { color: var(--accent); text-decoration: none; &:hover { text-decoration: underline; } } }

.ref-link-box { display: flex; gap: 8px; margin-bottom: 8px; }
.ref-link-input { flex: 1; background: var(--bg-2); border: 1px solid var(--border-2); border-radius: 8px; padding: 10px 12px; font-size: 12px; color: var(--text-2); outline: none; }
.btn-copy { padding: 10px 16px; border: 1px solid var(--border-2); border-radius: 8px; background: var(--surface); color: var(--text-2); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; &:hover { color: var(--accent); border-color: var(--accent); } }
.ref-code { font-size: 13px; color: var(--text-2); strong { color: var(--accent); font-family: 'Montserrat',sans-serif; } }

.earnings-section,.transactions-section { margin-bottom: 32px; h2 { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 16px; } }
.empty-state { padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; text-align: center; font-size: 13px; color: var(--text-3); }

.earnings-table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid var(--border); }
.earnings-table { width: 100%; border-collapse: collapse; font-size: 13px; th { padding: 12px 16px; background: var(--bg-2); color: var(--text-3); font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; text-align: left; border-bottom: 1px solid var(--border); } td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-2); &:last-child { border-right: none; } } tr:last-child td { border-bottom: none; } }
.td-amount { color: var(--accent) !important; font-weight: 700; }

.tx-list { display: flex; flex-direction: column; gap: 8px; }
.tx-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; &__left { display: flex; gap: 12px; align-items: center; } &__right { text-align: right; } }
.tx-status { padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: var(--bg-2); color: var(--text-3); &--paid,&--paid_over,&--completed { background: rgba(34,197,94,0.1); color: #4ade80; } &--pending,&--process,&--check { background: rgba(249,155,11,0.1); color: #fbbf24; } &--fail,&--cancel { background: rgba(239,68,68,0.1); color: #f87171; } }
.tx-desc { font-size: 13px; color: var(--text-2); }
.tx-amount { font-family: 'Montserrat',sans-serif; font-size: 15px; font-weight: 700; color: var(--text); }
.tx-date { font-size: 12px; color: var(--text-3); }

@media (max-width: 640px) { .ref-block { grid-template-columns: 1fr; } }
</style>
