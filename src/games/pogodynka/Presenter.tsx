import { AnimatePresence, motion } from 'motion/react'
import type { PresenterMood } from './logic'

const INK = '#1a1a2a'
const SKIN = '#f2c8a4'
const BLAZER = '#c8303a'

function Face({ mood }: { mood: PresenterMood }) {
  const happy = mood === 'delighted' || mood === 'pleased'
  const eyes = happy ? (
    <path d="M86 70 q5 -6 10 0 M106 70 q5 -6 10 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
  ) : (
    <>
      <circle cx="91" cy="70" r="3.2" fill={INK} />
      <circle cx="111" cy="70" r="3.2" fill={INK} />
    </>
  )
  const brows = {
    unsure: 'M84 61 l10 -2 M108 58 l10 3',
    oops: 'M84 62 l10 -4 M118 62 l-10 -4',
    waiting: 'M84 60 h10 M108 60 h10',
  }[mood as 'unsure' | 'oops' | 'waiting']
  const mouth = {
    delighted: <path d="M89 82 q12 15 24 0 Z" fill="#a8243a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />,
    pleased: <path d="M90 83 q11 10 22 0" stroke="#a8243a" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
    unsure: <path d="M93 86 q5 -3 8 0 t8 0" stroke="#a8243a" strokeWidth="3" fill="none" strokeLinecap="round" />,
    oops: <ellipse cx="101" cy="87" rx="5" ry="6" fill="#a8243a" />,
  }[mood as 'delighted' | 'pleased' | 'unsure' | 'oops'] ?? <path d="M91 83 q10 8 20 0" stroke="#a8243a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
  return (
    <>
      {eyes}
      {brows && <path d={brows} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />}
      {mouth}
    </>
  )
}

/** Right arm (holding the pointer) and left arm per mood; coordinates in the 200x240 figure. */
const POSES: Record<PresenterMood, { right: string; left: string; stick: string }> = {
  neutral: {
    right: 'M128 128 q12 30 6 60',
    left: 'M74 128 q-12 30 -6 60',
    stick: 'M134 188 l10 40',
  },
  pointing: {
    right: 'M128 128 q12 30 6 60',
    left: 'M74 128 q-30 0 -52 -18',
    stick: 'M22 110 l-22 -16',
  },
  waiting: {
    right: 'M128 128 q16 26 -12 34',
    left: 'M74 128 q-12 30 -6 60',
    stick: 'M116 162 l-30 10',
  },
  delighted: {
    right: 'M128 128 q22 -16 26 -46',
    left: 'M74 128 q-22 -16 -26 -46',
    stick: 'M154 82 l14 -40',
  },
  pleased: {
    right: 'M128 128 q22 6 26 -24',
    left: 'M74 128 q-12 30 -6 60',
    stick: 'M154 104 l4 -40',
  },
  unsure: {
    right: 'M128 128 q12 30 6 60',
    left: 'M74 128 q4 -18 20 -36',
    stick: 'M134 188 l10 40',
  },
  oops: {
    right: 'M128 128 q16 -4 8 -40',
    left: 'M74 128 q-16 -4 -8 -40',
    stick: 'M136 88 l20 -30',
  },
}

function PresenterArt({ mood }: { mood: PresenterMood }) {
  const pose = POSES[mood]
  return (
    <>
      <path d="M68 240 q0 -110 33 -114 q33 4 33 114 Z" fill={BLAZER} />
      <path d="M90 126 l11 34 l11 -34 Z" fill="#fff" />
      <path d="M90 126 l-6 50 M112 126 l6 50" stroke="#a8202a" strokeWidth="3" />
      <rect x="93" y="98" width="16" height="22" fill={SKIN} />
      <path d={pose.stick} stroke="#2a2a34" strokeWidth="4" strokeLinecap="round" className="pg-stick" />
      <path d={pose.right} stroke={BLAZER} strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d={pose.left} stroke={BLAZER} strokeWidth="13" fill="none" strokeLinecap="round" />
      {mood === 'waiting' && <rect x="108" y="155" width="12" height="10" rx="2" fill="#f2b830" />}
      <ellipse cx="101" cy="70" rx="25" ry="29" fill={SKIN} />
      <path d="M74 84 q-8 -48 27 -48 q35 0 27 48 q0 -28 -27 -32 q-22 4 -27 32 Z" fill="#e8c060" />
      <path d="M74 84 q-2 14 8 18 M128 84 q2 14 -8 18" stroke="#e8c060" strokeWidth="8" strokeLinecap="round" fill="none" />
      <Face mood={mood} />
    </>
  )
}

export function Presenter({ mood, line }: { mood: PresenterMood; line: string | null }) {
  return (
    <figure className="pg-presenter" data-testid="presenter" data-mood={mood}>
      <AnimatePresence mode="wait">
        {line && (
          <motion.p key={line} className="pg-presenter-line" data-testid="presenter-line" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {line}
          </motion.p>
        )}
      </AnimatePresence>
      <svg viewBox="0 0 200 240" className="pg-presenter-art" role="img" aria-label="Prezenterka pogody Aura Słoneczna">
        <PresenterArt mood={mood} />
      </svg>
      <figcaption className="pg-caption">Aura Słoneczna, pogoda</figcaption>
    </figure>
  )
}
