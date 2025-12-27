import { mockRequests } from '@/constants/mock/requests'
import { onNetworkRequestFinished } from '@/logic/chrome/on-network-request-finished'
import { isGraphqlRequest } from '@/logic/network/is-graphql-request'
import { isPreflightRequest } from '@/logic/network/is-preflight-request'
import { PreflightRequestMap } from '@/logic/network/preflight-request-map'
import { toGraphQLRequest } from '@/logic/network/to-graphql-request'
import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, reactive, ref } from 'vue'

export function useGraphqlNetwork() {
  const preflightRequests = new PreflightRequestMap()
  const recording = ref(true)

  const requests = reactive<GraphQLRequest[]>([])
  const readonlyRequests = computed(() => (import.meta.env.DEV ? mockRequests : requests))

  onNetworkRequestFinished((request) => {
    if (!recording.value) return

    console.log('Network Request:', request)

    if (isPreflightRequest(request)) {
      preflightRequests.add(request)
    }

    if (!isGraphqlRequest(request)) return

    const preflight = preflightRequests.get(request)

    if (preflight) pushRequest(preflight)

    pushRequest(request)
  })

  async function pushRequest(request: ChromeNetworkRequest) {
    console.log('Finished GraphQL Request:', request)

    const req = await toGraphQLRequest(request)

    if (req) requests.push(req)
  }

  function clearRequests() {
    requests.splice(0, requests.length)
  }

  return {
    requests: readonlyRequests,
    recording,
    clearRequests,
  }
}
