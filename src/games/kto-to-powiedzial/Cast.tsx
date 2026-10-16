import type { ReactNode } from 'react'
import { castMood, SOURCE_IDS, type CastMood, type SourceId } from './logic'

const SKIN = '#f0c6a0'
const INK = '#2a1a14'

function Eye({ x, y, mood, color = INK }: { x: number; y: number; mood: CastMood; color?: string }) {
  switch (mood) {
    case 'proud':
      return <path d={`M${x - 5} ${y + 1} q5 -7 10 0`} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    case 'eyeroll':
      return (
        <>
          <circle cx={x} cy={y} r="5" fill="#fff" stroke={color} strokeWidth="1.5" />
          <circle cx={x} cy={y - 2.6} r="2.3" fill={color} />
        </>
      )
    case 'watching':
      return <circle cx={x + 3} cy={y} r="3" fill={color} />
    case 'denying':
      return (
        <>
          <circle cx={x} cy={y + 1} r="3" fill={color} />
          <path d={`M${x - 6} ${y - 7} l12 3`} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )
    default:
      return <circle cx={x} cy={y} r="3" fill={color} />
  }
}

function Mouth({ x, y, mood, color = INK }: { x: number; y: number; mood: CastMood; color?: string }) {
  switch (mood) {
    case 'proud':
      return <path d={`M${x - 9} ${y} q9 13 18 0 Z`} fill={color === INK ? '#7a1e2a' : color} stroke={color} strokeWidth="2" strokeLinejoin="round" />
    case 'denying':
      return <path d={`M${x - 7} ${y + 4} q7 -7 14 0`} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    case 'eyeroll':
      return <path d={`M${x - 6} ${y + 1} h12`} stroke={color} strokeWidth="3" strokeLinecap="round" />
    case 'watching':
      return <ellipse cx={x + 2} cy={y + 1} rx="3" ry="3.5" fill={color} />
    default:
      return <path d={`M${x - 7} ${y} q7 7 14 0`} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
  }
}

function Face({ x, y, mood, spread = 9 }: { x: number; y: number; mood: CastMood; spread?: number }) {
  return (
    <>
      <Eye x={x - spread} y={y} mood={mood} />
      <Eye x={x + spread} y={y} mood={mood} />
      <Mouth x={x} y={y + 14} mood={mood} />
    </>
  )
}

function Celebrity({ mood }: { mood: CastMood }) {
  return (
    <>
      <rect x="20" y="96" width="180" height="62" rx="26" fill="#d9558a" />
      <rect x="10" y="130" width="200" height="40" rx="16" fill="#e86a9a" />
      <path d="M70 172 q2 -54 40 -58 q38 4 40 58 Z" fill="#2a2a3a" />
      {[78, 92, 106, 120, 134, 146].map((x, i) => (
        <circle key={x} cx={x} cy={118 + (i % 2) * 6} r="11" fill="#f6f2ec" />
      ))}
      <circle cx="110" cy="70" r="40" fill="#f2c84a" />
      <circle cx="80" cy="88" r="16" fill="#f2c84a" />
      <circle cx="140" cy="88" r="16" fill="#f2c84a" />
      <ellipse cx="110" cy="76" rx="24" ry="27" fill={SKIN} />
      <rect x="88" y="36" width="44" height="12" rx="6" fill="#1a1a22" />
      <circle cx="98" cy="42" r="2" fill="#8ad0ff" />
      <Face x={110} y={74} mood={mood} />
      <path d="M90 84 q3 4 6 0 M124 84 q3 4 6 0" stroke="#f08a8a" strokeWidth="3" opacity="0.6" />
      <g transform="translate(168 98)">
        <path d="M0 0 h18 l-6 22 h-6 Z" fill="#fff8d0" opacity="0.8" />
        <path d="M9 22 V40 M2 40 h14" stroke="#e8e0d0" strokeWidth="3" />
      </g>
    </>
  )
}

