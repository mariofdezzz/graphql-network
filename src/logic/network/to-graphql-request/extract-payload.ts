import type { ChromeNetworkRequest } from '@/types/chrome-network-request'

export function extractPayload(request: ChromeNetworkRequest): any {
  return JSON.parse(request.request.postData?.text ?? 'null')
}
