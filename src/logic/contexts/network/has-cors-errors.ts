import type { ChromeNetworkRequest } from '@/types/chrome-network-request'

export function hasCorsErrors(preflight: ChromeNetworkRequest): boolean {
  if (preflight.response.status !== 200) return true

  const responseHeaders = preflight.response.headers
  const requestHeaders = preflight.request.headers

  const origin = requestHeaders.find((header) => header.name.toLowerCase() === 'origin')?.value

  if (!origin) return true

  const accessControlAllowOrigin = responseHeaders.find(
    (header) => header.name.toLowerCase() === 'access-control-allow-origin',
  )?.value

  if (!accessControlAllowOrigin) return true
  if (accessControlAllowOrigin !== '*' && accessControlAllowOrigin !== origin) return true

  const accessControlAllowMethods = responseHeaders.find(
    (header) => header.name.toLowerCase() === 'access-control-allow-methods',
  )?.value

  const requestMethod = requestHeaders.find(
    (header) => header.name.toLowerCase() === 'access-control-request-method',
  )?.value

  if (
    !accessControlAllowMethods ||
    !requestMethod ||
    !accessControlAllowMethods.includes(requestMethod)
  )
    return true

  const accessControlAllowHeaders = responseHeaders.find(
    (header) => header.name.toLowerCase() === 'access-control-allow-headers',
  )?.value

  const requestHeadersList = requestHeaders
    .filter((header) => header.name.toLowerCase().startsWith('access-control-request-headers'))
    .flatMap((header) => header.value.split(',').map((h) => h.trim().toLowerCase()))

  if (
    !accessControlAllowHeaders ||
    !requestHeadersList.every((h) => accessControlAllowHeaders.toLowerCase().includes(h))
  )
    return true

  return false
}
