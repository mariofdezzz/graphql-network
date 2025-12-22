import { computed } from 'vue'
import type { useRequestTimings } from './use-request-timings'
import type { ChartData, ChartOptions } from 'chart.js'

type UseChartsOptions = Omit<ReturnType<typeof useRequestTimings>, 'formatTime'>

export function useCharts({ queueing, stalled, sent, wait, download, total }: UseChartsOptions) {
  const options = computed<ChartOptions<any>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    hover: { mode: null },
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
        offset: true,
        min: 0,
        max: total.value,
        display: false,
      },
      y: {
        display: false,
      },
    },
  }))

  const queuingData = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        borderSkipped: false,
        data: [[0, queueing.value]],
        backgroundColor: 'transparent',
        borderColor: '#8E8E8E',
        borderWidth: 1,
      },
    ],
  }))

  const stalledData = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        data: [[queueing.value, queueing.value + stalled.value]],
        backgroundColor: '#fff',
      },
    ],
  }))

  const sentData = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        data: [[queueing.value + stalled.value, queueing.value + stalled.value + sent.value]],
        backgroundColor: '#009DC1',
      },
    ],
  }))

  const waitData = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        data: [
          [
            queueing.value + stalled.value + sent.value,
            queueing.value + stalled.value + sent.value + wait.value,
          ],
        ],
        backgroundColor: '#38BF60',
      },
    ],
  }))

  const downloadData = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        data: [
          [
            queueing.value + stalled.value + sent.value + wait.value,
            queueing.value + stalled.value + sent.value + wait.value + download.value,
          ],
        ],
        backgroundColor: '#4C8DF5',
      },
    ],
  }))

  return {
    options,
    queuingData,
    stalledData,
    sentData,
    waitData,
    downloadData,
  }
}
