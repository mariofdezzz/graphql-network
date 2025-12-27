<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import RequestObjectViewer from './request-detail-payload/request-object-viewer.vue'

defineProps<{
  request: GraphQLRequest
}>()
</script>

<template>
  <div class="py-2">
    <RequestObjectViewer :object="request.response" />
  </div>
</template>
