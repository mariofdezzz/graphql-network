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
    class="cursor-pointer border border-[#c7c7c7] rounded px-1.5 font-medium"
    :class="[selected ? 'bg-blue-200 border-transparent' : '']"
    @click="$emit('select', $event)"
  >
    <slot />
  </button>
</template>
