<script setup lang="ts">
import { ref } from 'vue'
import AppSettings from '../app-settings.vue'
import SettingsIcon from '../icons/settings-icon.vue'

const settingsOpen = ref(false)
</script>

<template>
  <button
    :title="$t('settings')"
    class="h-6.5 w-6.5 grid place-items-center rounded-full hover:bg-on-base-hover active:bg-on-base-active"
    @click="settingsOpen = true"
  >
    <SettingsIcon class="h-5 w-5" />
  </button>

  <AppSettings v-model:open="settingsOpen" />
</template>
