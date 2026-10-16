import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'to-pan-tego-nie-wie',
  samples: ['click', 'good', 'bad'],
  synth: {
    xylo: (ctx) => {
      ;[523, 659, 784, 1047].forEach((freq, i) => tone(ctx, 'sine', freq, 0.35, 0.07, i * 0.09))
    },
    pop: (ctx) => tone(ctx, 'triangle', 1100, 0.06, 0.06),
    giggle: (ctx) => {
      ;[700, 820, 760, 900, 840, 1000].forEach((freq, i) => tone(ctx, 'triangle', freq, 0.06, 0.05, i * 0.07))
    },
    word: (ctx) => {
      tone(ctx, 'sine', 1500, 0.02, 0.015)
      noise(ctx, 3000, 0.015, 0.01, 2)
    },
  },
})

export const play = sfx.play
