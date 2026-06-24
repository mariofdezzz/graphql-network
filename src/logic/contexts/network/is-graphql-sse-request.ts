import { extractOperation } from '@/logic/contexts/network/to-graphql-request/extract-operation'

/**
 * Check if a request postData contains a GraphQL operation (for SSE detection)
 */
export function isGraphqlPostData(postData: string | undefined): boolean {
  if (!postData) return false

  try {
    const parsed = JSON.parse(postData)
    console.log(`[isGraphqlPostData] Parsed postData:`, parsed)

    if (!parsed || typeof parsed !== 'object') {
      console.log(`[isGraphqlPostData] Not an object`)
      return false
    }

    // GraphQL operation has 'query' field (and optionally variables, operationName, extensions)
    if ('query' in parsed && typeof parsed.query === 'string') {
      console.log(`[isGraphqlPostData] Has query field`)
      return true
    }

    return false
  } catch (error) {
    console.log(`[isGraphqlPostData] Parse error:`, error)
    return false
  }
}

/**
 * Extract operation name and query from GraphQL postData
 */
export function extractGraphqlFromPostData(postData: string | undefined): {
  query: string
  operationName: string
  variables?: Record<string, any>
  extensions?: Record<string, any>
} {
  const defaults = { query: '', operationName: 'Unknown' }

  if (!postData) return defaults

  try {
    const parsed = JSON.parse(postData)

    const query = parsed.query || ''
    let operationName = parsed.operationName

    // If no explicit operationName, try to extract from query
    if (!operationName && query) {
      const match = query.match(/(?:query|mutation|subscription)\s+(\w+)/i)
      operationName = match ? match[1] : 'Unknown'
    }

    return {
      query,
      operationName: operationName || 'Unknown',
      variables: parsed.variables,
      extensions: parsed.extensions,
    }
  } catch {
    return defaults
  }
}

/**
 * Check if a response is an SSE (Server-Sent Events) response.
 * Checks both mimeType and response headers for text/event-stream.
 * For application/json responses, requires the operation to be a subscription
 * and the CDP resource type to be EventSource.
 */
export function isSSEResponse(options: {
  mimeType?: string
  headers?: Record<string, string>
  postData?: string
  resourceType?: string
}): boolean {
  const { mimeType, headers, postData, resourceType } = options

  // Check mimeType field
  if (mimeType === 'text/event-stream') {
    return true
  }

  // Check response headers object (CDP sometimes puts it here instead)
  if (headers) {
    const contentType = headers['content-type'] || headers['Content-Type']
    if (contentType && contentType.includes('text/event-stream')) {
      return true
    }
  }

  // Some GraphQL servers (e.g. graphql-sse) return application/json for SSE subscriptions.
  // Only treat as SSE if: the operation is a subscription AND the CDP resource type is EventSource.
  if (mimeType === 'application/json' && postData) {
    const { query } = extractGraphqlFromPostData(postData)
    const operation = extractOperation(query)

    if (operation === 'subscription' && resourceType === 'EventSource') {
      return true
    }
  }

  return false
}
