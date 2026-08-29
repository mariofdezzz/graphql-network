import type { AvailableLanguages, AvailableLocales } from '@/constants/available-languages'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export const useSettingsStore = defineStore('settings', () => {
  const { locale } = useI18n()

  const language = useLocalStorage<AvailableLanguages>('language', 'auto')
  const detectedLanguage = chrome.i18n.getUILanguage() as AvailableLocales

  const effectiveLanguage = computed<AvailableLocales>(() =>
    language.value === 'auto' ? detectedLanguage : language.value,
  )

  watch(
    effectiveLanguage,
    (language) => {
      locale.value = language
    },
    { immediate: true },
  )

  return {
    language,
    detectedLanguage,
    effectiveLanguage,
  }
})
