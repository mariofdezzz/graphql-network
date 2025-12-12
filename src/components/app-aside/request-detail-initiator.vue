<script setup lang="ts">
import type { GraphQLRequest } from '@/types/graphql-request'
import { computed } from 'vue'

const props = defineProps<{
  request: GraphQLRequest
}>()

const stack = computed(() => {
  return props.request.initiator.stack.callFrames
})
</script>

<template>
  <div>
    <details open name="call-stack">
      <summary class="px-4 py-1.5 font-bold cursor-default">
        <span class="px-1">Request call stack</span>
      </summary>

      <div class="px-12">
        <div class="grid grid-cols-[auto_auto_auto] gap-x-2 gap-y-1 w-0">
          <template v-for="(entry, index) in stack" :key="index">
            <span>{{ entry.functionName ? entry.functionName : '(anonymous)' }}</span>

            <span>@</span>

            <a :href="entry.url" class="underline text-blue-600 dark:text-blue-200">{{
              entry.functionName + ':' + entry.lineNumber
            }}</a>
          </template>
        </div>
      </div>
    </details>
  </div>
</template>
