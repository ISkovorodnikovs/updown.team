// Источник визита (first touch): utm-метки, сайт-источник, страница входа.
// Хранится 30 дней и отправляется при регистрации — в админке видно,
// какая соцсеть и какой пост привели человека.

const KEY = 'ud-src'
const TTL_MS = 30 * 24 * 60 * 60 * 1000
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

function read() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!d || !d.ts || Date.now() - d.ts > TTL_MS) return null
    return d
  } catch { return null }
}

export function captureAttribution() {
  try {
    const q = new URLSearchParams(window.location.search)
    const utm = {}
    for (const k of UTM) { const v = (q.get(k) || '').trim(); if (v) utm[k] = v.slice(0, 200) }
    const saved = read()
    // Новые utm-метки перезаписывают старые; без меток — первый визит сохраняется
    if (saved && !Object.keys(utm).length) return
    let referrer = ''
    try {
      if (document.referrer) {
        const r = new URL(document.referrer)
        if (r.hostname !== window.location.hostname) referrer = r.hostname
      }
    } catch { /* ignore */ }
    const data = {
      ts: Date.now(),
      ...utm,
      referrer: referrer || (saved && saved.referrer) || '',
      landing: window.location.pathname.slice(0, 200),
      first_visit: new Date().toISOString(),
    }
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch { /* приватный режим / SSR */ }
}

/** Данные источника для регистрации (или null). */
export function getAttribution(extra = {}) {
  const d = read() || {}
  const out = {}
  for (const k of [...UTM, 'referrer', 'landing', 'first_visit']) if (d[k]) out[k] = d[k]
  for (const [k, v] of Object.entries(extra)) if (v) out[k] = String(v).slice(0, 200)
  return Object.keys(out).length ? out : undefined
}

/** Событие для Google Tag Manager (реклама и аналитика). */
export function track(event, params = {}) {
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...params })
  } catch { /* ignore */ }
}
