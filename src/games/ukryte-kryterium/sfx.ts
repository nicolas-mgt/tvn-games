import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'ukryte-kryterium',
  samples: ['paper', 'card', 'seal', 'placard', 'good', 'bad'],
  synth: {
    tick: (ctx) => {
      tone(ctx, 'square', 2400, 0.025, 0.05)
      noise(ctx, 3000, 0.03, 0.08, 4)
    },
    scribble: (ctx) => {
      for (let i = 0; i < 5; i++) noise(ctx, 3500 + Math.random() * 1500, 0.07, 0.07, 3, i * 0.09 + Math.random() * 0.03)
    },
    hmm: (ctx) => {
      tone(ctx, 'sine', 132, 0.7, 0.18)
      tone(ctx, 'triangle', 134, 0.7, 0.06)
      tone(ctx, 'sine', 118, 0.6, 0.16, 0.75)
    },
  },
})

export const play = sfx.play
