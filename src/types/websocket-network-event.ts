import type { Initiator } from './graphql-request'

export type WebSocketNetworkEvent =
  | WebSocketNetworkCreatedEvent
  | WebSocketNetworkHandshakeRequestEvent
  | WebSocketNetworkHandshakeResponseEvent
  | WebSocketNetworkFrameEvent
  | WebSocketNetworkClosedEvent

export type WebSocketNetworkCreatedEvent = {
  method: 'created'
  params: {
    requestId: string
    initiator: Initiator
    url: string
  }
}

export type WebSocketNetworkHandshakeRequestEvent = {
  method: 'handshakeRequest'
  params: {
    requestId: string
    timestamp: number
    wallTime: number
    request: {
      headers: Record<string, string>
    }
  }
}

export type WebSocketNetworkHandshakeResponseEvent = {
  method: 'handshakeResponse'
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

export type Message = {
  data: string
  length: number
  timestamp: number
  method: 'frameReceived' | 'frameSent'
}
