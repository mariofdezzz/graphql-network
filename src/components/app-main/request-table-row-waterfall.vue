<script setup lang="ts">
import { useWaterfallChart } from '@/composables/contexts/timings/use-waterfall-request-chart'
import type { GraphQLRequest } from '@/types/graphql-request'
import { toRefs } from 'vue'
import { Bar } from 'vue-chartjs'

const props = defineProps<{
  request: GraphQLRequest
}>()

const { request } = toRefs(props)

const { options, data } = useWaterfallChart(request)
</script>

<template>
  <div>
    <Bar :id="'waterfall-' + request.id" :options :data class="h-4!" />
  </div>
</template>
