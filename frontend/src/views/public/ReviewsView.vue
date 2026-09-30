<template>
  <PublicLayout>
    <div class="pub-wrap">
      <section class="pub-hero">
        <div class="pub-label">{{ t.reviewsPage.label }}</div>
        <h1 class="pub-h1">{{ t.reviewsPage.title }}</h1>
        <p class="pub-lead">{{ t.reviewsPage.sub }}</p>
        <div class="pub-row rw-actions">
          <a :href="REVIEWS_TG" target="_blank" rel="noopener" class="pub-btn pub-btn--gold pub-btn--lg">{{ t.reviewsPage.allTg }} <span class="pub-arr">→</span></a>
          <router-link to="/register?get=magnet" class="pub-btn pub-btn--ghost pub-btn--lg">{{ t.reviewsPage.tryFree }}</router-link>
        </div>
        <div class="rw-stats">
          <div v-for="s in t.reviewsPage.stats" :key="s.label"><b>{{ s.num }}</b><span>{{ s.label }}</span></div>
        </div>
      </section>

      <div class="rw-chips" role="toolbar">
        <button v-for="f in FILTERS" :key="f" type="button" class="rw-chip" :aria-pressed="filter === f ? 'true' : 'false'" @click="setFilter(f)">
          {{ t.reviewsPage.filters[f] }}
        </button>
      </div>

      <!-- Колонки выравниваются по высоте: карточка идёт в самую короткую колонку, последняя тянется до низа -->
      <div ref="grid" class="rw-cols" :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }">
        <div v-for="(col, ci) in columns" :key="ci" class="rw-col">
          <ReviewCard v-for="i in col" :key="i" :index="i" :data-i="i" />
        </div>
      </div>
      <div v-if="hiddenCount > 0" class="rw-more">
        <button type="button" class="pub-btn pub-btn--ghost pub-btn--lg" @click="expanded = true">{{ fill(t.reviewsPage.showMore, { n: hiddenCount }) }}</button>
      </div>

      <section class="pub-section">
        <div class="pub-label">{{ t.reviewsPage.resultsLabel }}</div>
        <h2 class="pub-h2 rw-h2">{{ t.reviewsPage.resultsTitle }}</h2>
        <p class="pub-lead">{{ t.reviewsPage.resultsSub }}</p>
        <div class="rw-shots">
          <figure v-for="(src, i) in REVIEW_SHOTS" :key="src" class="rw-shot pub-card">
            <img :src="src" :alt="t.reviewsPage.shots[i]" loading="lazy" />
            <figcaption>{{ t.reviewsPage.shots[i] }}</figcaption>
          </figure>
        </div>
        <p class="rw-disc">{{ t.reviewsPage.disclaimer }}</p>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import PublicLayout from '@/components/public/PublicLayout.vue'
import ReviewCard from '@/components/public/ReviewCard.vue'
import { useT } from '@/i18n'
import dict from '@/content/siteText'
import { REVIEWS, REVIEW_SHOTS, REVIEWS_TG } from '@/content/reviews'
import { fill } from '@/utils/publicLang'

const t = useT(dict)
const FILTERS = ['all', 'ind', 'sig', 'edu', 'com']
const filter = ref('all')
const expanded = ref(false)
const width = ref(1200)
const MOBILE_SHOW = 3

const cols = computed(() => (width.value >= 1024 ? 3 : width.value >= 600 ? 2 : 1))
const visible = computed(() => REVIEWS.map((r, i) => ({ r, i })).filter(({ r }) => filter.value === 'all' || r.types.includes(filter.value)))
const shown = computed(() => (cols.value === 1 && !expanded.value ? visible.value.slice(0, MOBILE_SHOW) : visible.value))
const hiddenCount = computed(() => visible.value.length - shown.value.length)

// Высота карточки: измеренная в браузере, иначе примерная (текст + картинка)
const grid = ref(null)
const heights = ref({})
const weight = (i) => {
  if (heights.value[i]) return heights.value[i]
  const r = REVIEWS[i]
  const len = String(t.value.reviewsPage.items[i] || '').length
  return 120 + len * (cols.value === 3 ? 0.62 : 0.45) + (r.img ? 300 : 0)
}
const columns = computed(() => {
  const out = Array.from({ length: cols.value }, () => [])
  const h = Array(cols.value).fill(0)
  for (const { i } of shown.value) {
    let k = 0
    for (let c = 1; c < h.length; c++) if (h[c] < h[k]) k = c
    out[k].push(i); h[k] += weight(i) + 16
  }
  return out
})

// Меряем реальные высоты карточек (без растягивания) и раскладываем заново
async function measureCards() {
  await nextTick()
  const el = grid.value
  if (!el) return
  el.classList.add('is-measuring')
  const h = {}
  el.querySelectorAll('[data-i]').forEach((c) => { h[c.dataset.i] = c.offsetHeight })
  el.classList.remove('is-measuring')
  heights.value = h
}
let imgWait = null
function setFilter(f) { filter.value = f }
function measure() {
  const w = Math.min(window.innerWidth, 1200)
  if (w !== width.value) { width.value = w; heights.value = {} ; measureCards() }
}
watch([filter, expanded], () => measureCards())
onMounted(() => {
  width.value = Math.min(window.innerWidth, 1200)
  window.addEventListener('resize', measure)
  measureCards()
  // Картинки догружаются — перемеряем
  imgWait = () => measureCards()
  grid.value?.querySelectorAll('img').forEach((im) => { if (!im.complete) im.addEventListener('load', imgWait, { once: true }) })
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))
</script>

<style scoped>
.rw-actions { margin-top: 6px; }
.rw-stats { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 10px; }
.rw-stats div { display: grid; gap: 2px; }
.rw-stats b { font-family: 'Montserrat', sans-serif; font-size: 22px; font-variant-numeric: tabular-nums; }
.rw-stats span { color: var(--text-2); font-size: 13px; }
.rw-chips { display: flex; flex-wrap: wrap; gap: 8px; padding-block: 24px 20px; }
.rw-chip { background: transparent; border: 1px solid var(--line-2); color: var(--text-2); border-radius: 999px; padding: 7px 14px; font: 600 13px 'Roboto', sans-serif; cursor: pointer; }
.rw-chip[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.rw-cols { display: grid; gap: 16px; align-items: stretch; }
.rw-col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.rw-col > :deep(.rv-card:last-child) { flex-grow: 1; }
.rw-cols.is-measuring .rw-col > :deep(.rv-card:last-child) { flex-grow: 0; }
.rw-cols.is-measuring { align-items: start; }
.rw-more { display: flex; justify-content: center; padding-top: 16px; }
.rw-h2 { margin-top: 8px; margin-bottom: 8px; }
.rw-shots { margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 14px; }
.rw-shot { margin: 0; overflow: hidden; }
.rw-shot img { width: 100%; height: 190px; object-fit: cover; object-position: top; display: block; border-bottom: 1px solid var(--line); }
.rw-shot figcaption { padding: 10px 12px; font-size: 12.5px; color: var(--text-2); }
.rw-disc { color: var(--text-3); font-size: 12.5px; max-width: 90ch; margin: 22px 0 0; }
@media (max-width: 640px) {
  .rw-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .rw-stats b { font-size: 16px; }
  .rw-stats span { font-size: 11.5px; line-height: 1.35; }
  .rw-actions .pub-btn { flex: 1 1 auto; }
}
</style>
