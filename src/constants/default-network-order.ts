import type { Sort } from '@/types/components/shared/table/sort'

export const DEFAULT_NETWORK_ORDER = {
  column: 'timings.startedAt',
  direction: 'asc',
} as const satisfies Sort
