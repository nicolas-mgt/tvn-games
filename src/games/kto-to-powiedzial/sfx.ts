import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'kto-to-powiedzial',
  samples: ['click', 'good', 'bad'],
  synth: {
    static: (ctx) => {
      noise(ctx, 2400, 0.45, 0.07, 0.3)
      noise(ctx, 700, 0.3, 0.04, 0.5, 0.1)
    },
    beep: (ctx) => {
      tone(ctx, 'square', 880, 0.07, 0.04)
      tone(ctx, 'square', 1320, 0.07, 0.04, 0.09)
    },
    rimshot: (ctx) => {
      noise(ctx, 1800, 0.08, 0.12, 2)
      noise(ctx, 1800, 0.08, 0.12, 2, 0.16)
      noise(ctx, 5200, 0.35, 0.1, 1, 0.34)
      tone(ctx, 'triangle', 180, 0.12, 0.08, 0.34)
    },
    crunch: (ctx) => {
      for (let i = 0; i < 4; i++) noise(ctx, 3000 + i * 600, 0.04, 0.08, 3, i * 0.05)
    },
  },
})

export const play = sfx.play
