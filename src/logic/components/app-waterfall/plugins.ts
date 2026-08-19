const numberFormatter = new Intl.NumberFormat('en-US')

/**
 * This plugin pushes dataset down by a specified offset.
 * It does some tricky things. Could be improved.
 */
const scaleOffsetPlugin = {
  id: 'scaleOffset',
  afterLayout(chart: any) {
    const offset = chart.options.plugins.scaleOffset || 0

    if (offset) {
      chart.options.datasets.bar.categoryPercentage = (chart.height - offset) / chart.height
    }
  },

  beforeUpdate(chart: any) {
    const offset = chart.options.plugins.scaleOffset || 0
    const scale = chart.scales.y

    if (!scale) return

    const original = scale.getPixelForValue

    scale.getPixelForValue = function (value: any, index: any) {
      const pixel = original.call(this, value, index)

      return pixel + offset / 2
    }
    ;(scale as any)._originalGetPixelForValue = original
  },

  afterUpdate(chart: any) {
    const scale = chart.scales.y

    if (!scale) return

    const original = (scale as any)._originalGetPixelForValue

    if (original) {
      scale.getPixelForValue = original
      delete (scale as any)._originalGetPixelForValue
    }
  },
}

const topLabelsPlugin = {
  id: 'topLabels',
  afterDraw(chart: any) {
    const ctx = chart.ctx
    const xScale = chart.scales.x
    const yScale = chart.scales.y

    ctx.save()
    ctx.font = '10px sans-serif'
    ctx.fillStyle = xScale.options.grid.tickColor || '#000'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    xScale.ticks.forEach((tick: any, index: number) => {
      const label = `${numberFormatter.format(tick.value)} ms`
      const textMetrics = ctx.measureText(label)
      const x = xScale.getPixelForTick(index) - textMetrics.width - 5
      const y = yScale.top + 5

      if (x > 0) {
        ctx.fillText(label, x, y)
      }
    })

    ctx.restore()
  },
}

export const plugins = [topLabelsPlugin, scaleOffsetPlugin]
