<script setup lang="ts">
import type { Message } from '@/types/graphql-request'
import { computed } from 'vue'
import RequestObjectViewer from '../request-detail-payload/request-object-viewer.vue'

const props = defineProps<{
  selected?: Message
}>()

const object = computed(() =>
  props.selected ? JSON.parse(props.selected.data || '{}') : undefined,
)
</script>

<template>
  <div class="py-2 border-t border-on-base-disabled">
    <RequestObjectViewer v-if="object" :object />

    <div v-else class="grid place-items-center h-full">
      <div class="flex flex-col gap-1.5 items-center">
        <p class="text-sm font-semibold">No message selected</p>
        <p>Select message to browse its content</p>
      </div>
    </div>
  </div>
</template>
