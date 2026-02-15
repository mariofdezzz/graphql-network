import { GRAPHQL_PAYLOAD_KEYS } from '@/constants/network/graphql-payload-keys'
import { GRAPHQL_SUBSCRIPTION_KEYS } from '@/constants/network/graphql-subscription-keys'
import type { WebSocketNetworkFrameEvent } from '@/types/websocket-network-event'

export function isGraphqlSubscribeRequest(event: WebSocketNetworkFrameEvent) {
  try {
    const message = JSON.parse(event.params.response.payloadData)

    return (
      Object.keys(message).every((key) => GRAPHQL_SUBSCRIPTION_KEYS.includes(key)) &&
      message.type === 'subscribe' &&
      Object.keys(message.payload).every((key) => GRAPHQL_PAYLOAD_KEYS.includes(key))
    )
  } catch {
    return false
  }
}
