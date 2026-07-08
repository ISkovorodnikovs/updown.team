<template>
  <div>
    <div class="page-header"><h1>{{ t.title }}</h1></div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="card" style="padding:0;overflow:hidden">
      <table class="table">
        <thead>
          <tr><th>{{ t.bot }}</th><th>{{ t.partner }}</th><th>{{ t.status }}</th><th>{{ t.users }}</th><th>{{ t.clicks }}</th><th>{{ t.conversion }}</th></tr>
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
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/botsOverview'
const t = useT(dict)

const bots = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await botsApi.getAll()
  bots.value = data
  loading.value = false
})
</script>
