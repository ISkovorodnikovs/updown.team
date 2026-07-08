import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { applyDom } from './i18n'
import './assets/styles/main.scss'

applyDom() // выставляет <html lang="…" dir="…"> до первого рендера

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
