<script setup lang="ts">
import type { Column } from '@/types/components/shared/table/column'
import type { Message } from '@/types/graphql-request'
import { computed } from 'vue'
import RequestDetailMessagesTableColumn from './request-detail-messages-table-column.vue'
import RequestDetailMessagesTableRow from './request-detail-messages-table-row.vue'

const selected = defineModel<Message>()

const props = defineProps<{
  messages: Message[]
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
    field: 'data',
    header: 'Data',
  },
  {
    field: 'length',
    header: 'Length',
  },
  {
    field: 'time',
    header: 'Time',
  },
]
</script>

<template>
  <div class="h-full min-h-0 grid grid-rows-[auto_1fr]">
    <div class="grid gap-px bg-on-base-disabled *:bg-table-base grid-cols-[1fr_100px_200px]">
      <RequestDetailMessagesTableColumn :columns />
    </div>

    <div class="overflow-auto min-h-0">
      <RequestDetailMessagesTableRow
        v-for="(row, index) in messages"
        :key="index"
        :row
        :columns
        :selected="selectedRow === index"
        class="*:bg-table-base"
        @click="selectedRow = index"
      />

      <div
        class="flex-1 grid gap-px bg-on-base-disabled *:bg-base-color grid-cols-[1fr_100px_200px]"
      >
        <div v-for="(column, index) in columns" :key="index" class="first:pl-px last:pr-px"></div>
      </div>
    </div>
  </div>
</template>
