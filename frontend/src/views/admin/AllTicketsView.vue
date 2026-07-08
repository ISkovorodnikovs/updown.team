<template>
  <div>
    <div class="page-header">
      <h1>{{ t.title }}</h1>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="card" style="padding:0;overflow:hidden">
      <table class="table">
        <thead>
          <tr><th>{{ t.subject }}</th><th>{{ t.user }}</th><th>{{ t.status }}</th><th>{{ t.updated }}</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="tk in tickets" :key="tk.id">
            <td>{{ tk.subject }}</td>
            <td>{{ tk.user?.email }}</td>
            <td>
              <span :class="['badge', tk.status === 'open' ? 'badge--green' : 'badge--gray']">{{ tk.status }}</span>
            </td>
            <td>{{ formatDate(tk.updatedAt) }}</td>
            <td>
              <router-link :to="`/dashboard/tickets/${tk.id}`" class="btn btn--outline btn--sm">{{ t.open }}</router-link>
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
import dict from '@/i18n/dicts/allTickets'
const t = useT(dict)

const tickets = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await ticketsApi.getAllTickets({ limit: 100 })
  tickets.value = data.items
  loading.value = false
})

function formatDate(d) { return fmtDateTime(d, { dateStyle: 'short', timeStyle: 'short' }) }
</script>
