<template>
  <div>
    <div class="page-header">
      <h1>{{ t.title }}</h1>
      <p>{{ t.subtitle }}</p>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="card" style="padding:0;overflow:hidden">
      <table class="table">
        <thead>
          <tr><th>{{ t.time }}</th><th>{{ t.admin }}</th><th>{{ t.action }}</th><th>{{ t.details }}</th></tr>
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
import { useT, fmtDateTime } from '@/i18n'
import dict from '@/i18n/dicts/adminLogs'
const t = useT(dict)

const logs = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await adminApi.getLogs({ limit: 100 })
  logs.value = data.items
  loading.value = false
})

function formatDate(d) { return fmtDateTime(d, { dateStyle: 'short', timeStyle: 'medium' }) }
</script>
