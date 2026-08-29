<script setup lang="ts">
import { useNetworkStore } from '@/stores/network'
import { storeToRefs } from 'pinia'

const networkStore = useNetworkStore()
const { preserveLog } = storeToRefs(networkStore)
</script>

<template>
  <div :title="$t('tooltips.preserveLog')" class="flex gap-1.5 items-center px-2 text-xs">
    <input type="checkbox" v-model="preserveLog" id="preserve-log" name="preserve-log" />

    <label for="preserve-log"> {{ $t('filter.preserveLog') }} </label>
  </div>
</template>
