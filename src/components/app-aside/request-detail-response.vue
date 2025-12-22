<script setup lang="ts">
import { useTheme } from '@/composables/monaco/use-theme'
import type { GraphQLRequest } from '@/types/graphql-request'
import { CodeEditor, type MonacoEditorConfig } from 'monaco-editor-vue3'

defineProps<{
  request: GraphQLRequest
}>()

const options: MonacoEditorConfig = {
  readOnly: true,
  minimap: { enabled: false },
  wordWrap: 'on',
}

useTheme(options)
</script>

<template>
  <CodeEditor :value="request.response" language="json" :options="options" />
</template>
