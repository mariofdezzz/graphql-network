export function formatBytes(bytes: number, decimals = 1) {
  if (bytes < 0) return '-'
  if (bytes === 0) return '0 kB'

  const k = 1024
  const sizes = ['kB', 'MB', 'GB', 'TB', 'PB']

  const kb = bytes / k

  const i = Math.floor(Math.log(kb) / Math.log(k))

  const result = parseFloat((kb / Math.pow(k, i)).toFixed(decimals))

  return result + ' ' + sizes[i]
}
