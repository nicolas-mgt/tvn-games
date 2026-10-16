import { motion } from 'motion/react'
import { Fragment, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { ATTEMPTS, lookFor, type Entry } from './logic'

export function Tiles({ word, letters, pace }: { word: string; letters: string[]; pace: number }) {
  const groups: { start: number; letters: string[] }[] = []
  letters.forEach((letter, i) => {
    if (letter === ' ' || i === 0) groups.push({ start: letter === ' ' ? i + 1 : i, letters: [] })
    if (letter !== ' ') groups[groups.length - 1].letters.push(letter)
  })
  return (
    <div className="tp-tiles" aria-label={`Hasło, ${word.length} znaków`}>
      {groups.map((group, g) => (
        <Fragment key={group.start}>
          {g > 0 && <span className="tp-gap" data-testid="tile" data-gap="true" />}
          <span className="tp-tile-word">
            {group.letters.map((letter, j) => {
              const i = group.start + j
              return (
                <motion.span
                  key={`${i}-${letter}`}
                  className="tp-tile"
                  data-testid="tile"
                  data-open={letter !== ''}
                  initial={{ rotateY: 90, scale: 0.8 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ delay: i * 0.07 * pace, duration: 0.3 }}
                >
                  {letter}
                </motion.span>
              )
            })}
          </span>
        </Fragment>
      ))}
    </div>
  )
}

export function GuessForm({ attempt, guess, onChange, onSubmit }: { attempt: number; guess: string; onChange: (value: string) => void; onSubmit: (event: FormEvent) => void }) {
  return (
    <form onSubmit={onSubmit} className="tp-form">
      <Input value={guess} onChange={(e) => onChange(e.target.value)} placeholder="O czym mowa?" className="tp-input" data-testid="guess-input" autoFocus />
      <button type="submit" className="tp-submit tp-sign" data-testid="guess-submit">
        Zgaduję
      </button>
      <span className="tp-attempt" data-testid="attempt">
        Próba {attempt}/{ATTEMPTS}
      </span>
    </form>
  )
}

const DOODLES = [
  <g key="sun" stroke="#f2b830" strokeWidth="4" strokeLinecap="round" fill="none">
    <circle cx="32" cy="32" r="13" fill="#f8d060" />
    <path d="M32 8 v-4 M32 56 v4 M8 32 h-4 M56 32 h4 M15 15 l-3 -3 M49 49 l3 3 M49 15 l3 -3 M15 49 l-3 3" />
  </g>,
  <path key="grass" d="M0 166 q10 -12 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#5ab060" strokeWidth="5" fill="none" strokeLinecap="round" />,
  <g key="flower" transform="translate(222 120)" strokeLinecap="round">
    <path d="M0 40 V8" stroke="#5ab060" strokeWidth="4" />
    {[0, 72, 144, 216, 288].map((r) => (
      <ellipse key={r} cx="0" cy="-6" rx="5" ry="9" fill="#f07ab0" transform={`rotate(${r} 0 4)`} />
    ))}
    <circle cx="0" cy="4" r="5" fill="#f2b830" />
  </g>,
  <path key="heart" d="M214 30 q-8 -10 -14 -2 q-6 8 14 20 q20 -12 14 -20 q-6 -8 -14 2 Z" fill="#e8504a" opacity="0.85" />,
  <path key="star" d="M44 120 l4 10 l11 1 l-8 7 l3 11 l-10 -6 l-10 6 l3 -11 l-8 -7 l11 -1 Z" fill="#3a8ad0" opacity="0.8" />,
]

/** A sheet with the word: a crayon drawing when solved, a plain grey card when revealed. */
export function Drawing({ entry, solved, testId = 'drawing' }: { entry: Entry; solved: boolean; testId?: string }) {
  const crayon = lookFor(entry.kid).shirt
  const fontSize = Math.min(46, 440 / entry.word.length)
  return (
    <svg viewBox="0 0 260 180" className="tp-drawing" data-testid={testId} data-solved={solved} role="img" aria-label={`Hasło: ${entry.word}`}>
      <rect x="2" y="2" width="256" height="176" rx="6" fill={solved ? '#fffdf4' : '#e4e2de'} stroke={solved ? '#e8dcc0' : '#c4c2be'} strokeWidth="3" />
      {solved ? (
        DOODLES.filter((_, i) => i !== entry.word.length % DOODLES.length)
      ) : (
        <text x="20" y="34" fontSize="20" fill="#8a8884" className="tp-hand">
          Hasło brzmiało:
        </text>
      )}
      <text x="130" y="98" textAnchor="middle" fontSize={fontSize} fill={solved ? crayon : '#6a6864'} className="tp-hand" stroke={solved ? crayon : 'none'} strokeWidth="0.8">
        {entry.word}
      </text>
      <text x="130" y="134" textAnchor="middle" fontSize="16" fill="#8a7a6a" className="tp-hand">
        {solved ? entry.kid : ''}
      </text>
    </svg>
  )
}

export function Outcome({ entry, solved, points, last, pace, onNext }: { entry: Entry; solved: boolean; points: number; last: boolean; pace: number; onNext: () => void }) {
  return (
    <motion.div
      className="tp-outcome"
      initial={{ opacity: 0, y: 80, rotate: -6 }}
      animate={{ opacity: 1, y: 0, rotate: solved ? -2 : 1 }}
      transition={{
        delay: 0.5 * pace,
        type: 'spring',
        stiffness: 160,
        damping: 16,
      }}
    >
      <Drawing entry={entry} solved={solved} />
      <div className="tp-outcome-side">
        <p className="tp-points tp-sign" data-solved={solved}>
          {solved ? `+${points} pkt` : '0 pkt'}
        </p>
        <button type="button" className="tp-next tp-sign" onClick={onNext} data-testid="next" autoFocus>
          {last ? 'Podsumowanie' : 'Następne hasło'}
        </button>
      </div>
    </motion.div>
  )
}
