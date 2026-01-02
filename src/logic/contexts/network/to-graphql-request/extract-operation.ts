import { GRAPHQL_PAYLOAD_OPERATIONS } from '@/constants/network/graphql-payload-operations'
import type { GraphQLRequest } from '@/types/graphql-request'

export function extractOperation(query: string) {
  return (GRAPHQL_PAYLOAD_OPERATIONS.find((op) => query.startsWith(op)) ??
    'unknown') as GraphQLRequest['operation']
}
