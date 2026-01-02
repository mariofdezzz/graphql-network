import { useRequestTimings } from '@/composables/app-aside/request-detail-timing/use-request-timings'
import type { GraphQLRequest } from '@/types/graphql-request'

export function timeline(request: GraphQLRequest, stack: string) {
  const { queueing, stalled, dns, connect, ssl, sent, wait, download, requestStartedAt } =
    useRequestTimings(request)

  return [
    {
      borderSkipped: false,
      data: [[0, requestStartedAt.value]],
      backgroundColor: 'transparent',
      stack,
      maxBarThickness: 20,
      categoryPercentage: 0.25,
    },
    {
      barPercentage: 0.6,
      borderSkipped: false,
      data: [[0, queueing.value]],
      backgroundColor: '#fff',
      borderColor: '#D3D3D3',
      borderWidth: 1,
      stack,
      maxBarThickness: 20,
      categoryPercentage: 0.25,
    },
    {
      borderSkipped: false,
      data: [[0, stalled.value + dns.value]],
      backgroundColor: 'transparent',
      stack,
      maxBarThickness: 20,
      categoryPercentage: 0.25,
    },
    {
      barPercentage: 0.6,
      borderSkipped: false,
      data: [[0, connect.value - ssl.value]],
      backgroundColor: '#E9B40A',
      stack,
      maxBarThickness: 20,
      categoryPercentage: 0.25,
    },
    {
      barPercentage: 0.6,
      borderSkipped: false,
      data: [[0, ssl.value]],
      backgroundColor: '#D090FF',
      stack,
      maxBarThickness: 20,
      categoryPercentage: 0.25,
    },
    {
      borderSkipped: false,
      data: [[0, sent.value]],
      backgroundColor: 'transparent',
      stack,
      maxBarThickness: 20,
      categoryPercentage: 0.25,
    },
    {
      barPercentage: 1,
      borderSkipped: false,
      data: [[0, wait.value]],
      backgroundColor: '#38BF60',
      stack,
      maxBarThickness: 20,
      categoryPercentage: 0.25,
    },
    {
      barPercentage: 0.8,
      borderSkipped: false,
      data: [[0, download.value]],
      backgroundColor: '#4C8DF5',
      stack,
      maxBarThickness: 20,
      categoryPercentage: 0.25,
    },
  ]
}
