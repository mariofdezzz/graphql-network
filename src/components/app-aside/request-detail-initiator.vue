<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import RequestDetailFallbackTab from './request-detail-fallback-tab.vue'
import RequestDetailInitiatorStack from './request-detail-initiator/request-detail-initiator-stack.vue'

defineProps<{
  request: GraphQLRequest
}>()
</script>

<template>
  <div v-if="request.initiator?.type === 'script'">
    <details open name="call-stack">
      <summary class="px-4 py-1.5 font-bold cursor-default">
        <span class="px-1">{{ $t('headers.requestCallStack') }}</span>
      </summary>

      <div class="px-12 pb-4">
        <div class="grid grid-cols-[auto_auto_auto] gap-x-2 gap-y-1 w-0">
          <RequestDetailInitiatorStack :stack="request.initiator.stack" />
        </div>
      </div>
    </details>
  </div>

  <RequestDetailFallbackTab v-else> {{ $t('initiator.noData') }} </RequestDetailFallbackTab>
</template>
