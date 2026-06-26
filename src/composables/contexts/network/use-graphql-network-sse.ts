import {
  enableStreamResourceContent,
  onSSENetworkEvent,
} from '@/logic/contexts/chrome/on-sse-network-event'
import { isGraphqlPostData, isSSEResponse } from '@/logic/contexts/network/is-graphql-sse-request'
import { parseSSEStream } from '@/logic/contexts/network/parse-sse-stream'
import { toGraphQLSubscriptionRequestFromSSE } from '@/logic/contexts/network/to-graphql-sse-request'
import type { GraphQLSubscriptionRequest } from '@/types/graphql-request'
import type { SSEMessage, SSENetworkEvent } from '@/types/sse-network-event'

type PendingSSERequest = {
  requestSent?: SSENetworkEvent & { method: 'requestSent' }
  responseReceived?: SSENetworkEvent & { method: 'responseReceived' }
  postData?: string
}

type ActiveSSESubscription = {
  subscription: GraphQLSubscriptionRequest
  streamParsedOffset: number
  streamBuffer: string
}

export function useGraphqlNetworkSSE(onSubscribe: (request: GraphQLSubscriptionRequest) => void) {
  const pendingRequests = new Map<string, PendingSSERequest>()
  const activeSubscriptions = new Map<string, ActiveSSESubscription>()

  onSSENetworkEvent((event) => {
    const { method, params } = event
    const { requestId } = params as any

    switch (method) {
      case 'requestSent': {
        const postData = (event as any).params?.request?.postData

        // Only track if it might be GraphQL
        if (isGraphqlPostData(postData)) {
          if (!pendingRequests.has(requestId)) {
            pendingRequests.set(requestId, {})
          }
          const pending = pendingRequests.get(requestId)!
          pending.requestSent = event as SSENetworkEvent & { method: 'requestSent' }
          pending.postData = postData
        }
        break
      }

      case 'responseReceived': {
        const response = (event as any).params.response
        const headers = response?.headers || {}
        const mimeType = response?.mimeType
        const resourceType = (event as any).params.type

        const pending = pendingRequests.get(requestId)

        if (!isSSEResponse({ mimeType, headers, postData: pending?.postData, resourceType })) {
          pendingRequests.delete(requestId)
          break
        }

        if (!pending?.requestSent) {
          if (!pendingRequests.has(requestId)) {
            pendingRequests.set(requestId, {})
          }
        }

        const pendingRecord = pendingRequests.get(requestId)!
        pendingRecord.responseReceived = event as SSENetworkEvent & { method: 'responseReceived' }

        // Try to activate immediately if we have both request and response
        tryActivateSSESubscription(requestId)
        break
      }

      case 'dataReceived': {
        const active = activeSubscriptions.get(requestId)
        if (!active) break

        // After calling Network.streamResourceContent, dataReceived includes a `data` field
        const rawData = (event as any).params.data
        if (!rawData) break

        // Decode base64 data from CDP
        let decoded: string
        try {
          decoded = atob(rawData)
        } catch {
          decoded = rawData
        }

        // Accumulate into stream buffer
        active.streamBuffer += decoded

        // Track raw bytes received
        active.subscription.size.value += decoded.length

        // Append to reactive raw event stream
        if (active.subscription.rawEventStream) {
          active.subscription.rawEventStream.value += decoded
        }

        // Parse new SSE messages from the accumulated buffer
        const { messages, newOffset } = parseSSEStream(
          active.streamBuffer,
          active.streamParsedOffset,
        )

        if (messages.length > 0) {
          for (const msg of messages) {
            const sseMessage: SSEMessage = {
              data: msg.data,
              length: msg.data.length,
              time: new Date(),
              method: 'eventSourceMessage',
              eventName: msg.eventName,
              eventId: msg.eventId,
            }
            active.subscription.messages.push(sseMessage)
          }
        }

        active.streamParsedOffset = newOffset
        break
      }

      case 'eventSourceMessageReceived': {
        // Fallback for native EventSource (keeps backward compatibility)
        const messageData = (event as any).params.data

        if (!activeSubscriptions.has(requestId)) {
          const pending = pendingRequests.get(requestId)
          if (!pending?.requestSent || !pending?.responseReceived) {
            break
          }

          const subscription = toGraphQLSubscriptionRequestFromSSE(
            requestId,
            pending.requestSent,
            pending.responseReceived,
          )

          activeSubscriptions.set(requestId, {
            subscription,
            streamParsedOffset: 0,
            streamBuffer: '',
          })
          onSubscribe(subscription)
        }

        // Add message
        const activeSubscription = activeSubscriptions.get(requestId)
        if (activeSubscription && messageData) {
          const sseMessage: SSEMessage = {
            data: messageData,
            length: messageData.length,
            time: new Date((event as any).params.timestamp * 1000),
            method: 'eventSourceMessage',
            eventName: (event as any).params.eventName || 'message',
            eventId: (event as any).params.eventId || '',
          }
          activeSubscription.subscription.messages.push(sseMessage)

          // Reconstruct raw SSE format for the Response tab
          if (activeSubscription.subscription.rawEventStream) {
            let raw = ''
            if (sseMessage.eventName && sseMessage.eventName !== 'message') {
              raw += `event: ${sseMessage.eventName}\n`
            }
            if (sseMessage.eventId) {
              raw += `id: ${sseMessage.eventId}\n`
            }
            raw += `data: ${sseMessage.data}\n\n`
            activeSubscription.subscription.rawEventStream.value += raw
          }
        }
        break
      }

      case 'loadingFinished':
      case 'loadingFailed': {
        // Mark the subscription as closed
        const closing = activeSubscriptions.get(requestId)
        if (closing?.subscription.closedAt) {
          closing.subscription.closedAt.value = new Date(
            (closing.subscription.timings.wallTime +
              ((event as any).params.timestamp - closing.subscription.timings.baseTimestamp)) *
              1000,
          )
        }
        // Cleanup
        pendingRequests.delete(requestId)
        activeSubscriptions.delete(requestId)
        break
      }
    }
  })

  function tryActivateSSESubscription(requestId: string) {
    const pending = pendingRequests.get(requestId)

    if (!pending?.requestSent || !pending?.responseReceived) {
      return
    }

    if (activeSubscriptions.has(requestId)) {
      return
    }

    const subscription = toGraphQLSubscriptionRequestFromSSE(
      requestId,
      pending.requestSent,
      pending.responseReceived,
    )

    activeSubscriptions.set(requestId, {
      subscription,
      streamParsedOffset: 0,
      streamBuffer: '',
    })

    // Enable streaming so dataReceived events include the body data
    enableStreamResourceContent(requestId)

    onSubscribe(subscription)
  }
}
