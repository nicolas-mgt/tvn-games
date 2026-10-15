import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'sciema-z-ogloszenia',
  samples: ['paper', 'pin', 'marker', 'wrong', 'stamp', 'good', 'bad'],
  synth: {
    tick: (ctx) => {
      tone(ctx, 'square', 2200, 0.015, 0.05)
    },
    buzz: (ctx) => {
      tone(ctx, 'square', 220, 0.22, 0.06)
      tone(ctx, 'square', 165, 0.36, 0.06, 0.24)
    },
    type: (ctx) => {
      for (let i = 0; i < 5; i++) noise(ctx, 2600 + (i % 2) * 900, 0.03, 0.12, 4, i * 0.07)
    },
  },
})

export const play = sfx.play
