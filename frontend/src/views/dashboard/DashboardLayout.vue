<template>
  <div class="dashboard" :class="theme">

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
      <div class="sidebar__top">
        <div class="sidebar__logo">
          <span class="logo-icon">↑↓</span>
          <span class="logo-text" v-show="!collapsed">UpDown</span>
        </div>
        <button class="collapse-btn" @click="collapsed = !collapsed">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="!collapsed" d="M15 18l-6-6 6-6"/>
            <path v-else d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar__nav">
        <div class="nav-group">
          <NavItem to="/dashboard" :icon="icons.home" :label="t.nav.home" :collapsed="collapsed" exact />
          <NavItem to="/dashboard/subscriptions" :icon="icons.subscriptions" :label="t.nav.subscriptions" :collapsed="collapsed" />
          <NavItem to="/dashboard/shop" :icon="icons.shop" :label="t.nav.shop" :collapsed="collapsed" />
        </div>

        <div class="nav-section" v-show="!collapsed">{{ t.nav.products }}</div>
        <div class="nav-group">
          <NavItem to="/dashboard/signals" :icon="icons.signals" :label="t.nav.signals" :collapsed="collapsed" />
          <NavItem to="/dashboard/indicators" :icon="icons.indicators" :label="t.nav.indicators" :collapsed="collapsed" />
          <NavItem to="/dashboard/analytics" :icon="icons.analytics" :label="t.nav.analytics" :collapsed="collapsed" />
          <NavItem to="/dashboard/copytrading" :icon="icons.copy" :label="t.nav.copytrading" :collapsed="collapsed" />
          <NavItem to="/dashboard/education" :icon="icons.education" :label="t.nav.education" :collapsed="collapsed" />
        </div>

        <div class="nav-section" v-show="!collapsed">{{ t.nav.business }}</div>
        <div class="nav-group">
          <NavItem to="/dashboard/whitelabel" :icon="icons.whitelabel" :label="t.nav.whitelabel" :collapsed="collapsed" />
          <NavItem to="/dashboard/development" :icon="icons.dev" :label="t.nav.development" :collapsed="collapsed" />
          <NavItem to="/dashboard/affiliate" :icon="icons.affiliate" :label="t.nav.affiliate" :collapsed="collapsed" />
        </div>

        <div class="nav-section" v-show="!collapsed">{{ t.nav.account }}</div>
        <div class="nav-group">
          <NavItem to="/dashboard/finances" :icon="icons.finances" :label="t.nav.finances" :collapsed="collapsed" />
          <NavItem to="/dashboard/support" :icon="icons.support" :label="t.nav.support" :collapsed="collapsed" />
          <NavItem to="/dashboard/profile" :icon="icons.profile" :label="t.nav.profile" :collapsed="collapsed" />
        </div>

        <!-- Admin section -->
        <template v-if="auth.isAdmin || auth.isOwner">
          <div class="nav-section nav-section--admin" v-show="!collapsed">Admin</div>
          <div class="nav-group">
            <NavItem to="/dashboard/admin/users" :icon="icons.users" :label="t.nav.users" :collapsed="collapsed" />
            <NavItem to="/dashboard/admin/plans" :icon="icons.adminSubs" :label="t.nav.adminPlans" :collapsed="collapsed" />
            <NavItem to="/dashboard/admin/shop" :icon="icons.banners" :label="t.nav.adminShop" :collapsed="collapsed" />
            <NavItem to="/dashboard/admin/subscriptions" :icon="icons.adminSubs" :label="t.nav.adminSubs" :collapsed="collapsed" />
            <NavItem to="/dashboard/admin/banners" :icon="icons.banners" :label="t.nav.banners" :collapsed="collapsed" />
            <NavItem to="/dashboard/admin/referral" :icon="icons.referral" :label="t.nav.referral" :collapsed="collapsed" />
            <NavItem to="/dashboard/all-tickets" :icon="icons.tickets" :label="t.nav.allTickets" :collapsed="collapsed" />
            <NavItem v-if="auth.isOwner" to="/dashboard/admin-logs" :icon="icons.logs" :label="t.nav.logs" :collapsed="collapsed" />
          </div>
        </template>
      </nav>

      <div class="sidebar__footer">
        <a href="https://charts.updown.team" target="_blank" rel="noopener" class="charts-link" :title="t.chartsLink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span v-show="!collapsed">{{ t.chartsLink }}</span>
        </a>
        <div class="user-card" v-show="!collapsed">
          <div class="user-avatar">{{ initials }}</div>
          <div class="user-info">
            <div class="user-name">{{ auth.user?.firstName || auth.user?.email?.split('@')[0] }}</div>
            <div class="user-plan" v-if="activePlan">{{ activePlan.plan?.name }}</div>
            <div class="user-plan user-plan--free" v-else>Free</div>
          </div>
        </div>
        <div class="user-avatar user-avatar--sm" v-show="collapsed">{{ initials }}</div>
        <button class="logout-btn" @click="logout" :title="t.logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span v-show="!collapsed">{{ t.logout }}</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="main-wrap">
      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar__left">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
        <div class="topbar__right">
          <!-- Theme -->
          <button class="topbar-btn" @click="toggleTheme" :title="theme === 'dark' ? 'Light mode' : 'Dark mode'">
            <svg v-if="theme === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <!-- Lang -->
          <button class="topbar-btn topbar-btn--lang" @click="toggleLang">{{ lang === 'ru' ? 'EN' : 'RU' }}</button>
          <!-- Notifications -->
          <button class="topbar-btn topbar-btn--notif">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
        </div>
      </header>

      <main class="main-content">
        <router-view />
      </main>
    </div>

  <!-- Global cart toast — visible on all pages -->
  <Transition name="toast-slide">
    <div class="global-cart-toast" v-if="cartStore.count > 0 && !isShopPage">
      🛒 {{ t.cart }}: {{ cartStore.count }}
      <router-link to="/dashboard/shop" class="cart-toast-link">{{ t.goCheckout }} →</router-link>
    </div>
  </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { subscriptionsApi } from '@/api'
