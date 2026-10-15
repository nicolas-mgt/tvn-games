import { createSfx, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'podloga',
  samples: ['correct', 'wrong', 'pass', 'select', 'win', 'conquest', 'intro', 'lose', 'token'],
  synth: {
    tick: (ctx) => tone(ctx, 'square', 1800, 0.04, 0.08),
    buzzer: (ctx) => {
      tone(ctx, 'sawtooth', 110, 0.9, 0.25)
      tone(ctx, 'square', 116, 0.9, 0.15)
    },
  },
})

export const play = sfx.play
