<script setup lang="ts">
import SharedHorizontalDivider from '@/components/shared/shared-horizontal-divider.vue'
import { formatBytes } from '@/logic/contexts/size/format-bytes'
import { useNetworkStore } from '@/stores/network'
import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'

const networkStore = useNetworkStore()
const { requests, allRequests } = storeToRefs(networkStore)

const filteredTransferred = computed(() => {
  const accumulated = requests.value.reduce((acc, col) => {
    return acc + (unref(col.size) ?? 0)
  }, 0)

  return formatBytes(accumulated)
})

const totalTransferred = computed(() => {
  const accumulated = allRequests.value.reduce((acc, col) => {
    return acc + (unref(col.size) ?? 0)
  }, 0)

  return formatBytes(accumulated)
})

const hasActiveFilters = computed(() => {
  return requests.value.length !== allRequests.value.length
})
</script>

<template>
  <footer
    class="w-full min-w-0 box-border px-2 py-1 border-t border-on-base-disabled overflow-hidden whitespace-nowrap"
  >
    <div v-if="allRequests.length > 0" class="flex gap-2">
      <span v-if="hasActiveFilters">
        {{ requests.length }} / {{ allRequests.length }} requests
      </span>
      <span v-else>{{ allRequests.length }} requests</span>

      <SharedHorizontalDivider />

      <span v-if="hasActiveFilters">
        {{ filteredTransferred }} / {{ totalTransferred }} transferred
      </span>
      <span v-else> {{ totalTransferred }} transferred </span>
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
