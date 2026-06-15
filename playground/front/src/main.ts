import './assets/css/main.css'

import ui from '@nuxt/ui/vue-plugin'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createApp, h, provide } from 'vue'
import { apolloClient } from './apollo'
import App from './app.vue'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

app.use(ui)

app.mount('#app')
