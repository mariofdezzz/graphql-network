import { GRAPHQL_PAYLOAD_KEYS } from '@/constants/network/graphql-payload-keys'
import type { ChromeNetworkRequest } from '@/types/chrome-network-request'

export function isGraphqlRequest(request: ChromeNetworkRequest): boolean {
  if (request.request.method !== 'POST') return false

  try {
    const payload = JSON.parse(request.request.postData?.text ?? '{}')

    return Object.keys(payload).every((key) => GRAPHQL_PAYLOAD_KEYS.includes(key))
  } catch {
    return false
  }
}
