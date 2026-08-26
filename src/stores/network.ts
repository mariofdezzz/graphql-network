import { useFilteredRequests } from '@/composables/contexts/network/use-filtered-requests'
import { useGraphqlNetwork } from '@/composables/contexts/network/use-graphql-network'
import { useSortedRequests } from '@/composables/contexts/network/use-sorted-requests'
import { onPageReload } from '@/logic/contexts/chrome/on-page-reload'
import { useLocalStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { computed, unref } from 'vue'
import { useRequestDetailStore } from './request-detail'

export const useNetworkStore = defineStore('network', () => {
  const { requests, recording, clearRequests } = useGraphqlNetwork()

  const {
    requests: filteredRequests,
    nameFilter,
    invertNameFilter,
    typeFilters,
  } = useFilteredRequests(requests as any) // FIXME

  const { requests: sortedRequests, order } = useSortedRequests(filteredRequests) // FIXME: deprecated

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
        .map(({ timings }) => new Date(timings.startedAt).getTime() + (unref(timings.total) ?? 0))
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
      selectedRequest.value = undefined
    }
  })

  return {
    requests: sortedRequests,
    allRequests: requests,
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
