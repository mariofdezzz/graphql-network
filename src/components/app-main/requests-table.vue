<script setup lang="ts">
import type { Sort } from '@/types/components/shared/table/sort'
import { useColumns } from '@/composables/app-main/use-columns'
import RequestsTableColumn from './requests-table-column.vue'
import type { GraphQLRequest } from '@/types/graphql-request'
import RequestsTableRow from './requests-table-row.vue'
import { ref } from 'vue'

defineProps<{
  rows: GraphQLRequest[]
  sort?: Sort
}>()

const { columns } = useColumns()
const selectedRow = ref<GraphQLRequest['id']>()
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- header -->
    <div class="flex gap-px bg-on-base-disabled *:bg-base *:flex-1">
      <RequestsTableColumn :columns :sort />
    </div>

    <!-- rows -->
    <RequestsTableRow
      v-for="(row, index) in rows"
      :key="row.id"
      :row
      :columns
      :selected="selectedRow === row.id"
      :class="[index % 2 === 1 ? '*:bg-table-alternate-row' : '*:bg-table-base']"
      @click="selectedRow = row.id"
    />

    <!-- empty space -->
    <div class="flex-1 flex gap-px bg-on-base-disabled *:bg-base *:flex-1">
      <div v-for="(column, index) in columns" :key="index" class="first:pl-px last:pr-px"></div>
    </div>
  </div>
</template>
