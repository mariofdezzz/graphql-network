<script setup lang="ts">
import { formatBytes } from '@/logic/contexts/size/format-bytes'
import { formatTime } from '@/logic/contexts/time/format-time'
import { useRequestDetailStore } from '@/stores/request-detail'
import type { Sort } from '@/types/components/shared/table/sort'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, unref } from 'vue'
import SharedColumn from '../shared/table/shared-column.vue'
import SharedTable from '../shared/table/shared-table.vue'
import RequestTableRowWaterfall from './request-table-row-waterfall.vue'

const props = defineProps<{
  rows: GraphQLRequest[]
}>()

const HTTP_STATUS_SUCCESS_THRESHOLD = 400
const initialSort: Sort = {
  column: 'waterfall',
  direction: 'asc',
}

const requestDetailStore = useRequestDetailStore()

const processedRows = computed(() =>
  props.rows.map((row) => ({
    ...row,
    hasErrors:
      row.status >= HTTP_STATUS_SUCCESS_THRESHOLD ||
      (typeof row.errors === 'number' ? row.errors : row.errors.value) > 0 ||
      (row as any).corsError,
  })),
)

const hideColumns = computed(() => Boolean(requestDetailStore.requestDetail))

const times = computed(() => {
  return Object.fromEntries(props.rows.map((row) => [row.id, getTime(row)]))
})

function getTime(row: GraphQLRequest) {
  return '_blocked_queueing' in row.timings
    ? row.timings.total - Math.max(row.timings._blocked_queueing ?? 0, 0)
    : row.timings.total
}

function focusChange(row: GraphQLRequest) {
  if (requestDetailStore.requestDetail) {
    requestDetailStore.requestDetail = row
  }
}
</script>

<template>
  <SharedTable
    :rows="processedRows"
    :sort="initialSort"
    @enter="requestDetailStore.requestDetail = $event"
    @focusChange="focusChange($event)"
  >
    <SharedColumn field="name" header="Name" @click="requestDetailStore.requestDetail = $event">
      <template #default="{ row }">
        <span :class="{ italic: row.operation === 'preflight' }">
          {{ row.name }}
        </span>
      </template>
    </SharedColumn>

    <SharedColumn v-if="!hideColumns" field="status" header="Status">
      <template #default="{ row }">
        <template v-if="row.status >= HTTP_STATUS_SUCCESS_THRESHOLD">
          (http:{{ row.status }})
        </template>
        <template v-if="row.corsError"> (CORS error) </template>
        <template v-else-if="unref(row.errors) > 0"> {{ row.errors }} errors </template>
        <template v-else> ok </template>
      </template>
    </SharedColumn>

    <SharedColumn v-if="!hideColumns" field="operation" header="Type" />

    <SharedColumn v-if="!hideColumns" field="size" header="Size">
      <template #default="{ row }">
        {{ formatBytes(row.size) }}
      </template>
    </SharedColumn>

    <SharedColumn v-if="!hideColumns" field="time" header="Time">
      <template #default="{ row }">
        {{ times[row.id] ? formatTime(times[row.id]!, times[row.id]! >= 1000 ? 2 : 0) : 'Pending' }}
      </template>
    </SharedColumn>

    <SharedColumn v-if="!hideColumns" field="waterfall" header="Waterfall">
      <template #default="{ row }">
        <RequestTableRowWaterfall :request="row" />
      </template>
    </SharedColumn>
  </SharedTable>
  <!-- <div class="h-full flex flex-col">
    <div
      class="grid gap-px bg-on-base-disabled *:bg-table-base"
      :class="[requestDetailStore.requestDetail ? 'grid-cols-1' : 'grid-cols-6']"
    >
      <RequestsTableColumn :columns />
    </div>

    <RequestsTableRow
      v-for="(row, index) in rows"
      :key="row.id"
      :row
      :columns
      :selected="selectedRow === row.id"
      :class="[index % 2 === 1 ? '*:bg-table-alternate-row' : '*:bg-table-base']"
      @click="selectedRow = row.id"
    />

    <div
      class="flex-1 grid gap-px bg-on-base-disabled *:bg-base-color"
      :class="[requestDetailStore.requestDetail ? 'grid-cols-1' : 'grid-cols-6']"
    >
      <div v-for="(column, index) in columns" :key="index" class="first:pl-px last:pr-px"></div>
    </div>
  </div> -->
</template>
