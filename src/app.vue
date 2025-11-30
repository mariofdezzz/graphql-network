<script setup lang="ts">
import AppHeader from '@/components/app-header.vue'
import { useGraphqlNetwork } from '@/composables/use-graphql-network'
import { ref } from 'vue'
import AppMain from '@/components/app-main.vue'
import AppFooter from '@/components/app-footer.vue'

const { requests } = useGraphqlNetwork()
const recording = ref(true)
</script>

<template>
  <div class="h-full bg-base text-on-base flex flex-col text-xs">
    <AppHeader v-model:recording="recording" />

    <!-- <WaterfallTimeline :requests /> -->

    <AppMain class="flex-1" :requests />

    <AppFooter :requests />
  </div>
</template>
