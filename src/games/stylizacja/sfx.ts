import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'stylizacja',
  samples: ['hanger', 'paddle', 'good', 'bad'],
  synth: {
    shutter: (ctx) => {
      noise(ctx, 3500, 0.04, 0.2, 2)
      noise(ctx, 2200, 0.05, 0.14, 2, 0.07)
    },
    rustle: (ctx) => {
      noise(ctx, 2800, 0.35, 0.06, 0.8)
      noise(ctx, 4200, 0.25, 0.04, 1.2, 0.12)
    },
    applause: (ctx) => {
      for (let i = 0; i < 14; i++) noise(ctx, 1800 + (i % 4) * 500, 0.12, 0.07, 1.5, i * 0.11)
    },
    drumroll: (ctx) => {
      for (let i = 0; i < 18; i++) noise(ctx, 900, 0.05, 0.05 + i * 0.004, 1.2, i * 0.045)
      tone(ctx, 'sine', 90, 0.3, 0.15, 0.82)
    },
    tick: (ctx) => {
      tone(ctx, 'square', 1500, 0.03, 0.04)
    },
  },
})

export const play = sfx.play
