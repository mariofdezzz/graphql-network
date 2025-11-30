<script setup lang="ts">
import { Icon } from '@iconify/vue'

const filterActive = defineModel('filterActive', { type: Boolean })
</script>

<template>
  <button
    title="Filter"
    class="rounded-full hover:bg-on-base-hover active:bg-on-base-active p-1"
    @click="filterActive = !filterActive"
  >
    <Icon v-if="filterActive" icon="material-symbols:filter-alt" class="h-4 w-4" />

    <Icon v-else icon="material-symbols:filter-alt-outline" class="h-4 w-4" />
  </button>
</template>
