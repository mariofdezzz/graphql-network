import { onWebsocketNetworkEvent } from '@/logic/contexts/chrome/on-websocket-network-event'
import { isGraphqlSubscribeRequest } from '@/logic/contexts/network/is-graphql-subscribe-request'
import {
  toGraphQLSubscriptionRequest,
  toMessage,
} from '@/logic/contexts/network/to-graphql-subscription-request'
import type { GraphQLSubscriptionRequest } from '@/types/graphql-request'
import type { WebSocketNetworkEvent } from '@/types/websocket-network-event'

type ActiveSubscription = {
  events: WebSocketNetworkEvent[]
  subscription: GraphQLSubscriptionRequest
}

export function useGraphqlNetworkSubscriptions(
  onSubscribe: (request: GraphQLSubscriptionRequest) => void,
) {
  const pendingRequests = new Map<string, WebSocketNetworkEvent[]>()
  const activeSubscriptions = new Map<string, ActiveSubscription>()

  onWebsocketNetworkEvent((event) => {
    const {
      method,
      params: { requestId },
    } = event

    switch (method) {
      case 'created':
        pendingRequests.set(requestId, [event])
        break

      case 'handshakeRequest':
      case 'handshakeResponse':
        pendingRequests.get(requestId)?.push(event)
        break

      case 'frameSent':
        if (isGraphqlSubscribeRequest(event)) {
          const events = pendingRequests.get(requestId)!
          events.push(event)

          const subscription = toGraphQLSubscriptionRequest(events)
          // console.log('Subscription:', subscription)

          activeSubscriptions.set(requestId, {
            events,
            subscription,
          })
          onSubscribe(subscription)
          break
        }
      case 'frameReceived':
        pendingRequests.get(requestId)?.push(event)
        updateActiveSubscription(requestId, event)
        break

      case 'closed':
        pendingRequests.get(requestId)?.push(event)
        updateActiveSubscription(requestId, event)

        // console.log('Subscription ended:', activeSubscriptions.get(requestId))

        pendingRequests.delete(requestId)
        activeSubscriptions.delete(requestId)
        break
    }
  })

  function updateActiveSubscription(requestId: string, event: WebSocketNetworkEvent) {
    const activeSubscription = activeSubscriptions.get(requestId)

    if (activeSubscription) {
      activeSubscription.events.push(event)

      if (event.method === 'frameReceived' || event.method === 'frameSent') {
        activeSubscription.subscription.messages.push(
          toMessage(event, activeSubscription.subscription.timings),
        )
      }
    }
  }
}
