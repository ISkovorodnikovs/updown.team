<template>
  <Teleport to="body">
    <div v-if="current" class="lbx" role="dialog" aria-modal="true" :aria-label="current.alt" @click.self="close">
      <button type="button" class="lbx__btn lbx__close" aria-label="Close" @click="close">✕</button>
      <button v-if="items.length > 1" type="button" class="lbx__btn lbx__nav lbx__prev" aria-label="Previous" @click="step(-1)"><span class="pub-arr">‹</span></button>
      <figure class="lbx__fig" @click.self="close">
        <img :src="current.src" :alt="current.alt" />
        <figcaption v-if="current.alt">{{ current.alt }}<span v-if="items.length > 1" class="lbx__count"> · {{ index + 1 }} / {{ items.length }}</span></figcaption>
      </figure>
      <button v-if="items.length > 1" type="button" class="lbx__btn lbx__nav lbx__next" aria-label="Next" @click="step(1)"><span class="pub-arr">›</span></button>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch, onBeforeUnmount } from 'vue'
import { useLightbox } from '@/composables/useLightbox'

const { items, index, close, step } = useLightbox()
const current = computed(() => (index.value >= 0 ? items.value[index.value] : null))
const rtl = () => document.documentElement.getAttribute('dir') === 'rtl'

function onKey(e) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(rtl() ? -1 : 1)
  else if (e.key === 'ArrowLeft') step(rtl() ? 1 : -1)
}
// Свайп на телефоне
let x0 = null
function onTouchStart(e) { x0 = e.touches[0].clientX }
function onTouchEnd(e) {
  if (x0 === null) return
  const dx = e.changedTouches[0].clientX - x0
  x0 = null
  if (Math.abs(dx) > 50) step((dx < 0) !== rtl() ? 1 : -1)
}

watch(current, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) {
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
  } else {
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
  }
})
onBeforeUnmount(() => { if (current.value) close() })
</script>

<style>
.lbx { position: fixed; inset: 0; z-index: 1000; background: rgba(5, 5, 8, .92); display: flex; align-items: center; justify-content: center; padding: 56px 72px; }
.lbx__fig { margin: 0; width: 100%; max-height: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.lbx__fig img { width: min(900px, 100%); max-width: 100%; max-height: calc(100vh - 150px); object-fit: contain; border-radius: 10px; box-shadow: 0 20px 60px rgba(0, 0, 0, .6); }
.lbx__fig figcaption { color: #c8c8d4; font: 14px/1.5 'Roboto', system-ui, sans-serif; text-align: center; max-width: 70ch; }
.lbx__count { color: #7c7c8c; }
.lbx__btn { position: absolute; border: 1px solid rgba(255, 255, 255, .18); background: rgba(20, 20, 26, .8); color: #f0f0f0; border-radius: 50%; width: 44px; height: 44px; display: grid; place-items: center; cursor: pointer; font-size: 18px; line-height: 1; }
.lbx__btn:hover { border-color: #c9a84c; color: #c9a84c; }
.lbx__close { top: 14px; inset-inline-end: 14px; }
.lbx__nav { top: 50%; transform: translateY(-50%); font-size: 28px; }
.lbx__prev { inset-inline-start: 14px; }
.lbx__next { inset-inline-end: 14px; }
@media (max-width: 640px) {
  .lbx { padding: 60px 8px 24px; }
  .lbx__nav { top: auto; bottom: 18px; transform: none; }
  .lbx__fig img { max-height: calc(100vh - 170px); }
  .lbx__fig { padding-bottom: 56px; }
}
</style>
