<template>
  <div v-if="ob.welcomeOpen" class="wm" role="dialog" aria-modal="true">
    <div class="wm__card">
      <div class="wm__logo">↑↓</div>
      <h2 class="wm__title">{{ t.welcome.title }}</h2>
      <p class="wm__sub">{{ t.welcome.sub }}</p>
      <div class="wm__goals">
        <button v-for="g in goals" :key="g.key" class="wm__goal" @click="ob.chooseGoal(g.key)">
          <span class="wm__icon">{{ g.icon }}</span>
          <span class="wm__gtext">
            <b>{{ t.welcome.goals[g.key].t }}</b>
            <small>{{ t.welcome.goals[g.key].d }}</small>
          </span>
          <span class="wm__arrow">→</span>
        </button>
      </div>
      <button class="wm__skip" @click="ob.skipAll()">{{ t.welcome.skip }}</button>
    </div>
  </div>
</template>

<script setup>
import { useOnboardingStore } from '@/stores/onboarding'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/onboarding'

const t = useT(dict)
const ob = useOnboardingStore()
const goals = [
  { key: 'indicators', icon: '📊' },
  { key: 'signals', icon: '📡' },
  { key: 'learn', icon: '🎓' },
]
</script>

<style scoped>
.wm {
  position: fixed; inset: 0; z-index: 2100; background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.wm__card {
  width: 100%; max-width: 480px; background: var(--bg-2, #111114); color: var(--text, #f0f0f0);
  border: 1px solid rgba(var(--accent-rgb, 201, 168, 76), 0.35); border-radius: 18px;
  padding: 28px 24px 18px; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55); text-align: center;
  max-height: calc(100vh - 32px); overflow-y: auto;
}
.wm__logo { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 26px; color: var(--accent, #c9a84c); }
.wm__title { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 800; margin: 8px 0 6px; }
.wm__sub { font-size: 14px; line-height: 1.5; color: var(--text-2, #a0a0b0); margin: 0 0 20px; }
.wm__goals { display: flex; flex-direction: column; gap: 10px; text-align: start; }
.wm__goal {
  display: flex; align-items: center; gap: 14px; width: 100%;
  background: var(--surface, #1c1c22); border: 1px solid var(--border-2, rgba(255,255,255,.12));
  border-radius: 12px; padding: 14px; cursor: pointer; color: inherit; text-align: start;
  transition: border-color .15s, transform .15s;
}
.wm__goal:hover { border-color: var(--accent, #c9a84c); transform: translateY(-1px); }
.wm__icon { font-size: 24px; flex: 0 0 auto; }
.wm__gtext { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.wm__gtext b { font-size: 14.5px; font-weight: 700; }
.wm__gtext small { font-size: 12.5px; color: var(--text-3, #606070); }
.wm__arrow { color: var(--accent, #c9a84c); font-weight: 700; }
[dir='rtl'] .wm__arrow { transform: scaleX(-1); }
.wm__skip { margin-top: 16px; background: none; border: none; color: var(--text-3, #606070); font-size: 13px; cursor: pointer; padding: 6px; }
.wm__skip:hover { color: var(--text, #f0f0f0); }
</style>
