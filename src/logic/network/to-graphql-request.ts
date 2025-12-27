import { GRAPHQL_PAYLOAD_OPERATIONS } from '@/constants/network/graphql-payload-operations'
import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { GraphQLRequest } from '@/types/graphql-request'
import { isPreflightRequest } from './is-preflight-request'

export async function toGraphQLRequest(
  request: ChromeNetworkRequest,
): Promise<GraphQLRequest | null> {
  try {
    const isPreflight = isPreflightRequest(request)

    const payload = JSON.parse(request.request.postData?.text ?? '{}')
    const query = payload.query?.trim() ?? ''
    const operation = isPreflight
      ? 'preflight'
      : ((GRAPHQL_PAYLOAD_OPERATIONS.find((op) => query.startsWith(op)) ??
          'unknown') as GraphQLRequest['operation'])
    const name = payload.operationName ?? /query\s*(?<name>\w+)/.exec(query)?.groups?.name ?? '-'

    const response = JSON.parse(request.response.content.text ?? '{}')
    const errors = response.errors?.length ?? 0

    const responseBody = await new Promise<string>((resolve) => request.getContent(resolve))

    return {
      id: crypto.randomUUID(),
      name: name,
      status: request.response.status,
      errors: errors,
      operation: operation,
      size: request.response?._transferSize ?? 0,
      timings: {
        ...request.timings,
        startedAt: request.startedDateTime,
        total: request.time,
      },
      headers: {
        general: {
          url: request.request.url,
          method: request.request.method,
          status: request.response.status,
          remoteAddress: request._ip_addr ?? undefined,
          referer: '', // TODO
        },
        response: request.response.headers,
        request: request.request.headers,
      },
      payload: request.request.postData?.text,
      initiator: request._initiator as GraphQLRequest['initiator'],
      response: responseBody,
    }
  } catch (error) {
    console.error('Failed to parse GraphQL request:', error)

    return null
  }
}
