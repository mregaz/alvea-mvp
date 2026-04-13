import type { ResultLevel } from '@/lib/constants'

export interface ResultCTA {
  label: string
  href: string
  style: 'primary' | 'secondary' | 'ghost'
  external?: boolean
}

// Resolved content — all strings already translated, ready to render
export interface ResultContent {
  level: ResultLevel
  badge: string
  title: string
  body: string
  nextStep: string
  disclaimer: string
  lists: ResultList[]   // ordered content sections (observe, contact, attention)
  ctas: ResultCTA[]
}

// A labeled list of items inside a result card
export interface ResultList {
  title: string
  items: string[]
  variant: 'observe' | 'contact' | 'attention'
}

// Config shape (i18n keys, resolved at runtime by the page)
export interface ResultContentConfig {
  level: ResultLevel
  badgeKey: string
  titleKey: string
  bodyKey: string
  nextStepKey: string
  disclaimerKey: string
  lists: {
    titleKey: string
    itemKeys: string[]
    variant: ResultList['variant']
  }[]
  ctas: {
    labelKey: string
    href: string          // {{locale}} placeholder supported
    style: ResultCTA['style']
    external?: boolean
  }[]
}

export type ResultConfigMap = Record<ResultLevel, ResultContentConfig>
