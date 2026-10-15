import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'express-za-dolara',
  samples: ['stamp', 'coins', 'flip', 'envelope', 'good', 'bad'],
  synth: {
    horn: (ctx) => {
      for (const delay of [0, 0.32]) {
        tone(ctx, 'sawtooth', 392, 0.24, 0.08, delay)
        tone(ctx, 'sawtooth', 494, 0.24, 0.06, delay)
      }
    },
    tick: (ctx) => {
      for (let i = 0; i < 6; i++) tone(ctx, 'square', i % 2 ? 1800 : 2400, 0.02, 0.05, i * 0.12)
    },
    jungle: (ctx) => {
      noise(ctx, 1200, 1.6, 0.04, 0.4)
      for (let i = 0; i < 4; i++) tone(ctx, 'sine', 2600 + Math.random() * 1400, 0.08, 0.05, 0.2 + i * 0.3 + Math.random() * 0.1)
    },
    street: (ctx) => {
      noise(ctx, 500, 1.6, 0.06, 0.5)
      noise(ctx, 900, 0.9, 0.04, 1.2, 0.5)
      tone(ctx, 'square', 660, 0.08, 0.03, 0.9)
    },
    thumb: (ctx) => {
      tone(ctx, 'sine', 1400, 0.14, 0.12)
      tone(ctx, 'sine', 2100, 0.22, 0.12, 0.16)
    },
  },
})

export const play = sfx.play
