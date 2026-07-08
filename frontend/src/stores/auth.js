import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, usersApi } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref((typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null) || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const role = computed(() => user.value?.role)
  const isOwner = computed(() => role.value === 'OWNER')
  const isAdmin = computed(() => ['OWNER', 'ADMIN'].includes(role.value))
  const isPartner = computed(() => role.value === 'PARTNER')

  async function fetchMe() {
    if (!token.value) return
    try {
      const { data } = await usersApi.getMe()
      user.value = data
    } catch {
      logout()
    }
  }

  function setAuth(data) {
    token.value = data.accessToken
    user.value = data.user
    localStorage.setItem('token', data.accessToken)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    token, user,
    isAuthenticated, role, isOwner, isAdmin, isPartner,
    fetchMe, setAuth, logout,
  }
})
