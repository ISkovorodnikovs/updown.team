import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register'
      // На странице авторизации 401 — это просто неверный пароль, не делаем редирект
      if (!isAuthPage) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

// Auth
export const authApi = {
  sendCode: (email) => api.post('/auth/send-code', { email }),
  register: (data, refCode) => api.post(`/auth/register${refCode ? `?ref=${refCode}` : ''}`, data),
  login: (data) => api.post('/auth/login', data),
  sendLoginCode: (email) => api.post('/auth/login/code', { email }),
  verifyLoginCode: (data) => api.post('/auth/login/verify', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

// Users
export const usersApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  changePassword: (data) => api.post('/users/me/change-password', data),
  changeEmail: (data) => api.post('/users/me/change-email', data),
  confirmEmail: (data) => api.post('/users/me/confirm-email', data),
  toggle2FA: (enabled) => api.put('/users/me/2fa', { enabled }),
}

// Partners
export const partnersApi = {
  apply: (data) => api.post('/partners/apply', data),
  myApplication: () => api.get('/partners/my-application'),
  myChannels: () => api.get('/partners/my-channels'),
  updateTemplate: (channelId, template) => api.put(`/partners/my-channels/${channelId}/template`, { template }),
  getAll: (params) => api.get('/partners', { params }),
  review: (id, data) => api.put(`/partners/${id}/review`, data),
  // Admin
  makePartner: (data) => api.post('/partners/make-partner', data),
  getChannels: (id) => api.get(`/partners/${id}/channels`),
  addChannel: (id, data) => api.post(`/partners/${id}/channels`, data),
  updateChannel: (channelId, data) => api.put(`/partners/channels/${channelId}`, data),
  removeChannel: (channelId) => api.delete(`/partners/channels/${channelId}`),
}

// Bots
export const botsApi = {
  getMyBot: () => api.get('/bots/my'),
  setToken: (token) => api.post('/bots/my/token', { token }),
  startBot: () => api.post('/bots/my/start'),
  stopBot: () => api.post('/bots/my/stop'),
  updateButtons: (buttonUrls) => api.put('/bots/my/buttons', { buttonUrls }),
  updateRecipients: (allowedRecipients) => api.put('/bots/my/recipients', { allowedRecipients }),
  getAll: () => api.get('/bots/all'),
}

// Tickets
export const ticketsApi = {
  create: (data) => api.post('/tickets', data),
  getMyTickets: () => api.get('/tickets/my'),
  getAllTickets: (params) => api.get('/tickets/all', { params }),
  getTicket: (id) => api.get(`/tickets/${id}`),
  getMessages: (id) => api.get(`/tickets/${id}/messages`),
  reply: (id, message) => api.post(`/tickets/${id}/reply`, { message }),
  close: (id) => api.put(`/tickets/${id}/close`),
}

// Broadcasts
export const broadcastsApi = {
  send: (data) => api.post('/broadcasts', data),
  history: (params) => api.get('/broadcasts/history', { params }),
}

// Admin
export const adminApi = {
  getUsers: (params) => api.get('/admin/users', { params }),
  assignAdmin: (id) => api.post(`/admin/users/${id}/assign-admin`),
  revokeAdmin: (id) => api.post(`/admin/users/${id}/revoke-admin`),
  deactivateUser: (id) => api.post(`/admin/users/${id}/deactivate`),
  getLogs: (params) => api.get('/admin/logs', { params }),
}

// Plans
export const plansApi = {
  getAll: () => api.get('/plans'),
  getOne: (id) => api.get(`/plans/${id}`),
  // Admin
  getAllAdmin: () => api.get('/plans/admin/all'),
  create: (data) => api.post('/plans', data, { timeout: 120000 }),
  update: (id, data) => api.put(`/plans/${id}`, data, { timeout: 120000 }),
  remove: (id) => api.delete(`/plans/${id}`),
}

// Subscriptions
export const subscriptionsApi = {
  getMy: () => api.get('/subscriptions/my'),
  getMyHistory: () => api.get('/subscriptions/my/history'),
  getMyTransactions: () => api.get('/subscriptions/my/transactions'),
  getActivePlan: () => api.get('/subscriptions/my/active-plan'),
  // Admin
  grant: (data) => api.post('/subscriptions/admin/grant', data),
  getAll: (params) => api.get('/subscriptions/admin/all', { params }),
}

// Payment (Heleket)
export const paymentApi = {
  createInvoice: (data) => api.post('/payment/create', data),
  createBatchInvoice: (data) => api.post('/payment/create-batch', data),
  createChannelInvoice: (data) => api.post('/payment/channel', data),
  channelPrice: (asset, timeframe) => api.get('/payment/channel/price', { params: { asset, timeframe } }),
}

// Referral
export const referralApi = {
  getMy: () => api.get('/referral/my'),
  // Admin
  manualCredit: (data) => api.post('/referral/admin/credit', data),
  reassign: (data) => api.post('/referral/admin/reassign', data),
  zeroBalance: (userId) => api.post(`/referral/admin/zero-balance/${userId}`),
  getEarnings: (userId) => api.get(`/referral/admin/earnings/${userId}`),
  getUsers: (search) => api.get('/referral/admin/users', { params: search ? { search } : {} }),
}

// Banners
export const bannersApi = {
  getActive: () => api.get('/banners/active'),
  getAll: () => api.get('/banners'),
  create: (data) => api.post('/banners', data, { timeout: 120000 }),
  update: (id, data) => api.put(`/banners/${id}`, data, { timeout: 120000 }),
  toggle: (id) => api.post(`/banners/${id}/toggle`),
  remove: (id) => api.delete(`/banners/${id}`),
}

// Shop
export const shopApi = {
  getIndicators: () => api.get('/shop/indicators'),
  getChannels: () => api.get('/shop/channels'),
  getEducation: () => api.get('/shop/education'),
  enrollEducation: (id, note) => api.post(`/shop/education/${id}/enroll`, { note }),
  getMy: () => api.get('/shop/my'),
  setTvUsername: (data) => api.post('/shop/access/tv-username', data),
  contactRequest: (data) => api.post('/shop/access/contact', data),
  // Admin
  getAll: () => api.get('/shop/admin/all'),
  create: (data) => api.post('/shop/products', data, { timeout: 120000 }),
  update: (id, data) => api.put(`/shop/products/${id}`, data, { timeout: 120000 }),
  remove: (id) => api.delete(`/shop/products/${id}`),
}

// Analytics (white-label signals)
export const analyticsApi = {
  myReport: (channelId, from, to) => api.get('/analytics/my', { params: { channelId, from, to } }),
  adminReport: (channelId, from, to) => api.get('/analytics/admin', { params: { channelId, from, to } }),
}

// Signals (daily signal of the day)
export const signalsApi = {
  getDaily: () => api.get('/signals/daily'),
}
