import '@fontsource/bebas-neue'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import headlines from './data.json'
import { HostsDesk } from './Hosts'
import { buildDeck, DECK_SIZE, hostMoods, quipFor } from './logic'
import { play, sfx } from './sfx'
import { Backdrop, Ticker, type BackdropMood } from './Studio'
import { Teleprinter, type Lean } from './Teleprinter'

type Phase = 'lobby' | 'reading' | 'answered' | 'result'

export default function PrawdaCzySciemaGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [deck, setDeck] = useState(() => buildDeck(headlines))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [lean, setLean] = useState<Lean>(null)
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const card = deck[index]
  const saysReal = phase === 'answered' ? answers[index] : null
  const correct = saysReal === null ? null : saysReal === card.real
  const score = answers.filter((answer, i) => answer === deck[i].real).length
  const last = index === DECK_SIZE - 1
  const moods = hostMoods(correct)

  function startReading() {
    setPhase('reading')
    setLean(null)
    play('jingle')
  }

  function enter() {
    sfx.unlock()
    startReading()
  }

  function answer(says: boolean) {
    if (phase !== 'reading') return
    setAnswers([...answers, says])
    setPhase('answered')
    const hit = says === card.real
    play('stamp')
    setTimeout(() => play('whoosh'), 500 * pace)
    setTimeout(() => play(hit ? 'good' : 'bad'), 850 * pace)
    if (!hit) play('static')
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') answer(true)
      if (event.key === 'ArrowLeft') answer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function next() {
    if (last) {
      setPhase('result')
      play('jingle')
      return
    }
    setIndex(index + 1)
    startReading()
  }

  function restart() {
    setDeck(buildDeck(headlines))
    setIndex(0)
    setAnswers([])
    startReading()
  }

  function backdropMood(): BackdropMood {
    if (phase === 'lobby') return 'idle'
    if (phase === 'reading') return lean ? `swipe-${lean}` : 'reading'
    if (phase === 'answered') return correct ? 'correct' : 'wrong'
    return 'result'
  }

  function tickerText(): string {
    if (phase === 'lobby') return 'Za chwilę: „Szkiełko i oko”, wieczorne wiadomości, w których nie wszystko jest prawdą'
    if (phase === 'reading') return `Depesza nr ${index + 1} właśnie spływa z dalekopisu · Prawda czy ściema? · Przesuń kartkę w prawo albo w lewo`
    if (phase === 'answered') return card.explanation
    return `Dobranoc! Wynik wieczoru: ${score}/${DECK_SIZE} trafionych depesz`
  }

  const surprising = deck.find((h, i) => h.real && !answers[i]) ?? deck.find((h) => h.real)!

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop mood={backdropMood()} />
      <MuteButton sfx={sfx} />

      <div className="ps-game">
        {phase === 'lobby' && (
          <motion.div className="ps-lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <HostsDesk anchor="deadpan" satirist="grin" quip="Dobry wieczór! Dziś znowu nie wszystko jest prawdą." />
            <h2 className="font-display text-6xl tracking-wider text-white sm:text-7xl">Prawda czy ściema?</h2>
            <p>
              Z dalekopisu spływa {DECK_SIZE} depesz: połowa wydarzyła się naprawdę, resztę zmyśliła redakcja. Przesuń kartkę w prawo, jeśli to prawda, w lewo, jeśli ściema. Możesz też użyć przycisków albo strzałek ← →. Za każde
              trafienie dostajesz punkt.
            </p>
            <button type="button" className="ps-start ps-sign" onClick={enter} data-testid="start">
              Wchodzimy na antenę
            </button>
          </motion.div>
        )}

        {(phase === 'reading' || phase === 'answered') && (
          <>
            <header className="ps-bar">
              <strong className="ps-bar-title ps-sign" data-testid="progress">
                Depesza {index + 1}/{DECK_SIZE}
                <em>Szkiełko i oko</em>
              </strong>
              <span className="ps-stat" data-testid="score" data-value={score}>
                Trafione <b>{score}</b>
              </span>
            </header>
            <Teleprinter
              key={card.id}
              headline={card}
              number={index + 1}
              total={DECK_SIZE}
              saysReal={saysReal}
              last={last}
              pace={pace}
              onAnswer={answer}
              onLean={setLean}
              onNext={next}
            />
            <HostsDesk anchor={moods.anchor} satirist={moods.satirist} quip={correct === null ? null : quipFor(correct, card.real, index)} />
          </>
        )}

        {phase === 'result' && (
          <ResultScreen
            slug="prawda-czy-sciema"
            score={score}
            maxScore={DECK_SIZE}
            shareLine={deck.map((h, i) => (answers[i] === h.real ? '✅' : '❌')).join('')}
            summary={
              <div className="ps-surprise space-y-1">
                <p className="text-sm text-muted-foreground">Najbardziej zaskakujący prawdziwy news:</p>
                <p className="font-semibold">„{surprising.headline}”</p>
                <a href={surprising.source} target="_blank" rel="noreferrer">
                  Źródło: Wikipedia
                </a>
              </div>
            }
            onRestart={restart}
          >
            <div className="ps-strips" data-testid="result-strips">
              {deck.map((h, i) => (
                <motion.div
                  key={h.id}
                  className="ps-strip"
                  data-testid="result-strip"
                  data-correct={answers[i] === h.real}
                  initial={{ opacity: 0, y: -30, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: ((i * 7) % 9) - 4 }}
                  transition={{ delay: (0.2 + i * 0.12) * pace }}
                >
                  <p>{h.headline}</p>
                  <div className="ps-strip-foot">
                    <span>{answers[i] === h.real ? '✅' : '❌'}</span>
                    <span className="ps-stamp ps-sign" data-kind={String(h.real)}>
                      {h.real ? 'Prawda' : 'Ściema'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ResultScreen>
        )}

        <p className="ps-footer text-center text-[11px]">Dźwięki: Kenney (CC0) · Studio i prowadzący są fikcyjni · Źródła prawdziwych newsów: Wikipedia</p>
      </div>

      <Ticker text={tickerText()} />
    </MotionConfig>
  )
}
