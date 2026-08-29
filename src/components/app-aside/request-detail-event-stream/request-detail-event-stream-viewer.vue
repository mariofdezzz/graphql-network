<script setup lang="ts">
import type { SSEMessage } from '@/types/sse-network-event'
import { computed } from 'vue'
import RequestObjectViewer from '../request-detail-payload/request-object-viewer.vue'

const props = defineProps<{
  selected?: SSEMessage
}>()

const object = computed(() => {
  if (!props.selected) return undefined

  try {
    return JSON.parse(props.selected.data)
  } catch {
    return undefined
  }
})
</script>

<template>
  <div class="py-2 border-t border-on-base-disabled h-full overflow-y-auto">
    <RequestObjectViewer v-if="object" :object />

    <div v-else-if="selected" class="px-2 text-sm whitespace-pre-wrap break-all">
      {{ selected.data }}
    </div>

    <div v-else class="grid place-items-center h-full">
      <div class="flex flex-col gap-1.5 items-center">
        <p class="text-sm font-semibold">{{ $t('messages.noMessageSelected') }}</p>
        <p>{{ $t('messages.selectMessageToBrowse') }}</p>
      </div>
    </div>
  </div>
</template>
