<script setup lang="ts">
withDefaults(
  defineProps<{
    defaultSize?: number
    unit?: '%' | 'px'
    relativeSize?: number
  }>(),
  {
    unit: '%',
  },
)
</script>

<template>
  <div>
    <slot />
  </div>
</template>
