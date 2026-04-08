<script setup lang="ts">
import AppAside from '@/components/app-aside.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeader from '@/components/app-header.vue'
import AppMain from '@/components/app-main.vue'
import { useNetworkStore } from '@/stores/network'
import { storeToRefs } from 'pinia'
// import AppWaterfall from './components/app-waterfall.vue'
import SharedSplitterPanel from './components/shared/splitter/shared-splitter-panel.vue'
import SharedSplitter from './components/shared/splitter/shared-splitter.vue'
import { useRequestDetailStore } from './stores/request-detail'

const networkStore = useNetworkStore()
const { requests } = storeToRefs(networkStore)

const requestDetailStore = useRequestDetailStore()
const { requestDetail: selectedRequest } = storeToRefs(requestDetailStore)
</script>

<template>
  <div class="h-full bg-base-color text-on-base flex flex-col text-xs">
    <AppHeader />

    <!-- <AppWaterfall /> -->

    <SharedSplitter class="flex-1 min-h-0" storageKey="aside">
      <SharedSplitterPanel class="flex flex-col min-h-0" unit="px">
        <AppMain class="flex-1" :requests />

        <AppFooter :requests />
      </SharedSplitterPanel>

      <SharedSplitterPanel v-if="selectedRequest">
        <AppAside />
      </SharedSplitterPanel>
    </SharedSplitter>
  </div>
</template>
