<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed } from 'vue'

const selected = defineModel<string>()

const props = defineProps<{
  request: GraphQLRequest
}>()

const tabs = computed(() =>
  [
    'Headers',
    'Payload',
    // 'Preview',
    'Response',
    props.request.initiator ? 'Initiator' : null,
    // 'Initiator',
    'Timing',
    // 'Cookies' // TODO
  ].filter((tab): tab is string => tab !== null),
)
</script>

<template>
  <div class="flex-1 flex items-stretch font-medium relative" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab"
      class="px-2 hover:bg-on-base-hover flex items-center border-b border-transparent"
      :class="{ 'text-on-header-active border-on-header-active!': selected === tab }"
      role="tab"
      :aria-selected="selected === tab"
      @click="selected = tab"
    >
      {{ tab }}
    </button>
  </div>
</template>
