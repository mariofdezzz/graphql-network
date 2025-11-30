<script setup lang="ts">
import { onMounted, unref } from 'vue'
import type { Column } from '@/types/components/shared/table/column'

const props = defineProps<Column>()

const emit = defineEmits<{
  (e: 'register', column: Column): void
}>()

onMounted(() => {
  emit('register', unref(props))
})
</script>

<template>
  <slot />
</template>
