import type { GraphQLRequest } from '@/types/graphql-request'
import { useLocalStorage } from '@vueuse/core'
import { computed, type Ref } from 'vue'

export function useFilteredRequests(requests: Ref<GraphQLRequest[]>) {
  const nameFilter = useLocalStorage('nameFilter', '')
  const invertNameFilter = useLocalStorage('invertNameFilter', false)
  const typeFilters = useLocalStorage<string[]>('typeFilters', [])

  const filteredRequests = computed(() => {
    return requests.value.filter((request) => {
      const matchesName = request.name.toLowerCase().includes(nameFilter.value.toLowerCase())
      const matchesType =
        typeFilters.value.length === 0 || typeFilters.value.includes(request.operation)

      const nameCondition = nameFilter.value && invertNameFilter.value ? !matchesName : matchesName
      return nameCondition && matchesType
    })
  })

  return {
    requests: filteredRequests,
    nameFilter,
    invertNameFilter,
    typeFilters,
  }
}
