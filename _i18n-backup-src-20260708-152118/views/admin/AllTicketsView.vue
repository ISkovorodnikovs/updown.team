<template>
  <div>
    <div class="page-header">
      <h1>Все тикеты</h1>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="card" style="padding:0;overflow:hidden">
      <table class="table">
        <thead>
          <tr><th>Тема</th><th>Пользователь</th><th>Статус</th><th>Обновлён</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id">
            <td>{{ t.subject }}</td>
            <td>{{ t.user?.email }}</td>
            <td>
              <span :class="['badge', t.status === 'open' ? 'badge--green' : 'badge--gray']">{{ t.status }}</span>
            </td>
            <td>{{ formatDate(t.updatedAt) }}</td>
            <td>
              <router-link :to="`/dashboard/tickets/${t.id}`" class="btn btn--outline btn--sm">Открыть</router-link>
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

onMounted(async () => {
  const { data } = await ticketsApi.getAllTickets({ limit: 100 })
  tickets.value = data.items
  loading.value = false
})

function formatDate(d) {
  return new Date(d).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
}
</script>
