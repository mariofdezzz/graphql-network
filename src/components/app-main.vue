<script setup lang="ts">
import type { Sort } from '@/types/components/shared/table/sort'
import RequestsTable from './app-main/requests-table.vue'
import type { GraphQLRequest } from '@/types/graphql-request'

defineProps<{
  requests: GraphQLRequest[]
}>()

// const rows = [
//   {
//     id: '1',
//     name: 'Item 1',
//     status: 'ok',
//     type: 'query',
//     size: '14kb',
//     time: '200ms',
//     waterfall: '...',
//     timings: {
//       total: 200,
//     },
//   },
//   {
//     id: '2',
//     name: 'Item 2',
//     status: '2 errors',
//     type: 'query',
//     size: '14kb',
//     time: '200ms',
//     waterfall: '...',
//     timings: {
//       total: 200,
//     },
//   },
//   {
//     id: '3',
//     name: 'Item 3',
//     status: 'ok',
//     type: 'query',
//     size: '14kb',
//     time: '200ms',
//     waterfall: '...',
//     timings: {
//       total: 200,
//     },
//   },
//   {
//     id: '4',
//     name: 'Item 4',
//     status: 'ok',
//     type: 'query',
//     size: '14kb',
//     time: '200ms',
//     waterfall: '...',
//     timings: {
//       total: 200,
//     },
//   },
// ]

const sort = { column: 'waterfall', direction: 'asc' } as Sort
</script>

<template>
  <main>
    <RequestsTable :rows="requests" :sort />
    <!-- <SharedTable :rows="rows" :sort="{ column: 'waterfall', direction: 'asc' }">
      <SharedColumn title="Name" key="name" />
      <SharedColumn title="Status" key="status" />
      <SharedColumn title="Type" key="type" />
      <SharedColumn title="Size" key="size" />
      <SharedColumn title="Time" key="time" />
      <SharedColumn title="Waterfall" key="waterfall" />
    </SharedTable> -->
  </main>
</template>
