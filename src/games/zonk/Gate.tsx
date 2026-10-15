import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { formatZl } from './logic'

export type Item = {
  id: string
  name: string
  value?: number
  photo: { author: string; license: string; source: string }
}

const ACROSS = 6
const DOWN = 9

/** Bulbs run clockwise around the frame so the chase animation travels along it. */
const BULBS = [
  ...Array.from({ length: ACROSS }, (_, i) => ({ x: i / ACROSS, y: 0 })),
  ...Array.from({ length: DOWN }, (_, i) => ({ x: 1, y: i / DOWN })),
  ...Array.from({ length: ACROSS }, (_, i) => ({ x: 1 - i / ACROSS, y: 1 })),
  ...Array.from({ length: DOWN }, (_, i) => ({ x: 0, y: 1 - i / DOWN })),
]

type GateProps = {
  index: number
  item: Item
  picked: boolean
  open: boolean
  focus: boolean
  disabled: boolean
  onPick: () => void
}

export function Gate({ index, item, picked, open, focus, disabled, onPick }: GateProps) {
  return (
    <button
      type="button"
      className="zk-gate"
      data-testid={`door-${index}`}
      data-picked={picked}
      data-open={open}
      data-focus={focus}
      aria-label={`Bramka nr ${index + 1}${open ? `: ${item.name}` : ''}`}
      disabled={disabled}
      onClick={onPick}
    >
      {BULBS.map((b, i) => (
        <span
          key={i}
          className="zk-gate-bulb zk-bulb"
          style={{ left: `calc(5.5px + (100% - 11px) * ${b.x})`, top: `calc(5.5px + (100% - 11px) * ${b.y})`, '--i': i, '--n': BULBS.length } as CSSProperties}
        />
      ))}
      <span className="zk-gate-sign">{index + 1}</span>
      <span className="zk-gate-window">
        <span className="zk-gate-stage" aria-hidden={!open}>
          <img src={`/zonk/items/${item.id}.jpg`} alt="" draggable={false} className="zk-gate-photo" data-item={item.id} />
          <span className="zk-plate">{item.name}</span>
          {open && (
            <motion.span
              className="zk-sticker"
              data-kind={item.value ? 'prize' : 'zonk'}
              initial={{ scale: 2.5, opacity: 0, rotate: 8 }}
              animate={{ scale: 1, opacity: 1, rotate: 8 }}
              transition={{ delay: 0.45, duration: 0.25, ease: 'easeIn' }}
            >
              {item.value ? formatZl(item.value) : 'ZONK!'}
            </motion.span>
          )}
        </span>
        <motion.span
          className="zk-curtain"
          initial={false}
          animate={open ? { scaleY: 0, scaleX: [1, 0.96, 1] } : { scaleY: 1, scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.5, 0, 0.2, 1] }}
        >
          <span className="zk-curtain-mark">?</span>
        </motion.span>
        <span className="zk-valance" />
      </span>
      {picked && (
        <motion.span className="zk-choice" style={{ x: '-50%' }} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          Twój wybór
        </motion.span>
      )}
    </button>
  )
}
