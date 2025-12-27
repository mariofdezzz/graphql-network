import { DEFAULT_NETWORK_ORDER } from '@/constants/default-network-order'
import { getObjectProperty } from '@/logic/get-object-property'
import type { Sort } from '@/types/components/shared/table/sort'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, ref, type Ref } from 'vue'

export function useSortedRequests(requests: Ref<GraphQLRequest[]>) {
  const order = ref<Sort>(DEFAULT_NETWORK_ORDER)

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

  return { requests: sortedRequests, order }
}
