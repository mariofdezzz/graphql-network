import type { GraphQLRequest } from '@/types/graphql-request'

export type Column = {
  title: string
  key: keyof GraphQLRequest | string
}
