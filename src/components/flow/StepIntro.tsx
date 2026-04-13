'use client'

interface StepIntroProps {
  title: string
  subtitle: string
  infoBox: string
}

export function StepIntro({ title, subtitle, infoBox }: StepIntroProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-slate-800 leading-snug tracking-tight">
          {title}
        </h1>
        <p className="text-base text-slate-500 leading-relaxed">{subtitle}</p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
        <p className="text-sm text-amber-800 leading-relaxed">{infoBox}</p>
      </div>
    </div>
  )
}
