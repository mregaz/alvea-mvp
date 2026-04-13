'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { SerializableFlowConfig, FlowState, Answer } from '@/types/flow'
import {
  initFlowState,
  loadFlowState,
  advance,
  goBack,
} from '@/lib/flowEngine'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StepIntro } from '@/components/flow/StepIntro'
import { StepSingleChoice } from '@/components/flow/StepSingleChoice'
import { StepMultiSelect } from '@/components/flow/StepMultiSelect'
import { StepTransition } from '@/components/flow/StepTransition'

// All plain serializable strings — no functions
export interface FlowStrings {
  back: string
  continue: string
  start: string
  required: string
  requiredMulti: string
  multiHint: string
  disclaimer: string
  progressLabel: string
  resolved: Record<string, string>  // flat key→value lookup, replaces t()
}

interface FlowEngineProps {
  config: SerializableFlowConfig
  locale: string
  strings: FlowStrings
}

// Helper used internally — never crosses server→client
function r(resolved: Record<string, string>, key: string): string {
  return resolved[key] ?? key
}

export function FlowEngine({ config, locale, strings }: FlowEngineProps) {
  const router = useRouter()

  const [flowState, setFlowState]             = useState<FlowState | null>(null)
  const [currentAnswer, setCurrentAnswer]     = useState<Answer | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [transitioning, setTransitioning]     = useState(false)

  // ── Init: restore from sessionStorage or start fresh ──────────────────
  useEffect(() => {
    const saved = loadFlowState(config.symptom)
    const initialState = saved ?? initFlowState(config)
    setFlowState(initialState)
    if (saved) {
      const savedAnswer = saved.answers[saved.currentStepId]
      if (savedAnswer !== undefined) setCurrentAnswer(savedAnswer)
    }
  }, [config])

  // ── Sync answer when step changes ─────────────────────────────────────
  const currentStepId = flowState?.currentStepId
  useEffect(() => {
    if (!flowState) return
    const existing = flowState.answers[flowState.currentStepId]
    setCurrentAnswer(existing ?? null)
    setValidationError(null)
    setTransitioning(false)
  }, [currentStepId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback((value: Answer) => {
    setCurrentAnswer(value)
    setValidationError(null)
  }, [])

  const handleContinue = useCallback(() => {
    if (!flowState) return
    const step = config.stepsById[flowState.currentStepId]
    if (!step) return

    const stepIsIntro      = step.type === 'intro'
    const stepIsTransition = step.type === 'transition'

    if (
      !stepIsIntro &&
      !stepIsTransition &&
      (currentAnswer === null || (Array.isArray(currentAnswer) && currentAnswer.length === 0))
    ) {
      setValidationError(
        step.type === 'multi-select' ? strings.requiredMulti : strings.required
      )
      return
    }

    setTransitioning(true)

    const answerToRecord: Answer =
      stepIsIntro || stepIsTransition ? '__continue__' : currentAnswer!

    const result = advance(config, flowState, answerToRecord)

    if (result.type === 'result') {
      router.push(`/${locale}/risultato/${result.level}`)
      return
    }

    setTimeout(() => {
      setFlowState(result.nextState)
    }, 120)
  }, [flowState, config, currentAnswer, strings, locale, router])

  const handleBack = useCallback(() => {
    if (!flowState) return
    const prevState = goBack(flowState)
    if (prevState) {
      setFlowState(prevState)
      setValidationError(null)
    } else {
      router.push(`/${locale}/sintomi`)
    }
  }, [flowState, locale, router])

  // ── Loading ────────────────────────────────────────────────────────────
  if (!flowState) {
    return (
      <div className="flex items-center justify-center py-20" aria-label="Caricamento">
        <div className="flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  const step = config.stepsById[flowState.currentStepId]
  if (!step) return null

  const isIntro      = step.type === 'intro'
  const isTransition = step.type === 'transition'
  const isFirst      = flowState.history.length <= 1

  const totalVisible = config.steps.filter(
    (s) => s.type !== 'intro' && s.type !== 'transition'
  ).length

  const progressLabel = strings.progressLabel
    .replace('{{current}}', String(flowState.stepIndex))
    .replace('{{total}}', String(totalVisible))

  const ctaLabel = isIntro
    ? r(strings.resolved, 'fever.intro.cta')
    : isTransition
      ? r(strings.resolved, 'fever.transition.cta')
      : strings.continue

  const canContinue =
    isIntro ||
    isTransition ||
    (currentAnswer !== null && !(Array.isArray(currentAnswer) && currentAnswer.length === 0))

  return (
    <div className="flex flex-col gap-6">

      {/* Progress — hidden on intro and transition */}
      {!isIntro && !isTransition && (
        <ProgressBar
          current={flowState.stepIndex}
          total={totalVisible}
          label={progressLabel}
        />
      )}

      {/* Step content */}
      <div
        className={`transition-opacity duration-150 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {isIntro && (
          <StepIntro
            title={r(strings.resolved, step.questionKey)}
            subtitle={r(strings.resolved, step.subtitleKey!)}
            infoBox={r(strings.resolved, 'fever.intro.infoBox')}
          />
        )}

        {step.type === 'single-choice' && (
          <StepSingleChoice
            question={r(strings.resolved, step.questionKey)}
            helpText={step.helpKey ? r(strings.resolved, step.helpKey) : undefined}
            options={(step.options ?? []).map((o) => ({
              value:     o.value,
              label:     r(strings.resolved, o.labelKey),
              alertText: o.alertKey ? r(strings.resolved, o.alertKey) : undefined,
            }))}
            selected={typeof currentAnswer === 'string' ? currentAnswer : null}
            onSelect={handleAnswer}
          />
        )}

        {step.type === 'multi-select' && (
          <StepMultiSelect
            question={r(strings.resolved, step.questionKey)}
            helpText={step.helpKey ? r(strings.resolved, step.helpKey) : undefined}
            hintText={strings.multiHint}
            options={(step.options ?? []).map((o) => ({
              value: o.value,
              label: r(strings.resolved, o.labelKey),
            }))}
            selected={Array.isArray(currentAnswer) ? currentAnswer : []}
            onSelect={handleAnswer}
          />
        )}

        {isTransition && (
          <StepTransition
            title={r(strings.resolved, step.questionKey)}
            body={r(strings.resolved, step.subtitleKey!)}
            onAutoAdvance={handleContinue}
          />
        )}
      </div>

      {/* Validation error */}
      {validationError && (
        <p className="text-sm text-red-600 font-medium" role="alert">
          {validationError}
        </p>
      )}

      {/* Sticky CTA — hidden on transition (auto-advances) */}
      {!isTransition && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 px-4 py-3"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-2xl mx-auto flex flex-col gap-1.5">
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              {strings.disclaimer}
            </p>
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              aria-disabled={!canContinue}
              className={[
                'w-full rounded-2xl py-4 text-base font-semibold transition-all duration-150',
                canContinue
                  ? 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed',
              ].join(' ')}
            >
              {ctaLabel}
            </button>
            {!isFirst && (
              <button
                onClick={handleBack}
                className="w-full min-h-[44px] py-3 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← {strings.back}
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
