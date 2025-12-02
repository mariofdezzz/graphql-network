<script setup lang="ts">
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
</script>

<template>
  <CodeEditor :value="request.payload" language="json" theme="vs-dark" :options="options" />
</template>
