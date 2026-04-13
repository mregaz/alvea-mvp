/**
 * symptoms.ts — single source of truth for the symptom list.
 * Used by homepage symptom grid and sintomi page.
 * Activate a symptom by setting active: true and providing a slug.
 */

export type SymptomKey = 'fever' | 'cough' | 'vomiting' | 'throat' | 'rash' | 'earache'

export interface SymptomEntry {
  key: SymptomKey
  icon: string
  slug: string        // URL slug used in /flusso/[symptom]
  active: boolean
}

export const SYMPTOMS: SymptomEntry[] = [
  { key: 'fever',    icon: '🌡️', slug: 'febbre',   active: true  },
  { key: 'cough',    icon: '😮‍💨', slug: 'tosse',    active: false },
  { key: 'vomiting', icon: '🤢',  slug: 'vomito',   active: false },
  { key: 'throat',   icon: '🫁',  slug: 'gola',     active: false },
  { key: 'rash',     icon: '🩺',  slug: 'rash',     active: false },
  { key: 'earache',  icon: '👂',  slug: 'orecchio', active: false },
]
