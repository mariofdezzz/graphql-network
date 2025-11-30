export function formatBytes(bytes: number, decimals = 1) {
  if (bytes < 0) return '-'
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const result = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))

  return result + ' ' + sizes[i]
}
