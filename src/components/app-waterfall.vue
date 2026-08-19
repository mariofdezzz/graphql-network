<script setup lang="ts">
import { useRequestsData } from '@/composables/components/app-waterfall/use-requests-data'
import { options } from '@/logic/components/app-waterfall/options'
import { plugins } from '@/logic/components/app-waterfall/plugins'
import { Bar } from 'vue-chartjs'

const { data } = useRequestsData()
</script>

<template>
  <div class="h-18! border-b border-on-base-disabled">
    <Bar :options :data :plugins />
  </div>
</template>
