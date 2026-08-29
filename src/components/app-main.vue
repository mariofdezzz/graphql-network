<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import RequestsTable from './app-main/requests-table.vue'

defineProps<{
  requests: GraphQLRequest[]
}>()
</script>

<template>
  <main class="min-h-0">
    <RequestsTable :requests="requests" />
  </main>
</template>
