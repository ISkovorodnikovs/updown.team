<template>
  <div>
    <div class="page-header">
      <h1>{{ t.title }}</h1>
      <p>{{ t.subtitle }}</p>
    </div>

    <div class="profile-grid">
      <!-- Personal info -->
      <div class="card">
        <h3>{{ t.personal }}</h3>
        <form @submit.prevent="saveProfile" style="margin-top:20px">
          <div v-if="profileMsg" :class="['alert', profileMsg.type === 'error' ? 'alert--error' : 'alert--success']">{{ profileMsg.text }}</div>
          <div class="form-group">
            <label>{{ t.firstName }}</label>
            <input class="input" v-model="profile.firstName" :placeholder="t.firstNamePh" />
          </div>
          <div class="form-group">
            <label>{{ t.lastName }}</label>
            <input class="input" v-model="profile.lastName" :placeholder="t.lastNamePh" />
          </div>
          <div class="form-group">
            <label>{{ t.email }}</label>
            <input class="input" :value="auth.user?.email" disabled />
          </div>
          <button class="btn btn--primary" :disabled="profileLoading">
            {{ profileLoading ? t.saving : t.save }}
          </button>
        </form>
      </div>

      <!-- Change email -->
      <div class="card">
        <h3>{{ t.changeEmail }}</h3>
        <form @submit.prevent="initiateEmailChange" style="margin-top:20px" v-if="!emailCodeSent">
          <div v-if="emailMsg" :class="['alert', emailMsg.type === 'error' ? 'alert--error' : 'alert--success']">{{ emailMsg.text }}</div>
          <div class="form-group">
            <label>{{ t.newEmail }}</label>
            <input class="input" v-model="newEmail" type="email" placeholder="new@email.com" required />
          </div>
          <button class="btn btn--primary" :disabled="emailLoading">{{ t.getCode }}</button>
        </form>
        <div v-if="emailCodeSent">
          <div class="alert alert--info">{{ t.codeSentTo }} {{ newEmail }}</div>
          <div class="form-group">
            <label>{{ t.confirmCode }}</label>
            <input class="input" v-model="emailCode" placeholder="123456" maxlength="6" />
          </div>
          <button class="btn btn--primary" @click="confirmEmailChange" :disabled="emailLoading">{{ t.confirm }}</button>
        </div>
      </div>

      <!-- Change password -->
      <div class="card">
        <h3>{{ noPassword ? t.setPw : t.changePw }}</h3>
        <p v-if="noPassword" class="pw-hint">{{ t.setPwHint }}</p>
        <form @submit.prevent="changePassword" style="margin-top:20px">
          <div v-if="pwMsg" :class="['alert', pwMsg.type === 'error' ? 'alert--error' : 'alert--success']">{{ pwMsg.text }}</div>
          <div class="form-group" v-if="!noPassword">
            <label>{{ t.currentPw }}</label>
            <input class="input" v-model="pw.current" type="password" required />
          </div>
          <div class="form-group">
            <label>{{ t.newPw }}</label>
            <input class="input" v-model="pw.new" type="password" required />
          </div>
          <div class="form-group">
            <label>{{ t.repeatNew }}</label>
            <input class="input" v-model="pw.confirm" type="password" required />
          </div>
          <button class="btn btn--primary" :disabled="pwLoading">{{ t.changePwBtn }}</button>
        </form>
      </div>

      <!-- Security -->
      <div class="card">
        <h3>{{ t.security }}</h3>
        <div class="security-item" style="margin-top:20px">
          <div>
            <strong>{{ t.twoFa }}</strong>
            <p>{{ t.twoFaHint }}</p>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="twoFaEnabled" @change="toggle2FA" />
            <span class="toggle__slider"></span>
          </label>
        </div>
        <div v-if="secMsg" :class="['alert', 'alert--success']" style="margin-top:12px">{{ secMsg }}</div>
      </div>

      <!-- Telegram notifications -->
      <div class="card">
        <h3>{{ t.tgTitle }}</h3>
        <p style="color:var(--text-2);font-size:13px;margin:6px 0 16px">{{ t.tgHint }}</p>
        <a v-if="!tgLinked && tgUrl" :href="tgUrl" target="_blank" rel="noopener"
           class="tg-connect" @click="afterConnect">✈ {{ t.tgConnect }}</a>
        <div v-else-if="tgLinked" class="security-item">
          <div>
            <strong>✓ {{ t.tgConnected }}</strong>
            <p>{{ t.tgNotify }}</p>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="notifyTg" @change="toggleTg" />
            <span class="toggle__slider"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usersApi, notificationsApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/profile'
const t = useT(dict)

const auth = useAuthStore()

const profile = ref({ firstName: '', lastName: '' })
const profileLoading = ref(false)
const profileMsg = ref(null)

