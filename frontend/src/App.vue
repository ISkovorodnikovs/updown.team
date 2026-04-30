<template>
  <router-view :key="$route.meta.key ?? $route.path" />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
onMounted(() => { if (auth.token && !auth.user) auth.fetchMe() })
</script>