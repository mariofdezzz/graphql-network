import type { ChromeNetworkHeaders, GraphQLSubscriptionRequest } from '@/types/graphql-request'
import type { CDPResourceTiming, SSEMessage, SSENetworkEvent } from '@/types/sse-network-event'
import { computed, reactive, ref } from 'vue'
import { extractGraphqlFromPostData } from './is-graphql-sse-request'

/**
 * Convert a CDP ResourceTiming object into HAR-equivalent duration fields (ms).
 * All ResourceTiming offsets are ms from requestTime; -1 means not applicable.
 *
 * @param t CDP ResourceTiming from response
 * @param requestSentTimestamp Monotonic timestamp (seconds) from requestWillBeSent
 */
function extractTimingPhases(t: CDPResourceTiming, requestSentTimestamp: number) {
  const ms = (start: number, end: number) =>
    start >= 0 && end >= 0 && end > start ? end - start : 0

  const dns = ms(t.dnsStart, t.dnsEnd)
  const connect = ms(t.connectStart, t.connectEnd)
  const ssl = ms(t.sslStart, t.sslEnd)
  const send = ms(t.sendStart, t.sendEnd)
  const wait = ms(t.sendEnd, t.receiveHeadersEnd)

  // Queueing = time from requestWillBeSent until ResourceTiming's requestTime baseline.
  // Both are monotonic seconds — this is exactly what Chrome DevTools shows as "Queueing".
  const _blocked_queueing = Math.max((t.requestTime - requestSentTimestamp) * 1000, 0)

  // Stalled = time from requestTime until the first real network phase started.
  const firstWorkStart =
    t.dnsStart >= 0
      ? t.dnsStart
      : t.connectStart >= 0
        ? t.connectStart
        : t.sendStart >= 0
          ? t.sendStart
          : 0
  const stalled = Math.max(firstWorkStart, 0)

  // blocked = queueing + stalled (matches HAR's "blocked" field)
  const blocked = _blocked_queueing + stalled

  return { dns, connect, ssl, send, wait, blocked, _blocked_queueing }
}

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
  const { query, operationName, variables, extensions } = extractGraphqlFromPostData(postData)

  console.log(`[toGraphQLSubscriptionRequestFromSSE] Extracted operation name: ${operationName}`)

  const name = operationName

  // Format headers
  const requestHeaders = toHeaders(requestSentEvent.params.request.headers || {})
  const responseHeaders = toHeaders(responseReceivedEvent.params.response.headers || {})

  // Reactive closed-at (set when loadingFinished/loadingFailed fires)
  const closedAt = ref<Date | undefined>(undefined)

  // Reactive size accumulator (grows as data arrives)
  const size = ref(0)

  // Reactive messages array
  const messages = reactive<SSEMessage[]>([])

  // Timing
  const startedAtDate = new Date(requestSentEvent.params.wallTime * 1000)

  // Reactive total elapsed time (ms from startedAt to last message time, message-driven)
  const totalMs = computed<number>(() => {
    if (messages.length === 0) return 0
    const last = messages[messages.length - 1]!
    return last.time.getTime() - startedAtDate.getTime()
  })

  const timings = {
    startedAt: startedAtDate.toISOString(),
    wallTime: requestSentEvent.params.wallTime,
    baseTimestamp: requestSentEvent.params.timestamp,
    responseReceivedTimestamp: responseReceivedEvent.params.timestamp,
    waterfall: startedAtDate.getTime(),
    total: totalMs,
    // CDP ResourceTiming phases (undefined if timing data not available)
    ...(responseReceivedEvent.params.response.timing
      ? extractTimingPhases(
          responseReceivedEvent.params.response.timing,
          requestSentEvent.params.timestamp,
        )
      : undefined),
  }

  // Reactive raw event stream buffer
  const rawEventStream = ref('')
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
    transport: 'sse',
    size,
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
    payload: {
      query: query || undefined,
      variables,
      extensions,
    },
    rawEventStream,
    messages,
    initiator,
    closedAt,
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
