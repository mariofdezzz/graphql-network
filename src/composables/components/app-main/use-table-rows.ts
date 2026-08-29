import { HTTP_STATUS_SUCCESS_THRESHOLD } from '@/constants/http-status-success-threshold'
import type { GraphQLNetworkRequestStatus, GraphQLRequest } from '@/types/graphql-request'
import { computed, unref, type MaybeRef } from 'vue'
import { useByteFormatter } from '../shared/formatter/use-byte-formatter'
import { useTimeFormatter } from '../shared/formatter/use-time-formatter'

export function useTableRows(requests: MaybeRef<GraphQLRequest[]>) {
  const { format: formatTime } = useTimeFormatter()
  const { format: formatBytes } = useByteFormatter()

  const rows = computed(() => unref(requests).map((request) => requestToRow(request)))
  const times = computed(() => {
    return Object.fromEntries(unref(requests).map((row) => [row.id, getTime(row)]))
  })

  function requestToRow(request: GraphQLRequest) {
    const { id, name, operation, status: httpStatus, errors, size: rawSize, timings } = request

    const status =
      '_status' in request ? (request._status as GraphQLNetworkRequestStatus) : undefined

    const corsError = (request as any).corsError

    const errorsValue = unref(errors)

    const hasErrors = httpStatus >= HTTP_STATUS_SUCCESS_THRESHOLD || errorsValue > 0 || corsError

    const size = formatBytes(unref(rawSize))

    const timeValue = times.value[id]
    const time = timeValue ? formatTime(timeValue) : undefined

    return {
      id,
      name,
      operation,
      status,
      httpStatus,
      corsError,
      hasErrors,
      errors: errorsValue,
      size,
      time,
      waterfall: (timings as any).waterfall,
      request,
    }
  }

  function getTime(request: GraphQLRequest) {
    const total = unref(request.timings.total)

    // For WebSocket subscriptions, show Pending if not closed
    if (
      request.operation === 'subscription' &&
      request.transport === 'websocket' &&
      'closedAt' in request
    ) {
      if (!unref(request.closedAt)) {
        return undefined
      }
    }

    return '_blocked_queueing' in request.timings
      ? (total as number) - Math.max(request.timings._blocked_queueing ?? 0, 0)
      : total
  }

  return {
    rows,
  }
}
