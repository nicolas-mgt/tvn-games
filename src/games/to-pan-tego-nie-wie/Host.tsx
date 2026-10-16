import { AnimatePresence, motion } from 'motion/react'
import type { HostMood } from './logic'

const INK = '#2a1a14'
const SKIN = '#f2c8a4'

function Face({ mood }: { mood: HostMood }) {
  const happy = mood === 'laugh' || mood === 'cheer'
  return (
    <>
      {happy ? (
        <path d="M86 80 q5 -6 10 0 M106 80 q5 -6 10 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="91" cy="80" r="3.2" fill={INK} />
          <circle cx="111" cy="80" r="3.2" fill={INK} />
        </>
      )}
      {mood === 'sympathy' && <path d="M84 72 l10 -3 M118 72 l-10 -3" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />}
      {happy ? (
        <path d="M89 92 q12 14 24 0 Z" fill="#b8304a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      ) : (
        <path d={mood === 'sympathy' ? 'M93 96 q8 -4 16 0' : 'M91 93 q10 8 20 0'} stroke="#b8304a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
    </>
  )
}

function HostArt({ mood }: { mood: HostMood }) {
  return (
    <>
      <rect x="0" y="110" width="200" height="80" rx="28" fill="#3a9a8a" />
      <rect x="0" y="160" width="200" height="50" rx="18" fill="#4ab0a0" />
      <path d="M66 106 q-12 50 -6 80 h80 q6 -30 -6 -80 Z" fill="#6a3a24" />
      <path d="M68 190 q0 -66 34 -70 q34 4 34 70 Z" fill="#f2b830" />
      <path d="M92 122 l10 16 l10 -16" stroke="#fff" strokeWidth="4" fill="none" />
      <path d="M140 150 q20 -2 24 -24" stroke="#f2b830" strokeWidth="11" fill="none" strokeLinecap="round" />
      <g transform="translate(152 96)" className="tp-host-mug">
        <rect width="26" height="28" rx="4" fill="#e8504a" />
        <path d="M26 7 q10 0 10 7 t-10 7" stroke="#e8504a" strokeWidth="4" fill="none" />
        <circle cx="13" cy="14" r="5" fill="#fff" opacity="0.7" />
      </g>
      <path d="M68 150 q-14 16 6 30" stroke="#f2b830" strokeWidth="11" fill="none" strokeLinecap="round" />
      <rect x="94" y="100" width="16" height="16" fill={SKIN} />
      <ellipse cx="101" cy="80" rx="25" ry="28" fill={SKIN} />
      <path d="M74 86 q-6 -42 28 -42 q32 0 26 42 q-2 -24 -26 -28 q-20 4 -28 28 Z" fill="#6a3a24" />
      <circle cx="78" cy="90" r="3" fill="#f2b830" />
      <circle cx="124" cy="90" r="3" fill="#f2b830" />
      <Face mood={mood} />
    </>
  )
}

export function Host({ mood, line }: { mood: HostMood; line: string | null }) {
  return (
    <figure className="tp-person tp-host" data-testid="host" data-mood={mood}>
      <AnimatePresence mode="wait">
        {line && (
          <motion.p key={line} className="tp-host-line" data-testid="host-line" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {line}
          </motion.p>
        )}
      </AnimatePresence>
      <svg viewBox="0 0 200 210" className="tp-person-art" role="img" aria-label="Prowadząca Kasia Poranek">
        <HostArt mood={mood} />
      </svg>
      <figcaption className="tp-caption">Kasia Poranek, prowadząca</figcaption>
    </figure>
  )
}
