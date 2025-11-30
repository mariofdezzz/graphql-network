<script setup lang="ts">
import type { Column } from '@/types/components/shared/table/column'
import type { Sort } from '@/types/components/shared/table/sort'
import { Icon } from '@iconify/vue'

const sort = defineModel<Sort>('sort')

defineProps<{
  columns: Column[]
}>()

function updateSort(column: Column) {
  if (sort.value?.column === column.key) {
    sort.value = {
      ...sort.value,
      direction: sort.value.direction === 'asc' ? 'desc' : 'asc',
    }
  } else {
    sort.value = { column: column.key, direction: 'asc' }
  }
}
</script>

<template>
  <div
    v-for="(column, index) in columns"
    :key="index"
    class="px-2 py-1 border-b border-on-base-disabled first:border-l last:border-r hover:bg-on-base-hover flex items-center justify-between select-none"
    @click="updateSort(column)"
  >
    <span>
      {{ column.title }}
    </span>

    <template v-if="sort?.column === column.key">
      <Icon v-if="sort.direction === 'asc'" icon="dashicons:arrow-up" class="h-4 w-4" />
      <Icon v-else icon="dashicons:arrow-down" class="h-4 w-4" />
    </template>
  </div>
</template>
