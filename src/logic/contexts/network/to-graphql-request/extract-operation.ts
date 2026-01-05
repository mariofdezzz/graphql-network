import { GRAPHQL_PAYLOAD_OPERATIONS } from '@/constants/network/graphql-payload-operations'
import type { GraphQLRequest } from '@/types/graphql-request'

export function extractOperation(query: string) {
  const operationMatch = GRAPHQL_PAYLOAD_OPERATIONS.find((op) => query.trim().startsWith(op))

  if (operationMatch) return operationMatch as GraphQLRequest['operation']

  if (query.trim().startsWith('{')) return 'query'

  return 'unknown'
}
