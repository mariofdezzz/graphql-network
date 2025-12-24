<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import RequestsTable from './app-main/requests-table.vue'

defineProps<{
  requests: GraphQLRequest[]
  timelineStartAt: Date
}>()
</script>

<template>
  <main>
    <RequestsTable :rows="requests" :timelineStartAt />
  </main>
</template>
