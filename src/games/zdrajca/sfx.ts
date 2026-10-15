import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'zdrajca',
  samples: ['seal', 'token', 'chalk', 'gong', 'door', 'good', 'bad'],
  synth: {
    crackle: (ctx) => {
      noise(ctx, 400, 1.2, 0.05, 0.6)
      for (let i = 0; i < 10; i++) noise(ctx, 1600 + Math.random() * 2400, 0.025, 0.22, 6, Math.random() * 1.2)
    },
    heartbeat: (ctx) => {
      tone(ctx, 'sine', 58, 0.16, 0.5)
      tone(ctx, 'sine', 52, 0.2, 0.4, 0.2)
    },
    snuff: (ctx) => {
      noise(ctx, 3000, 0.35, 0.08, 1.5)
    },
    wind: (ctx) => {
      noise(ctx, 300, 2.2, 0.08, 0.8)
      noise(ctx, 520, 1.8, 0.05, 2, 0.5)
    },
  },
})

export const play = sfx.play
