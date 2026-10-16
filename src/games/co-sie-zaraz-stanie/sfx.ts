import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'co-sie-zaraz-stanie',
  samples: ['click', 'crash', 'good', 'bad'],
  synth: {
    screech: (ctx) => {
      noise(ctx, 3200, 0.7, 0.05, 12)
      noise(ctx, 2600, 0.6, 0.04, 14, 0.08)
    },
    horn: (ctx) => {
      tone(ctx, 'sawtooth', 415, 0.45, 0.03)
      tone(ctx, 'sawtooth', 330, 0.45, 0.03)
    },
    engine: (ctx) => {
      ;[55, 62, 70].forEach((freq, i) => tone(ctx, 'sawtooth', freq, 0.5, 0.025, i * 0.12))
      noise(ctx, 180, 1.2, 0.02, 2)
    },
    rewind: (ctx) => {
      ;[1200, 1500, 1800, 2100, 2400].forEach((freq, i) => tone(ctx, 'square', freq, 0.08, 0.012, i * 0.12))
      noise(ctx, 6000, 0.7, 0.02, 1)
    },
  },
})

export const play = sfx.play
