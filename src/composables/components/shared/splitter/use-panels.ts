import { onMounted, reactive, useSlots, watchEffect } from 'vue'

export type PanelContext = {
  props: {
    defaultSize?: number
    unit: '%' | 'px'
  }
  vnode: any
}

export function usePanels() {
  const slots = useSlots()
  const panels = reactive<PanelContext[]>([])

  function registerPanels() {
    const children = slots.default?.() || []

    panels.splice(
      0,
      panels.length,
      ...children
        .filter((vnode) => (vnode.type as any)?.__name === 'shared-splitter-panel')
        .map((vnode) => ({
          props: vnode.props as any,
          vnode,
        })),
    )
  }

  onMounted(() => {
    registerPanels()
  })
  watchEffect(() => {
    registerPanels()
  })

  return {
    panels,
  }
}
