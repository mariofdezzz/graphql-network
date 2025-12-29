import './assets/main.css'

import { createApp } from 'vue'
import App from './app.vue'
import { createPinia } from 'pinia'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import './plugins/monaco'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

app.mount('#app')
