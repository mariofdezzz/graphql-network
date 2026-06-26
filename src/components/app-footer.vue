<script setup lang="ts">
import SharedHorizontalDivider from '@/components/shared/shared-horizontal-divider.vue'
import { formatBytes } from '@/logic/contexts/size/format-bytes'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed, unref } from 'vue'

const props = defineProps<{
  requests: GraphQLRequest[]
}>()

const transferred = computed(() => {
  const accumulated = props.requests.reduce((acc, col) => {
    return acc + (unref(col.size) ?? 0)
  }, 0)

  return formatBytes(accumulated)
})
</script>

<template>
  <footer
    class="w-full min-w-0 box-border px-2 py-1 border-t border-on-base-disabled overflow-hidden whitespace-nowrap"
  >
    <div v-if="requests.length > 0" class="flex gap-2">
      <span>{{ requests.length }} requests</span>

      <SharedHorizontalDivider />

      <span> {{ transferred }} transferred </span>
    </div>

    <div v-else class="grid place-items-center text-center gap-2 py-20">
      <p class="font-bold text-sm">Currently recording network activity</p>

      <p class="max-w-60 whitespace-normal">
        Perform a request or reload the page by using the "Reload page" button or by pressing ⌘ R.
        <a
          href="https://developer.chrome.com/docs/devtools/network"
          class="text-blue-600 dark:text-blue-200 underline"
        >
          Learn more
        </a>
      </p>
    </div>
  </footer>
</template>
