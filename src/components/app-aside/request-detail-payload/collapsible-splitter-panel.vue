<script setup lang="ts">
import { REQUEST_DETAIL_PAYLOAD_SPLITTER_RESIZE_EVENT } from '@/constants/events.ts'
import { useElementBounding, useElementSize, useEventBus } from '@vueuse/core'
import { SplitterGroup, SplitterPanel } from 'reka-ui'
import { computed, useTemplateRef } from 'vue'
import HeadersSummary from '../request-detail-headers/headers-summary.vue'

const props = defineProps<{
  name: string
  hasPreviousElement: boolean
  parentElement: InstanceType<typeof SplitterGroup> | null
}>()

const parentHtmlElement = computed(() => props.parentElement?.$el as HTMLElement | undefined)
const { height: parentHeight } = useElementSize(parentHtmlElement)

const panel = useTemplateRef('panel')
const summary = useTemplateRef('summary')
const summaryHtmlElement = computed(() => summary.value?.$el as HTMLElement | undefined)
const { height: summaryHeight } = useElementBounding(summaryHtmlElement)

const variablesPanelMinSize = computed(() => {
  if (!parentHeight.value || !summaryHeight.value) return 5

  console.log('[SPLITTER] variablesPanelMinSize', {
    parentHeight: parentHeight.value,
    summaryHeight: summaryHeight.value,
    total: (summaryHeight.value / parentHeight.value) * 100,
  })

  return (summaryHeight.value / parentHeight.value) * 100
})

function toggleDetails(event: ToggleEvent) {
  const detailsElement = event.target as HTMLDetailsElement

  if (detailsElement.open) panel.value?.expand()
  else panel.value?.collapse()
}

const bus = useEventBus(REQUEST_DETAIL_PAYLOAD_SPLITTER_RESIZE_EVENT)

const updateMonacos = () => bus.emit()
</script>

<template>
  <SplitterPanel
    ref="panel"
    :id="name"
    collapsible
    :collapsedSize="variablesPanelMinSize"
    :minSize="variablesPanelMinSize"
    @resize="updateMonacos()"
    v-slot="{ isCollapsed }"
  >
    <details
      :open="!isCollapsed"
      :name
      class="flex flex-col open:details-content:flex-1 min-h-0 overflow-y-auto h-full"
      @toggle="toggleDetails($event)"
    >
      <HeadersSummary ref="summary" :class="{ 'border-t-0': !hasPreviousElement }">
        <slot name="header" />
      </HeadersSummary>

      <slot />
    </details>
  </SplitterPanel>
</template>
