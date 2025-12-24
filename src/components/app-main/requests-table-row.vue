<script setup lang="ts">
import { useRequestDetailStore } from '@/stores/request-detail'
import type { Column } from '@/types/components/shared/table/column'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed } from 'vue'
import RequestTableRowWaterfall from './request-table-row-waterfall.vue'

const props = defineProps<{
  row: GraphQLRequest
  columns: Column[]
  selected: boolean
  timelineStartAt: Date
}>()

const HTTP_STATUS_SUCCESS_THRESHOLD = 400

const requestDetailStore = useRequestDetailStore()

const rowHasErrors = computed(
  () => props.row.status >= HTTP_STATUS_SUCCESS_THRESHOLD || props.row.errors > 0,
)
const totalTime = computed(() =>
  [props.row.timings.send, props.row.timings.wait, props.row.timings.receive]
    .filter((n): n is number => typeof n === 'number')
    .reduce((acc, curr) => acc + curr, 0),
)

function onRowClick(column: Column) {
  if (column.key === 'name') {
    requestDetailStore.requestDetail = props.row
  }
}
</script>

<template>
  <div
    class="grid grid-cols-6 gap-px bg-on-base-disabled hover:*:bg-on-base-hover"
    :class="[
      selected ? '*:bg-table-selected-row hover:*:bg-table-selected-row' : '',
      rowHasErrors ? 'text-table-error-row' : '',
    ]"
  >
    <div
      v-for="(column, index) in columns"
      :key="index"
      class="px-1 py-0.5 select-none first:pl-[5px] last:pr-[5px] overflow-hidden text-ellipsis min-w-0"
      @click="onRowClick(column)"
    >
      <span v-if="column.key === 'time'"> {{ Math.round(totalTime) }}ms </span>

      <span v-else-if="column.key === 'status'">
        <template v-if="row.status >= HTTP_STATUS_SUCCESS_THRESHOLD">
          (http:{{ row.status }})
        </template>
        <template v-else-if="row.errors > 0"> {{ row.errors }} errors </template>
        <template v-else> ok </template>
      </span>

      <span v-else-if="column.key === 'size'"> {{ (row.size / 1024).toFixed(1) }} kb </span>

      <span v-else-if="column.key === 'waterfall'">
        <RequestTableRowWaterfall :request="row" />
      </span>

      <span v-else>
        {{ row[column.key as keyof GraphQLRequest] }}
      </span>
    </div>
  </div>
</template>
