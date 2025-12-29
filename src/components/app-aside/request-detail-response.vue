<script setup lang="ts">
import { useLayout } from '@/composables/monaco/use-layout'
import { useTheme } from '@/composables/monaco/use-theme'
import type { GraphQLRequest } from '@/types/graphql-request'
import { CodeEditor, type MonacoEditorConfig } from 'monaco-editor-vue3'
import { toRefs } from 'vue'
import RequestDetailFallbackTab from './request-detail-fallback-tab.vue'

const props = defineProps<{
  request: GraphQLRequest
  enabled: boolean
}>()
const { enabled } = toRefs(props)

const { onEditorDidMount } = useLayout(enabled)

const options: MonacoEditorConfig = {
  readOnly: true,
  minimap: { enabled: false },
  wordWrap: 'on',
}

useTheme(options)
</script>

<template>
  <CodeEditor
    v-if="request.response"
    :value="JSON.stringify(request.response, null, 2)"
    language="json"
    :options="options"
    @editorDidMount="onEditorDidMount"
  />

  <RequestDetailFallbackTab v-else> Failed to load response data </RequestDetailFallbackTab>
</template>
