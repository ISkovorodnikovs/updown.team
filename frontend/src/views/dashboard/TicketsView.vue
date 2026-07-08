<template>
  <div>
    <div class="page-header">
      <h1>{{ t.title }}</h1>
      <button class="btn btn--primary btn--sm" @click="showCreate = true">{{ t.newTicket }}</button>
    </div>

    <!-- Create modal -->
    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
      <div class="modal card">
        <h3>{{ t.create }}</h3>
        <div class="form-group" style="margin-top:16px">
          <label>{{ t.subject }}</label>
          <input class="input" v-model="newTicket.subject" :placeholder="t.subjectPh" />
        </div>
        <div class="form-group">
          <label>{{ t.message }}</label>
          <textarea class="input" v-model="newTicket.message" :placeholder="t.messagePh" rows="5"></textarea>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn--primary" @click="createTicket" :disabled="createLoading">{{ t.createBtn }}</button>
          <button class="btn btn--outline" @click="showCreate = false">{{ t.cancel }}</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="spinner"></div>

    <div v-else-if="tickets.length === 0" class="empty">
      <div class="empty-icon">🎫</div>
      <p>{{ t.empty }}</p>
    </div>

    <div v-else class="tickets-list card">
      <table class="table">
        <thead>
          <tr>
            <th>{{ t.subject }}</th>
            <th>{{ t.status }}</th>
            <th>{{ t.created }}</th>
            <th>{{ t.updated }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tk in tickets" :key="tk.id">
            <td>{{ tk.subject }}</td>
            <td>
              <span :class="['badge', tk.status === 'open' ? 'badge--green' : 'badge--gray']">
                {{ tk.status }}
              </span>
            </td>
            <td>{{ formatDate(tk.createdAt) }}</td>
            <td>{{ formatDate(tk.updatedAt) }}</td>
            <td>
              <router-link :to="`/dashboard/tickets/${tk.id}`" class="btn btn--outline btn--sm">
                {{ t.open }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ticketsApi } from '@/api'
import { useT, fmtDateTime } from '@/i18n'
import dict from '@/i18n/dicts/tickets'
const t = useT(dict)

const tickets = ref([])
const loading = ref(true)
const showCreate = ref(false)
const createLoading = ref(false)
const newTicket = ref({ subject: '', message: '' })

onMounted(async () => {
  const { data } = await ticketsApi.getMyTickets()
  tickets.value = data
  loading.value = false
})

async function createTicket() {
  if (!newTicket.value.subject || !newTicket.value.message) return
  createLoading.value = true
  try {
    const { data } = await ticketsApi.create(newTicket.value)
    tickets.value.unshift(data)
    showCreate.value = false
    newTicket.value = { subject: '', message: '' }
  } finally { createLoading.value = false }
}

function formatDate(d) { return fmtDateTime(d, { dateStyle: 'short', timeStyle: 'short' }) }
</script>

<style lang="scss" scoped>
.tickets-list { padding: 0; overflow: hidden; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}

.modal {
  width: 100%;
  max-width: 500px;
  h3 { font-size: 18px; font-weight: 600; }
}
</style>
