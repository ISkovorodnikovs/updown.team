<template>
  <div class="dashboard" :class="[theme, { 'is-mobile': isMobile }]">

    <!-- Мобильная подложка под выезжающее меню -->
    <div v-if="isMobile && drawer" class="drawer-backdrop" @click="drawer = false"></div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed, 'is-open': drawer }">
      <div class="sidebar__top">
        <div class="sidebar__logo">
          <span class="logo-icon">↑↓</span>
          <span class="logo-text" v-show="!isCollapsed">UpDown</span>
        </div>
        <button v-if="!isMobile" class="collapse-btn" @click="collapsed = !collapsed">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="!collapsed" d="M15 18l-6-6 6-6"/>
            <path v-else d="M9 18l6-6-6-6"/>
          </svg>
        </button>
        <button v-else class="collapse-btn" @click="drawer = false" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <nav class="sidebar__nav">
        <div class="nav-group">
          <NavItem to="/dashboard" :icon="icons.home" :label="t.nav.home" :collapsed="isCollapsed" exact />
          <NavItem to="/dashboard/access" :icon="icons.subscriptions" :label="t.nav.access" :collapsed="isCollapsed" data-tour="nav-access" />
        </div>

        <div class="nav-section" v-show="!isCollapsed">{{ t.nav.products }}</div>
        <div class="nav-group">
          <div data-tour="nav-products">
            <NavItem to="/dashboard/indicators" :icon="icons.indicators" :label="t.nav.indicators" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/signals" :icon="icons.signals" :label="t.nav.signals" :collapsed="isCollapsed" />
          </div>
          <NavItem to="/dashboard/education" :icon="icons.education" :label="t.nav.education" :collapsed="isCollapsed" data-tour="nav-education" />
          <NavItem to="/dashboard/shop" :icon="icons.shop" :label="t.nav.shop" :collapsed="isCollapsed" data-tour="nav-shop" />
        </div>

        <div class="nav-section" v-show="!isCollapsed">{{ t.nav.account }}</div>
        <div class="nav-group">
          <NavItem to="/dashboard/finances" :icon="icons.referral" :label="o.menu.invite" :collapsed="isCollapsed" />
          <NavItem to="/dashboard/support" :icon="icons.support" :label="t.nav.support" :collapsed="isCollapsed" />
        </div>

        <div class="nav-section" v-show="!isCollapsed">{{ o.menu.business }}</div>
        <div class="nav-group nav-group--muted">
          <NavItem to="/dashboard/whitelabel" :icon="icons.whitelabel" :label="t.nav.whitelabel" :collapsed="isCollapsed" />
          <NavItem to="/dashboard/development" :icon="icons.dev" :label="t.nav.development" :collapsed="isCollapsed" />
          <NavItem to="/dashboard/affiliate" :icon="icons.affiliate" :label="t.nav.affiliate" :collapsed="isCollapsed" />
        </div>

        <!-- Partner section -->
        <template v-if="auth.isPartner || auth.isAdmin || auth.isOwner">
          <div class="nav-section nav-section--admin" v-show="!isCollapsed">{{ t.nav.partnerZone }}</div>
          <div class="nav-group">
            <NavItem to="/dashboard/partner/bot" :icon="icons.adminSubs" :label="t.nav.myBot" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/partner/channels" :icon="icons.banners" :label="t.nav.myChannels" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/partner/analytics" :icon="icons.adminSubs" :label="t.nav.signalAnalytics" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/broadcast" :icon="icons.referral" :label="t.nav.broadcast" :collapsed="isCollapsed" />
          </div>
        </template>

        <!-- Admin section -->
        <template v-if="auth.isAdmin || auth.isOwner">
          <div class="nav-section nav-section--admin" v-show="!isCollapsed">Admin</div>
          <div class="nav-group">
            <NavItem to="/dashboard/admin/users" :icon="icons.users" :label="t.nav.users" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/admin/plans" :icon="icons.adminSubs" :label="t.nav.adminPlans" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/admin/shop" :icon="icons.banners" :label="t.nav.adminShop" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/admin/subscriptions" :icon="icons.adminSubs" :label="t.nav.adminSubs" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/admin/banners" :icon="icons.banners" :label="t.nav.banners" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/admin/referral" :icon="icons.referral" :label="t.nav.referral" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/partners" :icon="icons.users" :label="t.nav.partners" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/bots-overview" :icon="icons.adminSubs" :label="t.nav.botsOverview" :collapsed="isCollapsed" />
            <NavItem to="/dashboard/all-tickets" :icon="icons.tickets" :label="t.nav.allTickets" :collapsed="isCollapsed" />
            <NavItem v-if="auth.isOwner" to="/dashboard/admin-logs" :icon="icons.logs" :label="t.nav.logs" :collapsed="isCollapsed" />
          </div>
        </template>
      </nav>

      <div class="sidebar__footer">
        <a href="https://charts.updown.team" target="_blank" rel="noopener" class="charts-link" :title="t.chartsLink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span v-show="!isCollapsed">{{ t.chartsLink }}</span>
        </a>

        <!-- Меню профиля: по клику на аватар -->
        <div class="user-menu-wrap">
          <button class="user-card" :class="{ 'user-card--sm': isCollapsed }" @click.stop="userMenu = !userMenu">
            <div class="user-avatar" :class="{ 'user-avatar--sm': isCollapsed }">{{ initials }}</div>
            <div class="user-info" v-show="!isCollapsed">
              <div class="user-name">{{ auth.user?.firstName || auth.user?.email?.split('@')[0] }}</div>
              <div class="user-plan" :class="'user-plan--' + statusKey">{{ statusLabel }}</div>
            </div>
            <svg v-show="!isCollapsed" class="user-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg>
          </button>
          <div v-if="userMenu" class="user-menu" @click.stop>
            <router-link to="/dashboard/profile" class="user-menu__item">{{ o.menu.profile }}</router-link>
            <router-link to="/dashboard/finances" class="user-menu__item">{{ o.menu.finances }}</router-link>
            <button v-if="ob.canRestart" class="user-menu__item" @click="restartTour">🎓 {{ o.menu.restart }}</button>
            <button class="user-menu__item user-menu__item--danger" @click="logout">{{ t.logout }}</button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="main-wrap">
      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar__left">
          <button v-if="isMobile" class="topbar-btn topbar-btn--menu" @click="drawer = true" :aria-label="o.menu.menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
        <div class="topbar__right">
          <!-- Theme -->
          <button class="topbar-btn" @click="toggleTheme" :title="theme === 'dark' ? 'Light mode' : 'Dark mode'">
            <svg v-if="theme === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <!-- Lang -->
          <LangSwitcher />
          <!-- Notifications -->
          <span class="bell-wrap" data-tour="bell"><NotificationBell /></span>
        </div>
      </header>

      <main class="main-content">
        <PageHint />
        <router-view />
      </main>
    </div>

    <!-- Нижняя панель на телефоне -->
    <nav v-if="isMobile" class="bottom-nav">
      <router-link to="/dashboard" class="bottom-nav__item" exact-active-class="is-active" active-class="">
        <span class="bottom-nav__icon" v-html="svg(icons.home)"></span><span>{{ t.nav.home }}</span>
      </router-link>
      <router-link to="/dashboard/access" class="bottom-nav__item" active-class="is-active" data-tour="nav-access">
        <span class="bottom-nav__icon" v-html="svg(icons.subscriptions)"></span><span>{{ o.menu.access }}</span>
      </router-link>
      <router-link to="/dashboard/shop" class="bottom-nav__item" active-class="is-active" data-tour="nav-shop">
        <span class="bottom-nav__icon" v-html="svg(icons.shop)"></span><span>{{ t.nav.shop }}</span>
      </router-link>
      <router-link to="/dashboard/education" class="bottom-nav__item" active-class="is-active" data-tour="nav-education">
        <span class="bottom-nav__icon" v-html="svg(icons.education)"></span><span>{{ t.nav.education }}</span>
      </router-link>
      <button class="bottom-nav__item" :class="{ 'is-active': drawer }" @click="drawer = true" data-tour="nav-more nav-products">
        <span class="bottom-nav__icon" v-html="svg(icons.menu)"></span><span>{{ o.menu.menu }}</span>
      </button>
    </nav>

  <!-- Global cart toast — visible on all pages -->
  <Transition name="toast-slide">
    <div class="global-cart-toast" v-if="cartStore.count > 0 && !isShopPage">
      🛒 {{ t.cart }}: {{ cartStore.count }}
      <router-link to="/dashboard/shop" class="cart-toast-link">{{ t.goCheckout }} →</router-link>
    </div>
  </Transition>

    <!-- Обучение -->
    <WelcomeModal />
    <OnboardingTour />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { subscriptionsApi } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useOnboardingStore } from '@/stores/onboarding'
