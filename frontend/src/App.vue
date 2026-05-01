<template>
  <router-view :key="$route.meta.key ?? $route.path" />
  <BannerModal :context="bannerContext" />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BannerModal from '@/components/BannerModal.vue'

const auth = useAuthStore()
const route = useRoute()

onMounted(() => { if (auth.token && !auth.user) auth.fetchMe() })

// landing = все страницы вне /dashboard; dashboard = внутри /dashboard
const bannerContext = computed(() =>
  route.path.startsWith('/dashboard') ? 'dashboard' : 'landing'
)
</script>