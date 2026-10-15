import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { pickOne } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { clampPoints, CRITERIA, excuseMetrics, judgeComment, MAX_TASK_POINTS, type Criterion, type Metrics, type TaskId } from './logic'

type TaskProps = { onDone: (metrics: Metrics) => void }

function TimerTask({ onDone }: TaskProps) {
  const [startedAt, setStartedAt] = useState<number | null>(null)
  return startedAt === null ? (
    <Button onClick={() => setStartedAt(performance.now())}>Start</Button>
  ) : (
    <Button size="lg" variant="destructive" onClick={() => onDone({ seconds: (performance.now() - startedAt) / 1000 })}>
      STOP (licz w myślach do 7,3)
    </Button>
  )
}

function HorseTask({ onDone }: TaskProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const last = useRef<{ x: number; y: number } | null>(null)
  const stats = useRef({ ink: 0, strokes: 0, firstAt: 0 })

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const canvas = event.currentTarget
    return { x: ((event.clientX - rect.left) / rect.width) * canvas.width, y: ((event.clientY - rect.top) / rect.height) * canvas.height }
  }

  function down(event: PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    last.current = point(event)
    stats.current.strokes += 1
    if (!stats.current.firstAt) stats.current.firstAt = performance.now()
  }

  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (!last.current) return
    const next = point(event)
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(next.x, next.y)
    ctx.stroke()
    stats.current.ink += Math.hypot(next.x - last.current.x, next.y - last.current.y)
    last.current = next
  }

  function finish() {
    const { ink, strokes, firstAt } = stats.current
    onDone({ ink, strokes, seconds: firstAt ? (performance.now() - firstAt) / 1000 : 0 })
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={480}
        height={300}
        data-testid="horse-canvas"
        className="w-full max-w-md touch-none rounded-lg border-2 bg-white"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => (last.current = null)}
      />
      <Button onClick={finish}>Koń gotowy</Button>
    </div>
  )
}

function ExcuseTask({ onDone }: TaskProps) {
  const [text, setText] = useState('')
  return (
    <div className="flex flex-col gap-3">
      <textarea
        className="min-h-24 rounded-md border p-2"
        maxLength={120}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Przepraszam za spóźnienie, ale…"
        aria-label="Wymówka"
      />
      <p className="text-sm text-muted-foreground">{text.length} znaków</p>
      <Button disabled={text.trim().length === 0} onClick={() => onDone(excuseMetrics(text))}>
        Wyślij szefowi
      </Button>
    </div>
  )
}

function MondayTask({ onDone }: TaskProps) {
  const [value, setValue] = useState(50)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between text-2xl">
        <span>💀</span>
        <span className="text-base font-bold">{value}%</span>
        <span>🤩</span>
      </div>
      <Slider min={0} max={100} step={1} value={[value]} onValueChange={([v]) => setValue(v)} />
      <Button onClick={() => onDone({ value })}>Tak się czuję</Button>
    </div>
  )
}

function CircleTask({ onDone }: TaskProps) {
  const [clicks, setClicks] = useState(0)
  const [remaining, setRemaining] = useState<number | null>(null)
  const clicksRef = useRef(0)

  useEffect(() => {
    if (remaining === null) return
    if (remaining <= 0) {
      onDone({ clicks: clicksRef.current })
      return
    }
    const id = setTimeout(() => setRemaining(remaining - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining, onDone])

  if (remaining === null) return <Button onClick={() => setRemaining(5)}>Start (5 sekund)</Button>
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm">Zostało: {remaining} s</p>
      <button
        data-testid="circle"
        className="size-32 rounded-full bg-rose-500 text-3xl font-black text-white active:scale-95"
        onClick={() => {
          clicksRef.current += 1
          setClicks(clicksRef.current)
        }}
      >
        {clicks}
      </button>
    </div>
  )
}

const TASKS: { id: TaskId; title: string; instruction: string; Component: (props: TaskProps) => ReactNode }[] = [
  { id: 'timer', title: 'Zegar w głowie', instruction: 'Naciśnij Start, a potem STOP dokładnie po 7,3 sekundy.', Component: TimerTask },
  { id: 'horse', title: 'Koń', instruction: 'Narysuj konia. Najlepszego konia, jakiego potrafisz.', Component: HorseTask },
  { id: 'excuse', title: 'Wymówka', instruction: 'Napisz wymówkę spóźnienia do pracy. Około 50 znaków.', Component: ExcuseTask },
  { id: 'monday', title: 'Poniedziałek', instruction: 'Ustaw suwak: jak się czujesz w poniedziałek rano?', Component: MondayTask },
  { id: 'circle', title: 'Kółko', instruction: 'Przez 5 sekund klikaj w kółko.', Component: CircleTask },
]

type Verdict = { criterion: Criterion; points: number }

export default function UkryteKryteriumGame() {
  const [criteria, setCriteria] = useState(() => TASKS.map((t) => pickOne(CRITERIA[t.id])))
  const [verdicts, setVerdicts] = useState<Verdict[]>([])
  const [taskIndex, setTaskIndex] = useState(0)
  const task = TASKS[taskIndex]
  const verdict = verdicts[taskIndex]
  const total = verdicts.reduce((sum, v) => sum + v.points, 0)

  function restart() {
    setCriteria(TASKS.map((t) => pickOne(CRITERIA[t.id])))
    setVerdicts([])
    setTaskIndex(0)
  }

  if (taskIndex >= TASKS.length) {
    return (
      <ResultScreen
        slug="ukryte-kryterium"
        score={total}
        maxScore={TASKS.length * MAX_TASK_POINTS}
        shareLine={verdicts.map((v) => `${v.points}`).join(' · ')}
        summary={total >= 18 ? 'Sędzia rozważa nazwanie zadania twoim imieniem.' : 'Sędzia twierdzi, że widział lepsze występy. U kota.'}
        onRestart={restart}
      />
    )
  }

  return (
    <>
      <Hud items={[['Zadanie', `${taskIndex + 1}/${TASKS.length}`], ['Punkty', total]]} />
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p>{task.instruction}</p>
          </div>
          {verdict ? (
            <div className="flex flex-col items-center gap-2 text-center" data-testid="verdict">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">Ukryte kryterium</p>
              <p className="font-semibold">{verdict.criterion.reveal}</p>
              <p className="text-4xl font-black">
                {verdict.points}/{MAX_TASK_POINTS}
              </p>
              <p className="italic">👑 {judgeComment(verdict.points)}</p>
              <Button onClick={() => setTaskIndex(taskIndex + 1)}>
                {taskIndex === TASKS.length - 1 ? 'Wyniki' : 'Następne zadanie'}
              </Button>
            </div>
          ) : (
            <task.Component
              key={task.id}
              onDone={(metrics) => {
                const criterion = criteria[taskIndex]
                setVerdicts((prev) => (prev.length > taskIndex ? prev : [...prev, { criterion, points: clampPoints(criterion.score(metrics)) }]))
              }}
            />
          )}
        </CardContent>
      </Card>
    </>
  )
}
