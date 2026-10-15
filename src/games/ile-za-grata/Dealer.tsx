import { AnimatePresence, motion } from 'motion/react'
import type { DealerMood } from './logic'

const SKIN = '#e9b08a'

const BROWS: Record<DealerMood, string> = {
  neutral: 'M56 64 L70 63 M90 63 L104 64',
  thinking: 'M56 60 L70 56 M90 64 L104 65',
  impressed: 'M56 58 L70 55 M90 55 L104 58',
  greedy: 'M56 62 L70 64 M90 64 L104 62',
  offended: 'M56 60 L70 66 M90 66 L104 60',
}

const MOUTHS: Record<DealerMood, string> = {
  neutral: 'M70 104 H90',
  thinking: 'M74 105 Q80 102 86 106',
  impressed: 'M70 101 Q80 114 90 101 Z',
  greedy: 'M66 100 Q80 116 94 100 Z',
  offended: 'M70 108 Q80 99 90 108',
}

function Eyes({ mood }: { mood: DealerMood }) {
  if (mood === 'greedy') return <path d="M58 75 Q63 71 68 75 M92 75 Q97 71 102 75" stroke="#2b1d14" strokeWidth="2.8" fill="none" strokeLinecap="round" />
  const look = mood === 'thinking' ? { x: 2, y: -3 } : { x: 0, y: 0 }
  const r = mood === 'impressed' ? 4.2 : 3.4
  return (
    <g fill="#2b1d14">
      <circle cx={63 + look.x} cy={75 + look.y} r={r} />
      <circle cx={97 + look.x} cy={75 + look.y} r={r} />
    </g>
  )
}

function Keys({ mood }: { mood: DealerMood }) {
  return (
    <motion.g
      animate={mood === 'greedy' ? { rotate: [0, -18, 14, -10, 0] } : { rotate: 0 }}
      transition={mood === 'greedy' ? { duration: 0.8, repeat: Infinity, repeatDelay: 0.6 } : { duration: 0.3 }}
      style={{ transformBox: 'view-box', transformOrigin: '128px 150px' }}
    >
      <circle cx="128" cy="150" r="7" fill="none" stroke="#c9c9c9" strokeWidth="2.5" />
      <path d="M126 157 L120 178 L124 180 L126 174 L129 175 L130 171 L128 170 L131 158" fill="#d8d8d8" stroke="#888" strokeWidth="1" />
      <rect x="131" y="154" width="12" height="20" rx="4" fill="#1d1d1d" />
      <circle cx="137" cy="160" r="2.4" fill="#e03131" />
      <circle cx="128" cy="146" r="9" fill={SKIN} />
    </motion.g>
  )
}

export function DealerFigure({ mood }: { mood: DealerMood }) {
  return (
    <svg viewBox="0 0 160 200" className="gr-dealer-figure" overflow="visible" aria-hidden>
      <g className="gr-breathe">
        <path d="M16 200 Q18 132 80 124 Q142 132 144 200 Z" fill="#2a2320" />
        <path d="M58 128 L80 160 L102 128 Q80 122 58 128 Z" fill="#f1f1f1" />
        <path d="M50 130 L70 200 M110 130 L90 200" stroke="#17120f" strokeWidth="3" />
        <path d="M44 130 Q60 150 64 200 M116 130 Q100 150 96 200" stroke="#4a3d36" strokeWidth="2" fill="none" opacity="0.7" />
        <path d="M64 134 Q80 158 96 134" stroke="#e8b923" strokeWidth="3.4" fill="none" strokeDasharray="3 1.4" />
        <circle cx="80" cy="152" r="4.5" fill="#f5cc3a" stroke="#b8901d" strokeWidth="1" />
        <motion.g
          animate={mood === 'offended' ? { rotate: [0, -4, 4, -2, 0] } : mood === 'thinking' ? { rotate: -4 } : { rotate: 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformBox: 'view-box', transformOrigin: '80px 120px' }}
        >
          <rect x="70" y="106" width="20" height="22" fill={SKIN} />
          <circle cx="47" cy="78" r="7" fill={SKIN} />
          <circle cx="113" cy="78" r="7" fill={SKIN} />
          <ellipse cx="80" cy="78" rx="33" ry="36" fill={mood === 'offended' ? '#e89a80' : SKIN} />
          <path d="M47 60 Q48 36 80 34 Q112 36 113 60 Q100 46 80 46 Q60 46 47 60 Z" fill="#3b2a1e" />
          <path d={BROWS[mood]} stroke="#2b1d14" strokeWidth="3.6" strokeLinecap="round" />
          <Eyes mood={mood} />
          <path d="M80 78 Q76 88 81 90" stroke="#b07a5a" strokeWidth="2.2" fill="none" />
          <path d="M64 96 Q72 90 80 94 Q88 90 96 96 Q92 100 80 98 Q68 100 64 96 Z" fill="#3b2a1e" />
          <path
            d={MOUTHS[mood]}
            stroke="#5a2a1e"
            strokeWidth="2.6"
            fill={mood === 'impressed' || mood === 'greedy' ? '#7a2a22' : 'none'}
            strokeLinecap="round"
          />
          {mood === 'greedy' && <rect x="83" y="101" width="5" height="4" rx="1" fill="#f5cc3a" />}
          <g className="gr-shades">
            <path d="M54 40 H76 Q75 49 65 49 Q55 49 54 40 Z M84 40 H106 Q105 49 95 49 Q85 49 84 40 Z" fill="#1a1a1a" />
            <path d="M76 42 H84 M54 41 L46 50 M106 41 L114 50" stroke="#c9a227" strokeWidth="2" />
            <path d="M58 42 L63 46" stroke="#fff" strokeWidth="1.4" opacity="0.5" />
          </g>
        </motion.g>
        {mood === 'thinking' && (
          <g>
            <path d="M108 200 Q112 150 98 116" stroke="#2a2320" strokeWidth="14" fill="none" strokeLinecap="round" />
            <circle cx="94" cy="112" r="8" fill={SKIN} />
          </g>
        )}
      </g>
      {mood !== 'thinking' && <Keys mood={mood} />}
    </svg>
  )
}

export function Dealer({ mood, line }: { mood: DealerMood; line: string | null }) {
  return (
    <div className="gr-dealer" data-testid="dealer" data-mood={mood}>
      <div className="gr-bubble-slot">
        <AnimatePresence mode="wait">
          {line && (
            <motion.p
              key={line}
              className="gr-bubble gr-hand"
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.12 } }}
            >
              {line}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <DealerFigure mood={mood} />
      <p className="gr-dealer-name">Zbyszek, właściciel</p>
    </div>
  )
}
