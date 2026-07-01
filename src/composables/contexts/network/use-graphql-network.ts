import { formDataMockRequest, mockRequests } from '@/constants/mock/requests'
import { onHttpNetworkEvent } from '@/logic/contexts/chrome/on-http-network-event'
import { onNetworkRequestFinished } from '@/logic/contexts/chrome/on-network-request-finished'
import { isGraphqlRequest } from '@/logic/contexts/network/is-graphql-request'
import {
  extractGraphqlFromPostData,
  isGraphqlPostData,
} from '@/logic/contexts/network/is-graphql-sse-request'
import { isPreflightRequest } from '@/logic/contexts/network/is-preflight-request'
import { PreflightRequestMap } from '@/logic/contexts/network/preflight-request-map'
import { toGraphQLRequest } from '@/logic/contexts/network/to-graphql-request'
import { extractOperation } from '@/logic/contexts/network/to-graphql-request/extract-operation'
import { toPendingGraphQLRequest } from '@/logic/contexts/network/to-pending-graphql-request'
import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { GraphQLNetworkRequest, GraphQLRequest } from '@/types/graphql-request'
import type { HttpNetworkRequestSentEvent } from '@/types/http-network-event'
import { computed, ref, shallowReactive } from 'vue'
import { useGraphqlNetworkSSE } from './use-graphql-network-sse'
import { useGraphqlNetworkSubscriptions } from './use-graphql-network-subscriptions'

export function useGraphqlNetwork() {
  const preflightRequests = new PreflightRequestMap()
  const recording = ref(true)

  const requests = shallowReactive<GraphQLRequest[]>([])
  const pendingByRequestId = new Map<string, GraphQLNetworkRequest>()
  const readonlyRequests = computed(() =>
    import.meta.env.DEV ? [formDataMockRequest, ...mockRequests] : requests,
  )

  // --- CDP: detect requests when they are sent (pending state) ---
  onHttpNetworkEvent((event) => {
    if (!recording.value) return

    const { method, params } = event
    const requestId = (params as any).requestId

    switch (method) {
      case 'requestSent': {
        const postData = (event as HttpNetworkRequestSentEvent).params.request.postData
        if (!postData || !isGraphqlPostData(postData)) break

        // Skip subscriptions — they are handled by SSE/WebSocket modules
        const { query } = extractGraphqlFromPostData(postData)
        if (extractOperation(query) === 'subscription') break

        const pendingReq = toPendingGraphQLRequest(event as HttpNetworkRequestSentEvent)
        pendingByRequestId.set(requestId, pendingReq)
        requests.push(pendingReq)
        break
      }

      case 'loadingFailed': {
        const pending = pendingByRequestId.get(requestId)
        if (!pending) break

        if ((event.params as any).canceled) {
          pending._status = 'cancelled'
        } else {
          pending._status = 'cancelled'
        }
        pendingByRequestId.delete(requestId)
        const idx = requests.indexOf(pending)
        if (idx !== -1) {
          requests.splice(idx, 1, { ...pending })
        }
        break
      }
    }
  })

  // --- DevTools API: complete requests when finished ---
  onNetworkRequestFinished((request) => {
    if (!recording.value) return

    if (isPreflightRequest(request)) {
      preflightRequests.add(request)
    }

    if (!isGraphqlRequest(request)) return

    const preflight = preflightRequests.get(request)

    if (preflight) pushRequest(preflight)

    pushRequest(request, preflight)
  })

  async function pushRequest(request: ChromeNetworkRequest, preflight?: ChromeNetworkRequest) {
    const req = await toGraphQLRequest(request, preflight)
    if (!req) return

    req._status = 'completed'

    // Try to find and replace a matching pending request
    const pending = findPendingRequest(request, req.name)
    if (pending) {
      const idx = requests.indexOf(pending)
      if (idx !== -1) {
        // Replace with a new reference — shallowReactive won't trigger if same reference
        requests.splice(idx, 1, req)
        return
      }
    }

    // No pending match found — push as new (fallback for when debugger is unavailable)
    requests.push(req)
  }

  function findPendingRequest(
    harRequest: ChromeNetworkRequest,
    completedName: string,
  ): GraphQLNetworkRequest | undefined {
    // Exact match by CDP requestId (exposed as internal _requestId on HAR entries)
    if (harRequest._requestId && pendingByRequestId.has(harRequest._requestId)) {
      const pending = pendingByRequestId.get(harRequest._requestId)!
      pendingByRequestId.delete(harRequest._requestId)
      return pending
    }

    // Fallback: find the closest pending request by URL + method + name + timestamp
    const harUrl = harRequest.request.url
    const harMethod = harRequest.request.method
    const harStartedAt = new Date(harRequest.startedDateTime).getTime()

    let bestMatch: { requestId: string; pending: GraphQLNetworkRequest; delta: number } | undefined

    for (const [requestId, pending] of pendingByRequestId) {
      if (
        pending.headers.general.url !== harUrl ||
        pending.headers.general.method !== harMethod ||
        pending.name !== completedName
      )
        continue

      const delta = Math.abs(new Date(pending.timings.startedAt).getTime() - harStartedAt)
      if (delta >= 5000) continue

      if (!bestMatch || delta < bestMatch.delta) {
        bestMatch = { requestId, pending, delta }
      }
    }

    if (bestMatch) {
      pendingByRequestId.delete(bestMatch.requestId)
      return bestMatch.pending
    }

    return undefined
  }

  useGraphqlNetworkSubscriptions((request) => {
    if (!recording.value) return

    console.log('[Network] Finished WebSocket subscription:', request.name)

    requests.push(request as any) // FIXME
  })

  useGraphqlNetworkSSE((request) => {
    if (!recording.value) return

    console.log('[Network] Finished SSE subscription:', request.name)

    requests.push(request as any) // FIXME
  })

  function clearRequests() {
    requests.splice(0, requests.length)
    pendingByRequestId.clear()
  }

  return {
    requests: readonlyRequests,
    recording,
    clearRequests,
  }
}
