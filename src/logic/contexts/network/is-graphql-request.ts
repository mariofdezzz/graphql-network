import { GRAPHQL_PAYLOAD_KEYS } from '@/constants/network/graphql-payload-keys'
import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import { extractGraphqlPayload } from './extract-graphql-payload'

export function isGraphqlRequest(request: ChromeNetworkRequest): boolean {
  if (request.request.method !== 'POST') return false

  try {
    const { payload } = extractGraphqlPayload(request.request.postData as any)
    if (!payload) return false

    return Object.keys(payload).every((key) => GRAPHQL_PAYLOAD_KEYS.includes(key))
  } catch {
    return false
  }
}
