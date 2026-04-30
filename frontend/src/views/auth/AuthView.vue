<template>
  <div class="auth-page" :class="[savedTheme, savedLang]">

    <!-- Кнопка возврата — вне контейнера, всегда в углу экрана -->
    <router-link to="/" class="close-btn" title="Back to home">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </router-link>

    <div class="auth-container" :class="{ 'is-register': isRegister }">

      <!-- Белая панель -->
      <div class="panel panel--white">

        <!-- Форма входа — левая половина -->
        <div class="form-slot form-slot--left" :class="{ 'form-slot--faded': isRegister || formFading }">
          <div class="form-inner">
            <div class="brand">⬆⬇ UpDown</div>
            <h2>{{ authT.signIn }}</h2>
            <p class="subtitle">{{ authT.signInSub }}</p>

            <transition name="alert-slide">
              <div v-if="loginError" class="alert alert--error">
                <span>{{ loginError }}</span>
                <button class="alert-close" @click="loginError = ''">×</button>
              </div>
            </transition>

            <template v-if="loginMode === 'password'">
              <!-- v-show вместо v-if: DOM не пересоздаётся, данные в полях сохраняются -->
              <div class="form-group" v-show="!requires2FA">
                <input class="input" v-model="loginForm.email" type="text" inputmode="email" autocomplete="email" :placeholder="authT.emailPlaceholder" />
              </div>
              <div class="form-group" v-show="!requires2FA">
                <div class="input-wrapper">
                  <input
                    class="input input--with-icon"
                    v-model="loginForm.password"
                    :type="showLoginPassword ? 'text' : 'password'"
                    :placeholder="authT.passwordPlaceholder"
                  />
                  <button class="eye-btn" type="button" @click="showLoginPassword = !showLoginPassword" :title="showLoginPassword ? authT.hidePass : authT.showPass">
                    <svg v-if="!showLoginPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
              <div v-show="requires2FA">
                <p class="hint">{{ authT.enterCode }}</p>
                <div class="form-group">
                  <input class="input" v-model="twoFaCode" placeholder="123456" maxlength="6" />
                </div>
              </div>
            </template>

            <template v-else>
              <div class="form-group" v-if="!loginCodeSent">
                <input class="input" v-model="loginForm.email" type="text" inputmode="email" autocomplete="email" :placeholder="authT.emailLabel" />
              </div>
              <div v-if="loginCodeSent">
                <div class="alert alert--info">{{ authT.codeSent }} {{ loginForm.email }}</div>
                <div class="form-group">
                  <input class="input" v-model="loginForm.code" placeholder="123456" maxlength="6" />
                </div>
              </div>
            </template>

            <div class="form-options">
              <button class="link-btn" type="button" @click="toggleLoginMode">
                {{ loginMode === 'password' ? authT.loginWithCode : authT.loginWithPass }}
              </button>
            </div>

            <button class="btn-main" type="button" :disabled="loginLoading" @click="handleLogin">
              {{ loginLoading ? '...' : authT.signInBtn }}
            </button>
          </div>
        </div>

        <!-- Форма регистрации — правая половина -->
        <div class="form-slot form-slot--right" :class="{ 'form-slot--faded': !isRegister || formFading }">
          <div class="form-inner">
            <div class="brand">⬆⬇ UpDown</div>
            <h2>{{ authT.createAccount }}</h2>
            <p class="subtitle">{{ authT.createSub }}</p>

            <transition name="alert-slide">
              <div v-if="regError" class="alert alert--error">
                <span>{{ regError }}</span>
                <button class="alert-close" @click="regError = ''">×</button>
              </div>
            </transition>

            <div v-if="regStep === 1">
              <div class="form-group">
                <input class="input" v-model="regForm.email" type="text" inputmode="email" autocomplete="email" :placeholder="authT.emailLabel" />
              </div>
              <button class="btn-main" type="button" :disabled="regLoading" @click="sendRegCode">
                {{ regLoading ? '...' : authT.getCode }}
              </button>
            </div>

            <div v-if="regStep === 2">
              <div class="alert alert--info">{{ authT.codeSent }} {{ regForm.email }}</div>
              <div class="form-group">
                <input class="input" v-model="regForm.code" :placeholder="authT.codePlaceholder" maxlength="6" />
              </div>
              <div class="form-group">
                <div class="input-wrapper">
                  <input
                    class="input input--with-icon"
                    v-model="regForm.password"
                    :type="showRegPassword ? 'text' : 'password'"
                    :placeholder="authT.passwordLabel"
                  />
                  <button class="eye-btn" type="button" @click="showRegPassword = !showRegPassword" :title="showRegPassword ? authT.hidePass : authT.showPass">
                    <svg v-if="!showRegPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
              <div class="form-group">
                <div class="input-wrapper">
                  <input
                    class="input input--with-icon"
                    v-model="regForm.confirmPassword"
                    :type="showRegConfirmPassword ? 'text' : 'password'"
                    :placeholder="authT.confirmPlaceholder"
                  />
                  <button class="eye-btn" type="button" @click="showRegConfirmPassword = !showRegConfirmPassword" :title="showRegConfirmPassword ? authT.hidePass : authT.showPass">
                    <svg v-if="!showRegConfirmPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
              <button class="btn-main" type="button" :disabled="regLoading" @click="handleRegister">
                {{ regLoading ? '...' : authT.signUpBtn }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Синяя панель -->
      <div class="panel panel--blue">
        <div class="blue-content" :class="{ 'blue-content--hidden': !isRegister }">
          <h2>{{ authT.welcomeBack }}</h2>
          <p>{{ authT.welcomeSub }}</p>
          <button class="btn-outline" @click="goTo('login')">{{ authT.signInBlue }}</button>
        </div>
        <div class="blue-content" :class="{ 'blue-content--hidden': isRegister }">
          <h2>{{ authT.helloFriend }}</h2>
          <p>{{ authT.helloSub }}</p>
          <button class="btn-outline" @click="goTo('register')">{{ authT.signUpBlue }}</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// Тема и язык из лендинга
const savedTheme = ref(localStorage.getItem('ud-theme') || 'dark')
const savedLang = ref(localStorage.getItem('ud-lang') || 'ru')

// Переводы для страницы авторизации
const authT = computed(() => ({
  signIn: savedLang.value === 'ru' ? 'Войти' : 'Sign In',
  signInSub: savedLang.value === 'ru' ? 'или использовать аккаунт' : 'or use your account',
  createAccount: savedLang.value === 'ru' ? 'Создать аккаунт' : 'Create Account',
  createSub: savedLang.value === 'ru' ? 'или email для регистрации' : 'or use your email for registration',
  emailPlaceholder: savedLang.value === 'ru' ? 'Email адрес' : 'Email Address',
  passwordPlaceholder: savedLang.value === 'ru' ? 'Пароль' : 'Password',
  confirmPlaceholder: savedLang.value === 'ru' ? 'Повторите пароль' : 'Confirm Password',
  codePlaceholder: savedLang.value === 'ru' ? 'Код из письма' : 'Code from email',
  loginWithCode: savedLang.value === 'ru' ? 'Войти по коду на email' : 'Login with email code',
  loginWithPass: savedLang.value === 'ru' ? 'Войти с паролем' : 'Login with password',
  getCode: savedLang.value === 'ru' ? 'ПОЛУЧИТЬ КОД' : 'GET CODE',
  signInBtn: savedLang.value === 'ru' ? 'ВОЙТИ' : 'SIGN IN',
  signUpBtn: savedLang.value === 'ru' ? 'РЕГИСТРАЦИЯ' : 'SIGN UP',
  helloFriend: savedLang.value === 'ru' ? 'Привет!' : 'Hello, Friend!',
  helloSub: savedLang.value === 'ru' ? 'Начни своё путешествие — создай аккаунт уже сегодня' : 'Begin your amazing journey by creating an account with us today',
  welcomeBack: savedLang.value === 'ru' ? 'С возвращением!' : 'Welcome Back!',
  welcomeSub: savedLang.value === 'ru' ? 'Войди в аккаунт и продолжи работу с платформой' : 'Stay connected by logging in with your credentials and continue your experience',
  codeSent: savedLang.value === 'ru' ? 'Код отправлен на' : 'Code sent to',
  enterCode: savedLang.value === 'ru' ? 'Введите код из письма' : 'Enter the code from your email',
  signInBlue: savedLang.value === 'ru' ? 'ВОЙТИ' : 'SIGN IN',
  signUpBlue: savedLang.value === 'ru' ? 'РЕГИСТРАЦИЯ' : 'SIGN UP',
  // Ошибки
  errInvalidLogin: savedLang.value === 'ru' ? 'Неверный email или пароль' : 'Invalid email or password',
  errInvalidCode: savedLang.value === 'ru' ? 'Неверный код. Попробуйте ещё раз.' : 'Invalid code. Please try again.',
  errExpiredCode: savedLang.value === 'ru' ? 'Неверный или устаревший код' : 'Invalid or expired code',
  errSendCode: savedLang.value === 'ru' ? 'Не удалось отправить код' : 'Could not send code',
  errPassMatch: savedLang.value === 'ru' ? 'Пароли не совпадают' : 'Passwords do not match',
  errRegFailed: savedLang.value === 'ru' ? 'Ошибка регистрации. Попробуйте ещё раз.' : 'Registration failed. Please try again.',
  showPass: savedLang.value === 'ru' ? 'Показать пароль' : 'Show password',
  hidePass: savedLang.value === 'ru' ? 'Скрыть пароль' : 'Hide password',
  passwordLabel: savedLang.value === 'ru' ? 'Пароль' : 'Password',
  emailLabel: savedLang.value === 'ru' ? 'Email' : 'Email Address',
}))

const isRegister = ref(false)
const formFading = ref(false)

onMounted(() => {
  if (route.path === '/register') isRegister.value = true
})

function goTo(page) {
  formFading.value = true
  setTimeout(() => {
    isRegister.value = page === 'register'
    // history.replaceState вместо router.replace — URL меняется без перезагрузки компонента
    history.replaceState(null, '', page === 'register' ? '/register' : '/login')
    setTimeout(() => { formFading.value = false }, 650)
  }, 250)
}

// --- Login ---
const loginMode = ref('password')
const loginLoading = ref(false)
const loginError = ref('')
const loginCodeSent = ref(false)
const requires2FA = ref(false)
const twoFaCode = ref('')
const loginForm = ref({ email: '', password: '', code: '' })
const showLoginPassword = ref(false)
const showRegPassword = ref(false)
const showRegConfirmPassword = ref(false)



function toggleLoginMode() {
  loginMode.value = loginMode.value === 'password' ? 'code' : 'password'
  loginError.value = ''
  loginCodeSent.value = false
  requires2FA.value = false
}

async function handleLogin() {
  if (loginMode.value === 'password') {
    if (requires2FA.value) { await verify2FA(); return }
    await loginPassword()
  } else {
    if (!loginCodeSent.value) { await sendLoginCode(); return }
    await verifyLoginCode()
  }
}

async function loginPassword() {
  loginLoading.value = true
  loginError.value = ''
  try {
    const { data } = await authApi.login({ email: loginForm.value.email, password: loginForm.value.password })
    if (data.requires2FA) { requires2FA.value = true }
    else { auth.setAuth(data); router.push('/dashboard') }
  } catch (e) {
    const msg = e.response?.data?.message || ''
    const isEmailErr = Array.isArray(msg)
      ? msg.some(m => typeof m === 'string' && m.toLowerCase().includes('email'))
      : typeof msg === 'string' && msg.toLowerCase().includes('email')
    loginError.value = isEmailErr
      ? (savedLang.value === 'ru' ? 'Введите корректный email адрес' : 'Enter a valid email address')
      : authT.value.errInvalidLogin
  }
  finally { loginLoading.value = false }
}

async function verify2FA() {
  loginLoading.value = true
  try {
    const { data } = await authApi.verifyLoginCode({ email: loginForm.value.email, code: twoFaCode.value })
    auth.setAuth(data); router.push('/dashboard')
  } catch (e) { loginError.value = authT.value.errInvalidCode }
  finally { loginLoading.value = false }
}

function translateBackendError(msg, fallback) {
  if (!msg) return fallback
  const str = Array.isArray(msg) ? msg.join(' ') : String(msg)
  const s = str.toLowerCase()
  if (s.includes('email')) return savedLang.value === 'ru' ? 'Введите корректный email адрес' : 'Enter a valid email address'
  if (s.includes('password') && s.includes('short')) return savedLang.value === 'ru' ? 'Пароль слишком короткий' : 'Password is too short'
  if (s.includes('already')) return savedLang.value === 'ru' ? 'Этот email уже зарегистрирован' : 'This email is already registered'
  if (s.includes('not found') || s.includes('unauthorized') || s.includes('invalid credentials')) return fallback
  if (s.includes('expired')) return savedLang.value === 'ru' ? 'Код устарел, запросите новый' : 'Code expired, request a new one'
  if (s.includes('code')) return savedLang.value === 'ru' ? 'Неверный код' : 'Invalid code'
  return fallback
}

async function sendLoginCode() {
  loginLoading.value = true
  loginError.value = ''
  try {
    await authApi.sendLoginCode(loginForm.value.email)
    loginCodeSent.value = true
  } catch (e) { loginError.value = translateBackendError(e.response?.data?.message, authT.value.errSendCode) }
  finally { loginLoading.value = false }
}

async function verifyLoginCode() {
  loginLoading.value = true
  try {
    const { data } = await authApi.verifyLoginCode({ email: loginForm.value.email, code: loginForm.value.code })
    auth.setAuth(data); router.push('/dashboard')
  } catch (e) { loginError.value = authT.value.errExpiredCode }
  finally { loginLoading.value = false }
}

// --- Register ---
const regStep = ref(1)
const regLoading = ref(false)
const regError = ref('')
const regForm = ref({ email: '', code: '', password: '', confirmPassword: '' })

async function sendRegCode() {
  regLoading.value = true; regError.value = ''
  try {
    await authApi.sendCode(regForm.value.email)
    regStep.value = 2
  } catch (e) { regError.value = translateBackendError(e.response?.data?.message, authT.value.errSendCode) }
  finally { regLoading.value = false }
}

async function handleRegister() {
  if (regForm.value.password !== regForm.value.confirmPassword) {
    regError.value = authT.value.errPassMatch; return
  }
  regLoading.value = true; regError.value = ''
  try {
    const { data } = await authApi.register({
      email: regForm.value.email,
      code: regForm.value.code,
      password: regForm.value.password
    })
    auth.setAuth(data); router.push('/dashboard')
  } catch (e) { regError.value = translateBackendError(e.response?.data?.message, authT.value.errRegFailed) }
  finally { regLoading.value = false }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap');
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8edf8;
  font-family: 'Roboto', sans-serif;
  transition: background 0.3s;

  /* Тёмная тема — чёрно-золотая */
  &.dark {
    background: #0e0e10;

    .panel--white {
      background: #18181d;
    }

    .form-inner {
      h2 { color: #f0f0f0; }
    }

    .subtitle { color: #606070; }
    .brand { color: #c9a84c; }

    .input {
      background: #242430;
      color: #f0f0f0;
      &::placeholder { color: #606070; }
      &:focus { box-shadow: 0 0 0 2.5px rgba(201,168,76,0.4); }
    }

    .btn-main {
      background: linear-gradient(135deg, #d4a830 0%, #f0c84a 60%, #c9a030 100%);
      color: #0a0a0b;
      box-shadow: 0 4px 20px rgba(201,168,76,0.4);
    }

    /* Жёлто-золотой градиент вместо синего */
    .panel--blue {
      background: linear-gradient(145deg, #f0c84a 0%, #c9a030 30%, #8a6010 65%, #3a2800 100%);
    }

    /* Текст на жёлтой панели — белый */
    .blue-content {
      h2 { color: #ffffff; text-shadow: 0 2px 20px rgba(0,0,0,0.35); }
      p { color: rgba(255,255,255,0.85); }
    }

    .btn-outline {
      border-color: rgba(255,255,255,0.7);
      color: #ffffff;
      &:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.95); color: #ffffff; }
    }

    .link-btn { color: #c9a84c; &:hover { color: #e8c96a; } }

    .alert--error { background: #2a1010; border-color: #5a2020; color: #f08080; }
    .alert--info  { background: #1a1400; border-color: #3a2800; color: #c9a030; }
    .alert-close  { color: #f08080; }
  }
}

.auth-container {
  position: relative;
  width: min(960px, 95vw);
  height: 580px;
  border-radius: 24px;
  box-shadow: 0 32px 80px rgba(30, 40, 120, 0.22);
  overflow: hidden;
}

/* ---- Кнопка закрытия ---- */
.close-btn {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 1000;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.9);
  transition: background 0.2s, transform 0.18s, color 0.2s, border-color 0.2s;
  text-decoration: none;
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.28);
    border-color: rgba(255, 255, 255, 0.5);
    color: #fff;
    transform: scale(1.1);
    text-decoration: none;
  }

  &:active {
    transform: scale(0.96);
  }

  /* Светлая тема — тёмный крест */
  .auth-page:not(.dark) & {
    background: rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.15);
    color: rgba(30, 30, 50, 0.7);

    &:hover {
      background: rgba(0, 0, 0, 0.14);
      color: rgba(30, 30, 50, 1);
    }
  }
}

/* ---- Белая панель ---- */
.panel--white {
  position: absolute;
  inset: 0;
  background: #fff;
  border-radius: 24px;
  z-index: 1;
}

/* ---- Слоты форм ---- */
.form-slot {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 48px;
  transition: opacity 0.25s ease;

  &--left  { left: 0; }
  &--right { right: 0; }

  &--faded {
    opacity: 0;
    pointer-events: none;
  }
}

.form-inner {
  width: 100%;
  max-width: 340px;
}

.brand {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #3b5bdb;
  margin-bottom: 28px;
  letter-spacing: 0.5px;
}

h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 6px;
  letter-spacing: -0.3px;
}

.subtitle {
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #9ca3af;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 16px;
}

.input {
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-radius: 10px;
  background: #f1f5ff;
  font-size: 14px;
  font-family: inherit;
  color: #111827;
  outline: none;
  transition: box-shadow 0.2s;

  &:focus { box-shadow: 0 0 0 2.5px rgba(59, 91, 219, 0.35); }
  &::placeholder { color: #9ca3af; }
}

.form-options {
  margin-bottom: 24px;
  margin-top: -4px;
}

.link-btn {
  background: none;
  border: none;
  color: #3b5bdb;
  font-size: 12.5px;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  text-decoration: underline;
  &:hover { color: #1d4ed8; }
}

.btn-main {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4f6ef7 0%, #2563eb 60%, #1e3eb8 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.5px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  transition: opacity 0.2s, transform 0.1s;
  box-shadow: 0 4px 20px rgba(59, 91, 219, 0.35);

  &:hover { opacity: 0.92; }
  &:active { transform: scale(0.98); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.hint {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 14px;
}

/* ---- Поле с иконкой ---- */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input--with-icon {
  padding-right: 44px;
}

.eye-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
  line-height: 1;

  &:hover { color: #3b5bdb; }

  .auth-page.dark & {
    color: #606070;
    &:hover { color: #c9a84c; }
  }
}

/* ---- Алерты ---- */
.alert {
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 16px;

  &--error {
    background: #fff1f1;
    color: #c0392b;
    border: 1px solid #fca5a5;
    padding: 12px 12px 12px 16px;
    display: flex;
    align-items: flex-start;
    gap: 8px;

    span { flex: 1; line-height: 1.5; font-weight: 500; }
  }

  &--info {
    background: #dbeafe;
    color: #1e40af;
    padding: 11px 16px;
  }
}

.alert-close {
  background: none;
  border: none;
  color: #c0392b;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  opacity: 0.5;
  transition: opacity 0.15s;
  flex-shrink: 0;
  margin-top: -2px;

  &:hover { opacity: 1; }
}

/* Анимация появления алерта */
.alert-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.alert-slide-leave-active {
  transition: all 0.2s ease;
}
.alert-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
.alert-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* ---- Синяя панель ---- */
.panel--blue {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  z-index: 2;
  border-radius: 0 24px 24px 0;
  background: linear-gradient(145deg, #7b9cff 0%, #3b5bdb 35%, #1e3eb8 70%, #1a1f6e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.7s cubic-bezier(0.77, 0, 0.175, 1),
              border-radius 0.7s cubic-bezier(0.77, 0, 0.175, 1);

  .auth-container.is-register & {
    left: 0;
    border-radius: 24px 0 0 24px;
  }
}

.blue-content {
  position: absolute;
  text-align: center;
  padding: 0 48px;
  color: white;
  transition: opacity 0.3s ease;

  &--hidden {
    opacity: 0;
    pointer-events: none;
  }

  h2 {
    font-family: 'Montserrat', sans-serif;
    color: white;
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 18px;
    letter-spacing: -0.5px;
    line-height: 1.15;
    text-shadow: 0 2px 16px rgba(0,0,0,0.18);
  }

  p {
    font-size: 14px;
    line-height: 1.8;
    color: rgba(255,255,255,0.82);
    margin-bottom: 36px;
    max-width: 280px;
  }
}

.btn-outline {
  padding: 13px 44px;
  background: transparent;
  border: 2px solid rgba(255,255,255,0.85);
  border-radius: 32px;
  color: white;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.5px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s, color 0.2s, border-color 0.2s;

  &:hover {
    background: white;
    color: #3b5bdb;
    border-color: white;
  }
}

/* ---- Адаптив ---- */
@media (max-width: 680px) {
  .auth-container {
    height: auto;
    min-height: 100dvh;
    border-radius: 0;
    width: 100vw;
  }

  .panel--blue {
    position: relative;
    width: 100%;
    left: 0 !important;
    height: 220px;
    border-radius: 0 !important;
  }

  .form-slot {
    position: relative;
    width: 100%;
    height: auto;
    padding: 40px 28px;
  }

  .form-slot--faded { display: none; }

  .panel--white {
    display: flex;
    flex-direction: column-reverse;
  }


}
</style>