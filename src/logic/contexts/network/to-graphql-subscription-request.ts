import type { ChromeNetworkHeaders, GraphQLSubscriptionRequest } from '@/types/graphql-request'
import type {
  Message,
  WebSocketNetworkEvent,
  WebSocketNetworkFrameEvent,
} from '@/types/websocket-network-event'
import { computed, reactive } from 'vue'
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

  const messages = reactive(toMessages(events))

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
    size: 0,
    timings: {
      startedAt: new Date(handshakeRequestEvent.params.wallTime * 1000).toISOString(),
    },
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
  }
}

function toHeaders(headers: Record<string, string>): ChromeNetworkHeaders {
  return Object.entries(headers).map(([key, value]) => ({
    name: key,
    value,
  }))
}

function toMessages(events: WebSocketNetworkEvent[]): Message[] {
  return events
    .filter(
      (event): event is WebSocketNetworkFrameEvent =>
        event.method === 'frameSent' || event.method === 'frameReceived',
    )
    .map(
      (event) =>
        ({
          data: event.params.response.payloadData,
          length: event.params.response.payloadData.length,
          timestamp: event.params.timestamp,
          method: event.method,
        }) satisfies Message,
    )
}
