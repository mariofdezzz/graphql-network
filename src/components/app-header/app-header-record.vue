<script setup lang="ts">
import RecordStopIcon from '@/components/icons/record-stop-icon.vue'
import RecordIcon from '@/components/icons/record-icon.vue'

const recording = defineModel('recording', { type: Boolean })
</script>

<template>
  <button
    :title="recording ? 'Stop recording network log - ⌘ E' : 'Record network log - ⌘ E'"
    class="rounded-full hover:bg-on-base-hover active:bg-on-base-active p-1"
    @click="recording = !recording"
  >
    <RecordStopIcon v-if="recording" class="h-4 w-4 text-red-400" />

    <RecordIcon v-else class="h-4 w-4" />
  </button>
</template>
