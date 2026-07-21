<script setup lang="ts">
import { DEFAULT_NETWORK_ORDER } from '@/constants/default-network-order'
import { REQUEST_COLUMNS_TO_KEYS } from '@/constants/request-columns-to-keys'
import { formatBytes } from '@/logic/contexts/size/format-bytes'
import { formatTime } from '@/logic/contexts/time/format-time'
import { useRequestDetailStore } from '@/stores/request-detail'
import type { GraphQLNetworkRequestStatus, GraphQLRequest } from '@/types/graphql-request'
import { computed, unref } from 'vue'
import SharedColumn from '../shared/table/shared-column.vue'
import SharedTable from '../shared/table/shared-table.vue'
import RequestTableRowWaterfall from './request-table-row-waterfall.vue'

const props = defineProps<{
  rows: GraphQLRequest[]
}>()

const HTTP_STATUS_SUCCESS_THRESHOLD = 400

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
  const total = unref(row.timings.total)

  // For WebSocket subscriptions, show Pending if not closed
  if (row.operation === 'subscription' && row.transport === 'websocket' && 'closedAt' in row) {
    if (!unref(row.closedAt)) {
      return undefined
    }
  }

  return '_blocked_queueing' in row.timings
    ? (total as number) - Math.max(row.timings._blocked_queueing ?? 0, 0)
    : total
}

function getRequestStatus(row: GraphQLRequest): GraphQLNetworkRequestStatus | undefined {
  return '_status' in row ? (row._status as GraphQLNetworkRequestStatus) : undefined
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
    :sort="DEFAULT_NETWORK_ORDER"
    @enter="requestDetailStore.requestDetail = $event"
    @focusChange="focusChange($event)"
  >
    <SharedColumn
      :field="REQUEST_COLUMNS_TO_KEYS.name"
      header="Name"
      sortable
      @click="requestDetailStore.requestDetail = $event"
    >
      <template #default="{ row }">
        <span :class="{ italic: row.operation === 'preflight' }">
          {{ row.name }}
        </span>
      </template>
    </SharedColumn>

    <SharedColumn
      v-if="!hideColumns"
      :field="REQUEST_COLUMNS_TO_KEYS.status"
      header="Status"
      sortable
    >
      <template #default="{ row }">
        <template v-if="getRequestStatus(row) === 'pending'">
          <span class="text-pending">(pending)</span>
        </template>
        <template v-else-if="getRequestStatus(row) === 'cancelled'"> (cancelled) </template>
        <template v-else-if="row.status >= HTTP_STATUS_SUCCESS_THRESHOLD">
          (http:{{ row.status }})
        </template>
        <template v-else-if="row.corsError"> (CORS error) </template>
        <template v-else-if="unref(row.errors) > 0"> {{ row.errors }} errors </template>
        <template v-else> ok </template>
      </template>
    </SharedColumn>

    <SharedColumn
      v-if="!hideColumns"
      :field="REQUEST_COLUMNS_TO_KEYS.operation"
      header="Type"
      sortable
    />

    <SharedColumn v-if="!hideColumns" :field="REQUEST_COLUMNS_TO_KEYS.size" header="Size" sortable>
      <template #default="{ row }">
        <template v-if="getRequestStatus(row) === 'pending'">
          <span class="text-pending">(pending)</span>
        </template>
        <template v-else-if="getRequestStatus(row) === 'cancelled'"> — </template>
        <template v-else>
          {{ formatBytes(unref(row.size)) }}
        </template>
      </template>
    </SharedColumn>

    <SharedColumn v-if="!hideColumns" :field="REQUEST_COLUMNS_TO_KEYS.time" header="Time" sortable>
      <template #default="{ row }">
        <template v-if="getRequestStatus(row) === 'pending'">
          <span class="text-pending"> Pending </span>
        </template>
        <template v-else-if="getRequestStatus(row) === 'cancelled'"> (cancelled) </template>
        <template v-else-if="times[row.id] === undefined">
          <span class="text-pending"> Pending </span>
        </template>
        <template v-else>
          {{ formatTime(times[row.id]!, times[row.id]! >= 1000 ? 2 : 0) }}
        </template>
      </template>
    </SharedColumn>

    <SharedColumn
      v-if="!hideColumns"
      :field="REQUEST_COLUMNS_TO_KEYS.waterfall"
      header="Waterfall"
      sortable
    >
      <template #default="{ row }">
        <template
          v-if="getRequestStatus(row) === 'pending' || getRequestStatus(row) === 'cancelled'"
        />
        <template v-else>
          <RequestTableRowWaterfall :request="row" />
        </template>
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
