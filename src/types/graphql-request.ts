import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { Prettify } from '@/types/prettify'

export type GraphQLRequest = {
  id: string
  name: string
  status: number
  errors: number
  operation: 'query' | 'mutation' | 'subscription' | 'unknown'
  size: number
  timings: Prettify<
    {
      startedAt: string
      total: number
    } & ChromeNetworkRequest['timings']
  >
}
