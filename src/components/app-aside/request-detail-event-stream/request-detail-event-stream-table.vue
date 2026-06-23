<script setup lang="ts">
import type { Column } from '@/types/components/shared/table/column'
import type { SSEMessage } from '@/types/sse-network-event'
import { computed } from 'vue'
import RequestDetailEventStreamTableRow from './request-detail-event-stream-table-row.vue'

const selected = defineModel<SSEMessage>()

const props = defineProps<{
  messages: SSEMessage[]
}>()

const selectedRow = computed({
  // eslint-disable-next-line vue/return-in-computed-property
  get() {
    const index = props.messages.indexOf(selected.value!)

    if (index > -1) return index
  },
  set(value: number) {
    selected.value = props.messages[value]
  },
})

const columns: Column[] = [
  {
    field: 'eventId',
    header: 'Id',
  },
  {
    field: 'eventName',
    header: 'Type',
  },
  {
    field: 'data',
    header: 'Data',
  },
  {
    field: 'time',
    header: 'Time',
  },
]
</script>

<template>
  <div class="h-full flex flex-col min-h-0">
    <!-- header -->
    <div class="grid gap-px bg-on-base-disabled *:bg-table-base grid-cols-[80px_100px_1fr_200px]">
      <div
        v-for="column in columns"
        :key="column.field"
        class="px-1 py-0.5 first:pl-[5px] last:pr-[5px] text-xs font-semibold border-b border-on-base-disabled"
      >
        {{ column.header }}
      </div>
    </div>

    <!-- rows -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <RequestDetailEventStreamTableRow
        v-for="(row, index) in messages"
        :key="index"
        :row
        :columns
        :selected="selectedRow === index"
        @click="selectedRow = index"
      />
    </div>
  </div>
</template>
