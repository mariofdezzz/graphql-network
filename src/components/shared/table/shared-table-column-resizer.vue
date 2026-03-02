<script setup lang="ts">
import { useResizer } from '@/composables/components/shared/table/shared-table-header/use-resizer'
import { toRefs, useTemplateRef } from 'vue'

const props = defineProps<{
  relativeWidth: number
  lastColumnWidth: number
  showResizeHandle?: boolean
}>()

const emit = defineEmits<{
  (e: 'resize', newRelativeSize: number): void
}>()

const { relativeWidth, lastColumnWidth } = toRefs(props)

const element = useTemplateRef('wrapper')

const { onMouseDown } = useResizer(element, relativeWidth, lastColumnWidth, (newRelativeSize) => {
  emit('resize', newRelativeSize)
})
</script>

<template>
  <div ref="wrapper" class="relative">
    <div
      v-if="props.showResizeHandle"
      class="absolute top-0 right-0 cursor-col-resize h-full w-[7px] translate-x-1 z-10 pointer-events-auto"
      @mousedown="onMouseDown($event)"
    ></div>
  </div>
</template>
