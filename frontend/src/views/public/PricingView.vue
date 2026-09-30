<template>
  <PublicLayout>
    <div class="pub-wrap">
      <section class="pub-hero">
        <div class="pub-label">{{ t.pricing.label }}</div>
        <h1 class="pub-h1">{{ t.pricing.title }}</h1>
        <p class="pub-lead">{{ t.pricing.sub }}</p>
      </section>

      <!-- Тарифы из базы; до загрузки — цены по умолчанию -->
      <section class="pr-plans">
        <article v-for="p in planList" :key="p.type" class="pr-plan pub-card" :class="{ 'is-popular': p.type === 'PRO' }">
          <div class="pr-plan__head">
            <h2 class="pr-plan__name">{{ p.name }}</h2>
            <span v-if="p.type === 'PRO'" class="pub-chip pub-chip--solid">{{ t.pricing.popular }}</span>
          </div>
          <div class="pr-plan__price pub-tab"><b>{{ p.price }}</b> {{ t.pricing.perMonth }}</div>
          <p v-if="p.desc" class="pr-plan__desc">{{ p.desc }}</p>
          <div class="pr-plan__inc">{{ t.pricing.includes }}</div>
          <ul v-if="p.features.length" class="pr-plan__list">
            <li v-for="f in p.features" :key="f"><span class="pr-check" aria-hidden="true">✓</span>{{ f }}</li>
          </ul>
          <p v-else class="pub-muted">{{ t.pricing.loading }}</p>
          <router-link to="/register?next=/dashboard/shop" class="pub-btn pub-btn--lg" :class="p.type === 'PRO' ? 'pub-btn--gold' : 'pub-btn--ghost'">{{ t.pricing.choose }}</router-link>
        </article>
      </section>
      <p class="pr-note">{{ t.pricing.discounts }}</p>

      <section class="pr-free pub-card">
        <div class="pr-free__text">
          <h2 class="pub-h3">{{ t.pricing.freeTitle }}</h2>
          <p>{{ t.pricing.freeText }}</p>
        </div>
        <router-link to="/register?get=magnet" class="pub-btn pub-btn--gold pub-btn--lg">{{ t.pricing.freeBtn }}</router-link>
      </section>

      <section class="pub-section">
        <h2 class="pub-h2">{{ t.pricing.singleTitle }}</h2>
        <div class="pr-single">
          <div class="pr-table pub-card">
            <router-link :to="lp('/indicators')" class="pr-row pr-row--link">
              <span class="pr-row__main"><b>{{ t.pricing.indicatorsRow }}</b><small>{{ t.pricing.indicatorsNote }}</small></span>
              <span class="pr-row__price pub-tab">{{ indicatorPrice }} {{ t.pricing.perMonth }}</span>
              <span class="pr-row__go">{{ t.pricing.seeAll }} <span class="pub-arr">→</span></span>
            </router-link>
            <div class="pr-row pr-row--group">{{ t.pricing.channelsTitle }}</div>
            <div v-for="c in t.pricing.channels" :key="c.name" class="pr-row">
              <span class="pr-row__main"><b>{{ c.name }}</b><small>{{ c.note }}</small></span>
              <span class="pr-row__price pub-tab">{{ c.price }} {{ t.pricing.perMonth }}</span>
            </div>
            <div class="pr-row">
              <span class="pr-row__main"><b>{{ t.pricing.eduTitle }}</b><small>{{ t.pricing.eduNote }}</small></span>
              <span class="pr-row__price pub-tab">{{ t.pricing.eduPrice }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="pub-section">
        <h2 class="pub-h2">{{ t.pricing.faqTitle }}</h2>
        <div class="pr-faq">
          <details v-for="(f, i) in t.pricing.faq" :key="i" class="pr-faq__item pub-card" :open="i === 0">
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup>
import { computed } from 'vue'
import PublicLayout from '@/components/public/PublicLayout.vue'
import { useT, tDb } from '@/i18n'
import dict from '@/content/publicText'
import { lp } from '@/utils/publicLang'
import { usePublicCatalog } from '@/composables/usePublicCatalog'

const t = useT(dict)
const { plans, priceOf } = usePublicCatalog()

const DEFAULT = [
  { type: 'START', name: 'START', price: 49 },
  { type: 'PRO', name: 'PRO', price: 99 },
  { type: 'ELITE', name: 'ELITE', price: 149 },
]

const planList = computed(() => {
  const list = Array.isArray(plans.value) ? plans.value.filter((p) => p.isActive !== false && !p.isTrial) : []
  if (!list.length) return DEFAULT.map((d) => ({ ...d, features: [], desc: '' }))
  return list
    .slice()
    .sort((a, b) => Number(a.price) - Number(b.price))
    .map((p) => ({
      type: p.type,
      name: tDb(p, 'name') || p.name,
      price: Number(p.price),
      desc: tDb(p, 'description'),
      features: (p.featuresTranslations && tDb(p, 'features')) || p.features || [],
    }))
})

// Цена индикатора (все индикаторы по единой цене)
const indicatorPrice = computed(() => priceOf('e1707cb0-3001-4bcb-9cc6-541c91fdee7c', 49))
</script>

<style scoped>
.pr-plans { margin-top: 28px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: stretch; }
.pr-plan { padding: 24px; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.pr-plan.is-popular { border-color: rgba(var(--accent-rgb), .55); background: linear-gradient(180deg, rgba(var(--accent-rgb), .1), transparent 45%), var(--surface); }
.pr-plan__head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.pr-plan__name { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 15px; letter-spacing: .16em; color: var(--accent); margin: 0; }
.pr-plan__price { color: var(--text-3); font-size: 14px; }
.pr-plan__price b { font-family: 'Montserrat', sans-serif; font-size: 42px; line-height: 1; color: var(--text); margin-inline-end: 4px; }
.pr-plan__desc { color: var(--text-2); font-size: 14px; margin: 0; }
.pr-plan__inc { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--text-3); margin-top: 4px; }
.pr-plan__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; flex: 1; align-content: start; }
.pr-plan__list li { display: flex; gap: 8px; font-size: 14px; }
.pr-check { color: var(--green); font-weight: 800; flex: 0 0 auto; }
.pr-plan .pub-btn { margin-top: auto; width: 100%; }
.pr-note { color: var(--text-3); font-size: 13px; margin: 14px 0 0; }

