<script setup lang="ts">
import RecordIcon from '@/components/icons/record-icon.vue'
import RecordStopIcon from '@/components/icons/record-stop-icon.vue'

const recording = defineModel('recording', { type: Boolean })
</script>

<template>
  <button
    :title="recording ? $t('appHeader.stopRecording') : $t('appHeader.recordNetwork')"
    class="h-6.5 w-6.5 grid place-items-center rounded-full hover:bg-on-base-hover active:bg-on-base-active"
    @click="recording = !recording"
  >
    <RecordStopIcon v-if="recording" class="h-4.5 w-4.5 text-record-stop" />

    <RecordIcon v-else class="h-4 w-4" />
  </button>
</template>
