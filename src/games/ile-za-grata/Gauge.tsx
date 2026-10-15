import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { MAX_POINTS_PER_CAR } from './logic'

const SWEEP = 240
const TICKS = Array.from({ length: 11 }, (_, i) => i * 10)

function polar(value: number, radius: number) {
  const angle = ((value / MAX_POINTS_PER_CAR) * SWEEP - SWEEP / 2 - 90) * (Math.PI / 180)
  return { x: 100 + radius * Math.cos(angle), y: 100 + radius * Math.sin(angle) }
}

export function Gauge({ score, delay, duration }: { score: number | null; delay: number; duration: number }) {
  const points = useMotionValue(0)
  const rotate = useTransform(points, [0, MAX_POINTS_PER_CAR], [-SWEEP / 2, SWEEP / 2])
  const readout = useTransform(points, (v) => Math.round(v))
  useEffect(() => {
    const controls = animate(points, score ?? 0, score === null ? { duration: 0.3 } : { duration, delay, ease: [0.3, 0.7, 0.4, 1] })
    return () => controls.stop()
  }, [points, score, delay, duration])

  return (
    <div className="gr-gauge" data-testid="gauge" data-score={score ?? ''}>
      <svg viewBox="0 0 200 170" aria-hidden>
        <circle cx="100" cy="100" r="94" fill="#16181c" stroke="#9aa1a9" strokeWidth="5" />
        <path d={`M${polar(70, 80).x} ${polar(70, 80).y} A80 80 0 0 1 ${polar(100, 80).x} ${polar(100, 80).y}`} stroke="#2f9e44" strokeWidth="8" fill="none" />
        <path d={`M${polar(0, 80).x} ${polar(0, 80).y} A80 80 0 0 1 ${polar(30, 80).x} ${polar(30, 80).y}`} stroke="#c92a2a" strokeWidth="8" fill="none" />
        {TICKS.map((value) => {
          const outer = polar(value, 76)
          const inner = polar(value, 64)
          const label = polar(value, 50)
          return (
            <g key={value}>
              <line x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} stroke="#f1f3f5" strokeWidth="3" />
              <text x={label.x} y={label.y + 4} textAnchor="middle" className="gr-gauge-label">
                {value}
              </text>
            </g>
          )
        })}
        <motion.g style={{ rotate }}>
          <circle cx="100" cy="100" r="74" fill="none" />
          <path d="M97 104 L100 26 L103 104 Z" fill="#ff6b3d" />
        </motion.g>
        <circle cx="100" cy="100" r="9" fill="#3a3f46" stroke="#9aa1a9" strokeWidth="2" />
        <rect x="70" y="124" width="60" height="26" rx="4" fill="#0b0c0e" />
        <motion.text x="100" y="145" textAnchor="middle" className="gr-gauge-readout">
          {readout}
        </motion.text>
      </svg>
      <p className="gr-gauge-caption">punkty za wycenę</p>
    </div>
  )
}
