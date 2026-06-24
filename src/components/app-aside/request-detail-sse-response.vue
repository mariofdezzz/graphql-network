<script setup lang="ts">
import { useLayout } from '@/composables/contexts/monaco/use-layout'
import { useTheme } from '@/composables/contexts/monaco/use-theme'
import type { GraphQLSubscriptionRequest } from '@/types/graphql-request'
import { CodeEditor, type MonacoEditorConfig } from 'monaco-editor-vue3'
import { ref, toRefs, unref, watchEffect } from 'vue'
import RequestDetailFallbackTab from './request-detail-fallback-tab.vue'

const props = defineProps<{
  request: GraphQLSubscriptionRequest
  enabled: boolean
}>()
const { enabled, request } = toRefs(props)

const { onEditorDidMount } = useLayout(enabled, request)

const options: MonacoEditorConfig = {
  readOnly: true,
  minimap: { enabled: false },
  wordWrap: 'on',
}

useTheme(options)

const rawStream = ref('')

watchEffect(() => {
  rawStream.value = unref(props.request.rawEventStream) ?? ''
})
</script>

<template>
  <CodeEditor
    v-if="rawStream"
    :value="rawStream"
    language="text"
    :options="options"
    @editorDidMount="onEditorDidMount"
  />

  <RequestDetailFallbackTab v-else> No event stream data received yet </RequestDetailFallbackTab>
</template>
