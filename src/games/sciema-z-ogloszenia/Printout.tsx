import { AnimatePresence, motion } from 'motion/react'
import data from './data.json'

export type Ad = (typeof data.listings)[number]
type SegmentState = 'idle' | 'hit' | 'miss' | 'missed'

const ELLIPSE = 'M5 22 Q4 4 50 3 Q97 3 96 20 Q95 37 50 37 Q8 37 3 16'

export function Printout({
  ad,
  number,
  clicked,
  reviewing,
  stamp,
  pace,
  onSegment,
}: {
  ad: Ad
  number: number
  clicked: Set<number>
  reviewing: boolean
  stamp: string | null
  pace: number
  onSegment: (index: number) => void
}) {
  return (
    <article className="sc-printout" data-testid="printout">
      <span className="sc-printout-pin" />
      <header className="sc-portal">
        <strong>Moto-Okazje.pl</strong>
        <span>Ogłoszenie nr {4400 + number * 37}</span>
      </header>
      <figure className="sc-photo-frame">
        <img src={`/sciema-z-ogloszenia/cars/${ad.id}.jpg`} alt={ad.title} draggable={false} className="sc-photo" data-testid="car-photo" />
        <figcaption className="sc-credit" data-testid="photo-credit">
          Fot.:{' '}
          <a href={ad.photo.source} target="_blank" rel="noreferrer">
            {ad.photo.author}, {ad.photo.license}
          </a>
        </figcaption>
      </figure>
      <h2 className="sc-ad-title">{ad.title}</h2>
      <div className="sc-segments">
        {ad.segments.map((segment, i) => {
          const isClicked = clicked.has(i)
          const state: SegmentState = isClicked ? (segment.flag ? 'hit' : 'miss') : reviewing && segment.flag ? 'missed' : 'idle'
          return (
            <button
              key={i}
              type="button"
              className="sc-segment"
              data-testid="ad-segment"
              data-flag={Boolean(segment.flag)}
              data-state={state}
              disabled={reviewing || isClicked}
              onClick={() => onSegment(i)}
            >
              <span className="sc-segment-body">
                <span className="sc-segment-text">{segment.text}</span>
                {state === 'hit' && (
                  <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="sc-ellipse" aria-hidden>
                    <motion.path d={ELLIPSE} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45 * pace, ease: 'easeOut' }} />
                  </svg>
                )}
              </span>
              {state === 'miss' && (
                <>
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="sc-strike" aria-hidden>
                    <motion.path d="M1 6 Q30 3 60 5 T99 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 * pace }} />
                  </svg>
                  <motion.span className="sc-minus" initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 1, 0], y: -24 }} transition={{ duration: 1.1 * pace }}>
                    −1
                  </motion.span>
                </>
              )}
              {(state === 'hit' || state === 'missed') && (
                <motion.span
                  className="sc-margin-note sc-hand"
                  data-testid="flag-note"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (state === 'hit' ? 0.35 : 0.2) * pace, duration: 0.3 * pace }}
                >
                  {state === 'missed' ? 'Przeoczone: ' : ''}
                  {segment.flag}
                </motion.span>
              )}
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {stamp && (
          <motion.div
            className="sc-stamp"
            data-testid="stamp"
            initial={{ opacity: 0, scale: 2.2, rotate: -24 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            transition={{ duration: 0.3 * pace, ease: 'easeIn' }}
          >
            {stamp}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