import { useCartStore } from '@/stores/cart'

const auth = useAuthStore()
const cartStore = useCartStore()
const isShopPage = computed(() => route.path === '/dashboard/shop')
const router = useRouter()
const route = useRoute()

// Theme & Lang
const theme = ref(localStorage.getItem('ud-theme') || 'dark')
const lang = ref(localStorage.getItem('ud-lang') || 'ru')
function toggleTheme() { theme.value = theme.value === 'dark' ? 'light' : 'dark'; localStorage.setItem('ud-theme', theme.value) }
function toggleLang() { lang.value = lang.value === 'ru' ? 'en' : 'ru'; localStorage.setItem('ud-lang', lang.value) }

const collapsed = ref(false)
const activePlan = ref(null)

onMounted(async () => {
  try { activePlan.value = await subscriptionsApi.getActivePlan().then(r => r.data) } catch {}
})

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
  analytics: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  copy: '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  education: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  whitelabel: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  dev: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  affiliate: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  finances: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  support: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  profile: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  adminSubs: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  banners: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  referral: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>',
  tickets: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>',
  logs: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
}

// Translations
const translations = {
  ru: {
    nav: {
      home: 'Главная', subscriptions: 'Подписки', shop: 'Магазин',
      products: 'Продукты', signals: 'Сигналы', indicators: 'Индикаторы',
      analytics: 'Аналитика', copytrading: 'Копитрейдинг', education: 'Обучение',
      business: 'Бизнес', whitelabel: 'White Label', development: 'Разработка', affiliate: 'Партнёрка',
      account: 'Аккаунт', finances: 'Финансы', support: 'Поддержка', profile: 'Профиль',
      users: 'Пользователи', adminPlans: 'Тарифы', adminShop: 'Магазин', adminSubs: 'Подписки', banners: 'Баннеры', referral: 'Рефералы', allTickets: 'Все тикеты', logs: 'Логи',
    },
    chartsLink: 'Chart Platform',
    cart: 'Корзина',
    goCheckout: 'Оплатить',
    logout: 'Выйти',
    pageTitles: {
      '/dashboard': 'Главная', '/dashboard/subscriptions': 'Мои подписки',
      '/dashboard/shop': 'Магазин', '/dashboard/signals': 'Сигналы',
      '/dashboard/indicators': 'Индикаторы', '/dashboard/analytics': 'Аналитика',
      '/dashboard/copytrading': 'Копитрейдинг', '/dashboard/education': 'Обучение',
      '/dashboard/whitelabel': 'White Label', '/dashboard/development': 'Разработка',
      '/dashboard/affiliate': 'Партнёрка', '/dashboard/finances': 'Финансы',
      '/dashboard/support': 'Поддержка', '/dashboard/profile': 'Профиль',
      '/dashboard/admin/users': 'Пользователи', '/dashboard/admin/subscriptions': 'Управление подписками', '/dashboard/admin/plans': 'Управление тарифами', '/dashboard/admin/shop': 'Управление магазином',
      '/dashboard/admin/banners': 'Конструктор баннеров', '/dashboard/admin/referral': 'Управление рефералами',
    }
  },
  en: {
    nav: {
      home: 'Home', subscriptions: 'Subscriptions', shop: 'Shop',
      products: 'Products', signals: 'Signals', indicators: 'Indicators',
      analytics: 'Analytics', copytrading: 'Copy Trading', education: 'Education',
      business: 'Business', whitelabel: 'White Label', development: 'Development', affiliate: 'Affiliate',
      account: 'Account', finances: 'Finances', support: 'Support', profile: 'Profile',
      users: 'Users', adminPlans: 'Plans', adminShop: 'Shop', adminSubs: 'Subscriptions', banners: 'Banners', referral: 'Referrals', allTickets: 'All Tickets', logs: 'Logs',
    },
    chartsLink: 'Chart Platform',
    cart: 'Cart',
    goCheckout: 'Checkout',
    logout: 'Logout',
    pageTitles: {
      '/dashboard': 'Home', '/dashboard/subscriptions': 'My Subscriptions',
      '/dashboard/shop': 'Shop', '/dashboard/signals': 'Signals',
      '/dashboard/indicators': 'Indicators', '/dashboard/analytics': 'Analytics',
      '/dashboard/copytrading': 'Copy Trading', '/dashboard/education': 'Education',
      '/dashboard/whitelabel': 'White Label', '/dashboard/development': 'Development',
      '/dashboard/affiliate': 'Affiliate', '/dashboard/finances': 'Finances',
      '/dashboard/support': 'Support', '/dashboard/profile': 'Profile',
      '/dashboard/admin/users': 'Users', '/dashboard/admin/subscriptions': 'Manage Subscriptions', '/dashboard/admin/plans': 'Manage Plans', '/dashboard/admin/shop': 'Manage Shop',
      '/dashboard/admin/banners': 'Banner Constructor', '/dashboard/admin/referral': 'Referral Management',
    }
  }
}

const t = computed(() => translations[lang.value])
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Roboto:wght@300;400;500&display=swap');

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
  font-size: 11px; font-weight: 600;
  color: var(--accent);
  &--free { color: var(--text-3); }
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

</style>
