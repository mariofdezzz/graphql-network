<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import RequestObjectViewer from './request-detail-payload/request-object-viewer.vue'
import RequestDetailFallbackTab from './request-detail-fallback-tab.vue'

defineProps<{
  request: GraphQLRequest
}>()
</script>

<template>
  <div v-if="request.response" class="py-2">
    <RequestObjectViewer :object="request.response" />
  </div>

  <RequestDetailFallbackTab v-else> Failed to load response data </RequestDetailFallbackTab>
</template>
