import { useRequestTimings } from '@/composables/components/app-aside/request-detail-timing/use-request-timings'
import { useNetworkStore } from '@/stores/network'
import type { ChartData, ChartOptions } from 'chart.js'
import { computed, type UnwrapRef } from 'vue'

export function useWaterfallChart() {
  const networkStore = useNetworkStore()

  const requestsTimings = computed(() =>
    networkStore.requests
      .map((request) => useRequestTimings(request))
      .map((timings) => ({
        queueing: timings.queueing.value,
        stalled: timings.stalled.value,
        sent: timings.sent.value,
        wait: timings.wait.value,
        download: timings.download.value,
        total: timings.total.value,
        requestStartedAt: timings.requestStartedAt.value,
        timespan: timings.timespan.value,
      })),
  )
  const timingsByStack = computed(() =>
    requestsTimings.value
      .toSorted((a, b) => a.requestStartedAt - b.requestStartedAt)
      .reduce<UnwrapRef<typeof requestsTimings>[]>((acc, timing) => {
        if (acc.length === 0) {
          acc.push([timing])
          return acc
        }
        const index = acc.findIndex(
          (stack) => stack.at(-1)!.requestStartedAt + stack.at(-1)!.total < timing.requestStartedAt,
        )

        if (index === -1) {
          acc.push([timing])
        } else {
          acc[index]!.push(timing)
        }

        return acc
      }, []),
  )
  const timespan = computed(() => requestsTimings.value[0]?.timespan || 0)

  const options = computed<ChartOptions<any>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    devicePixelRatio: window.devicePixelRatio,
    hover: { mode: null },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: { enabled: false },
    },
    indexAxis: 'y',
    scales: {
      x: {
        min: 0,
        max: timespan.value,
        display: false,
      },
      y: {
        display: false,
      },
    },
  }))

  const data = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets:
      timingsByStack.value[0]
        ?.map((timing) => [
          {
            borderSkipped: false,
            data: [[0, timing.requestStartedAt]],
            backgroundColor: 'transparent',
            stack: 'timings',
          },
          {
            borderSkipped: false,
            data: [[0, timing.total]],
            backgroundColor: '#38BF60',
            stack: 'timings',
          },
        ])
        .flat() ?? [],
  }))

  return { options, data }
}
