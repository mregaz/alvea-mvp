import Link from 'next/link'

interface UrgentHelpBoxProps {
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
  emergencyLabel: string
}

export function UrgentHelpBox({
  title,
  body,
  ctaLabel,
  ctaHref,
  emergencyLabel,
}: UrgentHelpBoxProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="font-semibold text-red-800 text-sm">{title}</p>
        <p className="text-sm text-red-700 leading-relaxed">{body}</p>
      </div>

      <div className="flex flex-col gap-2">
        {/* Primary: call 144 */}
        <a
          href="tel:144"
          className="flex items-center justify-center gap-2 bg-red-600 text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-red-700 active:bg-red-800 transition-colors"
        >
          📞 {emergencyLabel}
        </a>

        {/* Secondary: urgent help page */}
        <Link
          href={ctaHref}
          className="flex items-center justify-center text-sm text-red-700 font-medium underline underline-offset-2 hover:text-red-900 py-1"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  )
}
