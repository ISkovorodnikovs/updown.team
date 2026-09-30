<template>
  <div v-if="key && text && ob.hintVisible(key)" class="ph">
    <span class="ph__icon">💡</span>
    <p class="ph__text">{{ text }}</p>
    <button class="ph__close" @click="ob.closeHint(key)">{{ t.hints.close }}</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/onboarding'

// Подсказка «что это за страница» — один раз на каждую страницу
const PAGES = {
  '/dashboard/access': 'access',
  '/dashboard/shop': 'shop',
  '/dashboard/signals': 'signals',
  '/dashboard/indicators': 'indicators',
  '/dashboard/education': 'education',
  '/dashboard/support': 'support',
}

const t = useT(dict)
const ob = useOnboardingStore()
const route = useRoute()
const key = computed(() => PAGES[route.path] || null)
const text = computed(() => (key.value ? t.value.hints[key.value] : ''))
</script>

<style scoped>
.ph {
  display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
  background: rgba(var(--accent-rgb), 0.08); border: 1px solid rgba(var(--accent-rgb), 0.3);
  border-radius: 12px; padding: 12px 14px;
}
.ph__icon { font-size: 18px; flex: 0 0 auto; }
.ph__text { flex: 1; font-size: 13.5px; line-height: 1.5; color: var(--text); margin: 0; }
.ph__close {
  flex: 0 0 auto; background: var(--accent); color: #0a0a0b; border: none; border-radius: 8px;
  padding: 7px 14px; font-weight: 700; font-size: 12.5px; cursor: pointer; font-family: 'Montserrat', sans-serif;
}
@media (max-width: 640px) {
  .ph { flex-wrap: wrap; }
  .ph__close { margin-inline-start: 30px; }
}
</style>