import LangSwitcher from '@/components/LangSwitcher.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import WelcomeModal from '@/components/onboarding/WelcomeModal.vue'
import OnboardingTour from '@/components/onboarding/OnboardingTour.vue'
import PageHint from '@/components/onboarding/PageHint.vue'
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/dashboardLayout'
import obDict from '@/i18n/dicts/onboarding'

const auth = useAuthStore()
const cartStore = useCartStore()
const ob = useOnboardingStore()
const router = useRouter()
const route = useRoute()
const isShopPage = computed(() => route.path === '/dashboard/shop')

// Theme & Lang
const theme = ref(localStorage.getItem('ud-theme') || 'dark')
function toggleTheme() { theme.value = theme.value === 'dark' ? 'light' : 'dark'; localStorage.setItem('ud-theme', theme.value) }

const collapsed = ref(false)
const activePlan = ref(null)

// Телефон: меню выезжает слева, внизу — панель из 5 кнопок
const MOBILE_Q = '(max-width: 900px)'
const isMobile = ref(typeof window !== 'undefined' && window.matchMedia(MOBILE_Q).matches)
const drawer = ref(false)
const userMenu = ref(false)
const isCollapsed = computed(() => collapsed.value && !isMobile.value)
let mq = null
function onMq(e) { isMobile.value = e.matches; if (!e.matches) drawer.value = false }
function closeMenus() { userMenu.value = false }

