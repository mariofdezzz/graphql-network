import { useGraphqlNetwork } from '@/composables/use-graphql-network'
import { DEFAULT_NETWORK_ORDER } from '@/constants/default-network-order'
import { getObjectProperty } from '@/logic/get-object-property'
import type { Sort } from '@/types/components/shared/table/sort'
import type { GraphQLRequest } from '@/types/graphql-request'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useNetworkStore = defineStore('network', () => {
  const { requests, recording, clearRequests } = useGraphqlNetwork()

  const order = ref<Sort>(DEFAULT_NETWORK_ORDER)

  const selectedRequest = ref<GraphQLRequest>()
  const preserveLog = useLocalStorage('preserveLog', false)
  const currentUrl = ref('')

  const sortedRequests = computed(() => {
    if (!order.value) return requests.value

    return requests.value.toSorted((a, b) => {
      const column = order.value!.column

      let aValue = getObjectProperty(a, column)
      let bValue = getObjectProperty(b, column)

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) {
        return order.value!.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return order.value!.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  })

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
    requests: sortedRequests,
    order,
    selectedRequest,
    recording,
    timelineStartAt,
    timelineEndAt,
    preserveLog,
    clearRequests,
  }
})
