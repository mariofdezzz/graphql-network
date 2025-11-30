import type { Column } from '@/types/components/shared/table/column'
import { onMounted, ref, useSlots } from 'vue'

export function useColumns() {
  const slots = useSlots()
  const columns = ref<Column[]>([])

  function registerColumns() {
    const children = slots.default?.() || []

    columns.value = children
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((vnode) => (vnode.type as any)?.__name === 'shared-column')
      .map((vnode) => vnode.props as Column)
  }

  onMounted(() => {
    registerColumns()
  })

  return {
    columns,
  }
}
