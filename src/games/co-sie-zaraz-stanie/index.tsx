import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { Backdrop, type BackdropMood } from './Cabin'
import { Instructor } from './Instructor'
import { dealScenes, instructorMood, PLAY_SECONDS, stampFor, type Phase } from './logic'
import { Scene, Snapshot } from './Scene'
import { play, sfx } from './sfx'

const REWIND_MS = 800

const LINES = {
  lobby: 'Dzień dobry, Henryk, trzydzieści lat za drugim pedałem hamulca. Obejrzymy nagrania, a pan mi powie, co się zaraz stanie.',
  paused: 'Stop-klatka. No i co? Co się zaraz stanie?',
  rewind: 'Przewijamy do następnego nagrania…',
  playing: 'Patrzymy uważnie…',
}

export default function CoSieZarazStanieGame() {
  const [deck, setDeck] = useState(dealScenes)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('lobby')
  const [impact, setImpact] = useState(false)
  const [today] = useState(() => new Date())
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1
  const scene = deck[index]
  const correct = answers.length > index ? answers[index] === scene.answer : null
  const revealedCount = phase === 'verdict' || phase === 'result' ? answers.length : Math.min(answers.length, index)
  const score = answers.slice(0, revealedCount).filter((answer, i) => answer === deck[i].answer).length

  function rewindTo(nextIndex: number) {
    setIndex(nextIndex)
    setImpact(false)
    setPhase('rewind')
    play('rewind')
    setTimeout(() => setPhase('paused'), REWIND_MS * pace)
  }

  function start() {
    sfx.unlock()
    play('click')
    setDeck(dealScenes())
    setAnswers([])
    rewindTo(0)
  }

  function answer(choice: number) {
    if (phase !== 'paused') return
    const playMs = PLAY_SECONDS * 1000 * pace
    play('click')
    play('engine')
    setAnswers([...answers, choice])
    setPhase('playing')
    if (scene.effect === 'brake') setTimeout(() => play('screech'), playMs * 0.3)
    if (scene.effect === 'horn') setTimeout(() => play('horn'), playMs * 0.15)
    if (scene.effect === 'crash')
      setTimeout(
        () => {
          setImpact(true)
          play('crash')
        },
        playMs * Math.min(0.92, ...scene.actors.map((a) => a.stopAt ?? 1)),
      )
    setTimeout(
      () => {
        setPhase('verdict')
        play(choice === scene.answer ? 'good' : 'bad')
      },
      playMs + 300 * pace,
    )
  }

  function next() {
    play('click')
    if (index + 1 >= deck.length) {
      setPhase('result')
      return
    }
    rewindTo(index + 1)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const choice = Number(e.key) - 1
      if (choice >= 0 && choice < scene.options.length) answer(choice)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function backdropMood(): BackdropMood {
    if (phase === 'lobby') return 'idle'
    if (phase === 'rewind' || phase === 'paused') return 'paused'
    if (phase === 'verdict') return correct ? 'correct' : 'wrong'
    return phase
  }

  const mood = instructorMood(phase, correct)

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop mood={backdropMood()} />
      <MuteButton sfx={sfx} />

      <div className="cz-game">
        {phase === 'lobby' && (
          <motion.div className="cz-lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Instructor mood={mood} line={LINES.lobby} />
            <div className="cz-lobby-text">
              <p className="cz-hand text-3xl text-[#ffb020]">Nagrania z kamerki · odcinek dnia</p>
              <h2 className="cz-sign text-6xl text-white sm:text-7xl">Co się zaraz stanie?</h2>
              <p>
                Obejrzysz {deck.length} nagrań zatrzymanych sekundę przed zdarzeniem. Wybierz, co się wydarzy (kliknięciem albo klawiszem 1–4), a potem zobacz, jak było naprawdę. Za każde trafienie 1
                pkt.
              </p>
              <button type="button" className="cz-start cz-sign" onClick={start} data-testid="start">
                ▶ Odtwórz nagranie
              </button>
            </div>
          </motion.div>
        )}

        {phase !== 'lobby' && phase !== 'result' && (
          <>
            <header className="cz-bar">
              <strong className="cz-bar-title cz-sign">Co się zaraz stanie?</strong>
              <span className="cz-stat" data-testid="progress">
                Nagranie{' '}
                <b>
                  {index + 1}/{deck.length}
                </b>
              </span>
              <span className="cz-stat" data-testid="score" data-value={score}>
                Trafione <b>{score}</b>
              </span>
            </header>

            <div className="cz-heading">
              <h3 className="cz-sign" data-testid="scene-title">
                {scene.title}
              </h3>
              <p>{scene.setup}</p>
            </div>

            <div className="cz-stage">
              <Scene key={index} scene={scene} phase={phase} stamp={stampFor(scene, index, today)} impact={impact} pace={pace} />
              <Instructor mood={mood} line={phase === 'verdict' ? scene.comment : LINES[phase]} />
            </div>

            <div className="cz-options">
              {scene.options.map((option, i) => {
                const state = correct === null || phase === 'playing' ? undefined : i === scene.answer ? 'right' : i === answers[index] ? 'picked' : 'dim'
                return (
                  <button
                    key={option}
                    type="button"
                    className="cz-option"
                    data-testid="option"
                    data-correct={i === scene.answer}
                    data-state={state}
                    disabled={phase !== 'paused'}
                    onClick={() => answer(i)}
                  >
                    <kbd className="cz-sign">{i + 1}</kbd>
                    {option}
                  </button>
                )
              })}
            </div>

            {phase === 'verdict' && (
              <motion.div className="cz-verdict" data-testid="verdict" data-correct={correct} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <strong className="cz-sign">{correct ? 'Trafione! +1 pkt' : 'Pudło!'}</strong>
                <button type="button" className="cz-start cz-sign" onClick={next} data-testid="next">
                  {index + 1 >= deck.length ? 'Podsumowanie' : '▶▶ Następne nagranie'}
                </button>
              </motion.div>
            )}
          </>
        )}

        {phase === 'result' && (
          <ResultScreen
            slug="co-sie-zaraz-stanie"
            score={score}
            maxScore={deck.length}
            shareLine={deck.map((s, i) => (answers[i] === s.answer ? '🟢' : '🔴')).join('')}
            summary={score >= 5 ? 'Przewidujesz jak doświadczony instruktor jazdy.' : 'Na drodze dzieje się więcej, niż się wydaje. Zwolnij!'}
            onRestart={start}
          >
            <div className="cz-tape">
              {deck.map((s, i) => (
                <figure key={s.title} className="cz-clip" data-testid="result-clip" data-correct={answers[i] === s.answer}>
                  <Snapshot scene={s} />
                  <figcaption>
                    {answers[i] === s.answer ? '🟢' : '🔴'} {s.title}
                  </figcaption>
                </figure>
              ))}
            </div>
            <Instructor mood={instructorMood('verdict', score >= 4)} />
          </ResultScreen>
        )}

        <p className="cz-footer text-center text-[11px]">Sceny, postacie i nagrania są fikcyjne · Dźwięki: Kenney (CC0)</p>
      </div>
    </MotionConfig>
  )
}
