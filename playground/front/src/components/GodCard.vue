<script setup lang="ts">
interface God {
  id: string
  name: string
  domain: string
  symbol: string
  romanEquivalent: string
  parent: string | null
  description: string
}

defineProps<{
  god: God
}>()
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
  >
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-2xl font-bold text-gray-800">{{ god.name }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ god.romanEquivalent }} (Roman)</p>
      </div>
      <div class="text-3xl">{{ god.symbol }}</div>
    </div>

    <div class="space-y-3">
      <div>
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Domain</p>
        <p class="text-gray-700">{{ god.domain }}</p>
      </div>

      <div v-if="god.parent" class="pt-2 border-t border-gray-200">
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Parent</p>
        <p class="text-gray-700">{{ god.parent }}</p>
      </div>

      <div class="pt-2 border-t border-gray-200">
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">About</p>
        <p class="text-gray-600 text-sm leading-relaxed">{{ god.description }}</p>
      </div>
    </div>
  </div>
</template>
