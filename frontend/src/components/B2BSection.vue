<script setup>
import { ref, computed, onMounted } from 'vue'
import { partnersApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/b2b'

const props = defineProps({
  source: { type: String, required: true },      // 'whitelabel' | 'affiliate' | 'development'
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  blocks: { type: Array, default: () => [] },     // [{ icon, h, p }]
  bullets: { type: Array, default: () => [] },    // string[]
})

const auth = useAuthStore()
const isPartner = computed(() => auth.isPartner || auth.isAdmin || auth.isOwner)

const application = ref(null)
const loaded = ref(false)
const showForm = ref(false)
const companyName = ref('')
const description = ref('')
const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

onMounted(async () => {
  if (!isPartner.value) {
    application.value = await partnersApi.myApplication().then(r => r.data).catch(() => null)
  }
  loaded.value = true
})

const status = computed(() => application.value?.status || null)

async function submit() {
  if (!companyName.value || !description.value) {
    error.value = t.value.fillNameDesc
    return
  }
  submitting.value = true; error.value = ''
  try {
    await partnersApi.apply({
      companyName: companyName.value,
      description: description.value,
      source: props.source,
    })
    submitted.value = true
    showForm.value = false
    application.value = { status: 'pending' }
  } catch (e) {
    error.value = e.response?.data?.message || 'Error'
  } finally { submitting.value = false }
}

const t = useT(dict)
</script>

<template>
  <div class="b2b">
    <div class="b2b-hero">
      <h1>{{ title }}</h1>
      <p v-if="tagline" class="b2b-tagline">{{ tagline }}</p>
    </div>

    <!-- Info blocks -->
    <div class="b2b-blocks" v-if="blocks.length">
      <div v-for="(b, i) in blocks" :key="i" class="b2b-block">
        <div class="b2b-block__icon">{{ b.icon }}</div>
        <h3>{{ b.h }}</h3>
        <p>{{ b.p }}</p>
      </div>
    </div>

    <!-- Bullets -->
    <div class="b2b-benefits" v-if="bullets.length">
      <h2>{{ t.benefits }}</h2>
      <ul>
        <li v-for="(bl, i) in bullets" :key="i">{{ bl }}</li>
      </ul>
    </div>

    <!-- Action area (changes by role/status) -->
    <div class="b2b-action" v-if="loaded">
      <!-- Partner: tools -->
      <template v-if="isPartner">
        <div class="b2b-partner-badge">✓ {{ t.partnerBadge }}</div>
        <div class="b2b-tools">
          <router-link to="/dashboard/partner/bot" class="b2b-btn">{{ t.toBot }}</router-link>
          <router-link to="/dashboard/partner/channels" class="b2b-btn">{{ t.toChannels }}</router-link>
          <router-link to="/dashboard/partner/analytics" class="b2b-btn b2b-btn--ghost">{{ t.toAnalytics }}</router-link>
        </div>
      </template>

      <!-- Pending -->
      <template v-else-if="status === 'pending'">
        <div class="b2b-status b2b-status--pending">⏳ {{ t.pending }}</div>
      </template>

      <!-- Form / rejected / new -->
      <template v-else>
        <div v-if="submitted" class="b2b-status b2b-status--ok">✅ {{ t.sent }}</div>
        <template v-else>
          <div v-if="status === 'rejected'" class="b2b-status b2b-status--rej">{{ t.rejected }}</div>
          <button v-if="!showForm" class="b2b-btn b2b-btn--lg" @click="showForm = true">{{ t.apply }}</button>
          <div v-else class="b2b-form">
            <label>{{ t.company }}<input v-model="companyName" type="text" /></label>
            <label>{{ t.descr }}<textarea v-model="description" rows="4" :placeholder="t.descrPh"></textarea></label>
            <div v-if="error" class="b2b-err">{{ error }}</div>
            <div class="b2b-form__actions">
              <button class="b2b-btn" :disabled="submitting" @click="submit">{{ submitting ? '…' : t.send }}</button>
              <button class="b2b-btn b2b-btn--ghost" @click="showForm = false">{{ t.cancel }}</button>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.b2b { padding: 4px; max-width: 900px; }
.b2b-hero { margin-bottom: 24px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 28px; font-weight: 800; margin: 0; }
}
.b2b-tagline { color: var(--text-2); font-size: 15px; margin: 8px 0 0; line-height: 1.5; }
.b2b-blocks { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap: 16px; margin-bottom: 24px; }
.b2b-block { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; padding: 20px;
  &__icon { font-size: 28px; margin-bottom: 10px; }
  h3 { font-family: 'Montserrat',sans-serif; font-size: 16px; font-weight: 800; margin: 0 0 6px; }
  p { color: var(--text-2); font-size: 13px; line-height: 1.55; margin: 0; } }
.b2b-benefits { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; padding: 20px; margin-bottom: 24px;
  h2 { font-family: 'Montserrat',sans-serif; font-size: 16px; font-weight: 800; margin: 0 0 12px; }
  ul { margin: 0; padding: 0; list-style: none; }
  li { color: var(--text-1); font-size: 14px; padding: 6px 0 6px 26px; position: relative;
    &:before { content: '✦'; position: absolute; left: 0; color: var(--accent); } } }
.b2b-action { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; padding: 22px; }
.b2b-partner-badge { color: #1E8449; font-weight: 700; font-size: 14px; margin-bottom: 14px; }
.b2b-tools { display: flex; gap: 10px; flex-wrap: wrap; }
.b2b-btn { display: inline-block; background: var(--accent); color: #0a0a0b; border: none; border-radius: 9px; padding: 11px 20px; font-weight: 700; font-size: 14px; cursor: pointer; text-decoration: none;
  &:hover { opacity: .9; } &:disabled { opacity: .5; }
  &--ghost { background: transparent; color: var(--text-1); border: 1px solid var(--border, #333); }
  &--lg { padding: 13px 28px; font-size: 15px; } }
.b2b-status { font-size: 14px; padding: 14px 16px; border-radius: 10px; margin-bottom: 14px;
  &--pending { background: #B9770E22; color: #B9770E; }
  &--ok { background: #1E844922; color: #1E8449; }
  &--rej { background: #c0392b22; color: #e74c3c; } }
.b2b-form { display: flex; flex-direction: column; gap: 12px; max-width: 520px;
  label { display: flex; flex-direction: column; gap: 5px; font-size: 12px; color: var(--text-2); font-weight: 600; }
  input, textarea { background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 8px; padding: 10px 12px; color: var(--text-1); font-size: 14px; font-family: inherit; &:focus { outline: none; border-color: var(--accent); } }
  textarea { resize: vertical; }
  &__actions { display: flex; gap: 10px; } }
.b2b-err { color: #e74c3c; font-size: 13px; }
</style>
