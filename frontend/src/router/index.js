import { useAuthStore } from '@/stores/auth'
import { setLang, lang } from '@/i18n'
import { LANDING_LANGS } from '@/seo-meta'

const LANDING = () => import('@/views/LandingView.vue')

// Языковые версии лендинга для SEO: '/', '/de', '/es', ... — все рендерят
// LandingView, язык выставляется из префикса пути (см. beforeEach ниже).
const landingRoutes = LANDING_LANGS.map((code) => ({
  path: code === 'en' ? '/' : `/${code}`,
  component: LANDING,
  meta: { landingLang: code },
}))

export const routes = [
  ...landingRoutes,
  { path: '/partner-apply', component: () => import('@/views/PartnerApplyView.vue') },
  { path: '/login', component: () => import('@/views/auth/AuthView.vue'), meta: { guest: true, key: 'auth' } },
  { path: '/register', component: () => import('@/views/auth/AuthView.vue'), meta: { guest: true, key: 'auth' } },

  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('@/views/dashboard/DashboardHome.vue') },
      { path: 'subscriptions', component: () => import('@/views/dashboard/SubscriptionsView.vue') },
      { path: 'shop', component: () => import('@/views/dashboard/ShopView.vue') },
      { path: 'signals', component: () => import('@/views/dashboard/SignalsView.vue') },
      { path: 'indicators', component: () => import('@/views/dashboard/IndicatorsView.vue') },
      { path: 'analytics', component: () => import('@/views/dashboard/AnalyticsView.vue') },
      { path: 'copytrading', component: () => import('@/views/dashboard/CopytradingView.vue') },
      { path: 'education', component: () => import('@/views/dashboard/EducationView.vue') },
      { path: 'whitelabel', component: () => import('@/views/dashboard/WhitelabelView.vue') },
      { path: 'development', component: () => import('@/views/dashboard/DevelopmentView.vue') },
      { path: 'affiliate', component: () => import('@/views/dashboard/AffiliateView.vue') },
      { path: 'finances', component: () => import('@/views/dashboard/FinancesView.vue') },
      { path: 'support', component: () => import('@/views/dashboard/TicketsView.vue') },
      { path: 'tickets/:id', component: () => import('@/views/dashboard/TicketDetailView.vue') },
      { path: 'profile', component: () => import('@/views/dashboard/ProfileView.vue') },
      // Partner
      { path: 'partner/bot', component: () => import('@/views/partner/BotView.vue'), meta: { roles: ['PARTNER','ADMIN','OWNER'] } },
      { path: 'partner/channels', component: () => import('@/views/partner/PartnerChannelsView.vue'), meta: { roles: ['PARTNER','ADMIN','OWNER'] } },
      { path: 'partner/analytics', component: () => import('@/views/dashboard/SignalsAnalyticsView.vue'), meta: { roles: ['PARTNER','ADMIN','OWNER'] } },
      { path: 'broadcast', component: () => import('@/views/partner/BroadcastView.vue'), meta: { roles: ['PARTNER','ADMIN','OWNER'] } },
      // Admin
      { path: 'admin/users', component: () => import('@/views/owner/UsersView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'admin/subscriptions', component: () => import('@/views/admin/AdminSubscriptionsView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'admin/plans', component: () => import('@/views/admin/AdminPlansView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'admin/shop', component: () => import('@/views/admin/AdminShopView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'admin/banners', component: () => import('@/views/admin/AdminBannersView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'admin/referral', component: () => import('@/views/admin/AdminReferralView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'all-tickets', component: () => import('@/views/admin/AllTicketsView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'partners', component: () => import('@/views/admin/PartnersView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'bots-overview', component: () => import('@/views/admin/BotsOverview.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'admin-logs', component: () => import('@/views/owner/AdminLogsView.vue'), meta: { roles: ['OWNER'] } },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

// Регистрация guard'ов. Вызывается из main.js (в setup-функции ViteSSG),
// т.к. роутер создаёт vite-ssg, а не мы напрямую.
export function setupRouter(router) {
  router.beforeEach(async (to) => {
    // Язык из префикса пути для SEO-версий лендинга ('/de' → de).
    // На сервере (пререндер) корень '/' форсим в 'en'; на клиенте корень
    // оставляем как определил detectInitial (сохранённый/браузерный язык).
    if (to.meta && to.meta.landingLang) {
      if (to.meta.landingLang !== 'en') setLang(to.meta.landingLang)
      else if (typeof window === 'undefined') lang.value = 'en'
    }

    const auth = useAuthStore()
    if (!auth.user && auth.token) await auth.fetchMe()
    if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
    if (to.meta.guest && auth.isAuthenticated) return '/dashboard'
    if (to.meta.roles && !to.meta.roles.includes(auth.role)) return '/dashboard'
    return true
  })
}
