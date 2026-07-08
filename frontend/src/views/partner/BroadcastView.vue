<template>
  <div>
    <div class="page-header">
      <h1>{{ t.title }}</h1>
      <p>{{ t.subtitle }}</p>
    </div>

    <div class="broadcast-grid">
      <div class="card">
        <h3>{{ t.newBroadcast }}</h3>

        <div v-if="result" :class="['alert', 'alert--success']" style="margin-top:16px">
          {{ t.started }} <code>{{ result.broadcastId }}</code>
        </div>
        <div v-if="error" class="alert alert--error" style="margin-top:16px">{{ error }}</div>

        <div style="margin-top:20px">
          <!-- Bot selector for admin/owner -->
          <div v-if="isAdmin" class="form-group">
            <label>{{ t.targetBots }}</label>
            <select class="input" v-model="targetMode">
              <option value="all">{{ t.allBots }}</option>
              <option value="selected">{{ t.selectedBots }}</option>
            </select>
          </div>

          <div v-if="isAdmin && targetMode === 'selected'" class="form-group">
            <label>{{ t.selectBots }}</label>
            <div class="bots-list">
              <label v-for="b in allBots" :key="b.id" class="bot-check">
                <input type="checkbox" :value="b.id" v-model="selectedBots" />
                <span>@{{ b.username || b.id }} ({{ b.partner?.user?.email }})</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t.messageText }}</label>
            <textarea class="input" v-model="message" :placeholder="t.messagePh" rows="6" required></textarea>
            <small style="color:var(--text-muted)">{{ message.length }}/4096 {{ t.chars }}</small>
          </div>

          <button class="btn btn--primary" @click="sendBroadcast" :disabled="loading || !message">
            {{ loading ? t.sending : t.send }}
          </button>
        </div>
      </div>

      <!-- History -->
      <div class="card">
        <h3>{{ t.history }}</h3>
        <div v-if="historyLoading" class="spinner"></div>
        <div v-else-if="history.length === 0" class="empty">
          <div class="empty-icon">📭</div>
          <p>{{ t.empty }}</p>
        </div>
        <div v-else class="history-list">
          <div v-for="item in history" :key="item.id" class="history-item">
            <div class="history-item__header">
              <span :class="['badge', item.status === 'done' ? 'badge--green' : item.status === 'sending' ? 'badge--blue' : 'badge--gray']">
                {{ item.status }}
              </span>
              <small>{{ formatDate(item.createdAt) }}</small>
            </div>
            <p class="history-item__msg">{{ item.message.slice(0, 100) }}{{ item.message.length > 100 ? '...' : '' }}</p>
            <div class="history-item__stats" v-if="item.status === 'done'">
              ✅ {{ item.sentCount }} {{ t.sent }} &nbsp; ❌ {{ item.failedCount }} {{ t.failed }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { broadcastsApi, botsApi } from '@/api'
import { useT, fmtDateTime } from '@/i18n'
import dict from '@/i18n/dicts/broadcast'
const t = useT(dict)

const auth = useAuthStore()
const isAdmin = computed(() => auth.isAdmin)

const message = ref('')
const targetMode = ref('all')
const selectedBots = ref([])
const loading = ref(false)
const result = ref(null)
const error = ref('')
const allBots = ref([])
const history = ref([])
const historyLoading = ref(true)

onMounted(async () => {
  if (isAdmin.value) {
    const { data } = await botsApi.getAll()
    allBots.value = data
  }
  try {
    const { data } = await broadcastsApi.history()
    history.value = data.items
  } finally { historyLoading.value = false }
})

async function sendBroadcast() {
  loading.value = true; error.value = ''; result.value = null
  try {
    const payload = { message: message.value }
    if (isAdmin.value && targetMode.value === 'selected') {
      payload.targetBotIds = selectedBots.value
    }
    const { data } = await broadcastsApi.send(payload)
    result.value = data
    message.value = ''
    // Refresh history
    const { data: h } = await broadcastsApi.history()
    history.value = h.items
  } catch (e) { error.value = e.response?.data?.message || t.value.error }
  finally { loading.value = false }
}

function formatDate(d) { return fmtDateTime(d, { dateStyle: 'short', timeStyle: 'short' }) }
</script>

<style lang="scss" scoped>
.broadcast-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 900px) { grid-template-columns: 1fr; }
  h3 { font-size: 16px; font-weight: 600; }
}

.bots-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
}

.bot-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.history-item {
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    small { color: var(--text-muted); font-size: 12px; }
  }

  &__msg { font-size: 13px; color: var(--text-muted); }
  &__stats { font-size: 12px; margin-top: 8px; color: var(--text-muted); }
}
</style>
