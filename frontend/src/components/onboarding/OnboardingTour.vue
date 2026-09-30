<template>
  <div v-if="ob.tourOn && step" class="tour" :class="{ 'tour--mobile': mobile }">
    <!-- Затемнение с «окном» вокруг элемента -->
    <div v-if="rect" class="tour__spot" :style="spotStyle"></div>
    <div v-else class="tour__dim"></div>

    <!-- Блокираторы кликов вокруг окна; в само окно клик проходит только на шаге-действии -->
    <template v-if="rect">
      <div class="tour__block" :style="{ top: 0, left: 0, right: 0, height: hole.top + 'px' }"></div>
      <div class="tour__block" :style="{ top: hole.bottom + 'px', left: 0, right: 0, bottom: 0 }"></div>
      <div class="tour__block" :style="{ top: hole.top + 'px', left: 0, width: hole.left + 'px', height: hole.h + 'px' }"></div>
      <div class="tour__block" :style="{ top: hole.top + 'px', left: hole.right + 'px', right: 0, height: hole.h + 'px' }"></div>
      <div v-if="!step.action" class="tour__block" :style="{ top: hole.top + 'px', left: hole.left + 'px', width: hole.w + 'px', height: hole.h + 'px' }"></div>
    </template>
    <div v-else class="tour__block" style="inset:0"></div>

    <div ref="pop" class="tour__pop" :class="popClass" :style="popStyle" role="dialog" aria-live="polite">
      <div class="tour__count">{{ idx + 1 }} {{ t.tour.of }} {{ steps.length }}</div>
      <h4 class="tour__title">{{ text.t }}</h4>
      <p class="tour__text">{{ text.d }}</p>
      <div class="tour__actions">
        <button class="tour__skip" @click="skip">{{ t.tour.skip }}</button>
        <span class="tour__spacer"></span>
        <button v-if="idx > 0" class="tour__btn tour__btn--ghost" @click="go(idx - 1)">{{ t.tour.back }}</button>
        <button v-if="!step.action" class="tour__btn" @click="next">{{ idx === steps.length - 1 ? t.tour.done : t.tour.next }}</button>
      </div>
      <div v-if="step.action" class="tour__tap">👆 {{ t.tour.tap }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/onboarding'

const t = useT(dict)
const ob = useOnboardingStore()
const router = useRouter()
const route = useRoute()

const ALL = [
  { key: 'checklist', sel: 'checklist' },
  { key: 'access', sel: 'nav-access' },
  { key: 'products', sel: 'nav-products' },
  { key: 'education', sel: 'nav-education' },
  { key: 'shop', sel: 'nav-shop' },
  { key: 'help', sel: 'bell' },
  { key: 'start', sel: 'cl-tv', action: true },
  { key: 'finish', sel: null },
]

const steps = ref([])
const idx = ref(0)
const rect = ref(null)
const pop = ref(null)
const popPos = ref({})
const mobile = ref(false)
let target = null
let raf = 0

const step = computed(() => steps.value[idx.value] || null)
const text = computed(() => (step.value ? t.value.tour.steps[step.value.key] : { t: '', d: '' }))

const PAD = 6
const hole = computed(() => {
  const r = rect.value
  if (!r) return { top: 0, left: 0, right: 0, bottom: 0, w: 0, h: 0 }
  const top = Math.max(0, r.top - PAD), left = Math.max(0, r.left - PAD)
  const right = Math.min(window.innerWidth, r.right + PAD), bottom = Math.min(window.innerHeight, r.bottom + PAD)
  return { top, left, right, bottom, w: right - left, h: bottom - top }
})
const spotStyle = computed(() => ({
  top: hole.value.top + 'px', left: hole.value.left + 'px',
  width: hole.value.w + 'px', height: hole.value.h + 'px',
}))
const popClass = computed(() => ({ 'tour__pop--center': !rect.value, 'tour__pop--sheet': mobile.value && !!rect.value }))
const popStyle = computed(() => popPos.value)

function buildSteps() {
  const cl = ob.checklist
  const tv = (cl.items || []).find((i) => i.key === 'tv')
  const withChecklist = !!cl.visible
  const withStart = withChecklist && tv && !tv.done
  return ALL.filter((s) => {
    if (s.key === 'checklist') return withChecklist
    if (s.key === 'start') return withStart
    if (s.key === 'finish') return !withStart
    return true
  })
}

function findTarget(sel) {
  if (!sel) return null
  const vw = window.innerWidth
  for (const el of document.querySelectorAll(`[data-tour~="${sel}"]`)) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0 && r.right > 0 && r.left < vw) return el
  }
  return null
}

async function waitTarget(sel, ms = 2500) {
  const until = Date.now() + ms
  while (Date.now() < until) {
    const el = findTarget(sel)
    if (el) return el
    await new Promise((r) => setTimeout(r, 100))
  }
  return null
}

function measure() {
  mobile.value = window.innerWidth <= 640
  rect.value = target ? target.getBoundingClientRect() : null
  nextTick(place)
}

