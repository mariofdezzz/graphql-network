import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export function useByteFormatter() {
  const settingsStore = useSettingsStore()
  const { effectiveLanguage } = storeToRefs(settingsStore)

  const formatter = computed(
    () =>
      new Intl.NumberFormat(effectiveLanguage.value, {
        maximumFractionDigits: 1,
      }),
  )

  function format(bytes: number): string {
    if (bytes < 0) return '-'
    if (bytes === 0) return '0 kB'

    const k = 1024
    const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    const result = formatter.value.format(bytes / Math.pow(k, i))

    return result + ' ' + sizes[i]
  }

  return {
    format,
  }
}
