<template>
  <div class="lang-switcher" ref="rootEl">
    <button type="button" class="lang-switcher__btn" @click.stop="open = !open" :title="current.label">
      <span class="lang-switcher__code">{{ current.code.toUpperCase() }}</span>
      <svg class="lang-switcher__chev" :class="{ 'is-open': open }" width="10" height="10" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <transition name="lang-pop">
      <ul v-if="open" class="lang-switcher__menu">
        <li v-for="l in LANGS" :key="l.code">
          <button type="button" class="lang-switcher__item" :class="{ 'is-active': l.code === lang }"
                  @click="pick(l.code)">
            <span class="lang-switcher__item-code">{{ l.code.toUpperCase() }}</span>
            <span class="lang-switcher__item-label">{{ l.label }}</span>
            <span v-if="l.code === lang" class="lang-switcher__check">✓</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { LANGS, lang, setLang } from '@/i18n'
import { computed } from 'vue'

const open = ref(false)
const rootEl = ref(null)

const current = computed(() => LANGS.find(l => l.code === lang.value) || LANGS[0])

function pick(code) {
  setLang(code)
  open.value = false
}

function onDocClick(e) {
  if (rootEl.value && !rootEl.value.contains(e.target)) open.value = false
}
function onKey(e) { if (e.key === 'Escape') open.value = false }

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.lang-switcher { position: relative; display: inline-flex; }

.lang-switcher__btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: inherit; font: inherit; font-weight: 600; font-size: 13px;
  letter-spacing: 0.04em; cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.lang-switcher__btn:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.22); }

.lang-switcher__chev { transition: transform 0.2s; opacity: 0.7; }
.lang-switcher__chev.is-open { transform: rotate(180deg); }

.lang-switcher__menu {
  position: absolute; top: calc(100% + 8px); inset-inline-end: 0;
  min-width: 168px; margin: 0; padding: 6px; list-style: none;
  background: #14161f;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

.lang-switcher__item {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 8px 10px; background: transparent; border: 0; border-radius: 8px;
  color: rgba(255, 255, 255, 0.85); font: inherit; font-size: 13px;
  cursor: pointer; text-align: start;
  transition: background 0.15s;
}
.lang-switcher__item:hover { background: rgba(255, 255, 255, 0.08); }
.lang-switcher__item.is-active { color: #fff; }

.lang-switcher__item-code {
  width: 26px; flex: 0 0 auto; font-weight: 700; font-size: 11px;
  letter-spacing: 0.06em; opacity: 0.6;
}
.lang-switcher__item-label { flex: 1 1 auto; }
.lang-switcher__check { flex: 0 0 auto; font-size: 12px; color: #7c6cff; }

.lang-pop-enter-active, .lang-pop-leave-active { transition: opacity 0.15s, transform 0.15s; }
.lang-pop-enter-from, .lang-pop-leave-to { opacity: 0; transform: translateY(-4px); }

/* Светлая тема дашборда (класс .light на корне .dashboard) */
:global(.light .lang-switcher__menu) { background: #ffffff; border-color: rgba(0,0,0,0.1); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
:global(.light .lang-switcher__item) { color: rgba(0,0,0,0.75); }
:global(.light .lang-switcher__item:hover) { background: rgba(0,0,0,0.06); }
:global(.light .lang-switcher__item.is-active) { color: #000; }
:global(.light .lang-switcher__btn) { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.12); }
:global(.light .lang-switcher__btn:hover) { background: rgba(0,0,0,0.09); }
</style>
