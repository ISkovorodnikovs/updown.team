<script setup>
import { computed } from 'vue'

const L = computed(() => (localStorage.getItem('ud-lang') || 'en') === 'ru')
const d = computed(() => L.value ? ru : en)

const ru = {
  title: 'Копитрейдинг',
  badge: 'Скоро',
  tagline: 'Уже в ближайшее время — готовые торговые боты UpDown. Настройте их под свои стратегии, автоматизируйте сделки и ведите аналитику в одном месте.',
  blocks: [
    { icon: '🤖', h: 'Торговые боты', p: 'Подключайте готовых ботов и запускайте автоматическую торговлю по проверенным алгоритмам — без ручного контроля каждой сделки.' },
    { icon: '⚙️', h: 'Гибкая настройка', p: 'Настраивайте ботов под свою стратегию: риск, объёмы, инструменты и таймфреймы. Ваш стиль торговли — ваши правила.' },
    { icon: '📊', h: 'Аналитика результатов', p: 'Полная статистика по каждому боту: доходность, просадки, история сделок. Видите, что работает, и оптимизируете.' },
  ],
  soon: 'Раздел в активной разработке. Совсем скоро вы сможете подключать и настраивать торговых ботов прямо здесь.',
}
const en = {
  title: 'Copytrading',
  badge: 'Soon',
  tagline: 'Coming very soon — ready-made UpDown trading bots. Configure them for your strategies, automate trades and track analytics in one place.',
  blocks: [
    { icon: '🤖', h: 'Trading bots', p: 'Connect ready bots and run automated trading on proven algorithms — without manually watching every trade.' },
    { icon: '⚙️', h: 'Flexible setup', p: 'Tune bots to your strategy: risk, volumes, instruments and timeframes. Your trading style — your rules.' },
    { icon: '📊', h: 'Performance analytics', p: 'Full stats per bot: returns, drawdowns, trade history. See what works and optimize.' },
  ],
  soon: 'This section is in active development. Very soon you will be able to connect and configure trading bots right here.',
}
</script>

<template>
  <div class="cp">
    <div class="cp-hero">
      <div class="cp-titlerow">
        <h1>{{ d.title }}</h1>
        <span class="cp-badge">{{ d.badge }}</span>
      </div>
      <p class="cp-tagline">{{ d.tagline }}</p>
    </div>
    <div class="cp-blocks">
      <div v-for="(b, i) in d.blocks" :key="i" class="cp-block">
        <div class="cp-block__icon">{{ b.icon }}</div>
        <h3>{{ b.h }}</h3>
        <p>{{ b.p }}</p>
      </div>
    </div>
    <div class="cp-soon">🚧 {{ d.soon }}</div>
  </div>
</template>

<style scoped lang="scss">
.cp { padding: 4px; max-width: 900px; }
.cp-hero { margin-bottom: 24px; }
.cp-titlerow { display: flex; align-items: center; gap: 12px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 28px; font-weight: 800; margin: 0; } }
.cp-badge { background: var(--accent); color: #0a0a0b; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
.cp-tagline { color: var(--text-2); font-size: 15px; margin: 10px 0 0; line-height: 1.55; }
.cp-blocks { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap: 16px; margin-bottom: 22px; }
.cp-block { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 14px; padding: 20px;
  &__icon { font-size: 28px; margin-bottom: 10px; }
  h3 { font-family: 'Montserrat',sans-serif; font-size: 16px; font-weight: 800; margin: 0 0 6px; }
  p { color: var(--text-2); font-size: 13px; line-height: 1.55; margin: 0; } }
.cp-soon { background: #B9770E18; border: 1px solid #B9770E55; color: #E59819; border-radius: 12px; padding: 16px 18px; font-size: 14px; line-height: 1.5; }
</style>
