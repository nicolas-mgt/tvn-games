import { AnimatePresence, motion } from 'motion/react'
import type { AnchorMood, SatiristMood } from './logic'

const SKIN = '#f0c6a0'
const SKIN_DARK = '#d9a27a'
const INK = '#1f1a24'

function AnchorFace({ mood }: { mood: AnchorMood }) {
  switch (mood) {
    case 'smug':
      return (
        <>
          <path d="M80 92 q8 4 16 0 M108 92 q8 4 16 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M78 80 l18 -2 M106 74 l18 6" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M92 118 q14 6 24 -6" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
    case 'shocked':
      return (
        <>
          <circle cx="88" cy="92" r="8" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="116" cy="92" r="8" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="88" cy="92" r="3.5" fill={INK} />
          <circle cx="116" cy="92" r="3.5" fill={INK} />
          <path d="M78 72 q10 -8 20 -2 M106 70 q10 -6 20 2" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <ellipse cx="102" cy="120" rx="7" ry="9" fill="#7a1e2a" />
        </>
      )
    default:
      return (
        <>
          <circle cx="88" cy="92" r="4.5" fill={INK} />
          <circle cx="116" cy="92" r="4.5" fill={INK} />
          <path d="M79 81 h18 M107 81 h18" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M92 118 h20" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </>
      )
  }
}

/** The fictional anchorwoman: deadpan while reading, smug after a hit, shocked after a miss. */
export function Anchor({ mood, className }: { mood: AnchorMood; className?: string }) {
  return (
    <svg viewBox="0 0 200 210" className={className} data-testid="anchor" data-mood={mood} role="img" aria-label="Prezenterka">
      <path d="M50 70 q-6 60 6 92 h92 q12 -32 6 -92 Z" fill="#2a1a14" />
      <path d="M30 210 q4 -54 46 -62 h52 q42 8 46 62 Z" fill="#1f3a8a" />
      <path d="M84 148 l18 40 l18 -40 Z" fill="#f4f1ea" />
      <path d="M76 148 l26 56 l-30 -6 l-12 -40 Z M128 148 l-26 56 l30 -6 l12 -40 Z" fill="#17306f" />
      <circle cx="140" cy="182" r="4" fill="#ffd23a" />
      <rect x="90" y="124" width="24" height="26" fill={SKIN_DARK} />
      <ellipse cx="102" cy="96" rx="36" ry="40" fill={SKIN} />
      <circle cx="78" cy="108" r="6" fill="#f08a8a" opacity="0.4" />
      <circle cx="126" cy="108" r="6" fill="#f08a8a" opacity="0.4" />
      <path d="M62 92 q-4 -50 40 -50 q44 0 40 50 q-14 -26 -44 -30 q-20 6 -36 30 Z" fill="#2a1a14" />
      <AnchorFace mood={mood} />
      <g transform={mood === 'shocked' ? 'rotate(-10 100 190)' : undefined}>
        <rect x="60" y="176" width="84" height="40" rx="2" fill="#fbfaf5" stroke="#c8c4b8" strokeWidth="2" />
        <path d="M70 188 h60 M70 198 h48" stroke="#9a96a0" strokeWidth="3" />
        <ellipse cx="58" cy="190" rx="10" ry="8" fill={SKIN} />
        <ellipse cx="146" cy="190" rx="10" ry="8" fill={SKIN} />
      </g>
    </svg>
  )
}

function SatiristFace({ mood }: { mood: SatiristMood }) {
  switch (mood) {
    case 'cheer':
      return (
        <>
          <path d="M80 96 q8 -9 16 0 M108 96 q8 -9 16 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M84 116 q18 26 36 0 Z" fill="#7a1e2a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M92 124 q10 6 20 0" fill="#e86a6a" />
        </>
      )
    case 'mock':
      return (
        <>
          <circle cx="92" cy="94" r="4.5" fill={INK} />
          <circle cx="120" cy="94" r="4.5" fill={INK} />
          <path d="M78 82 q8 -4 16 -2 M106 76 q10 -6 18 0" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M88 120 q16 4 28 -6" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M106 118 q4 10 10 4 l-2 -8 Z" fill="#e86a6a" stroke={INK} strokeWidth="2" />
        </>
      )
    default:
      return (
        <>
          <circle cx="88" cy="94" r="4.5" fill={INK} />
          <circle cx="116" cy="94" r="4.5" fill={INK} />
          <path d="M78 82 q8 -5 16 -2 M106 80 q8 -3 16 2" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M86 114 q16 16 32 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )
  }
}

/** The fictional satirist: grins while reading, cheers after a hit, mocks after a miss. */
export function Satirist({ mood, className }: { mood: SatiristMood; className?: string }) {
  const mugRaised = mood === 'cheer'
  return (
    <svg viewBox="0 0 200 210" className={className} data-testid="satirist" data-mood={mood} role="img" aria-label="Satyryk">
      <path d="M28 210 q4 -56 48 -64 h48 q44 8 48 64 Z" fill="#c9962a" />
      <path d="M34 186 h132 M38 172 h124" stroke="#a87a1c" strokeWidth="6" />
      <path d="M80 146 q20 16 40 0" stroke="#a87a1c" strokeWidth="8" fill="none" />
      <rect x="90" y="124" width="24" height="24" fill={SKIN_DARK} />
      <ellipse cx="102" cy="96" rx="36" ry="40" fill={SKIN} />
      <path d="M70 110 q32 40 64 0 q-4 22 -32 26 q-28 -4 -32 -26 Z" fill="#6a5a50" opacity="0.35" />
      <path d="M64 84 q-6 -42 26 -46 q10 -12 26 -4 q30 2 26 50 q-6 -20 -20 -26 q-12 8 -28 2 q-20 4 -30 24 Z" fill="#4a3a2e" />
      <circle cx="88" cy="94" r="12" fill="none" stroke={INK} strokeWidth="3" />
      <circle cx="116" cy="94" r="12" fill="none" stroke={INK} strokeWidth="3" />
      <path d="M100 94 h4" stroke={INK} strokeWidth="3" />
      <SatiristFace mood={mood} />
      <g transform={mugRaised ? 'translate(18 -40) rotate(-14 150 186)' : undefined}>
        <rect x="134" y="168" width="32" height="38" rx="5" fill="#c8102e" />
        <path d="M166 176 q14 0 14 12 t-14 12" stroke="#c8102e" strokeWidth="6" fill="none" />
        <path d="M140 180 h20" stroke="#fff" strokeWidth="3" />
        <ellipse cx="136" cy="190" rx="10" ry="8" fill={SKIN} />
      </g>
    </svg>
  )
}

/** The two hosts behind the studio desk, with the satirist's quip between them. */
export function HostsDesk({ anchor, satirist, quip }: { anchor: AnchorMood; satirist: SatiristMood; quip: string | null }) {
  return (
    <div className="ps-hosts">
      <div className="ps-hosts-row">
        <Anchor mood={anchor} className="ps-host" />
        <div className="ps-quip-slot">
          <AnimatePresence mode="wait">
            {quip && (
              <motion.p key={quip} className="ps-quip" data-testid="quip" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                {quip}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <Satirist mood={satirist} className="ps-host" />
      </div>
      <div className="ps-desk">
        <span className="ps-sign">Szkiełko i oko</span>
      </div>
    </div>
  )
}