function place() {
  const el = pop.value
  if (!el) return
  const r = rect.value
  const vw = window.innerWidth, vh = window.innerHeight
  if (!r) { popPos.value = {}; return }
  if (mobile.value) {
    // Нижний лист; если элемент внизу экрана (нижняя панель) — лист сверху
    const low = (r.top + r.bottom) / 2 > vh / 2
    popPos.value = low ? { top: '12px' } : { bottom: 'calc(12px + env(safe-area-inset-bottom))' }
    return
  }
  const w = el.offsetWidth || 320, h = el.offsetHeight || 180, gap = 14
  let left, top
  if (r.right + gap + w <= vw - 8) { left = r.right + gap; top = r.top + r.height / 2 - h / 2 }
  else if (r.bottom + gap + h <= vh - 8) { top = r.bottom + gap; left = r.left + r.width / 2 - w / 2 }
  else if (r.top - gap - h >= 8) { top = r.top - gap - h; left = r.left + r.width / 2 - w / 2 }
  else { left = r.left - gap - w; top = r.top + r.height / 2 - h / 2 }
  left = Math.max(8, Math.min(left, vw - w - 8))
  top = Math.max(8, Math.min(top, vh - h - 8))
  popPos.value = { left: left + 'px', top: top + 'px' }
}

function onMove() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(measure)
}

function detachAction() {
  if (target && target.__tourClick) {
    target.removeEventListener('click', target.__tourClick, true)
    delete target.__tourClick
  }
}

async function go(i) {
  detachAction()
  if (i < 0 || i >= steps.value.length) return
  idx.value = i
  const s = steps.value[i]
  target = null
  rect.value = null
  if (s.sel) {
    target = await waitTarget(s.sel)
    if (!target) {
      // Элемента нет (например, скрыт) — пропускаем шаг
      if (i < steps.value.length - 1) return go(i + 1)
    } else {
      const r = target.getBoundingClientRect()
      if (r.top < 0 || r.bottom > window.innerHeight) target.scrollIntoView({ block: 'center' })
      if (s.action) {
        const fn = () => { detachAction(); ob.finishTour('completed', s.key) }
        target.__tourClick = fn
        target.addEventListener('click', fn, true)
      }
    }
  }
  measure()
}

function next() {
  if (idx.value >= steps.value.length - 1) ob.finishTour('completed', step.value?.key)
  else go(idx.value + 1)
}

function skip() {
  detachAction()
  ob.finishTour('skipped', step.value?.key)
}

function onKey(e) {
  if (!ob.tourOn) return
  if (e.key === 'Escape') skip()
  else if (e.key === 'ArrowRight' && !step.value?.action) next()
  else if (e.key === 'ArrowLeft' && idx.value > 0) go(idx.value - 1)
}

async function begin() {
  if (route.path !== '/dashboard') await router.push('/dashboard')
  // Даём главной загрузить чек-лист
  await ob.load()
  steps.value = buildSteps()
  window.addEventListener('resize', onMove)
  window.addEventListener('scroll', onMove, true)
  window.addEventListener('keydown', onKey)
  go(0)
}

function end() {
  detachAction()
  window.removeEventListener('resize', onMove)
  window.removeEventListener('scroll', onMove, true)
  window.removeEventListener('keydown', onKey)
  target = null
  rect.value = null
}

watch(() => ob.tourOn, (on) => (on ? begin() : end()), { immediate: true })
onBeforeUnmount(end)
</script>

<style scoped>
.tour { position: fixed; inset: 0; z-index: 2000; pointer-events: none; }
.tour__dim { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.62); }
.tour__spot {
  position: fixed; border-radius: 10px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.62), 0 0 0 2px var(--accent, #c9a84c), 0 0 22px rgba(var(--accent-rgb, 201, 168, 76), 0.55);
  transition: top .25s ease, left .25s ease, width .25s ease, height .25s ease;
  pointer-events: none;
}
.tour__block { position: fixed; pointer-events: auto; background: transparent; }
.tour__pop {
  position: fixed; width: 320px; max-width: calc(100vw - 16px);
  background: var(--bg-2, #111114); color: var(--text, #f0f0f0);
  border: 1px solid rgba(var(--accent-rgb, 201, 168, 76), 0.45); border-radius: 14px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5); padding: 16px 16px 14px;
  pointer-events: auto; transition: top .2s ease, left .2s ease;
  font-family: 'Roboto', sans-serif;
}
.tour__pop--center { left: 50%; top: 50%; transform: translate(-50%, -50%); }
.tour__pop--sheet { left: 12px; right: 12px; width: auto; max-width: none; }
.tour__count { font-size: 11px; font-weight: 700; letter-spacing: .06em; color: var(--accent, #c9a84c); text-transform: uppercase; margin-bottom: 6px; }
.tour__title { font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 800; margin: 0 0 6px; }
.tour__text { font-size: 13.5px; line-height: 1.5; color: var(--text-2, #a0a0b0); margin: 0 0 14px; }
.tour__actions { display: flex; align-items: center; gap: 8px; }
.tour__spacer { flex: 1; }
.tour__skip { background: none; border: none; color: var(--text-3, #606070); font-size: 12.5px; cursor: pointer; padding: 6px 2px; }
.tour__skip:hover { color: var(--text, #f0f0f0); }
.tour__btn {
  background: var(--accent, #c9a84c); color: #0a0a0b; border: none; border-radius: 9px;
  padding: 8px 16px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer;
}
.tour__btn--ghost { background: transparent; color: var(--text-2, #a0a0b0); border: 1px solid var(--border-2, rgba(255,255,255,.12)); }
.tour__tap { margin-top: 10px; font-size: 12.5px; font-weight: 600; color: var(--accent, #c9a84c); }
</style>
