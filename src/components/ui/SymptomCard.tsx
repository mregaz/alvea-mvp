import Link from 'next/link'

interface SymptomCardBaseProps {
  icon: string
  label: string
  description: string
}

interface ActiveSymptomCardProps extends SymptomCardBaseProps {
  active: true
  href: string
  ctaLabel: string
}

interface InactiveSymptomCardProps extends SymptomCardBaseProps {
  active: false
  comingSoonLabel: string
}

export type SymptomCardProps = ActiveSymptomCardProps | InactiveSymptomCardProps

export function SymptomCard(props: SymptomCardProps) {
  const { icon, label, description, active } = props

  if (active) {
    return (
      <Link
        href={props.href}
        className="group flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:border-teal-400 hover:shadow-md active:scale-[0.98] transition-all duration-150"
      >
        {/* Icon */}
        <span className="text-2xl w-10 text-center shrink-0" aria-hidden="true">
          {icon}
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 leading-snug">{label}</p>
          <p className="text-sm text-slate-400 mt-0.5 leading-snug">{description}</p>
        </div>

        {/* Arrow */}
        <span
          className="text-teal-500 font-medium text-base shrink-0 group-hover:translate-x-0.5 transition-transform"
          aria-hidden="true"
        >
          →
        </span>
      </Link>
    )
  }

  return (
    <div
      className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 cursor-default select-none"
      aria-label={`${label} — non ancora disponibile`}
      aria-disabled="true"
    >
      {/* Icon — desaturated */}
      <span className="text-2xl w-10 text-center shrink-0 opacity-40" aria-hidden="true">
        {icon}
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-400 leading-snug">{label}</p>
        <p className="text-sm text-slate-300 mt-0.5 leading-snug">{description}</p>
      </div>

      {/* Coming soon badge */}
      <span className="text-xs text-slate-400 bg-slate-200 px-2.5 py-1 rounded-full shrink-0 font-medium">
        {props.comingSoonLabel}
      </span>
    </div>
  )
}
