'use client'

interface Option {
  value: string
  label: string
  alertText?: string
}

interface StepSingleChoiceProps {
  question: string
  helpText?: string
  options: Option[]
  selected: string | null
  onSelect: (value: string) => void
}

export function StepSingleChoice({
  question,
  helpText,
  options,
  selected,
  onSelect,
}: StepSingleChoiceProps) {
  const selectedAlert = options.find((o) => o.value === selected)?.alertText

  return (
    <div className="flex flex-col gap-5">
      {/* Question */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-slate-800 leading-snug">{question}</h2>
        {helpText && (
          <p className="text-sm text-slate-400 leading-relaxed">{helpText}</p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={question}>
        {options.map((option) => {
          const isSelected = selected === option.value
          return (
            <button
              key={option.value}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.value)}
              className={[
                'w-full text-left px-5 py-4 min-h-[56px] rounded-2xl border transition-all duration-100 text-base leading-snug',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 font-medium shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50 active:scale-[0.98]',
              ].join(' ')}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {/* Inline alert for certain answers */}
      {selectedAlert && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl px-5 py-4 flex gap-3 items-start">
          <span className="text-amber-500 text-lg shrink-0 mt-0.5">⚠️</span>
          <p className="text-sm text-amber-800 leading-relaxed">{selectedAlert}</p>
        </div>
      )}
    </div>
  )
}
