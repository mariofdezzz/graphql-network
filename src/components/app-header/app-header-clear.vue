<script setup lang="ts">
import StopIcon from '@/components/icons/stop-icon.vue'

defineEmits<{
  (e: 'clear', value: void): void
}>()
</script>

<template>
  <button
    :title="$t('tooltips.clear')"
    class="h-6.5 w-6.5 grid place-items-center rounded-full hover:bg-on-base-hover active:bg-on-base-active"
    @click="$emit('clear')"
  >
    <StopIcon class="h-4.5 w-4.5" />
  </button>
</template>
