import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import { isPreflightRequest } from '../is-preflight-request'
import { extractPayload } from './extract-payload'
import { extractQuery } from './extract-query'

export function extractName(request: ChromeNetworkRequest): string {
  const isPreflight = isPreflightRequest(request)

  const payload = isPreflight ? extractPayload(request._x_preflight_for!) : extractPayload(request)
  const query = extractQuery(payload)

  const name = payload.operationName ?? /query\s*(?<name>\w+)/.exec(query)?.groups?.name ?? '-'

  return isPreflight ? `(${name})` : name
}
