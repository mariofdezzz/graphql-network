import './assets/css/main.css'

import ui from '@nuxt/ui/vue-plugin'
import { ApolloClients } from '@vue/apollo-composable'
import { createApp, h, provide } from 'vue'
import { apolloClient, apolloClientWS } from './apollo'
import App from './app.vue'

const app = createApp({
  setup() {
    provide(ApolloClients, {
      default: apolloClient,
      wsClient: apolloClientWS,
    })
  },

  render: () => h(App),
})

app.use(ui)

app.mount('#app')
