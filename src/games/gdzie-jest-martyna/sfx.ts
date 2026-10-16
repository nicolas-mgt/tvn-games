import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'gdzie-jest-martyna',
  samples: ['stamp', 'page', 'good', 'bad'],
  synth: {
    /** `amount` is the flight duration in seconds. */
    plane: (ctx, amount) => {
      const duration = amount || 1.6
      const steps = 8
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1)
        const loudness = Math.sin(Math.PI * t)
        noise(ctx, 300 + 900 * t, (duration / steps) * 1.8, 0.02 + 0.06 * loudness, 2, (duration * i) / steps)
      }
    },
    shutter: (ctx) => {
      noise(ctx, 3200, 0.04, 0.12, 3)
      noise(ctx, 2200, 0.06, 0.1, 3, 0.07)
      tone(ctx, 'square', 1800, 0.02, 0.03, 0.07)
    },
    pin: (ctx) => {
      tone(ctx, 'triangle', 980, 0.08, 0.07)
      noise(ctx, 1500, 0.05, 0.05, 2)
    },
    tick: (ctx) => tone(ctx, 'square', 1400, 0.025, 0.025),
  },
})

export const play = sfx.play
