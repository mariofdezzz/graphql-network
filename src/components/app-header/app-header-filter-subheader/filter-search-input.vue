<script setup lang="ts">
import CancelIcon from '@/components/icons/cancel-icon.vue'
import FilterEmptyIcon from '@/components/icons/filter-empty-icon.vue'
import { useNetworkStore } from '@/stores/network'
import { storeToRefs } from 'pinia'

const networkStore = useNetworkStore()

const { nameFilter } = storeToRefs(networkStore)
</script>

<template>
  <div class="flex-1 max-w-1/4 relative">
    <FilterEmptyIcon class="h-3 w-3 absolute left-1 top-0.5" />

    <input
      v-model="nameFilter"
      type="text"
      placeholder="Filter"
      class="w-full bg-header-base rounded-full px-5"
      id="name-filter"
      name="name-filter"
    />

    <CancelIcon
      v-if="nameFilter"
      class="h-3 w-3 absolute right-1 top-0.5"
      @click="nameFilter = ''"
    />
  </div>
</template>
