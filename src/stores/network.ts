import { useFilteredRequests } from '@/composables/network/use-filtered-requests'
import { useGraphqlNetwork } from '@/composables/network/use-graphql-network'
import { useSortedRequests } from '@/composables/network/use-sorted-requests'
import { onPageReload } from '@/logic/chrome/on-page-reload'
import { useLocalStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRequestDetailStore } from './request-detail'

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

  const requestDetailStore = useRequestDetailStore()
  const { requestDetail: selectedRequest } = storeToRefs(requestDetailStore)

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

  function exposedClearRequests() {
    clearRequests()
    selectedRequest.value = undefined
  }

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
    clearRequests: exposedClearRequests,
  }
})
