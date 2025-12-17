<script setup lang="ts">
import { useWaterfallChart } from '@/composables/timings/use-waterfall-chart'
import type { GraphQLRequest } from '@/types/graphql-request'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { toRefs } from 'vue'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  request: GraphQLRequest
  timelineStartAt: Date
}>()

const { request, timelineStartAt } = toRefs(props)

const { options, data } = useWaterfallChart(request, timelineStartAt)
</script>

<template>
  <div>
    <Bar :options :data class="h-4" />
  </div>
</template>
