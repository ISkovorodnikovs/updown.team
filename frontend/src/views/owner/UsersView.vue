<template>
  <div>
    <div class="page-header"><h1>Пользователи</h1></div>

    <div class="card" style="margin-bottom:16px;padding:16px">
      <input class="input" v-model="search" placeholder="Поиск по email..." style="max-width:300px"
        @input="debouncedLoad" />
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="card" style="padding:0;overflow:hidden">
      <table class="table">
        <thead>
          <tr><th>Email</th><th>Имя</th><th>Роль</th><th>Активен</th><th>Дата</th><th>Действия</th></tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.email }}</td>
            <td>{{ [u.firstName, u.lastName].filter(Boolean).join(' ') || '—' }}</td>
            <td>
              <span :class="['badge', roleColor(u.role)]">{{ u.role }}</span>
            </td>
            <td>{{ u.isActive ? '✅' : '❌' }}</td>
            <td>{{ formatDate(u.createdAt) }}</td>
            <td>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button v-if="u.role !== 'ADMIN' && u.role !== 'OWNER'" class="btn btn--outline btn--sm"
                  @click="assign(u)">Сделать Admin</button>
                <button v-if="u.role === 'ADMIN'" class="btn btn--outline btn--sm"
                  @click="revoke(u)">Снять Admin</button>
                <button v-if="u.isActive && u.role !== 'OWNER'" class="btn btn--danger btn--sm"
                  @click="deactivate(u)">Деактивировать</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api'

const users = ref([])
const loading = ref(true)
const search = ref('')
let searchTimer = null

async function load() {
  loading.value = true
  const { data } = await adminApi.getUsers({ search: search.value || undefined, limit: 50 })
  users.value = data.items
  loading.value = false
}

function debouncedLoad() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(load, 400)
}

onMounted(load)

async function assign(u) {
  await adminApi.assignAdmin(u.id)
  u.role = 'ADMIN'
}

async function revoke(u) {
  await adminApi.revokeAdmin(u.id)
  u.role = 'USER'
}

async function deactivate(u) {
  if (!confirm(`Деактивировать ${u.email}?`)) return
  await adminApi.deactivateUser(u.id)
  u.isActive = false
}

function roleColor(role) {
  const map = { OWNER: 'badge--blue', ADMIN: 'badge--blue', PARTNER: 'badge--green', USER: 'badge--gray' }
  return map[role] || 'badge--gray'
}

function formatDate(d) { return new Date(d).toLocaleDateString('ru-RU') }
</script>
