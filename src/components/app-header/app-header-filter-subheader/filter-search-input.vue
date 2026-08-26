<script setup lang="ts">
import CancelIcon from '@/components/icons/cancel-icon.vue'
import FilterEmptyIcon from '@/components/icons/filter-empty-icon.vue'
import { useNetworkStore } from '@/stores/network'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useTemplateRef } from 'vue'

const networkStore = useNetworkStore()

const { nameFilter } = storeToRefs(networkStore)

const input = useTemplateRef('input')

useEventListener('message', (event) => {
  if (event.data?.type === 'PANEL_SHOWN') {
    input.value?.focus()
  }
})

function clearFilter() {
  nameFilter.value = ''
  input.value?.focus()
}
</script>

<template>
  <div class="flex-1 max-w-1/4 relative">
    <FilterEmptyIcon class="h-3.5 w-3.5 absolute left-1.5 top-0.75" />

    <input
      ref="input"
      v-model="nameFilter"
      type="text"
      placeholder="Filter"
      class="w-full bg-header-base rounded-full px-6.5 h-5"
      id="name-filter"
      name="name-filter"
    />

    <button
      v-if="nameFilter"
      class="h-4.5 w-4.5 m-px grid place-items-center rounded-full hover:bg-on-header-base-hover active:bg-on-header-base-active absolute top-0 right-1.5"
      @click="clearFilter()"
    >
      <CancelIcon class="h-4 w-4" />
    </button>
  </div>
</template>
