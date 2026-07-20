import { ApolloClient, ApolloLink, InMemoryCache, Observable, split } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createUploadLink } from 'apollo-upload-client'
import { print } from 'graphql'
import { createClient as createSSEClient } from 'graphql-sse'
import { createClient as createWSClient } from 'graphql-ws'

// SSE Client (port 4000)
const httpLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
})

const sseClient = createSSEClient({
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

const splitLinkSSE = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  sseLink,
  httpLink,
)

const cacheSSE = new InMemoryCache()

export const apolloClientSSE = new ApolloClient({
  link: splitLinkSSE,
  cache: cacheSSE,
})

// WebSocket Client (port 4001)
const wsClient = createWSClient({
  url: 'ws://localhost:4001/graphql',
  connectionParams: () => ({
    // Add any auth tokens if needed
  }),
})

const wsLink = new GraphQLWsLink(wsClient)

const httpLinkWS = createUploadLink({
  uri: 'http://localhost:4001/graphql',
})

const splitLinkWS = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLinkWS,
)

const cacheWS = new InMemoryCache()

export const apolloClientWS = new ApolloClient({
  link: splitLinkWS,
  cache: cacheWS,
})

// Default export for backward compatibility (SSE client)
export const apolloClient = apolloClientSSE
