<script setup lang="ts">
import { useLayout } from '@/composables/contexts/monaco/use-layout'
import { useTheme } from '@/composables/contexts/monaco/use-theme'
import { PAYLOAD_SPLITTER_ID } from '@/constants/splitters.ts'
import type { FileMetadata, GraphQLNetworkRequest, GraphQLRequest } from '@/types/graphql-request'
import { CodeEditor, type MonacoEditorConfig } from 'monaco-editor-vue3'
import { SplitterGroup, SplitterResizeHandle } from 'reka-ui'
import { computed, ref, toRefs, useTemplateRef } from 'vue'
import CollapsibleSplitterPanel from './request-detail-payload/collapsible-splitter-panel.vue'
import RequestObjectViewer from './request-detail-payload/request-object-viewer.vue'

const props = defineProps<{
  request: GraphQLRequest
  enabled: boolean
}>()
const { enabled, request } = toRefs(props)

const { onEditorDidMount } = useLayout(enabled, request)

const parent = useTemplateRef('parent')
const showVariableSource = ref(false)
const showExtensionsSource = ref(false)

const options: MonacoEditorConfig = {
  readOnly: true,
  minimap: { enabled: false },
  wordWrap: 'on',
}
useTheme(options)

const payload = computed<{
  query?: string
  variables?: Record<string, any>
  extensions?: Record<string, any>
}>(() => props.request.payload ?? {})

const showQuery = computed(() => Boolean(payload.value.query))
const showVariables = computed(() =>
  Boolean(payload.value.variables && Object.keys(payload.value.variables).length > 0),
)
const showExtensions = computed(() =>
  Boolean(payload.value.extensions && Object.keys(payload.value.extensions).length > 0),
)

const files = computed<FileMetadata[] | undefined>(() => {
  const req = props.request as GraphQLNetworkRequest
  return req.files && req.files.length > 0 ? req.files : undefined
})
</script>

<template>
  <div v-if="!request.payload"></div>

  <!-- <div class="h-full grid" :style="[gridTemplateRows]" v-else> -->

  <SplitterGroup
    v-else
    :id="PAYLOAD_SPLITTER_ID"
    direction="vertical"
    :autoSaveId="PAYLOAD_SPLITTER_ID"
    class="flex-1 min-h-0"
    ref="parent"
  >
    <CollapsibleSplitterPanel
      v-if="showQuery"
      name="query"
      :hasPreviousElement="false"
      :parentElement="parent"
    >
      <template #header>
        <span>{{ $t('payload.query') }}</span>
      </template>

      <CodeEditor
        :value="payload.query"
        language="graphql"
        :options="options"
        @editorDidMount="onEditorDidMount"
      />
    </CollapsibleSplitterPanel>

    <SplitterResizeHandle v-if="showQuery" />

    <CollapsibleSplitterPanel
      v-if="showVariables"
      name="variables"
      :hasPreviousElement="showQuery"
      :parentElement="parent"
    >
      <template #header>
        <span>{{ $t('payload.variables') }}</span>

        <span class="px-5"></span>

        <button
          class="text-on-detail-header-active border border-button-border rounded-xl px-2.5 py-0.5 hover:bg-on-detail-header-hover active:bg-on-button-active"
          @click="showVariableSource = !showVariableSource"
        >
          {{ showVariableSource ? $t('payload.viewParsed') : $t('payload.viewSource') }}
        </button>
      </template>

      <template v-if="showVariableSource">
        <CodeEditor
          :value="JSON.stringify(payload.variables, null, 2)"
          language="json"
          :options="options"
          @editorDidMount="onEditorDidMount"
        />
      </template>

      <div v-else class="py-2">
        <RequestObjectViewer :object="payload.variables!" />
      </div>
    </CollapsibleSplitterPanel>

    <SplitterResizeHandle v-if="showVariables" />

    <CollapsibleSplitterPanel
      v-if="payload.extensions && Object.keys(payload.extensions).length > 0"
      name="extensions"
      :hasPreviousElement="showQuery || showVariables"
      :parentElement="parent"
    >
      <template #header>
        <span>{{ $t('payload.extensions') }}</span>

        <span class="px-5"></span>

        <button
          class="text-on-detail-header-active border border-button-border rounded-xl px-2.5 py-0.5 hover:bg-on-detail-header-hover active:bg-on-button-active"
          @click="showExtensionsSource = !showExtensionsSource"
        >
          {{ showExtensionsSource ? $t('payload.viewParsed') : $t('payload.viewSource') }}
        </button>
      </template>

      <template v-if="showExtensionsSource">
        <CodeEditor
          :value="JSON.stringify(payload.extensions, null, 2)"
          language="json"
          :options="options"
          @editorDidMount="onEditorDidMount"
        />
      </template>

      <div v-else class="py-2">
        <RequestObjectViewer :object="payload.extensions" />
      </div>
    </CollapsibleSplitterPanel>

    <SplitterResizeHandle v-if="payload.extensions && Object.keys(payload.extensions).length > 0" />

    <CollapsibleSplitterPanel
      v-if="files && files.length > 0"
      name="files"
      :hasPreviousElement="showQuery || showVariables || showExtensions"
      :parentElement="parent"
    >
      <template #header>
        <span>{{ $t('payload.files') }}</span>
      </template>

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
    </CollapsibleSplitterPanel>
  </SplitterGroup>
  <!-- </div> -->
</template>
