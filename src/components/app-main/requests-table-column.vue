<!-- <script setup lang="ts">
import {
  REQUEST_COLUMNS_TO_KEYS,
  REQUEST_KEYS_TO_COLUMNS,
} from '@/constants/request-columns-to-keys'
import { useNetworkStore } from '@/stores/network'
import type { Column } from '@/types/components/shared/table/column'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import ArrowDownIcon from '../icons/arrow-down-icon.vue'
import ArrowUpIcon from '../icons/arrow-up-icon.vue'

defineProps<{
  columns: Column[]
}>()

const networkStore = useNetworkStore()
const { order } = storeToRefs(networkStore)

const sortedColumn = computed(
  () => REQUEST_KEYS_TO_COLUMNS[order.value.column as keyof typeof REQUEST_KEYS_TO_COLUMNS] ?? null,
)

function updateSort(column: Column) {
  if (column.key === sortedColumn.value) {
    order.value = {
      ...order.value,
      direction: order.value.direction === 'asc' ? 'desc' : 'asc',
    }
  } else {
    order.value = {
      column: REQUEST_COLUMNS_TO_KEYS[column.key as keyof typeof REQUEST_COLUMNS_TO_KEYS],
      direction: 'asc',
    }
  }
}
</script>

<template>
  <div
    v-for="(column, index) in columns"
    :key="index"
    class="px-2 py-1 border-b border-on-base-disabled hover:bg-on-base-hover flex items-center justify-between select-none"
    @click="updateSort(column)"
  >
    <span>
      {{ column.title }}
    </span>

    <template v-if="sortedColumn === column.key">
      <ArrowUpIcon v-if="order!.direction === 'asc'" class="h-4 w-4" />
      <ArrowDownIcon v-else class="h-4 w-4" />
    </template>
  </div>
</template> -->
