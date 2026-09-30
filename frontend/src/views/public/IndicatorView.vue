<template>
  <PublicLayout>
    <div v-if="it" class="pub-wrap">
      <nav class="ip-crumbs">
        <router-link :to="lp('/indicators')"><span class="pub-arr">←</span> {{ t.ind.back }}</router-link>
      </nav>

      <section class="ip-hero">
        <div class="ip-hero__text">
          <div class="ip-hero__tags">
            <span v-if="it.flagship" class="pub-chip pub-chip--solid">{{ t.catalog.flagship }}</span>
            <span v-if="it.free" class="pub-chip">{{ t.catalog.freeBadge }}</span>
            <span class="pub-label">TradingView</span>
          </div>
          <h1 class="pub-h1">{{ it.name }}</h1>
          <p class="ip-tagline">{{ tx.tagline }}</p>
          <p class="pub-lead">{{ tx.lead }}</p>
        </div>
        <aside class="ip-buy pub-card">
          <div class="ip-buy__price pub-tab"><b>{{ price }}</b> {{ t.catalog.perMonth }}</div>
          <router-link v-if="it.free" to="/register?get=magnet" class="pub-btn pub-btn--gold pub-btn--lg">{{ t.ind.getFree }}</router-link>
          <router-link :to="buyLink" class="pub-btn pub-btn--lg" :class="it.free ? 'pub-btn--ghost' : 'pub-btn--gold'">{{ fill(t.ind.buy, { price }) }}</router-link>
          <a :href="it.tv" target="_blank" rel="noopener" class="ip-buy__tv">{{ t.ind.openTv }} <span class="pub-arr">↗</span></a>
          <p class="pub-muted">{{ t.ind.priceNote }}</p>
        </aside>
      </section>

      <figure class="ip-shot">
        <img :src="it.img" :alt="fill(t.ind.shotAlt, { name: it.name })" width="1600" height="515" />
      </figure>

      <section class="ip-grid">
        <div class="ip-q pub-card">
          <div class="pub-label">{{ t.ind.question }}</div>
          <p class="ip-q__text">«{{ tx.question }}»</p>
          <p class="ip-q__role">{{ tx.role }}</p>
        </div>
        <div class="ip-helps pub-card">
          <h2 class="pub-h3">{{ t.ind.helps }}</h2>
          <ul>
            <li v-for="h in tx.helps" :key="h"><span class="ip-dot" aria-hidden="true"></span>{{ h }}</li>
          </ul>
        </div>
      </section>

      <section class="ip-grid ip-grid--3">
        <div class="ip-block pub-card">
          <h2 class="pub-h3">{{ t.ind.plans }}</h2>
          <div v-if="it.plans.length" class="ip-chips">
            <router-link v-for="p in it.plans" :key="p" :to="lp('/pricing')" class="pub-chip">{{ p }}</router-link>
          </div>
          <p v-else class="ip-note">{{ t.ind.noPlans }}</p>
        </div>
        <div class="ip-block pub-card">
          <h2 class="pub-h3">{{ t.ind.pairs }}</h2>
          <div class="ip-pairs">
            <router-link v-for="p in pairs" :key="p.slug" :to="lp('/indicators/' + p.slug)" class="ip-pair">
              <b>{{ p.short }}</b><small>{{ txOf(p.slug).tagline }}</small>
            </router-link>
          </div>
        </div>
        <div class="ip-block pub-card">
          <h2 class="pub-h3">{{ t.ind.how }}</h2>
          <ol class="ip-steps">
            <li v-for="(s, i) in t.ind.steps" :key="i"><span class="pub-tab">{{ i + 1 }}</span><span>{{ s }}</span></li>
          </ol>
        </div>
      </section>

      <p class="ip-disc">{{ t.ind.notAdvice }}</p>
    </div>
  </PublicLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from '@/components/public/PublicLayout.vue'
import { useT, lang } from '@/i18n'
import dict from '@/content/publicText'
import { INDICATOR_TEXT, indicatorBySlug } from '@/content/indicators'
import { lp, fill } from '@/utils/publicLang'
import { usePublicCatalog } from '@/composables/usePublicCatalog'

