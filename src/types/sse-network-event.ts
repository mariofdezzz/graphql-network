import type { Initiator } from './graphql-request'

export type SSENetworkEvent =
  | SSENetworkRequestSentEvent
  | SSENetworkResponseReceivedEvent
  | SSENetworkDataReceivedEvent
  | SSENetworkMessageReceivedEvent
  | SSENetworkLoadingFinishedEvent
  | SSENetworkLoadingFailedEvent

export type SSENetworkRequestSentEvent = {
  method: 'requestSent'
  params: {
    requestId: string
    timestamp: number
    wallTime: number
    request: {
      url: string
      method: string
      headers: Record<string, string>
      postData?: string
    }
    initiator: Initiator
    type: 'EventSource'
  }
}

export type SSENetworkResponseReceivedEvent = {
  method: 'responseReceived'
  params: {
    requestId: string
    timestamp: number
    response: {
      url: string
      status: number
      statusText: string
      headers: Record<string, string>
      mimeType: string
    }
    type: 'EventSource'
  }
}

export type SSENetworkDataReceivedEvent = {
  method: 'dataReceived'
  params: {
    requestId: string
    timestamp: number
    dataLength: number
  }
}

export type SSENetworkMessageReceivedEvent = {
  method: 'eventSourceMessageReceived'
  params: {
    requestId: string
    timestamp: number
    eventName: string
    eventId: string
    data: string
  }
}

export type SSENetworkLoadingFinishedEvent = {
  method: 'loadingFinished'
  params: {
    requestId: string
    timestamp: number
    encodedDataLength: number
  }
}

export type SSENetworkLoadingFailedEvent = {
  method: 'loadingFailed'
  params: {
    requestId: string
    timestamp: number
    errorText: string
  }
}

export type SSEMessage = {
  data: string
  length: number
  time: Date
  method: 'eventSourceMessage'
  eventName: string
  eventId: string
}
