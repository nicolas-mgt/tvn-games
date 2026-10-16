import type { CSSProperties } from 'react'
import { MISS, ROUNDS, TIERS, type RoundResult, type TierId } from './logic'

/** VHS cassette used as the round timer: tape winds from the left reel to the right one. */
export function Cassette({ remaining, total, running, warn }: { remaining: number; total: number; running: boolean; warn: boolean }) {
  const left = Math.max(0, remaining / total)
  const seconds = Math.ceil(remaining)
  return (
    <div className="ar-cassette" data-testid="timer" data-value={seconds} data-warn={warn} data-running={running}>
      <svg viewBox="0 0 220 130" aria-hidden>
        <rect x="4" y="4" width="212" height="122" rx="10" fill="#1d1b22" stroke="#3a3842" strokeWidth="3" />
        <rect x="18" y="14" width="184" height="30" rx="3" fill="#f4ecd8" />
        <rect x="18" y="14" width="184" height="7" fill={warn ? '#e23b3b' : '#d8a23a'} />
        <text x="30" y="39" className="ar-sign" fontSize="17" fill="#2a2420">
          TVN · ARCHIWUM
        </text>
        <text x="190" y="39" textAnchor="end" className="ar-sign" fontSize="20" fill={warn ? '#c41e1e' : '#2a2420'}>
          0:{String(seconds).padStart(2, '0')}
        </text>
        <rect x="52" y="54" width="116" height="48" rx="6" fill="#0c0b10" stroke="#4a4852" strokeWidth="2" />
        <circle cx="82" cy="78" r={6 + 16 * left} fill="#3a2a22" />
        <circle cx="138" cy="78" r={6 + 16 * (1 - left)} fill="#3a2a22" />
        {[82, 138].map((cx) => (
          <g key={cx} className="ar-reel" style={{ transformOrigin: `${cx}px 78px` }}>
            <circle cx={cx} cy="78" r="7" fill="#e8e4dc" />
            {[0, 60, 120].map((deg) => (
              <rect key={deg} x={cx - 1.5} y="71" width="3" height="14" fill="#1d1b22" transform={`rotate(${deg} ${cx} 78)`} />
            ))}
          </g>
        ))}
        <path d={`M${82 - 6 - 16 * left} 98 H${138 + 6 + 16 * (1 - left)}`} stroke="#3a2a22" strokeWidth="2" />
        <rect x="28" y="108" width="164" height="10" rx="2" fill="#2a2830" />
        <rect x="30" y="110" width={160 * left} height="6" rx="1" fill={warn ? '#e23b3b' : '#d8a23a'} />
      </svg>
    </div>
  )
}

/** Shelf with one tape slot per round; finished rounds show their tier color. */
export function TapeShelf({ results, current }: { results: RoundResult[]; current: number }) {
  return (
    <ol className="ar-shelf" data-testid="progress" aria-label="Postęp rund">
      {Array.from({ length: ROUNDS }, (_, i) => {
        const result = results[i]
        const state = result ? (result.tier ? 'hit' : 'miss') : i === current ? 'current' : 'empty'
        const color = result ? (result.tier ? TIERS[result.tier].color : MISS.color) : undefined
        return (
          <li
            key={i}
            data-state={state}
            data-tier={result?.tier ?? undefined}
            style={{ '--ar-c': color } as CSSProperties}
            title={result ? (result.tier ? TIERS[result.tier].name : MISS.name) : `Runda ${i + 1}`}
          />
        )
      })}
    </ol>
  )
}

/** Tier shown as a tape spine label in its color. */
export function TierTape({ tier, showScore = true }: { tier: TierId | null; showScore?: boolean }) {
  const info = tier ? TIERS[tier] : MISS
  return (
    <span className="ar-tape" style={{ '--ar-c': info.color } as CSSProperties} data-tier={tier ?? 'miss'}>
      <span className="ar-tape-name">{info.name}</span>
      {showScore && <b>{tier ? `${TIERS[tier].score} pkt` : '0 pkt'}</b>}
    </span>
  )
}
