<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import { CodeEditor, type MonacoEditorConfig } from 'monaco-editor-vue3'
import { ref } from 'vue'

const props = defineProps<{
  request: GraphQLRequest
}>()

const options: MonacoEditorConfig = {
  readOnly: true,
  minimap: { enabled: false },
  wordWrap: 'on',
}
const response = ref('')

props.request.response((text) => {
  response.value = text
})
</script>

<template>
  <CodeEditor :value="response" language="json" theme="vs-dark" :options="options" />
</template>
