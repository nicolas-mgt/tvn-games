import { motion } from 'motion/react'
import { Cloche } from './Board'
import { SLUG, type Dish } from './logic'

export function Plate({ dish, className = '' }: { dish: Dish; className?: string }) {
  return (
    <div className={`dp-plate ${className}`}>
      <img src={`/${SLUG}/dishes/${dish.id}.jpg`} alt={dish.name} draggable={false} data-testid="dish-photo" />
    </div>
  )
}

export function PhotoCredit({ dish }: { dish: Dish }) {
  return (
    <p className="dp-credit" data-testid="photo-credit">
      Fot.{' '}
      <a href={dish.photo.source} target="_blank" rel="noreferrer">
        {dish.photo.author}
      </a>
      , {dish.photo.license}, Wikimedia Commons
    </p>
  )
}

type Props = { dish: Dish; won: boolean; pace: number; onNext: () => void }

export function DishReveal({ dish, won, pace, onNext }: Props) {
  return (
    <div className="dp-dish" data-testid="dish" data-won={won}>
      <p className="dp-verdict font-display" data-won={won}>
        {won ? 'Brawo, zgadnięte!' : 'Nie tym razem'}
      </p>
      <div className="dp-plate-wrap">
        <Plate dish={dish} />
        <motion.div
          className="dp-big-cloche"
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{ y: -200, rotate: -16, opacity: 0 }}
          transition={{ delay: 0.6 * pace, duration: 0.9 * pace, ease: 'easeIn' }}
        >
          <Cloche big />
        </motion.div>
      </div>
      <motion.div className="flex flex-col items-center gap-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 * pace }}>
        <h3 className="dp-dish-name font-display">{dish.name}</h3>
        <PhotoCredit dish={dish} />
        <button type="button" className="dp-next" data-testid="next" onClick={onNext}>
          Wynik
        </button>
      </motion.div>
    </div>
  )
}
