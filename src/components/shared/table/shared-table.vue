<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'
import SharedTableHeader from './shared-table-header.vue'
import { useColumns } from '@/composables/shared/table/use-columns'
import type { Sort } from '@/types/components/shared/table/sort'

const props = defineProps<{
  rows: Array<T>
  sort?: Sort
}>()

const { columns } = useColumns()
const sort = ref<Sort | undefined>(props.sort)

const style = computed(
  () => `grid-template-columns: repeat(${columns.value.length}, minmax(0, 1fr))`,
)
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="shared-table grid gap-px bg-on-base-disabled *:bg-base-color" :style>
      <SharedTableHeader :columns :sort />

      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="px-2 py-1 border-b border-on-base-disabled first:border-l last:border-r hover:bg-on-base-hover grid gap-px bg-on-base-disabled *:bg-base-color"
        :style="`grid-template-columns: repeat(${columns.length}, minmax(0, 1fr))`"
      ></div>

      <slot />
    </div>

    <div class="flex-1 grid gap-px grid-rows-1 bg-on-base-disabled *:bg-base-color" :style>
      <div v-for="(column, index) in columns" :key="index"></div>
    </div>
  </div>
</template>

<style scoped></style>
