<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import RequestObjectViewer from './request-detail-payload/request-object-viewer.vue'

defineProps<{
  request: GraphQLRequest
}>()
</script>

<template>
  <div v-if="request.response" class="py-2">
    <RequestObjectViewer :object="request.response" />
  </div>

  <div v-else class="h-full grid place-items-center font-medium text-sm">
    <p>Failed to load response data</p>
  </div>
</template>
