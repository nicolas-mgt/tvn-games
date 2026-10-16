import { AnimatePresence, motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import type { FurnitureKind } from './logic'

function Cover({ kind }: { kind: FurnitureKind }) {
  if (kind === 'szafa')
    return (
      <>
        <div className="pk-door" data-side="l">
          <span className="pk-knob" />
        </div>
        <div className="pk-door" data-side="r">
          <span className="pk-knob" />
        </div>
      </>
    )
  if (kind === 'regal')
    return (
      <div className="pk-blind">
        <span className="pk-cord" />
      </div>
    )
  return (
    <div className="pk-hatch">
      <span className="pk-glass" />
      <span className="pk-badge">PK</span>
    </div>
  )
}

function Top({ kind }: { kind: FurnitureKind }) {
  if (kind === 'regal')
    return (
      <div className="pk-top">
        <svg viewBox="0 0 60 20" className="pk-stickers" aria-hidden>
          <path d="M10 2 l2.4 5 5.4 .6 -4 3.7 1.1 5.4 -4.9 -2.8 -4.9 2.8 1.1 -5.4 -4 -3.7 5.4 -.6 Z" fill="#f2c230" />
          <path d="M30 17 C18 9 22 2 30 7 C38 2 42 9 30 17 Z" fill="#e85a7a" />
          <circle cx="50" cy="10" r="6" fill="#4aa0e0" />
        </svg>
      </div>
    )
  return <div className="pk-top" />
}

function Bottom({ kind }: { kind: FurnitureKind }) {
  if (kind === 'bagaznik')
    return (
      <div className="pk-bottom">
        <span className="pk-light" data-side="l" />
        <span className="pk-plate">PCD 300K</span>
        <span className="pk-light" data-side="r" />
      </div>
    )
  return (
    <div className="pk-bottom">
      <span className="pk-leg" data-side="l" />
      <span className="pk-leg" data-side="r" />
    </div>
  )
}

export function Furniture({ kind, rows, cols, closed, mini = false, children }: { kind: FurnitureKind; rows: number; cols: number; closed: boolean; mini?: boolean; children?: ReactNode }) {
  return (
    <div
      className="pk-furniture"
      data-testid={mini ? undefined : 'furniture'}
      data-kind={kind}
      data-closed={closed}
      data-mini={mini}
      style={{ '--cols': cols, '--rows': rows } as CSSProperties}
    >
      <Top kind={kind} />
      <div className="pk-body">
        <div className="pk-inner">
          {children}
          <Cover kind={kind} />
        </div>
      </div>
      <Bottom kind={kind} />
      <AnimatePresence>
        {closed && (
          <motion.div
            className="pk-sticker pk-hand"
            initial={mini ? false : { scale: 2.4, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: mini ? 0 : 0.6 }}
          >
            Poukładane!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
