import { AnimatePresence, motion } from 'motion/react'
import { formatZl } from './logic'

export type DealerState = 'idle' | 'bidding' | 'out' | 'won' | 'lost'

const LOOKS = [
  { skin: '#e8b48f', shirt: '#b03a2e', number: 7 },
  { skin: '#f0c3a0', shirt: '#d9668f', number: 13 },
  { skin: '#e3a982', shirt: '#6b7280', number: 42 },
]

const BROWS: Record<DealerState, string> = {
  idle: 'M44 48 L54 48 M66 48 L76 48',
  bidding: 'M44 45 L54 43 M66 43 L76 45',
  out: 'M44 49 L54 51 M66 51 L76 49',
  won: 'M44 44 L54 42 M66 42 L76 44',
  lost: 'M44 47 L54 50 M66 50 L76 47',
}

const MOUTHS: Record<DealerState, string> = {
  idle: 'M52 76 H68',
  bidding: 'M51 74 Q60 82 69 74',
  out: 'M53 77 Q60 75 67 78',
  won: 'M48 72 Q60 90 72 72 Z',
  lost: 'M51 79 Q60 72 69 79',
}

function Eyes({ state }: { state: DealerState }) {
  if (state === 'won') return <path d="M45 58 Q49 53 53 58 M67 58 Q71 53 75 58" stroke="#2b1d14" strokeWidth="2.6" fill="none" strokeLinecap="round" />
  if (state === 'out') return <path d="M45 57 H53 M67 57 H75" stroke="#2b1d14" strokeWidth="2.6" strokeLinecap="round" />
  return (
    <g fill="#2b1d14">
      <circle cx="49" cy="57" r="3" />
      <circle cx="71" cy="57" r="3" />
    </g>
  )
}

function Outfit({ variant }: { variant: number }) {
  const { shirt } = LOOKS[variant]
  if (variant === 0) {
    return (
      <>
        <path d="M14 160 Q16 108 60 102 Q104 108 106 160 Z" fill={shirt} />
        <path d="M14 160 Q16 108 60 102 Q104 108 106 160 Z" fill="url(#pw-plaid)" opacity="0.5" />
        <path d="M24 160 Q24 116 46 106 L52 160 Z M96 160 Q96 116 74 106 L68 160 Z" fill="#8a7d4f" />
        <rect x="28" y="128" width="14" height="10" rx="2" fill="#73683f" />
        <rect x="78" y="128" width="14" height="10" rx="2" fill="#73683f" />
      </>
    )
  }
  if (variant === 1) {
    return (
      <>
        <path d="M14 160 Q16 108 60 102 Q104 108 106 160 Z" fill={shirt} />
        <path d="M60 104 V160" stroke="#b64f74" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} cx={44 + i * 5.3} cy={108 + Math.abs(3 - i) * -1.6 + 4} r="2.4" fill="#f7f1e3" />
        ))}
        <path d="M86 128 Q100 120 108 138 L104 156 H82 Z" fill="#6b3b24" />
        <path d="M88 130 Q96 112 104 132" stroke="#4a2818" strokeWidth="3" fill="none" />
      </>
    )
  }
  return (
    <>
      <path d="M12 160 Q14 106 60 100 Q106 106 108 160 Z" fill={shirt} />
      <path d="M40 104 Q60 122 80 104" stroke="#555c66" strokeWidth="6" fill="none" />
      <path d="M52 112 V134 M68 112 V134" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
      <rect x="40" y="140" width="40" height="14" rx="4" fill="#5b616b" />
      <rect x="18" y="128" width="12" height="20" rx="2" fill="#111827" />
      <rect x="20" y="130" width="8" height="15" fill="#60a5fa" />
    </>
  )
}

