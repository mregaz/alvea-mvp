import type { ResultConfigMap } from '@/types/result'

export const feverResultConfig: ResultConfigMap = {

  green: {
    level: 'green',
    badgeKey:    'fever.green.badge',
    titleKey:    'fever.green.title',
    bodyKey:     'fever.green.body',
    nextStepKey: 'fever.green.nextStep',
    disclaimerKey: 'fever.green.disclaimer',
    lists: [
      {
        titleKey: 'fever.green.observeTitle',
        itemKeys: [
          'fever.green.observe1',
          'fever.green.observe2',
          'fever.green.observe3',
          'fever.green.observe4',
          'fever.green.observe5',
        ],
        variant: 'observe',
      },
    ],
    ctas: [
      { labelKey: 'fever.green.cta_observe', href: '/{{locale}}/osservazione', style: 'primary' },
      { labelKey: 'fever.green.cta_back',    href: '/{{locale}}/sintomi',      style: 'ghost'   },
    ],
  },

  yellow: {
    level: 'yellow',
    badgeKey:    'fever.yellow.badge',
    titleKey:    'fever.yellow.title',
    bodyKey:     'fever.yellow.body',
    nextStepKey: 'fever.yellow.nextStep',
    disclaimerKey: 'fever.yellow.disclaimer',
    lists: [
      {
        titleKey: 'fever.yellow.contactTitle',
        itemKeys: [
          'fever.yellow.contact1',
          'fever.yellow.contact2',
          'fever.yellow.contact3',
        ],
        variant: 'contact',
      },
      {
        titleKey: 'fever.yellow.observeTitle',
        itemKeys: [
          'fever.yellow.observe1',
          'fever.yellow.observe2',
          'fever.yellow.observe3',
          'fever.yellow.observe4',
          'fever.yellow.observe5',
        ],
        variant: 'observe',
      },
    ],
    ctas: [
      { labelKey: 'fever.yellow.cta_signs', href: '/{{locale}}/aiuto-urgente', style: 'primary'   },
      { labelKey: 'fever.yellow.cta_back',  href: '/{{locale}}/sintomi',       style: 'ghost'     },
    ],
  },

  red: {
    level: 'red',
    badgeKey:    'fever.red.badge',
    titleKey:    'fever.red.title',
    bodyKey:     'fever.red.body',
    nextStepKey: 'fever.red.nextStep',
    disclaimerKey: 'fever.red.disclaimer',
    lists: [
      {
        titleKey: 'fever.red.attentionTitle',
        itemKeys: [
          'fever.red.attention1',
          'fever.red.attention2',
          'fever.red.attention3',
          'fever.red.attention4',
        ],
        variant: 'attention',
      },
    ],
    ctas: [
      { labelKey: 'fever.red.cta_signs', href: '/{{locale}}/aiuto-urgente', style: 'primary' },
      { labelKey: 'fever.red.cta_back',  href: '/{{locale}}/sintomi',       style: 'ghost'   },
    ],
  },
}
