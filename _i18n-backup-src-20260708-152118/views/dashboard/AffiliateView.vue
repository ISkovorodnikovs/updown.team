<script setup>
import { computed } from 'vue'
import B2BSection from '@/components/B2BSection.vue'

const L = computed(() => (localStorage.getItem('ud-lang') || 'en') === 'ru')
const data = computed(() => L.value ? ru : en)

const ru = {
  title: 'Аффилиат — зарабатывайте, приводя клиентов',
  tagline: 'Приводите людей и партнёров, которые покупают продукты UpDown, и получайте вознаграждение. Подходит блогерам, трейдерам с аудиторией, владельцам сообществ и тем, кто умеет приводить B2B-партнёров.',
  blocks: [
    { icon: '🔗', h: 'Реферальная программа', p: 'Персональная ссылка и бот. Каждый приведённый клиент, купивший продукт, приносит вам вознаграждение. Прозрачный учёт в кабинете.' },
    { icon: '🤝', h: 'B2B-партнёры', p: 'Приводите не только пользователей, но и партнёров на White Label и разработку — это другой масштаб дохода.' },
    { icon: '📈', h: 'Статистика в реальном времени', p: 'Видите переходы, конверсию, заработок и баланс прямо в личном кабинете. Никаких чёрных ящиков.' },
  ],
  bullets: [
    'Вознаграждение с каждой покупки приведённого клиента',
    'Свой бот-помощник для аудитории',
    'Прозрачная статистика: клики, конверсия, баланс',
    'Возможность приводить B2B-партнёров на крупные сделки',
  ],
}
const en = {
  title: 'Affiliate — earn by bringing clients',
  tagline: 'Bring people and partners who buy UpDown products and get rewarded. Great for bloggers, traders with an audience, community owners and those who can bring B2B partners.',
  blocks: [
    { icon: '🔗', h: 'Referral program', p: 'Personal link and bot. Every referred client who buys a product earns you a reward. Transparent tracking in your dashboard.' },
    { icon: '🤝', h: 'B2B partners', p: 'Bring not only users but also partners for White Label and development — a different scale of income.' },
    { icon: '📈', h: 'Real-time stats', p: 'See clicks, conversion, earnings and balance right in your dashboard. No black boxes.' },
  ],
  bullets: [
    'Reward on every purchase by a referred client',
    'Your own helper bot for your audience',
    'Transparent stats: clicks, conversion, balance',
    'Bring B2B partners for large deals',
  ],
}
</script>

<template>
  <B2BSection source="affiliate" :title="data.title" :tagline="data.tagline" :blocks="data.blocks" :bullets="data.bullets" />
</template>
