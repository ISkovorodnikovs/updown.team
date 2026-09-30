<template>
  <section v-if="cl.visible" class="fs" data-tour="checklist">
    <div class="fs__head">
      <h3 class="fs__title">{{ t.checklist.title }}</h3>
      <span class="fs__progress">{{ fill(t.checklist.progress, { done: cl.done, total: cl.total }) }}</span>
      <button class="fs__hide" @click="ob.patch({ checklistHidden: true })">{{ t.checklist.hide }}</button>
    </div>
    <div class="fs__bar"><div class="fs__fill" :style="{ width: pct + '%' }"></div></div>

    <ol class="fs__list">
      <li v-for="it in cl.items" :key="it.key" class="fs__item" :class="{ 'is-done': it.done }">
        <span class="fs__check">{{ it.done ? '✓' : '' }}</span>
        <div class="fs__body">
          <div class="fs__name">{{ fill(t.checklist.items[it.key].t, { name: it.name || '' }) }}</div>
          <div class="fs__desc">{{ t.checklist.items[it.key].d }}</div>
        </div>
        <span v-if="it.done" class="fs__done">{{ t.checklist.done }}</span>
        <a v-else-if="it.key === 'telegram' && tgUrl" :href="tgUrl" target="_blank" rel="noopener"
           class="fs__btn" @click="refreshSoon">{{ t.checklist.items[it.key].btn }}</a>
        <router-link v-else :to="linkFor(it)" class="fs__btn" :data-tour="'cl-' + it.key">
          {{ t.checklist.items[it.key].btn }}
        </router-link>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding'
import { notificationsApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/onboarding'

const t = useT(dict)
const ob = useOnboardingStore()
const cl = computed(() => ob.checklist)
const pct = computed(() => (cl.value.total ? Math.round((cl.value.done / cl.value.total) * 100) : 0))
const tgUrl = ref(null)

const fill = (tpl, vars) => String(tpl || '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')

function linkFor(it) {
  if (it.key === 'tv') return '/dashboard/access?focus=tv'
  if (it.key === 'shop') return '/dashboard/shop'
  if (it.key === 'telegram') return '/dashboard/profile'
  return '/dashboard/access'
}

async function loadTgLink() {
  const tg = (cl.value.items || []).find((i) => i.key === 'telegram')
  if (!tg || tg.done || tgUrl.value) return
  try { tgUrl.value = await notificationsApi.tgLink().then((r) => r.data.url) } catch { /* ignore */ }
}

// Вернулся из Telegram / другой вкладки — обновляем галочки
function onVisible() { if (document.visibilityState === 'visible') ob.load() }
function refreshSoon() { setTimeout(() => ob.load(), 6000) }

onMounted(() => {
  document.addEventListener('visibilitychange', onVisible)
  loadTgLink()
})
watch(() => cl.value.items, loadTgLink)
onBeforeUnmount(() => document.removeEventListener('visibilitychange', onVisible))
</script>

<style scoped>
.fs {
  background: var(--surface); border: 1px solid rgba(var(--accent-rgb), 0.35); border-radius: 16px;
  padding: 18px 18px 8px; margin-bottom: 28px;
}
.fs__head { display: flex; align-items: center; gap: 12px; }
.fs__title { font-family: 'Montserrat', sans-serif; font-size: 17px; font-weight: 800; color: var(--text); margin: 0; }
.fs__progress { font-size: 12.5px; font-weight: 700; color: var(--accent); }
.fs__hide { margin-inline-start: auto; background: none; border: none; color: var(--text-3); font-size: 12.5px; cursor: pointer; }
.fs__hide:hover { color: var(--text); }
.fs__bar { height: 6px; border-radius: 3px; background: var(--border-2); margin: 12px 0 6px; overflow: hidden; }
.fs__fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width .4s ease; }
.fs__list { list-style: none; margin: 0; padding: 0; }
.fs__item { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
.fs__item:last-child { border-bottom: none; }
.fs__check {
  width: 24px; height: 24px; flex: 0 0 auto; border-radius: 50%; border: 2px solid var(--border-2);
  display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #0a0a0b;
}
.is-done .fs__check { background: #1E9E5A; border-color: #1E9E5A; color: #fff; }
.fs__body { flex: 1; min-width: 0; }
.fs__name { font-size: 14px; font-weight: 600; color: var(--text); }
.is-done .fs__name { color: var(--text-3); text-decoration: line-through; }
.fs__desc { font-size: 12.5px; color: var(--text-3); margin-top: 2px; line-height: 1.4; }
.fs__btn {
  flex: 0 0 auto; background: var(--accent); color: #0a0a0b; border-radius: 9px; padding: 8px 14px;
  font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 12.5px; text-decoration: none; white-space: nowrap;
}
.fs__btn:hover { opacity: .9; text-decoration: none; }
.fs__done { font-size: 12px; font-weight: 600; color: #1E9E5A; }
@media (max-width: 640px) {
  .fs { padding: 16px 14px 6px; }
  .fs__item { flex-wrap: wrap; gap: 10px; }
  .fs__body { flex-basis: calc(100% - 40px); }
  .fs__btn { margin-inline-start: 38px; }
}
</style>