// Статус пользователя для бейджа: Owner / Admin / Partner / Client / Free
const statusKey = computed(() => {
  if (auth.isOwner) return 'owner'
  if (auth.isAdmin) return 'admin'
  if (auth.isPartner) return 'partner'
  if (activePlan.value?.plan?.isTrial) return 'trial'
  if (activePlan.value) return 'client'
  return 'free'
})
const STATUS_LABELS = { owner: 'Owner', admin: 'Admin', partner: 'Partner', client: 'Client', trial: 'FREE · 7d', free: 'Free' }
const statusLabel = computed(() => STATUS_LABELS[statusKey.value])

onMounted(async () => {
  mq = window.matchMedia(MOBILE_Q)
  mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq)
  document.addEventListener('click', closeMenus)
  try { activePlan.value = await subscriptionsApi.getActivePlan().then(r => r.data) } catch {}
  await ob.load()
  markShop(route.path)
  ob.autostart()
})
onBeforeUnmount(() => {
  if (mq) mq.removeEventListener ? mq.removeEventListener('change', onMq) : mq.removeListener(onMq)
  document.removeEventListener('click', closeMenus)
})

// Посетил «Магазин» — отмечаем шаг чек-листа
function markShop(path) {
  if (path !== '/dashboard/shop' || !ob.active) return
  const it = (ob.checklist.items || []).find(i => i.key === 'shop')
  if (it && !it.done) ob.patch({ shopVisited: true })
}
watch(() => route.path, (p) => { drawer.value = false; userMenu.value = false; markShop(p) })

async function restartTour() {
  userMenu.value = false
  drawer.value = false
  await ob.restart()
}

const initials = computed(() => {
  const u = auth.user
  if (!u) return '?'
  if (u.firstName) return (u.firstName[0] + (u.lastName?.[0] || '')).toUpperCase()
  return u.email[0].toUpperCase()
})

function logout() { auth.logout(); router.push('/') }

// Icons
const icons = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  subscriptions: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  shop: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  signals: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  indicators: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  education: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  whitelabel: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  dev: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  affiliate: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  support: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  adminSubs: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  banners: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  referral: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>',
  tickets: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>',
  logs: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  menu: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
}
const svg = (p) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`

const t = useT(dict)
const o = useT(obDict)
const currentPageTitle = computed(() => t.value.pageTitles[route.path] || '')
</script>

<script>
// NavItem как inline компонент
import { defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'

const NavItem = defineComponent({
  props: ['to', 'icon', 'label', 'collapsed', 'exact'],
  setup(props) {
    return () => h(RouterLink, {
      to: props.to,
      class: 'nav-item',
      // Для exact-роутов (Home) не используем router-link-active (prefix match)
      activeClass: props.exact ? '' : 'router-link-active',
      exactActiveClass: 'router-link-exact-active',
    }, () => [
      h('span', { class: 'nav-icon', innerHTML: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${props.icon}</svg>` }),
      !props.collapsed ? h('span', { class: 'nav-label' }, props.label) : null,
    ])
  }
})
export default { components: { NavItem } }
</script>

