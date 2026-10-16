import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { CLOSE_KM, type TravelerMood } from './logic'
import { play } from './sfx'

const COMMENT: Record<Exclude<TravelerMood, 'curious'>, string> = {
  thrilled: 'Prawie trafiłeś w mój plecak! Widać, że czytasz moje pocztówki.',
  pleased: 'Ciepło, ciepło! Jeszcze kawałek i piłbyś ze mną kawę.',
  worried: 'Ojej, to zupełnie inny kraniec świata… Następnym razem na pewno!',
}

function Odometer({ value, rolling }: { value: number; rolling: boolean }) {
  const digits = String(value).padStart(5, '0').split('')
  return (
    <span className="gm-odometer" aria-label={`${value} km`}>
      {digits.map((d, i) => (
        <span key={i} className="gm-odometer-cell">
          <span className="gm-odometer-reel" style={{ transform: `translateY(${rolling ? -Number(d) * 10 : 0}%)`, transitionDelay: `${(digits.length - i) * 0.08}s` }}>
            {'0123456789'.split('').map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

export function Postcard({
  place,
  km,
  points,
  mood,
  last,
  pace,
  onNext,
}: {
  place: { id: string; name: string; country: string }
  km: number
  points: number
  mood: Exclude<TravelerMood, 'curious'>
  last: boolean
  pace: number
  onNext: () => void
}) {
  const [rolling, setRolling] = useState(false)
  const [stamped, setStamped] = useState(false)
  const close = km <= CLOSE_KM
  const rounded = Math.round(km)

  useEffect(() => {
    const timers = [
      setTimeout(() => setRolling(true), 300 * pace),
      ...Array.from({ length: 6 }, (_, i) => setTimeout(() => play('tick'), (300 + i * 110) * pace)),
      setTimeout(() => {
        setStamped(true)
        play('stamp')
      }, 1400 * pace),
      setTimeout(() => play(close ? 'good' : 'bad'), 1700 * pace),
    ]
    return () => timers.forEach(clearTimeout)
  }, [close, pace])

  return (
    <motion.article
      className="gm-postcard"
      data-testid="postcard"
      initial={{ opacity: 0, y: 30, rotate: -6 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
    >
      <div className="gm-postcard-photo">
        <img src={`/gdzie-jest-martyna/places/${place.id}.jpg`} alt="" />
        <span className="gm-postcard-greeting">Pozdrowienia z…</span>
      </div>
      <div className="gm-postcard-back">
        <h3 className="gm-sign" data-testid="answer">
          {place.name}
        </h3>
        <p className="gm-postcard-country">{place.country}</p>
        <p className="gm-hand gm-postcard-comment">{COMMENT[mood]}</p>
        <p className="gm-postcard-km">
          Pomyłka <span data-testid="km" data-value={rounded}><Odometer value={Math.min(99999, rounded)} rolling={rolling} /></span> km
        </p>
        <p className="gm-postcard-points">
          <b data-testid="round-points" data-value={points}>
            {points}
          </b>{' '}
          pkt
        </p>
        <button type="button" className="gm-go" onClick={onNext} data-testid="next">
          {last ? 'Podsumowanie' : 'Dalej'}
        </button>
      </div>
      {stamped && (
        <motion.span
          className="gm-stamp gm-sign"
          data-kind={close ? 'close' : 'far'}
          data-testid="postcard-stamp"
          initial={{ scale: 2.4, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: -14 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        >
          {close ? 'Brawo!' : 'Daleko…'}
        </motion.span>
      )}
    </motion.article>
  )
}
