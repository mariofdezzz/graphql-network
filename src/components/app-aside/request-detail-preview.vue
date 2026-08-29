<script setup lang="ts">
import type { GraphQLNetworkRequest } from '@/types/graphql-request'
import RequestDetailFallbackTab from './request-detail-fallback-tab.vue'
import RequestObjectViewer from './request-detail-payload/request-object-viewer.vue'

defineProps<{
  request: GraphQLNetworkRequest
}>()
</script>

<template>
  <div v-if="request.response" class="py-2">
    <RequestObjectViewer :object="request.response" />
  </div>

  <RequestDetailFallbackTab v-else> {{ $t('preview.failedToLoad') }} </RequestDetailFallbackTab>
</template>
