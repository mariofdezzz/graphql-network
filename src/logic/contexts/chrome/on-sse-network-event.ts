import type { SSENetworkEvent } from '@/types/sse-network-event'

const ChromeEvents = {
  'Network.requestWillBeSent': 'requestSent',
  'Network.responseReceived': 'responseReceived',
  'Network.dataReceived': 'dataReceived',
  'Network.eventSourceMessageReceived': 'eventSourceMessageReceived',
  'Network.loadingFinished': 'loadingFinished',
  'Network.loadingFailed': 'loadingFailed',
} as const

export function onSSENetworkEvent(onEvent: (event: SSENetworkEvent) => void) {
  if (!chrome.debugger) {
    console.warn('chrome.debugger API is not available. SSE network events will not be captured.')
    return
  }

  chrome.debugger.onEvent.addListener((source, method, params) => {
    if (method in ChromeEvents && params) {
      onEvent({
        method: ChromeEvents[method as keyof typeof ChromeEvents],
        params: params as any,
      })
    }
  })
}

/**
 * Enable streaming for a request so that `Network.dataReceived` events
 * include the response body data (requires Chrome 116+).
 */
export function enableStreamResourceContent(requestId: string) {
  if (!chrome.debugger) return

  chrome.debugger.sendCommand(
    { tabId: chrome.devtools.inspectedWindow.tabId },
    'Network.streamResourceContent',
    { requestId },
  )
}
