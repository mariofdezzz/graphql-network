<script setup lang="ts">
import AppAside from '@/components/app-aside.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeader from '@/components/app-header.vue'
import AppMain from '@/components/app-main.vue'
import WaterfallTimeline from '@/components/app-main/waterfall-timeline.vue'
import { useNetworkStore } from '@/stores/network'
import { storeToRefs } from 'pinia'

const networkStore = useNetworkStore()
const { requests, selectedRequest } = storeToRefs(networkStore)
</script>

<template>
  <div class="h-full bg-base-color text-on-base flex flex-col text-xs">
    <AppHeader />

    <WaterfallTimeline />

    <div class="flex-1 flex min-h-0">
      <div class="flex flex-col" :class="[selectedRequest ? 'flex-[0_0_300px]' : 'flex-1']">
        <AppMain class="flex-1" :requests />

        <AppFooter :requests />
      </div>

      <AppAside class="flex-2" />
    </div>
  </div>
</template>
