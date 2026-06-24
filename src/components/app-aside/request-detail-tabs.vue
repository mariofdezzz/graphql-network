<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, watch } from 'vue'

const selected = defineModel<string>()

const props = defineProps<{
  request: GraphQLRequest
}>()

const tabs = computed(() =>
  [
    'Headers',
    'payload' in props.request && props.request.payload ? 'Payload' : null,
    props.request.operation !== 'subscription' ? 'Preview' : null,
    props.request.operation === 'subscription' && props.request.transport === 'websocket'
      ? 'Messages'
      : null,
    props.request.operation === 'subscription' && props.request.transport === 'sse'
      ? 'EventStream'
      : null,
    props.request.operation !== 'subscription' ||
    (props.request.operation === 'subscription' && props.request.transport === 'sse')
      ? 'Response'
      : null,
    'Initiator',
    props.request.operation !== 'subscription'
      ? 'Timing' // FIXME: show timing on websocket requests
      : null,
    // 'Cookies' // TODO
  ].filter((tab): tab is string => tab !== null),
)

watch(
  () => props.request,
  () => {
    if (tabs.value.indexOf(selected.value!) === -1) {
      selected.value = tabs.value[0]
    }
  },
)
</script>

<template>
  <div class="flex-1 flex items-stretch font-medium relative" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab"
      class="px-2 text-on-detail-header hover:bg-on-detail-header-hover flex items-center border-b border-transparent"
      :class="{ 'text-on-detail-header-active border-on-detail-header-active!': selected === tab }"
      role="tab"
      :aria-selected="selected === tab"
      @click="selected = tab"
    >
      {{ tab }}
    </button>
  </div>
</template>
