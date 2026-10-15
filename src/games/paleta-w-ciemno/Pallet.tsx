import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { formatZl, REVEAL_DELAY, REVEAL_STEP } from './logic'

export type PalletItem = { id: string; name: string; value: number; photo: { author: string; license: string; source: string } }

const CARTONS = [
  { w: 34, h: 46, c: '#b98a52' },
  { w: 28, h: 38, c: '#a87a45' },
  { w: 38, h: 52, c: '#c49660' },
  { w: 30, h: 34, c: '#b0824c' },
  { w: 26, h: 44, c: '#9e7140' },
]

function CountUp({ value, delay }: { value: number; delay: number }) {
  const amount = useMotionValue(0)
  const text = useTransform(amount, (v) => formatZl(Math.round(v / 10) * 10))
  useEffect(() => {
    const controls = animate(amount, value, { duration: 0.7, delay, ease: 'easeOut' })
    return () => controls.stop()
  }, [amount, value, delay])
  return <motion.span>{text}</motion.span>
}

function PalletBase() {
  return (
    <svg viewBox="0 0 400 34" className="pw-pallet-base" preserveAspectRatio="none" aria-hidden>
      <rect x="0" y="0" width="400" height="8" fill="#c9a06a" />
      <rect x="0" y="24" width="400" height="8" fill="#b88d58" />
      {[0, 186, 372].map((x) => (
        <rect key={x} x={x} y="8" width="28" height="16" fill="#8f6a3e" />
      ))}
      {[40, 120, 200, 280, 360].map((x) => (
        <path key={x} d={`M${x} 0 V8`} stroke="#9b7444" strokeWidth="2" />
      ))}
    </svg>
  )
}

type PalletProps = {
  number: number
  description: string
  stamp?: string
  revealed: boolean
  contents: PalletItem[]
  paid?: number
  pace: number
}

export function Pallet({ number, description, stamp, revealed, contents, paid, pace }: PalletProps) {
  const value = contents.reduce((sum, item) => sum + item.value, 0)
  const countDelay = (REVEAL_DELAY + contents.length * REVEAL_STEP) * pace
  const stampMark = stamp && (
    <div className="pw-stamp-slot">
      <motion.div
        className="pw-stamp"
        data-testid="stamp"
        initial={{ scale: 2.2, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: -12 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        {stamp}
      </motion.div>
    </div>
  )
  return (
    <div className="pw-pallet" data-testid="pallet" data-revealed={revealed}>
      <div className="pw-load">
        {revealed ? (
          <ul className="pw-items">
            {contents.map((item, i) => (
              <motion.li
                key={item.id}
                className="pw-item"
                data-testid="reveal-item"
                initial={{ opacity: 0, y: 40, rotate: i % 2 ? 6 : -6 }}
                animate={{ opacity: 1, y: 0, rotate: i % 2 ? 1.5 : -1.5 }}
                transition={{ delay: (REVEAL_DELAY + i * REVEAL_STEP) * pace, type: 'spring', stiffness: 260, damping: 20 }}
              >
                <img src={`/paleta-w-ciemno/items/${item.id}.jpg`} alt={item.name} draggable={false} className="pw-item-photo" />
                <p className="pw-item-name">{item.name}</p>
                <span className="pw-tag">{formatZl(item.value)}</span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="pw-wrapped">
            {CARTONS.map((c, i) => (
              <span key={i} className="pw-carton" style={{ width: `${c.w}%`, height: `${c.h}%`, backgroundColor: c.c }} />
            ))}
            <div className="pw-foil" />
          </div>
        )}
        {revealed && (
          <>
            <motion.div className="pw-cut" initial={{ scaleY: 0, opacity: 1 }} animate={{ scaleY: 1, opacity: 0 }} transition={{ duration: 0.45 * pace + 0.05 }} />
            <motion.div
              className="pw-foil pw-foil-half pw-foil-left"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: '-60%', rotate: -10, opacity: 0 }}
              transition={{ delay: 0.15 * pace, duration: 0.6 * pace + 0.05 }}
            />
            <motion.div
              className="pw-foil pw-foil-half pw-foil-right"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: '60%', rotate: 10, opacity: 0 }}
              transition={{ delay: 0.15 * pace, duration: 0.6 * pace + 0.05 }}
            />
          </>
        )}
      </div>
      <PalletBase />
      {!revealed && stampMark}
      <div className="pw-waybill">
        <p className="pw-waybill-title">List przewozowy nr {number}</p>
        <p className="pw-hand text-xl">{description}</p>
        {revealed && stampMark}
      </div>
      {revealed && (
        <motion.p
          className="pw-balance"
          data-testid="balance"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: countDelay }}
        >
          Wartość: <CountUp value={value} delay={countDelay} />
          {paid !== undefined && (
            <>
              {' '}
              · zapłacone {formatZl(paid)} ·{' '}
              <strong className={value - paid >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                {value - paid >= 0 ? '+' : ''}
                {formatZl(value - paid)}
              </strong>
            </>
          )}
        </motion.p>
      )}
    </div>
  )
}
