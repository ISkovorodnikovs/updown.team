import { ref } from 'vue'

// Просмотр картинок на весь экран (одно окно на все публичные страницы).
// open(список, индекс): список — [{ src, alt }]
const items = ref([])
const index = ref(-1)

export function useLightbox() {
  function open(list, i = 0) {
    items.value = list
    index.value = i
  }
  function close() { index.value = -1 }
  function step(d) {
    const n = items.value.length
    if (n > 1) index.value = (index.value + d + n) % n
  }
  return { items, index, open, close, step }
}