const newEmail = ref('')
const emailCode = ref('')
const emailCodeSent = ref(false)
const emailLoading = ref(false)
const emailMsg = ref(null)

const pw = ref({ current: '', new: '', confirm: '' })
const pwLoading = ref(false)
const pwMsg = ref(null)

const twoFaEnabled = ref(false)

// Telegram-уведомления
const tgLinked = ref(false)
const notifyTg = ref(false)
const tgUrl = ref(null)
async function loadTg() {
  try {
    const s = await notificationsApi.tgStatus().then(r => r.data)
    tgLinked.value = !!s.linked
    notifyTg.value = !!s.notifyTelegram
    if (!s.linked) { try { tgUrl.value = await notificationsApi.tgLink().then(r => r.data.url) } catch { /* ignore */ } }
  } catch { /* ignore */ }
}
async function toggleTg() {
  try { await notificationsApi.tgToggle(notifyTg.value) } catch { notifyTg.value = !notifyTg.value }
}
function afterConnect() { setTimeout(loadTg, 5000) }
const secMsg = ref('')

onMounted(() => {
  profile.value.firstName = auth.user?.firstName || ''
  profile.value.lastName = auth.user?.lastName || ''
  twoFaEnabled.value = auth.user?.twoFaEnabled || false
  loadTg()
})

async function saveProfile() {
  profileLoading.value = true
  try {
    const { data } = await usersApi.updateMe(profile.value)
    auth.user = { ...auth.user, ...data }
    profileMsg.value = { type: 'success', text: t.value.saved }
  } catch (e) { profileMsg.value = { type: 'error', text: t.value.saveError } }
  finally { profileLoading.value = false }
}

async function initiateEmailChange() {
  emailLoading.value = true
  try {
    await usersApi.changeEmail({ newEmail: newEmail.value })
    emailCodeSent.value = true
    emailMsg.value = null
  } catch (e) { emailMsg.value = { type: 'error', text: e.response?.data?.message || t.value.error } }
  finally { emailLoading.value = false }
}

async function confirmEmailChange() {
  emailLoading.value = true
  try {
    await usersApi.confirmEmail({ code: emailCode.value })
    auth.user = { ...auth.user, email: newEmail.value }
    emailCodeSent.value = false
    emailMsg.value = { type: 'success', text: t.value.emailUpdated }
    newEmail.value = ''; emailCode.value = ''
  } catch (e) { emailMsg.value = { type: 'error', text: t.value.invalidCode } }
  finally { emailLoading.value = false }
}

// Аккаунт зарегистрирован по коду — пароль задаётся впервые, без старого
const noPassword = computed(() => auth.user?.hasPassword === false)

async function changePassword() {
  if (pw.value.new !== pw.value.confirm) {
    pwMsg.value = { type: 'error', text: t.value.pwMismatch }; return
  }
  pwLoading.value = true
  try {
    await usersApi.changePassword(noPassword.value ? { newPassword: pw.value.new } : { currentPassword: pw.value.current, newPassword: pw.value.new })
    pwMsg.value = { type: 'success', text: t.value.pwChanged }
    if (auth.user) auth.user = { ...auth.user, hasPassword: true }
    pw.value = { current: '', new: '', confirm: '' }
  } catch (e) { pwMsg.value = { type: 'error', text: e.response?.data?.message || t.value.error } }
  finally { pwLoading.value = false }
}

async function toggle2FA() {
  try {
    await usersApi.toggle2FA(twoFaEnabled.value)
    secMsg.value = `2FA ${twoFaEnabled.value ? t.value.twoFaOn : t.value.twoFaOff}`
    auth.user = { ...auth.user, twoFaEnabled: twoFaEnabled.value }
    setTimeout(() => secMsg.value = '', 3000)
  } catch { twoFaEnabled.value = !twoFaEnabled.value }
}
</script>

<style lang="scss" scoped>
.pw-hint { color: var(--text-2); font-size: 13px; margin: 6px 0 0; line-height: 1.5; }
.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
  
  h3 { font-size: 16px; font-weight: 600; }
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  
  strong { display: block; font-weight: 600; margin-bottom: 4px; }
  p { font-size: 13px; color: var(--text-muted); }
}

.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
  
  input { opacity: 0; width: 0; height: 0; }
  
  &__slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: var(--border);
    border-radius: 99px;
    transition: .2s;
    
    &::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      left: 3px;
      top: 3px;
      transition: .2s;
    }
  }
  
  input:checked + .toggle__slider { background: var(--primary); }
  input:checked + .toggle__slider::before { transform: translateX(22px); }
}
.tg-connect { display: inline-flex; align-items: center; gap: 8px; background: #229ED9; color: #fff; padding: 11px 18px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; }
.tg-connect:hover { opacity: .9; }
</style>
