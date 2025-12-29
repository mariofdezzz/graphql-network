<script setup lang="ts">
import type { CallFrame, Stack } from '@/types/graphql-request'

defineProps<{
  stack: Stack
}>()

function openLocation({ url, lineNumber, columnNumber }: CallFrame) {
  chrome.devtools.panels.openResource(url, lineNumber, columnNumber)
}
</script>

<template>
  <h4 v-if="stack.description" class="col-span-3 font-bold">{{ stack.description }}</h4>

  <template v-for="(frame, index) in stack.callFrames" :key="index">
    <span>{{ frame.functionName ? frame.functionName : '(anonymous)' }}</span>

    <span>@</span>

    <span
      class="underline text-blue-600 dark:text-blue-200 cursor-pointer"
      :title="frame.url + ':' + frame.lineNumber"
      aria-label="Source location"
      @click="openLocation(frame)"
    >
      {{ frame.url.split('/').at(-1) + ':' + frame.lineNumber }}
    </span>
  </template>

  <RequestDetailInitiatorStack v-if="stack.parent" :stack="stack.parent" />
</template>
