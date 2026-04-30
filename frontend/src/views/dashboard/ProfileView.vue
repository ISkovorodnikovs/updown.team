<template>
  <div>
    <div class="page-header">
      <h1>Профиль</h1>
      <p>Управление личными данными</p>
    </div>

    <div class="profile-grid">
      <!-- Personal info -->
      <div class="card">
        <h3>Личные данные</h3>
        <form @submit.prevent="saveProfile" style="margin-top:20px">
          <div v-if="profileMsg" :class="['alert', profileMsg.type === 'error' ? 'alert--error' : 'alert--success']">{{ profileMsg.text }}</div>
          <div class="form-group">
            <label>Имя</label>
            <input class="input" v-model="profile.firstName" placeholder="Иван" />
          </div>
          <div class="form-group">
            <label>Фамилия</label>
            <input class="input" v-model="profile.lastName" placeholder="Иванов" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input class="input" :value="auth.user?.email" disabled />
          </div>
          <button class="btn btn--primary" :disabled="profileLoading">
            {{ profileLoading ? 'Сохраняем...' : 'Сохранить' }}
          </button>
        </form>
      </div>

      <!-- Change email -->
      <div class="card">
        <h3>Смена email</h3>
        <form @submit.prevent="initiateEmailChange" style="margin-top:20px" v-if="!emailCodeSent">
          <div v-if="emailMsg" :class="['alert', emailMsg.type === 'error' ? 'alert--error' : 'alert--success']">{{ emailMsg.text }}</div>
          <div class="form-group">
            <label>Новый email</label>
            <input class="input" v-model="newEmail" type="email" placeholder="new@email.com" required />
          </div>
          <button class="btn btn--primary" :disabled="emailLoading">Получить код</button>
        </form>
        <div v-if="emailCodeSent">
          <div class="alert alert--info">Код отправлен на {{ newEmail }}</div>
          <div class="form-group">
            <label>Код подтверждения</label>
            <input class="input" v-model="emailCode" placeholder="123456" maxlength="6" />
          </div>
          <button class="btn btn--primary" @click="confirmEmailChange" :disabled="emailLoading">Подтвердить</button>
        </div>
      </div>

      <!-- Change password -->
      <div class="card">
        <h3>Смена пароля</h3>
        <form @submit.prevent="changePassword" style="margin-top:20px">
          <div v-if="pwMsg" :class="['alert', pwMsg.type === 'error' ? 'alert--error' : 'alert--success']">{{ pwMsg.text }}</div>
          <div class="form-group">
            <label>Текущий пароль</label>
            <input class="input" v-model="pw.current" type="password" required />
          </div>
          <div class="form-group">
            <label>Новый пароль</label>
            <input class="input" v-model="pw.new" type="password" required />
          </div>
          <div class="form-group">
            <label>Повторите новый</label>
            <input class="input" v-model="pw.confirm" type="password" required />
          </div>
          <button class="btn btn--primary" :disabled="pwLoading">Изменить пароль</button>
        </form>
      </div>

      <!-- Security -->
      <div class="card">
        <h3>Безопасность</h3>
        <div class="security-item" style="margin-top:20px">
          <div>
            <strong>Двухфакторная аутентификация</strong>
            <p>Код на email при каждом входе</p>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="twoFaEnabled" @change="toggle2FA" />
            <span class="toggle__slider"></span>
          </label>
        </div>
        <div v-if="secMsg" :class="['alert', 'alert--success']" style="margin-top:12px">{{ secMsg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usersApi } from '@/api'

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
const secMsg = ref('')

onMounted(() => {
  profile.value.firstName = auth.user?.firstName || ''
  profile.value.lastName = auth.user?.lastName || ''
  twoFaEnabled.value = auth.user?.twoFaEnabled || false
})

async function saveProfile() {
  profileLoading.value = true
  try {
    const { data } = await usersApi.updateMe(profile.value)
    auth.user = { ...auth.user, ...data }
    profileMsg.value = { type: 'success', text: 'Данные сохранены' }
  } catch (e) { profileMsg.value = { type: 'error', text: 'Ошибка сохранения' } }
  finally { profileLoading.value = false }
}

async function initiateEmailChange() {
  emailLoading.value = true
  try {
    await usersApi.changeEmail({ newEmail: newEmail.value })
    emailCodeSent.value = true
    emailMsg.value = null
  } catch (e) { emailMsg.value = { type: 'error', text: e.response?.data?.message || 'Ошибка' } }
  finally { emailLoading.value = false }
}

async function confirmEmailChange() {
  emailLoading.value = true
  try {
    await usersApi.confirmEmail({ code: emailCode.value })
    auth.user = { ...auth.user, email: newEmail.value }
    emailCodeSent.value = false
    emailMsg.value = { type: 'success', text: 'Email обновлён' }
    newEmail.value = ''; emailCode.value = ''
  } catch (e) { emailMsg.value = { type: 'error', text: 'Неверный код' } }
  finally { emailLoading.value = false }
}

async function changePassword() {
  if (pw.value.new !== pw.value.confirm) {
    pwMsg.value = { type: 'error', text: 'Пароли не совпадают' }; return
  }
  pwLoading.value = true
  try {
    await usersApi.changePassword({ currentPassword: pw.value.current, newPassword: pw.value.new })
    pwMsg.value = { type: 'success', text: 'Пароль изменён' }
    pw.value = { current: '', new: '', confirm: '' }
  } catch (e) { pwMsg.value = { type: 'error', text: e.response?.data?.message || 'Ошибка' } }
  finally { pwLoading.value = false }
}

async function toggle2FA() {
  try {
    await usersApi.toggle2FA(twoFaEnabled.value)
    secMsg.value = `2FA ${twoFaEnabled.value ? 'включена' : 'отключена'}`
    auth.user = { ...auth.user, twoFaEnabled: twoFaEnabled.value }
    setTimeout(() => secMsg.value = '', 3000)
  } catch { twoFaEnabled.value = !twoFaEnabled.value }
}
</script>

<style lang="scss" scoped>
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
</style>
