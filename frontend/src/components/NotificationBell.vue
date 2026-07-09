<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { notificationsApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/notifications'

const t = useT(dict)
const router = useRouter()

const DROPDOWN_LIMIT = 6

const open = ref(false)
const showAll = ref(false)
const items = ref([])
const unread = ref(0)
const loading = ref(false)
let timer = null

const dropdownItems = computed(() => items.value.slice(0, DROPDOWN_LIMIT))
const unreadItems = computed(() => items.value.filter(n => !n.isRead))
const readItems = computed(() => items.value.filter(n => n.isRead))

async function refreshCount() {
  try { unread.value = await notificationsApi.unreadCount().then(r => r.data.count) } catch { /* ignore */ }
}
async function loadList() {
  loading.value = true
  try { items.value = await notificationsApi.list().then(r => r.data) } catch { /* ignore */ }
  loading.value = false
}
async function toggle() {
  open.value = !open.value
  if (open.value) await loadList()
}
async function markAll() {
  try { await notificationsApi.readAll() } catch { /* ignore */ }
  items.value = items.value.map(n => ({ ...n, isRead: true }))
  unread.value = 0
}
async function onItem(n) {
  if (!n.isRead) {
    try { await notificationsApi.read(n.id) } catch { /* ignore */ }
    n.isRead = true
    unread.value = Math.max(0, unread.value - 1)
  }
  open.value = false
  showAll.value = false
  if (n.meta && n.meta.link) router.push(n.meta.link)
}
function openAll() {
  open.value = false
  showAll.value = true
  if (!items.value.length) loadList()
}

// Абсолютное UTC-время: 09.07 13:30 UTC
function utc(dateStr) {
  const d = new Date(dateStr)
  if (isNaN(d)) return ''
  const p = n => String(n).padStart(2, '0')
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())} UTC`
}

function onDocClick(e) {
  if (!e.target.closest('.nbell')) open.value = false
}

onMounted(() => {
  refreshCount()
  timer = setInterval(refreshCount, 45000)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <div class="nbell">
    <button class="topbar-btn topbar-btn--notif" @click.stop="toggle" :title="t.title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <span v-if="unread > 0" class="nbell__badge">{{ unread > 99 ? '99+' : unread }}</span>
    </button>

    <!-- Выпадашка (ограниченная) -->
    <div v-if="open" class="nbell__panel" @click.stop>
      <div class="nbell__head">
        <span>{{ t.title }}</span>
        <button v-if="unreadItems.length" class="nbell__mark" @click="markAll">{{ t.markAll }}</button>
      </div>
      <div class="nbell__list">
        <div v-if="loading" class="nbell__empty">{{ t.loading }}</div>
        <div v-else-if="!items.length" class="nbell__empty">{{ t.empty }}</div>
        <button v-else v-for="n in dropdownItems" :key="n.id" class="nbell__item" :class="{ 'is-unread': !n.isRead }" @click="onItem(n)">
          <span class="nbell__dot" :class="{ on: !n.isRead }"></span>
          <span class="nbell__body">
            <span class="nbell__t">{{ n.title }}</span>
            <span v-if="n.body" class="nbell__b">{{ n.body }}</span>
            <span class="nbell__time">{{ utc(n.createdAt) }}</span>
          </span>
        </button>
      </div>
      <button v-if="items.length" class="nbell__all" @click="openAll">{{ t.viewAll }}</button>
    </div>

    <!-- Модалка: все уведомления по категориям -->
    <teleport to="body">
      <div v-if="showAll" class="nall-overlay" @click.self="showAll = false">
        <div class="nall">
          <div class="nall__head">
            <span>{{ t.title }}</span>
            <div class="nall__actions">
              <button v-if="unreadItems.length" class="nbell__mark" @click="markAll">{{ t.markAll }}</button>
              <button class="nall__close" @click="showAll = false">✕</button>
            </div>
          </div>
          <div class="nall__body">
            <div v-if="!items.length" class="nbell__empty">{{ t.allEmpty }}</div>
            <template v-else>
              <div v-if="unreadItems.length" class="nall__group">
                <div class="nall__label">{{ t.unread }} · {{ unreadItems.length }}</div>
                <button v-for="n in unreadItems" :key="n.id" class="nbell__item is-unread" @click="onItem(n)">
                  <span class="nbell__dot on"></span>
                  <span class="nbell__body">
                    <span class="nbell__t">{{ n.title }}</span>
                    <span v-if="n.body" class="nbell__b">{{ n.body }}</span>
                    <span class="nbell__time">{{ utc(n.createdAt) }}</span>
                  </span>
                </button>
              </div>
              <div v-if="readItems.length" class="nall__group">
                <div class="nall__label">{{ t.read }} · {{ readItems.length }}</div>
                <button v-for="n in readItems" :key="n.id" class="nbell__item" @click="onItem(n)">
                  <span class="nbell__dot"></span>
                  <span class="nbell__body">
                    <span class="nbell__t">{{ n.title }}</span>
                    <span v-if="n.body" class="nbell__b">{{ n.body }}</span>
                    <span class="nbell__time">{{ utc(n.createdAt) }}</span>
                  </span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
.nbell { position: relative; display: inline-flex; }
/* Кнопка как остальные topbar-btn (scoped-стили не переходят из Layout) */
.nbell .topbar-btn {
  width: 36px; height: 36px; border-radius: 8px;
  border: 1px solid var(--border-2); background: var(--surface); color: var(--text-2);
  cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s;
  &:hover { color: var(--accent); border-color: var(--accent); }
}
.nbell__badge {
  position: absolute; top: -4px; right: -4px; min-width: 16px; height: 16px; padding: 0 4px;
  background: #E5484D; color: #fff; font-size: 10px; font-weight: 700; line-height: 16px;
  border-radius: 8px; text-align: center; box-shadow: 0 0 0 2px var(--bg, #0e0e10);
}
.nbell__panel {
  position: absolute; top: calc(100% + 10px); right: 0; width: 340px; max-width: 90vw;
  background: var(--surface, #1c1c22); border: 1px solid var(--border-2, #33333a); border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0,0,0,.5); z-index: 300; overflow: hidden;
}
.nbell__head {
  display: flex; align-items: center; justify-content: space-between; padding: 12px 14px;
  border-bottom: 1px solid var(--border-2, #33333a); font-weight: 700; font-size: 14px; color: var(--text, #ececf0);
}
.nbell__mark { background: none; border: none; color: var(--accent); font-size: 12px; cursor: pointer; font-weight: 600; }
.nbell__list { max-height: 380px; overflow-y: auto; }
.nbell__empty { padding: 28px 14px; text-align: center; color: var(--text-2, #9a9aa2); font-size: 13px; }
.nbell__item {
  display: flex; gap: 10px; width: 100%; text-align: left; background: none; border: none; cursor: pointer;
  padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,.05);
  &:hover { background: rgba(255,255,255,.04); }
  &.is-unread { background: rgba(201,168,76,.06); }
}
.nbell__dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 6px; flex: 0 0 auto; background: transparent;
  &.on { background: var(--accent); } }
.nbell__body { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.nbell__t { font-size: 13px; font-weight: 600; color: var(--text, #ececf0); }
.nbell__b { font-size: 12px; color: var(--text-2, #b6b6be); line-height: 1.4;
  overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.nbell__time { font-size: 11px; color: var(--text-3, #7a7a82); margin-top: 1px; }
.nbell__all { width: 100%; padding: 12px; background: none; border: none; border-top: 1px solid var(--border-2, #33333a);
  color: var(--accent); font-size: 13px; font-weight: 600; cursor: pointer;
  &:hover { background: rgba(255,255,255,.04); } }

/* Модалка */
.nall-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: flex-start; justify-content: center; padding: 60px 16px; z-index: 500; }
.nall { width: 100%; max-width: 520px; max-height: 80vh; display: flex; flex-direction: column;
  background: var(--surface, #1c1c22); border: 1px solid var(--border-2, #33333a); border-radius: 16px; overflow: hidden; }
.nall__head { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px;
  border-bottom: 1px solid var(--border-2, #33333a); font-weight: 800; font-size: 16px; color: var(--text, #ececf0); }
.nall__actions { display: flex; align-items: center; gap: 12px; }
.nall__close { background: none; border: none; color: var(--text-2, #9a9aa2); font-size: 16px; cursor: pointer; }
.nall__body { overflow-y: auto; padding: 6px 0; }
.nall__group { padding: 6px 0; }
.nall__label { padding: 8px 18px 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--text-3, #7a7a82); }
.nall .nbell__item { padding: 12px 18px; }
</style>
