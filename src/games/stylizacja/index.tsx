import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { pickN } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { useCountdown } from '@/shared/useCountdown'
import { Backdrop, type BackdropMood } from './Backstage'
import data from './data.json'
import { Jury } from './Jury'
import { JURY, jurorScore, MAX_SCORE, modelMood, ROUND_SECONDS, ROUNDS, SLOTS, URGENT_SECONDS, type Item, type Outfit, type Phase, type Slot, type Theme } from './logic'
import { Model } from './Model'
import { OutfitChips, Rack } from './Rack'
import { play, sfx } from './sfx'
import { ItemThumb } from './Wardrobe'

const ITEMS = data.items as Item[]
const GOOD_ROUND_TOTAL = 24

type RoundResult = { theme: Theme; outfit: Outfit; scores: number[] }

const roundSum = (r: RoundResult) => r.scores.reduce((a, b) => a + b, 0)

function DropZone({ children }: { children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'model' })
  return (
    <div ref={setNodeRef} className="st-dropzone" data-over={isOver} data-testid="dropzone">
      {children}
    </div>
  )
}

export default function StylizacjaGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [themes, setThemes] = useState(() => pickN(data.themes, ROUNDS))
  const [round, setRound] = useState(0)
  const [outfit, setOutfit] = useState<Outfit>({})
  const [results, setResults] = useState<RoundResult[]>([])
  const [raised, setRaised] = useState(0)
  const [dragging, setDragging] = useState<Item | null>(null)
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }))
  const { remaining, setRemaining } = useCountdown(ROUND_SECONDS, phase === 'dressing', toRunway)

  const theme = themes[round]
  const current = results[round]
  const juryDone = phase === 'jury' && raised === JURY.length
  const total = results.reduce((sum, r, i) => sum + (i < round || (i === round && (juryDone || phase === 'result')) ? roundSum(r) : 0), 0)
  const seconds = Math.ceil(remaining)
  const urgent = phase === 'dressing' && remaining <= URGENT_SECONDS

  useEffect(() => {
    if (phase === 'dressing' && seconds <= URGENT_SECONDS && seconds > 0) play('tick')
  }, [phase, seconds])

  function startRound() {
    setOutfit({})
    setRemaining(ROUND_SECONDS)
    setRaised(0)
    setPhase('dressing')
    play('hanger')
  }

  function enter() {
    sfx.unlock()
    startRound()
  }

  function equip(item: Item) {
    setOutfit((o) => ({ ...o, [item.slot]: item }))
    play('rustle')
    setTimeout(() => play('hanger'), 120 * pace)
  }

  function remove(slot: Slot) {
    setOutfit((o) => ({ ...o, [slot]: undefined }))
    play('rustle')
  }

  function toRunway() {
    if (phase !== 'dressing') return
    const scores = JURY.map((j) => jurorScore(outfit, theme, j.bias(outfit)))
    const result = { theme, outfit, scores }
    setResults((r) => [...r.slice(0, round), result])
    setPhase('runway')
    for (let i = 0; i < 5; i++) setTimeout(() => play('shutter'), (300 + i * 380) * pace)
    setTimeout(() => play('applause'), 900 * pace)
    setTimeout(() => {
      setPhase('jury')
      play('drumroll')
    }, 2900 * pace)
    JURY.forEach((_, i) => {
      setTimeout(
        () => {
          setRaised(i + 1)
          play('paddle')
        },
        (3900 + i * 700) * pace,
      )
    })
    setTimeout(
      () => {
        const good = roundSum(result) >= GOOD_ROUND_TOTAL
        play(good ? 'good' : 'bad')
        if (good) {
          play('applause')
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.35 }, colors: ['#f2c230', '#f29ab4', '#fff', '#2fd0a0'], disableForReducedMotion: true })
        }
      },
      (3900 + JURY.length * 700) * pace,
    )
  }

  function nextRound() {
    if (round + 1 < ROUNDS) {
      setRound(round + 1)
      startRound()
    } else setPhase('result')
  }

  function restart() {
    setThemes(pickN(data.themes, ROUNDS))
    setRound(0)
    setResults([])
    startRound()
  }

  function onDragStart({ active }: DragStartEvent) {
    setDragging(ITEMS.find((i) => i.id === active.id) ?? null)
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setDragging(null)
    const item = ITEMS.find((i) => i.id === active.id)
    if (item && over?.id === 'model') equip(item)
  }

  function backdropMood(): BackdropMood {
    if (phase === 'lobby') return 'idle'
    if (phase === 'dressing') return urgent ? 'urgent' : 'dressing'
    return phase
  }

  const mood = modelMood({
    phase,
    remaining,
    roundTotal: phase === 'result' ? Math.round(total / ROUNDS) : juryDone && current ? roundSum(current) : null,
  })
  const finalTotal = results.reduce((sum, r) => sum + roundSum(r), 0)

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop mood={backdropMood()} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div className="st-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="st-hand text-3xl text-pink-200">Kulisy pokazu · minuta do wyjścia</p>
          <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">Stylizacja w 60 sekund</h2>
          <p className="text-white/90">
            Trzy tematy, po minucie na każdy. Ubierz Olę: przeciągnij rzeczy z wieszaka na modelkę albo je kliknij. Potem wybieg, flesze i czworo jurorów z tabliczkami 1–10.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enter} data-testid="start">
            Zaczynamy przymiarki
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && phase !== 'result' && (
        <div className="flex flex-col gap-3">
          <header className="st-bar">
            <strong className="st-bar-title">
              <span>
                Runda {round + 1}/{ROUNDS}
              </span>
              <em data-testid="theme">{theme.name}</em>
            </strong>
            <span className="st-timer" data-testid="timer" data-value={phase === 'dressing' ? seconds : 0} data-urgent={urgent}>
              <svg viewBox="0 0 40 40" aria-hidden>
                <circle cx="20" cy="20" r="16" fill="#1a1020" stroke="#4a3a50" strokeWidth="5" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke={urgent ? '#ff4d5a' : '#f29ab4'}
                  strokeWidth="5"
                  strokeDasharray={`${(phase === 'dressing' ? remaining / ROUND_SECONDS : 0) * 100.5} 100.5`}
                  transform="rotate(-90 20 20)"
                />
              </svg>
              <b>{phase === 'dressing' ? `${seconds} s` : phase === 'runway' ? 'Wybieg' : 'Ocena'}</b>
            </span>
            <span className="st-total" data-testid="total" data-value={total}>
              {total} pkt
            </span>
          </header>

          {phase === 'dressing' && (
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDragging(null)}>
              <div className="st-stage">
                <div className="st-model-col">
                  <DropZone>
                    <Model outfit={outfit} mood={mood} className="st-model" />
                  </DropZone>
                  <OutfitChips outfit={outfit} onRemove={remove} />
                </div>
                <div className="st-side">
                  <Rack items={ITEMS} outfit={outfit} onPick={equip} />
                  <button type="button" className="st-go" onClick={toRunway} data-testid="judge">
                    Gotowe – na wybieg!
                  </button>
                </div>
              </div>
              <DragOverlay dropAnimation={null}>{dragging ? <div className="st-drag"><ItemThumb id={dragging.id} slot={dragging.slot as Slot} /></div> : null}</DragOverlay>
            </DndContext>
          )}

          {phase === 'runway' && current && (
            <div className="st-runway-stage">
              <motion.div
                className="st-walk"
                initial={{ y: -40, scale: 0.7, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1, rotate: [0, -2, 2, -2, 0] }}
                transition={{ duration: 2.2 * pace, ease: 'easeOut' }}
              >
                <Model outfit={current.outfit} mood={mood} className="st-model st-model-big" />
              </motion.div>
              <p className="st-hand st-runway-caption">Ola na wybiegu: „{theme.name}”</p>
            </div>
          )}

          {phase === 'jury' && current && (
            <div className="st-jury-stage">
              <Model outfit={current.outfit} mood={mood} className="st-model st-model-small" />
              <div className="flex flex-col items-center gap-3">
                <Jury scores={current.scores} raised={raised} />
                {juryDone && (
                  <motion.button type="button" className="st-go" onClick={nextRound} data-testid="next" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {round === ROUNDS - 1 ? 'Podsumowanie' : 'Następny temat'}
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen
          slug="stylizacja"
          score={finalTotal}
          maxScore={MAX_SCORE}
          summary={
            <ul className="text-sm">
              {results.map((r) => (
                <li key={r.theme.name}>
                  {r.theme.name}: {roundSum(r)} pkt
                </li>
              ))}
            </ul>
          }
          shareLine={results.map((r) => SLOTS.map((s) => r.outfit[s]?.emoji ?? '▫️').join('')).join('\n')}
          onRestart={restart}
        >
          <div className="st-result-models">
            {results.map((r) => (
              <figure key={r.theme.name} data-testid="result-model">
                <Model outfit={r.outfit} mood={roundSum(r) >= GOOD_ROUND_TOTAL ? 'happy' : 'sad'} className="st-model-mini" />
                <figcaption>
                  <span>{r.theme.name}</span>
                  <b>{roundSum(r)} pkt</b>
                </figcaption>
              </figure>
            ))}
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/70">Dźwięki: Kenney (CC0) · Grafika: własne SVG · Postacie są fikcyjne</p>
    </MotionConfig>
  )
}
