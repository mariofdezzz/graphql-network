<script setup lang="ts">
import { useRequestDetailStore } from '@/stores/request-detail'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import RequestDetailTabs from './app-aside/request-detail-tabs.vue'
import { ref } from 'vue'
import RequestDetailHeaders from './app-aside/request-detail-headers.vue'
import RequestDetailPayload from './app-aside/request-detail-payload.vue'
import RequestDetailResponse from './app-aside/request-detail-response.vue'
import RequestDetailTiming from './app-aside/request-detail-timing.vue'
import RequestDetailInitiator from './app-aside/request-detail-initiator.vue'
import RequestDetailPreview from './app-aside/request-detail-preview.vue'

defineProps<{
  timelineStartAt: Date
}>()

const requestDetailStore = useRequestDetailStore()
const { requestDetail } = storeToRefs(requestDetailStore)

const selectedTab = ref('Headers')

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeDetail()
})

function closeDetail() {
  requestDetail.value = undefined
}
</script>

<template>
  <aside
    v-if="requestDetail"
    class="border-l border-on-base-disabled flex flex-col h-full overflow-x-hidden"
  >
    <div class="flex gap-1 px-2 bg-header-base border-b border-on-base-disabled">
      <button
        class="rounded-full hover:bg-on-detail-header-hover active:bg-on-base-active p-1"
        @click="closeDetail()"
        aria-label="Close request detail"
      >
        <Icon icon="material-symbols:close" class="h-4 w-4" />
      </button>

      <RequestDetailTabs v-model="selectedTab" :request="requestDetail" />
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
      <RequestDetailHeaders v-if="selectedTab === 'Headers'" :request="requestDetail" />

      <RequestDetailPayload v-else-if="selectedTab === 'Payload'" :request="requestDetail" />

      <RequestDetailPreview v-else-if="selectedTab === 'Preview'" :request="requestDetail" />

      <RequestDetailResponse v-else-if="selectedTab === 'Response'" :request="requestDetail" />

      <RequestDetailInitiator v-else-if="selectedTab === 'Initiator'" :request="requestDetail" />

      <RequestDetailTiming
        v-else-if="selectedTab === 'Timing'"
        :request="requestDetail"
        :timelineStartAt
      />
    </div>
  </aside>
</template>
