import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { Chef } from './Cast'
import { Gauges } from './Gauges'
import { applyEffects, ENDINGS, endingFor, INTRO, MAX_SCORE, SCENES, START_STATS, totalScore, type ChefMood, type Choice } from './logic'
import { EndingCard, Fail, OrderPad } from './OrderPad'
import { Room, type RoomMood } from './Room'
import { play, sfx } from './sfx'

type Phase = 'lobby' | 'scene' | 'reaction' | 'fail' | 'revisit'

const ENDING_MOODS: ChefMood[] = ['delighted', 'approving', 'stern', 'appalled']
const GOOD_ENDING_SCORE = 15

export default function UratujKnajpeGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [day, setDay] = useState(0)
  const [stats, setStats] = useState(START_STATS)
  const [shownStats, setShownStats] = useState(START_STATS)
  const [picked, setPicked] = useState<Choice | null>(null)
  const [landed, setLanded] = useState(false)
  const [doorOpen, setDoorOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const scene = SCENES[day]
  const score = totalScore(stats)
  const ending = endingFor(score)
  const failed = picked?.ending !== undefined

  function start() {
    setDay(0)
    setStats(START_STATS)
    setShownStats(START_STATS)
    setPicked(null)
    setLanded(false)
    setDoorOpen(false)
    setRevealed(false)
    setFinished(false)
    setPhase('scene')
    play('door')
    setTimeout(() => play('bell'), 500 * pace)
  }

  function enter() {
    sfx.unlock()
    start()
  }

  function pick(choice: Choice) {
    setPicked(choice)
    play('plate')
    if (choice.ending) {
      setPhase('fail')
      setTimeout(() => play('splat'), 1050 * pace)
      setTimeout(() => {
        setLanded(true)
        play('bad')
      }, 1400 * pace)
      return
    }
    const next = applyEffects(stats, choice.effects)
    setStats(next)
    setPhase('reaction')
    const effects = choice.effects ?? {}
    setTimeout(() => play('pop'), 900 * pace)
    setTimeout(() => {
      setShownStats(next)
      if ((effects.jakosc ?? 0) > 0) play('sizzle')
      if ((effects.atmosfera ?? 0) > 0) play('chatter')
      if ((effects.kasa ?? 0) > 0) play('register')
      if (Object.values(effects).some((v) => v < 0)) play('buzz')
    }, 1700 * pace)
  }

  function nextDay() {
    setPicked(null)
    if (day + 1 < SCENES.length) {
      setDay(day + 1)
      setPhase('scene')
      play('door')
      setTimeout(() => play('bell'), 500 * pace)
      return
    }
    setShownStats(stats)
    setPhase('revisit')
    setTimeout(() => {
      setDoorOpen(true)
      play('door')
    }, 1200 * pace)
    setTimeout(() => play('chatter'), 2400 * pace)
    setTimeout(() => {
      setRevealed(true)
      play(score >= GOOD_ENDING_SCORE ? 'good' : 'bad')
      if (score >= GOOD_ENDING_SCORE) {
        confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 }, colors: ['#ffd34d', '#d8323a', '#fff', '#6fae5a'], disableForReducedMotion: true })
      }
    }, 3600 * pace)
  }

  function roomMood(): RoomMood {
    if (finished) return 'result'
    if (phase === 'lobby') return 'idle'
    if (phase === 'fail') return landed ? 'fail' : 'bad'
    if (phase === 'revisit') return 'revisit'
    if (phase === 'reaction' && picked) {
      const sum = Object.values(picked.effects ?? {}).reduce((a, b) => a + b, 0)
      return sum > 0 ? 'good' : sum < 0 ? 'bad' : 'scene'
    }
    return 'scene'
  }

  const inScene = phase === 'scene' || phase === 'reaction' || phase === 'fail'
  const endingMood = ENDING_MOODS[ENDINGS.indexOf(ending)]

  return (
    <MotionConfig reducedMotion="user">
      <Room mood={roomMood()} scene={inScene && !finished ? scene.id : ''} stats={shownStats} open={doorOpen} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div className="kn-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="kn-hand text-3xl text-amber-200">Pcim Dolny · gospoda ledwo zipie</p>
          <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">Uratuj knajpę</h2>
          <p className="text-white/90">
            Sześć dni z Szefową Bożeną. Każda decyzja zmienia jakość kuchni, atmosferę i kasę, a sala zmienia się razem z nimi. Jedna zła odzywka i wszystko się kończy.
            Wrócisz po miesiącu zobaczyć efekt.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enter} data-testid="start">
            Zaczynamy rewolucję
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && !finished && (
        <div className="flex flex-col gap-4">
          <header className="kn-bar">
            <strong className="kn-bar-title" data-testid="day" data-value={phase === 'revisit' ? SCENES.length : day + 1}>
              {phase === 'revisit' ? (
                'Po miesiącu'
              ) : (
                <>
                  <span>
                    Dzień {day + 1}/{SCENES.length}
                  </span>
                  <em>{scene.title}</em>
                </>
              )}
            </strong>
            <Gauges stats={shownStats} />
          </header>

          {(phase === 'scene' || phase === 'reaction') && (
            <OrderPad
              key={scene.id}
              scene={scene}
              day={day + 1}
              intro={day === 0 ? INTRO : undefined}
              picked={picked}
              deltaDelay={900 * pace}
              nextLabel={day === SCENES.length - 1 ? 'Wracamy po miesiącu…' : 'Następny dzień'}
              onPick={pick}
              onNext={nextDay}
            />
          )}

          {phase === 'fail' && picked?.ending && <Fail text={picked.ending} landed={landed} onNext={() => setFinished(true)} />}

          {phase === 'revisit' && revealed && <EndingCard ending={ending} mood={endingMood} onNext={() => setFinished(true)} />}
        </div>
      )}

      {finished && (
        <ResultScreen
          slug="uratuj-knajpe"
          score={failed ? 0 : score}
          maxScore={MAX_SCORE}
          summary={
            failed ? (
              <p>{picked?.ending}</p>
            ) : (
              <>
                <p className="font-semibold">Powrót po miesiącu: {ending.title}</p>
                <p>{ending.text}</p>
              </>
            )
          }
          shareLine={failed ? '🍝🙈' : `🍲${stats.jakosc} 😊${stats.atmosfera} 💰${stats.kasa}`}
          onRestart={start}
        >
          <div className="kn-result">
            <Chef mood={failed ? 'appalled' : endingMood} kluski={failed} className="kn-result-chef" />
            {failed ? <p className="font-semibold">Zakończenie: Kluski na głowę</p> : <Gauges stats={stats} />}
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/70">Dźwięki: Kenney (CC0) · Postacie są fikcyjne</p>
    </MotionConfig>
  )
}