function Family({ mood }: { mood: CastMood }) {
  return (
    <>
      <rect x="6" y="90" width="208" height="62" rx="20" fill="#7a5a3a" />
      <rect x="0" y="128" width="220" height="44" rx="14" fill="#8a6a44" />
      <path d="M16 172 q2 -40 30 -44 q28 4 30 44 Z" fill="#8a6a9a" />
      <path d="M80 172 q2 -46 30 -50 q28 4 30 50 Z" fill="#4a6a8a" />
      <path d="M144 172 q2 -40 30 -44 q28 4 30 44 Z" fill="#3a8a6a" />
      <circle cx="46" cy="66" r="7" fill="#c8c8d0" />
      <ellipse cx="46" cy="94" rx="20" ry="22" fill={SKIN} />
      <path d="M26 92 q0 -26 20 -26 q20 0 20 26 q-6 -14 -20 -14 q-14 0 -20 14 Z" fill="#c8c8d0" />
      <Face x={46} y={94} mood={mood} spread={7} />
      <circle cx="39" cy="94" r="7" fill="none" stroke={INK} strokeWidth="1.5" />
      <circle cx="53" cy="94" r="7" fill="none" stroke={INK} strokeWidth="1.5" />
      <ellipse cx="110" cy="86" rx="22" ry="25" fill={SKIN} />
      <path d="M90 76 q20 -16 40 0" stroke="#5a3a24" strokeWidth="4" fill="none" />
      <Face x={110} y={84} mood={mood} spread={8} />
      <path d="M100 95 q10 -5 20 0" stroke="#5a3a24" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M192 74 q16 10 8 34" stroke="#7a3a8a" strokeWidth="9" fill="none" strokeLinecap="round" />
      <ellipse cx="174" cy="94" rx="20" ry="22" fill={SKIN} />
      <path d="M154 92 q0 -28 20 -28 q20 0 20 28 q-8 -16 -30 -10 Z" fill="#7a3a8a" />
      <Face x={174} y={94} mood={mood} spread={7} />
      <rect x="182" y="132" width="14" height="22" rx="3" fill="#1a1a22" stroke="#8a8a94" strokeWidth="1.5" />
    </>
  )
}

function Robot({ mood }: { mood: CastMood }) {
  const green = '#7dff8a'
  return (
    <>
      <path d="M110 30 V12" stroke="#8a8a94" strokeWidth="4" />
      <circle cx="110" cy="10" r="6" fill="#ff5a5a" className="kt-robot-light" />
      <rect x="50" y="28" width="120" height="104" rx="12" fill="#d8ceb0" />
      <rect x="62" y="40" width="96" height="74" rx="10" fill="#0e2a14" />
      <Eye x={92} y={68} mood={mood} color={green} />
      <Eye x={128} y={68} mood={mood} color={green} />
      <Mouth x={110} y={88} mood={mood} color={green} />
      <circle cx="152" cy="124" r="4" fill="#5a9a5a" />
      <rect x="64" y="122" width="40" height="5" rx="2" fill="#a89a7a" />
      <path d="M70 132 L58 156 H162 L150 132 Z" fill="#c8bea0" />
      <rect x="40" y="150" width="140" height="22" rx="5" fill="#bfb496" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={46 + i * 13} y="155" width="10" height="5" rx="1" fill="#8a8068" />
      ))}
      <rect x="66" y="163" width="88" height="5" rx="1" fill="#8a8068" />
    </>
  )
}

const ART: Record<SourceId, (props: { mood: CastMood }) => ReactNode> = { celebryta: Celebrity, rodzina: Family, generator: Robot }

/** The three possible sources as clickable figures; without `onPick` they are only shown. */
export function Cast({ labels, answer, source, onPick }: { labels: Record<string, string>; answer: string | null; source: string | null; onPick?: (id: SourceId) => void }) {
  return (
    <div className="kt-cast">
      {SOURCE_IDS.map((id, i) => {
        const mood = source === null ? 'waiting' : castMood(id, answer, source)
        const Art = ART[id]
        return (
          <button
            key={id}
            type="button"
            className="kt-member"
            data-testid={`source-${id}`}
            data-mood={mood}
            data-picked={answer === id}
            disabled={!onPick || answer !== null}
            onClick={() => onPick?.(id)}
          >
            <svg viewBox="0 0 220 176" className="kt-member-art" role="img" aria-label={labels[id]}>
              <Art mood={mood} />
            </svg>
            <span className="kt-member-label">
              {onPick && <kbd className="kt-key">{i + 1}</kbd>}
              {labels[id]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
