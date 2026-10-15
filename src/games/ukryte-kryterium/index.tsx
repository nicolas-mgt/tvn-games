import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { pickOne } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { CottageBackdrop, type Mood } from './CottageBackdrop'
import { Envelope, TaskCard } from './Envelope'
import { Judge } from './Judge'
import { clampPoints, CRITERIA, judgeComment, judgeMood, MAX_TASK_POINTS, type Criterion, type JudgeMood, type Metrics, type TaskId } from './logic'
import { play, sfx } from './sfx'
import { CircleTask, ExcuseTask, HorseTask, MondayTask, TimerTask, type TaskProps } from './Tasks'

type Phase = 'lobby' | 'envelope' | 'task' | 'judging' | 'verdict' | 'result'
type Verdict = { criterion: Criterion; points: number }

const TASKS: { id: TaskId; title: string; instruction: string; Component: (props: TaskProps) => ReactNode }[] = [
  { id: 'timer', title: 'Zegar w głowie', instruction: 'Wciśnij stoper, a potem wciśnij go znowu dokładnie po 7,3 sekundy.', Component: TimerTask },
  { id: 'horse', title: 'Koń', instruction: 'Narysuj konia. Najlepszego konia, jakiego potrafisz.', Component: HorseTask },
  { id: 'excuse', title: 'Wymówka', instruction: 'Napisz wymówkę spóźnienia do pracy. Około 50 znaków.', Component: ExcuseTask },
  { id: 'monday', title: 'Poniedziałek', instruction: 'Nalej tyle kawy, ile masz energii w poniedziałek rano.', Component: MondayTask },
  { id: 'circle', title: 'Kółko', instruction: 'Przez 5 sekund wciskaj czerwony przycisk.', Component: CircleTask },
]

const GOOD_SCORE = 3
const GREAT_TOTAL = 18

function drawCriteria() {
  return TASKS.map((t) => pickOne(CRITERIA[t.id]))
}

