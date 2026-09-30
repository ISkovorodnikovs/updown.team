import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { onboardingApi } from '@/api'
import { track } from '@/utils/attribution'

// Состояние обучения в кабинете. Источник правды — сервер (GET/PATCH /onboarding),
// поэтому прогресс общий для телефона и компьютера.
export const useOnboardingStore = defineStore('onboarding', () => {
  const state = ref(null)
  const loaded = ref(false)
  const welcomeOpen = ref(false)
  const tourOn = ref(false)

  const active = computed(() => !!state.value?.active)
  const checklist = computed(() => state.value?.checklist || { items: [], done: 0, total: 0, visible: false })
  const canRestart = computed(() => !!state.value?.canRestart)

  async function load() {
    try {
      state.value = await onboardingApi.get().then((r) => r.data)
    } catch { /* сервер без обучения — просто ничего не показываем */ }
    loaded.value = true
    return state.value
  }

  async function patch(data) {
    try {
      state.value = await onboardingApi.patch(data).then((r) => r.data)
    } catch { /* ignore */ }
    return state.value
  }

  /** Автозапуск при входе в кабинет: сначала экран приветствия, потом тур. */
  function autostart() {
    if (!state.value) return
    if (state.value.showWelcome) welcomeOpen.value = true
    else if (state.value.showTour) startTour()
  }

  async function chooseGoal(goal) {
    welcomeOpen.value = false
    track('onboarding_goal', { goal })
    await patch({ goal, welcomeDone: true })
    startTour()
  }

  async function skipAll() {
    welcomeOpen.value = false
    tourOn.value = false
    track('tour_skip', { at: 'welcome' })
    await patch({ tourDone: 'skipped' })
  }

  function startTour() {
    tourOn.value = true
    track('tour_start')
  }

  async function finishTour(kind, step) {
    tourOn.value = false
    track(kind === 'completed' ? 'tour_complete' : 'tour_skip', step ? { step } : {})
    await patch({ tourDone: kind })
  }

  /** Пункт меню «Пройти обучение». */
  async function restart() {
    await patch({ restart: true })
    welcomeOpen.value = true
  }

  function hintVisible(key) {
    const s = state.value
    return !!(s && s.active && Array.isArray(s.hints) && !s.hints.includes(key) && !tourOn.value && !welcomeOpen.value)
  }

  async function closeHint(key) {
    if (state.value && Array.isArray(state.value.hints)) state.value.hints = [...state.value.hints, key]
    await patch({ hint: key })
  }

  return {
    state, loaded, welcomeOpen, tourOn, active, checklist, canRestart,
    load, patch, autostart, chooseGoal, skipAll, startTour, finishTour, restart, hintVisible, closeHint,
  }
})
