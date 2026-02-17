<script setup lang="ts">
import type { GraphQLSubscriptionRequest } from '@/types/graphql-request'
import RequestDetailMessagesTable from './request-detail-messages/request-detail-messages-table.vue'

defineProps<{
  request: GraphQLSubscriptionRequest
}>()
</script>

<template>
  <div class="h-full">
    <RequestDetailMessagesTable :messages="request.messages" />
  </div>
</template>
