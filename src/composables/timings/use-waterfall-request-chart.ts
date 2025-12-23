import type { GraphQLRequest } from '@/types/graphql-request'
import type { ChartData, ChartOptions } from 'chart.js'
import { computed, type Ref } from 'vue'
import { useRequestTimings } from '../app-aside/request-detail-timing/use-request-timings'

export function useWaterfallChart(request: Ref<GraphQLRequest>) {
  const { queueing, stalled, dns, connect, ssl, sent, wait, download, timespan, requestStartedAt } =
    useRequestTimings(request)

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
        barPercentage: 0.6,
        borderSkipped: false,
        data: [[0, queueing.value]],
        backgroundColor: '#fff',
        borderColor: '#D3D3D3',
        borderWidth: 1,
        stack: 'timings',
      },
      {
        borderSkipped: false,
        data: [[0, stalled.value + dns.value]],
        backgroundColor: 'transparent',
        stack: 'timings',
      },
      {
        barPercentage: 0.6,
        borderSkipped: false,
        data: [[0, connect.value - ssl.value]],
        backgroundColor: '#E9B40A',
        stack: 'timings',
      },
      {
        barPercentage: 0.6,
        borderSkipped: false,
        data: [[0, ssl.value]],
        backgroundColor: '#D090FF',
        stack: 'timings',
      },
      {
        borderSkipped: false,
        data: [[0, sent.value]],
        backgroundColor: 'transparent',
        stack: 'timings',
      },
      {
        barPercentage: 1,
        borderSkipped: false,
        data: [[0, wait.value]],
        backgroundColor: '#38BF60',
        stack: 'timings',
      },
      {
        barPercentage: 0.8,
        borderSkipped: false,
        data: [[0, download.value]],
        backgroundColor: '#4C8DF5',
        stack: 'timings',
      },
    ],
  }))

  return { options, data }
}
