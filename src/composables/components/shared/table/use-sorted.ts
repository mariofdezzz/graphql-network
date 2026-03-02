import { getObjectProperty } from '@/logic/shared/get-object-property'
import type { Sort } from '@/types/components/shared/table/sort'
import { computed, unref, type MaybeRef } from 'vue'

export function useSorted<T extends Record<string, any>>(
  data: MaybeRef<T[]>,
  order: MaybeRef<Sort | undefined>,
) {
  const result = computed(() => {
    if (!unref(order)) return unref(data)

    return unref(data).toSorted((a, b) => {
      const column = unref(order)!.column

      let aValue = getObjectProperty(a, column) ?? 0
      let bValue = getObjectProperty(b, column) ?? 0

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase()
      }

      console.log('SORT', { column, aValue, bValue, data: unref(data) })
      if (aValue < bValue) {
        return unref(order)!.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return unref(order)!.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  })

  return { result }
}
