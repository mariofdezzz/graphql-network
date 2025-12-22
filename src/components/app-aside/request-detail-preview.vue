<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed } from 'vue'
import RequestObjectViewer from './request-detail-payload/request-object-viewer.vue'

const props = defineProps<{
  request: GraphQLRequest
}>()

const response = computed<{
  query?: string
  variables?: Record<string, any>
  extensions?: Record<string, any>
}>(() => {
  try {
    return JSON.parse(props.request.response)
  } catch {
    return {}
  }
})
</script>

<template>
  <div class="py-2">
    <RequestObjectViewer :object="response" />
  </div>
</template>
