import type { ReactNode } from 'react'
import { JUROR_NAMES, JURORS, juryMood, type JurorId, type JuryMood } from './logic'

const INK = '#2b1d14'

function Mouth({ mood }: { mood: JuryMood }) {
  return {
    delighted: <path d="M66 98 Q80 118 94 98 Z" fill="#7a2630" stroke={INK} strokeWidth="3" strokeLinejoin="round" />,
    pleased: <path d="M68 100 Q80 110 92 100" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />,
    doubtful: <path d="M68 104 Q78 100 92 102" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />,
    disappointed: <path d="M68 108 Q80 98 92 108" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />,
  }[mood]
}

function Face({ mood, skin }: { mood: JuryMood; skin: string }) {
  const brows = {
    delighted: 'M58 70 Q66 64 74 70 M86 70 Q94 64 102 70',
    pleased: 'M58 72 Q66 68 74 72 M86 72 Q94 68 102 72',
    doubtful: 'M58 66 Q66 60 74 66 M86 74 L102 72',
    disappointed: 'M58 68 L74 74 M86 74 L102 68',
  }[mood]
  return (
    <g>
      <ellipse cx="80" cy="86" rx="28" ry="34" fill={skin} />
      <path d={brows} stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {mood === 'delighted' ? (
        <path d="M60 82 Q66 76 72 82 M88 82 Q94 76 100 82" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <g fill={INK}>
          <circle cx="66" cy="82" r="3.5" />
          <circle cx="94" cy="82" r="3.5" />
        </g>
      )}
      {(mood === 'delighted' || mood === 'pleased') && (
        <g fill="#ff8a8a" opacity="0.5">
          <ellipse cx="60" cy="96" rx="7" ry="4" />
          <ellipse cx="100" cy="96" rx="7" ry="4" />
        </g>
      )}
    </g>
  )
}

function Szef({ mood }: { mood: JuryMood }) {
  return (
    <>
      <path d="M22 200 Q22 140 80 134 Q138 140 138 200 Z" fill="#fbfbf6" stroke="#d0d0c8" strokeWidth="3" />
      <g fill="#2a2e34">
        <circle cx="70" cy="150" r="3.5" />
        <circle cx="90" cy="150" r="3.5" />
      </g>
      <rect x="68" y="112" width="24" height="24" fill="#e3a982" />
      <Face mood={mood} skin="#e3a982" />
      <path d="M52 92 Q54 132 80 136 Q106 132 108 92 Q100 112 80 112 Q60 112 52 92 Z" fill="#b8b8b8" />
      <path d="M66 96 Q80 90 94 96" stroke="#9a9a9a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <Mouth mood={mood} />
      <path d="M50 60 Q46 4 64 8 Q72 -6 88 4 Q104 -4 112 12 Q120 30 110 60 Z" fill="#fff" stroke="#d0d0c8" strokeWidth="3" />
      <rect x="50" y="52" width="60" height="14" rx="3" fill="#f2f2ec" stroke="#d0d0c8" strokeWidth="2" />
      <path d="M30 172 Q80 152 130 172 L126 188 Q80 170 34 188 Z" fill="#eeeee6" stroke="#c8c8c0" strokeWidth="3" />
      <g fill="#e3a982">
        <ellipse cx="38" cy="180" rx="10" ry="8" />
        <ellipse cx="122" cy="180" rx="10" ry="8" />
      </g>
    </>
  )
}

function Cukierniczka({ mood }: { mood: JuryMood }) {
  return (
    <>
      <path d="M22 200 Q22 140 80 134 Q138 140 138 200 Z" fill="#f6f1ea" />
      <path d="M46 200 V146 Q80 156 114 146 V200 Z" fill="#f29ab4" stroke="#d26a8a" strokeWidth="3" />
      <path d="M46 146 Q80 128 114 146" stroke="#d26a8a" strokeWidth="4" fill="none" />
      <ellipse cx="34" cy="176" rx="12" ry="7" fill="#fff" opacity="0.9" />
      <circle cx="28" cy="170" r="4" fill="#fff" opacity="0.8" />
      <rect x="68" y="112" width="24" height="24" fill="#f0c3a0" />
      <path d="M50 92 Q46 50 80 48 Q114 50 110 92 Q104 64 80 62 Q56 64 50 92 Z" fill="#8a4a2a" />
      <circle cx="80" cy="36" r="18" fill="#8a4a2a" />
      <path d="M66 42 Q80 30 94 42" stroke="#f29ab4" strokeWidth="4" fill="none" />
      <Face mood={mood} skin="#f0c3a0" />
      <Mouth mood={mood} />
      <ellipse cx="100" cy="74" rx="6" ry="3" fill="#fff" opacity="0.85" />
    </>
  )
}

function Molekularny({ mood }: { mood: JuryMood }) {
  return (
    <>
      <path d="M22 200 Q22 140 80 134 Q138 140 138 200 Z" fill="#2f3a4a" />
      <path d="M66 136 L80 160 L94 136" stroke="#9adbd0" strokeWidth="4" fill="none" />
      <rect x="68" y="112" width="24" height="24" fill="#f3cfae" />
      <Face mood={mood} skin="#f3cfae" />
      <Mouth mood={mood} />
      <path d="M52 76 Q50 40 80 38 Q112 40 108 76 Q102 52 80 54 Q60 52 52 76 Z" fill="#2a1a10" />
      <path d="M62 44 L70 30 L76 42 L84 28 L90 42 L98 32 L100 48 Z" fill="#2a1a10" />
      <path d="M50 60 H110" stroke="#2fa89a" strokeWidth="6" />
      <g fill="#cfeff0" fillOpacity="0.75" stroke="#2fa89a" strokeWidth="4">
        <rect x="56" y="50" width="22" height="18" rx="7" />
        <rect x="82" y="50" width="22" height="18" rx="7" />
      </g>
      <g transform="rotate(-24 128 170)">
        <rect x="124" y="120" width="8" height="56" rx="3" fill="#e8f6f8" stroke="#8ab0b8" strokeWidth="2" />
        <ellipse cx="128" cy="118" rx="9" ry="11" fill="#e04a6a" />
        <circle cx="128" cy="182" r="3" fill="#7fd0ff" className="dp-drop" />
      </g>
      <ellipse cx="124" cy="178" rx="11" ry="9" fill="#f3cfae" />
    </>
  )
}

const FIGURES: Record<JurorId, (props: { mood: JuryMood }) => ReactNode> = { szef: Szef, cukierniczka: Cukierniczka, molekularny: Molekularny }

export function Juror({ juror, mood, className }: { juror: JurorId; mood: JuryMood; className?: string }) {
  const Figure = FIGURES[juror]
  return (
    <svg viewBox="0 0 160 200" className={className} aria-hidden>
      <g key={mood} className="dp-react">
        <Figure mood={mood} />
      </g>
    </svg>
  )
}

export function Jury({ revealed, outcome }: { revealed: number; outcome: 'won' | 'lost' | null }) {
  return (
    <div className="dp-jury">
      {JURORS.map((juror) => {
        const mood = juryMood({ revealed, outcome, juror })
        return (
          <figure key={juror} className="dp-juror" data-testid="juror" data-juror={juror} data-mood={mood}>
            <Juror juror={juror} mood={mood} />
            <figcaption>{JUROR_NAMES[juror]}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}
