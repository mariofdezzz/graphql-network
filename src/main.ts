import './assets/main.css'
import './pollyfills/array-zip'

import { createApp } from 'vue'
import App from './app.vue'
import { createPinia } from 'pinia'
import './plugins/monaco'
import './plugins/chartjs'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

app.mount('#app')
