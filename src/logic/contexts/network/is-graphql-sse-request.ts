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
    }
  } catch {
    return defaults
  }
}

/**
 * Check if a response is an SSE (Server-Sent Events) response
 * Checks both mimeType and response headers for text/event-stream.
 * Also accepts application/json responses if they come from a GraphQL request,
 * since some GraphQL servers use this for SSE subscriptions.
 */
export function isSSEResponse(
  mimeType?: string,
  headers?: Record<string, string>,
  isGraphQLRequest?: boolean,
): boolean {
  console.log(
    `[isSSEResponse] Checking - mimeType: ${mimeType}, has headers: ${!!headers}, isGraphQL: ${isGraphQLRequest}`,
  )

  // Check mimeType field
  if (mimeType === 'text/event-stream') {
    console.log(`[isSSEResponse] Matched text/event-stream in mimeType`)
    return true
  }

  // Check response headers object (CDP sometimes puts it here instead)
  if (headers) {
    const contentType = headers['content-type'] || headers['Content-Type']
    if (contentType && contentType.includes('text/event-stream')) {
      console.log(`[isSSEResponse] Matched text/event-stream in headers`)
      return true
    }
  }

  // Some GraphQL servers return application/json for SSE subscriptions
  // If we know this is a GraphQL request and there are indicators of streaming,
  // treat it as SSE even with application/json MIME type
  if (isGraphQLRequest && mimeType === 'application/json') {
    console.log(
      `[isSSEResponse] GraphQL request with application/json - treating as potential SSE subscription`,
    )
    return true
  }

  console.log(`[isSSEResponse] Not an SSE response`)
  return false
}
