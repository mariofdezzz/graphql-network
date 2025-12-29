import type { Sort } from '@/types/components/shared/table/sort'
import { REQUEST_COLUMNS_TO_KEYS } from './request-columns-to-keys'

export const DEFAULT_NETWORK_ORDER = {
  column: REQUEST_COLUMNS_TO_KEYS.waterfall,
  direction: 'asc',
} as const satisfies Sort
