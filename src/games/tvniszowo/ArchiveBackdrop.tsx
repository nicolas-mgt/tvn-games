import type { CSSProperties } from 'react'
import './tvniszowo.css'

export type Mood = 'idle' | 'preview' | 'answering' | 'urgent' | 'hit' | 'gold' | 'miss' | 'result'

const UNITS = [40, 210, 380, 1060, 1230, 1400]
const SHELVES = [190, 310, 430, 550, 670]
const CASES = ['#1d1b22', '#24222b', '#2b2620', '#191c24']
const LABELS = ['#f4ecd8', '#f4ecd8', '#e9d9a8', '#cfe0f0', '#f4ecd8', '#f0c8b0']
const LAMPS = [300, 800, 1300]
const DUST = Array.from({ length: 16 }, (_, i) => ({ x: 640 + ((i * 97) % 320), y: 200 + ((i * 53) % 420), r: 1.5 + (i % 3), delay: (i * 0.7) % 6 }))

/** Deterministic tape spines for one shelf: widths, case colors and which ones glow in the tier color. */
function spines(unit: number, shelf: number) {
  const items: { x: number; w: number; h: number; fill: string; label: string; glow: boolean }[] = []
  let x = unit + 6
  let i = 0
  while (x < unit + 150) {
    const seed = (unit * 7 + shelf * 13 + i * 31) % 97
    const w = 14 + (seed % 3) * 4
    if (x + w > unit + 154) break
    items.push({ x, w, h: 78 + (seed % 4) * 6, fill: CASES[seed % CASES.length], label: LABELS[seed % LABELS.length], glow: seed % 11 === 0 })
    x += w + 2 + (seed % 5 === 0 ? 10 : 0)
    i++
  }
  return items
}

function Shelving() {
  return (
    <g>
      {UNITS.map((unit) => (
        <g key={unit}>
          <rect x={unit} y="150" width="160" height="640" fill="#2a2522" />
          <rect x={unit} y="150" width="8" height="640" fill="#5a5550" />
          <rect x={unit + 152} y="150" width="8" height="640" fill="#4a4540" />
          {SHELVES.map((shelf) => (
            <g key={shelf}>
              {spines(unit, shelf).map((s) => (
                <g key={s.x}>
                  <rect x={s.x} y={shelf + 100 - s.h} width={s.w} height={s.h} rx="1.5" fill={s.fill} />
                  <rect x={s.x + 2} y={shelf + 100 - s.h + 10} width={s.w - 4} height={s.h * 0.45} fill={s.label} opacity="0.85" className={s.glow ? 'ar-spine-glow' : undefined} />
                  <path d={`M${s.x + 4} ${shelf + 100 - s.h + 18} v${s.h * 0.3}`} stroke="#3a3530" strokeWidth="1.5" opacity="0.5" />
                </g>
              ))}
              <rect x={unit} y={shelf + 100} width="160" height="9" fill="#6a6560" />
              <rect x={unit + 50} y={shelf + 102} width="34" height="5" fill="#f4ecd8" opacity="0.6" />
            </g>
          ))}
        </g>
      ))}
    </g>
  )
}

function Vault() {
  return (
    <g>
      <rect x="590" y="190" width="420" height="600" fill="#1e1a17" />
      <circle className="ar-vault-glow" cx="800" cy="480" r="250" fill="url(#ar-gold)" />
      <circle cx="800" cy="480" r="168" fill="#4a4540" stroke="#6e6860" strokeWidth="10" />
      <circle cx="800" cy="480" r="138" fill="#5c5650" stroke="#3a3632" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return <circle key={i} cx={800 + Math.cos(a) * 153} cy={480 + Math.sin(a) * 153} r="5" fill="#8a847a" />
      })}
      <g className="ar-vault-wheel">
        <circle cx="800" cy="480" r="46" fill="none" stroke="#c9b27a" strokeWidth="9" />
        {[0, 60, 120].map((deg) => (
          <rect key={deg} x="728" y="475" width="144" height="10" rx="5" fill="#c9b27a" transform={`rotate(${deg} 800 480)`} />
        ))}
        <circle cx="800" cy="480" r="14" fill="#e8d49a" />
      </g>
      <rect x="610" y="700" width="380" height="90" fill="#26211d" />
      <path d="M610 700 H990" stroke="#f2c84a" strokeWidth="10" strokeDasharray="28 22" opacity="0.55" />
    </g>
  )
}

function Lamp({ x }: { x: number }) {
  return (
    <g className="ar-lamp" style={{ transformOrigin: `${x}px 0px` }}>
      <path className="ar-cone" d={`M${x - 26} 118 L${x - 260} 900 H${x + 260} L${x + 26} 118 Z`} fill="url(#ar-cone)" />
      <path d={`M${x} 0 V90`} stroke="#151210" strokeWidth="3" />
      <path d={`M${x - 14} 88 H${x + 14} L${x + 34} 120 H${x - 34} Z`} fill="#3a4a3e" />
      <ellipse className="ar-bulb" cx={x} cy="122" rx="12" ry="6" fill="#fff2c0" />
    </g>
  )
}

export function ArchiveBackdrop({ mood, tierColor }: { mood: Mood; tierColor?: string }) {
  return (
    <div
      className="ar-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      data-mood={mood}
      data-testid="archive-backdrop"
      style={{ '--ar-tier': tierColor ?? '#f2dfb0' } as CSSProperties}
    >
      <svg className="ar-layer" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <defs>
          <linearGradient id="ar-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#262019" />
            <stop offset="1" stopColor="#14110e" />
          </linearGradient>
          <linearGradient id="ar-cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.32" />
            <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ar-gold">
            <stop offset="0" stopColor="#ffe066" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffe066" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#ar-wall)" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M0 ${40 + i * 100} H1600`} stroke="#000" strokeOpacity="0.18" strokeWidth="2" />
        ))}
        <Vault />
        <Shelving />
        <rect y="790" width="1600" height="110" fill="#1a1613" />
        {[-640, -320, 0, 320, 640].map((dx) => (
          <path key={dx} d={`M${800 + dx * 0.35} 790 L${800 + dx * 1.6} 900`} stroke="#000" strokeOpacity="0.3" strokeWidth="2" />
        ))}
        <g className="ar-beacon">
          <rect x="784" y="40" width="32" height="26" rx="6" fill="#5a1616" />
          <circle className="ar-beacon-light" cx="800" cy="40" r="18" fill="#ff3b3b" />
        </g>
        {LAMPS.map((x) => (
          <Lamp key={x} x={x} />
        ))}
        <g className="ar-dust">
          {DUST.map((d) => (
            <circle key={d.x} cx={d.x} cy={d.y} r={d.r} fill="#fff4d0" style={{ animationDelay: `${d.delay}s` }} />
          ))}
        </g>
      </svg>
      <div className="ar-dark" />
      <div className="ar-glow" />
      <div className="ar-alarm" />
      <div className="ar-vignette" />
    </div>
  )
}
