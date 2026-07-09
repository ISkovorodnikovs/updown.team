<script setup>
import { ref, computed, onMounted } from 'vue'
import { shopApi } from '@/api'
import { useT, tDb } from '@/i18n'
import dict from '@/i18n/dicts/education'

const courses = ref([])
const loading = ref(true)
const enrolling = ref(false)
const enrollError = ref('')
const enrolledIds = ref(new Set())
const note = ref('')
const activeCourse = ref(null)

// Статичная галерея результатов (вшита во фронт; управление — в след. спринте)
const gallery = ['/education/result1.jpg', '/education/result2.jpg', '/education/result3.jpg', '/education/result4.jpg', '/education/result5.jpg']
const lightbox = ref(null)

onMounted(async () => {
  courses.value = await shopApi.getEducation().then(r => r.data).catch(() => [])
  loading.value = false
})

const plan = computed(() => t.value.plan)

const included = computed(() => t.value.includedList)

function openEnroll(c) { activeCourse.value = c; note.value = ''; enrollError.value = '' }

async function submitEnroll() {
  if (!activeCourse.value || enrolling.value) return
  enrolling.value = true
  enrollError.value = ''
  try {
    await shopApi.enrollEducation(activeCourse.value.id, note.value)
    enrolledIds.value = new Set([...enrolledIds.value, activeCourse.value.id])
    activeCourse.value = null
  } catch (e) {
    enrollError.value = e.response?.data?.message
      ? (Array.isArray(e.response.data.message) ? e.response.data.message.join(', ') : e.response.data.message)
      : t.value.enrollError
  } finally {
    enrolling.value = false
  }
}

const seatsLeft = (c) => c.meta?.seatsTotal != null
  ? Math.max(0, (c.meta.seatsTotal || 0) - (c.meta.seatsTaken || 0))
  : null

const t = useT(dict)
</script>