<style lang="scss" scoped>

.dashboard {
  display: flex;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;

  /* Dark theme */
  --bg:        #0a0a0b;
  --bg-2:      #111114;
  --bg-3:      #18181d;
  --surface:   #1c1c22;
  --surface-2: #242430;
  --border:    rgba(255,255,255,0.07);
  --border-2:  rgba(255,255,255,0.12);
  --text:      #f0f0f0;
  --text-2:    #a0a0b0;
  --text-3:    #606070;
  --accent:    #c9a84c;
  --accent-2:  #e8c96a;
  --accent-rgb: 201, 168, 76;
  --sidebar-bg: #0d0d10;
  --sidebar-border: rgba(255,255,255,0.06);

  &.light {
    --bg:        #f4f6fb;
    --bg-2:      #ffffff;
    --bg-3:      #eef1f8;
    --surface:   #ffffff;
    --surface-2: #f0f4ff;
    --border:    rgba(0,0,0,0.07);
    --border-2:  rgba(0,0,0,0.12);
    --text:      #0f0f1a;
    --text-2:    #4a4a6a;
    --text-3:    #9090aa;
    --accent:    #3b5bdb;
    --accent-2:  #1d3db5;
    --accent-rgb: 59, 91, 219;
    --sidebar-bg: #1a1f3a;
    --sidebar-border: rgba(255,255,255,0.08);
  }

  background: var(--bg);
  color: var(--text);
}

/* ---- SIDEBAR ---- */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.25s ease;
  z-index: 100;

  &--collapsed {
    width: 64px;
    .nav-section { display: none; }
  }

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--sidebar-border); border-radius: 2px; }
}

.sidebar__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid var(--sidebar-border);
  min-height: 64px;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.logo-icon {
  font-size: 18px;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  color: var(--accent);
  flex-shrink: 0;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  color: white;
  white-space: nowrap;
}

.collapse-btn {
  background: none;
  border: none;
  color: var(--text-3);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color 0.2s, background 0.2s;
  &:hover { color: var(--text); background: var(--sidebar-border); }
}

.sidebar__nav {
  flex: 1;
  padding: 12px 0;
}

.nav-group { margin-bottom: 4px; }

.nav-section {
  padding: 16px 16px 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-3);
  white-space: nowrap;
  overflow: hidden;

  &--admin { color: var(--accent); }
}

:deep(.nav-item) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  color: var(--text-2);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
  border-left: 2px solid transparent;
  white-space: nowrap;
  overflow: hidden;

  .nav-icon { flex-shrink: 0; opacity: 0.7; }
  .nav-label { overflow: hidden; text-overflow: ellipsis; }

  &:hover {
    color: var(--text);
    background: rgba(255,255,255,0.04);
    text-decoration: none;
    .nav-icon { opacity: 1; }
  }

  &.router-link-active, &.router-link-exact-active {
    color: var(--accent);
    background: rgba(var(--accent-rgb), 0.08);
    border-left-color: var(--accent);
    .nav-icon { opacity: 1; }
  }
}

.sidebar__footer {
  padding: 12px;
  border-top: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.user-avatar {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), rgba(var(--accent-rgb),0.5));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px; font-weight: 800;
  color: #0a0a0b;
  flex-shrink: 0;

  &--sm { margin: 0 auto; }
}

