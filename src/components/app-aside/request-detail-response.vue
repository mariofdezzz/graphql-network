<script setup lang="ts">
import { useLayout } from '@/composables/contexts/monaco/use-layout'
import { useTheme } from '@/composables/contexts/monaco/use-theme'
import type { GraphQLNetworkRequest } from '@/types/graphql-request'
import { CodeEditor, type MonacoEditorConfig } from 'monaco-editor-vue3'
import { toRefs } from 'vue'
import RequestDetailFallbackTab from './request-detail-fallback-tab.vue'

const props = defineProps<{
  request: GraphQLNetworkRequest
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
</script>

<template>
  <CodeEditor
    v-if="request.response"
    :value="JSON.stringify(request.response, null, 2)"
    language="json"
    :options="options"
    @editorDidMount="onEditorDidMount"
  />

  <RequestDetailFallbackTab v-else> {{ $t('preview.failedToLoad') }} </RequestDetailFallbackTab>
</template>
