<script setup lang="ts">
import type { Column } from '@/types/components/shared/table/column'
import type { SSEMessage } from '@/types/sse-network-event'

defineProps<{
  row: SSEMessage
  columns: Column[]
  selected: boolean
}>()

const formatter = new Intl.DateTimeFormat('en', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
})
</script>

<template>
  <div
    class="grid grid-cols-[80px_100px_1fr_200px] gap-px bg-on-base-disabled hover:*:bg-on-base-hover! border-b border-on-base-disabled"
    :class="[
      selected ? '*:bg-table-selected-row! hover:*:bg-table-selected-row!' : '*:bg-base-color!',
    ]"
  >
    <div
      v-for="(column, index) in columns"
      :key="index"
      class="px-1 py-0.5 select-none first:pl-[5px] last:pr-[5px] overflow-hidden text-ellipsis min-w-0"
    >
      <span v-if="column.field === 'time'" class="line-clamp-1">
        {{ formatter.format(row.time) }}
      </span>

      <span v-else-if="column.field === 'data'" class="line-clamp-1">
        {{ row.data }}
      </span>

      <span v-else class="line-clamp-1">
        {{ row[column.field as keyof SSEMessage] }}
      </span>
    </div>
  </div>
</template>
