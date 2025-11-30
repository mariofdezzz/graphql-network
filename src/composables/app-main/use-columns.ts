import type { Column } from '@/types/components/shared/table/column'
import { ref } from 'vue'

export function useColumns() {
  const columns: Column[] = [
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Status',
      key: 'status',
    },
    {
      title: 'Type',
      key: 'operation',
    },
    {
      title: 'Size',
      key: 'size',
    },
    {
      title: 'Time',
      key: 'time',
    },
    {
      title: 'Waterfall',
      key: 'waterfall',
    },
  ]
  const colsWidth = ref(['1', '1', '1', '1', '100px'])

  return { columns, colsWidth }
}
