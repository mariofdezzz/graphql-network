<script setup lang="ts">
import type { Column } from '@/types/components/shared/table/column'
import type { Message } from '@/types/websocket-network-event'
import { Icon } from '@iconify/vue'

defineProps<{
  row: Message
  columns: Column[]
  selected: boolean
}>()

const formatter = new Intl.DateTimeFormat('en', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
})
</script>

<template>
  <div
    class="grid grid-cols-[1fr_100px_200px] gap-px bg-on-base-disabled hover:*:bg-on-base-hover! border-b border-on-base-disabled"
    :class="[
      selected ? '*:bg-table-selected-row! hover:*:bg-table-selected-row!' : '',
      row.method === 'frameSent' ? '*:bg-ws-message-sent' : '*:bg-base-color!',
    ]"
  >
    <div
      v-for="(column, index) in columns"
      :key="index"
      class="px-1 py-0.5 select-none first:pl-[5px] last:pr-[5px] overflow-hidden text-ellipsis min-w-0"
      :class="[['length'].includes(column.field) ? 'text-end' : '']"
    >
      <!-- <span v-if="column.key === 'time'" :class="{ 'text-request-timing-header': !time }">
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
      </span>-->

      <div v-if="column.field === 'data'" class="flex line-clamp-1 items-center gap-1">
        <Icon
          :icon="row.method === 'frameSent' ? 'entypo:arrow-up' : 'entypo:arrow-down'"
          class="shrink-0"
          :class="[
            row.method === 'frameSent'
              ? 'text-ws-message-sent-arrow'
              : 'text-ws-message-received-arrow',
          ]"
        />

        <span class="line-clamp-1">
          {{ row.data }}
        </span>
      </div>

      <div v-else-if="column.field === 'time'" class="line-clamp-1">
        {{ formatter.format(row.time) }}
      </div>

      <span v-else class="line-clamp-1">
        <!-- <span v-else> -->
        {{ row[column.field as keyof Message] }}
      </span>
    </div>
  </div>
</template>
