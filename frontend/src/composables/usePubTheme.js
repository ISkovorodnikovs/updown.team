import { ref } from 'vue'

// Тема публичных страниц (общая для шапки и главной). Хранится в localStorage 'ud-theme'.
// Пререндер всегда тёмный; сохранённую тему читаем после монтирования (иначе расхождение гидрации).
const theme = ref('dark')

export function usePubTheme() {
  function loadTheme() {
    try { theme.value = localStorage.getItem('ud-theme') || 'dark' } catch { /* ignore */ }
  }
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem('ud-theme', theme.value) } catch { /* ignore */ }
    // Тема применяется и к страницам входа/регистрации
    try { document.documentElement.setAttribute('data-theme', theme.value) } catch { /* ignore */ }
  }
  return { theme, loadTheme, toggleTheme }
}
