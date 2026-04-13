import { getTranslations } from '@/lib/i18n'
import { SymptomCard } from '@/components/ui/SymptomCard'
import { UrgentHelpBox } from '@/components/ui/UrgentHelpBox'
import { SYMPTOMS } from '@/lib/symptoms'
import type { Locale } from '@/lib/constants'

interface PageProps {
  params: { locale: string }
}

export default async function SintomiPage({ params }: PageProps) {
  const locale = params.locale as Locale
  const t  = await getTranslations(locale, 'sintomi')
  const tc = await getTranslations(locale, 'common')

  return (
    <div className="flex flex-col gap-8 py-4">

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight leading-snug">
          {t('title')}
        </h1>
        <p className="text-slate-500 leading-relaxed text-sm">
          {t('subtitle')}
        </p>
      </div>

      {/* ── Symptom list — uses shared SYMPTOMS registry ─────────── */}
      <div className="flex flex-col gap-3" role="list">
        {SYMPTOMS.map(({ key, icon, slug, active }) => {
          const label       = t(`symptoms.${key}.label`)
          const description = t(`symptoms.${key}.description`)

          if (active) {
            return (
              <div key={key} role="listitem">
                <SymptomCard
                  active={true}
                  icon={icon}
                  label={label}
                  description={description}
                  href={`/${locale}/flusso/${slug}`}
                  ctaLabel={t('startFlow')}
                />
              </div>
            )
          }

          return (
            <div key={key} role="listitem">
              <SymptomCard
                active={false}
                icon={icon}
                label={label}
                description={description}
                comingSoonLabel={t('comingSoon')}
              />
            </div>
          )
        })}
      </div>

      {/* ── Urgent help safety box ───────────────────────────────── */}
      <UrgentHelpBox
        title={t('urgentBox.title')}
        body={t('urgentBox.body')}
        ctaLabel={t('urgentBox.cta')}
        ctaHref={`/${locale}/aiuto-urgente`}
        emergencyLabel={t('urgentBox.emergency')}
      />

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <p className="text-xs text-slate-400 leading-relaxed text-center">
        {t('disclaimer')}
      </p>

    </div>
  )
}
