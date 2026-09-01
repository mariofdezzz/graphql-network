<script setup lang="ts">
import { AVAILABLE_LANGUAGES } from '@/constants/available-languages'
import { SETTINGS_DIALOG_CLOSED_EVENT, SETTINGS_DIALOG_OPENED_EVENT } from '@/constants/events.ts'
import { useSettingsStore } from '@/stores/settings.ts'
import { useEventBus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useTemplateRef, watch } from 'vue'
import CloseIcon from './icons/close-icon.vue'

const open = defineModel<boolean>('open')

const settingsStore = useSettingsStore()
const { language } = storeToRefs(settingsStore)

const openedSettingsEvent = useEventBus(SETTINGS_DIALOG_OPENED_EVENT)
const closedSettingsEvent = useEventBus(SETTINGS_DIALOG_CLOSED_EVENT)

const dialog = useTemplateRef('dialog')

watch(
  open,
  (open) => {
    if (open) {
      dialog.value?.showModal()
      openedSettingsEvent.emit()
    } else {
      dialog.value?.close()
      closedSettingsEvent.emit()
    }
  },
  { immediate: true },
)
</script>

<template>
  <dialog
    ref="dialog"
    class="relative w-full h-full max-w-none max-h-none bg-base-color text-on-base"
  >
    <button
      :title="$t('close')"
      @click="open = false"
      class="absolute top-2 right-2 rounded-full p-1 hover:bg-on-base-hover active:bg-on-base-active"
    >
      <CloseIcon class="h-4.5 w-4.5 text-on-base-icon" />
    </button>

    <div class="grid h-full grid-cols-[auto_1fr] p-2">
      <h1 class="text-2xl px-3 py-1">{{ $t('settings.title') }}</h1>

      <div class="flex flex-col items-center gap-8 py-12">
        <section class="flex flex-col gap-2">
          <h2 class="text-base">{{ $t('settings.appearance') }}</h2>

          <div
            class="w-134 bg-settings-panel rounded-lg px-4 py-6 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
          >
            <label for="locale"> {{ $t('settings.language') }}: </label>

            <select
              v-model="language"
              id="locale"
              class="w-full max-w-50 px-0.5 py-1 mx-3 my-1 rounded border border-filter-button-border"
            >
              <option
                v-for="locale in AVAILABLE_LANGUAGES"
                :key="`locale-${locale}`"
                :value="locale"
              >
                {{ locale }}
              </option>
            </select>
          </div>
        </section>
      </div>
    </div>
  </dialog>
</template>
