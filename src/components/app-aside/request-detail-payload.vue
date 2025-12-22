<script setup lang="ts">
import { useTheme } from '@/composables/monaco/use-theme'
import type { GraphQLRequest } from '@/types/graphql-request'
import { CodeEditor, type MonacoEditorConfig } from 'monaco-editor-vue3'
import { computed, ref } from 'vue'
import HeadersSummary from './request-detail-headers/headers-summary.vue'
import RequestDetailPayloadVariables from './request-detail-payload/request-detail-payload-variables.vue'

const props = defineProps<{
  request: GraphQLRequest
}>()

const showVariableSource = ref(false)

const options: MonacoEditorConfig = {
  readOnly: true,
  minimap: { enabled: false },
  wordWrap: 'on',
}

const payload = computed<{
  query?: string
  variables?: Record<string, any>
  extensions?: Record<string, any>
}>(() => {
  try {
    return JSON.parse(props.request.payload!)
  } catch {
    return {}
  }
})

useTheme(options)
</script>

<template>
  <details v-if="payload.query" open name="query">
    <HeadersSummary class="border-t-0"> Query </HeadersSummary>

    <div class="h-50">
      <CodeEditor :value="payload.query" language="graphql" :options="options" />
    </div>
  </details>

  <details v-if="payload.variables" open name="variables">
    <HeadersSummary :class="{ 'border-t-0': !payload.query }">
      <span>Variables</span>

      <span class="px-5"></span>

      <button
        class="text-on-detail-header-active border border-button-border rounded-xl px-2.5 py-0.5 hover:bg-on-detail-header-hover active:bg-on-button-active"
        @click="showVariableSource = !showVariableSource"
      >
        View Source
      </button>
    </HeadersSummary>

    <div v-if="showVariableSource" class="h-50">
      <CodeEditor
        :value="JSON.stringify(payload.variables, null, 2)"
        language="json"
        :options="options"
      />
    </div>

    <div v-else class="py-2">
      <RequestDetailPayloadVariables :variables="payload.variables" />
    </div>
  </details>

  <details v-if="payload.extensions" open name="extensions">
    <HeadersSummary :class="{ 'border-t-0': !payload.query && !payload.variables }">
      Extensions
    </HeadersSummary>

    <div class="h-50">
      <CodeEditor
        :value="JSON.stringify(payload.extensions, null, 2)"
        language="json"
        :options="options"
      />
    </div>
  </details>
</template>
