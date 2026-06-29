<script setup lang="ts">
import {
  parseCookieHeader,
  parseSetCookieHeaders,
} from '@/logic/contexts/request-detail/parse-set-cookie'
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed } from 'vue'

const props = defineProps<{
  request: GraphQLRequest
}>()

const requestCookies = computed(() => parseCookieHeader(props.request.headers.request))
const responseCookies = computed(() => parseSetCookieHeaders(props.request.headers.response))
</script>

<template>
  <div class="p-2">
    <template v-if="requestCookies.length">
      <h2 class="font-bold pb-2 pt-3">Request Cookies</h2>

      <div class="overflow-hidden">
        <table class="w-full table-fixed text-xs border-collapse cursor-default">
          <thead>
            <tr class="bg-table-base border-b border-on-base-disabled text-left">
              <th class="px-2 py-1 truncate font-medium">Name</th>
              <th class="px-2 py-1 truncate font-medium">Value</th>
              <th class="px-2 py-1 truncate font-medium">Domain</th>
              <th class="px-2 py-1 truncate font-medium">Path</th>
              <th class="px-2 py-1 truncate font-medium">Expires / Max-Age</th>
              <th class="px-2 py-1 truncate font-medium w-12">Size</th>
              <th class="px-2 py-1 truncate font-medium w-16">HttpOnly</th>
              <th class="px-2 py-1 truncate font-medium w-14">Secure</th>
              <th class="px-2 py-1 truncate font-medium w-18">SameSite</th>
              <th class="px-2 py-1 truncate font-medium">Partition Key Site</th>
              <th class="px-2 py-1 truncate font-medium w-20">Cross Site</th>
              <th class="px-2 py-1 truncate font-medium w-16">Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cookie in requestCookies"
              :key="cookie.name"
              class="border-b border-on-base-disabled hover:bg-table-selected-row"
            >
              <td class="px-2 py-1 truncate">{{ cookie.name }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.value }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.domain }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.path }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.expires }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.size }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.httpOnly ? '✓' : '' }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.secure ? '✓' : '' }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.sameSite }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.partitionKeySite }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.crossSite ? '✓' : '' }}</td>
              <td class="px-2 py-1 truncate">{{ cookie.priority }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <h2 v-if="responseCookies.length" class="font-bold pb-2 pt-3">Response Cookies</h2>

    <div v-if="responseCookies.length" class="overflow-hidden">
      <table class="w-full table-fixed text-xs border-collapse cursor-default">
        <thead>
          <tr class="bg-table-base border-b border-on-base-disabled text-left">
            <th class="px-2 py-1 truncate font-medium">Name</th>
            <th class="px-2 py-1 truncate font-medium">Value</th>
            <th class="px-2 py-1 truncate font-medium">Domain</th>
            <th class="px-2 py-1 truncate font-medium">Path</th>
            <th class="px-2 py-1 truncate font-medium">Expires / Max-Age</th>
            <th class="px-2 py-1 truncate font-medium w-12">Size</th>
            <th class="px-2 py-1 truncate font-medium w-16">HttpOnly</th>
            <th class="px-2 py-1 truncate font-medium w-14">Secure</th>
            <th class="px-2 py-1 truncate font-medium w-18">SameSite</th>
            <th class="px-2 py-1 truncate font-medium">Partition Key Site</th>
            <th class="px-2 py-1 truncate font-medium w-20">Cross Site</th>
            <th class="px-2 py-1 truncate font-medium w-16">Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cookie in responseCookies"
            :key="cookie.name"
            class="border-b border-on-base-disabled hover:bg-table-selected-row"
          >
            <td class="px-2 py-1 truncate">{{ cookie.name }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.value }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.domain }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.path }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.expires }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.size }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.httpOnly ? '✓' : '' }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.secure ? '✓' : '' }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.sameSite }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.partitionKeySite }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.crossSite ? '✓' : '' }}</td>
            <td class="px-2 py-1 truncate">{{ cookie.priority }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
