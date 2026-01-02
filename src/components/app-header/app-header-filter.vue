<script setup lang="ts">
import { useNetworkStore } from '@/stores/network'
import { computed } from 'vue'
import FilterEmptyIcon from '@/components/icons/filter-empty-icon.vue'
import FilterIcon from '@/components/icons/filter-icon.vue'

const filterActive = defineModel('filterActive', { type: Boolean })

const networkStore = useNetworkStore()

const hasFilter = computed(() => {
  return (
    networkStore.nameFilter.length > 0 ||
    networkStore.invertNameFilter ||
    networkStore.typeFilters.length > 0
  )
})
</script>

<template>
  <button
    title="Filter"
    class="rounded-full hover:bg-on-base-hover active:bg-on-base-active p-1 relative"
    :class="[hasFilter || filterActive ? 'text-primary' : '']"
    @click="filterActive = !filterActive"
  >
    <FilterIcon v-if="filterActive" class="h-4 w-4" />

    <FilterEmptyIcon v-else class="h-4 w-4" />

    <span v-if="hasFilter" class="absolute bottom-1 right-0.5 h-1 w-1 rounded-full bg-primary" />
  </button>
</template>
