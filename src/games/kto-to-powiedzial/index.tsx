import '@fontsource/bebas-neue'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { Cast } from './Cast'
import data from './data.json'
import { Backdrop, type BackdropMood } from './LivingRoom'
import { buildDeck, QUOTES_PER_GAME, reactionFor, SOURCE_IDS, type SourceId } from './logic'
import { play, sfx } from './sfx'
import { Television, Verdict } from './Television'

type Phase = 'lobby' | 'quote' | 'answered' | 'result'

const sourceById = Object.fromEntries(data.sources.map((s) => [s.id, s]))
const labels = Object.fromEntries(data.sources.map((s) => [s.id, s.label]))

export default function KtoToPowiedzialGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [quotes, setQuotes] = useState(() => buildDeck(data.quotes))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const quote = quotes[index]
  const answer = phase === 'answered' ? answers[index] : null
  const correct = answer === null ? null : answer === quote.source
  const score = answers.filter((a, i) => a === quotes[i].source).length
  const last = index === QUOTES_PER_GAME - 1

  function switchChannel() {
    setPhase('quote')
    play('click')
    play('static')
  }

  function enter() {
    sfx.unlock()
    play('crunch')
    switchChannel()
  }

  function pick(id: SourceId) {
    if (phase !== 'quote') return
    setAnswers([...answers, id])
    setPhase('answered')
    if (quote.source === 'generator') play('beep')
    if (id === quote.source) play('good')
    else {
      play('rimshot')
      setTimeout(() => play('bad'), 450 * pace)
    }
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const id = SOURCE_IDS[Number(event.key) - 1]
      if (id) pick(id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function next() {
    if (last) {
      setPhase('result')
      play('click')
      return
    }
    setIndex(index + 1)
    switchChannel()
  }

  function restart() {
    setQuotes(buildDeck(data.quotes))
    setIndex(0)
    setAnswers([])
    switchChannel()
  }

  function backdropMood(): BackdropMood {
    if (phase === 'lobby') return 'idle'
    if (phase === 'answered') return correct ? 'correct' : 'wrong'
    return phase
  }

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop mood={backdropMood()} />
      <MuteButton sfx={sfx} />

      <div className="kt-game">
        {phase === 'lobby' && (
          <motion.div className="kt-lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Cast labels={labels} answer={null} source={null} />
            <h2 className="font-display text-6xl tracking-wider text-[#fff4e0] sm:text-7xl">Kto to powiedział?</h2>
            <p>
              Wieczór, kanapa, chipsy. Telewizor przełącza kanały, a na ekranie pojawia się cytat. Powiedziała to gwiazda z kanapy talk-show, rodzina sprzed telewizora czy generator bełkotu? Kliknij postać albo
              naciśnij 1, 2 lub 3. {QUOTES_PER_GAME} cytatów, punkt za każde trafienie.
            </p>
            <button type="button" className="kt-start kt-sign" onClick={enter} data-testid="start">
              Włącz telewizor
            </button>
          </motion.div>
        )}

        {(phase === 'quote' || phase === 'answered') && (
          <>
            <header className="kt-bar">
              <strong className="kt-bar-title kt-sign" data-testid="progress">
                Kanał {index + 1}/{QUOTES_PER_GAME}
              </strong>
              <span className="kt-stat" data-testid="score" data-value={score}>
                Trafione <b>{score}</b>
              </span>
            </header>
            <div className="kt-stage">
              <Television key={quote.id} quote={quote} channel={index + 1} answered={phase === 'answered'} onAir={correct === true} pace={pace} />
              {correct !== null && (
                <Verdict
                  correct={correct}
                  speaker={sourceById[quote.source].label}
                  reaction={reactionFor(quote.source as SourceId, correct, index)}
                  last={last}
                  pace={pace}
                  onNext={next}
                />
              )}
            </div>
            <Cast labels={labels} answer={answer} source={phase === 'answered' ? quote.source : null} onPick={pick} />
          </>
        )}

        {phase === 'result' && (
          <ResultScreen
            slug="kto-to-powiedzial"
            score={score}
            maxScore={QUOTES_PER_GAME}
            shareLine={quotes.map((q, i) => (answers[i] === q.source ? sourceById[q.source].emoji : '❌')).join('')}
            summary={score >= 8 ? 'Masz ucho do bełkotu jak mało kto.' : 'Granica między kanapą, telewizorem i generatorem jest cieńsza, niż myślisz.'}
            onRestart={restart}
          >
            <div className="kt-guide" data-testid="result-guide">
              <p className="kt-guide-title kt-sign">Program na dziś</p>
              <div className="kt-tiles">
                {quotes.map((q, i) => (
                  <motion.div
                    key={q.id}
                    className="kt-tile"
                    data-testid="result-tile"
                    data-correct={answers[i] === q.source}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (0.2 + i * 0.1) * pace }}
                  >
                    <span className="kt-tile-channel kt-sign">Kanał {i + 1}</span>
                    <p className="kt-tile-quote">„{q.text}”</p>
                    <p className="kt-tile-source">
                      {answers[i] === q.source ? '✅' : '❌'} {sourceById[q.source].emoji} {sourceById[q.source].label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ResultScreen>
        )}

        <p className="kt-footer text-center text-[11px]">Wszystkie cytaty i postacie są fikcyjne · Dźwięki: Kenney (CC0)</p>
      </div>
    </MotionConfig>
  )
}
