<script setup lang="ts">
import ArrowDownIcon from '@/components/icons/arrow-down-icon.vue'
import ArrowUpIcon from '@/components/icons/arrow-up-icon.vue'
import type { Column } from '@/types/components/shared/table/column'
import type { Sort } from '@/types/components/shared/table/sort'

const sort = defineModel<Sort>('sort')

const props = defineProps<{
  column: Column
  sortable?: boolean
}>()

function updateSort() {
  if (props.sortable) {
    if (sort.value?.column === props.column.field) {
      sort.value = {
        ...sort.value,
        direction: sort.value.direction === 'asc' ? 'desc' : 'asc',
      }
    } else {
      sort.value = { column: props.column.field, direction: 'asc' }
    }
  }
}
</script>

<template>
  <div ref="header" class="select-none relative">
    <div
      class="w-full px-1 py-1 flex items-center justify-between overflow-hidden"
      :class="{ 'hover:bg-on-base-hover': sortable }"
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
  </div>
</template>
