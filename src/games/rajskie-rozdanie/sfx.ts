import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'rajskie-rozdanie',
  samples: ['card', 'play', 'clink', 'shell', 'out', 'good', 'bad'],
  synth: {
    crackle: (ctx) => {
      noise(ctx, 500, 0.9, 0.05, 0.6)
      for (let i = 0; i < 9; i++) noise(ctx, 1800 + Math.random() * 2500, 0.025, 0.25, 6, Math.random() * 0.9)
    },
    whisper: (ctx) => {
      noise(ctx, 5200, 0.35, 0.06, 2)
      noise(ctx, 4200, 0.45, 0.05, 2, 0.4)
    },
    drum: (ctx) => {
      for (let i = 0; i < 18; i++) noise(ctx, 1600, 0.05, 0.05 + i * 0.006, 1.5, i * 0.06)
      tone(ctx, 'sine', 70, 0.35, 0.25, 1.1)
    },
    heart: (ctx) => {
      for (const [i, frequency] of [523, 659, 784].entries()) tone(ctx, 'triangle', frequency, 0.25, 0.12, i * 0.09)
    },
  },
})

export const play = sfx.play
