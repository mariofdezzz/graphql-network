<script setup lang="ts">
import type { Column } from '@/types/components/shared/table/column'

defineProps<Column>()

defineSlots<{
  default: (props: { row: any }) => any
}>()

defineEmits<{
  click: (event: any) => void // TODO generic
}>()
</script>

<template>
  <slot v-if="false" :row="undefined" />
</template>
