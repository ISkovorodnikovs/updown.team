<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { notificationsApi } from '@/api'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/notifications'

const t = useT(dict)
const router = useRouter()

const open = ref(false)
const items = ref([])
const unread = ref(0)
const loading = ref(false)
let timer = null

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
  const link = n.meta?.link
  if (link) router.push(link)
}

function ago(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return t.value.justNow
  if (diff < 3600) return Math.floor(diff / 60) + t.value.minAgo
  if (diff < 86400) return Math.floor(diff / 3600) + t.value.hourAgo
  return Math.floor(diff / 86400) + t.value.dayAgo
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

    <div v-if="open" class="nbell__panel" @click.stop>
      <div class="nbell__head">
        <span>{{ t.title }}</span>
        <button v-if="items.some(n => !n.isRead)" class="nbell__mark" @click="markAll">{{ t.markAll }}</button>
      </div>
      <div class="nbell__list">
        <div v-if="loading" class="nbell__empty">{{ t.loading }}</div>
        <div v-else-if="!items.length" class="nbell__empty">{{ t.empty }}</div>
        <button v-else v-for="n in items" :key="n.id" class="nbell__item" :class="{ 'is-unread': !n.isRead }" @click="onItem(n)">
          <span class="nbell__dot" :class="{ on: !n.isRead }"></span>
          <span class="nbell__body">
            <span class="nbell__t">{{ n.title }}</span>
            <span v-if="n.body" class="nbell__b">{{ n.body }}</span>
            <span class="nbell__time">{{ ago(n.createdAt) }}</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nbell { position: relative; display: inline-flex; }
.nbell__badge {
  position: absolute; top: -4px; right: -4px; min-width: 16px; height: 16px; padding: 0 4px;
  background: #E5484D; color: #fff; font-size: 10px; font-weight: 700; line-height: 16px;
  border-radius: 8px; text-align: center; box-shadow: 0 0 0 2px var(--bg-1, #0e0e10);
}
.nbell__panel {
  position: absolute; top: calc(100% + 10px); right: 0; width: 340px; max-width: 90vw;
  background: var(--bg-1, #16161a); border: 1px solid var(--border-2, #26262b); border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0,0,0,.45); z-index: 300; overflow: hidden;
}
.nbell__head {
  display: flex; align-items: center; justify-content: space-between; padding: 12px 14px;
  border-bottom: 1px solid var(--border-2, #26262b); font-weight: 700; font-size: 14px;
}
.nbell__mark { background: none; border: none; color: var(--accent); font-size: 12px; cursor: pointer; font-weight: 600; }
.nbell__list { max-height: 380px; overflow-y: auto; }
.nbell__empty { padding: 28px 14px; text-align: center; color: var(--text-2); font-size: 13px; }
.nbell__item {
  display: flex; gap: 10px; width: 100%; text-align: left; background: none; border: none; cursor: pointer;
  padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,.04);
  &:hover { background: var(--surface, #1c1c22); }
  &.is-unread { background: rgba(201,168,76,.05); }
}
.nbell__dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 6px; flex: 0 0 auto; background: transparent;
  &.on { background: var(--accent); } }
.nbell__body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.nbell__t { font-size: 13px; font-weight: 600; color: var(--text-1); }
.nbell__b { font-size: 12px; color: var(--text-2); overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.nbell__time { font-size: 11px; color: var(--text-3); margin-top: 2px; }
</style>
