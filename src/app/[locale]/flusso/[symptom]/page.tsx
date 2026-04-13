import { notFound } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { FlowEngine } from '@/components/flow/FlowEngine'
import { feverFlowConfig } from '@/content/symptoms/fever/flow'
import type { Locale } from '@/lib/constants'
import type { SerializableFlowConfig } from '@/types/flow'

interface FlowPageProps {
  params: { locale: string; symptom: string }
}

const FLOW_REGISTRY: Record<string, SerializableFlowConfig> = {
  febbre: feverFlowConfig,
}

export default async function FlowPage({ params }: FlowPageProps) {
  const locale = params.locale as Locale
  const config = FLOW_REGISTRY[params.symptom]

  if (!config) notFound()

  const tf  = await getTranslations(locale, 'fever')
  const tfl = await getTranslations(locale, 'flow')

  // Resolve ALL strings server-side into a plain Record<string, string>
  // No functions cross the server→client boundary — only serializable data.

  function resolveKey(key: string): string {
    const parts = key.split('.')
    if (parts[0] === 'fever') return tf(parts.slice(1).join('.'))
    if (parts[0] === 'flow')  return tfl(parts.slice(1).join('.'))
    return key
  }

  const allKeys = collectKeys(config)
  const resolved: Record<string, string> = {}
  for (const key of allKeys) {
    resolved[key] = resolveKey(key)
  }

  // FlowStrings: all plain strings, no functions
  const strings = {
    back:          tfl('navigation.back'),
    continue:      tfl('navigation.continue'),
    start:         tfl('navigation.start'),
    required:      tfl('validation.required'),
    requiredMulti: tfl('validation.requiredMulti'),
    multiHint:     tfl('multiSelect.hint'),
    disclaimer:    tfl('disclaimer.reminder'),
    progressLabel: tfl('progress.label'),
    resolved,      // flat lookup table used by FlowEngine instead of a function
  }

  return (
    <FlowEngine
      config={config}
      locale={locale}
      strings={strings}
    />
  )
}

function collectKeys(config: SerializableFlowConfig): string[] {
  const keys = new Set<string>()
  for (const step of config.steps) {
    keys.add(step.questionKey)
    if (step.subtitleKey) keys.add(step.subtitleKey)
    if (step.helpKey) keys.add(step.helpKey)
    for (const opt of step.options ?? []) {
      keys.add(opt.labelKey)
      if (opt.alertKey) keys.add(opt.alertKey)
    }
  }
  keys.add('fever.intro.infoBox')
  keys.add('fever.intro.cta')
  keys.add('fever.transition.cta')
  return Array.from(keys)
}
