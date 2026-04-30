<template>
  <div class="apply-page">
    <div class="apply-container">
      <router-link to="/" style="color:var(--primary);font-size:14px">← На главную</router-link>
      <div class="card" style="margin-top:24px">
        <div class="apply-header">
          <h1>Стать партнёром</h1>
          <p>Заполните форму и мы рассмотрим вашу заявку в течение 24 часов</p>
        </div>

        <div v-if="!auth.isAuthenticated" class="alert alert--info">
          Для подачи заявки необходимо <router-link to="/login">войти</router-link> или
          <router-link to="/register">зарегистрироваться</router-link>
        </div>

        <div v-else-if="submitted" class="alert alert--success" style="font-size:16px">
          🎉 Заявка отправлена! Мы уведомим вас по email о принятом решении.
        </div>

        <div v-else-if="existing">
          <div :class="['alert', existing.status === 'approved' ? 'alert--success' : existing.status === 'rejected' ? 'alert--error' : 'alert--info']">
            <strong>Статус вашей заявки: {{ existing.status }}</strong>
            <p v-if="existing.rejectionReason">Причина: {{ existing.rejectionReason }}</p>
          </div>
        </div>

        <form v-else @submit.prevent="submit" style="margin-top:24px">
          <div v-if="error" class="alert alert--error">{{ error }}</div>
          <div class="form-group">
            <label>Название компании / проекта *</label>
            <input class="input" v-model="form.companyName" placeholder="ООО Ромашка" required />
          </div>
          <div class="form-group">
            <label>Описание *</label>
            <textarea class="input" v-model="form.description"
              placeholder="Расскажите о вашем бизнесе, целевой аудитории и зачем вам нужен партнёрский бот..."
              rows="6" required></textarea>
          </div>
          <button class="btn btn--primary btn--lg btn--full" :disabled="loading">
            {{ loading ? 'Отправляем...' : 'Отправить заявку' }}
          </button>
        </form>
      </div>

      <!-- Benefits -->
      <div class="benefits">
        <h3>Что вы получите</h3>
        <div class="benefit" v-for="b in benefits" :key="b.icon">
          <span class="benefit__icon">{{ b.icon }}</span>
          <div>
            <strong>{{ b.title }}</strong>
            <p>{{ b.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { partnersApi } from '@/api'

const auth = useAuthStore()
const loading = ref(false)
const submitted = ref(false)
const error = ref('')
const existing = ref(null)
const form = ref({ companyName: '', description: '' })

const benefits = [
  { icon: '🤖', title: 'Telegram-бот', desc: 'Свой бот с настраиваемыми кнопками и приветствием' },
  { icon: '📊', title: 'Аналитика', desc: 'Статистика пользователей, переходов и конверсии' },
  { icon: '📢', title: 'Рассылки', desc: 'Отправка сообщений всем пользователям вашего бота' },
  { icon: '🎫', title: 'Поддержка', desc: 'Приоритетная поддержка через систему тикетов' },
]

onMounted(async () => {
  if (auth.isAuthenticated) {
    try {
      const { data } = await partnersApi.myApplication()
      if (data) existing.value = data
    } catch {}
  }
})

async function submit() {
  loading.value = true; error.value = ''
  try {
    await partnersApi.apply(form.value)
    submitted.value = true
  } catch (e) { error.value = e.response?.data?.message || 'Ошибка отправки' }
  finally { loading.value = false }
}
</script>

<style lang="scss" scoped>
.apply-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: 40px 24px;
}

.apply-container {
  max-width: 700px;
  margin: 0 auto;
}

.apply-header {
  margin-bottom: 24px;
  h1 { font-size: 26px; font-weight: 700; }
  p { color: var(--text-muted); margin-top: 6px; }
}

.benefits {
  margin-top: 32px;
  h3 { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--border);

  &__icon { font-size: 28px; }
  strong { display: block; font-weight: 600; margin-bottom: 4px; }
  p { font-size: 14px; color: var(--text-muted); }
}
</style>
