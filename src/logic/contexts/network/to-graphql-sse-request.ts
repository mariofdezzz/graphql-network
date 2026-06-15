import type { ChromeNetworkHeaders, GraphQLSubscriptionRequest } from '@/types/graphql-request'
import type { SSEMessage, SSENetworkEvent } from '@/types/sse-network-event'
import { computed, reactive } from 'vue'
import { extractGraphqlFromPostData } from './is-graphql-sse-request'
import { extractOperation } from './to-graphql-request/extract-operation'

/**
 * Transform accumulated SSE events into a GraphQLSubscriptionRequest
 */
export function toGraphQLSubscriptionRequestFromSSE(
  requestId: string,
  requestSentEvent: SSENetworkEvent & { method: 'requestSent' },
  responseReceivedEvent: SSENetworkEvent & { method: 'responseReceived' },
): GraphQLSubscriptionRequest {
  console.log(`[toGraphQLSubscriptionRequestFromSSE] Creating subscription for ${requestId}`)
  const url = requestSentEvent.params.request.url
  const postData = requestSentEvent.params.request.postData
  const initiator = requestSentEvent.params.initiator
  const status = responseReceivedEvent.params.response.status

  console.log(`[toGraphQLSubscriptionRequestFromSSE] URL: ${url}`)
  console.log(`[toGraphQLSubscriptionRequestFromSSE] PostData: ${postData}`)

  // Extract GraphQL operation details from postData (primary source)
  const { query, operationName } = extractGraphqlFromPostData(postData)

  console.log(`[toGraphQLSubscriptionRequestFromSSE] Extracted operation name: ${operationName}`)

  const operation = extractOperation<'subscription'>(query || 'subscription')
  const name = operationName

  // Format headers
  const requestHeaders = toHeaders(requestSentEvent.params.request.headers || {})
  const responseHeaders = toHeaders(responseReceivedEvent.params.response.headers || {})

  // Timing
  const startedAtDate = new Date(requestSentEvent.params.wallTime * 1000)
  const timings = {
    startedAt: startedAtDate.toISOString(),
    wallTime: requestSentEvent.params.wallTime,
    baseTimestamp: requestSentEvent.params.timestamp,
    waterfall: startedAtDate.getTime(),
  }

  // Reactive messages array
  const messages = reactive<SSEMessage[]>([])

  // Compute errors from messages
  const errors = computed(() =>
    messages.reduce((errorCount, { data }) => {
      try {
        const parsed = JSON.parse(data)
        // Handle graphql-ws format: { id, type, payload: { data, errors } }
        if (parsed.payload?.errors) {
          errorCount += Array.isArray(parsed.payload.errors) ? parsed.payload.errors.length : 1
        }
        // Handle simple format: { data, errors }
        else if (parsed.errors) {
          errorCount += Array.isArray(parsed.errors) ? parsed.errors.length : 1
        }
      } catch {
        // Ignore parse errors
      }
      return errorCount
    }, 0),
  )

  return {
    id: requestId,
    name,
    status,
    errors,
    operation: 'subscription',
    size: 0,
    timings,
    headers: {
      general: {
        url,
        method: requestSentEvent.params.request.method || 'GET',
        status,
      },
      request: requestHeaders,
      response: responseHeaders,
    },
    messages,
    initiator,
  }
}

/**
 * Convert an SSE message event to a Message object
 */
export function toSSEMessage(
  event: SSENetworkEvent & { method: 'eventSourceMessageReceived' },
  timings: GraphQLSubscriptionRequest['timings'],
): SSEMessage {
  const time = new Date(
    (timings.wallTime + (event.params.timestamp - timings.baseTimestamp)) * 1000,
  )

  return {
    data: event.params.data,
    length: event.params.data.length,
    time,
    method: 'eventSourceMessage',
    eventName: event.params.eventName,
    eventId: event.params.eventId,
  }
}

function toHeaders(headers: Record<string, string>): ChromeNetworkHeaders {
  return Object.entries(headers).map(([key, value]) => ({
    name: key,
    value,
  }))
}
