<template>
  <div>
    <div class="page-header"><h1>Все боты</h1></div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="card" style="padding:0;overflow:hidden">
      <table class="table">
        <thead>
          <tr><th>Бот</th><th>Партнёр</th><th>Статус</th><th>Пользователи</th><th>Переходы</th><th>Конверсия</th></tr>
        </thead>
        <tbody>
          <tr v-for="b in bots" :key="b.id">
            <td>@{{ b.username || '—' }}</td>
            <td>{{ b.partner?.user?.email }}</td>
            <td>
              <span :class="['badge', b.status === 'RUNNING' ? 'badge--green' : b.status === 'ERROR' ? 'badge--red' : 'badge--gray']">{{ b.status }}</span>
            </td>
            <td>{{ b.totalUsers }}</td>
            <td>{{ b.totalClicks }}</td>
            <td>{{ b.totalUsers ? ((b.totalClicks / b.totalUsers) * 100).toFixed(1) : 0 }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { botsApi } from '@/api'

const bots = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await botsApi.getAll()
  bots.value = data
  loading.value = false
})
</script>
