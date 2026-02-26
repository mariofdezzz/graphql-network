<script
  setup
  lang="ts"
  generic="T extends Record<string, any> & { id: string; hasErrors?: boolean }"
>
import { useColumns, type ColumnContext } from '@/composables/components/shared/table/use-columns'
import { MIN_COL_WIDTH } from '@/constants/shared/table/min-col-width'
import type { Sort } from '@/types/components/shared/table/sort'
import { computed, ref } from 'vue'
import SharedTableHeader from './shared-table-header.vue'
import SharedTableRowCell from './shared-table-row-cell.vue'

const props = defineProps<{
  rows: Array<T>
  sort?: Sort
}>()

const emit = defineEmits<{
  (e: 'enter', row: T): void
  (e: 'focusChange', row: T): void
}>()

const { columns } = useColumns()
const sortModel = ref(props.sort)
const selectedRow = ref<T>()

const gridTemplateCols = computed(
  () =>
    'grid-template-columns: ' +
    columns
      .map(({ relativeWidth }, index) =>
        index < columns.length - 1
          ? `minmax(${MIN_COL_WIDTH}px, ${relativeWidth}%)`
          : `minmax(${MIN_COL_WIDTH}px, 1fr)`,
      )
      .join(' '),
)
const lastColumnWidth = computed(() => {
  const totalRelativeWidth = columns
    .slice(0, -1)
    .reduce((sum, { relativeWidth }) => sum + relativeWidth, 0)
  const absoluteLastColWidth = window.innerWidth * (1 - totalRelativeWidth / 100)
  return absoluteLastColWidth
})

const sortedRows = computed(() =>
  props.rows.toSorted((a, b) => {
    if (props.sort === undefined) return 0

    const column = props.sort.column

    if (typeof a[column] === 'string') {
      return props.sort.direction === 'asc'
        ? String(a[column]).localeCompare(b[column])
        : String(b[column]).localeCompare(a[column])
    }
    return props.sort.direction === 'asc' ? a[column] - b[column] : b[column] - a[column]
  }),
)

function select(row: T) {
  selectedRow.value = row
}
function onEnter(row: T) {
  select(row)
  emit('enter', row)
}
function focusPrevious(event: KeyboardEvent, row: T, index: number) {
  event.preventDefault()
  const target = event.target as HTMLDivElement
  const previous = target.previousElementSibling as HTMLDivElement | null

  if (previous) {
    const newRow = sortedRows.value[index - 1]!
    previous.focus()
    select(newRow)
    emit('focusChange', newRow)
  }
}
function focusNext(event: KeyboardEvent, row: T, index: number) {
  event.preventDefault()
  const target = event.target as HTMLDivElement
  const next = target.nextElementSibling as HTMLDivElement | null

  if (next) {
    const newRow = sortedRows.value[index + 1]!
    next.focus()
    select(newRow)
    emit('focusChange', newRow)
  }
}

function resizeColumn(column: ColumnContext, newRelativeSize: number) {
  columns.at(-1)!.relativeWidth += column.relativeWidth - newRelativeSize

  column.relativeWidth = newRelativeSize
}
</script>

<template>
  <div
    class="h-full min-h-0 grid grid-rows-[auto_1fr] gap-x-px bg-on-base-disabled"
    :style="gridTemplateCols"
  >
    <div class="col-span-full grid grid-cols-subgrid gap-px min-h-0">
      <div class="col-span-full grid grid-cols-subgrid *:bg-table-base">
        <SharedTableHeader
          v-for="(column, index) in columns"
          :key="column.field"
          v-model:sort="sortModel"
          :column
          :relativeWidth="column.relativeWidth"
          :lastColumnWidth
          :showResizeHandle="index !== columns.length - 1"
          class="border-on-base-disabled"
          @resize="resizeColumn(column, $event)"
        />
      </div>

      <div class="col-span-full grid grid-cols-subgrid overflow-auto">
        <div
          v-for="(row, index) in sortedRows"
          :key="row.id"
          class="col-span-full grid grid-cols-subgrid *:bg-table-base hover:*:bg-on-base-hover"
          :class="[
            selectedRow?.id === row.id
              ? '*:bg-table-selected-row hover:*:bg-table-selected-row'
              : '',
            row.hasErrors ? 'text-table-error-row' : '',
          ]"
          @click="select(row)"
          @keypress.enter="onEnter(row)"
          @keyup.up="focusPrevious($event, row, index)"
          @keyup.down="focusNext($event, row, index)"
          tabindex="0"
        >
          <SharedTableRowCell v-for="column in columns" :key="column.field" :row :column />
        </div>
      </div>
    </div>

    <div class="col-span-full grid grid-cols-subgrid *:bg-table-base">
      <div v-for="i in columns.length" :key="i"></div>
    </div>
  </div>

  <slot />
</template>
