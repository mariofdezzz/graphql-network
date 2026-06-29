<script setup lang="ts">
import CloseIcon from '@/components/icons/close-icon.vue'
import { useRequestDetailStore } from '@/stores/request-detail'
import type { GraphQLNetworkRequest, GraphQLSubscriptionRequest } from '@/types/graphql-request'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import RequestDetailCookies from './app-aside/request-detail-cookies.vue'
import RequestDetailEventStream from './app-aside/request-detail-event-stream.vue'
import RequestDetailHeaders from './app-aside/request-detail-headers.vue'
import RequestDetailInitiator from './app-aside/request-detail-initiator.vue'
import RequestDetailMessages from './app-aside/request-detail-messages.vue'
import RequestDetailPayload from './app-aside/request-detail-payload.vue'
import RequestDetailPreview from './app-aside/request-detail-preview.vue'
import RequestDetailResponse from './app-aside/request-detail-response.vue'
import RequestDetailSseResponse from './app-aside/request-detail-sse-response.vue'
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
      <RequestDetailPayload :request="requestDetail" :enabled="selectedTab === 'Payload'" />
    </div>

    <div
      v-show="selectedTab === 'Preview'"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    >
      <RequestDetailPreview :request="requestDetail as GraphQLNetworkRequest" />
    </div>

    <div
      v-show="selectedTab === 'Messages'"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    >
      <RequestDetailMessages :request="requestDetail as GraphQLSubscriptionRequest" />
    </div>

    <div v-show="selectedTab === 'EventStream'" class="flex-1 min-h-0 overflow-hidden">
      <RequestDetailEventStream :request="requestDetail as GraphQLSubscriptionRequest" />
    </div>

    <div
      v-show="selectedTab === 'Response'"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    >
      <RequestDetailSseResponse
        v-if="requestDetail.operation === 'subscription' && requestDetail.transport === 'sse'"
        :request="requestDetail as GraphQLSubscriptionRequest"
        :enabled="selectedTab === 'Response'"
      />
      <RequestDetailResponse
        v-else
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
      <RequestDetailTiming :request="requestDetail" />
    </div>

    <div
      v-show="selectedTab === 'Cookies'"
      class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
    >
      <RequestDetailCookies :request="requestDetail" />
    </div>
  </aside>
</template>
