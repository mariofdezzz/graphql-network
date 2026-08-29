import type { Sort } from '@/types/components/shared/table/sort'

export const DEFAULT_NETWORK_ORDER = {
  column: 'waterfall',
  direction: 'asc',
} as const satisfies Sort
