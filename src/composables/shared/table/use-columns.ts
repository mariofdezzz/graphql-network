import type { Column } from '@/types/components/shared/table/column'
import { onMounted, ref, useSlots, watchEffect, type Slot } from 'vue'

export type ColumnContext = Column & {
  slot?: Slot
  onClick?: (row: any) => void
}

export function useColumns() {
  const slots = useSlots()
  const columns = ref<ColumnContext[]>([])

  function registerColumns() {
    const children = slots.default?.() || []

    columns.value = children
      .filter((vnode) => (vnode.type as any)?.__name === 'shared-column')
      .map((vnode) => ({
        field: vnode.props?.field,
        header: vnode.props?.header,
        slot: (vnode.children as any)?.default,
        onClick: vnode.props?.onClick,
      }))
  }

  onMounted(() => {
    registerColumns()
  })
  watchEffect(() => {
    registerColumns()
  })

  return {
    columns,
  }
}
