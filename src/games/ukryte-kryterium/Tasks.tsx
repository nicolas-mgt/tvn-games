import { motion } from 'motion/react'
import { useEffect, useRef, useState, type ComponentProps, type PointerEvent } from 'react'
import { Slider } from '@/components/ui/slider'
import { excuseMetrics, type Metrics } from './logic'
import { play } from './sfx'

export type TaskProps = {
  onDone: (metrics: Metrics) => void
  onTimerChange: (running: boolean) => void
}

const SCRIBBLE_EVERY_MS = 300

function useScribble() {
  const last = useRef(0)
  return () => {
    const now = performance.now()
    if (now - last.current < SCRIBBLE_EVERY_MS) return
    last.current = now
    play('scribble')
  }
}

function StampButton({ children, ...props }: ComponentProps<'button'>) {
  return (
    <button type="button" className="uk-stamp-button uk-hand" {...props}>
      {children}
    </button>
  )
}

export function TimerTask({ onDone, onTimerChange }: TaskProps) {
  const [startedAt, setStartedAt] = useState<number | null>(null)

  /** Deliberately irregular ticking, so the clock cannot be used to count seconds. */
  useEffect(() => {
    if (startedAt === null) return
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      play('tick')
      timer = setTimeout(tick, 400 + Math.random() * 900)
    }
    tick()
    return () => clearTimeout(timer)
  }, [startedAt])

  function press() {
    if (startedAt === null) {
      setStartedAt(performance.now())
      onTimerChange(true)
      return
    }
    onTimerChange(false)
    onDone({ seconds: (performance.now() - startedAt) / 1000 })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button type="button" className="uk-stopwatch" onClick={press} whileTap={{ scale: 0.96 }} data-testid="stopwatch" aria-label={startedAt === null ? 'Start' : 'Stop'}>
        <svg viewBox="0 0 160 190" aria-hidden className="size-full">
          <rect x="68" y="4" width="24" height="18" rx="4" fill="#b08a2e" stroke="#6e5414" strokeWidth="2" />
          <rect x="74" y="20" width="12" height="12" fill="#8c6c1c" />
          <circle cx="80" cy="110" r="72" fill="#d8b04a" stroke="#6e5414" strokeWidth="4" />
          <circle cx="80" cy="110" r="60" fill="#fbf6e9" stroke="#8c6c1c" strokeWidth="2" />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M80 54 V62" stroke="#3b2a1e" strokeWidth="2.5" transform={`rotate(${i * 30} 80 110)`} />
          ))}
        </svg>
        <span className="uk-sticky uk-hand">Nie podglądać!</span>
      </motion.button>
      <p className="uk-hand text-2xl text-amber-50">{startedAt === null ? 'Wciśnij stoper: start' : 'Wciśnij znowu: STOP po 7,3 s'}</p>
    </div>
  )
}

export function HorseTask({ onDone }: TaskProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const last = useRef<{ x: number; y: number } | null>(null)
  const stats = useRef({ ink: 0, strokes: 0, firstAt: 0 })
  const scribble = useScribble()

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
    ctx.strokeStyle = '#3a3a3a'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(next.x, next.y)
    ctx.stroke()
    stats.current.ink += Math.hypot(next.x - last.current.x, next.y - last.current.y)
    last.current = next
    scribble()
  }

  function finish() {
    const { ink, strokes, firstAt } = stats.current
    onDone({ ink, strokes, seconds: firstAt ? (performance.now() - firstAt) / 1000 : 0 })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="uk-clipboard">
        <span className="uk-clip" />
        <canvas
          ref={canvasRef}
          width={480}
          height={300}
          data-testid="horse-canvas"
          className="uk-paper block w-full touch-none"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => (last.current = null)}
        />
      </div>
      <StampButton onClick={finish}>Koń gotowy</StampButton>
    </div>
  )
}

export function ExcuseTask({ onDone }: TaskProps) {
  const [text, setText] = useState('')
  const scribble = useScribble()
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="uk-notepad">
        <textarea
          className="uk-notepad-text uk-hand"
          maxLength={120}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            scribble()
          }}
          placeholder="Przepraszam za spóźnienie, ale…"
          aria-label="Wymówka"
        />
        <span className="uk-notepad-count uk-hand">{text.length} znaków</span>
      </div>
      <StampButton disabled={text.trim().length === 0} onClick={() => onDone(excuseMetrics(text))}>
        Wyślij szefowi
      </StampButton>
    </div>
  )
}

export function MondayTask({ onDone }: TaskProps) {
  const [value, setValue] = useState(50)
  const coffeeTop = 150 - value * 1.1
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <svg viewBox="0 0 170 170" className="w-40 drop-shadow-[0_10px_14px_rgba(0,0,0,0.4)]" aria-hidden>
        <defs>
          <clipPath id="uk-mug-inside">
            <path d="M30 34 H118 V138 Q118 156 100 156 H48 Q30 156 30 138 Z" />
          </clipPath>
        </defs>
        <path d="M118 60 Q156 60 156 92 Q156 122 118 122" fill="none" stroke="#f1ece0" strokeWidth="13" />
        <path d="M24 28 H124 V138 Q124 162 100 162 H48 Q24 162 24 138 Z" fill="#f1ece0" stroke="#c9bfa8" strokeWidth="2" />
        <rect x="30" y={coffeeTop} width="88" height="170" fill="#6b3f1f" clipPath="url(#uk-mug-inside)" />
        <rect x="30" y={coffeeTop} width="88" height="5" fill="#a87a4f" clipPath="url(#uk-mug-inside)" />
        <g opacity={value / 100} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M56 20 Q50 10 56 2" />
          <path d="M74 20 Q68 10 74 2" />
          <path d="M92 20 Q86 10 92 2" />
        </g>
        <text x="74" y="104" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff" stroke="#3b2a1e" strokeWidth="0.6">
          {value}%
        </text>
      </svg>
      <div className="flex w-full items-center gap-3">
        <span className="text-2xl">💀</span>
        <Slider min={0} max={100} step={1} value={[value]} onValueChange={([v]) => setValue(v)} aria-label="Samopoczucie" />
        <span className="text-2xl">🤩</span>
      </div>
      <StampButton onClick={() => onDone({ value })}>Tak się czuję</StampButton>
    </div>
  )
}

export function CircleTask({ onDone }: TaskProps) {
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

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="uk-counter" data-testid="counter">
        {String(clicks).padStart(3, '0')}
      </div>
      <div className="uk-plinth">
        <motion.button
          type="button"
          data-testid="circle"
          className="uk-red-button"
          disabled={remaining === null}
          whileTap={{ y: 6 }}
          onClick={() => {
            clicksRef.current += 1
            setClicks(clicksRef.current)
          }}
          aria-label="Kółko"
        />
      </div>
      {remaining === null ? (
        <StampButton onClick={() => setRemaining(5)}>Start (5 sekund)</StampButton>
      ) : (
        <p className="uk-hand text-3xl text-amber-50">Zostało: {remaining} s</p>
      )}
    </div>
  )
}
