<script setup>
import { useT } from '@/i18n'
const dict = {
  en: { title: 'Analytics', soon: 'This section is under development. Advanced analytics coming soon.' },
  ru: { title: 'Аналитика', soon: 'Раздел в разработке. Скоро здесь появится продвинутая аналитика.' },
  de: { title: 'Analytik', soon: 'Dieser Bereich ist in Entwicklung. Erweiterte Analytik folgt in Kürze.' },
  es: { title: 'Analítica', soon: 'Esta sección está en desarrollo. Pronto habrá analítica avanzada.' },
  it: { title: 'Analisi', soon: 'Questa sezione è in sviluppo. Presto arriveranno analisi avanzate.' },
  pt: { title: 'Análises', soon: 'Esta seção está em desenvolvimento. Em breve, análises avançadas.' },
  zh: { title: '分析', soon: '该板块正在开发中，高级分析即将上线。' },
  ar: { title: 'التحليلات', soon: 'هذا القسم قيد التطوير. تحليلات متقدمة قريباً.' },
}
const t = useT(dict)
</script>

<template>
  <div class="an-stub">
    <h1>{{ t.title }}</h1>
    <div class="an-stub__box">
      🚧 {{ t.soon }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.an-stub { padding: 4px; max-width: 700px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 26px; font-weight: 800; margin: 0 0 16px; }
  &__box { background: #B9770E18; border: 1px solid #B9770E55; color: #E59819; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.5; } }
</style>
