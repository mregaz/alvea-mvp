/**
 * fever/flow.ts
 * Fully serializable flow config — no functions anywhere.
 *
 * Branching uses NextRule objects:
 *   { type: 'always',  stepId }               → unconditional
 *   { type: 'match',   cases, default }        → branch on answer value
 *   { type: 'compute', resolver: 'feverResult' } → complex multi-var logic
 *
 * The result computation lives in flowEngine.ts (feverResultResolver).
 * This file is pure JSON-compatible data.
 */

import { buildConfig } from '@/lib/flowEngine'
import type { SerializableFlowConfig } from '@/types/flow'

const feverFlowRaw: Omit<SerializableFlowConfig, 'stepsById'> = {
  symptom: 'febbre',
  entryStep: 'intro',

  steps: [

    // ── Intro ──────────────────────────────────────────────────────────────
    {
      id: 'intro',
      type: 'intro',
      questionKey: 'fever.intro.title',
      subtitleKey: 'fever.intro.subtitle',
      next: { type: 'always', stepId: 'age' },
    },

    // ── Age ────────────────────────────────────────────────────────────────
    {
      id: 'age',
      type: 'single-choice',
      questionKey: 'fever.age.question',
      helpKey: 'fever.age.help',
      options: [
        { value: 'under3m', labelKey: 'fever.age.opt_under3m' },
        { value: '3to12m',  labelKey: 'fever.age.opt_3to12m'  },
        { value: '1to3y',   labelKey: 'fever.age.opt_1to3y'   },
        { value: '4to7y',   labelKey: 'fever.age.opt_4to7y'   },
        { value: '8plus',   labelKey: 'fever.age.opt_8plus'   },
      ],
      // Newborns skip to warningSigns (result will be red via feverResultResolver)
      next: {
        type: 'match',
        cases: { under3m: 'warningSigns' },
        default: 'tempMeasured',
      },
    },

    // ── Temperature measured? ──────────────────────────────────────────────
    {
      id: 'tempMeasured',
      type: 'single-choice',
      questionKey: 'fever.tempMeasured.question',
      options: [
        { value: 'yes',    labelKey: 'fever.tempMeasured.opt_yes'    },
        { value: 'no',     labelKey: 'fever.tempMeasured.opt_no'     },
        { value: 'unsure', labelKey: 'fever.tempMeasured.opt_unsure' },
      ],
      // Only ask for temp value if actually measured
      next: {
        type: 'match',
        cases: { yes: 'tempValue' },
        default: 'duration',
      },
    },

    // ── Temperature value (conditional) ───────────────────────────────────
    {
      id: 'tempValue',
      type: 'single-choice',
      questionKey: 'fever.tempValue.question',
      helpKey: 'fever.tempValue.help',
      options: [
        { value: 'under38',  labelKey: 'fever.tempValue.opt_under38'  },
        { value: '38to384',  labelKey: 'fever.tempValue.opt_38to384'  },
        { value: '385to39',  labelKey: 'fever.tempValue.opt_385to39'  },
        { value: 'over39',   labelKey: 'fever.tempValue.opt_over39'   },
        { value: 'unsure',   labelKey: 'fever.tempValue.opt_unsure'   },
      ],
      next: { type: 'always', stepId: 'duration' },
    },

    // ── Duration ───────────────────────────────────────────────────────────
    {
      id: 'duration',
      type: 'single-choice',
      questionKey: 'fever.duration.question',
      options: [
        { value: 'today',      labelKey: 'fever.duration.opt_today'     },
        { value: '1day',       labelKey: 'fever.duration.opt_1day'      },
        { value: '2to3days',   labelKey: 'fever.duration.opt_2to3days'  },
        { value: 'over3days',  labelKey: 'fever.duration.opt_over3days' },
        { value: 'unsure',     labelKey: 'fever.duration.opt_unsure'    },
      ],
      next: { type: 'always', stepId: 'condition' },
    },

    // ── General condition ──────────────────────────────────────────────────
    {
      id: 'condition',
      type: 'single-choice',
      questionKey: 'fever.condition.question',
      helpKey: 'fever.condition.help',
      options: [
        { value: 'normal',       labelKey: 'fever.condition.opt_normal'       },
        { value: 'tired',        labelKey: 'fever.condition.opt_tired'        },
        { value: 'veryTired',    labelKey: 'fever.condition.opt_veryTired'    },
        { value: 'unresponsive', labelKey: 'fever.condition.opt_unresponsive' },
      ],
      next: { type: 'always', stepId: 'breathing' },
    },

    // ── Breathing ──────────────────────────────────────────────────────────
    {
      id: 'breathing',
      type: 'single-choice',
      questionKey: 'fever.breathing.question',
      options: [
        { value: 'no',              labelKey: 'fever.breathing.opt_no'              },
        { value: 'slightlyLabored', labelKey: 'fever.breathing.opt_slightlyLabored' },
        { value: 'difficulty',      labelKey: 'fever.breathing.opt_difficulty',
          alertKey: 'fever.breathing.alert_difficulty'                               },
        { value: 'unsure',          labelKey: 'fever.breathing.opt_unsure'          },
      ],
      next: { type: 'always', stepId: 'hydration' },
    },

    // ── Hydration ──────────────────────────────────────────────────────────
    {
      id: 'hydration',
      type: 'single-choice',
      questionKey: 'fever.hydration.question',
      helpKey: 'fever.hydration.help',
      options: [
        { value: 'yes',        labelKey: 'fever.hydration.opt_yes'        },
        { value: 'less',       labelKey: 'fever.hydration.opt_less'       },
        { value: 'veryLittle', labelKey: 'fever.hydration.opt_veryLittle' },
        { value: 'unsure',     labelKey: 'fever.hydration.opt_unsure'     },
      ],
      next: { type: 'always', stepId: 'associated' },
    },

    // ── Associated symptoms (multi-select) ─────────────────────────────────
    {
      id: 'associated',
      type: 'multi-select',
      questionKey: 'fever.associated.question',
      helpKey: 'fever.associated.help',
      options: [
        { value: 'cough',    labelKey: 'fever.associated.opt_cough'    },
        { value: 'vomiting', labelKey: 'fever.associated.opt_vomiting' },
        { value: 'diarrhea', labelKey: 'fever.associated.opt_diarrhea' },
        { value: 'throat',   labelKey: 'fever.associated.opt_throat'   },
        { value: 'earache',  labelKey: 'fever.associated.opt_earache'  },
        { value: 'rash',     labelKey: 'fever.associated.opt_rash'     },
        { value: 'none',     labelKey: 'fever.associated.opt_none'     },
        { value: 'unsure',   labelKey: 'fever.associated.opt_unsure'   },
      ],
      next: { type: 'always', stepId: 'warningSigns' },
    },

    // ── Warning signs (multi-select) ──────────────────────────────────────
    {
      id: 'warningSigns',
      type: 'multi-select',
      questionKey: 'fever.warningSigns.question',
      helpKey: 'fever.warningSigns.help',
      options: [
        { value: 'seizures',     labelKey: 'fever.warningSigns.opt_seizures'     },
        { value: 'stiffNeck',    labelKey: 'fever.warningSigns.opt_stiffNeck'    },
        { value: 'hardToWake',   labelKey: 'fever.warningSigns.opt_hardToWake'   },
        { value: 'inconsolable', labelKey: 'fever.warningSigns.opt_inconsolable' },
        { value: 'worsening',    labelKey: 'fever.warningSigns.opt_worsening'    },
        { value: 'colorChange',  labelKey: 'fever.warningSigns.opt_colorChange'  },
        { value: 'none',         labelKey: 'fever.warningSigns.opt_none'         },
        { value: 'unsure',       labelKey: 'fever.warningSigns.opt_unsure'       },
      ],
      next: { type: 'always', stepId: 'transition' },
    },

    // ── Transition ─────────────────────────────────────────────────────────
    {
      id: 'transition',
      type: 'transition',
      questionKey: 'fever.transition.title',
      subtitleKey: 'fever.transition.body',
      // Delegates to feverResultResolver in flowEngine.ts
      next: { type: 'compute', resolver: 'feverResult' },
    },
  ],
}

export const feverFlowConfig: SerializableFlowConfig = buildConfig(feverFlowRaw)
