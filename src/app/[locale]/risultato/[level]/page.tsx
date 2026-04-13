import { notFound } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { ResultCard } from '@/components/result/ResultCard'
import { feverResultConfig } from '@/content/symptoms/fever/results'
import { RESULT_LEVELS } from '@/lib/constants'
import type { Locale, ResultLevel } from '@/lib/constants'
import type { ResultContent, ResultConfigMap } from '@/types/result'

interface ResultPageProps {
  params: { locale: string; level: string }
}

// ── Registry ──────────────────────────────────────────────────────────────────
// Future symptom flows register their ResultConfigMap here.
// TODO: derive active symptom from session/cookie when multiple symptoms go live.
const RESULT_REGISTRY: Record<string, ResultConfigMap> = {
  fever: feverResultConfig,
}
const ACTIVE_SYMPTOM = 'fever'

export default async function ResultPage({ params }: ResultPageProps) {
  const locale = params.locale as Locale
  const level  = params.level as ResultLevel

  if (!(RESULT_LEVELS as readonly string[]).includes(level)) notFound()

  const t  = await getTranslations(locale, 'result')
  const tc = await getTranslations(locale, 'common')

  const config = RESULT_REGISTRY[ACTIVE_SYMPTOM][level]

  // Resolve all i18n keys into final strings
  const content: ResultContent = {
    level,
    badge:     t(config.badgeKey),
    title:     t(config.titleKey),
    body:      t(config.bodyKey),
    nextStep:  t(config.nextStepKey),
    disclaimer:t(config.disclaimerKey),
    lists: config.lists.map((list) => ({
      title:   t(list.titleKey),
      items:   list.itemKeys.map((k) => t(k)),
      variant: list.variant,
    })),
    ctas: config.ctas.map((cta) => ({
      label:    t(cta.labelKey),
      href:     cta.href.replace('{{locale}}', locale),
      style:    cta.style,
      external: cta.external,
    })),
  }

  return (
    <ResultCard
      content={content}
      basedOnLabel={t('common.basedOn')}
      restartLabel={t('common.restart')}
      restartHref={`/${locale}/flusso/febbre`}
      notDiagnosisText={t('common.notDiagnosis')}
    />
  )
}
