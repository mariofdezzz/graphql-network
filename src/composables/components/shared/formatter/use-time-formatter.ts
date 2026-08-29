import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export function useTimeFormatter() {
  const settingsStore = useSettingsStore()
  const { effectiveLanguage } = storeToRefs(settingsStore)

  const timeFormatter = computed(
    () =>
      new Intl.NumberFormat(effectiveLanguage.value, {
        maximumFractionDigits: 2,
      }),
  )
  const µsTimeFormatter = computed(
    () =>
      new Intl.NumberFormat(effectiveLanguage.value, {
        maximumFractionDigits: 0,
      }),
  )

  function format(milliseconds: number): string {
    if (milliseconds < 0) return '-'
    if (milliseconds < 0.001) return '0 µs'

    const microseconds = milliseconds * 1000
    const k = 1000
    const sizes = ['µs', 'ms', 's', 'min']

    let i = Math.floor(Math.log(microseconds) / Math.log(k))

    if (i === 0 && microseconds >= 100) i = 1
    if (microseconds >= 60_000_000) i = 3

    const formatter = i === 0 ? µsTimeFormatter.value : timeFormatter.value

    const result = formatter.format(generateResult(microseconds, i))

    return result + ' ' + sizes[i]
  }

  function generateResult(ms: number, i: number) {
    switch (i) {
      case 0:
        return Math.round(ms)

      case 1:
        return ms / 1000

      case 2:
        return ms / 1000000

      default:
        return ms / 1000000 / 60
    }
  }

  return {
    format,
  }
}
