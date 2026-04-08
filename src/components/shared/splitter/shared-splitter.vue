<script setup lang="ts">
import { usePanelSizes } from '@/composables/components/shared/splitter/use-panel-sizes'
import { usePanels } from '@/composables/components/shared/splitter/use-panels'
import { useSplitterGridStyle } from '@/composables/components/shared/splitter/use-splitter-grid-style'
import { cloneVNode, computed, useTemplateRef } from 'vue'
import SharedResizer from '../shared-resizer.vue'

const props = withDefaults(
  defineProps<{
    direction?: 'horizontal' | 'vertical'
    storageKey?: string
  }>(),
  {
    direction: 'horizontal',
  },
)

const containerElement = useTemplateRef('container')
const { panels } = usePanels()
const { sizes, units, setSize } = usePanelSizes({
  panels,
  container: containerElement,
  direction: props.direction,
  storageKey: props.storageKey,
})
const { style } = useSplitterGridStyle({ sizes, units, direction: props.direction })

const renderedPanels = computed(() =>
  panels.map(({ vnode, props }, index) =>
    cloneVNode(vnode, {
      ...(props ?? {}),
      size: sizes.value[index],
      unit: units.value[index],
    }),
  ),
)
</script>

<template>
  <div
    ref="container"
    class="h-full min-h-0 grid gap-x-px bg-on-base-disabled relative"
    :style="style"
  >
    <component
      v-for="(panel, index) in renderedPanels"
      :key="index"
      :is="index < renderedPanels.length - 1 ? SharedResizer : 'div'"
      class="grid bg-base-color"
      :size="sizes[index]"
      :unit="units[index]"
      :direction="direction"
      @resize="setSize(index, $event)"
    >
      <component :is="panel" class="min-w-0" />
    </component>

    <!-- <div class="absolute h-full w-full grid gap-x-px pointer-events-none" :style="style">
      <SharedResizer
        v-for="(size, index) in sizes"
        :key="index"
        :relativeSize="size"
        :direction
        @resize="resizeColumn(index, $event)"
      />
    </div> -->
  </div>
</template>
