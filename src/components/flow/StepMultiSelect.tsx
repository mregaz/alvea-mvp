'use client'

const EXCLUSIVE_VALUES = ['none', 'unsure']

interface Option {
  value: string
  label: string
}

interface StepMultiSelectProps {
  question: string
  helpText?: string
  hintText: string
  options: Option[]
  selected: string[]
  onSelect: (values: string[]) => void
}

export function StepMultiSelect({
  question,
  helpText,
  hintText,
  options,
  selected,
  onSelect,
}: StepMultiSelectProps) {

  function toggle(value: string) {
    const isExclusive = EXCLUSIVE_VALUES.includes(value)

    if (isExclusive) {
      // Selecting "none" or "unsure" deselects everything else
      onSelect(selected.includes(value) ? [] : [value])
      return
    }

    // Selecting a real option removes exclusive values
    const withoutExclusive = selected.filter((v) => !EXCLUSIVE_VALUES.includes(v))

    if (withoutExclusive.includes(value)) {
      onSelect(withoutExclusive.filter((v) => v !== value))
    } else {
      onSelect([...withoutExclusive, value])
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Question */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-slate-800 leading-snug">{question}</h2>
        {helpText && (
          <p className="text-sm text-slate-400 leading-relaxed">{helpText}</p>
        )}
      </div>

      {/* Hint */}
      <p className="text-xs text-teal-700 bg-teal-50 border border-teal-100 rounded-xl px-4 py-2.5 font-medium">
        {hintText}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2" role="group" aria-label={question}>
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          const isExclusive = EXCLUSIVE_VALUES.includes(option.value)
          return (
            <button
              key={option.value}
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(option.value)}
              className={[
                'w-full text-left px-5 py-4 min-h-[56px] rounded-2xl border transition-all duration-100 flex items-center gap-3',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 font-medium shadow-sm'
                  : isExclusive
                    ? 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 active:scale-[0.98]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50 active:scale-[0.98]',
              ].join(' ')}
            >
              {/* Checkbox indicator */}
              <span className={[
                'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                isSelected
                  ? 'bg-white border-white'
                  : 'border-slate-300 bg-white',
              ].join(' ')}>
                {isSelected && (
                  <svg className="w-3 h-3 text-teal-600" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="text-base leading-snug">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
