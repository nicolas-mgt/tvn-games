import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { matchesAnswer } from '@/shared/answer'
import { todayKey } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { loadJSON, saveJSON } from '@/shared/storage'
import { Bin, Board } from './Board'
import { DishReveal, PhotoCredit, Plate } from './DishReveal'
import { Jury } from './Jury'
import { DAILY_KEY, dishFor, dishScore, MAX_POINTS, SLUG, type Mode } from './logic'
import { play, sfx } from './sfx'
import { Studio, type StudioMood } from './Studio'

type Phase = 'lobby' | 'play' | 'dish' | 'result'

function dailyLabel() {
  const [, month, day] = todayKey().split('-')
  return `Danie dnia ${day}.${month}`
}

export default function DanieGame() {
  const dailyDone = loadJSON<string | null>(DAILY_KEY, null) === todayKey()
  const [phase, setPhase] = useState<Phase>('lobby')
  const [mode, setMode] = useState<Mode>(dailyDone ? 'practice' : 'daily')
  const [dish, setDish] = useState(() => dishFor(dailyDone ? 'practice' : 'daily'))
  const [revealed, setRevealed] = useState(1)
  const [guesses, setGuesses] = useState<string[]>([])
  const [guess, setGuess] = useState('')
  const [outcome, setOutcome] = useState<'won' | 'lost' | null>(null)
  const [wrongFlash, setWrongFlash] = useState(false)
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const last = dish.ingredients.length
  const score = outcome ? dishScore(revealed, outcome === 'won') : MAX_POINTS + 1 - revealed

  function enter() {
    sfx.unlock()
    setPhase('play')
    play('bell')
    setTimeout(() => play('flame'), 400 * pace)
  }

  function finish(result: 'won' | 'lost') {
    setOutcome(result)
    setPhase('dish')
    setWrongFlash(false)
    if (mode === 'daily') saveJSON(DAILY_KEY, todayKey())
    setTimeout(() => play('lift'), 600 * pace)
    setTimeout(() => {
      play(result === 'won' ? 'good' : 'bad')
      if (result === 'won') {
        play('sizzle')
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.45 }, colors: ['#ffd34d', '#ff4d5a', '#fff', '#6fae5a'], disableForReducedMotion: true })
      }
    }, 1300 * pace)
  }

  function revealNext() {
    if (revealed === last) {
      finish('lost')
      return
    }
    setRevealed(revealed + 1)
    play('lift')
    setTimeout(() => play('chop'), 250 * pace)
    if (revealed + 1 === last) {
      play('flame')
      setTimeout(() => play('tick'), 600 * pace)
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!guess.trim()) return
    if (matchesAnswer(guess, [dish.name, ...dish.aliases])) {
      finish('won')
      return
    }
    setGuesses([...guesses, guess])
    setGuess('')
    play('crumple')
    if (revealed < last) {
      setWrongFlash(true)
      clearTimeout(flashTimer.current)
      flashTimer.current = setTimeout(() => setWrongFlash(false), 1200 * pace)
    }
    revealNext()
  }

  function startPractice() {
    setMode('practice')
    setDish(dishFor('practice'))
    setRevealed(1)
    setGuesses([])
    setGuess('')
    setOutcome(null)
    setPhase('play')
    play('bell')
  }

  function studioMood(): StudioMood {
    if (phase === 'lobby') return 'idle'
    if (phase === 'result') return 'result'
    if (phase === 'dish') return outcome === 'won' ? 'correct' : 'fail'
    if (wrongFlash) return 'wrong'
    return revealed === last ? 'close' : 'reveal'
  }

  const shareLine = Array.from({ length: MAX_POINTS }, (_, i) =>
    i < revealed - 1 ? '🟥' : i === revealed - 1 ? (outcome === 'won' ? '🟩' : '🟥') : '⬜',
  ).join('')

  return (
    <MotionConfig reducedMotion="user">
      <Studio mood={studioMood()} burst={guesses.length} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div className="dp-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="dp-hand text-3xl text-amber-200">Studio kulinarne · nagranie na żywo</p>
          <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">Danie po składnikach</h2>
          <p className="text-white/90">
            Trzech jurorów odsłania spod kloszy składniki jednego dania, po jednym. Zgadnij danie jak najszybciej: przy pierwszym składniku masz 6 punktów, z każdym kolejnym o
            jeden mniej.
          </p>
          {dailyDone && (
            <p className="dp-hand text-2xl text-amber-200" data-testid="practice-note">
              Dzisiejsze danie już za tobą – teraz trening na losowych daniach.
            </p>
          )}
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enter} data-testid="start">
            Wchodzimy do studia
          </Button>
        </motion.div>
      )}

      {(phase === 'play' || phase === 'dish') && (
        <div className="flex flex-col gap-3">
          <header className="dp-bar">
            <strong className="dp-mode" data-testid="mode">
              {mode === 'daily' ? dailyLabel() : 'Trening'}
            </strong>
            {phase === 'play' && revealed === last && (
              <span className="dp-timer" data-testid="timer">
                <svg viewBox="0 0 40 40" aria-hidden>
                  <circle cx="20" cy="22" r="15" fill="#fbf6e8" stroke="#d8323a" strokeWidth="4" />
                  <rect x="16" y="2" width="8" height="6" rx="2" fill="#d8323a" />
                  <path className="dp-timer-hand" d="M20 22 V11" stroke="#2b1d14" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Ostatni składnik!
              </span>
            )}
            <span className="dp-points" data-testid="points" data-value={score}>
              <span className="dp-points-plates" aria-hidden>
                {Array.from({ length: MAX_POINTS }, (_, i) => (
                  <i key={i} data-on={i < score} />
                ))}
              </span>
              <b>{score} pkt</b>
            </span>
          </header>

          <Jury revealed={revealed} outcome={outcome} />

          {phase === 'play' && (
            <>
              <Board ingredients={dish.ingredients} revealed={revealed} pace={pace} />
              <form onSubmit={submit} className="dp-form">
                <Input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Wpisz nazwę dania…"
                  className="dp-input"
                  data-testid="guess"
                  autoFocus
                />
                <Button type="submit" className="dp-submit font-display text-xl tracking-wider" data-testid="submit">
                  Zgaduję
                </Button>
                <div className="dp-form-row">
                  <Button type="button" variant="secondary" className="dp-reveal" onClick={revealNext} data-testid="reveal">
                    Kolejny składnik
                  </Button>
                  <Bin guesses={guesses} pace={pace} />
                </div>
              </form>
            </>
          )}

          {phase === 'dish' && <DishReveal dish={dish} won={outcome === 'won'} pace={pace} onNext={() => setPhase('result')} />}
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen
          slug={SLUG}
          score={score}
          maxScore={MAX_POINTS}
          shareLine={shareLine}
          summary={
            <p>
              {outcome === 'won' ? 'Brawo! ' : 'Nie tym razem. '}To był: <strong>{dish.name}</strong>
              {mode === 'daily' && ' (danie dnia)'}
            </p>
          }
          onRestart={startPractice}
        >
          <div className="dp-result">
            <Plate dish={dish} className="dp-plate-small" />
            <PhotoCredit dish={dish} />
            <Jury revealed={revealed} outcome={outcome} />
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/70">
        Dźwięki: Kenney (CC0) · Ikony: OpenMoji (CC BY-SA 4.0) · Zdjęcia: Wikimedia Commons, autorzy przy zdjęciach · Jurorzy są fikcyjni
      </p>
    </MotionConfig>
  )
}
