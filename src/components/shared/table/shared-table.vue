<script setup lang="ts" generic="T extends Record<string, any> & { id: string }">
import { useColumns } from '@/composables/shared/table/use-columns'
import type { Sort } from '@/types/components/shared/table/sort'
import { computed, ref } from 'vue'
import SharedTableHeader from './shared-table-header.vue'

const props = withDefaults(
  defineProps<{
    rows: Array<T>
    sort?: Sort
    leftBorder?: boolean
    rightBorder?: boolean
  }>(),
  {
    leftBorder: true,
    rightBorder: true,
  },
)
const emit = defineEmits<{
  (e: 'enter', row: T): void
  (e: 'focusChange', row: T): void
}>()

const { columns } = useColumns()
const sortModel = ref(props.sort)
const selectedRow = ref<T>()

const tableCols = computed(() => 'grid-cols-' + columns.value.length)

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
</script>

<template>
  <div
    class="h-full min-h-0 grid grid-rows-[auto_1fr] gap-x-px bg-on-base-disabled"
    :class="[tableCols]"
  >
    <div class="col-span-full grid grid-cols-subgrid gap-px min-h-0">
      <div class="col-span-full grid grid-cols-subgrid *:bg-table-base">
        <SharedTableHeader
          v-for="column in columns"
          :key="column.field"
          v-model:sort="sortModel"
          :column
          class="border-on-base-disabled"
          :class="{
            'first:border-l': props.leftBorder,
            'last:border-r': props.rightBorder,
          }"
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
          ]"
          @click="select(row)"
          @keypress.enter="onEnter(row)"
          @keyup.up="focusPrevious($event, row, index)"
          @keyup.down="focusNext($event, row, index)"
          tabindex="0"
        >
          <div
            v-for="{ field, slot, onClick } in columns"
            :key="field"
            class="px-1 py-0.5 select-none first:pl-[5px] last:pr-[5px] line-clamp-1"
            @click="onClick?.(row)"
          >
            <component v-if="slot" :is="() => slot({ row })" />

            <template v-else>
              {{ row[field] }}
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-full grid grid-cols-subgrid *:bg-table-base">
      <div v-for="i in columns.length" :key="i"></div>
    </div>
  </div>

  <slot />
</template>
