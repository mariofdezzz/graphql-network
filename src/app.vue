<script setup lang="ts">
import AppAside from '@/components/app-aside.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeader from '@/components/app-header.vue'
import AppMain from '@/components/app-main.vue'
import { useRequestStore } from '@/stores/request'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const requestStore = useRequestStore()
const { requests, selectedRequest, recording } = storeToRefs(requestStore)

const timelineStartAt = computed(() => {
  return new Date(
    requests.value
      .map((req) => new Date(req.timings.startedAt).getTime() - req.timings.wait)
      .reduce(
        (current, startedAt) => (startedAt < current ? startedAt : current),
        new Date().getTime(),
      ),
  )
})

function clearRequestsEffect() {
  requestStore.clearRequests()
  selectedRequest.value = undefined
}
</script>

<template>
  <div class="h-full bg-base text-on-base flex flex-col text-xs">
    <AppHeader v-model:recording="recording" @clear="clearRequestsEffect" />

    <!-- <WaterfallTimeline :requests /> -->

    <div class="flex-1 flex min-h-0">
      <div class="flex flex-col" :class="[selectedRequest ? 'flex-[0_0_300px]' : 'flex-1']">
        <AppMain class="flex-1" :requests :timelineStartAt />

        <AppFooter :requests />
      </div>

      <AppAside class="flex-1" :timelineStartAt />
    </div>
  </div>
</template>
