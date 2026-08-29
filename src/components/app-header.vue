<script setup lang="ts">
import SharedHorizontalDivider from '@/components/shared/shared-horizontal-divider.vue'
import { useNetworkStore } from '@/stores/network'
import { useLocalStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeaderClear from './app-header/app-header-clear.vue'
import AppHeaderFilterSubheader from './app-header/app-header-filter-subheader.vue'
import AppHeaderFilter from './app-header/app-header-filter.vue'
import AppHeaderPreserveLog from './app-header/app-header-preserve-log.vue'
import AppHeaderRecord from './app-header/app-header-record.vue'
import AppHeaderSettings from './app-header/app-header-settings.vue'
import BugIcon from './icons/bug-icon.vue'

const networkStore = useNetworkStore()
const { recording } = storeToRefs(networkStore)
const { t } = useI18n()

const filterActive = useLocalStorage('filterActive', false)
const preserveLog = ref(false)
</script>

<template>
  <header>
    <div class="flex gap-1.5 items-center px-1 border-b border-on-base-disabled text-on-base-icon">
      <div class="flex gap-0.5 items-center">
        <AppHeaderRecord v-model:recording="recording" />

        <AppHeaderClear @clear="networkStore.clearRequests()" />
      </div>

      <SharedHorizontalDivider />

      <div class="flex gap-0.5 items-center">
        <AppHeaderFilter v-model:filterActive="filterActive" />
      </div>

      <SharedHorizontalDivider />

      <AppHeaderPreserveLog v-model:preserveLog="preserveLog" />

      <div class="flex-1"></div>

      <SharedHorizontalDivider />

      <a
        href="https://github.com/mariofdezzz/graphql-network/issues/new?template=bug_report.md"
        target="_blank"
        rel="noopener noreferrer"
        class="h-6.5 w-6.5 grid place-items-center hover:bg-base-hover rounded transition-colors"
        :title="t('buttons.reportIssue')"
      >
        <BugIcon class="h-5 w-5" />
      </a>

      <AppHeaderSettings />
    </div>

    <AppHeaderFilterSubheader v-if="filterActive" />
  </header>
</template>