const t = useT(dict)
const route = useRoute()
const { priceOf } = usePublicCatalog()

const it = computed(() => indicatorBySlug(route.params.slug))
const txOf = (slug) => (INDICATOR_TEXT[lang.value] || INDICATOR_TEXT.en)[slug] || INDICATOR_TEXT.en[slug]
const tx = computed(() => (it.value ? txOf(it.value.slug) : {}))
const pairs = computed(() => (it.value?.pairs || []).map(indicatorBySlug).filter(Boolean))
const price = computed(() => (it.value ? priceOf(it.value.id, it.value.price) : 49))
const buyLink = '/register?next=/dashboard/shop'
</script>

<style scoped>
.ip-crumbs { padding-top: 28px; font-size: 14px; }
.ip-crumbs a { color: var(--text-2); }
.ip-crumbs a:hover { color: var(--accent); }
.ip-hero { padding-block: 24px 28px; display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 32px; align-items: start; }
.ip-hero__text { display: grid; gap: 14px; min-width: 0; }
.ip-hero__tags { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.ip-tagline { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 20px; color: var(--accent); margin: 0; }
.ip-buy { padding: 22px; display: grid; gap: 12px; }
.ip-buy__price { color: var(--text-3); font-size: 14px; }
.ip-buy__price b { font-family: 'Montserrat', sans-serif; font-size: 34px; color: var(--text); margin-inline-end: 4px; }
.ip-buy .pub-btn { width: 100%; }
.ip-buy__tv { color: var(--text-2); font-size: 14px; text-align: center; }
.ip-buy__tv:hover { color: var(--accent); }
.ip-buy .pub-muted { margin: 0; text-align: center; }

.ip-shot { margin: 0; border-radius: 16px; overflow: hidden; border: 1px solid var(--line); background: #0b0d12; }
.ip-shot img { display: block; width: 100%; height: auto; }

.ip-grid { margin-top: 20px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; }
.ip-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ip-q { padding: 24px; display: grid; gap: 12px; align-content: start; background: linear-gradient(160deg, rgba(var(--accent-rgb), .1), transparent 55%), var(--surface); border-color: rgba(var(--accent-rgb), .3); }
.ip-q__text { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: clamp(20px, 2.4vw, 26px); line-height: 1.25; margin: 0; text-wrap: balance; }
.ip-q__role { color: var(--text-2); margin: 0; }
.ip-helps { padding: 24px; display: grid; gap: 12px; align-content: start; }
.ip-helps ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.ip-helps li { display: flex; gap: 10px; align-items: baseline; }
.ip-dot { flex: 0 0 auto; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); transform: translateY(-2px); }
.ip-block { padding: 22px; display: grid; gap: 14px; align-content: start; min-width: 0; }
.ip-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.ip-note { color: var(--text-2); margin: 0; font-size: 14px; }
.ip-pairs { display: grid; gap: 8px; }
.ip-pair { display: grid; gap: 1px; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); color: var(--text); }
.ip-pair:hover { border-color: rgba(var(--accent-rgb), .5); }
.ip-pair small { color: var(--text-3); font-size: 12.5px; }
.ip-steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.ip-steps li { display: flex; gap: 10px; font-size: 14px; color: var(--text-2); }
.ip-steps li > span:first-child { flex: 0 0 auto; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; background: rgba(var(--accent-rgb), .14); color: var(--accent); font-weight: 800; font-size: 12px; }
.ip-disc { margin: 24px 0 0; color: var(--text-3); font-size: 13px; }

@media (max-width: 960px) {
  .ip-hero { grid-template-columns: 1fr; }
  .ip-grid--3 { grid-template-columns: 1fr 1fr; }
  .ip-grid--3 .ip-block:last-child { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  .ip-grid, .ip-grid--3 { grid-template-columns: 1fr; }
  .ip-shot { border-radius: 12px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .ip-shot img { height: 260px; width: auto; max-width: none; }
}
</style>
