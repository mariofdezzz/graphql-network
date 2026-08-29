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
        {{ requests.length }} / {{ allRequests.length }} {{ $t('footer.requests') }}
      </span>
      <span v-else>{{ allRequests.length }} {{ $t('footer.requests') }}</span>

      <SharedHorizontalDivider />

      <span v-if="hasActiveFilters">
        {{ filteredTransferred }} / {{ totalTransferred }} {{ $t('footer.transferred') }}
      </span>
      <span v-else> {{ totalTransferred }} {{ $t('footer.transferred') }} </span>
    </div>

    <div v-else class="grid place-items-center text-center gap-2 py-20">
      <p class="font-bold text-sm">{{ $t('footer.currentlyRecording') }}</p>

      <p class="max-w-60 whitespace-normal">
        {{ $t('footer.performRequest') }}
        <a
          href="https://developer.chrome.com/docs/devtools/network"
          class="text-blue-600 dark:text-blue-200 underline"
        >
          {{ $t('footer.learnMore') }}
        </a>
      </p>
    </div>
  </footer>
</template>
