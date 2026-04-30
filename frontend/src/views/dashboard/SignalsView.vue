<template>
  <div class="placeholder-page">
    <div class="placeholder-card">
      <div class="placeholder-icon">🚧</div>
      <h2>{{ title }}</h2>
      <p>{{ lang === 'ru' ? 'Этот раздел находится в разработке' : 'This section is under development' }}</p>
      <router-link to="/dashboard/shop" class="btn-primary">
        {{ lang === 'ru' ? 'Посмотреть тарифы' : 'View plans' }}
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const lang = computed(() => localStorage.getItem('ud-lang') || 'ru')
const title = 'SignalsView'.replace('View','').replace(/([A-Z])/g,' ').trim()
</script>
<style lang="scss" scoped>
.placeholder-page { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
.placeholder-card { text-align: center; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 60px 40px; max-width: 400px; }
.placeholder-icon { font-size: 48px; margin-bottom: 20px; }
h2 { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
p { color: var(--text-2); margin-bottom: 24px; }
.btn-primary { display: inline-block; padding: 12px 28px; background: var(--accent); color: #0a0a0b; border-radius: 10px; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; &:hover { opacity: 0.9; text-decoration: none; } }
</style>
