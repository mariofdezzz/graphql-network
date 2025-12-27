import { useGraphqlNetwork } from '@/composables/network/use-graphql-network'
import { DEFAULT_NETWORK_ORDER } from '@/constants/default-network-order'
import { onPageReload } from '@/logic/chrome/on-page-reload'
import { getObjectProperty } from '@/logic/get-object-property'
import type { Sort } from '@/types/components/shared/table/sort'
import type { GraphQLRequest } from '@/types/graphql-request'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useNetworkStore = defineStore('network', () => {
  const { requests, recording, clearRequests } = useGraphqlNetwork()

  const order = ref<Sort>(DEFAULT_NETWORK_ORDER)
  const nameFilter = useLocalStorage('nameFilter', '')
  const invertNameFilter = useLocalStorage('invertNameFilter', false)
  const typeFilters = useLocalStorage<string[]>('typeFilters', [])

  const selectedRequest = ref<GraphQLRequest>()
  const preserveLog = useLocalStorage('preserveLog', false)

  const filteredRequests = computed(() => {
    return requests.value.filter((request) => {
      const matchesName = request.name.toLowerCase().includes(nameFilter.value.toLowerCase())
      const matchesType =
        typeFilters.value.length === 0 || typeFilters.value.includes(request.operation)

      const nameCondition = nameFilter.value && invertNameFilter.value ? !matchesName : matchesName
      return nameCondition && matchesType
    })
  })

  const sortedRequests = computed(() => {
    if (!order.value) return filteredRequests.value

    return filteredRequests.value.toSorted((a, b) => {
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
