import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { GraphQLNetworkRequest, GraphQLRequest } from '@/types/graphql-request'
import { hasCorsErrors } from './has-cors-errors'
import { isPreflightRequest } from './is-preflight-request'
import { extractName } from './to-graphql-request/extract-name'
import { extractOperation } from './to-graphql-request/extract-operation'
import { extractPayload } from './to-graphql-request/extract-payload'
import { extractQuery } from './to-graphql-request/extract-query'

export async function toGraphQLRequest(
  request: ChromeNetworkRequest,
  preflight?: ChromeNetworkRequest,
): Promise<GraphQLNetworkRequest | null> {
  try {
    const isPreflight = isPreflightRequest(request)

    const payload = extractPayload(request)
    const query = extractQuery(payload)
    const operation = isPreflight
      ? 'preflight'
      : extractOperation<GraphQLNetworkRequest['operation']>(query)
    const name = extractName(request)

    const responseText = await new Promise<string>((resolve) =>
      request.getContent ? request.getContent(resolve) : resolve('null'),
    )
    const response = JSON.parse(responseText ?? 'null')
    const errors = response?.errors?.length ?? 0
    const corsError = Boolean(preflight && hasCorsErrors(preflight))

    const dnsTime = Math.max(request.timings.dns ?? 0, 0)
    const connectTime = Math.max(request.timings.connect ?? 0, 0)

    return {
      id: crypto.randomUUID(),
      name,
      status: request.response.status,
      errors,
      corsError,
      operation,
      size: request.response?._transferSize ?? 0,
      timings: {
        ...request.timings,
        startedAt: request.startedDateTime,
        total: request.time - dnsTime,
        connect: connectTime - dnsTime,
        waterfall:
          new Date(request.startedDateTime).getTime() +
          Math.max(0, (request.timings as any)._blocked_queueing ?? 0),
      },
      headers: {
        general: {
          url: request.request.url,
          method: request.request.method,
          status: request.response.status,
          remoteAddress: request.connection
            ? request.serverIPAddress + ':' + request.connection
            : request.serverIPAddress,
        },
        response: request.response.headers,
        request: request.request.headers,
      },
      payload,
      initiator: request._initiator as GraphQLRequest['initiator'],
      response,
    }
  } catch (error) {
    console.error('Failed to parse GraphQL request:', error)

    return null
  }
}
