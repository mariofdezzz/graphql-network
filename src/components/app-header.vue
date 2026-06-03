<script setup lang="ts">
import SharedHorizontalDivider from '@/components/shared/shared-horizontal-divider.vue'
import { useNetworkStore } from '@/stores/network'
import { useLocalStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import AppHeaderClear from './app-header/app-header-clear.vue'
import AppHeaderFilterSubheader from './app-header/app-header-filter-subheader.vue'
import AppHeaderFilter from './app-header/app-header-filter.vue'
import AppHeaderPreserveLog from './app-header/app-header-preserve-log.vue'
import AppHeaderRecord from './app-header/app-header-record.vue'

const networkStore = useNetworkStore()
const { recording } = storeToRefs(networkStore)

const filterActive = useLocalStorage('filterActive', false)
const preserveLog = ref(false)
</script>

<template>
  <header>
    <div class="flex gap-0.5 items-center px-1 border-b border-on-base-disabled text-on-base-icon">
      <div class="flex gap-1 items-center">
        <AppHeaderRecord v-model:recording="recording" />

        <AppHeaderClear @clear="networkStore.clearRequests()" />
      </div>

      <SharedHorizontalDivider />

      <div class="flex gap-1 items-center">
        <AppHeaderFilter v-model:filterActive="filterActive" />
      </div>

      <SharedHorizontalDivider />

      <AppHeaderPreserveLog v-model:preserveLog="preserveLog" />

      <a
        href="https://github.com/mariofdezzz/graphql-network-issues/issues/new?template=bug_report.md"
        target="_blank"
        rel="noopener noreferrer"
        class="p-1 hover:bg-base-hover rounded transition-colors ml-auto"
        title="Report an issue"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M12 19q1.65 0 2.825-1.175T16 15v-4q0-1.65-1.175-2.825T12 7T9.175 8.175T8 11v4q0 1.65 1.175 2.825T12 19m-2-3h4v-2h-4zm0-4h4v-2h-4zm2 9q-1.625 0-3.012-.8T6.8 18H4v-2h2.1q-.075-.5-.088-1T6 14H4v-2h2q0-.5.012-1t.088-1H4V8h2.8q.35-.575.788-1.075T8.6 6.05L7 4.4L8.4 3l2.15 2.15q.7-.225 1.425-.225t1.425.225L15.6 3L17 4.4l-1.65 1.65q.575.375 1.038.862T17.2 8H20v2h-2.1q.075.5.088 1T18 12h2v2h-2q0 .5-.013 1t-.087 1H20v2h-2.8q-.8 1.4-2.187 2.2T12 21"
          />
        </svg>
      </a>
    </div>

    <AppHeaderFilterSubheader v-if="filterActive" />
  </header>
</template>
