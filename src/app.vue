<script setup lang="ts">
import AppAside from '@/components/app-aside.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeader from '@/components/app-header.vue'
import AppMain from '@/components/app-main.vue'
import { useGraphqlNetwork } from '@/composables/use-graphql-network'
import { useRequestDetailStore } from '@/stores/request-detail'
import { storeToRefs } from 'pinia'

const requestDetailStore = useRequestDetailStore()
const { requestDetail } = storeToRefs(requestDetailStore)

const { requests, recording, clearRequests } = useGraphqlNetwork()

// const mainWidth
</script>

<template>
  <div class="h-full bg-base text-on-base flex flex-col text-xs">
    <AppHeader v-model:recording="recording" @clear="clearRequests" />

    <!-- <WaterfallTimeline :requests /> -->

    <div class="flex-1 flex">
      <div class="flex flex-col" :class="[requestDetail ? 'flex-[0_0_300px]' : 'flex-1']">
        <AppMain class="flex-1" :requests />

        <AppFooter :requests />
      </div>

      <AppAside class="flex-1" :requestDetail />
    </div>
  </div>
</template>
