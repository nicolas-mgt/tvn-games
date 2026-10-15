import { AnimatePresence, motion } from 'motion/react'
import { ingredientIcon, SLUG } from './logic'

export function Cloche({ number, big = false }: { number?: number; big?: boolean }) {
  return (
    <svg viewBox="0 0 120 90" className={big ? 'dp-cloche-big' : 'dp-cloche'} aria-hidden>
      <path d="M10 76 Q12 18 60 16 Q108 18 110 76 Z" fill="url(#dp-steel)" stroke="#6a737d" strokeWidth="3" />
      <path d="M26 60 Q30 32 54 26" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
      <rect x="50" y="6" width="20" height="12" rx="6" fill="#8a939d" stroke="#6a737d" strokeWidth="2" />
      <rect x="2" y="74" width="116" height="10" rx="5" fill="#aab3bd" stroke="#6a737d" strokeWidth="2" />
      {number !== undefined && (
        <text x="60" y="62" textAnchor="middle" className="dp-sign-text" fontSize="30" fill="#4a5058">
          {number}
        </text>
      )}
    </svg>
  )
}

function Ingredient({ name, delay }: { name: string; delay: number }) {
  const icon = ingredientIcon(name)
  return (
    <motion.div
      className="dp-ingredient"
      data-testid="ingredient"
      data-kind={icon ? 'icon' : 'hint'}
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 16 }}
    >
      {icon ? (
        <>
          <img src={`/${SLUG}/icons/${icon}.svg`} alt="" draggable={false} className="dp-icon" />
          <span className="dp-label">{name}</span>
        </>
      ) : (
        <span className="dp-hint dp-hand">{name}</span>
      )}
    </motion.div>
  )
}

export function Board({ ingredients, revealed, pace }: { ingredients: string[]; revealed: number; pace: number }) {
  return (
    <div className="dp-board" data-testid="board" data-revealed={revealed}>
      {ingredients.map((name, i) => (
        <div key={i} className="dp-slot" data-open={i < revealed}>
          {i < revealed && <Ingredient name={name} delay={0.25 * pace} />}
          <AnimatePresence>
            {i >= revealed && (
              <motion.div
                className="dp-slot-cover"
                exit={{ y: -60, rotate: -14, opacity: 0 }}
                transition={{ duration: 0.45 * pace, ease: 'easeOut' }}
              >
                <Cloche number={i + 1} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function Crumple() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden>
      <path d="M8 14 L15 6 L24 9 L33 7 L35 17 L31 25 L34 33 L23 35 L15 32 L6 33 L9 24 Z" fill="#fbf6e8" stroke="#bdb39a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 13 L20 20 L28 15 M12 26 L20 20 L24 29" stroke="#cfc5aa" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export function Bin({ guesses, pace }: { guesses: string[]; pace: number }) {
  return (
    <div className="dp-bin" data-testid="bin" title="Nietrafione odpowiedzi">
      <div className="dp-bin-papers">
        {guesses.map((guess, i) => (
          <motion.span
            key={i}
            className="dp-paper"
            data-testid="wrong-guess"
            title={guess}
            initial={{ x: -140, y: -120, rotate: 0, scale: 1.5, opacity: 0.4 }}
            animate={{ x: 0, y: 0, rotate: (i % 2 ? 1 : -1) * (20 + i * 25), scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 * pace, ease: [0.3, 0, 0.6, 1] }}
            style={{ left: `${(i % 3) * 30 + 6}%`, bottom: `${Math.floor(i / 3) * 0.7 + 0.2}rem` }}
          >
            <Crumple />
          </motion.span>
        ))}
      </div>
      <svg viewBox="0 0 60 60" className="dp-bin-can" aria-hidden>
        <path d="M8 14 H52 L47 58 H13 Z" fill="url(#dp-steel)" stroke="#6a737d" strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 22 L22 52 M30 22 V52 M40 22 L38 52" stroke="#7a838d" strokeWidth="2" />
        <rect x="4" y="9" width="52" height="7" rx="3" fill="#aab3bd" stroke="#6a737d" strokeWidth="2" />
      </svg>
    </div>
  )
}
