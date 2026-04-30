import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: () => import('@/views/LandingView.vue') },
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
      // Admin
      { path: 'admin/users', component: () => import('@/views/owner/UsersView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'admin/subscriptions', component: () => import('@/views/admin/AdminSubscriptionsView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'all-tickets', component: () => import('@/views/admin/AllTicketsView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'partners', component: () => import('@/views/admin/PartnersView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'bots-overview', component: () => import('@/views/admin/BotsOverview.vue'), meta: { roles: ['ADMIN','OWNER'] } },
      { path: 'admin-logs', component: () => import('@/views/owner/AdminLogsView.vue'), meta: { roles: ['OWNER'] } },
      { path: 'broadcast', component: () => import('@/views/partner/BroadcastView.vue'), meta: { roles: ['ADMIN','OWNER'] } },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.user && auth.token) await auth.fetchMe()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.guest && auth.isAuthenticated) return '/dashboard'
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) return '/dashboard'
  return true
})

export default router
