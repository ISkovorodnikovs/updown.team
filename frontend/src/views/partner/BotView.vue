<template>
  <div>
    <div class="page-header">
      <h1>{{ t.title }}</h1>
      <p>{{ t.subtitle }}</p>
    </div>

    <div v-if="loading" class="spinner"></div>

    <div v-else class="bot-grid">
      <!-- Status card -->
      <div class="card">
        <h3>{{ t.botStatus }}</h3>
        <div class="bot-status" style="margin-top:16px">
          <div v-if="bot">
            <div class="status-row">
              <span>{{ t.statusLabel }}</span>
              <span :class="['badge', bot.status === 'RUNNING' ? 'badge--green' : bot.status === 'ERROR' ? 'badge--red' : 'badge--gray']">
                {{ bot.status }}
              </span>
            </div>
            <div class="status-row">
              <span>{{ t.username }}</span>
              <strong>{{ bot.username ? '@' + bot.username : '—' }}</strong>
            </div>
            <div class="status-row">
              <span>{{ t.users }}</span>
              <strong>{{ bot.totalUsers }}</strong>
            </div>
            <div class="status-row">
              <span>{{ t.clicks }}</span>
              <strong>{{ bot.totalClicks }}</strong>
            </div>
            <div class="status-row">
              <span>{{ t.conversion }}</span>
              <strong>{{ bot.conversion }}%</strong>
            </div>
            <div v-if="bot.errorMessage" class="alert alert--error" style="margin-top:12px">{{ bot.errorMessage }}</div>
          </div>
          <p v-else class="text-muted">{{ t.notConfigured }}</p>
        </div>

        <div class="bot-actions" style="margin-top:20px">
          <button v-if="bot?.status !== 'RUNNING'" class="btn btn--success" @click="startBot" :disabled="!bot || actionLoading">
            {{ t.start }}
          </button>
          <button v-if="bot?.status === 'RUNNING'" class="btn btn--danger btn--sm" @click="stopBot" :disabled="actionLoading">
            {{ t.stop }}
          </button>
        </div>
      </div>

      <!-- Token setup -->
      <div class="card">
        <h3>{{ t.botToken }}</h3>
        <p style="color:var(--text-muted);font-size:14px;margin:8px 0 16px">
          {{ t.tokenHint }}
        </p>
        <div v-if="tokenMsg" :class="['alert', tokenMsg.type === 'error' ? 'alert--error' : 'alert--success']">{{ tokenMsg.text }}</div>
        <div class="form-group">
          <label>{{ t.tokenLabel }}</label>
          <input class="input" v-model="newToken" placeholder="123456:ABC-..." />
        </div>
        <button class="btn btn--primary" @click="setToken" :disabled="tokenLoading || !newToken">
          {{ tokenLoading ? t.checking : t.saveToken }}
        </button>
      </div>

      <!-- Button URLs -->
      <div class="card" style="grid-column: 1 / -1">
        <h3>{{ t.buttonsTitle }}</h3>
        <p style="color:var(--text-muted);font-size:14px;margin:8px 0 16px">
          {{ t.buttonsHint }}
        </p>
        <div v-if="btnMsg" :class="['alert', 'alert--success']">{{ btnMsg }}</div>

        <div class="buttons-grid">
          <div v-for="(btn, i) in buttons" :key="i" class="button-row">
            <span class="btn-num">{{ i + 1 }}</span>
            <input class="input" v-model="btn.label" :placeholder="t.btnLabelPh" />
            <input class="input" v-model="btn.url" placeholder="https://..." />
            <button class="btn btn--outline btn--sm" @click="removeButton(i)" v-if="buttons.length > 1">✕</button>
          </div>
        </div>

        <div style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn--outline btn--sm" @click="addButton" :disabled="buttons.length >= 6">
            {{ t.addButton }}
          </button>
          <button class="btn btn--primary btn--sm" @click="saveButtons" :disabled="btnLoading">
            {{ btnLoading ? t.savingBtns : t.saveButtons }}
          </button>
        </div>
      </div>

      <!-- Recipients whitelist -->
      <div class="card">
        <h3>{{ t.recipientsTitle }}</h3>
        <p style="color:var(--text-muted);font-size:14px;margin:8px 0 12px">
{{ t.recipientsHint }}
        </p>
        <textarea v-model="recipientsText" rows="4" class="recipients-area"
          placeholder="@myusername&#10;123456789"></textarea>
        <div style="margin-top:10px">
          <button class="btn btn--primary btn--sm" @click="saveRecipients" :disabled="recLoading">
            {{ recLoading ? t.savingList : t.saveList }}
          </button>
          <span v-if="recMsg" style="margin-left:10px;color:var(--accent);font-size:13px">{{ recMsg }}</span>
        </div>
      </div>

      <!-- Ticket -->
      <div class="card">
        <h3>{{ t.needHelp }}</h3>
        <p style="color:var(--text-muted);font-size:14px;margin:8px 0 16px">
          {{ t.ticketHint }}
        </p>
        <router-link to="/dashboard/tickets" class="btn btn--outline btn--sm">
          {{ t.createTicket }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { botsApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/bot'
const t = useT(dict)

const loading = ref(true)
const actionLoading = ref(false)
const tokenLoading = ref(false)
const btnLoading = ref(false)
const bot = ref(null)
const newToken = ref('')
const tokenMsg = ref(null)
const btnMsg = ref('')
const buttons = ref([{ label: '', url: '' }])
const recipientsText = ref('')
const recLoading = ref(false)
const recMsg = ref('')

onMounted(async () => {
  try {
    const { data } = await botsApi.getMyBot()
    bot.value = data
    if (data?.buttonUrls?.length) buttons.value = [...data.buttonUrls]
    if (data?.allowedRecipients?.length) recipientsText.value = data.allowedRecipients.join('\n')
  } finally { loading.value = false }
})

async function saveRecipients() {
  recLoading.value = true; recMsg.value = ''
  try {
    const list = recipientsText.value.split('\n').map(s => s.trim()).filter(Boolean)
    const { data } = await botsApi.updateRecipients(list)
    bot.value = data
    recMsg.value = t.value.listSaved
    setTimeout(() => recMsg.value = '', 3000)
  } finally { recLoading.value = false }
}

async function setToken() {
  tokenLoading.value = true; tokenMsg.value = null
  try {
    const { data } = await botsApi.setToken(newToken.value)
    bot.value = { ...bot.value, ...data }
    tokenMsg.value = { type: 'success', text: t.value.tokenSaved }
    newToken.value = ''
  } catch (e) { tokenMsg.value = { type: 'error', text: e.response?.data?.message || t.value.invalidToken } }
  finally { tokenLoading.value = false }
}

async function startBot() {
  actionLoading.value = true
  try {
    const { data } = await botsApi.startBot()
    bot.value = data
  } finally { actionLoading.value = false }
}

async function stopBot() {
  actionLoading.value = true
  try {
    await botsApi.stopBot()
    bot.value = { ...bot.value, status: 'INACTIVE' }
  } finally { actionLoading.value = false }
}

function addButton() { if (buttons.value.length < 6) buttons.value.push({ label: '', url: '' }) }
function removeButton(i) { buttons.value.splice(i, 1) }

async function saveButtons() {
  btnLoading.value = true
  try {
    const { data } = await botsApi.updateButtons(buttons.value.filter(b => b.label && b.url))
    bot.value = data
    btnMsg.value = t.value.buttonsSaved
    setTimeout(() => btnMsg.value = '', 3000)
  } finally { btnLoading.value = false }
}
</script>

<style lang="scss" scoped>
.bot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  h3 { font-size: 16px; font-weight: 600; }
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  
  &:last-child { border-bottom: none; }
}

.bot-actions { display: flex; gap: 10px; }

.buttons-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-num {
  width: 28px;
  height: 28px;
  background: var(--primary-light);
  color: var(--primary-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.recipients-area {
  width: 100%;
  background: var(--bg-2, #1a1a1c);
  border: 1px solid var(--border, #2a2a30);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text, #eee);
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
}
.recipients-area:focus { outline: none; border-color: var(--accent); }
</style>