.user-info { overflow: hidden; }
.user-name {
  font-size: 13px; font-weight: 600;
  color: white;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.user-plan {
  font-size: 11px; font-weight: 700; letter-spacing: .02em;
  color: var(--accent);
  &--free    { color: var(--text-3); }
  &--client  { color: #1E9E5A; }
  &--partner { color: #3B82F6; }
  &--admin   { color: #E5484D; }
  &--owner   { color: var(--accent); }
}

.charts-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: none;
  border: 1px solid rgba(79,110,247,0.25);
  border-radius: 8px;
  color: #4f6ef7;
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  margin-bottom: 8px;
  font-weight: 600;

  &:hover { color: #7b9cff; border-color: rgba(79,110,247,0.5); background: rgba(79,110,247,0.08); text-decoration: none; }

  svg { flex-shrink: 0; }
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: none;
  border: 1px solid var(--sidebar-border);
  border-radius: 8px;
  color: var(--text-3);
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;

  &:hover { color: #ef4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.05); }
}

/* ---- MAIN ---- */
.main-wrap {
  margin-left: 240px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.25s ease;

  .sidebar--collapsed ~ & { margin-left: 64px; }
}

.topbar {
  height: 64px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.3px;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar-btn {
  width: 36px; height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border-2);
  background: var(--surface);
  color: var(--text-2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  &:hover { color: var(--accent); border-color: var(--accent); }

  &--lang {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.5px;
    width: auto; padding: 0 10px;
  }

  &--notif { position: relative; }
}

.main-content {
  flex: 1;
  padding: 28px;
  background: var(--bg);
  overflow-x: hidden;
  min-width: 0;
}

/* Global cart toast */
.global-cart-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-2);
  border: 1px solid var(--accent);
  border-radius: 12px;
  padding: 11px 20px;
  font-size: 13px;
  color: var(--text-2);
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 500;
  box-shadow: 0 4px 24px rgba(0,0,0,0.35);
  white-space: nowrap;
}
.cart-toast-link {
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  &:hover { text-decoration: underline; }
}
.toast-slide-enter-active, .toast-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-slide-enter-from, .toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}

/* ---- Меню профиля ---- */
.user-menu-wrap { position: relative; }
.user-card {
  width: 100%; background: none; border: 1px solid transparent; border-radius: 10px; cursor: pointer;
  color: inherit; text-align: start; font: inherit; padding: 6px;
  &:hover { border-color: var(--sidebar-border); background: rgba(255,255,255,0.03); }
  &--sm { justify-content: center; padding: 4px 0; }
}
.user-caret { margin-inline-start: auto; color: var(--text-3); flex: 0 0 auto; }
.user-menu {
  position: absolute; bottom: calc(100% + 6px); left: 0; right: 0; min-width: 190px;
  background: var(--bg-2); border: 1px solid var(--border-2); border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.45); padding: 6px; z-index: 300;
  display: flex; flex-direction: column;
}
.user-menu__item {
  display: block; width: 100%; text-align: start; background: none; border: none; cursor: pointer;
  padding: 9px 10px; border-radius: 8px; font-size: 13px; color: var(--text-2); text-decoration: none; font-family: inherit;
  &:hover { background: var(--surface); color: var(--text); text-decoration: none; }
  &--danger:hover { color: #ef4444; }
}
.nav-group--muted :deep(.nav-item) { font-size: 12.5px; }

/* ---- Телефон ---- */
.drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1150; }
.bottom-nav { display: none; }
.topbar__left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.page-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

@media (max-width: 900px) {
  .sidebar {
    width: 272px; transform: translateX(-100%); transition: transform .25s ease; z-index: 1200;
    box-shadow: 0 0 40px rgba(0,0,0,0.5);
    &.is-open { transform: none; }
  }
  .main-wrap, .sidebar--collapsed ~ .main-wrap { margin-left: 0; }
  .topbar { height: 56px; padding: 0 12px; }
  .topbar__right { gap: 6px; }
  .page-title { font-size: 16px; }
  .main-content { padding: 16px 14px calc(84px + env(safe-area-inset-bottom)); }
  .bottom-nav {
    display: flex; position: fixed; left: 0; right: 0; bottom: 0; z-index: 900;
    height: calc(62px + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom);
    background: var(--bg-2); border-top: 1px solid var(--border-2);
  }
  .bottom-nav__item {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
    color: var(--text-3); font-size: 10.5px; font-weight: 600; text-decoration: none; background: none; border: none;
    cursor: pointer; font-family: inherit; min-width: 0;
    span:last-child { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 2px; }
    &.is-active { color: var(--accent); }
    &:hover { text-decoration: none; }
  }
  .bottom-nav__icon { display: flex; }
  .global-cart-toast { bottom: calc(76px + env(safe-area-inset-bottom)); }
}
@media (max-width: 420px) {
  .topbar-btn { width: 32px; height: 32px; }
}

</style>
