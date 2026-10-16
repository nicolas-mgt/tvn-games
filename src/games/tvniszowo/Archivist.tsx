import { AnimatePresence, motion } from 'motion/react'
import type { ArchivistMood } from './logic'

const SKIN = '#f2c9a6'
const INK = '#2a1a14'

const BROWS: Record<ArchivistMood, string> = {
  calm: 'M62 66 q8 -4 16 0 M92 66 q8 -4 16 0',
  focused: 'M62 67 q8 -2 16 1 M92 68 q8 -3 16 -1',
  worried: 'M62 64 q8 2 16 -4 M92 60 q8 6 16 4',
  doubtful: 'M62 66 q8 -2 16 1 M92 60 q8 -6 16 0',
  pleased: 'M62 63 q8 -6 16 0 M92 63 q8 -6 16 0',
  amazed: 'M62 58 q8 -7 16 0 M92 58 q8 -7 16 0',
  starstruck: 'M62 58 q8 -8 16 0 M92 58 q8 -8 16 0',
  sad: 'M62 62 q8 0 16 5 M92 67 q8 -5 16 -5',
}

const MOUTHS: Record<ArchivistMood, string> = {
  calm: 'M76 106 q9 5 18 0',
  focused: 'M78 107 h14',
  worried: 'M76 109 q9 -6 18 0',
  doubtful: 'M76 107 q6 -2 18 2',
  pleased: 'M74 104 q11 11 22 0',
  amazed: 'M80 102 q5 -2 10 0 q2 10 -5 11 q-7 -1 -5 -11',
  starstruck: 'M72 102 q13 16 26 0 Z',
  sad: 'M76 110 q9 -7 18 0',
}

function Eyes({ mood }: { mood: ArchivistMood }) {
  if (mood === 'starstruck') {
    const star = (x: number) => `M${x} 74 l3 6 l6 1 l-5 4 l2 6 l-6 -3 l-6 3 l2 -6 l-5 -4 l6 -1 Z`
    return <path d={`${star(70)} ${star(100)}`} fill="#f2b81a" stroke="#a87810" strokeWidth="1" />
  }
  if (mood === 'pleased') return <path d="M64 81 q6 -7 12 0 M94 81 q6 -7 12 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
  if (mood === 'sad') return <path d="M65 80 q5 4 10 0 M95 80 q5 4 10 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
  const r = mood === 'amazed' ? 4.5 : 3.2
  const dx = mood === 'focused' ? 2 : mood === 'doubtful' ? -2 : 0
  return (
    <>
      <circle cx={70 + dx} cy={80} r={r} fill={INK} />
      <circle cx={100 + dx} cy={80} r={r} fill={INK} />
    </>
  )
}

export function ArchivistFigure({ mood }: { mood: ArchivistMood }) {
  return (
    <svg viewBox="0 0 170 210" className="ar-archivist-svg" aria-hidden>
      <g className="ar-breathe">
        <path d="M18 210 q4 -62 67 -66 q63 4 67 66 Z" fill="#c8963a" />
        <path d="M70 146 l15 30 l15 -30" fill="#f4ecd8" />
        <path d="M62 150 l23 60 M108 150 l-23 60" stroke="#a87a2a" strokeWidth="3" />
        {[168, 184, 200].map((y) => (
          <circle key={y} cx={y === 168 ? 80 : 82} cy={y} r="3" fill="#6a4a1a" />
        ))}
        <rect x="74" y="124" width="22" height="22" fill={SKIN} />
        <circle cx="85" cy="30" r="20" fill="#b9b4b0" />
        <ellipse cx="85" cy="84" rx="38" ry="44" fill={SKIN} />
        <path d="M47 82 q-4 -46 38 -48 q42 2 38 48 q-6 -28 -38 -30 q-32 2 -38 30 Z" fill="#c9c4c0" />
        <path d={BROWS[mood]} stroke="#8a8480" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <Eyes mood={mood} />
        <circle cx="70" cy="80" r="12" fill="#fff" fillOpacity="0.12" stroke="#5a3a2a" strokeWidth="2.5" />
        <circle cx="100" cy="80" r="12" fill="#fff" fillOpacity="0.12" stroke="#5a3a2a" strokeWidth="2.5" />
        <path d="M82 80 h6 M58 80 q-8 30 -2 60 M112 80 q8 30 2 60" stroke="#5a3a2a" strokeWidth="2" fill="none" />
        <path d="M85 88 q-4 8 0 10" stroke="#c8906a" strokeWidth="2.5" fill="none" />
        <path d={MOUTHS[mood]} stroke="#8a2a2a" strokeWidth="3" fill={mood === 'starstruck' || mood === 'amazed' ? '#8a2a2a' : 'none'} strokeLinecap="round" strokeLinejoin="round" />
        {(mood === 'pleased' || mood === 'starstruck') && <path d="M54 96 q5 3 10 0 M106 96 q5 3 10 0" stroke="#f08a7a" strokeWidth="4" opacity="0.6" />}
        {mood === 'worried' && <path d="M122 60 q5 8 0 12 q-5 -4 0 -12" fill="#9ad0f0" />}
        <g transform="translate(104 168) rotate(-12)">
          <rect width="58" height="34" rx="3" fill="#1d1b22" />
          <rect x="6" y="6" width="46" height="12" fill="#f4ecd8" />
          <circle cx="18" cy="26" r="4" fill="#4a4650" />
          <circle cx="40" cy="26" r="4" fill="#4a4650" />
        </g>
        <path d="M110 186 q14 -6 22 4" stroke={SKIN} strokeWidth="11" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}

export function Archivist({ mood, line }: { mood: ArchivistMood; line?: string }) {
  return (
    <figure className="ar-archivist" data-testid="archivist" data-mood={mood}>
      <ArchivistFigure mood={mood} />
      <AnimatePresence mode="wait">
        {line && (
          <motion.figcaption
            key={line}
            className="ar-bubble ar-hand"
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            data-testid="archivist-line"
          >
            {line}
          </motion.figcaption>
        )}
      </AnimatePresence>
      <p className="ar-name">Pani Halinka · archiwistka</p>
    </figure>
  )
}
