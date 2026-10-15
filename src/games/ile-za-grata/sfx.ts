import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'ile-za-grata',
  samples: ['door', 'keys', 'slap', 'cash', 'good', 'bad'],
  synth: {
    horn: (ctx) => {
      tone(ctx, 'sawtooth', 392, 0.16, 0.07)
      tone(ctx, 'sawtooth', 494, 0.16, 0.05)
      tone(ctx, 'sawtooth', 392, 0.28, 0.07, 0.22)
      tone(ctx, 'sawtooth', 494, 0.28, 0.05, 0.22)
    },
    tick: (ctx) => {
      tone(ctx, 'square', 1800, 0.02, 0.04)
    },
    engine: (ctx) => {
      for (let i = 0; i < 6; i++) tone(ctx, 'sawtooth', 48 + i * 6, 0.18, 0.09, i * 0.12)
      noise(ctx, 180, 0.8, 0.08, 1)
    },
  },
})

export const play = sfx.play
