<template>
  <div class="apply-page" :class="[theme, lang]">

    <!-- NAV -->
    <nav class="apply-nav">
      <div class="apply-nav__inner">
        <router-link to="/" class="apply-nav__logo">
          <span class="logo-icon">↑↓</span>
          <span class="logo-text">UpDown</span>
        </router-link>
        <div class="apply-nav__actions">
          <button class="icon-btn" @click="toggleTheme">
            <svg v-if="theme === 'dark'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <LangSwitcher />
          <router-link to="/" class="back-link">← {{ t.backHome }}</router-link>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="apply-hero">
      <div class="apply-hero__orb apply-hero__orb--1"></div>
      <div class="apply-hero__orb apply-hero__orb--2"></div>
      <div class="apply-hero__content">
        <div class="apply-hero__badge"><span class="badge-dot"></span>{{ t.badge }}</div>
        <h1 class="apply-hero__title">{{ t.heroTitle }}</h1>
        <p class="apply-hero__sub">{{ t.heroSub }}</p>
        <a href="#apply-form" class="btn-apply btn-apply--primary" style="margin-top:36px">{{ t.applyNow }}</a>
      </div>
    </section>

    <!-- BENEFITS -->
    <section class="benefits-section">
      <div class="benefits-section__inner">
        <div class="section-label">{{ t.benefitsLabel }}</div>
        <h2 class="section-title">{{ t.benefitsTitle }}</h2>
        <div class="benefits-grid">
          <div class="benefit-card" v-for="b in t.benefits" :key="b.icon">
            <div class="benefit-card__icon-wrap"><span>{{ b.icon }}</span></div>
            <div class="benefit-card__body">
              <h3>{{ b.title }}</h3>
              <p>{{ b.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="apply-stats">
      <div class="apply-stats__inner">
        <div class="apply-stat" v-for="s in t.stats" :key="s.num">
          <span class="apply-stat__num">{{ s.num }}</span>
          <span class="apply-stat__label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- FORM SECTION -->
    <section class="form-section" id="apply-form">
      <div class="form-section__inner">
        <div class="form-section__left">
          <div class="section-label">{{ t.formSectionLabel }}</div>
          <h2 class="section-title">{{ t.formSectionTitle }}</h2>
          <p class="form-section__sub">{{ t.formSectionSub }}</p>
          <ul class="perks-list">
            <li v-for="p in t.perks" :key="p"><span class="perk-check">✓</span>{{ p }}</li>
          </ul>
        </div>

        <div class="form-section__right">
          <div class="apply-card">
            <!-- Not authenticated -->
            <div v-if="!auth.isAuthenticated" class="apply-card__center">
              <div class="card-icon">🔐</div>
              <h3>{{ t.authRequired }}</h3>
              <p>{{ t.authRequiredSub }}</p>
              <div class="card-btns">
                <router-link to="/login" class="btn-apply btn-apply--outline">{{ t.signIn }}</router-link>
                <router-link to="/register" class="btn-apply btn-apply--primary">{{ t.register }}</router-link>
              </div>
            </div>

            <!-- Submitted -->
            <div v-else-if="submitted" class="apply-card__center">
              <div class="card-icon">🚀</div>
              <h3>{{ t.successTitle }}</h3>
              <p>{{ t.successSub }}</p>
              <router-link to="/dashboard" class="btn-apply btn-apply--primary" style="margin-top:24px">{{ t.toDashboard }}</router-link>
            </div>

            <!-- Existing application -->
            <div v-else-if="existing">
              <div class="apply-card__status" :class="`status--${existing.status}`">
                <span class="status-icon">{{ existing.status === 'approved' ? '✅' : existing.status === 'rejected' ? '❌' : '⏳' }}</span>
                <div>
                  <strong>{{ t.appStatus[existing.status] || existing.status }}</strong>
                  <p v-if="existing.rejectionReason">{{ t.rejectionReason }}: {{ existing.rejectionReason }}</p>
                </div>
              </div>
              <p v-if="existing.status === 'approved'" class="approved-hint">{{ t.approvedHint }}</p>
              <router-link v-if="existing.status === 'approved'" to="/dashboard/whitelabel" class="btn-apply btn-apply--primary" style="display:inline-flex;margin-top:16px">{{ t.toDashboard }}</router-link>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="submit">
              <h3 class="apply-card__title">{{ t.formTitle }}</h3>
              <p class="apply-card__sub">{{ t.formSub }}</p>
              <div v-if="error" class="apply-alert">{{ error }}</div>
              <div class="apply-form-group">
                <label>{{ t.companyLabel }}</label>
                <input class="apply-input" v-model="form.companyName" :placeholder="t.companyPlaceholder" required />
              </div>
              <div class="apply-form-group">
                <label>{{ t.descLabel }}</label>
                <textarea class="apply-input apply-input--textarea" v-model="form.description" :placeholder="t.descPlaceholder" rows="5" required></textarea>
              </div>
              <button class="btn-apply btn-apply--primary btn-apply--full" :disabled="loading" type="submit">
                <span v-if="loading" class="btn-spinner"></span>
                {{ loading ? t.sending : t.submitBtn }}
              </button>
              <p class="form-note">{{ t.formNote }}</p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="apply-footer">
      <div class="apply-footer__inner">
        <router-link to="/" class="apply-nav__logo">
          <span class="logo-icon">↑↓</span>
          <span class="logo-text">UpDown</span>
        </router-link>
        <span class="apply-footer__copy">© {{ new Date().getFullYear() }} UpDown / AiView Platform</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { partnersApi } from '@/api'
import LangSwitcher from '@/components/LangSwitcher.vue'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/partnerApply'

const auth = useAuthStore()
const loading = ref(false)
const submitted = ref(false)
const error = ref('')
const existing = ref(null)
const form = ref({ companyName: '', description: '' })

const theme = ref(localStorage.getItem('ud-theme') || 'dark')

function toggleTheme() { theme.value = theme.value === 'dark' ? 'light' : 'dark'; localStorage.setItem('ud-theme', theme.value) }

const t = useT(dict)

onMounted(async () => {
  if (auth.isAuthenticated) {
    try { const { data } = await partnersApi.myApplication(); if (data) existing.value = data } catch {}
  }
})

async function submit() {
  loading.value = true; error.value = ''
  try { await partnersApi.apply(form.value); submitted.value = true }
  catch (e) { error.value = e.response?.data?.message || t.value.submitError }
  finally { loading.value = false }
}
</script>

<style lang="scss" scoped>
.apply-page {
  --bg:        #0a0a0b;
  --bg-2:      #111114;
  --bg-3:      #18181c;
  --surface:   rgba(255,255,255,0.04);
  --border:    rgba(255,255,255,0.08);
  --border-2:  rgba(255,255,255,0.14);
  --text:      #f0f0f5;
  --text-2:    #8e8ea8;
  --text-3:    #52526a;
  --accent:    #c9f31d;
  --accent-2:  #b8e019;
  --accent-glow: rgba(201,243,29,0.15);

  &.light {
    --bg:       #f4f6fb;
    --bg-2:     #eef1f8;
    --bg-3:     #e4e8f2;
    --surface:  rgba(0,0,0,0.03);
    --border:   rgba(0,0,0,0.08);
    --border-2: rgba(0,0,0,0.14);
    --text:     #0a0a1a;
    --text-2:   #4a4a6a;
    --text-3:   #9090b0;
  }

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, sans-serif;
}

/* NAV */
.apply-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(10,10,11,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  .apply-page.light & { background: rgba(244,246,251,0.92); }

  &__inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 32px; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
  }
  &__logo {
    display: flex; align-items: center; gap: 8px; text-decoration: none;
  }
  &__actions { display: flex; align-items: center; gap: 10px; }
}
.logo-icon { font-size: 18px; font-weight: 800; font-family: 'Montserrat',sans-serif; color: var(--accent); }
.logo-text  { font-size: 17px; font-weight: 700; font-family: 'Montserrat',sans-serif; color: var(--text); text-decoration: none; }
.back-link  { font-size: 13px; color: var(--text-2); text-decoration: none; transition: color 0.2s; white-space: nowrap; &:hover { color: var(--text); } }
.icon-btn   { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-2); background: var(--surface); color: var(--text-2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; &:hover { color: var(--text); border-color: var(--accent); } }
.lang-btn   { height: 32px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--border-2); background: var(--surface); color: var(--text-2); font-size: 11px; font-weight: 700; font-family: 'Montserrat',sans-serif; cursor: pointer; transition: all 0.2s; &:hover { color: var(--accent); border-color: var(--accent); } }

