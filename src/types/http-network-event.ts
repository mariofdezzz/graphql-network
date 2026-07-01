import type { Initiator } from './graphql-request'

export type HttpNetworkEvent =
  | HttpNetworkRequestSentEvent
  | HttpNetworkResponseReceivedEvent
  | HttpNetworkLoadingFinishedEvent
  | HttpNetworkLoadingFailedEvent

export type HttpNetworkRequestSentEvent = {
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
    type: string
  }
}

export type HttpNetworkResponseReceivedEvent = {
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
    type: string
  }
}

export type HttpNetworkLoadingFinishedEvent = {
  method: 'loadingFinished'
  params: {
    requestId: string
    timestamp: number
    encodedDataLength: number
  }
}

export type HttpNetworkLoadingFailedEvent = {
  method: 'loadingFailed'
  params: {
    requestId: string
    timestamp: number
    canceled?: boolean
    errorText: string
  }
}
