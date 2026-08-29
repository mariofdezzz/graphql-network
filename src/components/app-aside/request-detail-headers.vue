<script setup lang="ts">
import { formatHeader } from '@/logic/contexts/request-detail/format-header'
import type { GraphQLRequest } from '@/types/graphql-request'
import HeadersContent from './request-detail-headers/headers-content.vue'
import HeadersSummary from './request-detail-headers/headers-summary.vue'

defineProps<{
  request: GraphQLRequest
}>()
</script>

<template>
  <details open name="general">
    <HeadersSummary class="border-t-0"> {{ $t('headers.general') }} </HeadersSummary>

    <HeadersContent>
      <span>{{ $t('headers.requestUrl') }}</span>
      <span>{{ request.headers.general.url }}</span>

      <span>{{ $t('headers.requestMethod') }}</span>
      <span>{{ request.headers.general.method }}</span>

      <span>{{ $t('headers.statusCode') }}</span>
      <div class="flex gap-1 items-center">
        <div
          class="w-3 h-3 rounded-full"
          :class="[request.headers.general.status < 300 ? 'bg-green-500' : 'bg-red-500']"
        ></div>

        <span>{{ request.headers.general.status }}</span>
      </div>

      <span v-if="request.headers.general.remoteAddress">{{ $t('headers.remoteAddress') }}</span>
      <span>{{ request.headers.general.remoteAddress }}</span>

      <!-- TODO -->
      <!-- <span>Referrer Policy</span>
      <span>{{ request.referrerPolicy }}</span> -->
    </HeadersContent>
  </details>

  <details open name="response">
    <HeadersSummary> {{ $t('headers.responseHeaders') }} </HeadersSummary>

    <HeadersContent>
      <template v-for="header in request.headers.response" :key="header.name">
        <span>{{ formatHeader(header.name) }}</span>
        <span>{{ header.value }}</span>
      </template>
    </HeadersContent>
  </details>

  <details open name="request">
    <HeadersSummary> {{ $t('headers.requestHeaders') }} </HeadersSummary>

    <HeadersContent>
      <template v-for="header in request.headers.request" :key="header.name">
        <span>{{ formatHeader(header.name) }}</span>
        <span>{{ header.value }}</span>
      </template>
    </HeadersContent>
  </details>
</template>
