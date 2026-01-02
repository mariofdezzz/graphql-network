export function formatTime(milliseconds: number, decimals = 0) {
  if (milliseconds < 0) return '-'
  if (milliseconds === 0) return '0 ms'

  const k = 1000
  const sizes = ['ms', 's', 'min']

  const i = Math.floor(Math.log(milliseconds) / Math.log(k))

  const result = generateResult(milliseconds, i, decimals)

  return result + ' ' + sizes[i]
}

function generateResult(ms: number, i: number, decimals: number) {
  switch (i) {
    case 0:
      return parseFloat(ms.toFixed(decimals))

    case 1:
      return parseFloat((ms / Math.pow(1000, i)).toFixed(decimals))

    default:
      return parseFloat((ms / Math.pow(1000, i - 1) / 60).toFixed(decimals))
  }
}
