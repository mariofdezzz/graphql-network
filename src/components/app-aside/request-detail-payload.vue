<script setup lang="ts">
import { useLayout } from '@/composables/contexts/monaco/use-layout'
import { useTheme } from '@/composables/contexts/monaco/use-theme'
import type { GraphQLNetworkRequest } from '@/types/graphql-request'
import { CodeEditor, type MonacoEditorConfig } from 'monaco-editor-vue3'
import { computed, ref, toRefs } from 'vue'
import HeadersSummary from './request-detail-headers/headers-summary.vue'
import RequestObjectViewer from './request-detail-payload/request-object-viewer.vue'

const props = defineProps<{
  request: GraphQLNetworkRequest
  enabled: boolean
}>()
const { enabled } = toRefs(props)

const { onEditorDidMount } = useLayout(enabled)

const showVariableSource = ref(false)
const showExtensionsSource = ref(false)

const options: MonacoEditorConfig = {
  readOnly: true,
  minimap: { enabled: false },
  wordWrap: 'on',
}

const payload = computed<{
  query?: string
  variables?: Record<string, any>
  extensions?: Record<string, any>
}>(() => props.request.payload ?? {})

useTheme(options)
</script>

<template>
  <div v-if="!request.payload"></div>

  <template v-else>
    <details v-if="payload.query" open name="query">
      <HeadersSummary class="border-t-0"> Query </HeadersSummary>

      <div class="h-50">
        <CodeEditor
          :value="payload.query"
          language="graphql"
          :options="options"
          @editorDidMount="onEditorDidMount"
        />
      </div>
    </details>

    <details
      v-if="payload.variables && Object.keys(payload.variables).length > 0"
      open
      name="variables"
    >
      <HeadersSummary :class="{ 'border-t-0': !payload.query }">
        <span>Variables</span>

        <span class="px-5"></span>

        <button
          class="text-on-detail-header-active border border-button-border rounded-xl px-2.5 py-0.5 hover:bg-on-detail-header-hover active:bg-on-button-active"
          @click="showVariableSource = !showVariableSource"
        >
          {{ showVariableSource ? 'View parsed' : 'View source' }}
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
        <RequestObjectViewer :object="payload.variables" />
      </div>
    </details>

    <details
      v-if="payload.extensions && Object.keys(payload.extensions).length > 0"
      open
      name="extensions"
    >
      <HeadersSummary :class="{ 'border-t-0': !payload.query && !payload.variables }">
        Extensions
        <span class="px-5"></span>

        <button
          class="text-on-detail-header-active border border-button-border rounded-xl px-2.5 py-0.5 hover:bg-on-detail-header-hover active:bg-on-button-active"
          @click="showExtensionsSource = !showExtensionsSource"
        >
          {{ showExtensionsSource ? 'View parsed' : 'View source' }}
        </button>
      </HeadersSummary>

      <div v-if="showExtensionsSource" class="h-50">
        <CodeEditor
          :value="JSON.stringify(payload.extensions, null, 2)"
          language="json"
          :options="options"
        />
      </div>

      <div v-else class="py-2">
        <RequestObjectViewer :object="payload.extensions" />
      </div>
    </details>
  </template>
</template>
