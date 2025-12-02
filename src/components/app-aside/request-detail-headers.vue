<script setup lang="ts">
import { formatHeader } from '@/logic/request-detail/format-header'
import type { GraphQLRequest } from '@/types/graphql-request'
import HeadersSummary from './request-detail-headers/headers-summary.vue'
import HeadersContent from './request-detail-headers/headers-content.vue'

defineProps<{
  request: GraphQLRequest
}>()
</script>

<template>
  <details open name="general">
    <HeadersSummary class="border-t-0"> General </HeadersSummary>

    <HeadersContent>
      <span>Request URL</span>
      <span>{{ request.headers.general.url }}</span>

      <span>Request Method</span>
      <span>{{ request.headers.general.method }}</span>

      <span>Status Code</span>
      <div class="flex gap-1 items-center">
        <div
          class="w-3 h-3 rounded-full"
          :class="[request.headers.general.status < 300 ? 'bg-green-500' : 'bg-red-500']"
        ></div>

        <span>{{ request.headers.general.status }}</span>
      </div>

      <span v-if="request.headers.general.remoteAddress">Remote Address</span>
      <span>{{ request.headers.general.remoteAddress }}</span>

      <!-- TODO -->
      <!-- <span>Referrer Policy</span>
      <span>{{ request.referrerPolicy }}</span> -->
    </HeadersContent>
  </details>

  <details open name="response">
    <HeadersSummary> Response Headers </HeadersSummary>

    <HeadersContent>
      <template v-for="header in request.headers.response" :key="header.name">
        <span>{{ formatHeader(header.name) }}</span>
        <span>{{ header.value }}</span>
      </template>
    </HeadersContent>
  </details>

  <details open name="request">
    <HeadersSummary> Request Headers </HeadersSummary>

    <HeadersContent>
      <template v-for="header in request.headers.request" :key="header.name">
        <span>{{ formatHeader(header.name) }}</span>
        <span>{{ header.value }}</span>
      </template>
    </HeadersContent>
  </details>
</template>
