import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'uratuj-knajpe',
  samples: ['bell', 'plate', 'door', 'register', 'splat', 'good', 'bad'],
  synth: {
    sizzle: (ctx) => {
      noise(ctx, 5200, 1.2, 0.05, 0.6)
      noise(ctx, 3000, 0.8, 0.03, 1, 0.3)
    },
    buzz: (ctx) => {
      for (const delay of [0, 0.35, 0.5]) tone(ctx, 'square', 100, 0.12, 0.03, delay)
    },
    chatter: (ctx) => {
      noise(ctx, 700, 1.4, 0.05, 1.5)
      for (let i = 0; i < 3; i++) tone(ctx, 'triangle', 300 + i * 70, 0.12, 0.03, 0.3 + i * 0.35)
    },
    pop: (ctx) => {
      tone(ctx, 'sine', 600, 0.08, 0.1)
      tone(ctx, 'sine', 900, 0.1, 0.08, 0.06)
    },
  },
})

export const play = sfx.play
