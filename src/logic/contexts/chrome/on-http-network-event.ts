import type { HttpNetworkEvent } from '@/types/http-network-event'

const ChromeEvents = {
  'Network.requestWillBeSent': 'requestSent',
  'Network.responseReceived': 'responseReceived',
  'Network.loadingFinished': 'loadingFinished',
  'Network.loadingFailed': 'loadingFailed',
} as const

const IGNORED_RESOURCE_TYPES = new Set(['EventSource', 'WebSocket'])

export function onHttpNetworkEvent(onEvent: (event: HttpNetworkEvent) => void) {
  if (!chrome.debugger) {
    console.warn(
      'chrome.debugger API is not available. Pending HTTP request detection will not work.',
    )
    return
  }

  chrome.debugger.onEvent.addListener((source, method, params) => {
    if (!(method in ChromeEvents) || !params) return

    const resourceType = (params as any).type ?? (params as any).resourceType
    if (resourceType && IGNORED_RESOURCE_TYPES.has(resourceType)) return

    onEvent({
      method: ChromeEvents[method as keyof typeof ChromeEvents],
      params: params as any,
    })
  })
}
