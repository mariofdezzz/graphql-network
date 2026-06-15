import { onSSENetworkEvent } from '@/logic/contexts/chrome/on-sse-network-event'
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
}

export function useGraphqlNetworkSSE(onSubscribe: (request: GraphQLSubscriptionRequest) => void) {
  console.log('[SSE Composable] useGraphqlNetworkSSE initialized')
  const pendingRequests = new Map<string, PendingSSERequest>()
  const activeSubscriptions = new Map<string, ActiveSSESubscription>()

  onSSENetworkEvent((event) => {
    const { method, params } = event
    const { requestId } = params as any

    console.log(`[SSE Composable] Event: ${method} for requestId: ${requestId}`)

    switch (method) {
      case 'requestSent': {
        console.log(
          `[SSE Composable] requestSent: ${requestId}`,
          (event as any).params?.request?.url,
        )
        const postData = (event as any).params?.request?.postData

        // Only track if it might be GraphQL
        if (isGraphqlPostData(postData)) {
          if (!pendingRequests.has(requestId)) {
            pendingRequests.set(requestId, {})
          }
          const pending = pendingRequests.get(requestId)!
          pending.requestSent = event as SSENetworkEvent & { method: 'requestSent' }
          pending.postData = postData
          console.log(
            `[SSE Composable] Tracked as potential GraphQL, pending count: ${pendingRequests.size}`,
          )
        }
        break
      }

      case 'responseReceived': {
        // Check if this is an SSE response with text/event-stream
        const response = (event as any).params.response
        const headers = response?.headers || {}
        const mimeType = response?.mimeType

        console.log(`[SSE Composable] responseReceived: ${requestId}, mimeType: ${mimeType}`)

        // Check if this is a GraphQL request we're tracking
        const pending = pendingRequests.get(requestId)
        const isGraphQLRequest = pending?.postData ? isGraphqlPostData(pending.postData) : false

        if (!isSSEResponse(mimeType, headers, isGraphQLRequest)) {
          console.log(`[SSE Composable] Not an SSE response (mimeType: ${mimeType}), ignoring`)
          pendingRequests.delete(requestId)
          break
        }

        console.log(`[SSE Composable] Valid SSE response detected!`)

        if (!pending?.requestSent) {
          console.log(`[SSE Composable] No pending requestSent for SSE, storing responseReceived`)
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
        // Called when more data arrives on streaming connection
        console.log(`[SSE Composable] dataReceived: ${requestId}`)

        const activeSubscription = activeSubscriptions.get(requestId)
        if (!activeSubscription) {
          console.log(`[SSE Composable] No active subscription found for ${requestId}`)
        }
        // Note: The actual body parsing happens via responseBodyReceived event
        // which provides the accumulated body directly from Chrome
        break
      }

      case 'responseBodyReceived': {
        // Called when response body chunk is received (for streaming requests)
        console.log(`[SSE Composable] responseBodyReceived: ${requestId}`)

        const activeSubscription = activeSubscriptions.get(requestId)
        if (!activeSubscription) {
          console.log(`[SSE Composable] No active subscription for responseBodyReceived: ${requestId}`)
          break
        }

        const body = (event as any).params?.body || ''
        const base64Encoded = (event as any).params?.base64Encoded || false

        // Decode if base64
        let decodedBody = body
        if (base64Encoded) {
          try {
            decodedBody = atob(body)
          } catch (error) {
            console.error(`[SSE Composable] Failed to decode base64 body:`, error)
            return
          }
        }

        if (!decodedBody) {
          console.log(`[SSE Composable] Empty body received`)
          break
        }

        console.log(
          `[SSE Composable] Received body chunk: ${decodedBody.length} bytes for ${requestId}`,
        )

        // Parse new SSE messages from the body
        const { messages, newOffset } = parseSSEStream(
          decodedBody,
          activeSubscription.streamParsedOffset,
        )

        console.log(
          `[SSE Composable] Parsed ${messages.length} new SSE messages, offset ${activeSubscription.streamParsedOffset} -> ${newOffset}`,
        )

        if (messages.length > 0) {
          // Convert parsed messages to SSEMessage format and add to subscription
          for (const msg of messages) {
            const sseMessage: SSEMessage = {
              data: msg.data,
              length: msg.data.length,
              time: new Date(),
              method: 'eventSourceMessage',
              eventName: msg.eventName,
              eventId: msg.eventId,
            }
            activeSubscription.subscription.messages.push(sseMessage)
            console.log(`[SSE Composable] Added message: ${msg.eventName}`)
          }

          console.log(
            `[SSE Composable] Total messages now: ${activeSubscription.subscription.messages.length}`,
          )
        }

        // Update offset so we don't re-parse
        activeSubscription.streamParsedOffset = newOffset
        break
      }

      case 'eventSourceMessageReceived': {
        // Fallback for native EventSource (keeps backward compatibility)
        console.log(
          `[SSE Composable] eventSourceMessageReceived: ${requestId} (native EventSource)`,
        )

        const messageData = (event as any).params.data

        if (!activeSubscriptions.has(requestId)) {
          const pending = pendingRequests.get(requestId)
          if (!pending?.requestSent || !pending?.responseReceived) {
            console.log(`[SSE Composable] Not ready for native EventSource message`)
            break
          }

          console.log(`[SSE Composable] Activating from native EventSource message...`)
          const subscription = toGraphQLSubscriptionRequestFromSSE(
            requestId,
            pending.requestSent,
            pending.responseReceived,
          )

          activeSubscriptions.set(requestId, {
            subscription,
            streamParsedOffset: 0,
          })
          onSubscribe(subscription)
        }

        // Add message
        const activeSubscription = activeSubscriptions.get(requestId)
        if (activeSubscription && messageData) {
          try {
            const sseMessage: SSEMessage = {
              data: messageData,
              length: messageData.length,
              time: new Date((event as any).params.timestamp * 1000),
              method: 'eventSourceMessage',
              eventName: (event as any).params.eventName || 'message',
              eventId: (event as any).params.eventId || '',
            }
            activeSubscription.subscription.messages.push(sseMessage)
            console.log(
              `[SSE Composable] Added native EventSource message, total: ${activeSubscription.subscription.messages.length}`,
            )
          } catch (error) {
            console.error(`[SSE Composable] Error adding message:`, error)
          }
        }
        break
      }

      case 'loadingFinished':
      case 'loadingFailed': {
        console.log(`[SSE Composable] ${method}: ${requestId}`)
        // Cleanup
        pendingRequests.delete(requestId)
        activeSubscriptions.delete(requestId)
        break
      }
    }
  })

  function tryActivateSSESubscription(requestId: string) {
    console.log(`[SSE Composable] tryActivateSSESubscription called for ${requestId}`)
    
    const pending = pendingRequests.get(requestId)
    console.log(
      `[SSE Composable] Pending state - has request: ${!!pending?.requestSent}, has response: ${!!pending?.responseReceived}`,
    )

    if (!pending?.requestSent || !pending?.responseReceived) {
      console.log(`[SSE Composable] Cannot activate yet, missing request or response`)
      return
    }

    if (activeSubscriptions.has(requestId)) {
      console.log(`[SSE Composable] Already active`)
      return
    }

    console.log(`[SSE Composable] Activating SSE subscription immediately...`)
    const subscription = toGraphQLSubscriptionRequestFromSSE(
      requestId,
      pending.requestSent,
      pending.responseReceived,
    )

    activeSubscriptions.set(requestId, {
      subscription,
      streamParsedOffset: 0,
    })

    onSubscribe(subscription)
    console.log(`[SSE Composable] Subscription created: ${subscription.name}`)
  }
}
