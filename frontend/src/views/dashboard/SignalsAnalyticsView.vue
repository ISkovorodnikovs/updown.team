<script setup>
import { ref, computed, onMounted } from 'vue'
import { analyticsApi, partnersApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/signalsAnalytics'

const auth = useAuthStore()
const isAdmin = computed(() => auth.isAdmin || auth.isOwner)

const myChannels = ref([])
const selectedChannelId = ref('')
const adminChannelId = ref('')      // admin: free input
const report = ref(null)
const loading = ref(false)
const error = ref('')

const today = new Date()
const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
const from = ref(monthAgo.toISOString().slice(0, 10))
const to = ref(today.toISOString().slice(0, 10))

onMounted(async () => {
  // Партнёр выбирает из своих каналов; админ может и из списка, и ввести вручную
  myChannels.value = await partnersApi.myChannels().then(r => r.data).catch(() => [])
  const withId = myChannels.value.filter(c => c.signalsChannelId)
  if (withId.length) selectedChannelId.value = withId[0].signalsChannelId
})

async function run() {
  error.value = ''; report.value = null
  const channelId = isAdmin.value && adminChannelId.value
    ? adminChannelId.value.trim()
    : selectedChannelId.value
  if (!channelId) { error.value = t.value.selectChannel; return }
  loading.value = true
  try {
    const fromIso = new Date(from.value).toISOString()
    const toIso = new Date(to.value + 'T23:59:59').toISOString()
    const call = (isAdmin.value && adminChannelId.value)
      ? analyticsApi.adminReport(channelId, fromIso, toIso)
      : analyticsApi.myReport(channelId, fromIso, toIso)
    const { data } = await call
    report.value = data
  } catch (e) {
    error.value = e.response?.data?.message
      ? (Array.isArray(e.response.data.message) ? e.response.data.message.join(', ') : e.response.data.message)
      : 'Error'
  } finally { loading.value = false }
}

// SVG-график нарастающего депозита (без внешних библиотек)
const chart = computed(() => {
  const rows = report.value?.tableRows || []
  if (rows.length < 2) return null
  const w = 640, h = 200, pad = 8
  const deps = rows.map(r => r.deposit)
  const min = Math.min(...deps), max = Math.max(...deps)
  const range = max - min || 1
  const pts = deps.map((d, i) => {
    const x = pad + (i / (deps.length - 1)) * (w - pad * 2)
    const y = h - pad - ((d - min) / range) * (h - pad * 2)
    return [x, y]
  })
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${h - pad} L${pts[0][0].toFixed(1)},${h - pad} Z`
  return { w, h, line, area, first: deps[0], last: deps[deps.length - 1] }
})

const t = useT(dict)

function fmt(d) { return d ? new Date(d).toISOString().slice(0, 16).replace('T', ' ') : '—' }
</script>

<template>
  <div class="an">
    <div class="an-head">
      <h1>{{ t.title }}</h1>
      <p>{{ t.sub }}</p>
    </div>

    <!-- Controls -->
    <div class="an-controls">
      <div class="an-field">
        <label>{{ t.channel }}</label>
        <select v-model="selectedChannelId" :disabled="isAdmin && !!adminChannelId">
          <option v-for="c in myChannels.filter(x => x.signalsChannelId)" :key="c.id" :value="c.signalsChannelId">
            {{ c.name }} ({{ c.asset }}/{{ c.timeframe }})
          </option>
        </select>
      </div>
      <div class="an-field" v-if="isAdmin">
        <label>{{ t.adminInput }}</label>
        <input v-model="adminChannelId" placeholder="channelId" />
      </div>
      <div class="an-field">
        <label>{{ t.from }}</label>
        <input type="date" v-model="from" />
      </div>
      <div class="an-field">
        <label>{{ t.to }}</label>
        <input type="date" v-model="to" />
      </div>
      <button class="an-btn" :disabled="loading" @click="run">{{ loading ? '…' : t.run }}</button>
    </div>
    <p v-if="!isAdmin" class="an-hint">{{ t.note3m }}</p>
    <p v-if="!myChannels.filter(x => x.signalsChannelId).length && !isAdmin" class="an-hint">{{ t.noChannels }}</p>
    <p v-if="error" class="an-err">{{ error }}</p>

    <!-- Report -->
    <template v-if="report">
      <div class="an-stats">
        <div class="an-stat"><div class="an-stat__v">{{ report.stats.totalDeals }}</div><div class="an-stat__l">{{ t.deals }}</div></div>
        <div class="an-stat"><div class="an-stat__v an-pos">{{ report.stats.closedProfit }}</div><div class="an-stat__l">{{ t.win }}</div></div>
        <div class="an-stat"><div class="an-stat__v an-neg">{{ report.stats.closedLoss }}</div><div class="an-stat__l">{{ t.loss }}</div></div>
        <div class="an-stat"><div class="an-stat__v">{{ report.stats.winLossRatio ?? '—' }}</div><div class="an-stat__l">{{ t.wl }}</div></div>
        <div class="an-stat"><div class="an-stat__v">{{ report.stats.longCount }}/{{ report.stats.shortCount }}</div><div class="an-stat__l">{{ t.long }}/{{ t.short }}</div></div>
        <div class="an-stat"><div class="an-stat__v" :class="report.stats.roi >= 0 ? 'an-pos' : 'an-neg'">{{ report.stats.roi }}%</div><div class="an-stat__l">{{ t.roi }}</div></div>
        <div class="an-stat"><div class="an-stat__v" :class="report.stats.pnl >= 0 ? 'an-pos' : 'an-neg'">{{ report.stats.pnl }}%</div><div class="an-stat__l">{{ t.pnl }}</div></div>
        <div class="an-stat"><div class="an-stat__v">{{ report.stats.finalDeposit }}</div><div class="an-stat__l">{{ t.deposit }}</div></div>
      </div>

      <!-- TP distribution -->
      <div class="an-card">
        <h3>{{ t.tps }}</h3>
        <div class="an-tps">
          <div v-for="(n, i) in report.stats.tp" :key="i" class="an-tp">
            <div class="an-tp__bar" :style="{ height: (report.stats.totalDeals ? (n / report.stats.totalDeals * 80 + 4) : 4) + 'px' }"></div>
            <div class="an-tp__v">{{ n }}</div>
            <div class="an-tp__l">TP{{ i }}</div>
          </div>
        </div>
      </div>

      <!-- Deposit growth chart -->
      <div class="an-card" v-if="chart">
        <h3>{{ t.growth }}</h3>
        <svg :viewBox="`0 0 ${chart.w} ${chart.h}`" class="an-chart" preserveAspectRatio="none">
          <defs>
            <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.35" />
              <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="chart.area" fill="url(#anGrad)" />
          <path :d="chart.line" fill="none" stroke="var(--accent)" stroke-width="2" />
        </svg>
        <div class="an-chart-foot">
          <span>{{ chart.first }} USDT</span>
          <span :class="chart.last >= chart.first ? 'an-pos' : 'an-neg'">{{ chart.last.toFixed(2) }} USDT</span>
        </div>
      </div>

      <!-- Trades table -->
      <div class="an-card">
        <h3>{{ t.table }} ({{ report.tableRows.length }})</h3>
        <div v-if="!report.tableRows.length" class="an-empty">{{ t.empty }}</div>
        <div v-else class="an-table-wrap">
          <table class="an-table">
            <thead>
              <tr><th>{{ t.from }}</th><th>Symbol</th><th>Dir</th><th>TF</th><th>TP</th><th>%</th><th>{{ t.deposit }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in report.tableRows" :key="i">
                <td>{{ fmt(r.createdAt) }}</td>
                <td>{{ r.symbol }}</td>
                <td :class="r.direction === 'LONG' ? 'an-pos' : 'an-neg'">{{ r.direction }}</td>
                <td>{{ r.timeframe }}</td>
                <td>{{ r.reachedTargets }}</td>
                <td :class="r.totalProfit >= 0 ? 'an-pos' : 'an-neg'">{{ r.totalProfit }}%</td>
                <td>{{ r.deposit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.an { padding: 4px; }
.an-head { margin-bottom: 18px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 22px; font-weight: 800; margin: 0; }
  p { color: var(--text-2); font-size: 13px; margin: 4px 0 0; } }
.an-controls { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end; background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 12px; padding: 14px; }
.an-field { display: flex; flex-direction: column; gap: 5px;
  label { font-size: 11px; color: var(--text-2); font-weight: 600; }
  select, input { background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 8px; padding: 8px 10px; color: var(--text-1); font-size: 13px; min-width: 150px; &:focus { outline: none; border-color: var(--accent); } } }
.an-btn { background: var(--accent); color: #0a0a0b; border: none; border-radius: 8px; padding: 9px 18px; font-weight: 700; font-size: 13px; cursor: pointer; &:hover { opacity: .9; } &:disabled { opacity: .5; } }
.an-hint { color: var(--text-2); font-size: 12px; margin: 10px 0 0; }
.an-err { color: #e74c3c; font-size: 13px; margin: 10px 0 0; }
.an-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px,1fr)); gap: 12px; margin: 18px 0; }
.an-stat { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 10px; padding: 14px;
  &__v { font-size: 20px; font-weight: 800; }
  &__l { font-size: 11px; color: var(--text-2); margin-top: 2px; } }
.an-pos { color: #1E8449; }
.an-neg { color: #e74c3c; }
.an-card { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 12px; padding: 18px; margin-bottom: 16px;
  h3 { font-family: 'Montserrat',sans-serif; font-size: 14px; font-weight: 800; margin: 0 0 14px; } }
.an-tps { display: flex; gap: 14px; align-items: flex-end; height: 110px; }
.an-tp { display: flex; flex-direction: column; align-items: center; gap: 4px; justify-content: flex-end;
  &__bar { width: 32px; background: var(--accent); border-radius: 4px 4px 0 0; min-height: 4px; }
  &__v { font-size: 13px; font-weight: 700; }
  &__l { font-size: 10px; color: var(--text-2); } }
.an-chart { width: 100%; height: 200px; display: block; }
.an-chart-foot { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-2); margin-top: 6px; font-weight: 600; }
.an-table-wrap { overflow-x: auto; }
.an-table { width: 100%; border-collapse: collapse; font-size: 12px;
  th { text-align: left; color: var(--text-2); font-weight: 600; padding: 8px 10px; border-bottom: 1px solid var(--border, #2a2a30); white-space: nowrap; }
  td { padding: 7px 10px; border-bottom: 1px solid var(--border, #1f1f24); white-space: nowrap; } }
.an-empty { color: var(--text-2); font-size: 13px; padding: 16px 0; }
@media (max-width: 600px) { .an-field select, .an-field input { min-width: 120px; } }
</style>
