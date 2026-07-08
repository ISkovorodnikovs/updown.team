<script setup>
import { computed } from 'vue'
const L = computed(() => (localStorage.getItem('ud-lang') || 'en') === 'ru')
</script>

<template>
  <div class="an-stub">
    <h1>{{ L ? 'Аналитика' : 'Analytics' }}</h1>
    <div class="an-stub__box">
      🚧 {{ L ? 'Раздел в разработке. Скоро здесь появится продвинутая аналитика.' : 'This section is under development. Advanced analytics coming soon.' }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.an-stub { padding: 4px; max-width: 700px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 26px; font-weight: 800; margin: 0 0 16px; }
  &__box { background: #B9770E18; border: 1px solid #B9770E55; color: #E59819; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.5; } }
</style>
