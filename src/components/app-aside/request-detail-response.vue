<script setup lang="ts">
import { useTheme } from '@/composables/monaco/use-theme'
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

useTheme(options)
</script>

<template>
  <CodeEditor :value="response" language="json" :options="options" />
</template>
