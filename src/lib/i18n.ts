import type { Locale } from '@/lib/constants'

export type Namespace =
  | 'common'
  | 'home'
  | 'flow'
  | 'fever'
  | 'sintomi'
  | 'come-funziona'
  | 'aiuto-urgente'
  | 'limiti'
  | 'privacy'
  | 'result'
  | 'osservazione'

type Messages = Record<string, unknown>

// Module-level cache — survives across requests in the same server process
const cache = new Map<string, Messages>()

async function loadMessages(locale: Locale, namespace: Namespace): Promise<Messages> {
  const key = `${locale}:${namespace}`
  if (cache.has(key)) return cache.get(key)!

  try {
    const mod = await import(`@/locales/${locale}/${namespace}.json`)
    const messages = mod.default as Messages
    cache.set(key, messages)
    return messages
  } catch {
    // Explicit fallback chain: requested locale → IT → empty object
    if (locale !== 'it') {
      console.warn(`[i18n] Missing ${locale}/${namespace}.json — falling back to IT`)
      return loadMessages('it', namespace)
    }
    console.warn(`[i18n] Missing it/${namespace}.json — returning empty`)
    cache.set(key, {})
    return {}
  }
}

/**
 * Resolve a dot-separated key against a nested messages object.
 * Returns the key string itself if not found — visible in UI, easy to spot.
 */
function resolve(messages: Messages, key: string): string {
  const parts = key.split('.')
  let node: unknown = messages

  for (const part of parts) {
    if (node === null || typeof node !== 'object') return key
    node = (node as Record<string, unknown>)[part]
  }

  return typeof node === 'string' ? node : key
}

/**
 * Load translations for a locale + namespace.
 * Falls back to IT if the requested locale file is missing.
 *
 * Usage (server component):
 *   const t = await getTranslations(locale, 'common')
 *   t('nav.home') // → "Home"
 */
export async function getTranslations(
  locale: Locale,
  namespace: Namespace
): Promise<(key: string) => string> {
  const messages = await loadMessages(locale, namespace)
  return (key: string) => resolve(messages, key)
}
