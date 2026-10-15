import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { categoryById } from './categories'
import { distance, emojiImage, SIZE, START_INDEX, type Tile } from './logic'

export type Wave = { origin: number; key: number }

type FloorProps = {
  board: Tile[]
  targets: number[]
  intro: boolean
  wave: Wave | null
  zoomTo: number | null
  onPick: (index: number) => void
  onIntroDone: () => void
  onZoomed: () => void
}

const INTRO_STEP = 0.12
const WAVE_STEP = 0.09

export function Floor({ board, targets, intro, wave, zoomTo, onPick, onIntroDone, onZoomed }: FloorProps) {
  const focus = zoomTo ?? wave?.origin ?? START_INDEX
  const origin = `${(focus % SIZE) * 20 + 10}% ${Math.floor(focus / SIZE) * 20 + 10}%`
  const lastIntroDelay = Math.max(...board.map((_, i) => distance(i, START_INDEX))) * INTRO_STEP

  return (
    <div className="floor-stage mx-auto w-full max-w-xl">
      <div className="floor-grid">
        <motion.div
          className="grid grid-cols-5 gap-2 [transform-style:preserve-3d] sm:gap-2.5"
          style={{ transformOrigin: origin }}
          initial={intro ? false : { scale: 2.6, opacity: 0 }}
          animate={zoomTo === null ? { scale: 1, opacity: 1 } : { scale: 2.6, opacity: 0 }}
          transition={{ duration: zoomTo === null ? 0.6 : 0.7, ease: [0.6, 0, 0.4, 1] }}
          onAnimationComplete={() => zoomTo !== null && onZoomed()}
        >
          {board.map((tile, i) => {
            const isTarget = targets.includes(i) && zoomTo === null
            const isPlayer = tile.owner === 'player'
            const icon = isPlayer ? emojiImage('🙂') : emojiImage(categoryById(tile.categoryId).emoji)
            const delay = distance(i, START_INDEX) * INTRO_STEP
            return (
              <motion.button
                key={i}
                data-testid={`tile-${i}`}
                data-challengeable={isTarget}
                data-target={isTarget}
                disabled={!isTarget}
                onClick={() => onPick(i)}
                initial={intro ? { opacity: 0, scale: 0.4 } : false}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={isTarget ? { z: 28, scale: 1.06 } : undefined}
                transition={{ delay: intro ? delay : 0, duration: 0.35 }}
                onAnimationComplete={() => intro && delay === lastIntroDelay && onIntroDone()}
                style={{ '--tile-color': tile.color } as CSSProperties}
                className={`floor-tile relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-md text-[10px] font-semibold text-white sm:text-xs ${
                  isPlayer || isTarget ? '' : 'brightness-[0.55] saturate-[0.8]'
                } ${isTarget ? 'cursor-pointer' : ''}`}
              >
                <img src={icon} alt="" className="size-8 drop-shadow sm:size-11" draggable={false} />
                <span className="truncate drop-shadow">{isPlayer ? 'Ty' : tile.botName}</span>
                {wave && isPlayer && (
                  <motion.span
                    key={wave.key}
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.85, 0] }}
                    transition={{ delay: distance(i, wave.origin) * WAVE_STEP, duration: 0.5 }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
