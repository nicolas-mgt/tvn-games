import { AnimatePresence, motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { ContestantFigure } from './Contestant'
import { contestantMood, PLAYER, type CeremonyResult, type Contestant } from './logic'

export type CeremonyStep = 'ceremony' | 'reveal' | 'farewell'

function Torch({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 40 90" className="rr-torch-mini" data-testid="torch" data-lit={lit} aria-hidden>
      <rect x="17" y="34" width="6" height="56" fill="#6d4c2f" />
      <path d="M8 26 H32 L27 40 H13 Z" fill="#a9773f" />
      <motion.g
        style={{ transformOrigin: '20px 28px' }}
        initial={false}
        animate={{ scale: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
        transition={{ duration: lit ? 0.5 : 1.2 }}
      >
        <circle cx="20" cy="16" r="18" fill="#ffb347" opacity="0.35" />
        <path className="rr-flame-outer" d="M20 28 C11 28 12 16 20 2 C28 16 29 28 20 28 Z" fill="#ff8a1f" />
        <path className="rr-flame-inner" d="M20 28 C15 28 16 20 20 12 C24 20 25 28 20 28 Z" fill="#ffe27a" />
      </motion.g>
      {!lit && (
        <motion.circle
          cx="20"
          cy="20"
          r="6"
          fill="#c9c9c9"
          initial={{ opacity: 0.8, y: 0, scale: 0.6 }}
          animate={{ opacity: 0, y: -24, scale: 2 }}
          transition={{ duration: 1.6, delay: 0.4 }}
        />
      )}
    </svg>
  )
}

function Shell({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 40 36" className="rr-shell" aria-hidden>
      <path d="M20 34 L4 18 Q4 4 20 2 Q36 4 36 18 Z" fill="#ffe1cf" stroke="#d98a6a" strokeWidth="2" />
      <path d="M20 34 V6 M20 34 L10 10 M20 34 L30 10" stroke="#d98a6a" strokeWidth="1.5" />
      <text x="20" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7a3a2a">
        {label}
      </text>
    </svg>
  )
}

type Props = {
  contestants: Contestant[]
  step: CeremonyStep
  result: CeremonyResult | null
  revealed: number
  doubleVote: boolean
  nextLabel: string
  onVote: (index: number) => void
  onNext: () => void
}

export function Ceremony({ contestants, step, result, revealed, doubleVote, nextLabel, onVote, onNext }: Props) {
  const members = contestants.map((c, i) => ({ c, i })).filter(({ c, i }) => c.alive || i === result?.eliminated)
  const shown = result ? result.votes.slice(0, revealed) : []
  const leaving = step === 'farewell' ? result?.eliminated : undefined
  const mid = (members.length - 1) / 2

  return (
    <section className="rr-ceremony" data-testid="ceremony" data-step={step}>
      <p className="rr-ceremony-title">
        {step === 'ceremony' && 'Ceremonia przy pochodniach. Wskaż osobę, która powinna opuścić willę.'}
        {step === 'reveal' && 'Liczymy głosy…'}
        {step === 'farewell' && result && (result.eliminated === PLAYER ? 'Willa zdecydowała: odpadasz!' : `Willę opuszcza: ${contestants[result.eliminated].name}`)}
      </p>
      <div className="rr-circle">
        {members.map(({ c, i }, n) => {
          const tokens = shown.filter((v) => v.target === i).flatMap((v) => (v.voter === PLAYER && doubleVote ? [v, v] : [v]))
          const mood = i === PLAYER ? (leaving === PLAYER ? 'out' : 'neutral') : contestantMood({ affection: c.affection, alive: leaving !== i })
          const votable = step === 'ceremony' && i !== PLAYER
          return (
            <div key={c.name} className="rr-seat" style={{ '--arc': `${(n - mid) ** 2 * 3}px` } as CSSProperties}>
              <Torch lit={leaving !== i} />
              <button
                type="button"
                className="rr-seat-button"
                data-testid={i === PLAYER ? 'ceremony-player' : 'ceremony-contestant'}
                data-mood={mood}
                disabled={!votable}
                onClick={() => onVote(i)}
              >
                <motion.span
                  className="rr-figure"
                  animate={leaving === i ? { opacity: 0.55, filter: 'grayscale(1)', x: [0, 0, 40], transition: { duration: 2.2, times: [0, 0.5, 1] } } : {}}
                >
                  <ContestantFigure name={c.name} mood={mood} />
                </motion.span>
                <span className="rr-name">{i === PLAYER ? 'Ty' : c.name}</span>
              </button>
              <div className="rr-tokens">
                <AnimatePresence>
                  {tokens.map((v, k) => (
                    <motion.span
                      key={`${v.voter}-${k}`}
                      data-testid="vote-token"
                      initial={{ y: -60, opacity: 0, rotate: -30 }}
                      animate={{ y: 0, opacity: 1, rotate: (k % 3) * 12 - 12 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                    >
                      <Shell label={v.voter === PLAYER ? 'TY' : contestants[v.voter].name[0]} />
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              {tokens.length > 0 && <span className="rr-count">{tokens.length}</span>}
              {leaving === i && (
                <motion.span className="rr-leaving" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 30 }} transition={{ delay: 0.8, duration: 1.4 }}>
                  <svg viewBox="0 0 60 60" width="34" aria-hidden>
                    <rect x="6" y="16" width="48" height="36" rx="6" fill="#e65f8a" />
                    <path d="M22 16 V8 H38 V16" stroke="#3a2a20" strokeWidth="4" fill="none" />
                    <path d="M6 30 H54" stroke="#b8406a" strokeWidth="4" />
                  </svg>
                </motion.span>
              )}
            </div>
          )
        })}
      </div>
      {step === 'farewell' && result && (
        <motion.div className="rr-verdict" data-testid="ceremony-result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <ul>
            {result.votes.map(({ voter, target }) => (
              <li key={voter}>
                {voter === PLAYER ? 'Ty' : contestants[voter].name} → {target === PLAYER ? 'ty' : contestants[target].name}
                {voter === PLAYER && doubleVote && ' (×2)'}
              </li>
            ))}
          </ul>
          <button type="button" className="rr-sign rr-sign-go" onClick={onNext} data-testid="next-day">
            {nextLabel}
          </button>
        </motion.div>
      )}
    </section>
  )
}
