import { extractGraphqlFromPostData } from '@/logic/contexts/network/is-graphql-sse-request'
import { extractOperation } from '@/logic/contexts/network/to-graphql-request/extract-operation'
import type { GraphQLNetworkRequest } from '@/types/graphql-request'
import type { HttpNetworkRequestSentEvent } from '@/types/http-network-event'

export function toPendingGraphQLRequest(event: HttpNetworkRequestSentEvent): GraphQLNetworkRequest {
  const { request, wallTime, requestId, initiator } = event.params
  const { query, operationName, variables, extensions } = extractGraphqlFromPostData(
    request.postData,
  )

  const operation = extractOperation<GraphQLNetworkRequest['operation']>(query)
  const startedAt = new Date(wallTime * 1000).toISOString()

  return {
    id: crypto.randomUUID(),
    _status: 'pending',
    _requestId: requestId,
    name: operationName === 'Unknown' ? '(anonymous)' : operationName,
    status: 0,
    errors: 0,
    corsError: false,
    operation,
    size: 0,
    timings: {
      startedAt,
      total: 0,
      waterfall: wallTime * 1000,
    },
    headers: {
      general: {
        url: request.url,
        method: request.method,
        status: 0,
      },
      request: request.headers as any,
      response: {} as any,
    },
    payload: {
      query,
      ...(operationName !== 'Unknown' && { operationName }),
      ...(variables && { variables }),
      ...(extensions && { extensions }),
    },
    initiator: initiator ?? { type: 'other', stack: { callFrames: [] } },
    response: undefined,
  }
}
