<script setup lang="ts">
import FilterSearchInput from './app-header-filter-subheader/filter-search-input.vue'
import FilterTypeList from './app-header-filter-subheader/filter-type-list.vue'
import InvertFilterCheckbox from './app-header-filter-subheader/invert-filter-checkbox.vue'
import SharedHorizontalDivider from '@/components/shared/shared-horizontal-divider.vue'
</script>

<template>
  <div
    class="flex items-center px-2 py-1 gap-1 border-b border-on-base-disabled bg-on-base-subtle text-on-base-icon"
  >
    <FilterSearchInput />

    <InvertFilterCheckbox />

    <SharedHorizontalDivider class="h-3.5!" />

    <FilterTypeList />
  </div>
</template>
