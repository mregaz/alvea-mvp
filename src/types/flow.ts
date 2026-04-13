import type { ResultLevel } from '@/lib/constants'

export type StepType = 'intro' | 'single-choice' | 'multi-select' | 'transition'

export interface AnswerOption {
  value: string
  labelKey: string
  alertKey?: string
}

export type Answer = string | string[]
export type FlowAnswers = Record<string, Answer>

// ─── Serializable next rules ─────────────────────────────────────────────────
// These replace function-based `next` so configs cross the server→client boundary.

/** Always go to the same step, regardless of answer. */
export interface NextAlways {
  type: 'always'
  stepId: string
}

/**
 * Branch on the current answer value.
 * `cases` maps answer values → next step id or result level.
 * `default` is used when no case matches.
 */
export interface NextMatch {
  type: 'match'
  cases: Record<string, string>   // answerValue → stepId or ResultLevel
  default: string                  // stepId or ResultLevel
}

/**
 * Delegate to a named resolver function registered in the client engine.
 * Used for complex branching (e.g. multi-variable result computation)
 * that cannot be expressed as a simple case map.
 */
export interface NextCompute {
  type: 'compute'
  resolver: string    // key into RESOLVERS map in flowEngine.ts
}

export type NextRule = NextAlways | NextMatch | NextCompute

// ─── Step and config ─────────────────────────────────────────────────────────

export interface FlowStep {
  id: string
  type: StepType
  questionKey: string
  subtitleKey?: string
  helpKey?: string
  options?: AnswerOption[]
  next: NextRule           // fully serializable — no functions
}

export interface SerializableFlowConfig {
  symptom: string
  entryStep: string
  steps: FlowStep[]
  stepsById: Record<string, FlowStep>
}

// Minimal shape persisted to sessionStorage
export interface FlowState {
  symptom: string
  currentStepId: string
  answers: FlowAnswers
  stepIndex: number
  history: string[]
}
