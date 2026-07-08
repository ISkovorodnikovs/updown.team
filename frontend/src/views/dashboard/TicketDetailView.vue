<template>
  <div>
    <div class="page-header" style="display:flex;align-items:center;gap:16px">
      <router-link to="/dashboard/tickets" class="btn btn--outline btn--sm">← {{ t.back }}</router-link>
      <div>
        <h1>{{ ticket?.subject }}</h1>
        <span v-if="ticket" :class="['badge', ticket.status === 'open' ? 'badge--green' : 'badge--gray']">
          {{ ticket.status }}
        </span>
      </div>
    </div>

    <div class="chat-container card">
      <div v-if="loading" class="spinner"></div>
      <div v-else class="messages" ref="messagesEl">
        <div v-for="msg in messages" :key="msg.id"
          :class="['message', msg.senderId === auth.user?.id ? 'message--mine' : 'message--theirs']">
          <div class="message__sender">{{ msg.sender?.firstName || msg.sender?.email }}</div>
          <div class="message__bubble">{{ msg.message }}</div>
          <div class="message__time">{{ formatDate(msg.createdAt) }}</div>
        </div>
      </div>

      <div class="chat-input" v-if="ticket?.status === 'open'">
        <textarea class="input" v-model="reply" :placeholder="t.replyPh" rows="3" @keydown.ctrl.enter="sendReply"></textarea>
        <div style="display:flex;gap:10px;margin-top:10px;align-items:center">
          <button class="btn btn--primary btn--sm" @click="sendReply" :disabled="replyLoading || !reply">{{ t.send }}</button>
          <small style="color:var(--text-muted)">Ctrl+Enter</small>
          <button v-if="auth.isAdmin" class="btn btn--outline btn--sm" @click="closeTicket" style="margin-left:auto">
            {{ t.closeTicket }}
          </button>
        </div>
      </div>
      <div v-else class="closed-notice">
        <span>🔒 {{ t.closed }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ticketsApi } from '@/api'
import { useT, fmtDateTime } from '@/i18n'
import dict from '@/i18n/dicts/ticketDetail'
const t = useT(dict)

const route = useRoute()
const auth = useAuthStore()
const ticketId = route.params.id

const ticket = ref(null)
const messages = ref([])
const loading = ref(true)
const reply = ref('')
const replyLoading = ref(false)
const messagesEl = ref(null)

onMounted(async () => {
  const [msgs, myTickets] = await Promise.all([
    ticketsApi.getMessages(ticketId),
    ticketsApi.getMyTickets()
  ])
  messages.value = msgs.data
  ticket.value = myTickets.data.find(x => x.id === ticketId)
  loading.value = false
  await nextTick()
  scrollToBottom()
})

function scrollToBottom() {
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

async function sendReply() {
  if (!reply.value || replyLoading.value) return
  replyLoading.value = true
  try {
    const { data } = await ticketsApi.reply(ticketId, reply.value)
    // Refetch to get sender info
    const { data: all } = await ticketsApi.getMessages(ticketId)
    messages.value = all
    reply.value = ''
    await nextTick(); scrollToBottom()
  } finally { replyLoading.value = false }
}

async function closeTicket() {
  await ticketsApi.close(ticketId)
  ticket.value = { ...ticket.value, status: 'closed' }
}

function formatDate(d) { return fmtDateTime(d, { dateStyle: 'short', timeStyle: 'short' }) }
</script>

<style lang="scss" scoped>
.chat-container { padding: 0; overflow: hidden; }

.messages {
  padding: 20px;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;

  &--mine { align-self: flex-end; align-items: flex-end; }
  &--theirs { align-self: flex-start; align-items: flex-start; }

  &__sender { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }

  &__bubble {
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &--mine &__bubble {
    background: var(--primary);
    color: white;
    border-bottom-right-radius: 4px;
  }

  &--theirs &__bubble {
    background: var(--secondary);
    color: var(--text);
    border-bottom-left-radius: 4px;
  }

  &__time { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
}

.chat-input {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
}

.closed-notice {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}
</style>
