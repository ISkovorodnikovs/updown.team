<template>
  <div class="pub" :class="theme">
    <header class="pub-head" :class="{ 'is-scrolled': scrolled }">
      <div class="pub-head__inner">
        <router-link :to="lp('/')" class="pub-logo" @click="menu = false">
          <span class="pub-logo__icon">↑↓</span><span class="pub-logo__text">UpDown</span>
        </router-link>

        <nav class="pub-nav" :aria-label="t.nav.menu">
          <router-link :to="lp('/indicators')" class="pub-nav__link" active-class="is-active">{{ t.nav.indicators }}</router-link>
          <router-link :to="lp('/pricing')" class="pub-nav__link" active-class="is-active">{{ t.nav.pricing }}</router-link>
          <router-link :to="lp('/free')" class="pub-nav__link" active-class="is-active">{{ t.nav.free }}</router-link>
          <router-link :to="lp('/reviews')" class="pub-nav__link" active-class="is-active">{{ t.footer.reviews }}</router-link>
          <router-link :to="lp('/team')" class="pub-nav__link" active-class="is-active">{{ t.nav.team }}</router-link>
          <router-link to="/partner-apply" class="pub-nav__link">{{ t.nav.business }}</router-link>
        </nav>

        <div class="pub-actions">
          <button class="pub-icon" type="button" @click="toggleTheme" :aria-label="theme === 'dark' ? 'Light mode' : 'Dark mode'">
            <svg v-if="theme === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <LangSwitcher />
          <router-link to="/login" class="pub-btn pub-btn--ghost pub-hide-sm">{{ t.nav.login }}</router-link>
          <router-link to="/register?get=magnet" class="pub-btn pub-btn--gold pub-hide-xs">{{ t.nav.start }}</router-link>
          <button class="pub-burger" type="button" :aria-expanded="menu ? 'true' : 'false'" :aria-label="t.nav.menu" @click="menu = !menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div v-if="menu" class="pub-mobile">
        <router-link :to="lp('/indicators')" @click="menu = false">{{ t.nav.indicators }}</router-link>
        <router-link :to="lp('/pricing')" @click="menu = false">{{ t.nav.pricing }}</router-link>
        <router-link :to="lp('/free')" @click="menu = false">{{ t.nav.free }}</router-link>
        <router-link :to="lp('/reviews')" @click="menu = false">{{ t.footer.reviews }}</router-link>
        <router-link :to="lp('/team')" @click="menu = false">{{ t.nav.team }}</router-link>
        <router-link to="/partner-apply" @click="menu = false">{{ t.nav.business }}</router-link>
        <router-link to="/login" @click="menu = false">{{ t.nav.login }}</router-link>
        <router-link to="/register?get=magnet" class="pub-btn pub-btn--gold" @click="menu = false">{{ t.nav.start }}</router-link>
      </div>
    </header>

    <main class="pub-main">
      <slot />
    </main>

    <ImageLightbox v-if="mounted" />

    <footer class="pub-foot">
      <div class="pub-wrap pub-foot__grid">
        <div class="pub-foot__brand">
          <div class="pub-logo"><span class="pub-logo__icon">↑↓</span><span class="pub-logo__text">UpDown</span></div>
          <p>{{ t.footer.tagline }}</p>
          <div class="pub-social">
            <a v-for="s in socials" :key="s.name" :href="s.href" target="_blank" rel="noopener" :aria-label="s.name" :title="s.name">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="s.icon" /></svg>
            </a>
          </div>
        </div>
        <div class="pub-foot__col">
          <h4>{{ t.footer.product }}</h4>
          <router-link :to="lp('/indicators')">{{ t.footer.indicators }}</router-link>
          <router-link :to="lp('/pricing')">{{ t.footer.pricing }}</router-link>
          <router-link :to="lp('/free')">{{ t.footer.free }}</router-link>
          <a href="https://charts.updown.team" target="_blank" rel="noopener">{{ t.footer.charts }} <span class="pub-arr">↗</span></a>
        </div>
        <div class="pub-foot__col">
          <h4>{{ t.footer.company }}</h4>
          <router-link :to="lp('/team')">{{ t.footer.team }}</router-link>
          <router-link :to="lp('/reviews')">{{ t.footer.reviews }}</router-link>
          <router-link to="/partner-apply">{{ t.footer.business }}</router-link>
          <a href="https://t.me/updown_live" target="_blank" rel="noopener">{{ t.footer.live }} <span class="pub-arr">↗</span></a>
        </div>
        <div class="pub-foot__col">
          <h4>{{ t.footer.support }}</h4>
          <a href="https://t.me/Agent_X_support" target="_blank" rel="noopener">{{ t.footer.supportTg }}: @Agent_X_support</a>
          <span class="pub-foot__plain">{{ t.footer.email }}: <span class="pub-select">support@updown.team</span></span>
        </div>
      </div>
      <div class="pub-wrap pub-foot__bottom">
        <nav class="pub-foot__legal" :aria-label="lt.nav.legal">
          <router-link :to="lp('/terms')">{{ lt.nav.terms }}</router-link>
          <router-link :to="lp('/privacy')">{{ lt.nav.privacy }}</router-link>
          <router-link :to="lp('/refunds')">{{ lt.nav.refunds }}</router-link>
        </nav>
        <p class="pub-foot__disc">{{ t.footer.disclaimer }}</p>
        <p class="pub-foot__copy">© {{ year }} UpDown. {{ t.footer.rights }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LangSwitcher from '@/components/LangSwitcher.vue'
import ImageLightbox from '@/components/public/ImageLightbox.vue'
import { useT, lang } from '@/i18n'
import dict from '@/content/publicText'
import legalDict from '@/content/legalText'
import { lp, stripLang } from '@/utils/publicLang'
import { usePubTheme } from '@/composables/usePubTheme'

const t = useT(dict)
const lt = useT(legalDict)
const route = useRoute()
const router = useRouter()
const menu = ref(false)
const scrolled = ref(false)
const mounted = ref(false)
const year = new Date().getFullYear()

const { theme, loadTheme, toggleTheme } = usePubTheme()

const socials = [
  { name: 'Telegram', href: 'https://t.me/updown_live', icon: 'M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z' },
  { name: 'YouTube', href: 'https://www.youtube.com/@UpDown_team', icon: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z' },
  { name: 'Instagram', href: 'https://www.instagram.com/team_updown', icon: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4zm0 11a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.9-11.3a1.6 1.6 0 1 1-3.1 0 1.6 1.6 0 0 1 3.1 0z' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@updown.team', icon: 'M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 0 1-2.6 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.4-2.5V9.6a5.7 5.7 0 0 0-6.5 5.7 5.7 5.7 0 0 0 5.7 5.7 5.7 5.7 0 0 0 5.7-5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z' },
]

function onScroll() { scrolled.value = window.scrollY > 8 }

onMounted(() => {
  loadTheme()
  mounted.value = true
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// Сменили язык переключателем — переходим на адрес этой же страницы на новом языке
watch(lang, (code) => {
  if (!route.meta?.publicPage) return
  const target = lp(stripLang(route.path), code)
  if (target !== route.path) router.replace({ path: target, hash: route.hash })
})
watch(() => route.fullPath, () => { menu.value = false })
</script>

<style>
/* Общие стили публичных страниц (все классы с префиксом pub-) */
.pub {
  --bg: #0a0a0b; --bg-2: #111114; --surface: #1c1c22; --surface-2: #242430;
  --line: rgba(255,255,255,0.08); --line-2: rgba(255,255,255,0.14);
  --text: #f0f0f0; --text-2: #a0a0b0; --text-3: #6c6c7c;
  --accent: #c9a84c; --accent-2: #e8c96a; --accent-rgb: 201,168,76; --on-accent: #0a0a0b;
  --green: #22c55e; --head-bg: rgba(10,10,11,0.86);
  min-height: 100vh; display: flex; flex-direction: column;
  background: var(--bg); color: var(--text);
  font-family: 'Roboto', system-ui, sans-serif; font-size: 15px; line-height: 1.6;
}
.pub.light {
  --bg: #f4f6fb; --bg-2: #ffffff; --surface: #ffffff; --surface-2: #eef1f8;
  --line: rgba(15,15,26,0.08); --line-2: rgba(15,15,26,0.16);
  --text: #0f0f1a; --text-2: #4a4a6a; --text-3: #7c7c96;
  --accent: #3b5bdb; --accent-2: #1d3db5; --accent-rgb: 59,91,219; --on-accent: #ffffff;
  --green: #15803d; --head-bg: rgba(244,246,251,0.9);
}
.pub a { text-decoration: none; }
.pub a:hover { text-decoration: none; }

.pub-wrap { max-width: 1200px; margin: 0 auto; padding-inline: 24px; width: 100%; }

.pub-head { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 100; border-bottom: 1px solid transparent; background: var(--bg); transition: background .2s, border-color .2s; }
.pub-head.is-scrolled { background: var(--head-bg); backdrop-filter: blur(16px); border-color: var(--line); }
.pub-head__inner { max-width: 1280px; margin: 0 auto; padding-inline: 24px; height: 68px; display: flex; align-items: center; gap: 24px; }
.pub-logo { display: inline-flex; align-items: center; gap: 8px; color: var(--text); font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 17px; }
.pub-logo__icon { color: var(--accent); }
.pub-nav { display: flex; gap: 26px; margin-inline-start: 12px; }
.pub-nav__link { color: var(--text-2); font-size: 14px; font-weight: 500; transition: color .15s; }
.pub-nav__link:hover, .pub-nav__link.is-active { color: var(--text); }
.pub-nav__link.is-active { box-shadow: inset 0 -2px 0 var(--accent); }
.pub-actions { margin-inline-start: auto; display: flex; align-items: center; gap: 10px; }
.pub-icon { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--line-2); background: transparent; color: var(--text-2); display: grid; place-items: center; cursor: pointer; }
.pub-icon:hover { color: var(--accent); border-color: var(--accent); }
.pub-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 10px; padding: 9px 16px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; white-space: nowrap; }
.pub-btn--gold { background: var(--accent); color: var(--on-accent); }
.pub-btn--gold:hover { background: var(--accent-2); }
.pub-btn--ghost { border: 1px solid var(--line-2); color: var(--text); }
.pub-btn--ghost:hover { border-color: var(--accent); }
.pub-burger { display: none; width: 38px; height: 38px; border-radius: 10px; border: 1px solid var(--line-2); background: transparent; cursor: pointer; flex-direction: column; justify-content: center; align-items: center; gap: 4px; }
.pub-burger span { width: 16px; height: 2px; border-radius: 1px; background: var(--text); }
.pub-mobile { display: flex; flex-direction: column; gap: 4px; padding: 10px 24px 18px; border-top: 1px solid var(--line); background: var(--bg-2); }
.pub-mobile a { color: var(--text); padding: 10px 0; font-weight: 500; }
.pub-mobile .pub-btn { margin-top: 8px; padding: 12px; }

.pub-main { flex: 1; }

/* Типографика и блоки страниц */
.pub-label { font-family: 'Montserrat', sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--accent); }
.pub-h1 { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: clamp(30px, 4.6vw, 50px); line-height: 1.08; letter-spacing: -.02em; margin: 0; text-wrap: balance; }
.pub-h2 { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: clamp(22px, 3vw, 32px); line-height: 1.15; letter-spacing: -.015em; margin: 0; text-wrap: balance; }
.pub-h3 { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 18px; line-height: 1.3; margin: 0; }
.pub-lead { color: var(--text-2); font-size: 17px; line-height: 1.6; max-width: 62ch; margin: 0; }
.pub-muted { color: var(--text-3); font-size: 13px; }
.pub-section { padding-block: 56px 0; }
.pub-hero { padding-block: 56px 8px; display: grid; gap: 16px; }
.pub-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.pub-btn--lg { padding: 13px 22px; font-size: 14px; }
.pub-card { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; }
.pub-chip { display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(var(--accent-rgb), .4); color: var(--accent); border-radius: 999px; padding: 3px 10px; font-size: 11.5px; font-weight: 700; letter-spacing: .03em; white-space: nowrap; }
.pub-chip--solid { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
.pub-tab { font-variant-numeric: tabular-nums; }
@media (max-width: 520px) { .pub-hero { padding-block: 36px 4px; } .pub-section { padding-block: 44px 0; } }

.pub-foot { border-top: 1px solid var(--line); background: var(--bg-2); padding-block: 48px 28px; margin-top: 72px; }
.pub-foot__grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 32px; }
.pub-foot__brand p { color: var(--text-2); font-size: 14px; margin: 12px 0 16px; max-width: 34ch; }
.pub-social { display: flex; gap: 10px; }
.pub-social a { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--line-2); color: var(--text-2); display: grid; place-items: center; }
.pub-social a:hover { color: var(--accent); border-color: var(--accent); }
.pub-foot__col { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.pub-foot__col h4 { font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); margin: 0 0 4px; }
.pub-foot__col a, .pub-foot__plain { color: var(--text-2); font-size: 14px; overflow-wrap: anywhere; }
.pub-foot__col a:hover { color: var(--text); }
.pub-select { user-select: all; color: var(--text); }
.pub-foot__bottom { border-top: 1px solid var(--line); margin-top: 32px; padding-top: 20px; display: grid; gap: 8px; }
.pub-foot__legal { display: flex; flex-wrap: wrap; gap: 8px 20px; }
.pub-foot__legal a { color: var(--text-2); font-size: 13px; }
.pub-foot__legal a:hover { color: var(--text); }
.pub-foot__disc { color: var(--text-3); font-size: 12.5px; max-width: 90ch; margin: 0; }
.pub-foot__copy { color: var(--text-3); font-size: 12.5px; margin: 0; }

/* Стрелки-направления в RTL (арабский) зеркалим: → становится ←, ↗ становится ↖ */
.pub-arr { display: inline-block; }
[dir="rtl"] .pub-arr { transform: scaleX(-1); }

.pub a:focus-visible, .pub button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

@media (max-width: 1020px) {
  .pub-nav { display: none; }
  .pub-burger { display: flex; }
}
@media (max-width: 760px) {
  .pub-foot__grid { grid-template-columns: 1fr 1fr; }
  .pub-foot__brand { grid-column: 1 / -1; }
  .pub-hide-sm { display: none; }
}
@media (max-width: 520px) {
  .pub-head__inner, .pub-wrap { padding-inline: 16px; }
  .pub-hide-xs { display: none; }
  .pub-foot__grid { grid-template-columns: 1fr; }
}
</style>
