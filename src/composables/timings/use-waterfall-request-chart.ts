import type { GraphQLRequest } from '@/types/graphql-request'
import type { ChartData, ChartOptions } from 'chart.js'
import { computed, type Ref } from 'vue'
import { useRequestTimings } from '../app-aside/request-detail-timing/use-request-timings'

export function useWaterfallChart(request: Ref<GraphQLRequest>) {
  const { queueing, stalled, sent, wait, download, timespan, requestStartedAt } =
    useRequestTimings(request)

  const blocked = computed(() => queueing.value + stalled.value)

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
    datasets: [
      {
        borderSkipped: false,
        data: [[0, requestStartedAt.value]],
        backgroundColor: 'transparent',
        stack: 'timings',
      },
      {
        barThickness: 6,
        borderSkipped: false,
        data: [[0, blocked.value]],
        backgroundColor: '#fff',
        stack: 'timings',
      },
      {
        barThickness: 12,
        borderSkipped: false,
        data: [[0, sent.value + wait.value]],
        backgroundColor: '#38BF60',
        stack: 'timings',
      },
      {
        barThickness: 10,
        borderSkipped: false,
        data: [[0, download.value]],
        backgroundColor: '#4C8DF5',
        stack: 'timings',
      },
    ],
  }))

  return { options, data }
}
