<script setup lang="ts">
import type { Sort } from '@/types/components/shared/table/sort'
import RequestsTable from './app-main/requests-table.vue'
import type { GraphQLRequest } from '@/types/graphql-request'

defineProps<{
  requests: GraphQLRequest[]
  timelineStartAt: Date
}>()

const sort = { column: 'waterfall', direction: 'asc' } as Sort
</script>

<template>
  <main>
    <RequestsTable :rows="requests" :sort :timelineStartAt />
  </main>
</template>
