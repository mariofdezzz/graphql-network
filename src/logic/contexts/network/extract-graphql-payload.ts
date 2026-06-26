export type FileMetadata = {
  name: string
  fileName?: string
  contentType?: string
}

export type ExtractedGraphQLPayload = {
  payload: Record<string, any> | null
  files?: FileMetadata[]
}

type PostDataParam = {
  name: string
  value?: string
  fileName?: string
  contentType?: string
}

type PostData = {
  mimeType?: string
  text?: string
  params?: PostDataParam[]
}

/**
 * Parses a raw multipart/form-data body into structured parts.
 *
 * Chrome DevTools HAR includes the raw body in `postData.text` and may also
 * provide a `postData.params` array, but `params[].fileName` is unreliable —
 * Chrome often omits it. The filename is reliably present only in the
 * `Content-Disposition` header of each part in the raw body.
 */
function parseMultipartBody(text: string, boundary: string): PostDataParam[] {
  const delimiter = `--${boundary}`
  const parts = text.split(delimiter)
  const result: PostDataParam[] = []

  for (const part of parts) {
    const trimmed = part.trim()
    // Skip preamble, epilogue, and the closing "--" marker
    if (!trimmed || trimmed === '--') continue

    // Normalize line endings to \n for consistent parsing
    const normalized = part.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

    // Split headers from body at the first blank line
    const headerBodySplit = normalized.indexOf('\n\n')
    if (headerBodySplit === -1) continue

    const headerSection = normalized.slice(0, headerBodySplit)
    // Remove the trailing newline that belongs to the boundary delimiter
    const body = normalized.slice(headerBodySplit + 2).replace(/\n$/, '')

    let fieldName: string | undefined
    let fileName: string | undefined
    let contentType: string | undefined

    for (const line of headerSection.split('\n')) {
      const lower = line.toLowerCase()

      if (lower.startsWith('content-disposition:')) {
        const nameMatch = /;\s*name="([^"]*)"/.exec(line)
        const fileNameMatch = /;\s*filename="([^"]*)"/.exec(line)
        if (nameMatch) fieldName = nameMatch[1]
        if (fileNameMatch) fileName = fileNameMatch[1]
      } else if (lower.startsWith('content-type:')) {
        contentType = line.slice('content-type:'.length).trim()
      }
    }

    if (!fieldName) continue

    result.push({
      name: fieldName,
      // Only include the text value for non-file fields
      value: fileName === undefined ? body : undefined,
      fileName,
      contentType,
    })
  }

  return result
}

/**
 * Extracts the GraphQL payload from a HAR postData object.
 *
 * Supports two formats:
 * - `application/json`: payload is in `postData.text` as a JSON string
 * - `multipart/form-data`: payload is in the `operations` field per the
 *   GraphQL multipart request spec (https://github.com/jaydenseric/graphql-multipart-requests).
 *   The raw body (`postData.text`) is parsed first to reliably extract filenames;
 *   `postData.params` is used as a fallback when the raw body is unavailable.
 */
export function extractGraphqlPayload(postData: PostData | undefined): ExtractedGraphQLPayload {
  if (!postData) return { payload: null }

  // Try JSON first (application/json — current default behaviour)
  if (postData.text) {
    try {
      const parsed = JSON.parse(postData.text)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return { payload: parsed }
      }
    } catch {
      // Fall through to multipart handling
    }
  }

  // Try multipart/form-data (GraphQL multipart request spec)
  // Prefer parsing the raw body to reliably get filenames; fall back to params.
  let parts: PostDataParam[] | undefined

  const boundaryMatch = /boundary=([^\s;]+)/.exec(postData.mimeType ?? '')
  if (boundaryMatch && postData.text) {
    parts = parseMultipartBody(postData.text, boundaryMatch[1]!)
  }

  if (!parts || parts.length === 0) {
    parts = postData.params
  }

  if (!parts || parts.length === 0) return { payload: null }

  const operationsParam = parts.find((p) => p.name === 'operations')
  if (!operationsParam?.value) return { payload: null }

  try {
    const payload = JSON.parse(operationsParam.value)
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return { payload: null }
    }

    // Extract file metadata from non-reserved parts (anything that is not 'operations' or 'map')
    const files: FileMetadata[] = parts
      .filter((p) => p.name !== 'operations' && p.name !== 'map')
      .map((p) => ({
        name: p.name,
        fileName: p.fileName,
        contentType: p.contentType,
      }))

    return {
      payload,
      files: files.length > 0 ? files : undefined,
    }
  } catch {
    return { payload: null }
  }
}
