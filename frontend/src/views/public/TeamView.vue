<template>
  <PublicLayout>
    <div class="pub-wrap">
      <section class="pub-hero">
        <div class="pub-label">{{ t.teamPage.label }}</div>
        <h1 class="pub-h1">{{ t.teamPage.title }}</h1>
        <p class="pub-lead">{{ t.teamPage.sub }}</p>
      </section>

      <section class="pub-section tm-section">
        <h2 class="pub-h2">{{ t.teamPage.founders }}</h2>
        <div class="tm-grid tm-grid--founders">
          <article v-for="m in founders" :key="m.photo" class="tm-card tm-card--big pub-card">
            <img class="tm-card__photo" :src="m.photo" :alt="m.name" width="160" height="160" loading="lazy" />
            <div class="tm-card__body">
              <h3 class="pub-h3">{{ m.name }}</h3>
              <div class="tm-card__role">{{ m.role }}</div>
              <p>{{ m.desc }}</p>
              <div v-if="m.links.length" class="tm-links">
                <a v-for="l in m.links" :key="l.href" :href="l.href" target="_blank" rel="noopener" class="tm-link">{{ l.label }} <span class="pub-arr">↗</span></a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="pub-section tm-section">
        <h2 class="pub-h2">{{ t.teamPage.team }}</h2>
        <div class="tm-grid">
          <article v-for="m in team" :key="m.photo" class="tm-card pub-card">
            <img class="tm-card__photo" :src="m.photo" :alt="m.name" width="120" height="120" loading="lazy" />
            <div class="tm-card__body">
              <h3 class="pub-h3">{{ m.name }}</h3>
              <div class="tm-card__role">{{ m.role }}</div>
              <p>{{ m.desc }}</p>
              <div v-if="m.links.length" class="tm-links">
                <a v-for="l in m.links" :key="l.href" :href="l.href" target="_blank" rel="noopener" class="tm-link">{{ l.label }} <span class="pub-arr">↗</span></a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="pub-section">
        <div class="tm-join pub-card">
          <div class="tm-join__text">
            <h2 class="pub-h2">{{ t.teamPage.joinTitle }}</h2>
            <p class="pub-lead">{{ t.teamPage.joinText }}</p>
          </div>
          <a href="https://t.me/updown_live" target="_blank" rel="noopener" class="pub-btn pub-btn--gold pub-btn--lg">{{ t.teamPage.joinBtn }} <span class="pub-arr">→</span></a>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup>
import { computed } from 'vue'
import PublicLayout from '@/components/public/PublicLayout.vue'
import { useT } from '@/i18n'
import dict from '@/content/siteText'
import landingDict from '@/i18n/dicts/landing'

const t = useT(dict)
const lt = useT(landingDict)

// Соцсети участников (ключ — имя файла фото)
const LINKS = {
  sergey: [
    { label: 'Telegram', href: 'https://t.me/SK_Trade80' },
    { label: 'Instagram', href: 'https://www.instagram.com/skolenchikov' },
  ],
  ivan: [{ label: 'iskovx.tech', href: 'https://iskovx.tech/' }],
  alik: [{ label: 'Instagram', href: 'https://www.instagram.com/happy.alik' }],
  olga: [{ label: 'Instagram', href: 'https://www.instagram.com/olgabecker94' }],
  nadezhda: [{ label: 'Instagram', href: 'https://www.instagram.com/nadja_nutriziolog' }],
}
const FOUNDERS = ['dmitry', 'sergey', 'ivan']
const keyOf = (photo) => String(photo || '').replace(/^.*\//, '').replace(/\..*$/, '')

const members = computed(() => (lt.value.team?.members || []).map((m) => ({ ...m, key: keyOf(m.photo), links: LINKS[keyOf(m.photo)] || [] })))
const founders = computed(() => members.value.filter((m) => FOUNDERS.includes(m.key)))
const team = computed(() => members.value.filter((m) => !FOUNDERS.includes(m.key)))
</script>

<style scoped>
.tm-section .pub-h2 { margin-bottom: 20px; }
.tm-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.tm-grid--founders { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.tm-card { padding: 22px; display: flex; gap: 18px; align-items: flex-start; min-width: 0; }
.tm-card--big { flex-direction: column; align-items: center; text-align: center; }
.tm-card__photo { flex: 0 0 auto; width: 96px; height: 96px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(var(--accent-rgb), .45); background: var(--bg-2); }
.tm-card--big .tm-card__photo { width: 140px; height: 140px; }
.tm-card__body { display: grid; gap: 6px; min-width: 0; }
.tm-card__role { color: var(--accent); font-size: 13px; font-weight: 700; }
.tm-card__body p { color: var(--text-2); font-size: 14.5px; margin: 4px 0 0; }
.tm-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.tm-card--big .tm-links { justify-content: center; }
.tm-link { border: 1px solid var(--line-2); border-radius: 999px; padding: 4px 12px; font-size: 12.5px; font-weight: 600; color: var(--text-2); }
.tm-link:hover { color: var(--accent); border-color: var(--accent); }
.tm-join { padding: 28px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; background: linear-gradient(120deg, rgba(var(--accent-rgb), .12), transparent 60%), var(--surface); border-color: rgba(var(--accent-rgb), .35); }
.tm-join__text { display: grid; gap: 8px; flex: 1 1 380px; min-width: 0; }
@media (max-width: 960px) { .tm-grid--founders { grid-template-columns: 1fr; } .tm-card--big { flex-direction: row; align-items: flex-start; text-align: start; } .tm-card--big .tm-card__photo { width: 110px; height: 110px; } .tm-card--big .tm-links { justify-content: flex-start; } }
@media (max-width: 760px) { .tm-grid { grid-template-columns: 1fr; } }
@media (max-width: 520px) {
  .tm-card, .tm-card--big { flex-direction: column; align-items: center; text-align: center; }
  .tm-links, .tm-card--big .tm-links { justify-content: center; }
  .tm-join .pub-btn { width: 100%; }
}
</style>
