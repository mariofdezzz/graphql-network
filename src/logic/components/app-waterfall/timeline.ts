import { useRequestTimings } from '@/composables/components/app-aside/request-detail-timing/use-request-timings'
import type { GraphQLRequest } from '@/types/graphql-request'

export function timeline(request: GraphQLRequest, stack: string) {
  const { queueing, stalled, dns, connect, ssl, sent, wait, download } = useRequestTimings(request)

  return [
    {
      barPercentage: 0.6,
      borderSkipped: false,
      data: [queueing.value],
      backgroundColor: '#fff',
      borderColor: '#D3D3D3',
      borderWidth: 1,
      stack,
      maxBarThickness: 3,
    },
    {
      borderSkipped: false,
      data: [stalled.value + dns.value],
      backgroundColor: 'transparent',
      stack,
      maxBarThickness: 3,
    },
    {
      barPercentage: 0.6,
      borderSkipped: false,
      data: [connect.value - ssl.value],
      backgroundColor: '#E9B40A',
      stack,
      maxBarThickness: 3,
    },
    {
      barPercentage: 0.6,
      borderSkipped: false,
      data: [ssl.value],
      backgroundColor: '#D090FF',
      stack,
      maxBarThickness: 3,
    },
    {
      borderSkipped: false,
      data: [sent.value],
      backgroundColor: 'transparent',
      stack,
      maxBarThickness: 3,
    },
    {
      barPercentage: 1,
      borderSkipped: false,
      data: [wait.value],
      backgroundColor: '#38BF60',
      stack,
      maxBarThickness: 3,
    },
    {
      barPercentage: 0.8,
      borderSkipped: false,
      data: [download.value],
      backgroundColor: '#4C8DF5',
      stack,
      maxBarThickness: 3,
    },
  ]
}
