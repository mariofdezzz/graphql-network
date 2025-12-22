<script setup lang="ts">
import RecursiveRequestObjectViewer from './recursive-request-object-viewer.vue'

defineProps<{
  object: Record<string, any>
}>()
</script>

<template>
  <RecursiveRequestObjectViewer :object="{ '': object }" :depth="0" />
</template>
