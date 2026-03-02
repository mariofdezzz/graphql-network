import { mockRequests } from '@/constants/mock/requests'
import { onNetworkRequestFinished } from '@/logic/contexts/chrome/on-network-request-finished'
import { isGraphqlRequest } from '@/logic/contexts/network/is-graphql-request'
import { isPreflightRequest } from '@/logic/contexts/network/is-preflight-request'
import { PreflightRequestMap } from '@/logic/contexts/network/preflight-request-map'
import { toGraphQLRequest } from '@/logic/contexts/network/to-graphql-request'
import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, ref, shallowReactive } from 'vue'
import { useGraphqlNetworkSubscriptions } from './use-graphql-network-subscriptions'

export function useGraphqlNetwork() {
  const preflightRequests = new PreflightRequestMap()
  const recording = ref(true)

  const requests = shallowReactive<GraphQLRequest[]>([])
  const readonlyRequests = computed(() => (import.meta.env.DEV ? mockRequests : requests))

  onNetworkRequestFinished((request) => {
    if (!recording.value) return

    // console.log('Network Request:', request)

    if (isPreflightRequest(request)) {
      preflightRequests.add(request)
    }

    if (!isGraphqlRequest(request)) return

    const preflight = preflightRequests.get(request)

    if (preflight) pushRequest(preflight)

    pushRequest(request, preflight)
  })

  async function pushRequest(request: ChromeNetworkRequest, preflight?: ChromeNetworkRequest) {
    // console.log('Finished GraphQL Request:', request)

    const req = await toGraphQLRequest(request, preflight)

    if (req) requests.push(req)
  }

  useGraphqlNetworkSubscriptions((request) => {
    if (!recording.value) return

    // console.log('Finished subscription:', request)

    requests.push(request as any) // FIXME
  })

  function clearRequests() {
    requests.splice(0, requests.length)
  }

  return {
    requests: readonlyRequests,
    recording,
    clearRequests,
  }
}
