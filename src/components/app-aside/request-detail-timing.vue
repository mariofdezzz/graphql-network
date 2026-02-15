<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useCharts } from '@/composables/components/app-aside/request-detail-timing/use-charts'
import { useRequestTimings } from '@/composables/components/app-aside/request-detail-timing/use-request-timings'
import { formatTime } from '@/logic/contexts/time/format-time'
import type { GraphQLNetworkRequest } from '@/types/graphql-request'
import { toRefs } from 'vue'
import { Bar } from 'vue-chartjs'

const props = defineProps<{
  request: GraphQLNetworkRequest
}>()

const { request } = toRefs(props)

const timeData = useRequestTimings(request)
const { queueing, stalled, dns, connect, ssl, sent, wait, download, total, requestStartedAt } =
  timeData

const {
  options,
  queuingData,
  stalledData,
  dnsData,
  connectData,
  sslData,
  sentData,
  waitData,
  downloadData,
} = useCharts({
  ...timeData,
})
</script>
<template>
  <div class="px-4 py-2 w-full">
    <p class="mb-2">Queued at {{ formatTime(requestStartedAt, 2) }}</p>

    <p class="mb-2">Started at {{ formatTime(requestStartedAt + queueing, 2) }}</p>

    <div class="grid grid-cols-[auto_1fr_auto] gap-3 pb-4">
      <template v-if="queueing > 0">
        <span class="text-request-timing-header">Resource Scheduling</span>

        <div></div>

        <span class="text-request-timing-header">DURATION</span>

        <span class="ps-4">Queueing</span>

        <div class="h-5">
          <Bar
            id="timing-queueing-chart"
            :options="options"
            :data="queuingData"
            class="w-full!"
          ></Bar>
        </div>

        <span class="text-end">{{ formatTime(queueing, 2) }} </span>
      </template>

      <span class="text-request-timing-header">Connection Start</span>

      <div></div>

      <span class="text-request-timing-header">DURATION</span>

      <span class="ps-4">Stalled</span>

      <div class="h-4">
        <Bar id="timing-stalled-chart" :options="options" :data="stalledData" class="w-full!"></Bar>
      </div>

      <span class="text-end">{{ formatTime(stalled, 2) }} </span>

      <template v-if="dns">
        <span class="ps-4">DNS Lookup</span>

        <div class="h-4">
          <Bar id="timing-stalled-chart" :options="options" :data="dnsData" class="w-full!"></Bar>
        </div>

        <span class="text-end">{{ formatTime(dns, 2) }} </span>
      </template>

      <template v-if="connect">
        <span class="ps-4">Initial Connection</span>

        <div class="h-4">
          <Bar
            id="timing-stalled-chart"
            :options="options"
            :data="connectData"
            class="w-full!"
          ></Bar>
        </div>

        <span class="text-end">{{ formatTime(connect, 2) }} </span>
      </template>

      <template v-if="ssl">
        <span class="ps-4">SSL</span>

        <div class="h-4">
          <Bar id="timing-stalled-chart" :options="options" :data="sslData" class="w-full!"></Bar>
        </div>

        <span class="text-end">{{ formatTime(ssl, 2) }} </span>
      </template>

      <span class="text-request-timing-header">Request/Response</span>

      <div></div>

      <span class="text-request-timing-header">DURATION</span>

      <span class="ps-4">Request sent</span>

      <div class="h-4">
        <Bar
          id="timing-request-sent-chart"
          :options="options"
          :data="sentData"
          class="w-full!"
        ></Bar>
      </div>

      <span class="text-end">{{ formatTime(sent, 2) }} </span>

      <span class="ps-4">Waiting for server response</span>

      <div class="h-4">
        <Bar id="timing-waiting-chart" :options="options" :data="waitData" class="w-full!"></Bar>
      </div>

      <span class="text-end">{{ formatTime(wait, 2) }} </span>

      <span class="ps-4">Content Download</span>

      <div class="h-4">
        <Bar
          id="timing-download-chart"
          :options="options"
          :data="downloadData"
          class="w-full!"
        ></Bar>
      </div>

      <span class="text-end">{{ formatTime(download, 2) }} </span>
    </div>

    <div class="flex items-center justify-between">
      <a
        href="https://developer.chrome.com/docs/devtools/network/reference?hl=es-419#timing-explanation"
        class="text-blue-600 dark:text-blue-200 underline"
        >Explanation</a
      >

      <span class="font-bold">{{ formatTime(total, 2) }} </span>
    </div>
  </div>
</template>
