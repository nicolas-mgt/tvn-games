import { createSfx, noise, tone } from '@/shared/sfx'

const ARPEGGIO = [523, 659, 784, 1047, 1319, 1568]

export const sfx = createSfx({
  slug: 'tvniszowo',
  samples: ['insert', 'lamp', 'reject', 'confirm', 'good', 'bad'],
  synth: {
    tick: (ctx) => tone(ctx, 'sine', 880, 0.06, 0.06),
    /** `amount` is the tier position 0–1: rarer answers play a longer arpeggio. */
    hit: (ctx, amount) => {
      ARPEGGIO.slice(0, 2 + Math.round(amount * 4)).forEach((freq, i) => tone(ctx, 'triangle', freq, 0.3, 0.09, i * 0.08))
    },
    gold: (ctx) => {
      ARPEGGIO.forEach((freq, i) => tone(ctx, 'triangle', freq, 0.5, 0.08, i * 0.1))
      tone(ctx, 'sine', 2093, 1.1, 0.05, ARPEGGIO.length * 0.1)
    },
    /** Elevator cabin sliding down the archive shaft, with a ding on arrival. */
    descend: (ctx, amount) => {
      const duration = 0.3 + amount * 0.6
      noise(ctx, 260, duration, 0.05, 0.8)
      tone(ctx, 'sine', 1319, 0.5, 0.05, duration)
      tone(ctx, 'sine', 1047, 0.6, 0.05, duration + 0.12)
    },
    reel: (ctx) => {
      noise(ctx, 1800, 0.35, 0.025, 3)
      tone(ctx, 'square', 120, 0.08, 0.015, 0.05)
    },
  },
})

export const play = sfx.play
