import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes, setupRouter } from './router'
import { applyDom } from './i18n'
import './assets/styles/main.scss'

// ViteSSG создаёт роутер сам (memory-history на сервере, web-history на клиенте)
// и пререндерит указанные в vite.config маршруты в статический HTML.
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior: () => ({ top: 0 }) },
  ({ app, router, isClient }) => {
    app.use(createPinia())
    setupRouter(router)
    if (isClient) applyDom() // выставляем <html lang/dir> и SEO на клиенте
  },
)
