<script setup lang="ts">
import type { Column } from '@/types/components/shared/table/column'
import type { Message } from '@/types/websocket-network-event'
import { ref } from 'vue'
import RequestDetailMessagesTableColumn from './request-detail-messages-table-column.vue'
import RequestDetailMessagesTableRow from './request-detail-messages-table-row.vue'

defineProps<{
  messages: Message[]
}>()

const selectedRow = ref<number>()

const columns: Column[] = [
  {
    title: 'Data',
    key: 'data',
  },
  {
    title: 'Length',
    key: 'length',
  },
  {
    title: 'Time',
    key: 'timestamp',
  },
]
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- header -->
    <div class="grid gap-px bg-on-base-disabled *:bg-table-base grid-cols-[1fr_100px_200px]">
      <RequestDetailMessagesTableColumn :columns />
    </div>

    <!-- rows -->
    <RequestDetailMessagesTableRow
      v-for="(row, index) in messages"
      :key="index"
      :row
      :columns
      :selected="selectedRow === index"
      class="*:bg-table-base"
      @click="selectedRow = index"
    />

    <!-- empty space -->
    <div class="flex-1 grid gap-px bg-on-base-disabled *:bg-base-color grid-cols-[1fr_100px_200px]">
      <div v-for="(column, index) in columns" :key="index" class="first:pl-px last:pr-px"></div>
    </div>
  </div>
</template>
