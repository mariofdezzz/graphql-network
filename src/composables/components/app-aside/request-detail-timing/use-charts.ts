import { computed } from 'vue'
import type { useRequestTimings } from './use-request-timings'
import type { ChartData, ChartOptions } from 'chart.js'
import { useDark } from '@vueuse/core'

type UseChartsOptions = ReturnType<typeof useRequestTimings>

export function useCharts({
  queueing,
  stalled,
  dns,
  connect,
  ssl,
  sent,
  wait,
  download,
  total,
}: UseChartsOptions) {
  const isDark = useDark()

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
        borderColor: isDark.value ? '#8E8E8E' : '#747474',
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

  const dnsData = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        data: [[queueing.value + stalled.value, queueing.value + stalled.value + dns.value]],
        backgroundColor: '#5DD6FB',
      },
    ],
  }))

  const connectData = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        data: [
          [
            queueing.value + stalled.value + dns.value,
            queueing.value + stalled.value + dns.value + connect.value,
          ],
        ],
        backgroundColor: '#FE8D59',
      },
    ],
  }))

  const sslData = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        data: [
          [
            queueing.value + stalled.value + dns.value + connect.value - ssl.value,
            queueing.value + stalled.value + dns.value + connect.value,
          ],
        ],
        backgroundColor: '#D290FF',
      },
    ],
  }))

  const sentData = computed<ChartData<any>>(() => ({
    labels: [''],
    datasets: [
      {
        data: [
          [
            queueing.value + stalled.value + dns.value + connect.value,
            queueing.value + stalled.value + dns.value + connect.value + sent.value,
          ],
        ],
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
            queueing.value + stalled.value + dns.value + connect.value + sent.value,
            queueing.value + stalled.value + dns.value + connect.value + sent.value + wait.value,
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
            queueing.value + stalled.value + dns.value + connect.value + sent.value + wait.value,
            queueing.value +
              stalled.value +
              dns.value +
              connect.value +
              sent.value +
              wait.value +
              download.value,
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
    dnsData,
    connectData,
    sslData,
    sentData,
    waitData,
    downloadData,
  }
}
