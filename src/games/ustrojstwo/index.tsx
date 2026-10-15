import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { shuffle } from '@/shared/daily'
import { Hud, MuteButton, ResultScreen } from '@/shared/GameShell'
import gadgets from './data.json'
import { Parcel, type ParcelStage } from './Parcel'
import { play, sfx } from './sfx'
import { Fact, Labels, Stamp } from './Verdict'
import { WarehouseBackdrop, type Mood } from './WarehouseBackdrop'

type Gadget = (typeof gadgets)[number]
type Question = Gadget & { options: string[] }
type Phase = 'lobby' | 'arrive' | 'cut' | 'open' | 'verdict' | 'depart' | 'result'

function moodFor(phase: Phase, correct: boolean): Mood {
  switch (phase) {
    case 'lobby':
      return 'idle'
    case 'arrive':
    case 'depart':
      return 'arrive'
    case 'verdict':
      return correct ? 'correct' : 'wrong'
    case 'result':
      return 'result'
    default:
      return 'open'
  }
}

function buildQuestions(): Question[] {
  return shuffle(gadgets).map((gadget) => ({ ...gadget, options: shuffle([gadget.answer, ...gadget.decoys]) }))
}

export default function UstrojstwoGame() {
  const [questions, setQuestions] = useState(buildQuestions)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('lobby')
  const [chosen, setChosen] = useState<string | null>(null)
  const [landed, setLanded] = useState(false)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reducedMotion = useReducedMotion()

  const question = questions[index]
  const correct = chosen === question.answer
  const streak = index + (correct ? 1 : 0)
  const last = index === questions.length - 1

  const parcelStage: ParcelStage = phase === 'verdict' ? 'open' : (phase as ParcelStage)

  function startConveyor() {
    play('rumble')
    setPhase('arrive')
  }

  function enterWarehouse() {
    sfx.unlock()
    startConveyor()
  }

  function choose(option: string) {
    play('select')
    setChosen(option)
    setPhase('verdict')
  }

  function stampLanded() {
    play('stamp')
    setTimeout(() => play(correct ? 'correct' : 'wrong'), 150)
    if (!reducedMotion) void animate(scope.current, { x: [0, -10, 9, -6, 4, 0], y: [0, 5, -4, 2, 0] }, { duration: 0.4 })
    if (correct) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.35 }, colors: ['#4ade80', '#fde68a', '#ffffff'], disableForReducedMotion: true })
      if (last) play('win')
    }
    setLanded(true)
  }

  function next() {
    if (!correct || last) {
      setPhase('result')
      return
    }
    play('rumble')
    setPhase('depart')
  }

  function departed() {
    setIndex(index + 1)
    setChosen(null)
    setLanded(false)
    startConveyor()
  }

  function restart() {
    setQuestions(buildQuestions())
    setIndex(0)
    setChosen(null)
    setLanded(false)
    startConveyor()
  }

  const showContents = phase === 'open' || phase === 'verdict'

  return (
    <MotionConfig reducedMotion="user">
      <WarehouseBackdrop mood={moodFor(phase, correct)} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div
          className="flex min-h-[60svh] flex-col items-center justify-center gap-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="marker -rotate-2 text-3xl text-amber-200">Sortownia nr 7 · zmiana nocna</p>
          <h2 className="font-display text-6xl tracking-wider text-amber-50 sm:text-8xl">Co to za ustrojstwo?</h2>
          <p className="max-w-md text-amber-50/75">
            Na taśmę wjeżdżają paczki z dziwnymi gadżetami. Rozetnij taśmę, obejrzyj zawartość i zgadnij, do czego naprawdę służy. Jedna
            pomyłka i seria się kończy.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enterWarehouse} data-testid="enter-warehouse">
            Wejdź na sortownię
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && phase !== 'result' && (
        <>
          <Hud items={[['Seria', streak], ['Paczka', `${index + 1}/${questions.length}`]]} />
          <div ref={scope} className="relative h-[290px] sm:h-[350px]">
            <div className="belt" data-running={phase === 'arrive' || phase === 'depart'}>
              <div className="belt-surface" />
              <div className="belt-rail" />
            </div>
            <Parcel
              key={index}
              gadgetId={question.id}
              number={index + 1}
              total={questions.length}
              stage={parcelStage}
              onArrived={() => {
                play('land')
                setPhase('cut')
              }}
              onOpened={() => setPhase('open')}
              onDeparted={departed}
            />
            {phase === 'verdict' && <Stamp correct={correct} onLanded={stampLanded} />}
          </div>

          {showContents && (
            <div className="flex flex-col items-center gap-5">
              <motion.div
                className="relative max-w-md -rotate-1 rounded-sm bg-[#fdf6d8] px-5 pb-4 pt-5 text-[#2a1a0c] shadow-lg shadow-black/40"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                data-testid="look"
              >
                <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-red-600 shadow" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">Opis od nadawcy</p>
                <p className="marker text-2xl text-[#2a1a0c]">{question.look}</p>
                <a
                  href={question.photo.source}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-right text-[10px] text-black/45 underline-offset-2 hover:underline"
                  data-testid="photo-credit"
                >
                  Fot. {question.photo.author}, {question.photo.license}
                </a>
              </motion.div>
              <Labels options={question.options} answer={question.answer} chosen={chosen} onChoose={choose} />
              {phase === 'verdict' && landed && <Fact correct={correct} fact={question.fact} last={last} onNext={next} />}
            </div>
          )}
        </>
      )}

      {phase === 'result' && (
        <ResultScreen
          slug="ustrojstwo"
          score={streak}
          maxScore={questions.length}
          summary={streak === questions.length ? 'Wszystkie paczki rozpoznane! Kurier wręcza ci order.' : `Paczka nr ${index + 1} wróciła do nadawcy: ${question.look}`}
          onRestart={restart}
        />
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/40">Dźwięki: Kenney (CC0) · Zdjęcia: Flickr i Wikimedia Commons, autorzy i licencje przy zdjęciach</p>
    </MotionConfig>
  )
}