<template>
  <div class="edu">
    <div class="edu-head">
      <h1>{{ t.title }}</h1>
      <p>{{ t.sub }}</p>
    </div>

    <div v-if="loading" class="edu-empty">{{ t.loading }}</div>
    <div v-else-if="!courses.length" class="edu-empty">{{ t.empty }}</div>

    <template v-else>
      <div v-for="c in courses" :key="c.id" class="edu-card">
        <div class="edu-card__main">
          <div class="edu-card__info">
            <h2>{{ tDb(c, 'name') }}</h2>
            <p class="edu-card__desc">{{ tDb(c, 'description') }}</p>

            <div v-if="seatsLeft(c) !== null" class="edu-seats">
              🔥 {{ t.seats }}: {{ seatsLeft(c) }} / {{ c.meta.seatsTotal }} {{ t.seatsLeft }}
            </div>
          </div>
          <div class="edu-card__buy">
            <div class="edu-price">{{ c.price }} <span>{{ c.currency }}</span></div>
            <button v-if="enrolledIds.has(c.id)" class="edu-btn edu-btn--done" disabled>{{ t.enrolled }}</button>
            <button v-else class="edu-btn" @click="openEnroll(c)">{{ t.enroll }}</button>
          </div>
        </div>

        <div class="edu-cols">
          <div class="edu-col">
            <h3>{{ t.planTitle }}</h3>
            <ol class="edu-plan">
              <li v-for="(p, i) in plan" :key="i">{{ p }}</li>
            </ol>
          </div>
          <div class="edu-col">
            <h3>{{ t.included }}</h3>
            <ul class="edu-incl">
              <li v-for="(it, i) in included" :key="i">{{ it }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Gallery of results -->
      <div class="edu-gallery">
        <h3>{{ t.results }}</h3>
        <div class="edu-grid">
          <img v-for="(g, i) in gallery" :key="i" :src="g" alt="result" @click="lightbox = g" />
        </div>
      </div>
    </template>

    <!-- Enroll modal -->
    <div v-if="activeCourse" class="edu-overlay" @click.self="activeCourse = null">
      <div class="edu-modal">
        <h2>{{ t.modalTitle }}</h2>
        <p class="edu-modal__hint">{{ t.modalHint }}</p>
        <div class="edu-modal__course">{{ tDb(activeCourse, 'name') }} — {{ activeCourse.price }} {{ activeCourse.currency }}</div>
        <textarea v-model="note" rows="3" :placeholder="t.notePh"></textarea>
        <div v-if="enrollError" class="edu-enroll-err">{{ enrollError }}</div>
        <div class="edu-modal__actions">
          <button class="edu-btn" :disabled="enrolling" @click="submitEnroll">{{ enrolling ? '…' : t.send }}</button>
          <button class="edu-btn edu-btn--ghost" @click="activeCourse = null">{{ t.cancel }}</button>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightbox" class="edu-lightbox" @click="lightbox = null">
      <img :src="lightbox" alt="result" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.edu { padding: 4px; max-width: 1000px; }
.edu-head { margin-bottom: 22px;
  h1 { font-family: 'Montserrat',sans-serif; font-size: 26px; font-weight: 800; margin: 0; }
  p { color: var(--text-2); font-size: 14px; margin: 6px 0 0; } }
.edu-empty { color: var(--text-2); text-align: center; padding: 48px; }
.edu-card { background: var(--bg-2); border: 1px solid var(--border, #26262b); border-radius: 16px; padding: 22px; margin-bottom: 20px; }
.edu-card__main { display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.edu-card__info { flex: 1; min-width: 240px;
  h2 { font-family: 'Montserrat',sans-serif; font-size: 20px; font-weight: 800; margin: 0 0 8px; }
  .edu-card__desc { color: var(--text-2); font-size: 14px; line-height: 1.55; margin: 0 0 12px; } }
.edu-seats { display: inline-block; background: #B9770E22; color: #E59819; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 8px; }
.edu-card__buy { text-align: right; min-width: 150px; }
.edu-price { font-size: 26px; font-weight: 800; margin-bottom: 10px; span { font-size: 13px; color: var(--text-2); font-weight: 600; } }
.edu-btn { background: var(--accent); color: #0a0a0b; border: none; border-radius: 10px; padding: 12px 24px; font-weight: 700; font-size: 14px; cursor: pointer;
  &:hover { opacity: .9; } &:disabled { opacity: .6; cursor: default; }
  &--ghost { background: transparent; color: var(--text-1); border: 1px solid var(--border, #333); }
  &--done { background: var(--bg-3, #1a1a1c); color: #1E8449; border: 1px solid #1E8449; } }
.edu-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 20px; border-top: 1px solid var(--border, #2a2a30); padding-top: 18px; }
.edu-col h3 { font-family: 'Montserrat',sans-serif; font-size: 14px; font-weight: 800; margin: 0 0 10px; }
.edu-plan { margin: 0; padding-left: 18px; li { color: var(--text-1); font-size: 13px; padding: 4px 0; line-height: 1.4; } }
.edu-incl { list-style: none; margin: 0; padding: 0;
  li { color: var(--text-2); font-size: 13px; padding: 4px 0 4px 22px; position: relative;
    &:before { content: '✦'; position: absolute; left: 0; color: var(--accent); } } }
.edu-gallery { margin-top: 8px;
  h3 { font-family: 'Montserrat',sans-serif; font-size: 16px; font-weight: 800; margin: 0 0 14px; } }
.edu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 12px; }
.edu-grid img { width: 100%; height: 130px; object-fit: cover; border-radius: 10px; cursor: pointer; border: 1px solid var(--border, #26262b); transition: transform .15s; &:hover { transform: scale(1.03); } }
.edu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: flex-start; justify-content: center; padding: 50px 16px; z-index: 200; }
.edu-modal { background: var(--bg-1, #131316); border: 1px solid var(--border, #2a2a30); border-radius: 16px; padding: 24px; width: 100%; max-width: 460px;
  h2 { font-family: 'Montserrat',sans-serif; font-size: 18px; font-weight: 800; margin: 0 0 8px; }
  &__hint { font-size: 13px; color: var(--text-2); margin: 0 0 14px; line-height: 1.5; }
  &__course { background: var(--bg-2); border-radius: 8px; padding: 10px 12px; font-size: 14px; font-weight: 600; margin-bottom: 12px; }
  textarea { width: 100%; background: var(--bg-2); border: 1px solid var(--border, #2a2a30); border-radius: 8px; padding: 10px 12px; color: var(--text-1); font-size: 14px; font-family: inherit; resize: vertical; &:focus { outline: none; border-color: var(--accent); } }
  &__actions { display: flex; gap: 10px; margin-top: 14px; } }
.edu-enroll-err { color: #e74c3c; font-size: 13px; margin-top: 10px; }
.edu-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,.85); display: flex; align-items: center; justify-content: center; padding: 30px; z-index: 300; cursor: zoom-out;
  img { max-width: 100%; max-height: 100%; border-radius: 10px; } }
@media (max-width: 600px) { .edu-cols { grid-template-columns: 1fr; } .edu-card__buy { text-align: left; } }
</style>
