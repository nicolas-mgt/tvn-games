import type { TravelerMood } from './logic'

const SKIN = '#f1c7a2'
const INK = '#3a2418'

function Face({ mood }: { mood: TravelerMood }) {
  switch (mood) {
    case 'thrilled':
      return (
        <>
          <path d="M80 104 q8 -9 16 0 M114 104 q8 -9 16 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M86 92 l14 -5 M110 87 l14 5" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M86 124 q19 24 38 0 Z" fill="#8a2a2a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M94 132 q11 7 22 0" fill="#e86a6a" />
        </>
      )
    case 'pleased':
      return (
        <>
          <circle cx="88" cy="104" r="4.5" fill={INK} />
          <circle cx="122" cy="104" r="4.5" fill={INK} />
          <path d="M80 92 q8 -5 16 -2 M114 90 q8 -3 16 2" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M90 124 q15 12 30 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
    case 'worried':
      return (
        <>
          <circle cx="88" cy="106" r="4.5" fill={INK} />
          <circle cx="122" cy="106" r="4.5" fill={INK} />
          <path d="M80 96 l16 -7 M114 89 l16 7" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M90 130 q5 -6 10 0 t10 0 t10 0" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M140 84 q6 10 0 14 q-6 -4 0 -14" fill="#8ac8f0" />
        </>
      )
    default:
      return (
        <>
          <circle cx="88" cy="104" r="4.5" fill={INK} />
          <circle cx="122" cy="104" r="5" fill={INK} />
          <path d="M80 94 q8 -4 16 -1 M114 86 q8 -6 16 0" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <ellipse cx="108" cy="128" rx="6" ry="5" fill="#8a2a2a" />
        </>
      )
  }
}

/** Martyna, the fictional traveler; `mood` follows `travelerMood`, with `curious` while guessing. */
export function Martyna({ mood, className }: { mood: TravelerMood; className?: string }) {
  return (
    <svg viewBox="0 0 210 250" className={className} data-testid="traveler" data-mood={mood} role="img" aria-label="Martyna">
      <rect x="22" y="150" width="46" height="84" rx="14" fill="#5a7a3a" />
      <rect x="28" y="168" width="34" height="26" rx="6" fill="#4a6a30" />
      <path d="M48 160 V230" stroke="#3e5a28" strokeWidth="3" />
      <path d="M58 156 q50 -10 94 0 l16 90 H42 Z" fill="#e2783a" />
      <path d="M72 156 L66 246 M138 156 L144 246" stroke="#7a4a20" strokeWidth="8" />
      <path d="M104 160 V246" stroke="#c8602a" strokeWidth="2" strokeDasharray="5 4" />
      <path d="M90 150 Q104 200 128 150" stroke="#2a2a2a" strokeWidth="3" fill="none" />
      <g transform="translate(108 190)">
        <rect x="-24" y="-14" width="48" height="32" rx="5" fill="#2a2a2e" />
        <rect x="-18" y="-20" width="14" height="8" rx="2" fill="#2a2a2e" />
        <circle r="11" fill="#5a6a7a" stroke="#c9c9d0" strokeWidth="3" />
        <circle r="4" fill="#9ab4d0" />
        <circle cx="16" cy="-8" r="2.5" fill="#e85a3a" />
      </g>

      <path d="M58 98 q-14 40 6 72 q8 -30 4 -60 Z" fill="#7a4424" />
      <rect x="92" y="138" width="26" height="20" fill={SKIN} />
      <ellipse cx="105" cy="108" rx="40" ry="44" fill={SKIN} />
      <circle cx="78" cy="122" r="7" fill="#f08a8a" opacity="0.45" />
      <circle cx="132" cy="122" r="7" fill="#f08a8a" opacity="0.45" />
      <path d="M66 96 q14 -28 54 -24 q20 4 26 26 q-30 -14 -80 -2" fill="#7a4424" />
      <Face mood={mood} />

      <ellipse cx="105" cy="74" rx="92" ry="16" fill="#d8b47a" />
      <ellipse cx="105" cy="72" rx="92" ry="14" fill="none" stroke="#b8925a" strokeWidth="2" />
      <path d="M62 72 q4 -50 43 -52 q39 2 43 52 Z" fill="#e2c48a" />
      <path d="M64 62 q41 10 82 0 v10 q-41 10 -82 0 Z" fill="#a8402a" />
    </svg>
  )
}
