import type { GraphQLRequest } from '@/types/graphql-request'
import type { ChartData, ChartOptions } from 'chart.js'
import { computed, type Ref } from 'vue'
import { useRequestTimings } from '../app-aside/request-detail-timing/use-request-timings'

export function useWaterfallChart(request: Ref<GraphQLRequest>, timelineStartAt: Ref<Date>) {
  const { queueing, stalled, sent, wait, download, total } = useRequestTimings(
    request,
    timelineStartAt,
  )

  const blocked = computed(() => queueing.value + stalled.value)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options = computed<ChartOptions<any>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
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
        offset: true,
        min: 0,
        max: total.value,
        display: false,
      },
      y: {
        display: false,
      },
    },
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        borderSkipped: false,
        data: [[0, blocked.value]],
        backgroundColor: '#fff',
        stack: 'timings',
      },
      {
        borderSkipped: false,
        data: [[blocked.value, blocked.value + sent.value + wait.value]],
        backgroundColor: '#38BF60',
        stack: 'timings',
      },
      {
        borderSkipped: false,
        data: [
          [
            blocked.value + sent.value + wait.value,
            blocked.value + sent.value + wait.value + download.value,
          ],
        ],
        backgroundColor: '#4C8DF5',
        stack: 'timings',
      },
    ],
  }))

  return { options, data }
}
