<script setup lang="ts">
defineProps<{
  selected: boolean
}>()

defineEmits<{
  (e: 'select', event: PointerEvent): void
}>()
</script>

<template>
  <button
    class="cursor-pointer border border-filter-button-border rounded px-1.5 font-medium"
    :class="[
      selected ? 'bg-filter-button-active border-transparent text-on-filter-button-active' : '',
    ]"
    @click="$emit('select', $event)"
  >
    <slot />
  </button>
</template>
