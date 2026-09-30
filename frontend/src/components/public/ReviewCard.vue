<template>
  <article class="rv-card pub-card" :class="{ 'rv-card--feature': r.feature && !compact }">
    <span class="pub-chip rv-card__tag">{{ t.reviewsPage.tags[r.tag] }}</span>
    <blockquote class="rv-card__text">{{ text }}</blockquote>
    <img v-if="r.img && !compact" class="rv-card__img" :src="r.img" :alt="t.reviewsPage.tags[r.tag]" loading="lazy" />
    <div class="rv-card__who">
      <span class="rv-card__ava" aria-hidden="true">{{ initial }}</span>
      <div class="rv-card__meta">
        <div class="rv-card__name" dir="auto">{{ name }}</div>
        <div class="rv-card__date">{{ meta }}</div>
      </div>
    </div>
    <div v-if="lang !== 'ru'" class="rv-card__tr">{{ t.reviewsPage.translated }}</div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useT, lang, currentLocale } from '@/i18n'
import dict from '@/content/siteText'
import { REVIEWS } from '@/content/reviews'

const props = defineProps({ index: { type: Number, required: true }, compact: Boolean })
const t = useT(dict)
const r = computed(() => REVIEWS[props.index])
const text = computed(() => t.value.reviewsPage.items[props.index])

const name = computed(() => {
  const a = r.value.author
  if (typeof a === 'string') return t.value.reviewsPage[a]
  return lang.value === 'ru' ? a.ru : lang.value === 'uk' ? a.uk : a.lat
})
const initial = computed(() => String(name.value || '?').trim()[0].toUpperCase())
const meta = computed(() => {
  const d = r.value.date
  let s
  try {
    s = d.length === 7
      ? new Date(d + '-15').toLocaleDateString(currentLocale(), { month: 'long', year: 'numeric', timeZone: 'UTC' })
      : new Date(d + 'T12:00:00Z').toLocaleDateString(currentLocale(), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  } catch { s = d }
  return r.value.sub ? `${t.value.reviewsPage[r.value.sub]} · ${s}` : s
})
</script>

<style>
.rv-card { padding: 20px; display: flex; flex-direction: column; gap: 14px; min-width: 0; transition: border-color .15s; }
.rv-card:hover { border-color: rgba(var(--accent-rgb), .45); }
.rv-card--feature { border-color: rgba(var(--accent-rgb), .4); background: linear-gradient(180deg, rgba(var(--accent-rgb), .07), transparent 60%), var(--surface); }
.rv-card__tag { align-self: flex-start; }
.rv-card__text { margin: 0; font-size: 15px; line-height: 1.6; color: var(--text); }
.rv-card--feature .rv-card__text { font-size: 16.5px; }
.rv-card__text::before { content: '“'; font-family: 'Montserrat', sans-serif; font-weight: 800; color: var(--accent); font-size: 34px; line-height: 0; vertical-align: -12px; margin-inline-end: 4px; }
.rv-card__img { width: 100%; max-height: 360px; object-fit: cover; object-position: top; border-radius: 10px; border: 1px solid var(--line); display: block; }
.rv-card__who { margin-top: auto; display: flex; align-items: center; gap: 10px; min-width: 0; }
.rv-card__ava { flex: 0 0 auto; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font: 800 14px 'Montserrat', sans-serif; color: var(--on-accent); background: linear-gradient(135deg, var(--accent-2), var(--accent)); }
.rv-card__meta { min-width: 0; }
.rv-card__name { font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rv-card__date { color: var(--text-3); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rv-card__tr { color: var(--text-3); font-size: 11.5px; font-style: italic; margin-top: -6px; }
</style>