function Hair({ variant }: { variant: number }) {
  if (variant === 0) {
    return (
      <>
        <path d="M32 46 Q34 18 60 18 Q86 18 88 46 Z" fill="#2b5c9e" />
        <path d="M30 44 Q60 36 100 44 L96 50 Q60 44 30 50 Z" fill="#1f4677" />
        <path d="M46 70 Q53 64 60 68 Q67 64 74 70 Q67 74 60 71 Q53 74 46 70 Z" fill="#5a3a22" />
      </>
    )
  }
  if (variant === 1) {
    return (
      <>
        {[
          [36, 34],
          [46, 24],
          [60, 20],
          [74, 24],
          [84, 34],
          [32, 48],
          [88, 48],
          [30, 62],
          [90, 62],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="11" fill="#a0462c" />
        ))}
        <g fill="none" stroke="#3a2a20" strokeWidth="2">
          <circle cx="49" cy="57" r="7" />
          <circle cx="71" cy="57" r="7" />
          <path d="M56 57 H64" />
          <path d="M42 58 Q34 84 44 104 M78 58 Q86 84 76 104" stroke="#c9a227" strokeWidth="1.2" strokeDasharray="2 2" />
        </g>
      </>
    )
  }
  return (
    <>
      <path d="M32 46 Q34 18 60 18 Q86 18 88 46 Z" fill="#c62828" />
      <path d="M34 42 Q22 44 14 52 L20 56 Q28 50 36 48 Z" fill="#9e1f1f" />
      <rect x="54" y="24" width="12" height="6" rx="2" fill="#f5f5f5" />
      <path d="M48 82 Q60 90 72 82" stroke="#6b4a2f" strokeWidth="2" fill="none" opacity="0.6" />
    </>
  )
}

export function DealerFigure({ variant, state }: { variant: number; state: DealerState }) {
  const { skin, number } = LOOKS[variant]
  const raised = state === 'bidding' || state === 'won'
  return (
    <svg viewBox="0 0 130 160" className="pw-dealer-figure" overflow="visible" aria-hidden>
      <defs>
        <pattern id="pw-plaid" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 H12 M6 0 V12" stroke="#2b1d14" strokeWidth="2" opacity="0.5" />
        </pattern>
      </defs>
      <g className="pw-breathe">
        <Outfit variant={variant} />
        <motion.g animate={state === 'out' ? { x: [0, -4, 4, -3, 2, 0] } : { x: 0 }} transition={{ duration: 0.6 }}>
          <rect x="52" y="84" width="16" height="20" fill={skin} />
          <circle cx="32" cy="60" r="6" fill={skin} />
          <circle cx="88" cy="60" r="6" fill={skin} />
          <circle cx="60" cy="58" r="27" fill={skin} />
          <path d={BROWS[state]} stroke="#2b1d14" strokeWidth="3" strokeLinecap="round" />
          <Eyes state={state} />
          <path d="M60 60 Q57 68 61 69" stroke="#b07a5a" strokeWidth="2" fill="none" />
          <path d={MOUTHS[state]} stroke="#5a2a1e" strokeWidth="2.6" fill={state === 'won' ? '#7a2a22' : 'none'} strokeLinecap="round" />
          <Hair variant={variant} />
        </motion.g>
        {state === 'out' && (
          <g>
            <path d="M26 132 Q60 114 94 132 Q60 146 26 132 Z" fill={LOOKS[variant].shirt} stroke="#00000055" strokeWidth="2" />
            <circle cx="30" cy="128" r="7" fill={skin} />
            <circle cx="90" cy="128" r="7" fill={skin} />
          </g>
        )}
      </g>
      {state !== 'out' && (
        <motion.g
          initial={false}
          animate={raised ? { y: -84, rotate: state === 'won' ? [-12, 8, -12] : -8 } : { y: 0, rotate: state === 'lost' ? 22 : 0 }}
          transition={state === 'won' ? { y: { type: 'spring', stiffness: 260, damping: 16 }, rotate: { duration: 0.6, repeat: Infinity } } : { type: 'spring', stiffness: 260, damping: 16 }}
          style={{ transformBox: 'view-box', transformOrigin: '104px 150px' }}
        >
          <rect x="102" y="118" width="5" height="34" rx="2" fill="#8f6a3e" />
          <rect x="88" y="90" width="34" height="30" rx="5" fill="#fbf6e9" stroke="#2b1d14" strokeWidth="2.5" />
          <text x="105" y="113" textAnchor="middle" className="pw-paddle-number">
            {number}
          </text>
          <circle cx="104.5" cy="146" r="7" fill={skin} />
        </motion.g>
      )}
    </svg>
  )
}

export function Dealer({ variant, name, state, bid }: { variant: number; name: string; state: DealerState; bid?: number }) {
  const line = state === 'bidding' && bid ? `${formatZl(bid)}!` : state === 'won' ? 'Moje!' : state === 'out' ? 'Pas.' : null
  return (
    <div className="pw-dealer" data-testid="dealer" data-state={state}>
      <div className="pw-bubble-slot">
        <AnimatePresence mode="popLayout">
          {line && (
            <motion.p
              key={line}
              className="pw-bubble pw-hand"
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {line}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <DealerFigure variant={variant} state={state} />
      <p className="pw-dealer-name">{name}</p>
    </div>
  )
}
