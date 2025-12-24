export const REQUEST_COLUMNS_TO_KEYS = {
  name: 'name',
  status: 'status',
  operation: 'operation',
  size: 'size',
  time: 'timings.total',
  waterfall: 'timings.startedAt',
} as const

export const REQUEST_KEYS_TO_COLUMNS = Object.fromEntries(
  Object.entries(REQUEST_COLUMNS_TO_KEYS).map(([key, value]) => [value, key]),
) as Record<
  (typeof REQUEST_COLUMNS_TO_KEYS)[keyof typeof REQUEST_COLUMNS_TO_KEYS],
  keyof typeof REQUEST_COLUMNS_TO_KEYS
>
