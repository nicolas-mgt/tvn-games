import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { JudgeMood } from './logic'

const INK = '#3b2a1e'

const BROWS: Record<JudgeMood, string> = {
  neutral: 'M80 78 L94 78 M106 78 L120 78',
  bored: 'M80 82 L94 82 M106 82 L120 82',
  disgusted: 'M80 76 L95 82 M105 82 L120 76',
  impressed: 'M80 77 Q87 69 94 75 M106 75 Q113 69 120 77',
  thinking: 'M80 79 L94 79 M106 75 Q113 69 120 74',
}

const EYES: Record<JudgeMood, ReactNode> = {
  neutral: (
    <>
      <circle cx="88" cy="88" r="3" fill={INK} />
      <circle cx="112" cy="88" r="3" fill={INK} />
    </>
  ),
  bored: (
    <>
      <ellipse cx="88" cy="89.5" rx="3.6" ry="1.6" fill={INK} />
      <ellipse cx="112" cy="89.5" rx="3.6" ry="1.6" fill={INK} />
      <path d="M83 87.5 H93 M107 87.5 H117" stroke={INK} strokeWidth="1.6" />
    </>
  ),
  disgusted: <path d="M83 88 L93 90 M107 90 L117 88" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />,
  impressed: (
    <>
      <circle cx="88" cy="88" r="5.2" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <circle cx="112" cy="88" r="5.2" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <circle cx="88" cy="88" r="2.6" fill={INK} />
      <circle cx="112" cy="88" r="2.6" fill={INK} />
      <circle cx="89" cy="87" r="0.9" fill="#fff" />
      <circle cx="113" cy="87" r="0.9" fill="#fff" />
    </>
  ),
  thinking: (
    <>
      <circle cx="90" cy="86" r="3" fill={INK} />
      <circle cx="114" cy="86" r="3" fill={INK} />
    </>
  ),
}

const MOUTHS: Record<JudgeMood, ReactNode> = {
  neutral: <path d="M94 112 H106" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />,
  bored: <path d="M91 113 Q100 111 109 113" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />,
  disgusted: <path d="M90 115 Q95 109 100 113 Q105 117 110 111" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />,
  impressed: <ellipse cx="100" cy="114" rx="4.5" ry="5.5" fill="#6b1d1d" />,
  thinking: <path d="M97 113 Q103 110 108 114" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />,
}

/** The judge on his throne; also hangs as a portrait on the cottage wall. */
export function JudgeFigure({ mood, className }: { mood: JudgeMood; className?: string }) {
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden data-mood={mood}>
      <path d="M40 228 V60 Q40 18 100 14 Q160 18 160 60 V228 Z" fill="#c9971f" stroke="#7a5a10" strokeWidth="3" />
      <path d="M54 220 V66 Q54 32 100 28 Q146 32 146 66 V220 Z" fill="#8b1a2b" />
      <circle cx="40" cy="58" r="9" fill="#e7b93a" stroke="#7a5a10" strokeWidth="2" />
      <circle cx="160" cy="58" r="9" fill="#e7b93a" stroke="#7a5a10" strokeWidth="2" />
      <rect x="30" y="186" width="140" height="22" rx="6" fill="#e0ad2e" stroke="#7a5a10" strokeWidth="3" />
      <g className="uk-breathe">
        <path d="M62 196 Q66 130 100 124 Q134 130 138 196 Z" fill="#5b2a86" />
        <path d="M72 132 Q100 146 128 132 L132 142 Q100 160 68 142 Z" fill="#f8f4ea" />
        {[78, 92, 108, 122].map((x) => (
          <circle key={x} cx={x} cy={141 + (x === 92 || x === 108 ? 4 : 0)} r="1.8" fill="#222" />
        ))}
        <circle cx="74" cy="182" r="8" fill="#f2c9a0" />
        <circle cx="126" cy="182" r="8" fill="#f2c9a0" />
        <circle cx="70" cy="94" r="6" fill="#e9b98d" />
        <circle cx="130" cy="94" r="6" fill="#e9b98d" />
        <circle cx="100" cy="92" r="30" fill="#f2c9a0" />
        <path d="M70 86 Q70 66 80 62 L78 84 Z M130 86 Q130 66 120 62 L122 84 Z" fill="#b8b8b8" />
        <path d="M72 66 L76 40 L88 54 L100 34 L112 54 L124 40 L128 66 Z" fill="#f2c230" stroke="#9a7410" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="100" cy="56" r="3.5" fill="#d7263d" />
        <circle cx="84" cy="60" r="2.5" fill="#2d6cdf" />
        <circle cx="116" cy="60" r="2.5" fill="#2d6cdf" />
        <path d={BROWS[mood]} stroke="#7d7d7d" strokeWidth="3.6" strokeLinecap="round" fill="none" />
        <g className="uk-eyes">{EYES[mood]}</g>
        <ellipse cx="100" cy="98" rx="5" ry="6" fill="#e3a37a" />
        {MOUTHS[mood]}
        <path d="M100 104 Q88 98 78 106 Q72 110 70 104 Q74 116 86 110 Q94 107 100 109 Q106 107 114 110 Q126 116 130 104 Q128 110 122 106 Q112 98 100 104 Z" fill="#8a8a8a" />
      </g>
    </svg>
  )
}

type JudgeProps = {
  mood: JudgeMood
  points?: number
  comment?: string
}

export function Judge({ mood, points, comment }: JudgeProps) {
  return (
    <div className="flex items-center gap-3 sm:flex-col-reverse sm:gap-2" data-testid="judge" data-mood={mood}>
      <div className="relative w-28 shrink-0 sm:w-56">
        <JudgeFigure mood={mood} className="w-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.45)]" />
        <AnimatePresence>
          {points !== undefined && (
            <motion.div
              className="uk-placard"
              initial={{ y: 60, opacity: 0, rotate: 0 }}
              animate={{ y: 0, opacity: 1, rotate: -8 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.45, delay: 0.5 }}
              data-testid="placard"
            >
              <span className="uk-placard-card">{points}</span>
              <span className="uk-placard-stick" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        {comment && (
          <motion.p
            key={comment}
            className="uk-bubble uk-hand"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            data-testid="judge-comment"
          >
            {comment}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
