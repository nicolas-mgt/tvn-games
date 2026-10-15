import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { pickN } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { CarListing } from './CarListing'
import data from './data.json'
import { Dealer } from './Dealer'
import { Gauge } from './Gauge'
import { KomisBackdrop, type Mood } from './KomisBackdrop'
import { dealerMood, MAX_POINTS_PER_CAR, MAX_PRICE, MIN_PRICE, PRICE_STEP, priceScore, type DealerMood } from './logic'
import { play, sfx } from './sfx'

const CARS_PER_GAME = 10
const START_GUESS = 30000
const GAUGE_DELAY = 1
const GAUGE_DURATION = 1.2
const VERDICT_AT = 2.4
const POOR_SCORE = 40

type Phase = 'lobby' | 'arrive' | 'inspect' | 'verdict'

const pickComment = (lines: string[]) => lines[Math.floor(Math.random() * lines.length)]

export default function IleZaGrataGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [cars, setCars] = useState(() => pickN(data.listings, CARS_PER_GAME))
  const [index, setIndex] = useState(0)
  const [guess, setGuess] = useState(START_GUESS)
  const [scores, setScores] = useState<number[]>([])
  const [comment, setComment] = useState<string | null>(null)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1
  const car = cars[index]
  const finished = index >= cars.length
  const score = scores[index]
  const verdictMood = score === undefined ? null : dealerMood(guess, car.price)
  const shownScores = phase === 'verdict' && comment === null ? scores.slice(0, index) : scores
  const total = shownScores.reduce((sum, value) => sum + value, 0)

  function arrive() {
    setPhase('arrive')
    play('engine')
    setTimeout(() => play('door'), 900 * pace)
    setTimeout(() => setPhase('inspect'), 1300 * pace)
  }

  function enterLot() {
    sfx.unlock()
    play('horn')
    arrive()
  }

  function restart() {
    setCars(pickN(data.listings, CARS_PER_GAME))
    setIndex(0)
    setScores([])
    setGuess(START_GUESS)
    setComment(null)
    arrive()
  }

  function appraise() {
    const points = priceScore(guess, car.price)
    const mood = dealerMood(guess, car.price)
    setScores([...scores, points])
    setComment(null)
    setPhase('verdict')
    play('keys')
    setTimeout(() => play('slap'), 650 * pace)
    const ticks = Math.round(points / 10)
    for (let i = 0; i < ticks; i++) setTimeout(() => play('tick'), (GAUGE_DELAY + (i / ticks) * GAUGE_DURATION) * pace * 1000)
    setTimeout(
      () => {
        setComment(pickComment(data.comments[mood]))
        play('cash')
        setTimeout(() => play(points >= 70 ? 'good' : 'bad'), 300)
        if (mood === 'greedy') setTimeout(() => play('keys'), 700)
        if (points >= 90) {
          confetti({
            particleCount: 30,
            spread: 90,
            startVelocity: 30,
            gravity: 0.7,
            scalar: 1.8,
            shapes: [confetti.shapeFromText({ text: '🔑', scalar: 1.8 })],
            origin: { y: 0.5 },
            disableForReducedMotion: true,
          })
        } else if (points < POOR_SCORE && !reducedMotion) {
          void animate(scope.current, { x: [0, -10, 8, -6, 3, 0] }, { duration: 0.45 })
        }
      },
      VERDICT_AT * pace * 1000,
    )
  }

  function nextCar() {
    setIndex(index + 1)
    setGuess(START_GUESS)
    setComment(null)
    if (index + 1 < cars.length) {
      arrive()
      return
    }
    if (total > 700) confetti({ particleCount: 140, spread: 100, origin: { y: 0.4 }, colors: ['#ff4fb4', '#f2b705', '#ffffff'], disableForReducedMotion: true })
  }

  function dealerState(): { mood: DealerMood; line: string | null } {
    if (phase === 'arrive') return { mood: 'neutral', line: 'Dzień dobry, szefie! Patrz pan, co przyjechało.' }
    if (phase === 'inspect') return { mood: 'neutral', line: 'No i co, ile pan daje?' }
    if (comment === null || verdictMood === null) return { mood: 'thinking', line: 'Hmmm…' }
    return { mood: verdictMood, line: comment }
  }

  function backdropMood(): Mood {
    if (finished) return 'result'
    if (phase === 'lobby') return 'idle'
    if (phase !== 'verdict' || comment === null) return phase === 'arrive' ? 'arrive' : 'inspect'
    if (score >= 70) return 'good'
    return score < POOR_SCORE ? 'bad' : 'inspect'
  }

  const dealer = dealerState()
  const grandTotal = scores.reduce((sum, value) => sum + value, 0)

  return (
    <MotionConfig reducedMotion="user">
      <KomisBackdrop mood={backdropMood()} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div
          className="gr-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="gr-hand text-2xl text-pink-300">Komis U Zbyszka · zaraz zamykamy</p>
          <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">Ile za tego grata?</h2>
          <p className="text-white/80">
            Dziesięć aut, kartki za szybą i Zbyszek, który widział już wszystko. Wyceń każde auto, a on oceni, czy znasz się na rzeczy. Za trafną cenę
            dostajesz do 100 punktów.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enterLot} data-testid="enter-lot">
            Wchodzę na komis
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && !finished && (
        <div className="flex flex-col gap-4">
          <div className="gr-plate" data-testid="plate">
            <span className="gr-plate-eu">PL</span>
            <strong>
              AUTO {index + 1}/{cars.length}
            </strong>
            <span className="gr-plate-dot" />
            <strong data-testid="total">{total} PKT</strong>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:grid-rows-[auto_1fr]">
            <div className="lg:col-start-2 lg:row-start-1">
              <Dealer mood={dealer.mood} line={dealer.line} />
            </div>

            <div ref={scope} className="flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-span-2 lg:row-start-1">
              <motion.div key={index} initial={{ x: '-110vw' }} animate={{ x: 0 }} transition={{ duration: 1.1 * pace, ease: [0.2, 0.8, 0.3, 1] }}>
                <CarListing car={car} guess={guess} revealed={phase === 'verdict'} pace={pace} />
              </motion.div>

              {phase === 'verdict' ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="gr-points font-display" data-testid="car-score">
                    {comment === null ? '…' : `+${score} pkt`}
                  </p>
                  <Button
                    size="lg"
                    className="h-12 px-8 font-display text-xl tracking-widest"
                    onClick={nextCar}
                    disabled={comment === null}
                    data-testid="next-car"
                  >
                    {index === cars.length - 1 ? 'Podsumowanie' : 'Następne auto'}
                  </Button>
                </div>
              ) : (
                <div className="gr-controls">
                  <div className="gr-tape">
                    <Slider
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      step={PRICE_STEP}
                      value={[guess]}
                      disabled={phase !== 'inspect'}
                      onValueChange={([value]) => setGuess(value)}
                      aria-label="Suwak ceny"
                      data-testid="price-slider"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      step={PRICE_STEP}
                      value={guess}
                      disabled={phase !== 'inspect'}
                      onChange={(e) => setGuess(Number(e.target.value))}
                      aria-label="Cena w złotych"
                      className="gr-price-input"
                      data-testid="price-input"
                    />
                    <Button className="gr-appraise" onClick={appraise} disabled={phase !== 'inspect'} data-testid="appraise">
                      Daję tyle!
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-start-2 lg:row-start-2">
              <Gauge score={phase === 'verdict' ? score : null} delay={GAUGE_DELAY * pace} duration={GAUGE_DURATION * pace} />
            </div>
          </div>
        </div>
      )}

      {finished && (
        <ResultScreen
          slug="ile-za-grata"
          score={grandTotal}
          maxScore={CARS_PER_GAME * MAX_POINTS_PER_CAR}
          summary={grandTotal > 700 ? 'Handlarz z ciebie jak się patrzy!' : 'Komis by cię zjadł żywcem. Ale za to masz duszę kupca.'}
          onRestart={restart}
        >
          <div className="mx-auto w-full max-w-xs">
            <Dealer
              mood={grandTotal > 700 ? 'impressed' : grandTotal < 400 ? 'offended' : 'neutral'}
              line={grandTotal > 700 ? 'Wchodzisz pan w spółkę?' : 'Wpadnij pan jeszcze, coś się znajdzie.'}
            />
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/60">
        Dźwięki: Kenney (CC0) · Zdjęcia: Wikimedia Commons i Flickr, autorzy przy zdjęciach · Ogłoszenia i ceny są fikcyjne
      </p>
    </MotionConfig>
  )
}
