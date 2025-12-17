import { useRequestStore } from '@/stores/request'
import type { GraphQLRequest } from '@/types/graphql-request'
import { storeToRefs } from 'pinia'
import { computed, type Ref } from 'vue'

export function useRequestTimings(request: Ref<GraphQLRequest>) {
  const requestStore = useRequestStore()
  const { timelineStartAt, timelineEndAt } = storeToRefs(requestStore)

  const queueing = computed(() => request.value.timings._blocked_queueing ?? 0)
  const stalled = computed(() => request.value.timings.blocked ?? 0)
  const sent = computed(() => request.value.timings.send ?? 0)
  const wait = computed(() => request.value.timings.wait)
  const download = computed(() => request.value.timings.receive)
  const total = computed(() => request.value.timings.total)

  const requestStartedAt = computed(() => {
    return new Date(request.value.timings.startedAt).getTime() - timelineStartAt.value.getTime()
  })

  const timespan = computed(() => timelineEndAt.value.getTime() - timelineStartAt.value.getTime())

  function formatTime(value: number) {
    return Math.round(value * 100) / 100
  }

  return {
    queueing,
    stalled,
    sent,
    wait,
    download,
    total,
    requestStartedAt,
    timespan,
    formatTime,
  }
}
