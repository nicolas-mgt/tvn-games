import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'poukladani',
  samples: ['box', 'wood', 'close', 'tag', 'blocked', 'solved'],
  synth: {
    rotate: (ctx) => {
      noise(ctx, 1400, 0.16, 0.05, 1.5)
      tone(ctx, 'sine', 520, 0.06, 0.04, 0.05)
    },
    pickup: (ctx) => {
      tone(ctx, 'triangle', 660, 0.07, 0.06)
      tone(ctx, 'triangle', 880, 0.06, 0.04, 0.05)
    },
  },
})

export const play = sfx.play
