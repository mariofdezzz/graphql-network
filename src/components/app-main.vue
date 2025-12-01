<script setup lang="ts">
import type { Sort } from '@/types/components/shared/table/sort'
import RequestsTable from './app-main/requests-table.vue'
import type { GraphQLRequest } from '@/types/graphql-request'

defineProps<{
  requests: GraphQLRequest[]
}>()

const rows: GraphQLRequest[] = [
  {
    id: '1',
    name: 'GetUsers',
    status: 200,
    errors: 0,
    operation: 'query',
    size: 512,
    timings: {
      total: 120,
      dns: 20,
      connect: 30,
      ssl: 10,
      send: 5,
      wait: 40,
      receive: 15,
      startedAt: '2024-01-01T12:00:00Z',
    },
  },
  {
    id: '2',
    name: 'CreateUser',
    status: 201,
    errors: 0,
    operation: 'mutation',
    size: 256,
    timings: {
      total: 150,
      dns: 25,
      connect: 35,
      ssl: 15,
      send: 10,
      wait: 50,
      receive: 15,
      startedAt: '2024-01-01T12:01:00Z',
    },
  },
  {
    id: '3',
    name: 'UpdateUser',
    status: 200,
    errors: 1,
    operation: 'mutation',
    size: 128,
    timings: {
      total: 100,
      dns: 15,
      connect: 25,
      ssl: 5,
      send: 5,
      wait: 40,
      receive: 10,
      startedAt: '2024-01-01T12:02:00Z',
    },
  },
]

const sort = { column: 'waterfall', direction: 'asc' } as Sort
</script>

<template>
  <main>
    <RequestsTable :rows="rows" :sort />
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
