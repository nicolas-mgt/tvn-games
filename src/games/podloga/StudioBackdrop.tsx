import type { CSSProperties } from 'react'
import './studio.css'

export type Mood = 'intro' | 'floor' | 'duel' | 'danger' | 'win' | 'lose'

const BEAMS = [
  { left: '2%', color: '#22d3ee', aim: '-18deg', aimDuel: '-32deg', sweepTime: '7s' },
  { left: '24%', color: '#a855f7', aim: '-6deg', aimDuel: '-14deg', sweepTime: '9s' },
  { left: '50%', color: '#f472b6', aim: '6deg', aimDuel: '14deg', sweepTime: '8s' },
  { left: '72%', color: '#38bdf8', aim: '18deg', aimDuel: '32deg', sweepTime: '10s' },
]

const AUDIENCE = Array.from({ length: 46 }, (_, i) => ({
  x: i * 27 + ((i * 7) % 11),
  y: 52 + ((i * 13) % 17),
  r: 13 + ((i * 5) % 5),
}))

export function StudioBackdrop({ mood }: { mood: Mood }) {
  return (
    <div className="studio-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-mood={mood} data-testid="studio-backdrop">
      <div className="studio-led-glow" />
      <div className="studio-led" />
      {BEAMS.map((beam, i) => (
        <div
          key={beam.left}
          className="beam-pivot"
          style={{ left: beam.left, '--aim': beam.aim, '--aim-duel': beam.aimDuel, '--intro-delay': `${i * 0.25}s` } as CSSProperties}
        >
          <div className="beam" style={{ '--beam-color': beam.color, '--sweep-time': beam.sweepTime } as CSSProperties} />
        </div>
      ))}
      <div className="studio-haze" />
      <svg className="studio-audience" viewBox="0 0 1260 110" preserveAspectRatio="xMidYMax slice" aria-hidden>
        {AUDIENCE.map((p, i) => (
          <g key={i} fill="#030208">
            <circle cx={p.x} cy={p.y} r={p.r} />
            <ellipse cx={p.x} cy={p.y + p.r * 2.6} rx={p.r * 1.9} ry={p.r * 1.8} />
          </g>
        ))}
      </svg>
      <div className="studio-vignette" />
      <div className="studio-flash" />
    </div>
  )
}
