<script setup lang="ts">
const selected = defineModel<string>()

const tabs = [
  'Headers',
  'Payload',
  // 'Preview',
  'Response',
  // 'Initiator',
  // 'Timing',
  // 'Cookies' // TODO
]
</script>

<template>
  <div class="flex-1 flex items-stretch font-medium relative" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab"
      class="px-2 hover:bg-on-base-hover flex items-center border-b border-transparent"
      :class="{ 'text-on-header-active border-on-header-active!': selected === tab }"
      role="tab"
      :aria-selected="selected === tab"
      @click="selected = tab"
    >
      {{ tab }}
    </button>
  </div>
</template>
