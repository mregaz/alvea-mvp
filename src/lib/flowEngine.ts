/**
 * flowEngine.ts
 * Pure logic — no React, no side effects.
 *
 * Branching now works via serializable NextRule objects, not functions.
 * Complex resolvers (e.g. feverResult) are registered here by name
 * and called when a NextCompute rule is encountered.
 */

import type {
  SerializableFlowConfig,
  FlowState,
  FlowAnswers,
  Answer,
  FlowStep,
  NextRule,
} from '@/types/flow'
import type { ResultLevel } from '@/lib/constants'
import { RESULT_LEVELS } from '@/lib/constants'

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isResultLevel(value: string): value is ResultLevel {
  return (RESULT_LEVELS as readonly string[]).includes(value)
}

// ─── Config builder ───────────────────────────────────────────────────────────

export function buildConfig(
  config: Omit<SerializableFlowConfig, 'stepsById'>
): SerializableFlowConfig {
  const stepsById: Record<string, FlowStep> = {}
  for (const step of config.steps) {
    stepsById[step.id] = step
  }
  return { ...config, stepsById }
}

// ─── Named resolver registry ──────────────────────────────────────────────────
// Resolvers handle NextCompute rules — complex multi-variable branching
// that cannot be expressed as a simple case map.
// Each resolver receives all collected answers and returns a step id or ResultLevel.

type Resolver = (answers: FlowAnswers) => string | ResultLevel

export const answeredAny = (answer: Answer | undefined, values: string[]): boolean =>
  values.some((v) => (Array.isArray(answer) ? answer.includes(v) : answer === v))

export const answered = (answer: Answer | undefined, value: string): boolean =>
  Array.isArray(answer) ? answer.includes(value) : answer === value

function feverResultResolver(answers: FlowAnswers): ResultLevel {
  const age       = answers['age'] as string | undefined
  const tempVal   = answers['tempValue'] as string | undefined
  const duration  = answers['duration'] as string | undefined
  const condition = answers['condition'] as string | undefined
  const breathing = answers['breathing'] as string | undefined
  const hydration = answers['hydration'] as string | undefined
  const warning   = answers['warningSigns'] as string[] | undefined

  // ── RED ──────────────────────────────────────────────────────────────────
  if (age === 'under3m') return 'red'
  if (warning && answeredAny(warning, ['seizures', 'stiffNeck', 'colorChange'])) return 'red'
  if (condition === 'unresponsive') return 'red'
  if (breathing === 'difficulty') return 'red'
  if (hydration === 'veryLittle' && age === '3to12m') return 'red'
  if (age === '3to12m' && tempVal === 'over39') return 'red'

  // ── YELLOW ────────────────────────────────────────────────────────────────
  if (duration === 'over3days') return 'yellow'
  if (condition === 'veryTired') return 'yellow'
  if (breathing === 'slightlyLabored') return 'yellow'
  if (hydration === 'veryLittle') return 'yellow'
  if (tempVal === 'over39') return 'yellow'
  if (age === '3to12m') return 'yellow'
  if (warning && answeredAny(warning, ['hardToWake', 'inconsolable', 'worsening', 'colorChange'])) return 'yellow'
  if (duration === '2to3days' && (tempVal === '385to39' || tempVal === 'over39')) return 'yellow'
  if (hydration === 'less' && (duration === '2to3days' || duration === 'over3days')) return 'yellow'

  // ── GREEN ─────────────────────────────────────────────────────────────────
  return 'green'
}

// Registry — add new symptom resolvers here by name
const RESOLVERS: Record<string, Resolver> = {
  feverResult: feverResultResolver,
}

// ─── NextRule interpreter ─────────────────────────────────────────────────────

function resolveNext(
  rule: NextRule,
  answer: Answer,
  allAnswers: FlowAnswers
): string | ResultLevel {
  switch (rule.type) {
    case 'always':
      return rule.stepId

    case 'match': {
      const key = Array.isArray(answer) ? answer[0] : answer
      const dest = rule.cases[key] ?? rule.default
      return dest
    }

    case 'compute': {
      const resolver = RESOLVERS[rule.resolver]
      if (!resolver) throw new Error(`[flowEngine] Unknown resolver: ${rule.resolver}`)
      return resolver(allAnswers)
    }
  }
}

// ─── sessionStorage ───────────────────────────────────────────────────────────

const SESSION_PREFIX = 'alvea_flow_'

export function saveFlowState(state: FlowState): void {
  try {
    sessionStorage.setItem(SESSION_PREFIX + state.symptom, JSON.stringify(state))
  } catch { /* SSR / private mode — silent */ }
}

export function loadFlowState(symptom: string): FlowState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_PREFIX + symptom)
    return raw ? (JSON.parse(raw) as FlowState) : null
  } catch { return null }
}

// ─── State machine ────────────────────────────────────────────────────────────

export function initFlowState(config: SerializableFlowConfig): FlowState {
  return {
    symptom: config.symptom,
    currentStepId: config.entryStep,
    answers: {},
    stepIndex: 0,
    history: [config.entryStep],
  }
}

export type AdvanceResult =
  | { type: 'step';   nextState: FlowState }
  | { type: 'result'; level: ResultLevel; finalAnswers: FlowAnswers }

export function advance(
  config: SerializableFlowConfig,
  state: FlowState,
  answer: Answer
): AdvanceResult {
  const step = config.stepsById[state.currentStepId]
  if (!step) throw new Error(`[flowEngine] Step not found: ${state.currentStepId}`)

  const newAnswers: FlowAnswers = { ...state.answers, [step.id]: answer }
  const destination = resolveNext(step.next, answer, newAnswers)

  if (isResultLevel(destination)) {
    saveFlowState({ ...state, answers: newAnswers })
    return { type: 'result', level: destination, finalAnswers: newAnswers }
  }

  const nextState: FlowState = {
    ...state,
    currentStepId: destination,
    answers: newAnswers,
    stepIndex: state.stepIndex + 1,
    history: [...state.history, destination],
  }
  saveFlowState(nextState)
  return { type: 'step', nextState }
}

export function goBack(state: FlowState): FlowState | null {
  if (state.history.length <= 1) return null

  const newHistory = state.history.slice(0, -1)
  const prevStepId = newHistory[newHistory.length - 1]
  const newAnswers = { ...state.answers }
  delete newAnswers[state.currentStepId]

  const prevState: FlowState = {
    ...state,
    currentStepId: prevStepId,
    answers: newAnswers,
    stepIndex: Math.max(0, state.stepIndex - 1),
    history: newHistory,
  }
  saveFlowState(prevState)
  return prevState
}
