import { ref, computed } from 'vue'

// ─────────────────────────────────────────────────────────────
// Единое реактивное ядро локализации.
// Один общий ref `lang` на всё приложение: любое изменение
// мгновенно обновляет все открытые компоненты (в отличие от
// прежнего чтения localStorage через computed, которое не
// реактивно и «замораживало» язык до перезагрузки страницы).
// ─────────────────────────────────────────────────────────────

export const LANGS = [
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'de', label: 'Deutsch', flag: 'de' },
  { code: 'es', label: 'Español', flag: 'es' },
  { code: 'it', label: 'Italiano', flag: 'it' },
  { code: 'pt', label: 'Português', flag: 'pt' },
  { code: 'ru', label: 'Русский', flag: 'ru' },
  { code: 'uk', label: 'Українська', flag: 'ua' },
  { code: 'zh', label: '中文', flag: 'cn' },
  { code: 'ar', label: 'العربية', flag: 'sa' },
]

const CODES = LANGS.map(l => l.code)

function detectInitial() {
  try {
    // 0) языковой префикс пути (/de, /es, ...) — совпадение с пререндеренной версией
    const p = (window.location.pathname || '').match(/^\/(de|es|it|pt|ru|uk|zh|ar)(?=\/|$)/)
    if (p) return p[1]
    // 1) ?lang=xx из URL
    const q = (new URLSearchParams(window.location.search).get('lang') || '')
      .slice(0, 2).toLowerCase()
    if (q && CODES.includes(q)) {
      try { localStorage.setItem('ud-lang', q) } catch { /* ignore */ }
      return q
    }
    // 2) сохранённый выбор
    const saved = localStorage.getItem('ud-lang')
    if (saved && CODES.includes(saved)) return saved
    // 3) язык браузера
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase()
    if (CODES.includes(nav)) return nav
  } catch { /* SSR / приватный режим */ }
  return 'en'
}

/** Текущий язык приложения (реактивный, общий для всех компонентов). */
export const lang = ref(detectInitial())

/** true, если текущий язык пишется справа налево (арабский). */
export const isRtl = computed(() => lang.value === 'ar')

// ── SEO: локализованные title и description для <head> ──────
// Строки берём из общего модуля seo-meta (его же использует конфиг сборки
// для инъекции мета-тегов в пререндеренные страницы).
// На клиенте обновляем title/description под выбранный язык; пререндер
// проставляет их статически в HTML каждой языковой версии.
import { SEO } from '@/seo-meta'

/** Обновляет <title> и meta description под текущий язык. */
export function applySeo(code = lang.value) {
  if (typeof document === 'undefined') return
  const s = SEO[code] || SEO.en
  document.title = s.title
  let m = document.querySelector('meta[name="description"]')
  if (!m) {
    m = document.createElement('meta')
    m.setAttribute('name', 'description')
    document.head.appendChild(m)
  }
  m.setAttribute('content', s.desc)
}

/** Проставляет lang/dir на <html> и обновляет SEO — при старте и при смене языка. */
export function applyDom(code = lang.value) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('lang', code)
  document.documentElement.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr')
  applySeo(code)
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
/**
 * Локализация контента из БД (товары, планы и т.п.).
 * Берёт obj.<field>Translations[lang] с фолбэком en -> оригинал obj[field].
 * Пример: tDb(product, 'name') или tDb(product, 'description').
 * Реактивно: при смене языка шаблон перерисуется (читаем lang.value).
 */
export function tDb(obj, field, code = lang.value) {
  if (!obj) return ''
  const tr = obj[field + 'Translations']
  if (tr && typeof tr === 'object') {
    return tr[code] || tr.en || obj[field] || ''
  }
  return obj[field] || ''
}

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
