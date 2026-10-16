import type { CSSProperties } from 'react'
import { TIER_IDS, TIERS, type TierId } from './logic'

/** Elevator shaft of the archive: the cabin drops to the floor of the tier that was hit. */
export function Shaft({ tier, state }: { tier: TierId | null; state: 'waiting' | 'hit' | 'miss' }) {
  const depth = state === 'hit' && tier ? TIERS[tier].depth : 0
  return (
    <div className="ar-shaft" data-testid="shaft" data-state={state} aria-label="Głębia archiwum">
      <p className="ar-shaft-title ar-sign">Głębia archiwum</p>
      <div className="ar-shaft-track">
        {TIER_IDS.map((id) => (
          <div key={id} className="ar-floor" data-reached={state === 'hit' && id === tier} style={{ '--d': TIERS[id].depth, '--ar-c': TIERS[id].color } as CSSProperties}>
            <span className="ar-floor-name">{TIERS[id].name}</span>
            <b>{TIERS[id].score}</b>
          </div>
        ))}
        <div
          className="ar-cabin"
          data-testid="cabin"
          data-tier={state === 'hit' ? (tier ?? undefined) : undefined}
          style={{ '--d': depth, '--ar-c': tier ? TIERS[tier].color : '#f2dfb0' } as CSSProperties}
        >
          <svg viewBox="0 0 40 40" aria-hidden>
            <path d="M20 0 V6" stroke="#8a847a" strokeWidth="2" />
            <rect x="4" y="6" width="32" height="32" rx="3" fill="#3a3632" stroke="var(--ar-c)" strokeWidth="3" />
            <rect x="10" y="12" width="9" height="22" fill="#5a5650" />
            <rect x="21" y="12" width="9" height="22" fill="#5a5650" />
          </svg>
        </div>
      </div>
    </div>
  )
}
