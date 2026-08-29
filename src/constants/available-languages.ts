export const AVAILABLE_LOCALES = ['en', 'es'] as const

export const AVAILABLE_LANGUAGES = ['auto', ...AVAILABLE_LOCALES] as const

export type AvailableLocales = (typeof AVAILABLE_LOCALES)[number]

export type AvailableLanguages = (typeof AVAILABLE_LANGUAGES)[number]
