<script
  setup
  lang="ts"
  generic="T extends Record<string, any> & { id: string; hasErrors?: boolean }"
>
import { useColumns } from '@/composables/components/shared/table/use-columns'
import { useSorted } from '@/composables/components/shared/table/use-sorted'
import { MIN_TABLE_COL_WIDTH } from '@/constants/shared/table/min-table-col-width'
import type { Sort } from '@/types/components/shared/table/sort'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { computed, ref, toRefs } from 'vue'
import SharedTableHeader from './shared-table-header.vue'
import SharedTableRowCell from './shared-table-row-cell.vue'

const props = defineProps<{
  id: string
  rows: Array<T>
  sort?: Sort
}>()

const emit = defineEmits<{
  (e: 'enter', row: T): void
  (e: 'focusChange', row: T): void
}>()

const { rows } = toRefs(props)
const { columns } = useColumns()
const sortModel = ref(props.sort)
const selectedRow = ref<T>()
const layout = ref<number[]>([])

const { result: sortedRows } = useSorted(rows, sortModel)

const gridTemplateCols = computed(
  () =>
    'grid-template-columns: ' +
    Array.zip(layout.value, columns)
      .map(([relativeWidth, column]) => `${relativeWidth}${column.sizeUnit ?? '%'}`)
      .join(' '),
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
</script>

<template>
  <div
    class="h-full min-h-0 grid grid-rows-[auto_1fr] gap-x-px bg-on-base-disabled relative"
    :style="gridTemplateCols"
  >
    <div class="col-span-full grid grid-cols-subgrid gap-px min-h-0">
      <div class="col-span-full grid grid-cols-subgrid *:bg-table-alternate-row">
        <SharedTableHeader
          v-for="column in columns"
          :key="column.field"
          v-model:sort="sortModel"
          :column
          :sortable="column.sortable"
          class="border-on-base-disabled"
        />
      </div>

      <div class="col-span-full grid grid-cols-subgrid overflow-auto">
        <div
          v-for="(row, index) in sortedRows"
          :key="row.id"
          class="col-span-full grid grid-cols-subgrid hover:*:bg-on-base-hover"
          :class="[
            selectedRow?.id === row.id
              ? '*:bg-table-selected-row hover:*:bg-table-selected-row'
              : '',
            row.hasErrors ? 'text-table-error-row' : '',
            index % 2 === 0 ? '*:bg-table-alternate-row' : '*:bg-table-base',
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

    <SplitterGroup
      :id="id + '-splitter'"
      direction="horizontal"
      :autoSaveId="id"
      class="absolute h-full w-full pointer-events-none"
      @layout="layout = $event"
    >
      <template v-for="(column, index) in columns" :key="column.field">
        <SplitterResizeHandle v-if="index > 0" :id="column.field + '-resize-handle'" />

        <SplitterPanel
          :id="column.field"
          :minSize="column.sizeUnit === 'px' ? MIN_TABLE_COL_WIDTH : 5"
          :sizeUnit="column.sizeUnit"
        />
      </template>
    </SplitterGroup>
  </div>

  <slot />
</template>
