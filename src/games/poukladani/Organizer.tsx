import type { SVGProps } from 'react'
import type { OrganizerMood } from './logic'

const SKIN = '#f0c4a0'
const HAIR = '#a8482a'

function Face({ mood }: { mood: OrganizerMood }) {
  return (
    <g>
      {mood === 'proud' ? (
        <g stroke="#3a2418" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M62 78 q6 -7 12 0 M88 78 q6 -7 12 0" />
          <path d="M60 64 q8 -7 16 -2 M86 62 q8 -5 16 2" />
        </g>
      ) : mood === 'pleased' ? (
        <g>
          <circle cx="68" cy="78" r="3.6" fill="#3a2418" />
          <circle cx="94" cy="78" r="3.6" fill="#3a2418" />
          <path d="M60 67 q8 -4 16 0 M86 67 q8 -4 16 0" stroke="#3a2418" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="71" cy="79" r="3.6" fill="#3a2418" />
          <circle cx="97" cy="79" r="3.6" fill="#3a2418" />
          <path d="M60 70 q8 -2 16 1 M86 60 q8 -6 16 0" stroke="#3a2418" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )}
      <g fill="none" stroke="#c0303a" strokeWidth="2.5">
        <circle cx="68" cy="78" r="11" />
        <circle cx="94" cy="78" r="11" />
        <path d="M79 77 h4 M57 76 l-8 -2 M105 76 l8 -2" />
      </g>
      <path d="M81 82 q-3 9 2 11" stroke="#c98a6a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {mood !== 'doubtful' && <ellipse cx="58" cy="96" rx="7" ry="4" fill="#f29a8a" opacity="0.55" />}
      {mood !== 'doubtful' && <ellipse cx="104" cy="96" rx="7" ry="4" fill="#f29a8a" opacity="0.55" />}
      {mood === 'proud' ? (
        <path d="M68 102 q13 16 26 0 Z" fill="#8a2a2a" stroke="#6a1a1a" strokeWidth="2" strokeLinejoin="round" />
      ) : mood === 'pleased' ? (
        <path d="M70 103 q11 9 22 0" stroke="#8a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M70 106 q6 -4 11 0 t11 -2" stroke="#8a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
    </g>
  )
}

export function Organizer({ mood, ...svg }: { mood: OrganizerMood } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 200" data-testid="organizer" data-mood={mood} {...svg}>
      <path d="M22 200 Q24 140 80 134 Q136 140 138 200 Z" fill="#2f8a8a" />
      <path d="M62 136 L80 170 L98 136 Z" fill="#fff" />
      <path d="M80 140 V200" stroke="#26706f" strokeWidth="3" />
      <circle cx="74" cy="160" r="2.5" fill="#f4e6c8" />
      <circle cx="74" cy="180" r="2.5" fill="#f4e6c8" />
      <rect x="72" y="112" width="16" height="26" fill={SKIN} />
      <path d="M50 134 Q60 160 56 200" stroke="#f2c230" strokeWidth="9" fill="none" />
      <path d="M110 134 Q100 160 104 200" stroke="#f2c230" strokeWidth="9" fill="none" />
      <path d="M50 134 Q80 124 110 134" stroke="#f2c230" strokeWidth="9" fill="none" />
      {[146, 158, 170, 182, 194].map((y) => (
        <path key={y} d={`M${50 + (y - 134) * 0.12} ${y} h5 M${106 - (y - 134) * 0.04} ${y} h5`} stroke="#3a2a1a" strokeWidth="1.5" />
      ))}
      <path d="M44 66 Q38 24 80 20 Q122 24 116 66 Q122 92 112 112 L48 112 Q38 92 44 66 Z" fill={HAIR} />
      <ellipse cx="81" cy="82" rx="31" ry="36" fill={SKIN} />
      <path d="M48 64 Q56 34 82 36 Q108 34 114 64 Q100 50 86 54 Q70 46 48 64 Z" fill={HAIR} />
      {[48, 58, 104, 114].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 50 : 62} r="9" fill={HAIR} />
      ))}
      <circle cx="50" cy="90" r="4" fill="#f2c230" />
      <circle cx="112" cy="90" r="4" fill="#f2c230" />
      <Face mood={mood} />
      <g transform="rotate(-8 128 170)">
        <rect x="108" y="146" width="44" height="54" rx="4" fill="#c98a3a" />
        <rect x="113" y="154" width="34" height="42" fill="#fffbe8" />
        <rect x="122" y="142" width="16" height="9" rx="2" fill="#8a8a8a" />
        <path d="M117 164 h26 M117 172 h22 M117 180 h24" stroke="#9ab" strokeWidth="2" />
        <path d="M140 186 l8 -6 h8 v12 h-8 Z" fill="#f29ab4" stroke="#b05a7a" strokeWidth="1.5" />
        <circle cx="149" cy="186" r="1.6" fill="#fff" />
      </g>
    </svg>
  )
}
