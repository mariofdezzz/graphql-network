<script setup lang="ts">
import { useColumns } from '@/composables/app-main/use-columns'
import { useRequestDetailStore } from '@/stores/request-detail'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, ref } from 'vue'
import RequestsTableColumn from './requests-table-column.vue'
import RequestsTableRow from './requests-table-row.vue'

defineProps<{
  rows: GraphQLRequest[]
  timelineStartAt: Date
}>()

const { columns: rawColumns } = useColumns()
const selectedRow = ref<GraphQLRequest['id']>()

const requestDetailStore = useRequestDetailStore()

const columns = computed(() => {
  return requestDetailStore.requestDetail ? rawColumns.slice(0, 1) : rawColumns
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- header -->
    <div
      class="grid gap-px bg-on-base-disabled *:bg-table-base"
      :class="[requestDetailStore.requestDetail ? 'grid-cols-1' : 'grid-cols-6']"
    >
      <RequestsTableColumn :columns />
    </div>

    <!-- rows -->
    <RequestsTableRow
      v-for="(row, index) in rows"
      :key="row.id"
      :row
      :columns
      :timelineStartAt
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
