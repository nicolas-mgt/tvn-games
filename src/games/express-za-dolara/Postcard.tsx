import { motion } from 'motion/react'
import { eventKind, type TravelEvent } from './logic'

function Illustration({ id }: { id: string }) {
  switch (id) {
    case 'truck':
      return (
        <g>
          <rect x="120" y="40" width="60" height="44" fill="#f4e6c4" />
          <path d="M112 42 L150 16 L188 42 Z" fill="#b0302a" />
          <rect x="142" y="60" width="16" height="24" fill="#6a3f28" />
          <rect x="20" y="58" width="70" height="30" rx="4" fill="#e2a83a" />
          <path d="M90 66 H108 L116 78 V88 H90 Z" fill="#d8323a" />
          <circle cx="36" cy="92" r="8" fill="#2a2a2a" />
          <circle cx="100" cy="92" r="8" fill="#2a2a2a" />
        </g>
      )
    case 'rain':
      return (
        <g>
          <path d="M40 50 H160 L150 34 H50 Z" fill="#b0302a" />
          <path d="M52 50 V96 M148 50 V96" stroke="#6a3f28" strokeWidth="5" />
          <circle cx="90" cy="80" r="9" fill="#e3a982" />
          <circle cx="112" cy="80" r="9" fill="#f2c9a8" />
          <g stroke="#6fb8e8" strokeWidth="2.5" strokeLinecap="round">
            {Array.from({ length: 22 }, (_, i) => (
              <path key={i} d={`M${8 + i * 9} ${(i * 13) % 30} l-4 12`} />
            ))}
          </g>
        </g>
      )
    case 'amulet':
      return (
        <g>
          <circle cx="70" cy="44" r="14" fill="#c98e64" />
          <path d="M54 42 Q56 24 70 26 Q86 24 86 42 Q80 32 70 32 Q60 32 54 42 Z" fill="#e8e2dc" />
          <path d="M50 100 V70 Q50 58 70 58 Q90 58 90 70 V100 Z" fill="#7a3fa0" />
          <path d="M90 74 L118 64" stroke="#c98e64" strokeWidth="7" strokeLinecap="round" />
          <circle cx="132" cy="64" r="22" fill="#ffd34d" opacity="0.35" className="ex-amulet-glow" />
          <circle cx="132" cy="64" r="10" fill="#2f6fd8" stroke="#ffd34d" strokeWidth="3" />
          <circle cx="132" cy="64" r="4" fill="#fff" />
        </g>
      )
    case 'monkey':
      return (
        <g>
          <circle cx="100" cy="46" r="18" fill="#8a5a3a" />
          <ellipse cx="100" cy="52" rx="11" ry="9" fill="#e3b08c" />
          <circle cx="94" cy="44" r="2.5" fill="#2b1d14" />
          <circle cx="106" cy="44" r="2.5" fill="#2b1d14" />
          <path d="M94 56 Q100 60 106 56" stroke="#2b1d14" strokeWidth="2" fill="none" />
          <path d="M84 100 Q84 64 100 64 Q116 64 116 100 Z" fill="#8a5a3a" />
          <path d="M116 76 L138 60" stroke="#8a5a3a" strokeWidth="8" strokeLinecap="round" />
          <rect x="132" y="42" width="34" height="18" rx="2" fill="#7fbf4d" stroke="#3a7a2a" strokeWidth="2" transform="rotate(-14 149 51)" />
          <text x="149" y="56" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2a5a1a" transform="rotate(-14 149 51)">
            $1
          </text>
          <path d="M84 96 Q60 100 64 76" stroke="#8a5a3a" strokeWidth="5" fill="none" />
        </g>
      )
    case 'coconuts':
      return (
        <g>
          {[80, 124].map((x) => (
            <g key={x}>
              <circle cx={x} cy="70" r="24" fill="#6a8a3a" />
              <ellipse cx={x} cy="52" rx="14" ry="5" fill="#f4f1dc" />
              <path d={`M${x + 4} 52 L${x + 14} 18`} stroke="#ff5c8a" strokeWidth="4" />
            </g>
          ))}
          <rect x="146" y="20" width="34" height="18" rx="2" fill="#7fbf4d" stroke="#3a7a2a" strokeWidth="2" />
          <text x="163" y="34" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2a5a1a">
            +$1
          </text>
        </g>
      )
    case 'flat':
      return (
        <g>
          <path d="M40 86 H140 Q150 70 130 64 H96 L84 44 H70" stroke="#2fa8a0" strokeWidth="10" fill="none" strokeLinejoin="round" />
          <circle cx="50" cy="90" r="14" fill="none" stroke="#2a2a2a" strokeWidth="6" />
          <ellipse cx="140" cy="98" rx="18" ry="6" fill="#2a2a2a" />
          <path d="M150 54 l6 -10 M160 60 l10 -6 M156 70 h12" stroke="#d8323a" strokeWidth="3" strokeLinecap="round" />
        </g>
      )
    default:
      return (
        <g>
          {[70, 86, 102].map((y, i) => (
            <path key={y} d={`M0 ${y} Q100 ${y - 10} 200 ${y}`} stroke={i % 2 ? '#7fbf4d' : '#5fa83c'} strokeWidth="14" fill="none" />
          ))}
          <circle cx="70" cy="34" r="12" fill="#c98e64" />
          <path d="M54 76 V54 Q54 46 70 46 Q86 46 86 54 V76 Z" fill="#f28a2e" />
          <path d="M86 54 L120 36" stroke="#c98e64" strokeWidth="6" strokeLinecap="round" />
          <path d="M126 40 Q150 30 170 50" stroke="#d8323a" strokeWidth="3" strokeDasharray="5 4" fill="none" />
        </g>
      )
  }
}

function effect(event: TravelEvent) {
  if (event.amulet) return 'amulet!'
  if (event.money) return `${event.money > 0 ? '+' : '−'}$${Math.abs(event.money)}`
  const hours = event.hours ?? 0
  return `${hours > 0 ? '+' : '−'}${Math.abs(hours)} h`
}

export function Postcard({ event, onNext }: { event: TravelEvent; onNext: () => void }) {
  const kind = eventKind(event)
  return (
    <div className="ex-postcard-wrap">
      <motion.div
        className="ex-postcard"
        data-testid="postcard"
        data-kind={kind}
        initial={{ rotateY: 180, y: -40, opacity: 0 }}
        animate={{ rotateY: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="ex-postcard-front">
          <svg viewBox="0 0 200 110" className="ex-postcard-art" aria-hidden>
            <rect width="200" height="110" fill="#bfe6f5" />
            <Illustration id={event.id} />
          </svg>
          <div className="ex-postcard-text">
            <p className="ex-hand">{event.text}</p>
            <strong data-kind={kind}>{effect(event)}</strong>
          </div>
        </div>
        <div className="ex-postcard-back">
          <span className="ex-postage">
            <svg viewBox="0 0 40 48" aria-hidden>
              <rect width="40" height="48" fill="#fff" />
              <rect x="4" y="4" width="32" height="40" fill="#d8323a" />
              <circle cx="20" cy="24" r="9" fill="#ffd34d" />
            </svg>
          </span>
          <span className="ex-hand">Pozdrowienia z trasy!</span>
        </div>
      </motion.div>
      <button type="button" className="ex-next" onClick={onNext} data-testid="next">
        Dalej
      </button>
    </div>
  )
}
