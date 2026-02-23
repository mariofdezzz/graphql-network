<script setup lang="ts">
import ArrowDownIcon from '@/components/icons/arrow-down-icon.vue'
import ArrowUpIcon from '@/components/icons/arrow-up-icon.vue'
import type { Column } from '@/types/components/shared/table/column'
import type { Sort } from '@/types/components/shared/table/sort'

const sort = defineModel<Sort>('sort')

const props = defineProps<{
  column: Column
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
</script>

<template>
  <div
    class="px-2 py-1 hover:bg-on-base-hover flex items-center justify-between select-none"
    @click="updateSort()"
  >
    <span>
      {{ column.header }}
    </span>

    <template v-if="sort?.column === column.field">
      <ArrowUpIcon v-if="sort.direction === 'asc'" class="h-4 w-4" />
      <ArrowDownIcon v-else class="h-4 w-4" />
    </template>
  </div>
</template>
