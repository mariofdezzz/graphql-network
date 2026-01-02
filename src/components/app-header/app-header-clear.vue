<script setup lang="ts">
import StopIcon from '@/components/icons/stop-icon.vue'

defineEmits<{
  (e: 'clear', value: void): void
}>()
</script>

<template>
  <button
    title="Clear network log  - Ctrl L - ⌘ K"
    class="rounded-full hover:bg-on-base-hover active:bg-on-base-active p-1"
    @click="$emit('clear')"
  >
    <StopIcon class="h-4 w-4" />
  </button>
</template>
