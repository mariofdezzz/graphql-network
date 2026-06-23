<script setup lang="ts">
import type { GraphQLSubscriptionRequest } from '@/types/graphql-request'
import type { SSEMessage } from '@/types/sse-network-event'
import { ref } from 'vue'
import RequestDetailEventStreamTable from './request-detail-event-stream/request-detail-event-stream-table.vue'
import RequestDetailEventStreamViewer from './request-detail-event-stream/request-detail-event-stream-viewer.vue'

defineProps<{
  request: GraphQLSubscriptionRequest
}>()

const selected = ref<SSEMessage>()
</script>

<template>
  <div class="h-full grid grid-rows-[1fr_200px]">
    <RequestDetailEventStreamTable
      v-model="selected"
      :messages="request.messages as SSEMessage[]"
    />

    <RequestDetailEventStreamViewer :selected />
  </div>
</template>
