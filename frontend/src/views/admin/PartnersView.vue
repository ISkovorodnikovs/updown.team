<template>
  <div>
    <div class="page-header">
      <h1>{{ t.title }}</h1>
      <p>{{ t.subtitle }}</p>
    </div>

    <div class="filters card" style="margin-bottom:20px;padding:16px">
      <select class="input" v-model="statusFilter" style="width:200px" @change="load">
        <option value="">{{ t.allStatuses }}</option>
        <option value="pending">{{ t.pending }}</option>
        <option value="approved">{{ t.approved }}</option>
        <option value="rejected">{{ t.rejected }}</option>
      </select>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="card" style="padding:0;overflow:hidden">
      <table class="table">
        <thead>
          <tr>
            <th>{{ t.company }}</th>
            <th>{{ t.email }}</th>
            <th>{{ t.description }}</th>
            <th>{{ t.status }}</th>
            <th>{{ t.date }}</th>
            <th>{{ t.actions }}</th>
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
                <button class="btn btn--success btn--sm" @click="review(p, 'approved')">{{ t.approve }}</button>
                <button class="btn btn--danger btn--sm" @click="openReject(p)">{{ t.reject }}</button>
              </div>
              <div style="display:flex;gap:8px" v-else-if="p.status === 'approved'">
                <button class="btn btn--outline btn--sm" @click="openChannels(p)">{{ t.channels }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Reject modal -->
    <div v-if="rejectModal" class="modal-overlay" @click.self="rejectModal = null">
      <div class="modal card">
        <h3>{{ t.rejectReason }}</h3>
        <div class="form-group" style="margin-top:16px">
          <label>{{ t.reasonOptional }}</label>
          <textarea class="input" v-model="rejectReason" :placeholder="t.reasonPh" rows="3"></textarea>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn--danger" @click="confirmReject">{{ t.reject }}</button>
          <button class="btn btn--outline" @click="rejectModal = null">{{ t.cancel }}</button>
        </div>
      </div>
    </div>

    <!-- Channels modal -->
    <div v-if="channelsModal" class="modal-overlay" @click.self="channelsModal = null">
      <div class="modal card" style="max-width:680px;width:100%">
        <h3>{{ t.partnerChannels }} {{ channelsModal.companyName }}</h3>

        <div v-if="channelsLoading" class="spinner"></div>
        <table v-else-if="channels.length" class="table" style="margin:12px 0">
          <thead><tr><th>{{ t.name }}</th><th>{{ t.params }}</th><th>signalsChannelId</th><th>{{ t.price }}</th><th>{{ t.until }}</th><th></th></tr></thead>
          <tbody>
            <tr v-for="c in channels" :key="c.id">
              <td>{{ c.name }}</td>
              <td>{{ c.asset }}/{{ c.timeframe }}/{{ c.direction }}</td>
              <td>{{ c.signalsChannelId || '—' }}</td>
              <td>{{ c.price }} USDT</td>
              <td>{{ c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0,10) : '—' }}</td>
              <td style="display:flex;gap:6px">
                <button class="btn btn--outline btn--sm" @click="openEdit(c)">✎</button>
                <button class="btn btn--danger btn--sm" @click="removeChannel(c)">×</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else style="color:var(--text-2);font-size:13px;margin:12px 0">{{ t.noChannels }}</p>

        <!-- Edit channel form -->
        <div v-if="editing" class="ch-form" style="border-color:var(--accent)">
          <h4 style="margin:8px 0">{{ t.editChannel }} {{ editing.name }}</h4>
          <div class="ch-grid">
            <input class="input" v-model="editForm.name" :placeholder="t.namePh" />
            <input class="input" v-model="editForm.signalsChannelId" :placeholder="t.sigIdPh" />
            <select class="input" v-model="editForm.asset">
              <option value="crypto">{{ t.crypto }}</option><option value="forex">{{ t.forex }}</option>
              <option value="stocks">{{ t.stocks }}</option><option value="gold">{{ t.gold }}</option>
            </select>
            <select class="input" v-model="editForm.timeframe">
              <option>M1</option><option>M3</option><option>M5</option><option>M10</option>
              <option>M15</option><option>H1</option><option>H4</option>
            </select>
            <select class="input" v-model="editForm.direction">
              <option value="both">{{ t.both }}</option><option value="long">Long</option><option value="short">Short</option>
            </select>
            <input class="input" v-model.number="editForm.price" type="number" min="0" :placeholder="t.pricePh" />
            <input class="input" v-model.number="editForm.discountPercent" type="number" min="0" :placeholder="t.discountPh" />
            <label style="display:flex;align-items:center;gap:8px;color:var(--text-2);font-size:13px">
              <input type="checkbox" v-model="editForm.isActive" /> {{ t.active }}
            </label>
          </div>
          <p v-if="!editForm.signalsChannelId" style="font-size:12px;color:#B9770E;margin:8px 0">
            {{ t.noSigIdWarn }}
          </p>
          <div style="display:flex;gap:10px;margin-top:8px">
            <button class="btn btn--primary btn--sm" @click="saveEdit" :disabled="savingEdit">{{ t.save }}</button>
            <button class="btn btn--outline btn--sm" @click="editing = null">{{ t.cancel }}</button>
          </div>
        </div>

        <div class="ch-form">
          <h4 style="margin:8px 0">{{ t.addChannel }}</h4>
          <div class="ch-grid">
            <input class="input" v-model="form.name" :placeholder="t.namePh" />
            <input class="input" v-model="form.signalsChannelId" :placeholder="t.sigIdPh" />
            <select class="input" v-model="form.asset">
              <option value="crypto">{{ t.crypto }}</option>
              <option value="forex">{{ t.forex }}</option>
              <option value="stocks">{{ t.stocks }}</option>
              <option value="gold">{{ t.gold }}</option>
            </select>
            <select class="input" v-model="form.timeframe">
              <option>M1</option><option>M3</option><option>M5</option><option>M10</option>
              <option>M15</option><option>H1</option><option>H4</option>
            </select>
            <select class="input" v-model="form.direction">
              <option value="both">{{ t.both }}</option><option value="long">Long</option><option value="short">Short</option>
            </select>
            <input class="input" v-model.number="form.discountPercent" type="number" min="0" :placeholder="t.discountPh" />
            <input class="input" v-model.number="form.durationDays" type="number" min="0" :placeholder="t.daysPh" />
          </div>
          <p style="font-size:12px;color:var(--text-2);margin:8px 0">
            {{ t.calcPrice }} <b>{{ calcPrice }} USDT</b>
            <span v-if="!form.signalsChannelId" style="color:#B9770E">{{ t.noSigIdInline }}</span>
          </p>
          <div style="display:flex;gap:10px;margin-top:8px">
            <button class="btn btn--primary btn--sm" @click="addChannel" :disabled="savingChannel">{{ t.add }}</button>
            <button class="btn btn--outline btn--sm" @click="channelsModal = null">{{ t.close }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { partnersApi } from '@/api'
import { useT, fmtDate } from '@/i18n'
import dict from '@/i18n/dicts/partners'
const t = useT(dict)

const partners = ref([])
const loading = ref(true)
const statusFilter = ref('pending')
const rejectModal = ref(null)
const rejectReason = ref('')

// Channels management
const channelsModal = ref(null)
const channels = ref([])
const channelsLoading = ref(false)
const savingChannel = ref(false)
const SCALP_TF = ['M1','M3','M5','M10']
const emptyForm = () => ({
  name: '', signalsChannelId: '', asset: 'crypto', timeframe: 'M15',
  direction: 'both', discountPercent: 0, durationDays: 30,
})
const form = ref(emptyForm())

const calcPrice = computed(() => {
  let base = 500
  if (form.value.asset === 'gold') base += 200
  if (SCALP_TF.includes(form.value.timeframe)) base += 200
  return +(base * (1 - (form.value.discountPercent || 0) / 100)).toFixed(2)
})

async function openChannels(partner) {
  channelsModal.value = partner
  form.value = emptyForm()
  editing.value = null
  channelsLoading.value = true
  channels.value = await partnersApi.getChannels(partner.id).then(r => r.data).catch(() => [])
  channelsLoading.value = false
}

async function addChannel() {
  if (!form.value.name) return
  savingChannel.value = true
  try {
    await partnersApi.addChannel(channelsModal.value.id, { ...form.value })
    channels.value = await partnersApi.getChannels(channelsModal.value.id).then(r => r.data)
    form.value = emptyForm()
  } finally { savingChannel.value = false }
}

async function removeChannel(c) {
  if (!confirm(`${t.value.confirmDeactivateChannel} "${c.name}"?`)) return
  await partnersApi.removeChannel(c.id).catch(() => {})
  channels.value = await partnersApi.getChannels(channelsModal.value.id).then(r => r.data)
}

// Edit channel
const editing = ref(null)
const savingEdit = ref(false)
const editForm = ref({})
function openEdit(c) {
  editing.value = c
  editForm.value = {
    name: c.name, signalsChannelId: c.signalsChannelId || '',
    asset: c.asset, timeframe: c.timeframe, direction: c.direction,
    price: Number(c.price), discountPercent: Number(c.discountPercent), isActive: c.isActive,
  }
}
async function saveEdit() {
  savingEdit.value = true
  try {
    await partnersApi.updateChannel(editing.value.id, { ...editForm.value })
    channels.value = await partnersApi.getChannels(channelsModal.value.id).then(r => r.data)
    editing.value = null
  } catch (e) {
    alert(e.response?.data?.message || t.value.saveError)
  } finally { savingEdit.value = false }
}

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

function formatDate(d) { return fmtDate(d) }
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 24px;
}
.modal { width: 100%; max-width: 440px; h3 { font-size: 18px; font-weight: 600; } }
.ch-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ch-form { border-top: 1px solid var(--border, #2a2a30); margin-top: 12px; padding-top: 12px; }
@media (max-width: 600px) { .ch-grid { grid-template-columns: 1fr; } }
</style>
