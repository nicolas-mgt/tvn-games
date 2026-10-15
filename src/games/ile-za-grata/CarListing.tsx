import { AnimatePresence, motion } from 'motion/react'
import data from './data.json'
import { formatZl } from './logic'

export type Car = (typeof data.listings)[number]

export function CarListing({ car, guess, revealed, pace }: { car: Car; guess: number; revealed: boolean; pace: number }) {
  return (
    <div className="gr-listing">
      <figure className="gr-photo-frame">
        <img src={`/ile-za-grata/cars/${car.id}.jpg`} alt={car.title} draggable={false} className="gr-photo" data-testid="car-photo" />
        <div className="gr-stickers">
          <span>{car.year}</span>
          <span>{car.mileage.toLocaleString('pl-PL')} km</span>
          <span>{car.fuel}</span>
        </div>
        <figcaption className="gr-credit" data-testid="photo-credit">
          Fot.:{' '}
          <a href={car.photo.source} target="_blank" rel="noreferrer">
            {car.photo.author}, {car.photo.license}
          </a>
        </figcaption>
      </figure>

      <div className="gr-card" data-testid="listing-card">
        <p className="gr-card-head">Sprzedam</p>
        <h3 className="gr-card-title">{car.title}</h3>
        <p className="gr-card-desc gr-hand">„{car.description}”</p>
        <div className="gr-card-price">
          <span>{revealed ? 'Twoja wycena' : 'Daję'}</span>
          <strong className="gr-marker" data-testid="guess">
            {formatZl(guess)}
          </strong>
        </div>
        <AnimatePresence>
          {revealed && (
            <motion.div
              className="gr-price-sticker"
              data-testid="price-sticker"
              initial={{ rotateY: 90, scale: 1.4, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 * pace, duration: 0.45 * pace, ease: 'backOut' }}
            >
              <span>Poszło za</span>
              <strong>{formatZl(car.price)}</strong>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
