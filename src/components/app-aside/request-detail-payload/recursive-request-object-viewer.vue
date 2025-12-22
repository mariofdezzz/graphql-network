<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  object: Record<string, any>
  depth: number
}>()

const toggled = ref(
  Object.entries(props.object)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([key, value]) => value !== null && typeof value === 'object')
    .map(([key]) => key),
)

function textColor(value: any) {
  if (typeof value === 'number' || value === null) {
    return 'text-object-value-number'
  } else if (typeof value === 'string') {
    return 'text-object-value-text'
  }
  return ''
}

function formatValue(value: any) {
  if (value === null) return 'null'
  if (typeof value === 'number') return value
  if (Array.isArray(value)) return '[…]'
  if (typeof value === 'object') return '{…}'

  return `"${value}"`
}

const style = computed(() => 'padding-left: ' + (1 + props.depth * 1) + 'rem;')

function toggle(key: string) {
  if (toggled.value.includes(key)) {
    toggled.value.splice(toggled.value.indexOf(key), 1)
  } else {
    toggled.value.push(key)
  }
}
</script>

<template>
  <div v-for="([key, value], index) in Object.entries(object)" :key="index">
    <div class="hover:bg-on-base-hover cursor-default font-mono" :style>
      <div class="flex items-center">
        <Icon
          :icon="
            toggled.includes(key)
              ? 'material-symbols:arrow-drop-down'
              : 'material-symbols:arrow-right'
          "
          class="h-4 w-4"
          :class="{ invisible: !(value && typeof value === 'object') }"
          @click="toggle(key)"
        />

        <div>
          <span v-if="key">
            <span class="text-object-key"> {{ key }} </span>:
          </span>
          <span :class="[textColor(value)]">{{ formatValue(value) }}</span>
        </div>
      </div>
    </div>

    <div v-if="toggled.includes(key)">
      <RecursiveRequestObjectViewer :object="value" :depth="depth + 1" />
    </div>
  </div>
</template>
