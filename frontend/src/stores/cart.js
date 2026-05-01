import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // { id, name, price, type, periodMonths }
  const selectedPeriod = ref(1)

  const PERIOD_DISCOUNTS = { 1: 0, 3: 3, 6: 5, 12: 15 }

  function effectiveDiscount(months, bannerDiscounts) {
    const base = PERIOD_DISCOUNTS[months] ?? 0
    const bannerD = bannerDiscounts?.[months] ?? 0
    return Math.max(base, bannerD)
  }

  function calcPrice(basePrice, months, bannerDiscounts) {
    const d = effectiveDiscount(months, bannerDiscounts)
    return +((basePrice * months) * (1 - d / 100)).toFixed(2)
  }

  function add(item) {
    if (!items.value.find(i => i.id === item.id)) {
      items.value.push(item)
    }
  }

  function remove(id) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  const count = computed(() => items.value.length)

  return { items, selectedPeriod, add, remove, clear, count, calcPrice, effectiveDiscount, PERIOD_DISCOUNTS }
})
