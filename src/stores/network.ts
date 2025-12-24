import { useGraphqlNetwork } from '@/composables/use-graphql-network'
import type { GraphQLRequest } from '@/types/graphql-request'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useNetworkStore = defineStore('network', () => {
  const { requests, recording, clearRequests } = useGraphqlNetwork()

  const selectedRequest = ref<GraphQLRequest>()
  const preserveLog = useLocalStorage('preserveLog', false)
  const currentUrl = ref('')

  const timelineStartAt = computed(() => {
    return new Date(
      requests.value
        .map(({ timings }) => new Date(timings.startedAt).getTime())
        .reduce(
          (current, startedAt) => (startedAt < current ? startedAt : current),
          new Date().getTime(),
        ),
    )
  })

  const timelineEndAt = computed(() => {
    return new Date(
      requests.value
        .map(({ timings }) => new Date(timings.startedAt).getTime() + timings.total)
        .reduce((current, endedAt) => (endedAt > current ? endedAt : current), 0),
    )
  })

  chrome.devtools?.inspectedWindow.eval('window.location.href', (url: string, err) => {
    if (!err) currentUrl.value = url
  })

  chrome.devtools?.network.onNavigated.addListener((url) => {
    if (currentUrl.value === url && !preserveLog.value) {
      clearRequests()
    }
    currentUrl.value = url
  })

  return {
    requests,
    selectedRequest,
    recording,
    timelineStartAt,
    timelineEndAt,
    preserveLog,
    clearRequests,
  }
})
