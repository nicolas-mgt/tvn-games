import { createSfx, noise, tone } from '@/shared/sfx'

const TROMBONE = [233, 220, 208, 196]

export const sfx = createSfx({
  slug: 'zonk',
  samples: ['select', 'curtain', 'fanfare', 'oops', 'intro', 'cash'],
  synth: {
    /** `amount` is the roll length in seconds, ending with a cymbal crash. */
    drumroll: (ctx, amount) => {
      const length = amount || 1.5
      for (let t = 0; t < length; t += 0.045) noise(ctx, 1800, 0.06, 0.05 + (t / length) * 0.25, 0.7, t)
      noise(ctx, 6000, 0.9, 0.3, 0.5, length)
    },
    trombone: (ctx) =>
      TROMBONE.forEach((frequency, i) => {
        const duration = i === TROMBONE.length - 1 ? 1.1 : 0.35
        tone(ctx, 'sawtooth', frequency, duration, 0.14, i * 0.4)
        tone(ctx, 'sawtooth', frequency * 1.006, duration, 0.08, i * 0.4)
      }),
    applause: (ctx) => {
      for (let i = 0; i < 140; i++) {
        const t = Math.random() * 2
        noise(ctx, 2000 + Math.random() * 3000, 0.03, 0.12 * (1 - t / 2.4), 1.5, t)
      }
    },
  },
})

export const play = sfx.play
