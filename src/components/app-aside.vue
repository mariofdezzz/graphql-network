<script setup lang="ts">
import CloseIcon from '@/components/icons/close-icon.vue'
import { useRequestDetailStore } from '@/stores/request-detail'
import type { GraphQLNetworkRequest } from '@/types/graphql-request'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import RequestDetailHeaders from './app-aside/request-detail-headers.vue'
import RequestDetailInitiator from './app-aside/request-detail-initiator.vue'
import RequestDetailPayload from './app-aside/request-detail-payload.vue'
import RequestDetailPreview from './app-aside/request-detail-preview.vue'
import RequestDetailResponse from './app-aside/request-detail-response.vue'
import RequestDetailTabs from './app-aside/request-detail-tabs.vue'
import RequestDetailTiming from './app-aside/request-detail-timing.vue'

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
        <CloseIcon class="h-4 w-4" />
      </button>

      <RequestDetailTabs v-model="selectedTab" :request="requestDetail" />
    </div>

    <div
      v-show="selectedTab === 'Headers'"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    >
      <RequestDetailHeaders :request="requestDetail" />
    </div>

    <div
      v-show="selectedTab === 'Payload'"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    >
      <RequestDetailPayload
        :request="requestDetail as GraphQLNetworkRequest"
        :enabled="selectedTab === 'Payload'"
      />
    </div>

    <div
      v-show="selectedTab === 'Preview'"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    >
      <RequestDetailPreview :request="requestDetail as GraphQLNetworkRequest" />
    </div>

    <div
      v-show="selectedTab === 'Response'"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    >
      <RequestDetailResponse
        :request="requestDetail as GraphQLNetworkRequest"
        :enabled="selectedTab === 'Response'"
      />
    </div>

    <div
      v-show="selectedTab === 'Initiator'"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    >
      <RequestDetailInitiator v-show="selectedTab === 'Initiator'" :request="requestDetail" />
    </div>

    <div v-show="selectedTab === 'Timing'" class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
      <RequestDetailTiming
        v-show="selectedTab === 'Timing'"
        :request="requestDetail as GraphQLNetworkRequest"
      />
    </div>
  </aside>
</template>
