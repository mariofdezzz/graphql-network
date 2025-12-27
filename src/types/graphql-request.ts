import type { ChromeNetworkRequest } from '@/types/chrome-network-request'
import type { Prettify } from '@/types/prettify'

export type GraphQLRequest = {
  id: string
  name: string
  status: number
  errors: number
  operation: 'query' | 'mutation' | 'subscription' | 'preflight' | 'unknown'
  size: number
  timings: Prettify<
    {
      startedAt: string
      total: number
      _blocked_queueing?: number
    } & ChromeNetworkRequest['timings']
  >
  headers: {
    general: {
      url: string
      method: string
      status: number
      remoteAddress?: string
      referer: string
    }
    response: ChromeNetworkRequest['response']['headers']
    request: ChromeNetworkRequest['request']['headers']
  }
  payload?: string
  initiator: Initiator
  response: string
}

export type Initiator = {
  type: string
  stack: Stack
}

export type Stack = {
  callFrames: CallFrame[]
  parent: StackParent
}

export type CallFrame = {
  functionName: string
  scriptId: string
  url: string
  lineNumber: number
  columnNumber: number
}

export type StackParent = {
  description: string
  callFrames: CallFrame[]
  parent: ParentParent
}

export type ParentParent = {
  description: string
  callFrames: CallFrame[]
}
