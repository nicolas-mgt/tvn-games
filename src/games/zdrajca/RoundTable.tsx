import { AnimatePresence, motion } from 'motion/react'
import { gendered, PLAYER, residentMood, shortName, type Resident, type ResidentMood, type Vote } from './logic'
import { ResidentFigure } from './Resident'

export type TableStep = 'table' | 'reveal' | 'verdict'
export type Verdict = { votes: Vote[]; banished: number }

const BUBBLES: Partial<Record<ResidentMood, string>> = { suspicious: 'hmm…', nervous: 'to nie ja!', offended: 'ja?!' }

type Props = {
  residents: Resident[]
  step: TableStep
  verdict: Verdict | null
  revealed: number
  nextLabel: string
  onVote: (index: number) => void
  onNext: () => void
}

export function RoundTable({ residents, step, verdict, revealed, nextLabel, onVote, onNext }: Props) {
  const seats = residents.flatMap((r, i) => (r.alive || i === verdict?.banished ? [i] : []))
  const shown = verdict ? verdict.votes.slice(0, revealed) : []
  const banished = verdict && step === 'verdict' ? verdict.banished : null
  const banishedRole = banished !== null ? residents[banished].role : null

  return (
    <section className="zd-table" data-testid="round-table" data-step={step}>
      <p className="zd-title">
        {step === 'table' && 'Okrągły stół. Kogo wygnać z zamku?'}
        {step === 'reveal' && 'Tabliczki w górę…'}
        {step === 'verdict' && banished !== null && (banished === PLAYER ? 'Zamek wskazał ciebie!' : `${residents[banished].name} opuszcza zamek`)}
      </p>
      <div className="zd-seats">
        {seats.map((i) => {
          const isPlayer = i === PLAYER
          const unmasked = banished === i && banishedRole === 'zdrajca'
          const mood: ResidentMood = isPlayer
            ? banished === PLAYER
              ? 'out'
              : 'calm'
            : residentMood({
                alive: !(banished === i && banishedRole === 'lojalny'),
                unmasked,
                votesAgainst: shown.filter((v) => v.target === i).length,
                votedByPlayer: shown.some((v) => v.voter === PLAYER && v.target === i),
                accusesPlayer: shown.some((v) => v.voter === i && v.target === PLAYER),
              })
          const received = shown.filter((v) => v.target === i).length
          const vote = verdict?.votes.find((v) => v.voter === i)
          const flipped = vote ? shown.includes(vote) : false
          const bubble = BUBBLES[mood]
          return (
            <div key={residents[i].name} className="zd-seat">
              <button
                type="button"
                className="zd-suspect"
                data-testid={isPlayer ? 'table-player' : 'suspect'}
                data-mood={mood}
                data-banished={banished === i}
                disabled={step !== 'table' || isPlayer}
                onClick={() => onVote(i)}
              >
                <AnimatePresence>
                  {bubble && (
                    <motion.span key={mood} className="zd-mood-bubble zd-hand" initial={{ opacity: 0, scale: 0.5, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {bubble}
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.span
                  className="zd-figure"
                  animate={banished === i && !unmasked ? { opacity: 0.55, filter: 'grayscale(1)' } : mood === 'nervous' ? { x: [0, -2, 2, -2, 0] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <ResidentFigure name={residents[i].name} mood={mood} hooded={unmasked} />
                </motion.span>
                <span className="zd-name">{isPlayer ? 'Ty' : residents[i].name}</span>
                {received > 0 && (
                  <motion.span key={received} className="zd-count" initial={{ scale: 1.6 }} animate={{ scale: 1 }}>
                    {received}
                  </motion.span>
                )}
              </button>
              {vote && (
                <div className="zd-slate-wrap">
                  <motion.div
                    className="zd-slate"
                    data-testid="vote-slate"
                    data-flipped={flipped}
                    data-target={residents[vote.target].name}
                    initial={false}
                    animate={{ rotateY: flipped ? 0 : 180 }}
                    transition={{ duration: 0.45 }}
                  >
                    <span className="zd-slate-face zd-hand">{shortName(residents[vote.target].name)}</span>
                    <span className="zd-slate-back" />
                  </motion.div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <AnimatePresence>
        {step === 'verdict' && verdict && (
          <motion.div className="zd-verdict" data-testid="verdict" data-role={residents[verdict.banished].role} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="zd-banner" data-role={residents[verdict.banished].role} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <span className="zd-banner-kicker">{verdict.banished === PLAYER ? 'Ty' : residents[verdict.banished].name}</span>
              <strong>
                {residents[verdict.banished].role === 'zdrajca'
                  ? 'Zdrajca!'
                  : gendered(residents[verdict.banished].name, 'Lojalny…', 'Lojalna…')}
              </strong>
            </motion.div>
            <button type="button" className="zd-main" onClick={onNext} data-testid="next">
              {nextLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
