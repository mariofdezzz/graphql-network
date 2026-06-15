import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { Prettify } from '@/types/prettify'
import type { ComputedRef } from 'vue'
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
  size: number
  timings: Prettify<{
    startedAt: string
    total?: number
    wallTime: number
    baseTimestamp: number
    // _blocked_queueing?: number
    // waterfall: number
  }>
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