/* HERO */
.apply-hero {
  position: relative; overflow: hidden;
  padding: 90px 32px 80px; text-align: center;
  &__orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
  &__orb--1 { width: 600px; height: 600px; background: rgba(201,243,29,0.12); top: -200px; left: -150px; }
  &__orb--2 { width: 400px; height: 400px; background: rgba(79,110,247,0.1); bottom: -100px; right: -80px; }
  &__content { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; }
  &__badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 99px; border: 1px solid var(--border-2); background: var(--surface); font-size: 12px; font-weight: 600; color: var(--text-2); margin-bottom: 28px; letter-spacing: 0.3px; }
  &__title { font-family: 'Montserrat',sans-serif; font-size: clamp(26px, 4vw, 52px); font-weight: 800; line-height: 1.1; letter-spacing: -1px; margin-bottom: 20px; }
  &__sub { font-size: clamp(14px, 1.8vw, 17px); line-height: 1.8; color: var(--text-2); max-width: 620px; margin: 0 auto; }
}
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: bdpulse 2s infinite; }
@keyframes bdpulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }

/* SECTION LABELS */
.section-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
.section-title  { font-family: 'Montserrat',sans-serif; font-size: clamp(22px, 3vw, 36px); font-weight: 800; color: var(--text); margin-bottom: 40px; letter-spacing: -0.4px; }

