import { usePreferredDark } from '@vueuse/core'
import type { ChartOptions } from 'chart.js'
import { computed, type ComputedRef } from 'vue'

type WaterfallChartOptions = ChartOptions<'bar'> & {
  plugins: {
    topLabels: boolean
    scaleOffset: number
  }
}

export function useWaterfallOptions(
  data: ComputedRef<{
    labels: string[]
    datasets: any[]
  }>,
) {
  const isDark = usePreferredDark()

  const displayMinimumTimeValues = computed(() => {
    const datasets = data.value.datasets

    return datasets.every((dataset) => {
      return (dataset.data[0][1] ?? 0) < 110
    })
  })

  const options = computed<WaterfallChartOptions>(() => ({
    indexAxis: 'y',
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    hover: {
      mode: undefined,
    },
    plugins: {
      topLabels: true,
      scaleOffset: 10,
    },
    scales: {
      x: {
        stacked: true,
        min: 0,
        max: displayMinimumTimeValues.value ? 110 : undefined,
        ticks: {
          display: false,
          stepSize: displayMinimumTimeValues.value ? 10 : undefined,
        },
        grid: {
          drawTicks: false,
          color: isDark.value ? '#5E5E5E' : '#D3E3FD',
          tickColor: isDark.value ? '#c7c7c7' : '#1f1f1f',
        },
        border: {
          display: false,
        },
      },
      y: {
        display: false,
      },
    },
    elements: {
      bar: {
        hoverBackgroundColor: (ctx: any) => {
          return ctx.dataset.backgroundColor
        },
        hoverBorderColor: (ctx: any) => {
          return ctx.dataset.borderColor
        },
      },
    },
  }))

  return { options }
}
