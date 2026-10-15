import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'paleta-w-ciemno',
  samples: ['gavel', 'paddle', 'cash', 'tag', 'foil', 'good', 'bad'],
  synth: {
    beep: (ctx) => {
      for (let i = 0; i < 3; i++) tone(ctx, 'square', 1040, 0.18, 0.05, i * 0.42)
    },
    bid: (ctx) => {
      tone(ctx, 'triangle', 880, 0.06, 0.12)
      noise(ctx, 2500, 0.04, 0.06, 2)
    },
    going: (ctx) => {
      tone(ctx, 'sine', 620, 0.12, 0.14)
      noise(ctx, 1800, 0.05, 0.08, 3)
    },
  },
})

export const play = sfx.play
