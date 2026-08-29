<script setup lang="ts">
import { useTableRows } from '@/composables/components/app-main/use-table-rows.ts'
import { DEFAULT_NETWORK_ORDER } from '@/constants/default-network-order'
import { HTTP_STATUS_SUCCESS_THRESHOLD } from '@/constants/http-status-success-threshold.ts'
import { REQUESTS_TABLE_ID } from '@/constants/tables.ts'
import { useRequestDetailStore } from '@/stores/request-detail'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, toRefs } from 'vue'
import SharedColumn from '../shared/table/shared-column.vue'
import SharedTable from '../shared/table/shared-table.vue'
import RequestTableRowWaterfall from './request-table-row-waterfall.vue'

const props = defineProps<{
  requests: GraphQLRequest[]
}>()

const { requests } = toRefs(props)

const { rows } = useTableRows(requests)

const requestDetailStore = useRequestDetailStore()

const hideColumns = computed(() => Boolean(requestDetailStore.requestDetail))

function focusChange(row: GraphQLRequest) {
  if (requestDetailStore.requestDetail) {
    requestDetailStore.requestDetail = row
  }
}
</script>

<template>
  <SharedTable
    :id="REQUESTS_TABLE_ID"
    :rows
    :sort="DEFAULT_NETWORK_ORDER"
    @enter="requestDetailStore.requestDetail = $event.request"
    @focusChange="focusChange($event.request)"
  >
    <SharedColumn
      field="name"
      :header="$t('table.name')"
      sortable
      @click="requestDetailStore.requestDetail = $event.request"
    >
      <template #default="{ row }">
        <span :class="{ italic: row.operation === 'preflight' }">
          {{ row.name }}
        </span>
      </template>
    </SharedColumn>

    <SharedColumn v-if="!hideColumns" field="status" :header="$t('table.status')" sortable>
      <template #default="{ row }">
        <template v-if="row.status === 'pending'">
          <span class="text-pending">{{ $t('status.pending') }}</span>
        </template>
        <template v-else-if="row.status === 'cancelled'">
          {{ $t('status.cancelled') }}
        </template>
        <template v-else-if="row.httpStatus >= HTTP_STATUS_SUCCESS_THRESHOLD">
          (http:{{ row.httpStatus }})
        </template>
        <template v-else-if="row.corsError"> {{ $t('status.corsError') }} </template>
        <template v-else-if="row.errors > 0"> {{ row.errors }} {{ $t('status.errors') }} </template>
        <template v-else> {{ $t('status.ok') }} </template>
      </template>
    </SharedColumn>

    <SharedColumn v-if="!hideColumns" field="operation" :header="$t('table.type')" sortable />

    <SharedColumn
      v-if="!hideColumns"
      field="size"
      :header="$t('table.size')"
      sortable
      class="text-end"
    >
      <template #default="{ row }">
        <template v-if="row.status === 'pending'">
          <span class="text-pending">{{ $t('status.pending') }}</span>
        </template>
        <template v-else-if="row.status === 'cancelled'"> — </template>
        <template v-else>
          {{ row.size }}
        </template>
      </template>
    </SharedColumn>

    <SharedColumn
      v-if="!hideColumns"
      field="time"
      :header="$t('table.time')"
      sortable
      class="text-end"
    >
      <template #default="{ row }">
        <template v-if="row.status === 'pending'">
          <span class="text-pending"> {{ $t('status.pending') }} </span>
        </template>
        <template v-else-if="row.status === 'cancelled'">
          {{ $t('status.cancelled') }}
        </template>
        <template v-else-if="row.time === undefined">
          <span class="text-pending"> {{ $t('status.pending') }} </span>
        </template>
        <template v-else>
          {{ row.time }}
        </template>
      </template>
    </SharedColumn>

    <SharedColumn
      v-if="!hideColumns"
      field="waterfall"
      :header="$t('table.waterfall')"
      sortable
      sizeUnit="px"
    >
      <template #default="{ row }">
        <template v-if="row.status === 'pending' || row.status === 'cancelled'" />
        <template v-else>
          <RequestTableRowWaterfall :request="row.request" />
        </template>
      </template>
    </SharedColumn>
  </SharedTable>
</template>
