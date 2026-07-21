<script setup lang="ts">
import CancelIcon from '@/components/icons/cancel-icon.vue'
import FilterEmptyIcon from '@/components/icons/filter-empty-icon.vue'
import StopIcon from '@/components/icons/stop-icon.vue'
import type { GraphQLSubscriptionRequest, Message } from '@/types/graphql-request'
import { computed, ref } from 'vue'
import RequestDetailMessagesTable from './request-detail-messages/request-detail-messages-table.vue'
import RequestDetailMessagesViewer from './request-detail-messages/request-detail-messages-viewer.vue'

const props = defineProps<{
  request: GraphQLSubscriptionRequest
}>()

const selected = ref<Message>()
const typeFilter = ref<'all' | 'send' | 'receive'>('all')
const regexFilter = ref('')

function clearMessages() {
  // eslint-disable-next-line vue/no-mutating-props
  props.request.messages.splice(0)
  selected.value = undefined
}

const filteredMessages = computed(() => {
  let messages = props.request.messages

  // Filter by type
  if (typeFilter.value === 'send') {
    messages = messages.filter((msg) => msg.method === 'frameSent')
  } else if (typeFilter.value === 'receive') {
    messages = messages.filter((msg) => msg.method === 'frameReceived')
  }

  // Filter by regex
  if (regexFilter.value.trim()) {
    try {
      const regex = new RegExp(regexFilter.value, 'i')
      messages = messages.filter((msg) => regex.test(String(msg.data)))
    } catch {
      return []
    }
  }

  return messages
})
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr_200px]">
    <div class="flex items-center gap-2 border-b border-on-base-disabled border-base px-1 py-0.5">
      <button
        title="Clear all"
        class="rounded-full hover:bg-on-base-hover active:bg-on-base-active p-1"
        @click="clearMessages"
      >
        <StopIcon class="h-4 w-4" />
      </button>

      <!-- Type filter -->
      <select
        v-model="typeFilter"
        class="bg-base-color rounded px-2 py-0.5 text-xs hover:bg-on-base-hover"
        title="Filter by type"
      >
        <option value="all">All</option>
        <option value="send">Send</option>
        <option value="receive">Receive</option>
      </select>

      <!-- Regex filter -->
      <div class="flex-1 max-w-xs relative">
        <FilterEmptyIcon class="h-3.5 w-3.5 absolute left-2 top-0.75" />

        <input
          v-model="regexFilter"
          type="text"
          placeholder="Filter using regex (example: (web)?socket)"
          class="w-full bg-header-base rounded-full px-7 py-0.5 text-xs"
        />

        <CancelIcon
          v-if="regexFilter"
          class="h-3.5 w-3.5 absolute right-2 top-0.75 cursor-pointer"
          @click="regexFilter = ''"
        />
      </div>
    </div>

    <RequestDetailMessagesTable v-model="selected" :messages="filteredMessages" />

    <RequestDetailMessagesViewer :selected />
  </div>
</template>
