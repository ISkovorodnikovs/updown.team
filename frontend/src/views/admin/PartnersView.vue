<template>
  <div>
    <div class="page-header">
      <h1>Партнёры</h1>
      <p>Управление заявками и партнёрами</p>
    </div>

    <div class="filters card" style="margin-bottom:20px;padding:16px">
      <select class="input" v-model="statusFilter" style="width:200px" @change="load">
        <option value="">Все статусы</option>
        <option value="pending">Ожидают</option>
        <option value="approved">Одобрены</option>
        <option value="rejected">Отклонены</option>
      </select>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="card" style="padding:0;overflow:hidden">
      <table class="table">
        <thead>
          <tr>
            <th>Компания</th>
            <th>Email</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in partners" :key="p.id">
            <td><strong>{{ p.companyName }}</strong></td>
            <td>{{ p.user?.email }}</td>
            <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ p.description }}</td>
            <td>
              <span :class="['badge', p.status === 'approved' ? 'badge--green' : p.status === 'rejected' ? 'badge--red' : 'badge--yellow']">
                {{ p.status }}
              </span>
            </td>
            <td>{{ formatDate(p.createdAt) }}</td>
            <td>
              <div style="display:flex;gap:8px" v-if="p.status === 'pending'">
                <button class="btn btn--success btn--sm" @click="review(p, 'approved')">Одобрить</button>
                <button class="btn btn--danger btn--sm" @click="openReject(p)">Отклонить</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Reject modal -->
    <div v-if="rejectModal" class="modal-overlay" @click.self="rejectModal = null">
      <div class="modal card">
        <h3>Причина отклонения</h3>
        <div class="form-group" style="margin-top:16px">
          <label>Причина (необязательно)</label>
          <textarea class="input" v-model="rejectReason" placeholder="Укажите причину..." rows="3"></textarea>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn--danger" @click="confirmReject">Отклонить</button>
          <button class="btn btn--outline" @click="rejectModal = null">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { partnersApi } from '@/api'

const partners = ref([])
const loading = ref(true)
const statusFilter = ref('pending')
const rejectModal = ref(null)
const rejectReason = ref('')

async function load() {
  loading.value = true
  const { data } = await partnersApi.getAll({ status: statusFilter.value || undefined, limit: 50 })
  partners.value = data.items
  loading.value = false
}

onMounted(load)

async function review(partner, action) {
  await partnersApi.review(partner.id, { action })
  partner.status = action
}

function openReject(partner) {
  rejectModal.value = partner
  rejectReason.value = ''
}

async function confirmReject() {
  await partnersApi.review(rejectModal.value.id, { action: 'rejected', reason: rejectReason.value })
  rejectModal.value.status = 'rejected'
  rejectModal.value = null
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('ru-RU')
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 24px;
}
.modal { width: 100%; max-width: 440px; h3 { font-size: 18px; font-weight: 600; } }
</style>
