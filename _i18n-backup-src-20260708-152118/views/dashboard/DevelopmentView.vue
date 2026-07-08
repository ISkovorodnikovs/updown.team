<script setup>
import { computed } from 'vue'
import B2BSection from '@/components/B2BSection.vue'

const L = computed(() => (localStorage.getItem('ud-lang') || 'en') === 'ru')
const data = computed(() => L.value ? ru : en)

const ru = {
  title: 'Разработка — ваши идеи под ключ',
  tagline: 'Мы становимся вашими разработчиками: индикаторы, торговые боты, системы, стратегии торговли и автоматизация под ваши задачи. От доработки существующего до создания продукта с нуля.',
  blocks: [
    { icon: '📐', h: 'Индикаторы TradingView', p: 'Разработка кастомных индикаторов на Pine Script под вашу методологию: уровни, зоны, прогнозные модели, алерты.' },
    { icon: '🤖', h: 'Торговые боты и системы', p: 'Боты, автоматизация сигналов, торговые системы и интеграции. Реализуем вашу стратегию в работающий продукт.' },
    { icon: '🧠', h: 'Стратегии и бэктест', p: 'Формализуем и протестируем вашу торговую стратегию, оптимизируем параметры, соберём статистику.' },
  ],
  bullets: [
    'Доработка существующих инструментов или разработка с нуля',
    'Pine Script, боты, автоматизация, интеграции',
    'Прозрачная оценка объёма и стоимости под задачу',
    'Постоянная поддержка и обновления',
  ],
}
const en = {
  title: 'Development — your ideas, turnkey',
  tagline: 'We become your developers: indicators, trading bots, systems, trading strategies and automation for your needs. From improving existing tools to building a product from scratch.',
  blocks: [
    { icon: '📐', h: 'TradingView indicators', p: 'Custom Pine Script indicators for your methodology: levels, zones, predictive models, alerts.' },
    { icon: '🤖', h: 'Trading bots & systems', p: 'Bots, signal automation, trading systems and integrations. We turn your strategy into a working product.' },
    { icon: '🧠', h: 'Strategies & backtest', p: 'We formalize and test your trading strategy, optimize parameters and gather statistics.' },
  ],
  bullets: [
    'Improve existing tools or build from scratch',
    'Pine Script, bots, automation, integrations',
    'Transparent scope and cost estimate per task',
    'Ongoing support and updates',
  ],
}
</script>

<template>
  <B2BSection source="development" :title="data.title" :tagline="data.tagline" :blocks="data.blocks" :bullets="data.bullets" />
</template>
