import { motion } from 'motion/react'
import { CARDS, type CardId } from './logic'

function Icon({ card }: { card: CardId }) {
  switch (card) {
    case 'immunitet':
      return (
        <svg viewBox="0 0 64 64" aria-hidden>
          <path d="M32 6 L54 14 V30 Q54 48 32 58 Q10 48 10 30 V14 Z" fill="#fff6d8" stroke="#8a6a1f" strokeWidth="3" />
          <path d="M22 32 L29 39 L43 24" stroke="#2f8a4c" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'podwojny':
      return (
        <svg viewBox="0 0 64 64" aria-hidden>
          <rect x="8" y="14" width="30" height="38" rx="4" fill="#fff6d8" stroke="#2b5fa8" strokeWidth="3" transform="rotate(-10 23 33)" />
          <rect x="26" y="12" width="30" height="38" rx="4" fill="#fff" stroke="#2b5fa8" strokeWidth="3" transform="rotate(8 41 31)" />
          <text x="41" y="38" textAnchor="middle" fontSize="18" fontWeight="700" fill="#2b5fa8">×2</text>
        </svg>
      )
    case 'kradziez':
      return (
        <svg viewBox="0 0 64 64" aria-hidden>
          <path d="M32 54 C14 40 6 32 6 22 A12 12 0 0 1 32 16 A12 12 0 0 1 58 22 C58 32 50 40 32 54 Z" fill="#ff5c8a" />
          <path d="M6 50 L56 12" stroke="#7a4a1f" strokeWidth="3.5" />
          <path d="M56 12 L46 13 M56 12 L54 22" stroke="#7a4a1f" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M6 50 L12 50 M6 50 L6 44" stroke="#fff" strokeWidth="3" />
        </svg>
      )
    case 'wyrocznia':
      return (
        <svg viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="28" r="20" fill="#b9a3ff" />
          <circle cx="25" cy="21" r="6" fill="#fff" opacity="0.55" />
          <path d="M20 29 Q32 18 44 29 Q32 40 20 29 Z" fill="#fff" />
          <circle cx="32" cy="29" r="5" fill="#3a2a7a" />
          <path d="M18 56 H46 L40 46 H24 Z" fill="#8a6a1f" />
        </svg>
      )
  }
}

type Props = { card: CardId; played: boolean; needsTarget: boolean; disabled: boolean; onPlay: () => void }

export function PowerCard({ card, played, needsTarget, disabled, onPlay }: Props) {
  return (
    <div className="rr-card-slot">
      <motion.div
        className="rr-card"
        data-testid="power-card"
        data-card={card}
        data-played={played}
        initial={{ rotateY: 180, y: -30 }}
        animate={played ? { rotateY: 0, y: 0, scale: [1, 1.12, 0.94], filter: ['brightness(1)', 'brightness(1.6)', 'brightness(0.75)'] } : { rotateY: 0, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="rr-card-face" data-kind={card}>
          <span className="rr-card-kicker">Karta mocy</span>
          <span className="rr-card-icon">
            <Icon card={card} />
          </span>
          <strong className="rr-card-name">{CARDS[card].name}</strong>
          <span className="rr-card-text">{CARDS[card].text}</span>
          {played && <span className="rr-card-stamp">Zagrana</span>}
        </div>
        <div className="rr-card-back" aria-hidden>
          <span>RR</span>
        </div>
      </motion.div>
      <button type="button" className="rr-sign rr-sign-card" disabled={played || disabled} onClick={onPlay} data-testid="play-card">
        {played ? 'Karta zagrana' : needsTarget ? 'Zagraj na wybraną osobę' : 'Zagraj kartę'}
      </button>
    </div>
  )
}
