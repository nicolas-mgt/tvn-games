import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'prawda-czy-sciema',
  samples: ['stamp', 'whoosh', 'good', 'bad'],
  synth: {
    jingle: (ctx) => {
      tone(ctx, 'triangle', 392, 0.5, 0.06)
      tone(ctx, 'triangle', 494, 0.5, 0.05, 0.08)
      tone(ctx, 'triangle', 587, 0.7, 0.05, 0.16)
      tone(ctx, 'sine', 784, 0.9, 0.04, 0.24)
    },
    /** `amount` is the number of key strikes. */
    teletype: (ctx, amount) => {
      const strikes = amount || 6
      for (let i = 0; i < strikes; i++) noise(ctx, 2600 + (i % 3) * 500, 0.025, 0.05, 4, i * 0.045)
    },
    static: (ctx) => {
      noise(ctx, 1800, 0.35, 0.09, 0.4)
      noise(ctx, 600, 0.25, 0.06, 0.6, 0.1)
    },
  },
})

export const play = sfx.play
