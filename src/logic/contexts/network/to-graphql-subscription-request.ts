import type { ChromeNetworkHeaders, GraphQLSubscriptionRequest } from '@/types/graphql-request'
import type {
  Message,
  WebSocketNetworkEvent,
  WebSocketNetworkFrameEvent,
} from '@/types/websocket-network-event'
import { computed, reactive, ref } from 'vue'
import { extractOperation } from './to-graphql-request/extract-operation'
import { extractName } from './to-graphql-subscription-request/extract-name'

export function toGraphQLSubscriptionRequest(
  events: WebSocketNetworkEvent[],
): GraphQLSubscriptionRequest {
  const createdEvent = events.find((event) => event.method === 'created')!
  const handshakeRequestEvent = events.find((event) => event.method === 'handshakeRequest')!
  const handshakeEvent = events.find((event) => event.method === 'handshakeResponse')!
  const subscriptionEvent = events.findLast(
    (event) => event.method === 'frameSent',
  )! as WebSocketNetworkFrameEvent

  const message = JSON.parse(subscriptionEvent.params.response.payloadData ?? 'null')
  const { payload } = message

  // console.log('debug', message, subscriptionEvent)

  const name = extractName(payload)
  const operation = extractOperation<any>(payload?.query)
  const requestHeaders = toHeaders(handshakeEvent.params.response.requestHeaders)
  const responseHeaders = toHeaders(handshakeEvent.params.response.headers)

  const status = handshakeEvent.params.response.status
  const startedAtDate = new Date(handshakeRequestEvent.params.wallTime * 1000)

  // Create base timings object for message timestamp calculation
  const baseTimings = {
    startedAt: startedAtDate.toISOString(),
    wallTime: handshakeRequestEvent.params.wallTime,
    baseTimestamp: handshakeRequestEvent.params.timestamp,
    responseReceivedTimestamp: handshakeEvent.params.timestamp,
    waterfall: startedAtDate.getTime(),
  }

  const messages = reactive(toMessages(events, baseTimings as any))

  // Reactive closed-at (set when closed event fires)
  const closedAt = ref<Date | undefined>(undefined)

  // Reactive total elapsed time (ms from startedAt to last message time, message-driven)
  const totalMs = computed<number>(() => {
    if (messages.length === 0) return 0
    const last = messages[messages.length - 1]!
    return last.time.getTime() - startedAtDate.getTime()
  })

  const timings = {
    ...baseTimings,
    total: totalMs,
  }

  const errors = computed(() =>
    messages.reduce((errors, { data }) => {
      const { payload } = JSON.parse(data ?? '{}')

      errors += payload?.errors?.length ?? 0

      return errors
    }, 0),
  )

  return {
    id: crypto.randomUUID(),
    name,
    status,
    errors,
    operation,
    transport: 'websocket',
    size: ref(0),
    timings,
    headers: {
      general: {
        url: createdEvent.params.url,
        method: 'GET',
        status,
      },
      request: requestHeaders,
      response: responseHeaders,
    },
    messages,
    initiator: createdEvent.params.initiator,
    closedAt,
  }
}

function toHeaders(headers: Record<string, string>): ChromeNetworkHeaders {
  return Object.entries(headers).map(([key, value]) => ({
    name: key,
    value,
  }))
}

function toMessages(
  events: WebSocketNetworkEvent[],
  timings: GraphQLSubscriptionRequest['timings'],
): Message[] {
  return events
    .filter(
      (event): event is WebSocketNetworkFrameEvent =>
        event.method === 'frameSent' || event.method === 'frameReceived',
    )
    .map((event) => toMessage(event, timings))
}

export function toMessage(
  event: WebSocketNetworkFrameEvent,
  timings: GraphQLSubscriptionRequest['timings'],
): Message {
  const time = new Date(
    (timings.wallTime + (event.params.timestamp - timings.baseTimestamp)) * 1000,
  )

  return {
    data: event.params.response.payloadData,
    length: event.params.response.payloadData.length,
    time,
    method: event.method,
  }
}
