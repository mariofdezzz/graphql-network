import { useRequestStore } from '@/stores/request'
import type { GraphQLRequest } from '@/types/graphql-request'
import { storeToRefs } from 'pinia'
import { computed, unref, type MaybeRef } from 'vue'

export function useRequestTimings(request: MaybeRef<GraphQLRequest>) {
  const requestStore = useRequestStore()
  const { timelineStartAt, timelineEndAt } = storeToRefs(requestStore)

  const queueing = computed(() => unref(request).timings._blocked_queueing ?? 0)
  const stalled = computed(() => unref(request).timings.blocked ?? 0)
  const sent = computed(() => unref(request).timings.send ?? 0)
  const wait = computed(() => unref(request).timings.wait)
  const download = computed(() => unref(request).timings.receive)
  const total = computed(() => unref(request).timings.total)

  const requestStartedAt = computed(() => {
    return new Date(unref(request).timings.startedAt).getTime() - timelineStartAt.value.getTime()
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