export default function UkryteKryteriumGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [criteria, setCriteria] = useState(drawCriteria)
  const [verdicts, setVerdicts] = useState<Verdict[]>([])
  const [taskIndex, setTaskIndex] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reducedMotion = useReducedMotion()

  const task = TASKS[taskIndex]
  const verdict = verdicts[taskIndex]
  const total = verdicts.reduce((sum, v) => sum + v.points, 0)
  const last = taskIndex === TASKS.length - 1

  function enterCottage() {
    sfx.unlock()
    play('card')
    setPhase('envelope')
  }

  function finishTask(metrics: Metrics) {
    if (phase !== 'task') return
    const criterion = criteria[taskIndex]
    const points = clampPoints(criterion.score(metrics))
    setTimerRunning(false)
    setVerdicts([...verdicts, { criterion, points }])
    setPhase('judging')
    play('hmm')
    setTimeout(() => play('scribble'), 700)
    setTimeout(() => {
      setPhase('verdict')
      setTimeout(() => play('placard'), 550)
      setTimeout(() => play(points >= GOOD_SCORE ? 'good' : 'bad'), 800)
      if (points === MAX_TASK_POINTS) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.4 }, colors: ['#f2c230', '#fbf6e9', '#8b1a2b'], disableForReducedMotion: true })
      }
      if (points === 0 && !reducedMotion) void animate(scope.current, { x: [0, -10, 8, -5, 3, 0] }, { duration: 0.4, delay: 0.6 })
    }, 1500)
  }

  function nextTask() {
    if (last) {
      if (total >= GREAT_TOTAL) confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, disableForReducedMotion: true })
      setPhase('result')
      return
    }
    setTaskIndex(taskIndex + 1)
    setPhase('envelope')
  }

  function restart() {
    setCriteria(drawCriteria())
    setVerdicts([])
    setTaskIndex(0)
    setPhase('envelope')
  }

  function moodFor(): Mood {
    switch (phase) {
      case 'lobby':
      case 'envelope':
        return 'idle'
      case 'task':
        return timerRunning ? 'timer' : 'task'
      case 'judging':
        return 'judging'
      case 'verdict':
        return verdict.points >= GOOD_SCORE ? 'good' : 'bad'
      case 'result':
        return 'result'
    }
  }

  const judge: { mood: JudgeMood; points?: number; comment: string } =
    phase === 'verdict'
      ? { mood: judgeMood(verdict.points), points: verdict.points, comment: judgeComment(verdict.points) }
      : phase === 'judging'
        ? { mood: 'thinking', comment: 'Hmm…' }
        : phase === 'task'
          ? { mood: 'neutral', comment: 'Twój czas start.' }
          : { mood: 'bored', comment: 'Wszystko, co musisz wiedzieć, jest w kopercie.' }

  return (
    <MotionConfig reducedMotion="user">
      <CottageBackdrop mood={moodFor()} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div
          className="flex min-h-[60svh] flex-col items-center justify-center gap-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="uk-hand -rotate-2 text-3xl text-amber-200">Domek zadań · sędzia już czeka</p>
          <h2 className="font-display text-6xl tracking-wider text-amber-50 sm:text-8xl">Ukryte kryterium</h2>
          <p className="max-w-md text-amber-50/80">
            Pięć zalakowanych kopert, pięć absurdalnych zadań. Za co naprawdę są punkty, sędzia zdradzi dopiero po fakcie. I nie przyjmuje reklamacji.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enterCottage} data-testid="enter-cottage">
            Wejdź do domku
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && phase !== 'result' && (
        <div className="flex flex-col gap-5">
          <div className="uk-chalkboard" data-testid="chalkboard">
            {TASKS.map((t, i) => (
              <div key={t.id} className="uk-chalk-slot" data-current={i === taskIndex}>
                <span className="uk-chalk-label">{t.title}</span>
                <span className="uk-chalk-score uk-hand">{verdicts[i] && (i < taskIndex || phase === 'verdict') ? verdicts[i].points : '?'}</span>
              </div>
            ))}
            <div className="uk-chalk-slot uk-chalk-total">
              <span className="uk-chalk-label">Razem</span>
              <span className="uk-chalk-score uk-hand">{phase === 'verdict' ? total : total - (verdict?.points ?? 0)}</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_15rem] sm:items-start">
            <div className="sm:order-2">
              <Judge mood={judge.mood} points={judge.points} comment={judge.comment} />
            </div>

            <div ref={scope} className="flex min-w-0 flex-col items-center gap-5">
              {phase === 'envelope' && (
                <Envelope key={taskIndex} number={taskIndex + 1} title={task.title} instruction={task.instruction} onOpened={() => setPhase('task')} />
              )}

              {phase !== 'envelope' && <TaskCard number={taskIndex + 1} title={task.title} instruction={task.instruction} />}

              {phase === 'task' && <task.Component key={task.id} onDone={finishTask} onTimerChange={setTimerRunning} />}

              {phase === 'judging' && <p className="uk-hand animate-pulse text-3xl text-amber-50">Sędzia notuje coś w notesie…</p>}

              {phase === 'verdict' && (
                <motion.div className="flex flex-col items-center gap-4 text-center" data-testid="verdict" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.div className="uk-criterion" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">Ukryte kryterium</p>
                    <p className="uk-hand text-2xl leading-tight text-[#2a1a0c] sm:text-3xl">{verdict.criterion.reveal}</p>
                    <p className="font-display text-4xl text-[#8b1a2b]">
                      {verdict.points}/{MAX_TASK_POINTS}
                    </p>
                  </motion.div>
                  <Button size="lg" className="h-12 px-8 font-display text-xl tracking-widest" onClick={nextTask} data-testid="next-task">
                    {last ? 'Wyniki' : 'Następne zadanie'}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen
          slug="ukryte-kryterium"
          score={total}
          maxScore={TASKS.length * MAX_TASK_POINTS}
          shareLine={verdicts.map((v) => `${v.points}`).join(' · ')}
          summary={total >= GREAT_TOTAL ? 'Sędzia rozważa nazwanie zadania twoim imieniem.' : 'Sędzia twierdzi, że widział lepsze występy. U kota.'}
          onRestart={restart}
        >
          <div className="w-40">
            <Judge mood={total >= GREAT_TOTAL ? 'impressed' : total >= 10 ? 'neutral' : 'disgusted'} />
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/40">Dźwięki: Kenney (CC0) · Ilustracje: własne</p>
    </MotionConfig>
  )
}
