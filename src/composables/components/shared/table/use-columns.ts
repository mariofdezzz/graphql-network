import type { Column } from '@/types/components/shared/table/column'
import { onMounted, reactive, useSlots, watchEffect, type Slot } from 'vue'

export type ColumnContext = Column & {
  slot?: Slot
  onClick?: (row: any) => void
}

export function useColumns() {
  const slots = useSlots()
  const columns = reactive<ColumnContext[]>([])

  function registerColumns() {
    const children = slots.default?.() || []

    columns.splice(
      0,
      columns.length,
      ...children
        .filter((vnode) => (vnode.type as any)?.__name === 'shared-column')
        .map((vnode) => ({
          field: vnode.props?.field,
          header: vnode.props?.header,
          sortable: vnode.props?.sortable,
          slot: (vnode.children as any)?.default,
          onClick: vnode.props?.onClick,
          sizeUnit: vnode.props?.sizeUnit,
          class: vnode.props?.class,
        })),
    )
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
