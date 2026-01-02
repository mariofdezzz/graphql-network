import type { ChromeNetworkRequest } from '@/types/chrome-network-request'

export function isPreflightRequest(request: ChromeNetworkRequest): boolean {
  return (
    request.request.method === 'OPTIONS' &&
    request._resourceType === 'preflight' &&
    Boolean(request._connectionId)
  )
}
