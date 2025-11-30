<script setup lang="ts">
import { Icon } from '@iconify/vue'

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
    <Icon icon="jam:stop-sign" class="h-4 w-4" />
  </button>
</template>
