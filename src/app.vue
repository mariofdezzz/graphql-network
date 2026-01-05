<script setup lang="ts">
import AppAside from '@/components/app-aside.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeader from '@/components/app-header.vue'
import AppMain from '@/components/app-main.vue'
import { useNetworkStore } from '@/stores/network'
import { storeToRefs } from 'pinia'
// import AppWaterfall from './components/app-waterfall.vue'
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

    <div class="flex-1 flex min-h-0">
      <div class="flex flex-col" :class="[selectedRequest ? 'flex-[0_0_300px]' : 'flex-1']">
        <AppMain class="flex-1" :requests />

        <AppFooter :requests />
      </div>

      <AppAside class="flex-1" />
    </div>
  </div>
</template>
