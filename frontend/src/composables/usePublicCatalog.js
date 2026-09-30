import { ref } from 'vue'
import { publicApi } from '@/api'

// Актуальные цены и названия из базы для публичных страниц.
// На пререндере (без сети) страница показывает значения по умолчанию.
const catalog = ref(null)
const plans = ref(null)
let loading = null

export function usePublicCatalog() {
  if (typeof window !== 'undefined' && !loading) {
    loading = Promise.all([
      publicApi.catalog().then((r) => { catalog.value = r.data }).catch(() => {}),
      publicApi.plans().then((r) => { plans.value = r.data }).catch(() => {}),
    ])
  }
  const priceOf = (id, fallback = 49) => {
    const p = catalog.value?.products?.find((x) => x.id === id)
    return p ? Number(p.price) : fallback
  }
  const productById = (id) => catalog.value?.products?.find((x) => x.id === id) || null
  return { catalog, plans, priceOf, productById }
}
