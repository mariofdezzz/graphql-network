<script setup lang="ts">
import { useMouseInElement } from '@vueuse/core'
import { computed, useTemplateRef, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    relativeSize: number
    direction?: 'horizontal' | 'vertical'
  }>(),
  {
    direction: 'horizontal',
  },
)

const emit = defineEmits<{
  (e: 'resize', delta: number): void
}>()

const element = useTemplateRef('wrapper')
const { elementX, elementY, elementWidth, elementHeight } = useMouseInElement(element)

const position = computed(() =>
  props.direction === 'horizontal' ? elementX.value : elementY.value,
)
const size = computed(() =>
  props.direction === 'horizontal' ? elementWidth.value : elementHeight.value,
)

function onMouseDown(event: MouseEvent) {
  event.preventDefault()

  const resizeWatcher = watch(position, (position) => {
    const newSize = (position * props.relativeSize) / size.value
    const delta = newSize - props.relativeSize

    emit('resize', delta)
  })

  function stopResize(event: MouseEvent): void {
    event.preventDefault()
    resizeWatcher.stop()
    document.removeEventListener('mouseup', stopResize)
  }

  document.addEventListener('mouseup', stopResize)
}
</script>

<template>
  <div ref="wrapper" class="relative">
    <slot />

    <div
      v-if="direction === 'horizontal'"
      class="absolute top-0 right-0 cursor-col-resize h-full w-[7px] translate-x-1 z-10 pointer-events-auto"
      @mousedown="onMouseDown($event)"
    />
    <div
      v-else
      class="absolute bottom-0 left-0 cursor-row-resize w-full h-[7px] translate-y-1 z-10 pointer-events-auto"
      @mousedown="onMouseDown($event)"
    />
  </div>
</template>
