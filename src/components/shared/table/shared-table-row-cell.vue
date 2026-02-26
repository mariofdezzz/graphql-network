<script setup lang="ts">
import type { ColumnContext } from '@/composables/components/shared/table/use-columns'

defineProps<{
  row: Record<string, any>
  columns: ColumnContext[]
}>()
</script>

<template>
  <div
    v-for="{ field, slot, onClick } in columns"
    :key="field"
    class="px-1 py-0.5 select-none first:pl-[5px] last:pr-[5px] line-clamp-1 text-ellipsis"
    @click="onClick?.(row)"
  >
    <component v-if="slot" :is="() => slot({ row })" />

    <template v-else>
      {{ row[field] }}
    </template>
  </div>
</template>
