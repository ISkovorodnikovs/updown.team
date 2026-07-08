<script setup>
import { useT } from '@/i18n'
import dict from '@/i18n/dicts/development'
import B2BSection from '@/components/B2BSection.vue'

const data = useT(dict)
</script>

<template>
  <B2BSection source="development" :title="data.title" :tagline="data.tagline" :blocks="data.blocks" :bullets="data.bullets" />
</template>
