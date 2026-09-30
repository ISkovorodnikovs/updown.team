<template>
  <PublicLayout>
    <div class="pub-wrap lg-wrap">
      <nav class="lg-tabs" :aria-label="t.nav.legal">
        <router-link v-for="k in PAGES" :key="k" :to="lp('/' + k)" class="lg-tab" :class="{ 'is-active': k === page }">{{ t.nav[k] }}</router-link>
      </nav>

      <article class="lg-doc">
        <header class="lg-head">
          <h1 class="pub-h1">{{ doc.title }}</h1>
          <p class="pub-muted">{{ fill(t.updated, { date: dateStr }) }}</p>
          <p class="pub-lead">{{ doc.intro }}</p>
        </header>

        <!-- Конфиденциальность: таблица данных -->
        <section v-if="page === 'privacy'" class="lg-sec">
          <h2 class="lg-h2">{{ doc.tableTitle }}</h2>
          <div class="lg-table pub-card">
            <div class="lg-row lg-row--head"><span>{{ doc.head[0] }}</span><span>{{ doc.head[1] }}</span></div>
            <div v-for="(r, i) in doc.rows" :key="i" class="lg-row"><span>{{ r[0] }}</span><span>{{ r[1] }}</span></div>
          </div>
        </section>

        <!-- Возвраты: когда да / когда нет -->
        <section v-if="page === 'refunds'" class="lg-sec lg-two">
          <div class="lg-box lg-box--yes pub-card">
            <h2 class="lg-h2">{{ doc.fullTitle }}</h2>
            <ul><li v-for="(x, i) in doc.full" :key="i">{{ x }}</li></ul>
          </div>
          <div class="lg-box lg-box--no pub-card">
            <h2 class="lg-h2">{{ doc.noTitle }}</h2>
            <ul><li v-for="(x, i) in doc.no" :key="i">{{ x }}</li></ul>
          </div>
        </section>

        <section v-for="(s, i) in doc.sections" :key="i" class="lg-sec">
          <h2 class="lg-h2">{{ s.h }}</h2>
          <p>{{ s.t }}</p>
        </section>

        <section class="lg-sec lg-contact pub-card">
          <h2 class="lg-h2">{{ t.contactsTitle }}</h2>
          <p>{{ t.contactsText }}</p>
        </section>
      </article>
    </div>
  </PublicLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from '@/components/public/PublicLayout.vue'
import { useT, currentLocale } from '@/i18n'
import dict, { LEGAL_DATE } from '@/content/legalText'
import { lp, fill } from '@/utils/publicLang'

const PAGES = ['terms', 'privacy', 'refunds']
const t = useT(dict)
const route = useRoute()
const page = computed(() => (PAGES.includes(route.meta.publicPage) ? route.meta.publicPage : 'terms'))
const doc = computed(() => t.value[page.value])
const dateStr = computed(() => {
  try { return new Date(LEGAL_DATE + 'T12:00:00Z').toLocaleDateString(currentLocale(), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) } catch { return LEGAL_DATE }
})
</script>

<style scoped>
.lg-wrap { max-width: 880px; }
.lg-tabs { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 36px; }
.lg-tab { border: 1px solid var(--line-2); color: var(--text-2); border-radius: 999px; padding: 7px 14px; font-size: 13px; font-weight: 600; }
.lg-tab:hover { color: var(--text); }
.lg-tab.is-active { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.lg-head { display: grid; gap: 10px; padding-block: 28px 8px; }
.lg-head .pub-muted { margin: 0; }
.lg-sec { margin-top: 30px; }
.lg-h2 { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 19px; margin: 0 0 10px; }
.lg-sec p { color: var(--text-2); margin: 0; line-height: 1.7; }
.lg-table { overflow: hidden; }
.lg-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; padding: 14px 20px; border-top: 1px solid var(--line); font-size: 14.5px; }
.lg-row:first-child { border-top: none; }
.lg-row span:last-child { color: var(--text-2); }
.lg-row--head { background: var(--bg-2); font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--text-3); }
.lg-row--head span:last-child { color: var(--text-3); }
.lg-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.lg-box { padding: 20px 22px; }
.lg-box ul { margin: 0; padding-inline-start: 18px; display: grid; gap: 8px; color: var(--text-2); font-size: 14.5px; }
.lg-box--yes { border-color: rgba(34, 197, 94, .35); }
.lg-box--yes .lg-h2 { color: var(--green); }
.lg-box--no .lg-h2 { color: var(--text); }
.lg-contact { padding: 20px 22px; margin-top: 40px; }
@media (max-width: 700px) {
  .lg-tabs { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin-inline: -16px; padding-inline: 16px; }
  .lg-tab { white-space: nowrap; font-size: 12.5px; }
  .lg-two { grid-template-columns: 1fr; }
  .lg-row { grid-template-columns: 1fr; gap: 4px; }
  .lg-row--head { display: none; }
}
</style>
