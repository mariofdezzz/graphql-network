import { timeline } from '@/logic/components/app-waterfall/timeline'
import { useNetworkStore } from '@/stores/network'
import type { GraphQLRequest } from '@/types/graphql-request'
import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'

export function useRequestsData() {
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
              const prevEnd =
                new Date(prev.timings.startedAt).getTime() + (unref(prev.timings.total) ?? 0)
              const currStart =
                new Date(curr.timings.startedAt).getTime() + (unref(curr.timings.total) ?? 0)
              return prevEnd < currStart ? prev : curr
            })

          const latestEnd =
            new Date(latest.timings.startedAt).getTime() + (unref(latest.timings.total) ?? 0)
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
            maxBarThickness: 3,
          }
        }
        const timeDifference =
          new Date(req.timings.startedAt).getTime() -
          (new Date(arr[idx - 1]!.timings.startedAt).getTime() +
            (unref(arr[idx - 1]!.timings.total) ?? 0))

        return {
          borderSkipped: false,
          data: [[0, timeDifference]],
          backgroundColor: 'transparent',
          stack: String(index),
          maxBarThickness: 3,
        }
      }),
    ),
  )

  const requestsSpacesAndByStack = computed(() => Array.zip(spaces.value, requestByStack.value))

  const datasets = computed(() =>
    requestsSpacesAndByStack.value
      .map(([spaces, stacks], index) =>
        Array.zip(spaces, stacks)
          .map(([space, request]) => [space, ...timeline(request, String(index))])
          .flat(),
      )
      .flat(),
  )

  const data = computed(() => ({
    labels: [''],
    datasets: datasets.value,
  }))

  return { data }
}
