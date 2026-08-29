import './assets/main.css'
import './pollyfills/array-zip'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './app.vue'
import './plugins/chartjs'
import { i18n } from './plugins/i18n'
import './plugins/monaco'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(i18n)

app.mount('#app')
