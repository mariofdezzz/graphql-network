export type WebSocketNetworkEvent =
  | WebSocketNetworkCreatedEvent
  | WebSocketNetworkHandshakeEvent
  | WebSocketNetworkFrameEvent
  | WebSocketNetworkClosedEvent

export type WebSocketNetworkCreatedEvent = {
  method: 'created'
  params: {
    requestId: string
    initiator: Record<string, any>
    url: string
  }
}

export type WebSocketNetworkHandshakeEvent = {
  method: 'handshakeResponseReceived'
  params: {
    requestId: string
    timestamp: number
    response: {
      headers: Record<string, string>
      headersText: string
      requestHeaders: Record<string, string>
      requestHeadersText: string
      status: number
      statusText: string
    }
  }
}

export type WebSocketNetworkFrameEvent = {
  method: 'frameReceived' | 'frameSent'
  params: {
    requestId: string
    timestamp: number
    response: {
      mask: boolean
      opcode: number
      payloadData: string
    }
  }
}

export type WebSocketNetworkClosedEvent = {
  method: 'closed'
  params: {
    requestId: string
    timestamp: number
  }
}
