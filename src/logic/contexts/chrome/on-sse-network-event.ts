import type { SSENetworkEvent } from '@/types/sse-network-event'

const ChromeEvents = {
  'Network.requestWillBeSent': 'requestSent',
  'Network.responseReceived': 'responseReceived',
  'Network.dataReceived': 'dataReceived',
  'Network.responseBodyReceived': 'responseBodyReceived',
  'Network.eventSourceMessageReceived': 'eventSourceMessageReceived',
  'Network.loadingFinished': 'loadingFinished',
  'Network.loadingFailed': 'loadingFailed',
} as const

export function onSSENetworkEvent(onEvent: (event: SSENetworkEvent) => void) {
  if (!chrome.debugger) {
    console.warn('chrome.debugger API is not available. SSE network events will not be captured.')
    return
  }

  console.log('[SSE] onSSENetworkEvent listener registered')

  chrome.debugger.onEvent.addListener((source, method, params) => {
    // Map Chrome DevTools Protocol events to SSE network events
    // and forward them for processing by the composable
    if (method in ChromeEvents && params) {
      console.log(
        `[SSE] CDP Event: ${method} -> ${ChromeEvents[method as keyof typeof ChromeEvents]}`,
        params,
      )
      onEvent({
        method: ChromeEvents[method as keyof typeof ChromeEvents],
        params: params as any,
      })
    }
  })
}
