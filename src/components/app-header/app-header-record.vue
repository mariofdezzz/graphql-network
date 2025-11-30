<script setup lang="ts">
import { Icon } from '@iconify/vue'

const recording = defineModel('recording', { type: Boolean })
</script>

<template>
  <button
    :title="recording ? 'Stop recording network log - ⌘ E' : 'Record network log - ⌘ E'"
    class="rounded-full hover:bg-on-base-hover active:bg-on-base-active p-1"
    @click="recording = !recording"
  >
    <Icon v-if="recording" icon="fluent:record-stop-16-regular" class="h-4 w-4 text-red-400" />

    <Icon v-else icon="fluent:record-16-regular" class="h-4 w-4" />
  </button>
</template>
