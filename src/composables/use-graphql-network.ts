import { useDevtoolsNetwork } from '@/composables/use-devtools-network'
import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, reactive, ref } from 'vue'

const GraphQLPayloadKeys = ['query', 'variables', 'operationName', 'extensions']
const GraphQLOperations = ['query', 'mutation', 'subscription']

export function useGraphqlNetwork() {
  useDevtoolsNetwork({ onRequestFinished })

  const requests = reactive<GraphQLRequest[]>([])
  const recording = ref(true)

  const readonlyRequests = computed(() => requests)

  function onRequestFinished(request: ChromeNetworkRequest) {
    if (!recording.value) return
    if (request.request.method !== 'POST') return

    const payload = JSON.parse(request.request.postData?.text ?? '{}')

    if (!Object.keys(payload).every((key) => GraphQLPayloadKeys.includes(key))) return

    const query = payload.query?.trim() ?? ''
    const operation = (GraphQLOperations.find((op) => query.startsWith(op)) ??
      'unknown') as GraphQLRequest['operation']
    const name = payload.operationName ?? /query\s*(?<name>\w+)/.exec(query)?.groups?.name ?? ''

    const response = JSON.parse(request.response.content.text ?? '{}')

    const errors = response.errors?.length ?? 0

    requests.push({
      id: crypto.randomUUID(),
      name: name,
      status: request.response.status,
      errors: errors,
      operation: operation,
      size: request.response?._transferSize ?? 0,
      timings: {
        ...request.timings,
        startedAt: request.startedDateTime,
        total: request.time,
      },
      headers: {
        general: {
          url: request.request.url,
          method: request.request.method,
          status: request.response.status,
          remoteAddress: request._ip_addr ?? undefined,
          referer: '', // TODO
        },
        response: request.response.headers,
        request: request.request.headers,
      },
    })
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
