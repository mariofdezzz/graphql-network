import { MIN_COL_WIDTH } from '@/constants/shared/table/min-col-width'
import { useMouseInElement } from '@vueuse/core'
import { unref, watch, type MaybeRef } from 'vue'

export function useResizer(
  element: MaybeRef<HTMLElement | null>,
  relativeWidth: MaybeRef<number>,
  lastColumnWidth: MaybeRef<number>,
  onResize: (newRelativeSize: number) => void,
) {
  const { elementX, elementWidth } = useMouseInElement(element)

  function startResize(event: MouseEvent) {
    event.preventDefault()

    const resizeWatcher = watch([elementX, elementWidth], ([x, width]) => {
      const newRelativeSize = (x * unref(relativeWidth)) / width

      if (width <= MIN_COL_WIDTH && newRelativeSize < unref(relativeWidth)) return
      if (unref(lastColumnWidth) <= MIN_COL_WIDTH && newRelativeSize > unref(relativeWidth)) return

      onResize(newRelativeSize)
    })

    function stopResize(event: MouseEvent): void {
      event.preventDefault()
      resizeWatcher.stop()
      document.removeEventListener('mouseup', stopResize)
    }

    document.addEventListener('mouseup', stopResize)
  }

  return {
    onMouseDown: startResize,
  }
}
