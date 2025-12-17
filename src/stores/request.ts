import { useGraphqlNetwork } from '@/composables/use-graphql-network'
import type { GraphQLRequest } from '@/types/graphql-request'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useRequestStore = defineStore('request', () => {
  const { requests, recording, clearRequests } = useGraphqlNetwork()

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

  return {
    requests,
    selectedRequest,
    recording,
    timelineStartAt,
    timelineEndAt,
    clearRequests,
  }
})
