import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { writeFileSync } from 'fs'
import { SEO, OG_LOCALE, langPath, LANDING_LANGS } from './src/seo-meta.js'
import PUBLIC_TEXT from './src/content/publicText.js'
import SITE_SEO from './src/content/siteSeo.js'
import LEGAL_TEXT from './src/content/legalText.js'
import { INDICATORS, INDICATOR_TEXT } from './src/content/indicators.js'

const SITE = 'https://updown.team'

// Страницы без языкового префикса; для каждого языка — '/ru/pricing' и т.д.
const PAGES = ['/', '/indicators', ...INDICATORS.map((i) => `/indicators/${i.slug}`), '/pricing', '/free', '/reviews', '/team', '/terms', '/privacy', '/refunds']
const withLang = (code, page) => (code === 'en' ? page : page === '/' ? `/${code}` : `/${code}${page}`)
const PRERENDER = LANDING_LANGS.flatMap((code) => PAGES.map((page) => withLang(code, page)))

// '/ru/indicators/fib-pro' → { code: 'ru', page: '/indicators/fib-pro' }
function splitRoute(route) {
  const m = String(route).match(/^\/(de|es|it|pt|ru|uk|zh|ar)(?=\/|$)(.*)$/)
  return m ? { code: m[1], page: m[2] || '/' } : { code: 'en', page: route || '/' }
}
const fillTpl = (tpl, v) => String(tpl || '').replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '')
const clip = (s, n = 160) => (String(s).length > n ? String(s).slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : String(s))

// Заголовок и описание страницы на языке
function seoFor(code, page) {
  const ui = (PUBLIC_TEXT[code] || PUBLIC_TEXT.en).seo
  if (page === '/') return SEO[code] || SEO.en
  if (page === '/indicators') return { title: ui.indicatorsTitle, desc: ui.indicatorsDesc }
  if (page === '/pricing') return { title: ui.pricingTitle, desc: ui.pricingDesc }
  if (page === '/free') return { title: ui.freeTitle, desc: ui.freeDesc }
  const ss = SITE_SEO[code] || SITE_SEO.en
  if (page === '/team') return { title: ss.teamTitle, desc: ss.teamDesc }
  if (page === '/reviews') return { title: ss.reviewsTitle, desc: ss.reviewsDesc }
  const ls = (LEGAL_TEXT[code] || LEGAL_TEXT.en).seo
  if (page === '/terms') return { title: ls.termsTitle, desc: ls.termsDesc }
  if (page === '/privacy') return { title: ls.privacyTitle, desc: ls.privacyDesc }
  if (page === '/refunds') return { title: ls.refundsTitle, desc: ls.refundsDesc }
  const slug = page.replace('/indicators/', '')
  const ind = INDICATORS.find((i) => i.slug === slug)
  if (ind) {
    const tx = (INDICATOR_TEXT[code] || INDICATOR_TEXT.en)[slug]
    return { title: fillTpl(ui.indTitle, { name: ind.name, tagline: tx.tagline }), desc: clip(tx.lead) }
  }
  return SEO[code] || SEO.en
}

// Экранирование для HTML-текста и значений атрибутов
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => escText(s).replace(/"/g, '&quot;')

// Инъекция локализованных мета-тегов, canonical и hreflang в HTML каждой страницы
function injectSeo(route, html) {
  const { code, page } = splitRoute(route)
  const s = seoFor(code, page)
  const dir = code === 'ar' ? 'rtl' : 'ltr'
  const url = SITE + withLang(code, page)
  const ogl = OG_LOCALE[code] || 'en_US'

  const setTitle = (h) => h.replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(s.title)}</title>`)
  const setNamed = (h, name, val) =>
    h.replace(new RegExp(`(<meta\\s+name="${name}"\\s+content=")[^"]*(")`, 'i'), `$1${escAttr(val)}$2`)
  const setProp = (h, prop, val) =>
    h.replace(new RegExp(`(<meta\\s+property="${prop}"\\s+content=")[^"]*(")`, 'i'), `$1${escAttr(val)}$2`)

  let out = html
  out = out.replace(/<html[^>]*>/i, `<html lang="${code}" dir="${dir}">`)
  out = setTitle(out)
  out = setNamed(out, 'description', s.desc)
  out = setProp(out, 'og:title', s.title)
  out = setProp(out, 'og:description', s.desc)
  out = setProp(out, 'og:url', url)
  out = setProp(out, 'og:locale', ogl)
  out = setNamed(out, 'twitter:title', s.title)
  out = setNamed(out, 'twitter:description', s.desc)
  out = out.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${url}$2`)
  // hreflang: версии этой же страницы на всех языках
  const alternates = [`<link rel="alternate" hreflang="x-default" href="${SITE}${withLang('en', page)}" />`]
    .concat(LANDING_LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${withLang(l, page)}" />`))
    .join('')
  out = out.replace(/(\s*<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>)+/i, alternates)
  return out
}

// sitemap.xml со всеми страницами и языковыми версиями
function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const prio = (page) => (page === '/' ? '1.0' : ['/terms', '/privacy', '/refunds'].includes(page) ? '0.3' : page === '/indicators' || page === '/pricing' || page === '/free' || page === '/reviews' ? '0.9' : '0.8')
  const urls = []
  for (const page of PAGES) {
    const alts = [`<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${withLang('en', page)}"/>`]
      .concat(LANDING_LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${withLang(l, page)}"/>`))
      .join('\n    ')
    for (const code of LANDING_LANGS) {
      urls.push(`  <url>\n    <loc>${SITE}${withLang(code, page)}</loc>\n    ${alts}\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${prio(page)}</priority>\n  </url>`)
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
  writeFileSync(fileURLToPath(new URL('./dist/sitemap.xml', import.meta.url)), xml)
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  ssgOptions: {
    dirStyle: 'nested',            // /de → dist/de/index.html (совместимо с nginx try_files $uri/)
    formatting: 'minify',
    concurrency: 1,                // последовательный рендер: общий реактивный lang не гоняется между страницами
    includedRoutes: () => PRERENDER,
    onPageRendered: (route, html) => injectSeo(route, html),
    onFinished: () => writeSitemap(),
  },
})
