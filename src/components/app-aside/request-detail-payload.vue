<script setup lang="ts">
import { useLayout } from '@/composables/contexts/monaco/use-layout'
import { useTheme } from '@/composables/contexts/monaco/use-theme'
import type { FileMetadata, GraphQLNetworkRequest, GraphQLRequest } from '@/types/graphql-request'
import { CodeEditor, type MonacoEditorConfig } from 'monaco-editor-vue3'
import { computed, ref, toRefs } from 'vue'
import HeadersSummary from './request-detail-headers/headers-summary.vue'
import RequestObjectViewer from './request-detail-payload/request-object-viewer.vue'

const props = defineProps<{
  request: GraphQLRequest
  enabled: boolean
}>()
const { enabled, request } = toRefs(props)

const { onEditorDidMount } = useLayout(enabled, request)

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

const sectionsCount = computed(() => {
  let count = 0
  if (payload.value.query) count++
  if (payload.value.variables && Object.keys(payload.value.variables).length > 0) count++
  if (payload.value.extensions && Object.keys(payload.value.extensions).length > 0) count++
  if (files.value && files.value.length > 0) count++
  return count
})

const gridTemplateRows = computed(() => {
  return `grid-template-rows: repeat(${sectionsCount.value}, 1fr)`
})

useTheme(options)

const files = computed<FileMetadata[] | undefined>(() => {
  const req = props.request as GraphQLNetworkRequest
  return req.files && req.files.length > 0 ? req.files : undefined
})
</script>

<template>
  <div v-if="!request.payload"></div>

  <div class="h-full grid" :style="[gridTemplateRows]" v-else>
    <details
      v-if="payload.query"
      open
      name="query"
      class="flex flex-col open:details-content:flex-1 min-h-0 overflow-y-auto"
    >
      <HeadersSummary class="border-t-0"> Query </HeadersSummary>

      <CodeEditor
        :value="payload.query"
        language="graphql"
        :options="options"
        @editorDidMount="onEditorDidMount"
      />
    </details>

    <details
      v-if="payload.variables && Object.keys(payload.variables).length > 0"
      open
      name="variables"
      class="flex flex-col open:details-content:flex-1 min-h-0 overflow-y-auto"
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

      <template v-if="showVariableSource">
        <CodeEditor
          :value="JSON.stringify(payload.variables, null, 2)"
          language="json"
          :options="options"
        />
      </template>

      <div v-else class="py-2">
        <RequestObjectViewer :object="payload.variables" />
      </div>
    </details>

    <details
      v-if="payload.extensions && Object.keys(payload.extensions).length > 0"
      open
      name="extensions"
      class="flex flex-col open:details-content:flex-1 min-h-0 overflow-y-auto"
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

      <template v-if="showExtensionsSource">
        <CodeEditor
          :value="JSON.stringify(payload.extensions, null, 2)"
          language="json"
          :options="options"
        />
      </template>

      <div v-else class="py-2">
        <RequestObjectViewer :object="payload.extensions" />
      </div>
    </details>

    <details
      v-if="files && files.length > 0"
      open
      name="files"
      class="flex flex-col open:details-content:flex-1 min-h-0 overflow-y-auto"
    >
      <HeadersSummary
        :class="{
          'border-t-0': !payload.query && !payload.variables && !payload.extensions,
        }"
      >
        Files
      </HeadersSummary>

      <ul class="py-2 px-3 space-y-1">
        <li v-for="file in files" :key="file.name" class="flex items-start gap-2 text-xs font-mono">
          <span class="text-object-key shrink-0">{{ file.name }}</span>
          <span class="text-muted-foreground">
            {{ file.fileName ?? '(no filename)' }}
            <template v-if="file.contentType">
              &middot; <span class="opacity-70">{{ file.contentType }}</span>
            </template>
          </span>
        </li>
      </ul>
    </details>
  </div>
</template>
