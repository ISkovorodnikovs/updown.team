<script setup>
import { computed } from 'vue'
import B2BSection from '@/components/B2BSection.vue'

const L = computed(() => (localStorage.getItem('ud-lang') || 'en') === 'ru')
const data = computed(() => L.value ? ru : en)

const ru = {
  title: 'White Label — сигналы под вашим брендом',
  tagline: 'Франшиза UpDown: мы поставляем профессиональные торговые сигналы напрямую в ваши Telegram-каналы, а вы продаёте доступ и зарабатываете под собственным брендом. Любые биржи и тикеры с TradingView — крипта, валюта, сырьё, золото.',
  blocks: [
    { icon: '📡', h: 'Сигналы в ваш канал', p: 'Поставляем сигналы напрямую в ваш Telegram-канал. Любые инструменты: крипта, форекс, сырьё, золото. Вы продаёте доступ так, как удобно вам.' },
    { icon: '🎯', h: 'Точные настройки', p: 'Один канал — одно направление, один таймфрейм, один класс активов. Формат сообщений, эмодзи, зоны входа, тейки — всё настраивается под вас.' },
    { icon: '📊', h: 'Статистика и отчётность', p: 'Прозрачная аналитика по каждому каналу: win/loss, ROI, PnL, достижение тейков, рост депозита. Отчёты за любой период.' },
  ],
  bullets: [
    'Базовая стоимость канала — от 500 USDT/мес',
    'Гибкие условия: золото и скальпинг — отдельные опции',
    'Шаблоны сообщений с превью — вы видите, как сигнал выглядит в канале',
    'Личное сопровождение и настройка с нашей стороны',
    'Возможность подключить несколько каналов под разные стратегии',
  ],
}
const en = {
  title: 'White Label — signals under your brand',
  tagline: 'UpDown franchise: we deliver professional trading signals straight into your Telegram channels, and you sell access and earn under your own brand. Any exchange and ticker from TradingView — crypto, forex, commodities, gold.',
  blocks: [
    { icon: '📡', h: 'Signals to your channel', p: 'We deliver signals straight to your Telegram channel. Any instruments: crypto, forex, commodities, gold. You sell access however you like.' },
    { icon: '🎯', h: 'Precise setup', p: 'One channel — one direction, one timeframe, one asset class. Message format, emojis, entry zones, targets — all configurable for you.' },
    { icon: '📊', h: 'Statistics & reporting', p: 'Transparent analytics per channel: win/loss, ROI, PnL, target hits, deposit growth. Reports for any period.' },
  ],
  bullets: [
    'Base channel price — from 500 USDT/mo',
    'Flexible terms: gold and scalping are separate options',
    'Message templates with preview — see how the signal looks in the channel',
    'Personal onboarding and setup from our side',
    'Connect multiple channels for different strategies',
  ],
}
</script>

<template>
  <B2BSection source="whitelabel" :title="data.title" :tagline="data.tagline" :blocks="data.blocks" :bullets="data.bullets" />
</template>
