import { ref, computed } from 'vue'

// ─────────────────────────────────────────────────────────────
// Единое реактивное ядро локализации.
// Один общий ref `lang` на всё приложение: любое изменение
// мгновенно обновляет все открытые компоненты (в отличие от
// прежнего чтения localStorage через computed, которое не
// реактивно и «замораживало» язык до перезагрузки страницы).
// ─────────────────────────────────────────────────────────────

export const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'ar', label: 'العربية' },
]

const CODES = LANGS.map(l => l.code)

function detectInitial() {
  try {
    const saved = localStorage.getItem('ud-lang')
    if (saved && CODES.includes(saved)) return saved
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase()
    if (CODES.includes(nav)) return nav
  } catch { /* SSR / приватный режим */ }
  return 'en'
}

/** Текущий язык приложения (реактивный, общий для всех компонентов). */
export const lang = ref(detectInitial())

/** true, если текущий язык пишется справа налево (арабский). */
export const isRtl = computed(() => lang.value === 'ar')

/** Проставляет lang/dir на <html> — вызывается при старте и при смене языка. */
export function applyDom(code = lang.value) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('lang', code)
  document.documentElement.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr')
}

/** Смена языка: обновляет ref, localStorage и атрибуты <html>. */
export function setLang(code) {
  if (!CODES.includes(code)) return
  lang.value = code
  try { localStorage.setItem('ud-lang', code) } catch { /* ignore */ }
  applyDom(code)
}

/**
 * Возвращает реактивный словарь переводов для компонента.
 * dict имеет вид { en: {...}, ru: {...}, de: {...}, ... }.
 * Отсутствующие ключи автоматически подхватываются из английского,
 * поэтому пропуск перевода никогда не даст «дырку» в интерфейсе.
 */
export function useT(dict) {
  return computed(() => ({ ...(dict.en || {}), ...(dict[lang.value] || {}) }))
}

// ── Форматирование дат в текущей локали ─────────────────────

const LOCALE_MAP = {
  en: 'en-US', ru: 'ru-RU', de: 'de-DE', es: 'es-ES',
  it: 'it-IT', pt: 'pt-PT', zh: 'zh-CN', ar: 'ar',
}

/** Intl-локаль, соответствующая текущему языку. */
export function currentLocale() {
  return LOCALE_MAP[lang.value] || 'en-US'
}

/** Короткая дата: 21.05.2026 / 5/21/2026 / ٢١‏/٥‏/٢٠٢٦ … */
export function fmtDate(d, opts) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString(currentLocale(), opts) } catch { return '—' }
}

/** Дата + время в текущей локали. */
export function fmtDateTime(d, opts = { dateStyle: 'short', timeStyle: 'short' }) {
  if (!d) return '—'
  try { return new Date(d).toLocaleString(currentLocale(), opts) } catch { return '—' }
}

/** Число в текущей локали (разделители тысяч/дробной части). */
export function fmtNum(v, opts) {
  if (v === null || v === undefined || Number.isNaN(+v)) return '—'
  try { return (+v).toLocaleString(currentLocale(), opts) } catch { return String(v) }
}
