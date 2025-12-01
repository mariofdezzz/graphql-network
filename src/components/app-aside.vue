<script setup lang="ts">
import { useRequestDetailStore } from '@/stores/request-detail'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'

const requestDetailStore = useRequestDetailStore()
const { requestDetail } = storeToRefs(requestDetailStore)

useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeDetail()
})

function closeDetail() {
  requestDetail.value = undefined
}
</script>

<template>
  <aside v-if="requestDetail" class="border-l border-on-base-disabled">
    <div class="flex gap-1 px-2 bg-header-base border-b border-on-base-disabled">
      <button
        class="rounded-full hover:bg-on-base-hover active:bg-on-base-active p-1"
        @click="closeDetail()"
        aria-label="Close request detail"
      >
        <Icon icon="material-symbols:close" class="h-4 w-4" />
      </button>

      <div class="flex-1 flex items-stretch" role="tablist">
        <button class="px-2 hover:bg-on-base-hover flex items-center" role="tab">Headers</button>

        <button class="px-2 hover:bg-on-base-hover flex items-center" role="tab">Payload</button>

        <button class="px-2 hover:bg-on-base-hover flex items-center" role="tab  ">Preview</button>

        <button class="px-2 hover:bg-on-base-hover flex items-center" role="tab">Response</button>

        <button class="px-2 hover:bg-on-base-hover flex items-center" role="tab">Initiator</button>

        <button class="px-2 hover:bg-on-base-hover flex items-center" role="tab">Timing</button>
      </div>
    </div>

    {{ requestDetail.name }}
  </aside>
</template>
