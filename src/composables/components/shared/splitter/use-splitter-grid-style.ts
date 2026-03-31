import { MIN_SPLITTER_PANEL_SIZE } from '@/constants/shared/splitter/min-splitter-panel-size'
import { computed, unref, type MaybeRef } from 'vue'

export function useSplitterGridStyle({
  sizes,
  direction,
}: {
  sizes: MaybeRef<number[]>
  direction: 'horizontal' | 'vertical'
}) {
  const style = computed(
    () =>
      (direction === 'horizontal' ? 'grid-template-columns: ' : 'grid-template-rows: ') +
      unref(sizes)
        .map((relativeWidth) => `minmax(${MIN_SPLITTER_PANEL_SIZE}px, ${relativeWidth}%)`)
        .concat(`minmax(${MIN_SPLITTER_PANEL_SIZE}px, 1fr)`)
        .join(' ') +
      ';',
  )

  return {
    style,
  }
}
