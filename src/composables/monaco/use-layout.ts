import type { IStandaloneCodeEditor } from '@/types/monaco/standalone-code-editor'
import { nextTick, ref, watch, type Ref } from 'vue'

export function useLayout(trigger: Ref<boolean>) {
  const editor = ref<IStandaloneCodeEditor>()

  function onEditorDidMount(_editor: IStandaloneCodeEditor) {
    editor.value = _editor
  }

  watch(trigger, (enabled) => {
    if (enabled) {
      nextTick(() => {
        editor.value?.layout(undefined, true)
      })
    }
  })

  return {
    onEditorDidMount,
  }
}
