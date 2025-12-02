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
  <aside v-if="requestDetail" class="border-l border-on-base-disabled flex flex-col h-full">
    <div class="flex gap-1 px-2 bg-header-base border-b border-on-base-disabled">
      <button
        class="rounded-full hover:bg-on-base-hover active:bg-on-base-active p-1"
        @click="closeDetail()"
        aria-label="Close request detail"
      >
        <Icon icon="material-symbols:close" class="h-4 w-4" />
      </button>

      <RequestDetailTabs v-model="selectedTab" />
    </div>

    <div class="flex-1 min-h-0 overflow-auto">
      <RequestDetailHeaders v-if="selectedTab === 'Headers'" :request="requestDetail" />

      <RequestDetailPayload v-else-if="selectedTab === 'Payload'" :request="requestDetail" />

      <RequestDetailResponse v-else-if="selectedTab === 'Response'" :request="requestDetail" />
    </div>
  </aside>
</template>
