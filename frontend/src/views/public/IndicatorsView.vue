<template>
  <PublicLayout>
    <div class="pub-wrap">
      <section class="pub-hero">
        <div class="pub-label">{{ t.catalog.label }}</div>
        <h1 class="pub-h1">{{ t.catalog.title }}</h1>
        <p class="pub-lead">{{ t.catalog.sub }}</p>
      </section>

      <!-- Путь: от общей картины к сценарию -->
      <section class="ic-path" :aria-label="t.catalog.pathTitle">
        <div class="ic-path__title">{{ t.catalog.pathTitle }}</div>
        <ol class="ic-path__list">
          <li v-for="(p, i) in t.catalog.path" :key="i" class="ic-path__step">
            <span class="ic-path__num pub-tab">{{ i + 1 }}</span>
            <span class="ic-path__body">
              <b>{{ p.step }}</b>
              <small>{{ p.tools }}</small>
            </span>
          </li>
        </ol>
      </section>

      <section class="pub-section">
        <h2 class="pub-h2">{{ t.catalog.allTitle }}</h2>
        <div class="ic-grid">
          <router-link v-for="it in list" :key="it.slug" :to="lp('/indicators/' + it.slug)" class="ic-card pub-card" :class="{ 'ic-card--wide': it.flagship }">
            <div class="ic-card__shot">
              <img :src="it.flagship ? it.img : it.thumb" :alt="fill(t.ind.shotAlt, { name: it.name })" loading="lazy" width="720" height="232" />
            </div>
            <div class="ic-card__body">
              <div class="ic-card__tags">
                <span v-if="it.flagship" class="pub-chip pub-chip--solid">{{ t.catalog.flagship }}</span>
                <span v-if="it.free" class="pub-chip">{{ t.catalog.freeBadge }}</span>
              </div>
              <h3 class="pub-h3">{{ it.short }}</h3>
              <p class="ic-card__tagline">{{ tx(it.slug).tagline }}</p>
              <p v-if="it.flagship" class="ic-card__lead">{{ tx(it.slug).lead }}</p>
              <div class="ic-card__foot">
                <span class="ic-card__price pub-tab"><b>{{ priceOf(it.id, it.price) }}</b> {{ t.catalog.perMonth }}</span>
                <span class="ic-card__more">{{ t.catalog.more }} <span class="pub-arr">→</span></span>
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <section class="pub-section">
        <div class="ic-cta pub-card">
          <div class="ic-cta__text">
            <h2 class="pub-h2">{{ t.catalog.ctaTitle }}</h2>
            <p class="pub-lead">{{ t.catalog.ctaSub }}</p>
          </div>
          <router-link to="/register?get=magnet" class="pub-btn pub-btn--gold pub-btn--lg">{{ t.catalog.ctaBtn }}</router-link>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup>
import { computed } from 'vue'
import PublicLayout from '@/components/public/PublicLayout.vue'
import { useT, lang } from '@/i18n'
import dict from '@/content/publicText'
import { INDICATORS, INDICATOR_TEXT } from '@/content/indicators'
import { lp, fill } from '@/utils/publicLang'
import { usePublicCatalog } from '@/composables/usePublicCatalog'

const t = useT(dict)
const { priceOf, productById } = usePublicCatalog()
// Скрытые в базе (выключенные) индикаторы не показываем, когда каталог загрузился
const list = computed(() => INDICATORS.filter((i) => {
  const p = productById(i.id)
  return !p || p.isActive !== false
}))
const tx = (slug) => (INDICATOR_TEXT[lang.value] || INDICATOR_TEXT.en)[slug] || INDICATOR_TEXT.en[slug]
</script>

<style scoped>
.ic-path { margin-top: 28px; border: 1px solid var(--line); border-radius: 16px; background: var(--bg-2); padding: 18px 20px; display: grid; gap: 12px; }
.ic-path__title { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; color: var(--text-2); }
.ic-path__list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.ic-path__step { display: flex; gap: 12px; align-items: flex-start; min-width: 0; position: relative; }
.ic-path__num { flex: 0 0 auto; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: rgba(var(--accent-rgb), .14); color: var(--accent); font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 13px; }
.ic-path__body { display: grid; gap: 2px; min-width: 0; }
.ic-path__body b { font-size: 14px; }
.ic-path__body small { color: var(--text-3); font-size: 12.5px; line-height: 1.4; }

.ic-grid { margin-top: 22px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.ic-card.ic-card--wide { grid-column: 1 / -1; flex-direction: row; }
.ic-card.ic-card--wide .ic-card__shot { flex: 0 0 64%; aspect-ratio: auto; border-bottom: none; border-inline-end: 1px solid var(--line); }
.ic-card.ic-card--wide .ic-card__body { padding: 26px 28px; justify-content: center; }
.ic-card.ic-card--wide .pub-h3 { font-size: 24px; }
.ic-card.ic-card--wide .ic-card__tagline { font-size: 15.5px; }
.ic-card { display: flex; flex-direction: column; overflow: hidden; color: var(--text); transition: border-color .15s, transform .15s; }
.ic-card:hover { border-color: rgba(var(--accent-rgb), .55); transform: translateY(-2px); }
.ic-card__shot { aspect-ratio: 720 / 232; background: #0b0d12; border-bottom: 1px solid var(--line); overflow: hidden; }
.ic-card__shot img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
.ic-card__body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.ic-card__tags { display: flex; gap: 6px; min-height: 22px; }
.ic-card__tagline { color: var(--text-2); font-size: 14px; margin: 0; }
.ic-card__lead { color: var(--text-3); font-size: 14px; margin: 0; }
.ic-card__foot { margin-top: auto; padding-top: 10px; display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.ic-card__price { color: var(--text-3); font-size: 13px; }
.ic-card__price b { color: var(--text); font-family: 'Montserrat', sans-serif; font-size: 20px; }
.ic-card__more { color: var(--accent); font-weight: 700; font-size: 13px; white-space: nowrap; }

.ic-cta { padding: 28px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; background: linear-gradient(120deg, rgba(var(--accent-rgb), .12), transparent 60%), var(--surface); border-color: rgba(var(--accent-rgb), .35); }
.ic-cta__text { display: grid; gap: 8px; min-width: 0; flex: 1 1 380px; }

@media (max-width: 900px) {
  .ic-path__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ic-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ic-card.ic-card--wide { flex-direction: column; }
  .ic-card.ic-card--wide .ic-card__shot { flex: none; aspect-ratio: 1600 / 484; border-inline-end: none; border-bottom: 1px solid var(--line); }
  .ic-card__tags:empty { display: none; }
}
@media (max-width: 520px) { .ic-path__list { grid-template-columns: 1fr; } .ic-grid { grid-template-columns: 1fr; } .ic-cta .pub-btn { width: 100%; } }
</style>
