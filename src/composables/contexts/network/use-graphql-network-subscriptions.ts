import { onWebsocketNetworkEvent } from '@/logic/contexts/chrome/on-websocket-network-event'
import { isGraphqlSubscribeRequest } from '@/logic/contexts/network/is-graphql-subscribe-request'
import type { WebSocketNetworkEvent } from '@/types/websocket-network-event'

export function useGraphqlNetworkSubscriptions() {
  const pendingRequests = new Map<string, WebSocketNetworkEvent[]>()
  const activeSubscriptions = new Map<string, WebSocketNetworkEvent[]>()

  onWebsocketNetworkEvent((event) => {
    const { method, params } = event

    switch (method) {
      case 'created':
        pendingRequests.set(params.requestId, [event])
        break

      case 'handshakeResponseReceived':
        pendingRequests.get(params.requestId)?.push(event)
        break

      case 'frameSent':
        if (isGraphqlSubscribeRequest(event)) {
          const reqs = pendingRequests.get(params.requestId)!
          reqs.push(event)

          activeSubscriptions.set(params.requestId, reqs)
          break
        }
      case 'frameReceived':
        pendingRequests.get(params.requestId)?.push(event)
        activeSubscriptions.get(params.requestId)?.push(event)
        break

      case 'closed':
        pendingRequests.get(params.requestId)?.push(event)
        activeSubscriptions.get(params.requestId)?.push(event)

        pendingRequests.delete(params.requestId)
        break
    }
  })
}
