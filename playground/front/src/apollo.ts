import { ApolloClient, ApolloLink, InMemoryCache, Observable, split } from '@apollo/client/core'
import { getMainDefinition } from '@apollo/client/utilities'
import { createUploadLink } from 'apollo-upload-client'
import { print } from 'graphql'
import { createClient } from 'graphql-sse'

const httpLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
})

const sseClient = createClient({
  url: 'http://localhost:4000/graphql',
})

const sseLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const { query, variables, operationName } = operation

    const unsubscribe = sseClient.subscribe(
      {
        query: print(query),
        variables,
        operationName,
      },
      {
        next: (data) => observer.next(data),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      },
    )

    return () => unsubscribe()
  })
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  sseLink,
  httpLink,
)

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
})
