export const LOCALES = ['it', 'de', 'fr'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'it'

export const RESULT_LEVELS = ['green', 'yellow', 'red'] as const
export type ResultLevel = (typeof RESULT_LEVELS)[number]

export const SYMPTOMS = ['fever'] as const
export type Symptom = (typeof SYMPTOMS)[number]
