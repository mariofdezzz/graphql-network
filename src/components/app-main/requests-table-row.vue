<script setup lang="ts">
import { formatBytes } from '@/logic/contexts/size/format-bytes'
import { formatTime } from '@/logic/contexts/time/format-time'
import { useRequestDetailStore } from '@/stores/request-detail'
import type { Column } from '@/types/components/shared/table/column'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, unref } from 'vue'
import RequestTableRowWaterfall from './request-table-row-waterfall.vue'

const props = defineProps<{
  row: GraphQLRequest
  columns: Column[]
  selected: boolean
}>()

const HTTP_STATUS_SUCCESS_THRESHOLD = 400

const requestDetailStore = useRequestDetailStore()

const rowHasErrors = computed(() => {
  const errors = typeof props.row.errors === 'number' ? props.row.errors : props.row.errors.value

  return props.row.status >= HTTP_STATUS_SUCCESS_THRESHOLD || errors > 0
})
const time = computed(() => {
  return '_blocked_queueing' in props.row.timings
    ? props.row.timings.total - Math.max(props.row.timings._blocked_queueing ?? 0, 0)
    : props.row.timings.total
})

function onRowClick(column: Column) {
  if (column.key === 'name') {
    requestDetailStore.requestDetail = props.row
  }
}
</script>

<template>
  <div
    class="grid gap-px bg-on-base-disabled hover:*:bg-on-base-hover"
    :class="[
      selected ? '*:bg-table-selected-row hover:*:bg-table-selected-row ' : '',
      rowHasErrors ? 'text-table-error-row' : '',
      requestDetailStore.requestDetail ? 'grid-cols-1' : 'grid-cols-6',
    ]"
  >
    <div
      v-for="(column, index) in columns"
      :key="index"
      class="px-1 py-0.5 select-none first:pl-[5px] last:pr-[5px] overflow-hidden text-ellipsis min-w-0"
      :class="[['size', 'time'].includes(column.key) ? 'text-end' : '']"
      @click="onRowClick(column)"
    >
      <span v-if="column.key === 'time'" :class="{ 'text-request-timing-header': !time }">
        {{ time ? formatTime(time, time >= 1000 ? 2 : 0) : 'Pending' }}
      </span>

      <span v-else-if="column.key === 'status'">
        <template v-if="row.status >= HTTP_STATUS_SUCCESS_THRESHOLD">
          (http:{{ row.status }})
        </template>
        <template v-else-if="unref(row.errors) > 0"> {{ row.errors }} errors </template>
        <template v-else> ok </template>
      </span>

      <span v-else-if="column.key === 'size'"> {{ formatBytes(row.size) }} </span>

      <span v-else-if="column.key === 'waterfall'">
        <RequestTableRowWaterfall :request="row" />
      </span>

      <span v-else-if="row.operation === 'preflight' && column.key === 'name'" class="italic">
        {{ row.name }}
      </span>

      <span v-else>
        {{ row[column.key as keyof GraphQLRequest] }}
      </span>
    </div>
  </div>
</template>
