import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'pogodynka',
  samples: ['click', 'good', 'bad'],
  synth: {
    jingle: (ctx) => {
      ;[392, 523, 659, 784, 659, 1047].forEach((freq, i) => tone(ctx, 'triangle', freq, 0.28, 0.06, i * 0.12))
      tone(ctx, 'sine', 196, 0.9, 0.05)
    },
    rain: (ctx) => noise(ctx, 5000, 1.8, 0.025, 0.6),
    wind: (ctx) => {
      noise(ctx, 400, 1.6, 0.03, 4)
      noise(ctx, 700, 1.2, 0.02, 6, 0.4)
    },
    tick: (ctx) => tone(ctx, 'square', 1800, 0.02, 0.02),
    rise: (ctx) => {
      ;[440, 554, 659].forEach((freq, i) => tone(ctx, 'sine', freq, 0.12, 0.04, i * 0.05))
    },
  },
})

export const play = sfx.play