.pr-free { margin-top: 24px; padding: 22px 24px; display: flex; gap: 20px; align-items: center; justify-content: space-between; flex-wrap: wrap; border-style: dashed; border-color: rgba(var(--accent-rgb), .45); }
.pr-free__text { display: grid; gap: 6px; flex: 1 1 360px; min-width: 0; }
.pr-free__text p { color: var(--text-2); margin: 0; }

.pr-single { margin-top: 20px; }
.pr-table { overflow: hidden; }
.pr-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: 16px; align-items: center; padding: 16px 20px; border-top: 1px solid var(--line); color: var(--text); }
.pr-row:first-child { border-top: none; }
.pr-row--group { display: block; background: var(--bg-2); font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--text-3); padding-block: 10px; }
.pr-row--link:hover { background: rgba(var(--accent-rgb), .06); }
.pr-row__main { display: grid; gap: 2px; min-width: 0; }
.pr-row__main small { color: var(--text-3); font-size: 13px; }
.pr-row__price { font-family: 'Montserrat', sans-serif; font-weight: 700; white-space: nowrap; }
.pr-row__go { color: var(--accent); font-weight: 700; font-size: 13px; white-space: nowrap; }

.pr-faq { margin-top: 20px; display: grid; gap: 10px; }
.pr-faq__item { padding: 16px 20px; }
.pr-faq__item summary { cursor: pointer; font-weight: 700; list-style: none; }
.pr-faq__item summary::-webkit-details-marker { display: none; }
.pr-faq__item summary::after { content: '+'; float: inline-end; color: var(--accent); font-weight: 800; }
.pr-faq__item[open] summary::after { content: '−'; }
.pr-faq__item p { color: var(--text-2); margin: 10px 0 0; }

@media (max-width: 900px) { .pr-plans { grid-template-columns: 1fr; } }
@media (max-width: 560px) {
  .pr-row { grid-template-columns: minmax(0, 1fr) auto; }
  .pr-row__go { display: none; }
  .pr-free .pub-btn { width: 100%; }
}
</style>
