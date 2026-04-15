import type { IStandaloneCodeEditor } from '@/types/monaco/standalone-code-editor'
import { nextTick, ref, watch, type Ref } from 'vue'
import { useWindowResize } from '../window/use-window-resize'

export function useLayout(trigger: Ref<boolean>, request: Ref<any>) {
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

  watch(request, () => {
    if (trigger.value) updateLayout()
  })

  useWindowResize(() => {
    updateLayout()
  })

  async function updateLayout() {
    await nextTick()

    editor.value?.layout({ width: 0, height: 0 }, true)

    await nextTick()

    editor.value?.layout(undefined, true)
  }

  return {
    onEditorDidMount,
  }
}
