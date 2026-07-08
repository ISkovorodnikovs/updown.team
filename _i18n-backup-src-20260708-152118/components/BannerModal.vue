<template>
  <Teleport to="body">
    <Transition name="banner-fade">
      <div v-if="visible && banner" class="bm-overlay" @click.self="close">
        <div class="bm-modal">
          <button class="bm-close" @click="close">×</button>

          <div class="bm-img" v-if="banner.imageUrl">
            <img :src="banner.imageUrl" :alt="banner.title" />
          </div>
          <div v-else class="bm-glow"></div>

          <div class="bm-body">
            <div class="bm-badge">🔥 {{ isRu ? 'Акция' : 'Special Offer' }}</div>
            <h2>{{ banner.title }}</h2>
            <p>{{ banner.message }}</p>

            <div class="bm-discounts" v-if="hasDiscounts">
              <div class="bm-disc-row" v-for="(pct, months) in banner.periodDiscounts" :key="months">
                <span class="bm-disc-period">{{ months }} {{ isRu ? 'мес' : 'mo' }}</span>
                <span class="bm-disc-val">-{{ pct }}%</span>
              </div>
            </div>

            <div class="bm-countdown" v-if="banner.endsAt">
              <div class="bm-cd-label">⏱ {{ isRu ? 'До конца акции:' : 'Offer ends in:' }}</div>
              <div class="bm-cd-blocks">
                <div class="bm-cd-block" v-for="unit in timerUnits" :key="unit.label">
                  <div class="bm-cd-num-wrap">
                    <Transition name="cd-flip">
                      <span class="bm-cd-num" :key="unit.value">{{ unit.value }}</span>
                    </Transition>
                  </div>
                  <span class="bm-cd-unit">{{ unit.label }}</span>
                </div>
              </div>
            </div>

            <div class="bm-actions">
              <router-link :to="ctaLink" class="bm-btn-primary" @click="close">
                🎯 {{ isRu ? 'Перейти в магазин' : 'Go to Shop' }}
              </router-link>
              <button class="bm-btn-skip" @click="close">
                {{ isRu ? 'Позже' : 'Later' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { bannersApi } from '@/api'

const props = defineProps({ context: { type: String, default: 'landing' } })
const banner = ref(null)
const visible = ref(false)
const isRu = computed(() => (localStorage.getItem('ud-lang') || 'en') === 'ru')
let timer = null
let showTimer = null
const initializedFor = ref(null)

const timerUnits = ref([
  { value: '00', label: 'д' },
  { value: '00', label: 'ч' },
  { value: '00', label: 'мин' },
  { value: '00', label: 'сек' },
])

const ctaLink = computed(() => props.context === 'dashboard' ? '/dashboard/shop' : '/login')

const hasDiscounts = computed(() => {
  if (!banner.value?.periodDiscounts) return false
  return Object.values(banner.value.periodDiscounts).some(v => Number(v) > 0)
})

// Key per page-load: use performance.timeOrigin so each page reload gets fresh key
function getShownKey(bannerId, ctx) {
  const loadId = Math.floor(performance.timeOrigin / 1000) // seconds since epoch of this page load
  return `ud-banner-${ctx}-${bannerId}-${loadId}`
}

async function tryShowBanner(ctx) {
  if (initializedFor.value === ctx) {
    return
  }
  initializedFor.value = ctx

  // Check if already dismissed IN THIS PAGE LOAD
  // We use performance.timeOrigin as load ID — unique per reload

  try {
    const res = await bannersApi.getActive()
    const data = res?.data

    if (!data || !data.id) {
      return
    }

    const showHere = ctx === 'landing' ? data.showOnLanding : data.showInDashboard
    if (!showHere) {
    }

    const shownKey = getShownKey(data.id, ctx)
    const alreadyShown = sessionStorage.getItem(shownKey)

    if (alreadyShown) {
      return
    }

    if (visible.value) {
      return
    }

    banner.value = data
    const delay = ctx === 'landing' ? 15000 : 5000

    if (showTimer) clearTimeout(showTimer)
    showTimer = setTimeout(() => {
      visible.value = true
    }, delay)

    if (data.endsAt) {
      startTimer()
    } else {
    }

  } catch (e) {
  }
}

watch(() => props.context, (newCtx, oldCtx) => {
  initializedFor.value = null
  if (visible.value) visible.value = false
  tryShowBanner(newCtx)
}, { immediate: false })

onMounted(() => {
  tryShowBanner(props.context)
})

function updateTimer() {
  if (!banner.value?.endsAt) {
    return
  }
  const diff = new Date(banner.value.endsAt) - new Date()
  const ru = (localStorage.getItem('ud-lang') || 'en') === 'ru'
  if (diff <= 0) {
    timerUnits.value = [
      { value: '00', label: ru ? 'д' : 'd' },
      { value: '00', label: ru ? 'ч' : 'h' },
      { value: '00', label: ru ? 'мин' : 'min' },
      { value: '00', label: ru ? 'сек' : 'sec' },
    ]
    clearInterval(timer)
    return
  }
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  timerUnits.value = [
    { value: String(d).padStart(2, '0'), label: ru ? 'д' : 'd' },
    { value: String(h).padStart(2, '0'), label: ru ? 'ч' : 'h' },
    { value: String(m).padStart(2, '0'), label: ru ? 'мин' : 'min' },
    { value: String(s).padStart(2, '0'), label: ru ? 'сек' : 'sec' },
  ]
}

function startTimer() {
  updateTimer()
  timer = setInterval(updateTimer, 1000)
}

function close() {
  const ctx = props.context
  const key = banner.value?.id ? getShownKey(banner.value.id, ctx) : null
  visible.value = false
  if (key) sessionStorage.setItem(key, '1')
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (showTimer) clearTimeout(showTimer)
})
</script>

<style>
/* NOT scoped — Teleport moves this outside component scope */
.bm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.bm-modal {
  background: #111114;
  border: 1px solid rgba(201, 243, 29, 0.25);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, sans-serif;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.bm-close {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #8e8ea8;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;
}
.bm-close:hover { background: rgba(255, 255, 255, 0.18); color: #f0f0f5; }

.bm-glow {
  height: 140px;
  background: linear-gradient(135deg, rgba(201, 243, 29, 0.15) 0%, rgba(79, 110, 247, 0.15) 100%);
}

.bm-img img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.bm-body { padding: 24px 28px 30px; }

.bm-badge {
  display: inline-block;
  background: #c9f31d;
  color: #0a0a0b;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 12px;
}

.bm-modal h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #f0f0f5;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.bm-modal p {
  font-size: 14px;
  color: #8e8ea8;
  line-height: 1.7;
  margin: 0 0 16px 0;
}

.bm-discounts {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.bm-disc-row {
  background: rgba(201, 243, 29, 0.1);
  border: 1px solid rgba(201, 243, 29, 0.2);
  border-radius: 8px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bm-disc-period { font-size: 12px; color: #8e8ea8; }
.bm-disc-val {
  font-family: 'Montserrat', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #c9f31d;
}

.bm-countdown {
  margin-bottom: 20px;
}

.bm-cd-label {
  font-size: 11px;
  color: #52526a;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  font-weight: 600;
}

.bm-cd-blocks {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.bm-cd-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
}

.bm-cd-num-wrap {
  position: relative;
  width: 100%;
  height: 52px;
  background: rgba(201, 243, 29, 0.07);
  border: 1px solid rgba(201, 243, 29, 0.2);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bm-cd-num {
  position: absolute;
  font-family: 'Montserrat', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #c9f31d;
  line-height: 1;
  letter-spacing: -1px;
}

.bm-cd-unit {
  font-size: 10px;
  color: #52526a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* Flip animation — new number slides up from below */
.cd-flip-enter-active {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
}
.cd-flip-leave-active {
  transition: transform 0.2s ease-in, opacity 0.2s ease;
  position: absolute;
}
.cd-flip-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.cd-flip-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.bm-actions { display: flex; gap: 10px; flex-direction: column; }

.bm-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 28px;
  background: #c9f31d;
  color: #0a0a0b;
  border: none;
  border-radius: 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s;
}
.bm-btn-primary:hover { opacity: 0.9; text-decoration: none; }

.bm-btn-skip {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #52526a;
  padding: 11px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.bm-btn-skip:hover { color: #8e8ea8; }

.banner-fade-enter-active,
.banner-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.banner-fade-enter-from,
.banner-fade-leave-to { opacity: 0; transform: scale(0.95); }
</style>
