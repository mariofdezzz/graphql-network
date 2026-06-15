<script setup lang="ts">
import type { GraphQLSubscriptionRequest, Message } from '@/types/graphql-request'
import { ref } from 'vue'
import RequestDetailMessagesTable from './request-detail-messages/request-detail-messages-table.vue'
import RequestDetailMessagesViewer from './request-detail-messages/request-detail-messages-viewer.vue'

defineProps<{
  request: GraphQLSubscriptionRequest
}>()

const selected = ref<Message>()
</script>

<template>
  <div class="h-full grid grid-rows-[1fr_200px]">
    <RequestDetailMessagesTable v-model="selected" :messages="request.messages" />

    <RequestDetailMessagesViewer :selected />
  </div>
</template>
