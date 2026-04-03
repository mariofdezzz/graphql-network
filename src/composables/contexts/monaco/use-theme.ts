import { usePreferredDark } from '@vueuse/core'
import { editor } from 'monaco-editor'
import type { MonacoEditorConfig } from 'monaco-editor-vue3'
import { watch } from 'vue'

export function useTheme(options: MonacoEditorConfig) {
  const isDark = usePreferredDark()

  watch(
    isDark,
    (isDark) => {
      options.theme = isDark ? 'vs-dark' : 'vs-light'
      editor.setTheme(isDark ? 'vs-dark' : 'vs-light')
    },
    { immediate: true },
  )
}
