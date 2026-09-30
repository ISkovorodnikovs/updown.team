<template>
  <PublicLayout>
    <div class="pub-wrap">
      <section class="pub-hero fr-hero">
        <div class="pub-label">{{ t.free.label }}</div>
        <h1 class="pub-h1">{{ t.free.title }}</h1>
        <p class="pub-lead">{{ t.free.sub }}</p>
        <div class="pub-row">
          <router-link to="/register?get=magnet" class="pub-btn pub-btn--gold pub-btn--lg">{{ t.free.cta }}</router-link>
          <router-link :to="lp('/indicators/magnet-pro')" class="pub-btn pub-btn--ghost pub-btn--lg">Magnet Pro →</router-link>
        </div>
      </section>

      <section class="pub-section">
        <h2 class="pub-h2">{{ t.free.getTitle }}</h2>
        <div class="fr-items">
          <article v-for="(it, i) in t.free.items" :key="it.name" class="fr-item pub-card" :class="{ 'is-forever': i === 2 }">
            <div class="fr-item__top">
              <h3 class="pub-h3">{{ it.name }}</h3>
              <span class="pub-chip" :class="{ 'pub-chip--solid': i === 2 }">{{ it.term }}</span>
            </div>
            <p>{{ it.text }}</p>
            <img v-if="i === 0" class="fr-item__img" src="/indicators/magnet-pro-sm.webp" alt="Magnet Pro" loading="lazy" width="720" height="230" />
          </article>
        </div>
      </section>

      <section class="pub-section">
        <h2 class="pub-h2">{{ t.free.stepsTitle }}</h2>
        <ol class="fr-steps">
          <li v-for="(s, i) in t.free.steps" :key="i" class="fr-step">
            <span class="fr-step__num pub-tab">{{ i + 1 }}</span>
            <div><b>{{ s.title }}</b><p>{{ s.text }}</p></div>
          </li>
        </ol>
      </section>

      <section class="pub-section">
        <div class="fr-after pub-card">
          <p>{{ t.free.after }}</p>
          <div class="pub-row">
            <router-link to="/register?get=magnet" class="pub-btn pub-btn--gold pub-btn--lg">{{ t.free.cta }}</router-link>
            <router-link :to="lp('/pricing')" class="pub-btn pub-btn--ghost pub-btn--lg">{{ t.nav.pricing }} →</router-link>
          </div>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '@/components/public/PublicLayout.vue'
import { useT } from '@/i18n'
import dict from '@/content/publicText'
import { lp } from '@/utils/publicLang'

const t = useT(dict)
</script>

<style scoped>
.fr-hero .pub-row { margin-top: 8px; }
.fr-items { margin-top: 20px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.fr-item { padding: 22px; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.fr-item.is-forever { border-color: rgba(var(--accent-rgb), .45); }
.fr-item__top { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.fr-item p { color: var(--text-2); margin: 0; }
.fr-item__img { margin-top: auto; width: 100%; border-radius: 10px; border: 1px solid var(--line); display: block; }
.fr-steps { list-style: none; margin: 20px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.fr-step { display: flex; gap: 14px; align-items: flex-start; min-width: 0; }
.fr-step__num { flex: 0 0 auto; width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: rgba(var(--accent-rgb), .14); color: var(--accent); font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 17px; }
.fr-step b { font-size: 16px; }
.fr-step p { color: var(--text-2); margin: 4px 0 0; font-size: 14px; }
.fr-after { padding: 24px; display: grid; gap: 16px; }
.fr-after p { color: var(--text-2); margin: 0; max-width: 70ch; }
@media (max-width: 860px) { .fr-items, .fr-steps { grid-template-columns: 1fr; } }
@media (max-width: 520px) { .pub-row .pub-btn { width: 100%; } }
</style>
