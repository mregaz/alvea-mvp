import { getTranslations } from '@/lib/i18n'
import { Disclaimer } from '@/components/ui/Disclaimer'
import type { Locale } from '@/lib/constants'

interface PageProps {
  params: { locale: string }
}

export default async function AiutoUrgentePage({ params }: PageProps) {
  const locale = params.locale as Locale
  const t = await getTranslations(locale, 'aiuto-urgente')
  const tc = await getTranslations(locale, 'common')

  const emergencySigns = [
    t('emergency.sign1'),
    t('emergency.sign2'),
    t('emergency.sign3'),
    t('emergency.sign4'),
    t('emergency.sign5'),
    t('emergency.sign6'),
  ]

  const pediatricianSigns = [
    t('pediatrician.sign1'),
    t('pediatrician.sign2'),
    t('pediatrician.sign3'),
    t('pediatrician.sign4'),
  ]

  return (
    <div className="flex flex-col gap-8 py-4">

      <div>
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">
          {t('title')}
        </h1>
        <p className="text-slate-500 leading-relaxed">{t('intro')}</p>
      </div>

      {/* Emergency block */}
      <div className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden">
        <div className="bg-red-600 px-5 py-4 flex items-center gap-3">
          <span className="text-xl">🚨</span>
          <p className="text-white font-semibold">{t('emergency.title')}</p>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4">
          <p className="text-sm text-red-800 font-medium">{t('emergency.description')}</p>
          <ul className="flex flex-col gap-2">
            {emergencySigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-red-700">
                <span className="mt-0.5 shrink-0 text-red-400">—</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
          <a
            href="tel:144"
            className="flex items-center justify-center gap-2 bg-red-600 text-white rounded-2xl px-6 py-4 text-base font-semibold hover:bg-red-700 active:bg-red-800 transition-colors mt-1"
          >
            📞 {tc('urgentHelp.callEmergency')}
          </a>
        </div>
      </div>

      {/* Pediatrician block */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">👨‍⚕️</span>
          <p className="font-semibold text-amber-900">{t('pediatrician.title')}</p>
        </div>
        <p className="text-sm text-amber-800">{t('pediatrician.description')}</p>
        <ul className="flex flex-col gap-2">
          {pediatricianSigns.map((sign, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-amber-700">
              <span className="mt-0.5 shrink-0 text-amber-400">—</span>
              <span>{sign}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Helpline note */}
      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4">
        <p className="text-sm text-slate-500 leading-relaxed">{t('note')}</p>
      </div>

      <Disclaimer text={tc('disclaimer.short')} />
    </div>
  )
}
