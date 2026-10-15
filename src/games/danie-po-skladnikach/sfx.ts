import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'danie-po-skladnikach',
  samples: ['lift', 'chop', 'crumple', 'bell', 'good', 'bad'],
  synth: {
    flame: (ctx) => {
      noise(ctx, 400, 0.9, 0.12, 0.7)
      noise(ctx, 1500, 0.5, 0.04, 1, 0.1)
    },
    sizzle: (ctx) => {
      noise(ctx, 5600, 1.4, 0.05, 0.6)
      noise(ctx, 3200, 0.9, 0.03, 1, 0.4)
    },
    tick: (ctx) => {
      tone(ctx, 'square', 1800, 0.03, 0.04)
      tone(ctx, 'square', 1400, 0.03, 0.03, 0.5)
    },
  },
})

export const play = sfx.play
