export function formatTime(milliseconds: number, decimals = 0) {
  if (milliseconds < 0) return '-'
  if (milliseconds < 0.001) return '0 µs'

  const microseconds = milliseconds * 1000
  const k = 1000
  const sizes = ['µs', 'ms', 's', 'min']

  const i = Math.floor(Math.log(microseconds) / Math.log(k))

  if (i === 0 && microseconds >= 100) {
    return (microseconds / 1000).toFixed(decimals) + ' ms'
  }

  const result = generateResult(microseconds, i, decimals)

  return result + ' ' + sizes[i]
}

function generateResult(ms: number, i: number, decimals: number) {
  switch (i) {
    case 0:
      return Math.round(ms).toString()

    case 1:
      return (ms / 1000).toFixed(decimals)

    case 2:
      return (ms / 1000000).toFixed(decimals)

    default:
      return (ms / 1000000 / 60).toFixed(decimals)
  }
}
