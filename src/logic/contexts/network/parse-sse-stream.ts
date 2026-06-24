/**
 * Parse Server-Sent Events (SSE) wire format stream
 * Handles the text/event-stream protocol:
 *
 * event: next
 * data: {"key":"value"}
 * id: 1
 *
 * (blank line = message boundary)
 */

export interface SSEMessage {
  eventName: string
  eventId: string
  data: string
}

/**
 * Parse accumulated SSE stream and return new messages since last offset
 * @param streamBody Complete accumulated response body
 * @param lastParsedOffset Last successfully parsed byte offset
 * @returns Object with new messages and updated offset
 */
export function parseSSEStream(
  streamBody: string,
  lastParsedOffset: number = 0,
): {
  messages: SSEMessage[]
  newOffset: number
} {
  const messages: SSEMessage[] = []

  // Only process new content since last parse
  const newContent = streamBody.slice(lastParsedOffset)

  if (!newContent) {
    return { messages, newOffset: lastParsedOffset }
  }

  // Find the last complete message boundary (double newline)
  const lastBoundary = newContent.lastIndexOf('\n\n')

  if (lastBoundary === -1) {
    // No complete message yet, wait for more data
    return { messages, newOffset: lastParsedOffset }
  }

  // Only parse up to the last complete message
  const completePart = newContent.slice(0, lastBoundary + 2)
  const lines = completePart.split('\n')

  let currentEvent = ''
  let currentData = ''
  let currentId = ''

  for (const line of lines) {
    if (line.trim() === '') {
      // Empty line = end of message
      if (currentData.trim()) {
        messages.push({
          eventName: currentEvent || 'message',
          eventId: currentId,
          data: currentData.trim(),
        })
      }
      // Reset for next message
      currentEvent = ''
      currentData = ''
      currentId = ''
      continue
    }

    // Parse field lines
    if (line.startsWith('event:')) {
      currentEvent = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      // Data can span multiple lines with "data:" prefix on each
      const dataValue = line.slice(5).trim()
      if (currentData) {
        currentData += '\n' + dataValue
      } else {
        currentData = dataValue
      }
    } else if (line.startsWith('id:')) {
      currentId = line.slice(3).trim()
    } else if (line.startsWith(':')) {
      // Comment line, ignore
      continue
    }
  }

  return {
    messages,
    newOffset: lastParsedOffset + lastBoundary + 2,
  }
}

/**
 * Check if stream looks like a valid SSE stream (has at least one message structure)
 */
export function isValidSSEStream(streamBody: string): boolean {
  // Should have either event: or data: fields
  return streamBody.includes('data:') || streamBody.includes('event:')
}

/**
 * Extract only the GraphQL-relevant fields from parsed SSE stream
 * Removes duplicate messages if needed
 */
export function deduplicateSSEMessages(
  messages: SSEMessage[],
  previousMessages: SSEMessage[] = [],
): SSEMessage[] {
  if (previousMessages.length === 0) {
    return messages
  }

  const previousDataSet = new Set(previousMessages.map((m) => m.data))
  return messages.filter((m) => !previousDataSet.has(m.data))
}
