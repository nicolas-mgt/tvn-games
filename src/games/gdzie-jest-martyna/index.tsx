import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { pickN } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import places from './data.json'
import { Backdrop, type BackdropMood } from './Desk'
import { CLOSE_KM, distanceKm, MAX_SCORE, ROUNDS, roundScore, travelerMood, type LatLng } from './logic'
import { Martyna } from './Martyna'
import { Postcard } from './Postcard'
import { play, sfx } from './sfx'
import { WorldMap } from './WorldMap'

type Phase = 'lobby' | 'guess' | 'reveal' | 'postcard' | 'result'
type Place = (typeof places)[number]

const FLIGHT_MS = 1600
const formatKm = (km: number) => Math.round(km).toLocaleString('pl-PL')
const shareSquare = (km: number) => (km <= CLOSE_KM ? '🟩' : travelerMood(km) === 'pleased' ? '🟨' : '🟥')

export default function GdzieJestMartynaGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [rounds, setRounds] = useState<Place[]>(() => pickN(places, ROUNDS))
  const [index, setIndex] = useState(0)
  const [guess, setGuess] = useState<LatLng | null>(null)
  const [scores, setScores] = useState<{ km: number; points: number }[]>([])
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const place = rounds[index]
  const score = scores[index]
  const total = scores.slice(0, phase === 'reveal' ? index : scores.length).reduce((sum, s) => sum + s.points, 0)
  const last = index === ROUNDS - 1
  const mood = phase === 'postcard' ? travelerMood(score.km) : 'curious'

  function startRound() {
    setPhase('guess')
    play('page')
    setTimeout(() => play('shutter'), 250 * pace)
  }

  function enter() {
    sfx.unlock()
    startRound()
  }

  function placeGuess(point: LatLng) {
    setGuess(point)
    play('pin')
  }

  function confirm() {
    if (!guess) return
    const km = distanceKm(guess, place)
    setScores([...scores, { km, points: roundScore(km) }])
    setPhase('reveal')
    play('plane', (FLIGHT_MS / 1000) * pace)
  }

  function landed() {
    play('pin')
    setTimeout(() => {
      setPhase('postcard')
      play('page')
    }, 450 * pace)
  }

  function next() {
    if (last) {
      setPhase('result')
      play('stamp')
      return
    }
    setIndex(index + 1)
    setGuess(null)
    startRound()
  }

  function restart() {
    setRounds(pickN(places, ROUNDS))
    setScores([])
    setIndex(0)
    setGuess(null)
    startRound()
  }

  function backdropMood(): BackdropMood {
    if (phase === 'lobby') return 'idle'
    if (phase === 'postcard') return score.km <= CLOSE_KM ? 'close' : 'far'
    return phase
  }

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop mood={backdropMood()} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div className="gm-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Martyna mood="pleased" className="gm-traveler-big" />
          <p className="gm-hand text-3xl text-amber-800">Martyna · podróżniczka z plecakiem</p>
          <h2 className="font-display text-6xl tracking-wider text-[#3a2418] sm:text-8xl">Gdzie jest Martyna?</h2>
          <p className="text-[#4a3424]">
            Martyna przysyła polaroidy z drugiego końca świata, ale nie pisze, skąd. Wbij pinezkę na mapie. Im bliżej trafisz, tym więcej punktów: do 5000 za każdy z {ROUNDS} etapów podróży.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enter} data-testid="start">
            Otwórz dziennik
          </Button>
        </motion.div>
      )}

      {(phase === 'guess' || phase === 'reveal' || phase === 'postcard') && (
        <div className="flex flex-col gap-3">
          <header className="gm-bar">
            <strong className="gm-bar-title">
              <span>
                Etap podróży {index + 1}/{ROUNDS}
              </span>
              <em>dziennik Martyny</em>
            </strong>
            <span className="gm-stat" data-testid="total" data-value={total}>
              Suma <b>{total}</b>
            </span>
          </header>

          <div className="gm-notebook" data-phase={phase}>
            <section className="gm-page gm-page-left">
              <figure className="gm-polaroid" key={place.id}>
                <div className="gm-polaroid-photo">
                  <img src={`${import.meta.env.BASE_URL}gdzie-jest-martyna/places/${place.id}.jpg`} alt="Gdzie zrobiono to zdjęcie?" data-testid="place-photo" />
                </div>
                <figcaption data-testid="photo-credit">
                  Fot.{' '}
                  <a href={place.photo.source} target="_blank" rel="noreferrer">
                    {place.photo.author}
                  </a>
                  , {place.photo.license}, Wikimedia Commons
                </figcaption>
              </figure>
              <div className="gm-host">
                <Martyna mood={mood} className="gm-traveler" />
                {phase !== 'postcard' && (
                  <motion.p key={phase} className="gm-bubble gm-hand" data-testid="bubble" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    {phase === 'guess' ? 'Zgadniesz, gdzie jestem?' : 'Leć do mnie!'}
                  </motion.p>
                )}
              </div>
            </section>

            <div className="gm-spiral" aria-hidden="true" />

            <section className="gm-page gm-page-right">
              <WorldMap key={index} guess={guess} target={phase === 'guess' ? null : place} flightMs={FLIGHT_MS * pace} onGuess={phase === 'guess' ? placeGuess : undefined} onFlightEnd={landed} />
              {phase === 'guess' && (
                <div className="gm-confirm-row">
                  <p className="gm-hint">{guess ? 'Pinezkę można przestawić.' : 'Kliknij mapę, żeby wbić pinezkę. Przybliżysz kółkiem, dwoma palcami albo +/−.'}</p>
                  <button type="button" className="gm-go" disabled={!guess} onClick={confirm} data-testid="confirm">
                    Tu jest Martyna!
                  </button>
                </div>
              )}
            </section>

            {phase === 'postcard' && (
              <div className="gm-postcard-slot">
                <Postcard place={place} km={score.km} points={score.points} mood={travelerMood(score.km)} last={last} pace={pace} onNext={next} />
              </div>
            )}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen
          slug="gdzie-jest-martyna"
          score={total}
          maxScore={MAX_SCORE}
          summary={
            <ul className="text-sm">
              {rounds.map((p, i) => (
                <li key={p.id}>
                  {p.name} ({p.country}): {formatKm(scores[i].km)} km, {scores[i].points} pkt
                </li>
              ))}
            </ul>
          }
          shareLine={scores.map((s) => shareSquare(s.km)).join('')}
          onRestart={restart}
        >
          <div className="gm-passport" data-testid="passport">
            {rounds.map((p, i) => (
              <motion.div
                key={p.id}
                className="gm-visa"
                data-testid="stamp"
                data-kind={scores[i].km <= CLOSE_KM ? 'close' : 'far'}
                initial={{ scale: 1.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (0.2 + i * 0.25) * pace, type: 'spring', stiffness: 420, damping: 20 }}
                style={{ rotate: `${((i * 7) % 13) - 6}deg` }}
              >
                <span className="gm-sign">{p.country}</span>
                <small>{p.name}</small>
                <b>{scores[i].points} pkt</b>
              </motion.div>
            ))}
          </div>
        </ResultScreen>
      )}

      <p className="gm-footer text-center text-[11px]">Zdjęcia: Wikimedia Commons (autorzy przy zdjęciach) · Mapa: Natural Earth (domena publiczna) · Dźwięki: Kenney (CC0) · Martyna jest fikcyjna</p>
    </MotionConfig>
  )
}