/* BENEFITS */
.benefits-section {
  padding: 80px 32px;
  &__inner { max-width: 1200px; margin: 0 auto; }
}
.benefits-grid {
  display: grid; grid-template-columns: repeat(3,1fr); gap: 18px;
  @media (max-width: 900px) { grid-template-columns: repeat(2,1fr); }
  @media (max-width: 520px) { grid-template-columns: 1fr; gap: 12px; }
}
.benefit-card {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 16px;
  padding: 24px 20px; display: flex; gap: 16px; align-items: flex-start;
  transition: border-color 0.2s, transform 0.2s;
  &:hover { border-color: var(--border-2); transform: translateY(-2px); }
  &__icon-wrap { width: 44px; height: 44px; border-radius: 12px; background: var(--bg-3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 20px; }
  &__body {
    h3 { font-family: 'Montserrat',sans-serif; font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 5px; }
    p  { font-size: 13px; line-height: 1.65; color: var(--text-2); }
  }
}

/* STATS */
.apply-stats {
  background: var(--bg-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: 44px 32px;
  &__inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; text-align: center; }
}
.apply-stat {
  &__num   { display: block; font-family: 'Montserrat',sans-serif; font-size: clamp(28px,3vw,38px); font-weight: 800; color: var(--accent); margin-bottom: 4px; }
  &__label { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; }
}

/* FORM SECTION */
.form-section {
  padding: 80px 32px 100px;
  &__inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  &__sub   { font-size: 14px; line-height: 1.8; color: var(--text-2); margin-bottom: 28px; }
}
.perks-list {
  list-style: none; display: flex; flex-direction: column; gap: 11px;
  li { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--text-2); }
}
.perk-check { width: 20px; height: 20px; border-radius: 50%; background: var(--accent-glow); border: 1px solid rgba(201,243,29,0.3); color: var(--accent); font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* CARD */
.apply-card {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 20px; padding: 36px;
  &__title { font-family: 'Montserrat',sans-serif; font-size: 19px; font-weight: 800; color: var(--text); margin-bottom: 5px; }
  &__sub   { font-size: 13px; color: var(--text-2); margin-bottom: 24px; }
  &__center { text-align: center; padding: 12px 0; h3 { font-family:'Montserrat',sans-serif; font-size:17px; font-weight:700; color:var(--text); margin-bottom:8px; } p { font-size:13px; color:var(--text-2); margin-bottom:20px; line-height:1.6; } }
  &__status { display:flex; gap:14px; align-items:flex-start; padding:16px; border-radius:12px; border:1px solid var(--border); background:var(--bg-3); margin-bottom:14px; strong { display:block; font-size:14px; font-weight:600; color:var(--text); margin-bottom:3px; } p { font-size:12px; color:var(--text-2); } }
}
.status--approved { border-color: rgba(34,197,94,0.3) !important; background: rgba(34,197,94,0.06) !important; }
.status--rejected  { border-color: rgba(239,68,68,0.3)  !important; background: rgba(239,68,68,0.06)  !important; }
.status--pending   { border-color: rgba(249,155,11,0.3) !important; background: rgba(249,155,11,0.06) !important; }
.status-icon { font-size: 26px; }
.card-icon { font-size: 38px; margin-bottom: 14px; }
.card-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.approved-hint { font-size: 13px; color: var(--text-2); line-height: 1.7; margin-top: 4px; }

/* FORM INPUTS */
.apply-form-group { margin-bottom: 16px; label { display:block; font-size:12px; font-weight:600; color:var(--text-2); margin-bottom:6px; letter-spacing:0.3px; } }
.apply-input {
  width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border-2); background: var(--bg-3); color: var(--text); font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  &:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  &::placeholder { color: var(--text-3); }
  &--textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
}
.apply-alert { padding: 11px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 16px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
.form-note { font-size: 12px; color: var(--text-3); text-align: center; margin-top: 12px; line-height: 1.5; }

/* BUTTONS */
.btn-apply {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 28px; border-radius: 10px; font-size: 13px; font-weight: 700;
  font-family: 'Montserrat',sans-serif; letter-spacing: 0.8px; cursor: pointer; border: none;
  text-decoration: none; transition: all 0.2s;
  &--primary { background: var(--accent); color: #0a0a0b; &:hover { background: var(--accent-2); } &:disabled { opacity: 0.5; cursor: not-allowed; } }
  &--outline  { background: transparent; border: 1.5px solid var(--border-2); color: var(--text-2); &:hover { border-color: var(--text); color: var(--text); } }
  &--full { width: 100%; }
}
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.25); border-top-color: #000; border-radius: 50%; animation: bspin 0.6s linear infinite; }
@keyframes bspin { to { transform: rotate(360deg); } }

/* FOOTER */
.apply-footer {
  background: var(--bg-2); border-top: 1px solid var(--border); padding: 22px 32px;
  &__inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  &__copy { font-size: 12px; color: var(--text-3); }
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .form-section__inner { grid-template-columns: 1fr; gap: 40px; }
  .apply-stats__inner { grid-template-columns: repeat(2,1fr); }
}
@media (max-width: 768px) {
  .apply-nav__inner { padding: 0 20px; }
  .apply-hero { padding: 70px 20px 60px; }
  .benefits-section { padding: 60px 20px; }
  .apply-stats { padding: 36px 20px; }
  .form-section { padding: 60px 20px 80px; }
  .apply-footer { padding: 20px; }
}
@media (max-width: 520px) {
  .apply-hero { padding: 56px 16px 48px; }
  .apply-hero__title { letter-spacing: -0.5px; }
  .benefits-section { padding: 48px 16px; }
  .apply-card { padding: 24px 18px; border-radius: 14px; }
  .apply-stats__inner { grid-template-columns: repeat(2,1fr); gap: 12px; }
  .back-link { display: none; }
  .section-title { margin-bottom: 28px; }
}
</style>
