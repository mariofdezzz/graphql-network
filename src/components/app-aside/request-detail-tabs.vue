<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const selected = defineModel<string>()

const props = defineProps<{
  request: GraphQLRequest
}>()

const tabs = computed(() =>
  [
    'headers',
    'payload' in props.request && props.request.payload ? 'payload' : null,
    props.request.operation !== 'subscription' ? 'preview' : null,
    props.request.operation === 'subscription' && props.request.transport === 'websocket'
      ? 'messages'
      : null,
    props.request.operation === 'subscription' && props.request.transport === 'sse'
      ? 'event-stream'
      : null,
    props.request.operation !== 'subscription' ||
    (props.request.operation === 'subscription' && props.request.transport === 'sse')
      ? 'response'
      : null,
    'initiator',
    'timing', // Now showing timing for all requests including websocket subscriptions
    // 'Cookies' // TODO
  ]
    .filter((tab): tab is string => tab !== null)
    .map((key) => ({
      key,
      label: t(`tabs.${key}`),
    })),
)

watch(
  () => props.request,
  () => {
    if (tabs.value.findIndex((tab) => tab.key === selected.value!) === -1) {
      selected.value = tabs.value[0]?.key
    }
  },
)
</script>

<template>
  <div class="flex-1 flex items-stretch font-medium relative" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="px-2 text-on-detail-header hover:bg-on-detail-header-hover flex items-center border-b border-transparent"
      :class="{
        'text-on-detail-header-active border-on-detail-header-active!': selected === tab.key,
      }"
      role="tab"
      :aria-selected="selected === tab.key"
      @click="selected = tab.key"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
