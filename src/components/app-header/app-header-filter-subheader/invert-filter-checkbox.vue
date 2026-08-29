<script setup lang="ts">
import { useNetworkStore } from '@/stores/network'
import { storeToRefs } from 'pinia'

const networkStore = useNetworkStore()

const { invertNameFilter } = storeToRefs(networkStore)
</script>

<template>
  <div :title="$t('filter.invert')" class="flex gap-1.5 items-center px-2 text-xs">
    <input type="checkbox" v-model="invertNameFilter" id="invert" name="invert" />

    <label for="invert"> {{ $t('filter.invert') }} </label>
  </div>
</template>
