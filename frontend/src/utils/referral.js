// Реферальный код из ссылки вида https://updown.team/?ref=CODE (или /register?ref=CODE).
// Запоминаем код на 30 дней, чтобы он не терялся, если человек сначала
// походил по сайту и только потом дошёл до регистрации.
// Правило: «первый реферер побеждает» — новый ?ref= не перезаписывает
// ещё действующий сохранённый код.

const KEY = 'ud-ref'
const TTL_MS = 30 * 24 * 60 * 60 * 1000
const CODE_RE = /^[A-Za-z0-9_-]{3,64}$/

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || !data.code || !data.ts) return null
    if (Date.now() - data.ts > TTL_MS) {
      localStorage.removeItem(KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

/** Вызывается один раз при загрузке сайта на клиенте. */
export function captureReferral() {
  try {
    const code = (new URLSearchParams(window.location.search).get('ref') || '').trim()
    if (!code || !CODE_RE.test(code)) return
    if (read()) return
    localStorage.setItem(KEY, JSON.stringify({ code, ts: Date.now() }))
  } catch { /* приватный режим / SSR */ }
}

/** Действующий реферальный код или undefined. */
export function getReferral() {
  try {
    const q = (new URLSearchParams(window.location.search).get('ref') || '').trim()
    if (q && CODE_RE.test(q)) return q
  } catch { /* ignore */ }
  return read()?.code || undefined
}

/** После успешной регистрации код больше не нужен. */
export function clearReferral() {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
}
