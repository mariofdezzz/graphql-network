import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { Prettify } from '@/types/prettify'
import type { ComputedRef, Ref } from 'vue'
import type { SSEMessage } from './sse-network-event'
import type { Message as WebSocketMessage } from './websocket-network-event'

export type Message = WebSocketMessage | SSEMessage

export type GraphQLRequest = GraphQLNetworkRequest | GraphQLSubscriptionRequest

export type GraphQLNetworkRequest = {
  id: string
  name: string
  status: number
  errors: number
  corsError: boolean
  operation: 'query' | 'mutation' | 'preflight' | 'unknown'
  size: number
  timings: Prettify<
    {
      startedAt: string
      total: number
      _blocked_queueing?: number
      waterfall: number
    } & ChromeNetworkRequest['timings']
  >
  headers: {
    general: {
      url: string
      method: string
      status: number
      remoteAddress?: string
    }
    request: ChromeNetworkHeaders
    response: ChromeNetworkHeaders
  }
  payload?: any
  initiator: Initiator
  response?: any
}

export type GraphQLSubscriptionRequest = {
  id: string
  name: string
  status: number
  errors: ComputedRef<number>
  operation: 'subscription'
  transport: 'websocket' | 'sse'
  size: Ref<number>
  timings: Prettify<{
    startedAt: string
    total?: number | ComputedRef<number>
    wallTime: number
    baseTimestamp: number
    responseReceivedTimestamp?: number
    /** HAR-equivalent phases extracted from CDP ResourceTiming (ms) */
    _blocked_queueing?: number
    blocked?: number
    dns?: number
    connect?: number
    ssl?: number
    send?: number
    wait?: number
  }>
  closedAt?: Ref<Date | undefined>
  //  & ChromeNetworkRequest['timings']
  headers: {
    general: {
      url: string
      method: string
      status: number
      remoteAddress?: string
    }
    request: ChromeNetworkHeaders
    response: ChromeNetworkHeaders
  }
  payload?: {
    query?: string
    variables?: Record<string, any>
    extensions?: Record<string, any>
  }
  rawEventStream?: Ref<string>
  initiator: Initiator
  messages: Message[]
}

export type Initiator = {
  type: string
  stack: Stack
}

export type Stack = {
  callFrames: CallFrame[]
  description?: string
  parent?: Stack
}

export type CallFrame = {
  functionName: string
  scriptId: string
  url: string
  lineNumber: number
  columnNumber: number
}

export type ChromeNetworkHeaders = ChromeNetworkRequest['request']['headers']
