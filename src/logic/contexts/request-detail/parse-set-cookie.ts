export interface ParsedCookie {
  name: string
  value: string
  domain: string
  path: string
  expires: string
  size: number
  httpOnly: boolean
  secure: boolean
  sameSite: string
  partitionKeySite: string
  crossSite: boolean
  priority: string
}

export function parseSetCookieHeaders(headers: { name: string; value: string }[]): ParsedCookie[] {
  return headers
    .filter((h) => h.name.toLowerCase() === 'set-cookie')
    .map((h) => parseSetCookie(h.value))
}

export function parseCookieHeader(
  headers: { name: string; value: string }[],
): ParsedCookie[] {
  const header = headers.find((h) => h.name.toLowerCase() === 'cookie')
  if (!header) return []

  return header.value.split(';').map((pair) => {
    const trimmed = pair.trim()
    const eqIndex = trimmed.indexOf('=')
    const name = eqIndex !== -1 ? trimmed.slice(0, eqIndex) : trimmed
    const value = eqIndex !== -1 ? trimmed.slice(eqIndex + 1) : ''
    const size = new TextEncoder().encode(`${name}=${value}`).length
    return {
      name,
      value,
      domain: '',
      path: '',
      expires: '',
      size,
      httpOnly: false,
      secure: false,
      sameSite: '',
      partitionKeySite: '',
      crossSite: false,
      priority: '',
    }
  })
}

function parseSetCookie(raw: string): ParsedCookie {
  const parts = raw.split(';').map((p) => p.trim())
  const [nameValue, ...attributes] = parts

  const eqIndex = nameValue.indexOf('=')
  const name = eqIndex !== -1 ? nameValue.slice(0, eqIndex) : nameValue
  const value = eqIndex !== -1 ? nameValue.slice(eqIndex + 1) : ''

  const size = new TextEncoder().encode(`${name}=${value}`).length

  let domain = ''
  let path = ''
  let expires = ''
  let httpOnly = false
  let secure = false
  let sameSite = ''
  let partitionKeySite = ''
  let priority = ''

  for (const attr of attributes) {
    const lower = attr.toLowerCase()

    if (lower === 'httponly') {
      httpOnly = true
    } else if (lower === 'secure') {
      secure = true
    } else {
      const attrEqIndex = attr.indexOf('=')
      if (attrEqIndex === -1) continue

      const attrName = attr.slice(0, attrEqIndex).trim().toLowerCase()
      const attrValue = attr.slice(attrEqIndex + 1).trim()

      switch (attrName) {
        case 'domain':
          domain = attrValue
          break
        case 'path':
          path = attrValue
          break
        case 'expires':
          expires = attrValue
          break
        case 'max-age':
          if (!expires) expires = attrValue
          break
        case 'samesite':
          sameSite = attrValue
          break
        case 'partitioned':
          partitionKeySite = attrValue
          break
        case 'priority':
          priority = attrValue
          break
      }
    }
  }

  return {
    name,
    value,
    domain,
    path,
    expires,
    size,
    httpOnly,
    secure,
    sameSite,
    partitionKeySite,
    crossSite: !sameSite || sameSite.toLowerCase() === 'none',
    priority,
  }
}
