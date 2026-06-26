import { useNetworkStore } from '@/stores/network'
import type {
  GraphQLNetworkRequest,
  GraphQLRequest,
  GraphQLSubscriptionRequest,
} from '@/types/graphql-request'
import { storeToRefs } from 'pinia'
import { computed, unref, type MaybeRef } from 'vue'

export function useRequestTimings(request: MaybeRef<GraphQLRequest>) {
  const networkStore = useNetworkStore()
  const { timelineStartAt, timelineEndAt } = storeToRefs(networkStore)
  const networkRequest = request as GraphQLNetworkRequest

  if (unref(request).operation === 'subscription') {
    const sub = request as MaybeRef<GraphQLSubscriptionRequest>

    const total = computed(() => unref(unref(sub).timings.total) ?? 0)

    // Use CDP ResourceTiming phases when available, otherwise fall back to timestamp delta
    const queueing = computed(() => unref(sub).timings._blocked_queueing ?? 0)
    const stalled = computed(() => {
      const t = unref(sub).timings
      if (t.blocked != null) return Math.max(t.blocked - (t._blocked_queueing ?? 0), 0)
      return 0
    })
    const dns = computed(() => unref(sub).timings.dns ?? 0)
    const connect = computed(() => {
      const t = unref(sub).timings
      return Math.max((t.connect ?? 0) - (t.ssl ?? 0), 0)
    })
    const ssl = computed(() => unref(sub).timings.ssl ?? 0)
    const sent = computed(() => unref(sub).timings.send ?? 0)
    const wait = computed(() => {
      const t = unref(sub).timings
      // Prefer CDP wait (TTFB); fall back to timestamp-based approach
      if (t.wait != null) return t.wait
      if (t.responseReceivedTimestamp != null) {
        return (t.responseReceivedTimestamp - t.baseTimestamp) * 1000
      }
      return 0
    })

    // All fixed phases summed — used to isolate the streaming (download) portion
    const fixedPhases = computed(
      () =>
        queueing.value +
        stalled.value +
        dns.value +
        connect.value +
        ssl.value +
        sent.value +
        wait.value,
    )

    // download = streaming phase (grows as messages arrive)
    const download = computed(() => Math.max(total.value - fixedPhases.value, 0))

    const requestStartedAt = computed(
      () => new Date(unref(sub).timings.startedAt).getTime() - timelineStartAt.value.getTime(),
    )

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
      timespan,
      requestStartedAt,
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
