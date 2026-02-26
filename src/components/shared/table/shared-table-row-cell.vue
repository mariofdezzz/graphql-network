<script setup lang="ts">
import type { ColumnContext } from '@/composables/components/shared/table/use-columns'

defineProps<{
  row: Record<string, any>
  column: ColumnContext
}>()
</script>

<template>
  <div
    class="px-1 py-0.5 select-none first:pl-[5px] last:pr-[5px] line-clamp-1 text-ellipsis"
    @click="column.onClick?.(row)"
  >
    <component v-if="column.slot" :is="() => column.slot!({ row })" />

    <template v-else>
      {{ row[column.field] }}
    </template>
  </div>
</template>
