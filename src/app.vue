<script setup lang="ts">
import AppAside from '@/components/app-aside.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeader from '@/components/app-header.vue'
import AppMain from '@/components/app-main.vue'
import { useNetworkStore } from '@/stores/network'
import { storeToRefs } from 'pinia'
// import AppWaterfall from './components/app-waterfall.vue'
import { useEventBus } from '@vueuse/core'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { MAIN_SPLITTER_RESIZE_EVENT } from './constants/events'
import { MAIN_SPLITTER_ID } from './constants/splitters'
import { useRequestDetailStore } from './stores/request-detail'

const networkStore = useNetworkStore()
const { requests } = storeToRefs(networkStore)

const requestDetailStore = useRequestDetailStore()
const { requestDetail: selectedRequest } = storeToRefs(requestDetailStore)

const bus = useEventBus(MAIN_SPLITTER_RESIZE_EVENT)

const emitSplitterResize = () => bus.emit()
</script>

<template>
  <div class="h-full bg-base-color text-on-base flex flex-col text-xs">
    <AppHeader />

    <!-- <AppWaterfall /> -->

    <SplitterGroup
      :id="MAIN_SPLITTER_ID"
      direction="horizontal"
      :autoSaveId="MAIN_SPLITTER_ID"
      class="flex-1 min-h-0"
    >
      <SplitterPanel sizeUnit="px" :minSize="50" class="flex flex-col min-h-0 h-full">
        <AppMain class="flex-1" :requests />

        <AppFooter :requests />
      </SplitterPanel>

      <SplitterResizeHandle v-if="selectedRequest" />

      <SplitterPanel v-if="selectedRequest" @resize="emitSplitterResize" :minSize="5">
        <AppAside class="flex-1" />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
