<script setup lang="ts">
import { useNetworkStore } from '@/stores/network'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'

const networkStore = useNetworkStore()

const { nameFilter } = storeToRefs(networkStore)
</script>

<template>
  <div class="flex-1 max-w-1/4 relative">
    <Icon icon="material-symbols:filter-alt-outline" class="h-3 w-3 absolute left-1 top-0.5" />

    <input
      v-model="nameFilter"
      type="text"
      placeholder="Filter"
      class="w-full bg-header-base rounded-full px-5"
      id="name-filter"
      name="name-filter"
    />

    <Icon
      v-if="nameFilter"
      icon="mdi:close-circle"
      class="h-3 w-3 absolute right-1 top-0.5"
      @click="nameFilter = ''"
    />
  </div>
</template>
