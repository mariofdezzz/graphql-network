import { MAIN_SPLITTER_RESIZE_EVENT } from '@/constants/events'
import type { IStandaloneCodeEditor } from '@/types/monaco/standalone-code-editor'
import { useEventBus } from '@vueuse/core'
import { nextTick, ref, watch, type Ref } from 'vue'
import { useWindowResize } from '../window/use-window-resize'

export function useLayout(trigger: Ref<boolean>, request: Ref<any>) {
  const editors = ref<IStandaloneCodeEditor[]>([])
  const bus = useEventBus(MAIN_SPLITTER_RESIZE_EVENT)

  function onEditorDidMount(_editor: IStandaloneCodeEditor) {
    if (!editors.value.includes(_editor)) {
      editors.value.push(_editor)
    }
  }

  watch(trigger, (enabled) => {
    if (enabled) {
      nextTick(() => {
        updateLayout()
      })
    }
  })

  watch(request, () => {
    if (trigger.value) updateLayout()
  })

  useWindowResize(() => {
    updateLayout()
  })

  bus.on(() => {
    updateLayout()
  })

  async function updateLayout() {
    await nextTick()

    editors.value.forEach((editor) => {
      editor?.layout({ width: 0, height: 0 }, true)
    })

    await nextTick()

    editors.value.forEach((editor) => {
      editor?.layout(undefined, true)
    })
  }

  return {
    onEditorDidMount,
  }
}
