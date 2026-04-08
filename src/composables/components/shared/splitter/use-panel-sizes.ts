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

  const units = computed(() => unref(panels).map(({ props }) => props?.unit ?? '%'))

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
    const unit = units.value[index]!

    const newSize = Math.max(sizes.value[index]! + delta, 0.1)
    const newAbsoluteSize = unit === '%' ? unref(containerSize) * (newSize / 100) : newSize

    const totalSize = sizes.value.reduce((sum, size, panelIndex) => {
      const sizeUnit = units.value[panelIndex]!
      const absoluteSize = sizeUnit === '%' ? unref(containerSize) * (size / 100) : size

      return sum + absoluteSize
    }, 0)
    const totalAbsoluteSize =
      totalSize -
      (unit === '%' ? unref(containerSize) * (sizes.value[index]! / 100) : sizes.value[index]!) +
      newAbsoluteSize

    // console.log(
    //   'setSize',
    //   index,
    //   delta,
    //   settedSizes.value[index],
    //   sizes.value[index],
    //   totalAbsoluteSize,
    //   unref(containerSize),
    // )

    if (totalAbsoluteSize < unref(containerSize) && newAbsoluteSize > MIN_SPLITTER_PANEL_SIZE) {
      settedSizes.value[index] = newSize
    }
  }

  return {
    sizes,
    units,
    setSize,
  }
}
