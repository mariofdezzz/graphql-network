<script setup lang="ts">
import type { GraphQLSubscriptionRequest } from '@/types/graphql-request'
import type { SSEMessage } from '@/types/sse-network-event'
import { computed, ref } from 'vue'
import SharedColumn from '../shared/table/shared-column.vue'
import SharedTable from '../shared/table/shared-table.vue'
import RequestDetailEventStreamViewer from './request-detail-event-stream/request-detail-event-stream-viewer.vue'

const props = defineProps<{
  request: GraphQLSubscriptionRequest
}>()

const selected = ref<SSEMessage>()

const formatter = new Intl.DateTimeFormat('en', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
})

type SSERow = SSEMessage & { id: string }

const rows = computed<SSERow[]>(() =>
  (props.request.messages as SSEMessage[]).map((msg, index) => ({
    ...msg,
    id: String(index),
  })),
)

function onSelect(row: SSERow) {
  selected.value = row
}
</script>

<template>
  <div class="h-full grid grid-rows-[1fr_200px]">
    <SharedTable
      :rows
      :sort="{ column: 'time', direction: 'asc' }"
      @enter="onSelect"
      @focusChange="onSelect"
    >
      <SharedColumn field="eventId" header="Id" :width="10" sortable @click="onSelect" />
      <SharedColumn field="eventName" header="Type" :width="15" sortable @click="onSelect" />
      <SharedColumn field="data" header="Data" :width="55" sortable @click="onSelect">
        <template #default="{ row }">
          <span class="line-clamp-1">{{ row.data }}</span>
        </template>
      </SharedColumn>
      <SharedColumn field="time" header="Time" :width="20" sortable @click="onSelect">
        <template #default="{ row }">
          {{ formatter.format(row.time) }}
        </template>
      </SharedColumn>
    </SharedTable>

    <RequestDetailEventStreamViewer :selected />
  </div>
</template>
