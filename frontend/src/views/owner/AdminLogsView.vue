<template>
  <div>
    <div class="page-header">
      <h1>Лог действий администраторов</h1>
      <p>Иммутабельный журнал всех действий</p>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="card" style="padding:0;overflow:hidden">
      <table class="table">
        <thead>
          <tr><th>Время</th><th>Администратор</th><th>Действие</th><th>Детали</th></tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td style="white-space:nowrap">{{ formatDate(log.createdAt) }}</td>
            <td>{{ log.admin?.email || log.adminId }}</td>
            <td><code>{{ log.action }}</code></td>
            <td style="font-size:12px;color:var(--text-muted)">{{ JSON.stringify(log.meta) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api'

const logs = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await adminApi.getLogs({ limit: 100 })
  logs.value = data.items
  loading.value = false
})

function formatDate(d) {
  return new Date(d).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'medium' })
}
</script>
