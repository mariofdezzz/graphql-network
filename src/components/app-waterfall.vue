<script setup lang="ts">
import { useNetworkStore } from '@/stores/network'
import type { GraphQLRequest } from '@/types/graphql-request'
import type { ChartOptions } from 'chart.js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { timeline } from '../logic/components/app-waterfall/timeline'

const networkStore = useNetworkStore()
const { requests, timelineStartAt } = storeToRefs(networkStore)

const requestByStack = computed(() =>
  requests.value
    .toSorted(
      (a, b) => new Date(a.timings.startedAt).getTime() - new Date(b.timings.startedAt).getTime(),
    )
    .reduce((acc, req) => {
      if (Object.keys(acc).length === 0) {
        acc[0] = [req]
      } else {
        const latest = acc
          .map((array) => array.at(-1)!)
          .reduce((prev, curr) => {
            const prevEnd = new Date(prev.timings.startedAt).getTime() + (prev.timings.total ?? 0)
            const currStart = new Date(curr.timings.startedAt).getTime() + (curr.timings.total ?? 0)
            return prevEnd < currStart ? prev : curr
          })

        const latestEnd = new Date(latest.timings.startedAt).getTime() + (latest.timings.total ?? 0)
        const reqStart = new Date(req.timings.startedAt).getTime()

        if (reqStart > latestEnd) {
          const index = acc.findIndex((array) => array.at(-1) === latest)
          acc[index]!.push(req)
        } else {
          acc.push([req])
        }
      }
      return acc
    }, [] as GraphQLRequest[][]),
)

const spaces = computed(() =>
  requestByStack.value.map((arr, index) =>
    arr.map((req, idx) => {
      if (idx === 0) {
        const timeDifference =
          new Date(req.timings.startedAt).getTime() - timelineStartAt.value.getTime()

        return {
          borderSkipped: false,
          data: [[0, timeDifference]],
          backgroundColor: 'transparent',
          stack: String(index),
          maxBarThickness: 20,
          categoryPercentage: 0.25,
        }
      }
      const timeDifference =
        new Date(req.timings.startedAt).getTime() -
        (new Date(arr[idx - 1]!.timings.startedAt).getTime() + (arr[idx - 1]!.timings.total ?? 0))

      return {
        borderSkipped: false,
        data: [[0, timeDifference]],
        backgroundColor: 'transparent',
        stack: String(index),
        maxBarThickness: 20,
        categoryPercentage: 0.25,
      }
    }),
  ),
)

const requestsSpacesAndByStack = computed(() => Array.zip(spaces.value, requestByStack.value))

const datasets = computed(() =>
  requestsSpacesAndByStack.value.map(([spaces, stacks], index) =>
    Array.zip(spaces, stacks)
      .map(([space, request]) => [
        space,
        // {
        //   borderSkipped: false,
        //   data: [[0, request.timings.total]],
        //   backgroundColor: Math.random() < 0.5 ? '#4f46e5' : '#22c55e',
        //   stack: String(index),
        //   maxBarThickness: 20,
        //   categoryPercentage: 0.25,
        // },
        ...timeline(request, String(index)),
      ])
      .flat(),
  ),
)

const data = computed(() => ({
  labels: [''],
  datasets: datasets.value.flat(),
}))

const options = computed<ChartOptions<'bar'>>(
  () =>
    ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      hover: { mode: null } as any,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: { enabled: false },
      },
      indexAxis: 'y',
      scales: {
        x: {
          // offset: true,
          min: 0,
          // max: datasets.value
          //   .map((dataset) => dataset.reduce((acc, data) => acc + (data.data[1] as number), 0))
          //   .reduce((a, b) => Math.max(a, b), 0),
          display: true,
          ticks: {
            mirror: true,
            // padding: 10,
            align: 'end',
            font: {
              size: 10, // fuerza el tamaño
              lineHeight: 10,
            },
          },
        },
        y: {
          offset: true,
          display: false,
        },
      },
    }) satisfies ChartOptions<'bar'>,
)
</script>

<template>
  <Bar class="h-18! border-b border-on-base-disabled" :options :data />
</template>
