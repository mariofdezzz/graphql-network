import { MIN_SPLITTER_PANEL_SIZE } from '@/constants/shared/splitter/min-splitter-panel-size'
import { useElementBounding, useLocalStorage } from '@vueuse/core'
import { computed, ref, unref, type MaybeRef } from 'vue'
import type { PanelContext } from './use-panels'

export function usePanelSizes({
  panels,
  container,
  direction,
  storageKey,
}: {
  panels: MaybeRef<PanelContext[]>
  container: MaybeRef<HTMLElement | null>
  direction: 'horizontal' | 'vertical'
  storageKey?: string
}) {
  const initialValue = unref(panels)
    .slice(0, -1)
    .map(() => undefined as number | undefined)

  const settedSizes = storageKey
    ? useLocalStorage('panel-size-' + storageKey, initialValue)
    : ref(initialValue)
  const { width, height } = useElementBounding(container)

  const containerSize = computed(() => (direction === 'horizontal' ? width.value : height.value))

  const defaultSizes = computed(() =>
    unref(panels)
      .slice(0, -1)
      .map(({ props }) => props?.defaultSize ?? 100 / unref(panels).length),
  )

  const sizes = computed(() =>
    unref(panels)
      .slice(0, -1)
      .map((_, index) => settedSizes.value[index] ?? defaultSizes.value[index]!),
  )

  function setSize(index: number, delta: number) {
    const newSize = Math.max(sizes.value[index]! + delta, 0.1)
    const newAbsoluteSize = unref(containerSize) * (newSize / 100)

    const totalSize =
      sizes.value.reduce((sum, size) => sum + size, 0) - sizes.value[index]! + newSize

    const totalAbsoluteSize = unref(containerSize) * (totalSize / 100) + MIN_SPLITTER_PANEL_SIZE

    // console.log(
    //   'setSize',
    //   index,
    //   delta,
    //   settedSizes.value[index],
    //   sizes.value[index],
    //   totalSize,
    //   unref(containerSize),
    // )

    if (totalAbsoluteSize < unref(containerSize) && newAbsoluteSize > MIN_SPLITTER_PANEL_SIZE) {
      settedSizes.value[index] = newSize
    }
  }

  return {
    sizes,
    setSize,
  }
}
