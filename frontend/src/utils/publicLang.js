import { lang } from '@/i18n'
import { LANDING_LANGS } from '@/seo-meta'

// Путь публичной страницы на нужном языке: en → '/pricing', ru → '/ru/pricing'.
export function lp(path = '/', code = lang.value) {
  const p = path.startsWith('/') ? path : '/' + path
  if (!LANDING_LANGS.includes(code) || code === 'en') return p
  return p === '/' ? `/${code}` : `/${code}${p}`
}

// Убирает языковой префикс: '/ru/pricing' → '/pricing'
export function stripLang(path) {
  const m = String(path || '/').match(/^\/(de|es|it|pt|ru|uk|zh|ar)(?=\/|$)(.*)$/)
  if (!m) return path || '/'
  return m[2] || '/'
}

// Подстановка {name} в строку
export const fill = (tpl, vars = {}) => String(tpl || '').replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''))
