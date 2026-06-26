import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import { extractGraphqlPayload } from '../extract-graphql-payload'

export function extractPayload(request: ChromeNetworkRequest): any {
  const { payload } = extractGraphqlPayload(request.request.postData as any)
  return payload
}
