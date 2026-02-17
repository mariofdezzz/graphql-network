import { useNetworkStore } from '@/stores/network'
import type { GraphQLNetworkRequest, GraphQLRequest } from '@/types/graphql-request'
import { storeToRefs } from 'pinia'
import { computed, unref, type MaybeRef } from 'vue'

export function useRequestTimings(request: MaybeRef<GraphQLRequest>) {
  const networkStore = useNetworkStore()
  const { timelineStartAt, timelineEndAt } = storeToRefs(networkStore)
  const networkRequest = request as GraphQLNetworkRequest

  if (unref(request).operation === 'subscription') {
    return {
      queueing: computed(() => 0),
      stalled: computed(() => 0),
      dns: computed(() => 0),
      connect: computed(() => 0),
      ssl: computed(() => 0),
      sent: computed(() => 0),
      wait: computed(() => 0),
      download: computed(() => 0),
      timespan: computed(() => 0),
      total: computed(() => 0),
      requestStartedAt: computed(
        () =>
          new Date(unref(request).timings.startedAt).getTime() - timelineStartAt.value.getTime(),
      ),
    }
  }

  const queueing = computed(() => unref(networkRequest).timings._blocked_queueing ?? 0)
  const stalled = computed(() =>
    Math.max((unref(networkRequest).timings.blocked ?? 0) - queueing.value, 0),
  )
  const dns = computed(() => Math.max(unref(networkRequest).timings.dns ?? 0, 0))
  const connect = computed(() => Math.max(unref(networkRequest).timings.connect ?? 0, 0))
  const ssl = computed(() => Math.max(unref(networkRequest).timings.ssl ?? 0, 0))
  const sent = computed(() => unref(networkRequest).timings.send ?? 0)
  const wait = computed(() => unref(networkRequest).timings.wait)
  const download = computed(() => unref(networkRequest).timings.receive)
  const total = computed(() => unref(networkRequest).timings.total)

  const requestStartedAt = computed(() => {
    return new Date(unref(request).timings.startedAt).getTime() - timelineStartAt.value.getTime()
  })

  const timespan = computed(() => timelineEndAt.value.getTime() - timelineStartAt.value.getTime())

  return {
    queueing,
    stalled,
    dns,
    connect,
    ssl,
    sent,
    wait,
    download,
    total,
    requestStartedAt,
    timespan,
  }
}
