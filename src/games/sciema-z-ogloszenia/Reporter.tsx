import { AnimatePresence, motion } from 'motion/react'
import type { ReporterMood } from './logic'

const SKIN = '#f0c3a0'
const INK = '#2b1d14'

const BROWS: Record<ReporterMood, string> = {
  neutral: 'M58 66 L71 65 M89 65 L102 66',
  suspicious: 'M58 64 L71 67 M89 62 L102 60',
  pleased: 'M58 62 L71 60 M89 60 L102 62',
  disappointed: 'M58 64 L71 68 M89 68 L102 64',
  alarmed: 'M58 60 L71 56 M89 56 L102 60',
}

const MOUTHS: Record<ReporterMood, string> = {
  neutral: 'M73 104 H87',
  suspicious: 'M72 104 Q80 101 88 103',
  pleased: 'M70 101 Q80 112 90 101',
  disappointed: 'M71 107 Q80 100 89 107',
  alarmed: 'M75 102 Q80 112 85 102 Q80 98 75 102 Z',
}

function Eyes({ mood }: { mood: ReporterMood }) {
  if (mood === 'pleased') return <path d="M60 78 Q65 73 70 78 M90 78 Q95 73 100 78" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
  if (mood === 'suspicious') return <path d="M60 77 H70 M90 77 H100" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  const r = mood === 'alarmed' ? 4.4 : 3.4
  return (
    <g fill={INK}>
      <circle cx="65" cy="77" r={r} />
      <circle cx="95" cy="77" r={r} />
    </g>
  )
}

export function ReporterFigure({ mood }: { mood: ReporterMood }) {
  return (
    <svg viewBox="0 0 160 200" className="sc-reporter-figure" overflow="visible" aria-hidden>
      <g className="sc-breathe">
        <path d="M14 200 Q16 134 80 124 Q144 134 146 200 Z" fill="#c8a873" />
        <path d="M52 128 L80 170 L66 200 H58 Z M108 128 L80 170 L94 200 H102 Z" fill="#b08f5b" />
        <path d="M66 128 L80 152 L94 128 Z" fill="#f1f3f5" />
        <path d="M40 172 H120" stroke="#8a6d3f" strokeWidth="5" />
        <rect x="76" y="168" width="8" height="10" fill="#5c4424" />
        <motion.g
          animate={mood === 'alarmed' ? { rotate: [0, -3, 3, -2, 0] } : mood === 'suspicious' ? { rotate: 4 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformBox: 'view-box', transformOrigin: '80px 120px' }}
        >
          <rect x="71" y="104" width="18" height="24" fill={SKIN} />
          <circle cx="80" cy="36" r="18" fill="#5a2d1c" />
          <path d="M70 22 L96 46" stroke="#f2b705" strokeWidth="4" strokeLinecap="round" />
          <path d="M96 46 L100 50" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="80" cy="80" rx="31" ry="35" fill={SKIN} />
          <path d="M49 82 Q46 48 80 44 Q114 48 111 82 Q106 58 80 56 Q56 58 49 82 Z" fill="#6b3420" />
          <path d={BROWS[mood]} stroke="#4a2414" strokeWidth="3" strokeLinecap="round" />
          <Eyes mood={mood} />
          <g fill="none" stroke="#1c1c1c" strokeWidth="2">
            <rect x="58" y="84" width="16" height="10" rx="3" />
            <rect x="86" y="84" width="16" height="10" rx="3" />
            <path d="M74 88 H86" />
          </g>
          <path d="M80 80 Q77 90 81 92" stroke="#c48a6a" strokeWidth="2" fill="none" />
          <path d={MOUTHS[mood]} stroke="#9c2f2f" strokeWidth="2.6" fill={mood === 'alarmed' ? '#7a2a22' : 'none'} strokeLinecap="round" />
          {mood === 'pleased' && <path d="M58 96 Q62 99 66 96 M94 96 Q98 99 102 96" stroke="#f08c8c" strokeWidth="3" opacity="0.5" />}
        </motion.g>
        <g>
          <rect x="22" y="146" width="40" height="50" rx="3" fill="#f8f4e3" stroke="#6b6b6b" strokeWidth="1.5" />
          <path d="M22 150 H62" stroke="#c92a2a" strokeWidth="2" />
          {[160, 168, 176, 184].map((y) => (
            <path key={y} d={`M27 ${y} H57`} stroke="#a5b4d6" strokeWidth="1" />
          ))}
          <circle cx="42" cy="196" r="9" fill={SKIN} />
        </g>
        <motion.g
          animate={mood === 'pleased' ? { x: [0, -10, 4, -8, 0], y: [0, 3, 6, 9, 0] } : { x: 0, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <path d="M66 158 L52 188" stroke="#1c3fa0" strokeWidth="4" strokeLinecap="round" />
          <circle cx="68" cy="160" r="8" fill={SKIN} />
        </motion.g>
      </g>
    </svg>
  )
}

export function Reporter({ mood, line }: { mood: ReporterMood; line: string | null }) {
  return (
    <div className="sc-reporter" data-testid="reporter" data-mood={mood}>
      <div className="sc-bubble-slot">
        <AnimatePresence mode="wait">
          {line && (
            <motion.p
              key={line}
              className="sc-bubble sc-hand"
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.12 } }}
            >
              {line}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <ReporterFigure mood={mood} />
      <p className="sc-reporter-name">red. Ewa Wnikliwa</p>
    </div>
  )
}
