<script setup lang="ts">
import SharedHorizontalDivider from '@/components/shared/shared-horizontal-divider.vue'
import { useNetworkStore } from '@/stores/network'
import { computed, reactive, watch } from 'vue'
import FilterTypeButton from './filter-type-list/filter-type-button.vue'

const networkStore = useNetworkStore()

const types = reactive<string[]>([])

const fetchSelected = computed(() =>
  ['query', 'mutation', 'subscription'].every((type) => types.includes(type)),
)

function handleSelect(type: string, event: PointerEvent) {
  if (event.metaKey || event.ctrlKey) {
    types.push(type)
  } else {
    types.splice(0, types.length, type)
  }
}

watch(
  () => types,
  (newTypes) => {
    networkStore.typeFilters = newTypes
  },
  { deep: true },
)
</script>

<template>
  <div class="flex gap-1 items-center">
    <FilterTypeButton :selected="types.length === 0" @select="types.splice(0, types.length)">
      All
    </FilterTypeButton>

    <FilterTypeButton
      :selected="fetchSelected"
      @select="types.splice(0, types.length, 'query', 'mutation', 'subscription')"
    >
      Fetch
    </FilterTypeButton>

    <SharedHorizontalDivider class="h-3.5!" />

    <FilterTypeButton
      :selected="types.includes('query') && !fetchSelected"
      @select="handleSelect('query', $event)"
    >
      Query
    </FilterTypeButton>

    <FilterTypeButton
      :selected="types.includes('mutation') && !fetchSelected"
      @select="handleSelect('mutation', $event)"
    >
      Mutation
    </FilterTypeButton>

    <FilterTypeButton
      :selected="types.includes('subscription') && !fetchSelected"
      @select="handleSelect('subscription', $event)"
    >
      Subscription
    </FilterTypeButton>
  </div>
</template>
