<script setup lang="ts">
import { useRequestsData } from '@/composables/components/app-waterfall/use-requests-data'
import { useWaterfallOptions } from '@/logic/components/app-waterfall/options'
import { usePlugins } from '@/logic/components/app-waterfall/plugins'
import { Bar } from 'vue-chartjs'

const { data } = useRequestsData()
const { options } = useWaterfallOptions(data)
const { plugins } = usePlugins()
</script>

<template>
  <div class="h-20! border-b border-on-base-disabled">
    <Bar :options :data :plugins />
  </div>
</template>
