<script setup lang="ts">
import SharedHorizontalDivider from '@/components/shared/shared-horizontal-divider.vue'
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'
import AppHeaderClear from './app-header/app-header-clear.vue'
import AppHeaderFilterSubheader from './app-header/app-header-filter-subheader.vue'
import AppHeaderFilter from './app-header/app-header-filter.vue'
import AppHeaderPreserveLog from './app-header/app-header-preserve-log.vue'
import AppHeaderRecord from './app-header/app-header-record.vue'

const recording = defineModel('recording', { type: Boolean })

defineEmits<{
  (e: 'clear', value: void): void
}>()

const filterActive = useLocalStorage('filterActive', false)
const preserveLog = ref(false)
</script>

<template>
  <header>
    <div class="flex gap-0.5 items-center px-1 border-b border-on-base-disabled text-on-base-icon">
      <div class="flex gap-1 items-center">
        <AppHeaderRecord v-model:recording="recording" />

        <AppHeaderClear @clear="$emit('clear')" />
      </div>

      <SharedHorizontalDivider />

      <div class="flex gap-1 items-center">
        <AppHeaderFilter v-model:filterActive="filterActive" />
      </div>

      <SharedHorizontalDivider />

      <AppHeaderPreserveLog v-model:preserveLog="preserveLog" />
    </div>

    <AppHeaderFilterSubheader v-if="filterActive" />
  </header>
</template>
