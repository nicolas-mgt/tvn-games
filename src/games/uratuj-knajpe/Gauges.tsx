import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, type ComponentType } from 'react'
import { MAX_STAT, STAT_KEYS, STAT_LABELS, type StatKey, type Stats } from './logic'

function Pot({ value }: { value: number }) {
  const h = (value / MAX_STAT) * 26
  return (
    <svg viewBox="0 0 44 40" aria-hidden>
      {value >= 7 && <path className="kn-gauge-steam" d="M12 8 q4 -4 0 -8 M20 8 q4 -4 0 -8" stroke="#fff" strokeWidth="2" fill="none" />}
      <path d="M4 14 H32 V32 Q32 38 26 38 H10 Q4 38 4 32 Z" fill="#9aa3ad" stroke="#5a636d" strokeWidth="2" />
      <path d="M1 14 H35" stroke="#5a636d" strokeWidth="3" strokeLinecap="round" />
      <rect x="36" y="4" width="6" height="30" rx="3" fill="#fff" stroke="#5a636d" strokeWidth="1.5" />
      <rect x="37.5" y={33 - h} width="3" height={h} fill="#d8323a" />
      <circle cx="39" cy="35" r="4" fill="#d8323a" />
    </svg>
  )
}

function Heart({ value }: { value: number }) {
  return (
    <svg viewBox="0 0 40 36" aria-hidden className="kn-heart" style={{ opacity: 0.3 + (value / MAX_STAT) * 0.7, filter: `drop-shadow(0 0 ${value}px #ff4fb8)` }}>
      <path d="M20 33 L5 18 Q-1 10 6 4 Q13 -1 20 8 Q27 -1 34 4 Q41 10 35 18 Z" fill="none" stroke="#ff7ad0" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  )
}

function CashBox({ value }: { value: number }) {
  const notes = Math.ceil(value / 2)
  return (
    <svg viewBox="0 0 44 36" aria-hidden>
      <path d="M4 18 H40 V34 H4 Z" fill="#4a5a6a" />
      {Array.from({ length: notes }, (_, i) => (
        <rect key={i} x={8 + (i % 2) * 3} y={16 - i * 2.6} width="26" height="6" fill="#6fae5a" stroke="#3a7a2a" strokeWidth="1" />
      ))}
      <path d="M4 18 L8 10 H44 L40 18 Z" fill="#6a7a8a" opacity={notes > 3 ? 0.4 : 1} />
    </svg>
  )
}

const ICONS: Record<StatKey, ComponentType<{ value: number }>> = { jakosc: Pot, atmosfera: Heart, kasa: CashBox }

export function Gauges({ stats }: { stats: Stats }) {
  return (
    <div className="kn-gauges">
      {STAT_KEYS.map((key) => {
        const Icon = ICONS[key]
        return (
          <span key={key} id={`kn-gauge-${key}`} className="kn-gauge" data-testid={`stat-${key}`} data-value={stats[key]} aria-label={`${STAT_LABELS[key]}: ${stats[key]}`}>
            <Icon value={stats[key]} />
            <motion.b key={stats[key]} initial={{ scale: 1.6 }} animate={{ scale: 1 }}>
              {stats[key]}
            </motion.b>
          </span>
        )
      })}
    </div>
  )
}

/** A "+1" chip next to the chosen card; a copy of it flies into the matching gauge in the bar. */
export function Delta({ stat, value, delay }: { stat: StatKey; value: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const chip = ref.current
    const gauge = document.getElementById(`kn-gauge-${stat}`)
    if (!chip || !gauge || reducedMotion) return
    const from = chip.getBoundingClientRect()
    const to = gauge.getBoundingClientRect()
    const ghost = chip.cloneNode(true) as HTMLSpanElement
    ghost.removeAttribute('data-testid')
    Object.assign(ghost.style, { position: 'fixed', left: `${from.left}px`, top: `${from.top}px`, margin: '0', zIndex: '50', pointerEvents: 'none' })
    document.body.append(ghost)
    const flight = ghost.animate(
      [
        { transform: 'translate(0, 0) scale(1.2)', opacity: 1 },
        { transform: `translate(${to.left + to.width / 2 - from.left - from.width / 2}px, ${to.top - from.top}px) scale(0.6)`, opacity: 0.2 },
      ],
      { duration: 800, delay, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' },
    )
    flight.onfinish = () => ghost.remove()
    return () => ghost.remove()
  }, [stat, delay, reducedMotion])
  return (
    <span ref={ref} className="kn-delta" data-testid="delta" data-stat={stat} data-value={value} data-sign={value > 0 ? 'plus' : 'minus'}>
      {value > 0 ? `+${value}` : `−${-value}`} {STAT_LABELS[stat]}
    </span>
  )
}
