import type { WebSocketNetworkEvent } from '@/types/websocket-network-event'

const ChromeEvents = {
  'Network.webSocketCreated': 'created',
  'Network.webSocketHandshakeResponseReceived': 'handshakeResponseReceived',
  'Network.webSocketFrameReceived': 'frameReceived',
  'Network.webSocketFrameSent': 'frameSent',
  'Network.webSocketClosed': 'closed',
} as const

export function onWebsocketNetworkEvent(onEvent: (event: WebSocketNetworkEvent) => void) {
  chrome.debugger.onEvent.addListener((source, method, params) => {
    if (method in ChromeEvents && params) {
      onEvent({
        method: ChromeEvents[method as keyof typeof ChromeEvents],
        params: params as any,
      })
    }
  })

  if (chrome.devtools.inspectedWindow.tabId) {
    chrome.debugger.attach({ tabId: chrome.devtools.inspectedWindow.tabId }, '1.3', () => {
      chrome.debugger.sendCommand(
        { tabId: chrome.devtools.inspectedWindow.tabId },
        'Network.enable',
      )
    })
  }
}
