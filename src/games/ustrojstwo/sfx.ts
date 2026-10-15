import { createSfx, noise, tone } from '@/shared/sfx'

export const sfx = createSfx({
  slug: 'ustrojstwo',
  samples: ['land', 'flap', 'stamp', 'correct', 'wrong', 'select', 'reveal', 'win'],
  synth: {
    tear: (ctx, amount) => noise(ctx, 900 + amount * 2600, 0.08, 0.4, 2),
    rumble: (ctx) => {
      noise(ctx, 140, 1.2, 0.25, 0.8)
      tone(ctx, 'sine', 55, 1.2, 0.12)
    },
  },
})

export const play = sfx.play
