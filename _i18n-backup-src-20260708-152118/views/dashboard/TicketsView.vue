<template>
  <div>
    <div class="page-header">
      <h1>Мои тикеты</h1>
      <button class="btn btn--primary btn--sm" @click="showCreate = true">+ Новый тикет</button>
    </div>

    <!-- Create modal -->
    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
      <div class="modal card">
        <h3>Создать тикет</h3>
        <div class="form-group" style="margin-top:16px">
          <label>Тема</label>
          <input class="input" v-model="newTicket.subject" placeholder="Краткое описание проблемы" />
        </div>
        <div class="form-group">
          <label>Сообщение</label>
          <textarea class="input" v-model="newTicket.message" placeholder="Опишите вашу проблему..." rows="5"></textarea>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn--primary" @click="createTicket" :disabled="createLoading">Создать</button>
          <button class="btn btn--outline" @click="showCreate = false">Отмена</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="spinner"></div>

    <div v-else-if="tickets.length === 0" class="empty">
      <div class="empty-icon">🎫</div>
      <p>Тикетов нет. Создайте первый!</p>
    </div>

    <div v-else class="tickets-list card">
      <table class="table">
        <thead>
          <tr>
            <th>Тема</th>
            <th>Статус</th>
            <th>Создан</th>
            <th>Обновлён</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id">
            <td>{{ t.subject }}</td>
            <td>
              <span :class="['badge', t.status === 'open' ? 'badge--green' : 'badge--gray']">
                {{ t.status }}
              </span>
            </td>
            <td>{{ formatDate(t.createdAt) }}</td>
            <td>{{ formatDate(t.updatedAt) }}</td>
            <td>
              <router-link :to="`/dashboard/tickets/${t.id}`" class="btn btn--outline btn--sm">
                Открыть
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

function formatDate(d) {
  return new Date(d).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
}
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
