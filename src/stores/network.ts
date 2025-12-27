import { useFilteredRequests } from '@/composables/network/use-filtered-requests'
import { useGraphqlNetwork } from '@/composables/network/use-graphql-network'
import { useSortedRequests } from '@/composables/network/use-sorted-requests'
import { onPageReload } from '@/logic/chrome/on-page-reload'
import type { GraphQLRequest } from '@/types/graphql-request'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useNetworkStore = defineStore('network', () => {
  const { requests, recording, clearRequests } = useGraphqlNetwork()

  const {
    requests: filteredRequests,
    nameFilter,
    invertNameFilter,
    typeFilters,
  } = useFilteredRequests(requests)

  const { requests: sortedRequests, order } = useSortedRequests(filteredRequests)

  const preserveLog = useLocalStorage('preserveLog', false)
  const selectedRequest = ref<GraphQLRequest>()

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

  onPageReload(() => {
    if (!preserveLog.value) {
      clearRequests()
    }
  })

  return {
    requests: sortedRequests,
    nameFilter,
    invertNameFilter,
    typeFilters,
    order,
    selectedRequest,
    recording,
    timelineStartAt,
    timelineEndAt,
    preserveLog,
    clearRequests,
  }
})
