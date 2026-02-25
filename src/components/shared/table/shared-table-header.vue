<script setup lang="ts">
import ArrowDownIcon from '@/components/icons/arrow-down-icon.vue'
import ArrowUpIcon from '@/components/icons/arrow-up-icon.vue'
import { useResizer } from '@/composables/components/shared/table/shared-table-header/use-resizer'
import type { Column } from '@/types/components/shared/table/column'
import type { Sort } from '@/types/components/shared/table/sort'
import { toRefs, useTemplateRef } from 'vue'

const sort = defineModel<Sort>('sort')

const props = defineProps<{
  column: Column
  relativeWidth: number
  lastColumnWidth: number
  showResizeHandle?: boolean
}>()
const { relativeWidth, lastColumnWidth } = toRefs(props)

const emit = defineEmits<{
  (e: 'resize', newRelativeSize: number): void
}>()

function updateSort() {
  if (sort.value?.column === props.column.field) {
    sort.value = {
      ...sort.value,
      direction: sort.value.direction === 'asc' ? 'desc' : 'asc',
    }
  } else {
    sort.value = { column: props.column.field, direction: 'asc' }
  }
}

const headerElement = useTemplateRef('header')

const { onMouseDown } = useResizer(
  headerElement,
  relativeWidth,
  lastColumnWidth,
  (newRelativeSize) => {
    emit('resize', newRelativeSize)
  },
)
</script>

<template>
  <div ref="header" class="select-none relative">
    <div
      class="w-full px-2 py-1 flex items-center justify-between hover:bg-on-base-hover overflow-hidden"
      @click="updateSort()"
    >
      <span class="flex-1 min-w-0 overflow-hidden text-ellipsis">
        {{ column.header }}
      </span>

      <template v-if="sort?.column === column.field">
        <ArrowUpIcon v-if="sort.direction === 'asc'" class="h-4 w-4" />
        <ArrowDownIcon v-else class="h-4 w-4" />
      </template>
    </div>

    <div
      v-if="props.showResizeHandle"
      class="absolute top-0 right-0 cursor-col-resize h-full w-[7px] translate-x-1 z-10"
      @mousedown="onMouseDown($event)"
    ></div>
  </div>
</template>
