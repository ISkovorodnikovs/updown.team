import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { SEO, OG_LOCALE, langPath } from './src/seo-meta.js'

const SITE = 'https://updown.team'
const PRERENDER = ['/', '/de', '/es', '/it', '/pt', '/ru', '/zh', '/ar']

// Экранирование для HTML-текста и значений атрибутов
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => escText(s).replace(/"/g, '&quot;')

function codeFromRoute(route) {
  const seg = route.replace(/\//g, '')
  return seg || 'en'
}

// Инъекция локализованных мета-тегов в готовый HTML каждой языковой версии
function injectSeo(route, html) {
  const code = codeFromRoute(route)
  const s = SEO[code] || SEO.en
  const dir = code === 'ar' ? 'rtl' : 'ltr'
  const url = SITE + langPath(code)
  const ogl = OG_LOCALE[code] || 'en_US'

  const setTitle = (h) => h.replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(s.title)}</title>`)
  const setNamed = (h, name, val) =>
    h.replace(new RegExp(`(<meta\\s+name="${name}"\\s+content=")[^"]*(")`, 'i'), `$1${escAttr(val)}$2`)
  const setProp = (h, prop, val) =>
    h.replace(new RegExp(`(<meta\\s+property="${prop}"\\s+content=")[^"]*(")`, 'i'), `$1${escAttr(val)}$2`)

  let out = html
  // <html lang/dir>
  out = out.replace(/<html[^>]*>/i, `<html lang="${code}" dir="${dir}">`)
  // title + description
  out = setTitle(out)
  out = setNamed(out, 'description', s.desc)
  // Open Graph
  out = setProp(out, 'og:title', s.title)
  out = setProp(out, 'og:description', s.desc)
  out = setProp(out, 'og:url', url)
  out = setProp(out, 'og:locale', ogl)
  // Twitter
  out = setNamed(out, 'twitter:title', s.title)
  out = setNamed(out, 'twitter:description', s.desc)
  // canonical
  out = out.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${url}$2`)
  return out
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
  },
})
