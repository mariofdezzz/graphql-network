import { usePreferredDark } from '@vueuse/core'
import type { ChartOptions } from 'chart.js'
import { computed } from 'vue'

const isDark = usePreferredDark()

type WaterfallChartOptions = ChartOptions<'bar'> & {
  plugins: {
    topLabels: boolean
    scaleOffset: number
  }
}

export const options = computed<WaterfallChartOptions>(() => ({
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
      ticks: {
        display: false,
      },
      grid: {
        drawTicks: false,
        color: isDark.value ? '#5E5E5E' : '#D3E3FD',
        tickColor: isDark.value ? '#c7c7c7' : '#1f1f1f',
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
