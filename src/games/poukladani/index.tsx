import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Modifier,
} from '@dnd-kit/core'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Button } from '@/components/ui/button'
import { randomInt } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { Furniture } from './Furniture'
import { Backdrop, type BackdropMood } from './Home'
import { PieceArt, SharedPatterns } from './Items'
import { cellsAt, fits, FURNITURE, LEVELS, levelPoints, MAX_LEVEL_POINTS, MAX_SCORE, organizerMood, parseLevel, rotate, type Art, type Cell, type Level, type OrganizerMood } from './logic'
import { Organizer } from './Organizer'
import { play, sfx } from './sfx'

type Phase = 'lobby' | 'packing' | 'result'

const SAY_START = ['Kurtki, kalosze, parasole. Drzwi szafy mają się domknąć.', 'Pokój dziecka. Wszystko na półki, zanim ktoś na tym stanie.', 'Wakacje! Bagażnik nie jest z gumy, ale damy radę.']
const SAY_FIT = ['Pasuje jak ulał.', 'O, i to rozumiem.', 'Ładnie się wpasowało.', 'Tak trzymać.']
const SAY_BLOCKED = 'Nie tędy. Obróć albo spróbuj gdzie indziej.'
const SAY_REMOVE = 'Przekładamy? Pamiętaj, każdy ruch się liczy.'
const SAY_SOLVED: Record<OrganizerMood, string> = {
  proud: 'Ani jednego zbędnego ruchu. Mistrzostwo!',
  pleased: 'Poukładane. Trochę przekładania, ale efekt jest.',
  doubtful: 'Domknęło się… ale ile było przekładania!',
}

const key = ([r, c]: Cell) => `${r},${c}`
const extent = (cells: readonly Cell[]) => [Math.max(...cells.map(([r]) => r)) + 1, Math.max(...cells.map(([, c]) => c)) + 1] as const

function randomShapes(level: Level): Record<string, Cell[]> {
  return Object.fromEntries(
    level.pieces.map((p) => {
      let cells = p.cells
      for (let i = randomInt(Math.random, 0, 3); i > 0; i--) cells = rotate(cells)
      return [p.id, cells]
    }),
  )
}

function TrayPiece({ id, name, art, cells, selected, onSelect }: { id: string; name: string; art: Art; cells: Cell[]; selected: boolean; onSelect: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id })
  const [rows, cols] = extent(cells)
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      onClick={onSelect}
      className="pk-piece"
      data-testid={`piece-${id}`}
      data-selected={selected}
      data-dragging={isDragging}
      data-shape={cells.map(key).join(';')}
      title={name}
    >
      <PieceArt art={art} cells={cells} tag style={{ width: `calc(var(--tray-cell) * ${cols})`, height: `calc(var(--tray-cell) * ${rows})` }} />
      <span>{name}</span>
    </button>
  )
}

function BoardCell({ cell, owner, preview, onClick, onHover }: { cell: Cell; owner?: string; preview: 'ok' | 'bad' | null; onClick: () => void; onHover: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: key(cell) })
  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      className="pk-cell"
      data-testid={`cell-${cell[0]}-${cell[1]}`}
      data-owner={owner ?? ''}
      data-preview={preview ?? ''}
      data-over={isOver}
    />
  )
}

export default function PoukladaniGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [levelIndex, setLevelIndex] = useState(0)
  const [level, setLevel] = useState(() => parseLevel(LEVELS[0]))
  const [shapes, setShapes] = useState(() => randomShapes(level))
  const [placed, setPlaced] = useState<Record<string, Cell[]>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [hover, setHover] = useState<Cell | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [placements, setPlacements] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [flash, setFlash] = useState<'fit' | 'blocked' | null>(null)
  const [say, setSay] = useState(SAY_START[0])
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const cellSize = useRef(0)
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }))

  const furniture = FURNITURE[Math.min(levelIndex, FURNITURE.length - 1)]
  const ownerOf = new Map(Object.entries(placed).flatMap(([id, cells]) => cells.map((c) => [key(c), id] as const)))
  const occupied = new Set(ownerOf.keys())
  const placedCount = Object.keys(placed).length
  const solved = placedCount === level.pieces.length
  const tray = level.pieces.filter((p) => !placed[p.id])
  const mood = organizerMood(placements - placedCount)
  const points = levelPoints(placements, level.pieces.length)
  const total = scores.reduce((a, b) => a + b, 0) + (phase === 'packing' && solved ? points : 0)
  const previewCells = selected && hover && !solved ? cellsAt(shapes[selected], hover) : []
  const previewOk = previewCells.length > 0 && fits(previewCells, level, occupied)
  const previewKeys = new Set(previewCells.map(key))

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'r' && selected) {
        setShapes((s) => ({ ...s, [selected]: rotate(s[selected]) }))
        play('rotate')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  useEffect(() => () => clearTimeout(flashTimer.current), [])

  function showFlash(kind: 'fit' | 'blocked') {
    setFlash(kind)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(null), 500 * pace)
  }

  function loadLevel(index: number) {
    const next = parseLevel(LEVELS[index])
    setLevelIndex(index)
    setLevel(next)
    setShapes(randomShapes(next))
    setPlaced({})
    setSelected(null)
    setHover(null)
    setPlacements(0)
    setSay(SAY_START[index])
  }

  function enter() {
    sfx.unlock()
    setPhase('packing')
    play('tag')
  }

  function place(id: string, at: Cell) {
    const cells = cellsAt(shapes[id], at)
    if (!fits(cells, level, occupied)) {
      play('blocked')
      showFlash('blocked')
      setSay(SAY_BLOCKED)
      return
    }
    const nowPlaced = placedCount + 1
    const nowPlacements = placements + 1
    setPlaced({ ...placed, [id]: cells })
    setPlacements(nowPlacements)
    setSelected(null)
    setHover(null)
    play(furniture.kind === 'regal' ? 'wood' : 'box')
    showFlash('fit')
    if (nowPlaced < level.pieces.length) {
      setSay(SAY_FIT[nowPlacements % SAY_FIT.length])
      return
    }
    const finalMood = organizerMood(nowPlacements - nowPlaced)
    setSay(SAY_SOLVED[finalMood])
    setTimeout(() => play('close'), 350 * pace)
    setTimeout(() => {
      play('solved')
      if (finalMood === 'proud') confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 }, colors: ['#f2c230', '#f29ab4', '#4aa0e0', '#5ac07a'], disableForReducedMotion: true })
    }, 900 * pace)
  }

  function select(id: string) {
    setSelected(id)
    play('pickup')
  }

  function rotateSelected() {
    if (!selected) return
    setShapes({ ...shapes, [selected]: rotate(shapes[selected]) })
    play('rotate')
  }

  function clickCell(cell: Cell) {
    if (solved) return
    const owner = ownerOf.get(key(cell))
    if (owner) {
      const { [owner]: _removed, ...rest } = placed
      setPlaced(rest)
      setSelected(owner)
      play('pickup')
      setSay(SAY_REMOVE)
    } else if (selected) {
      place(selected, cell)
    }
  }

  function onDragStart({ active }: DragStartEvent) {
    const id = String(active.id)
    cellSize.current = document.querySelector('[data-testid="cell-0-0"]')?.getBoundingClientRect().width ?? 0
    setSelected(id)
    setDragging(id)
    play('pickup')
  }

  function onDragOver({ over }: DragOverEvent) {
    if (!over) return setHover(null)
    const [r, c] = String(over.id).split(',').map(Number)
    setHover([r, c])
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setDragging(null)
    setHover(null)
    if (!over) return
    const [r, c] = String(over.id).split(',').map(Number)
    place(String(active.id), [r, c])
  }

  /** Keeps the anchor cell of the dragged piece under the pointer, because that is the cell that lands on the drop target. */
  const anchorToPointer: Modifier = ({ activatorEvent, draggingNodeRect, transform }) => {
    if (!activatorEvent || !draggingNodeRect || !dragging) return transform
    const point = 'touches' in activatorEvent ? (activatorEvent as TouchEvent).touches[0] : (activatorEvent as PointerEvent)
    const [anchorRow, anchorCol] = shapes[dragging][0]
    return {
      ...transform,
      x: transform.x + point.clientX - draggingNodeRect.left - (anchorCol + 0.5) * cellSize.current,
      y: transform.y + point.clientY - draggingNodeRect.top - (anchorRow + 0.5) * cellSize.current,
    }
  }

  function next() {
    const nextScores = [...scores, points]
    setScores(nextScores)
    if (levelIndex < LEVELS.length - 1) loadLevel(levelIndex + 1)
    else setPhase('result')
  }

  function restart() {
    setScores([])
    loadLevel(0)
    setPhase('packing')
  }

  function backdropMood(): BackdropMood {
    if (phase === 'lobby') return 'idle'
    if (phase === 'result') return 'result'
    if (solved) return 'solved'
    return flash ?? 'packing'
  }

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop mood={backdropMood()} level={phase === 'lobby' ? 0 : levelIndex} />
      <SharedPatterns />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div className="pk-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Organizer mood="pleased" className="pk-organizer-big" />
          <p className="pk-hand text-3xl text-amber-200">Pani Krysia · organizatorka przestrzeni</p>
          <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">Poukładani: upchnij to</h2>
          <p className="text-white/90">
            Szafa w przedpokoju, regał w pokoju dziecka i bagażnik przed wakacjami. Zmieść wszystko, obracając rzeczy. Każde przekładanie kosztuje 5 punktów.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enter} data-testid="start">
            Bierzemy się za porządki
          </Button>
        </motion.div>
      )}

      {phase === 'packing' && (
        <div className="flex flex-col gap-3">
          <header className="pk-bar">
            <strong className="pk-bar-title">
              <span>
                Mebel {levelIndex + 1}/{LEVELS.length}
              </span>
              <em>{furniture.name}</em>
            </strong>
            <span className="pk-stat" data-testid="moves" data-value={placements}>
              Ruchy <b>{placements}</b>
            </span>
            <span className="pk-stat" data-testid="pieces" data-value={placedCount}>
              Rzeczy{' '}
              <b>
                {placedCount}/{level.pieces.length}
              </b>
            </span>
            <span className="pk-stat" data-testid="total" data-value={total}>
              Suma <b>{total}</b>
            </span>
          </header>

          <div className="pk-stage" style={{ '--cols': level.cols } as CSSProperties}>
            <aside className="pk-host">
              <Organizer mood={mood} className="pk-organizer" />
              <motion.p key={say} className="pk-bubble" data-testid="bubble" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {say}
              </motion.p>
            </aside>

            <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} onDragCancel={() => (setDragging(null), setHover(null))}>
              <div className="pk-work">
                <div className="pk-shake" data-shake={flash === 'blocked'}>
                  <Furniture kind={furniture.kind} rows={level.rows} cols={level.cols} closed={solved}>
                    <div className="pk-grid" data-testid="board" onMouseLeave={() => !dragging && setHover(null)}>
                      {Array.from({ length: level.rows * level.cols }, (_, i) => {
                        const cell: Cell = [Math.floor(i / level.cols), i % level.cols]
                        return (
                          <BoardCell
                            key={i}
                            cell={cell}
                            owner={ownerOf.get(key(cell))}
                            preview={previewKeys.has(key(cell)) ? (previewOk ? 'ok' : 'bad') : null}
                            onClick={() => clickCell(cell)}
                            onHover={() => !dragging && setHover(cell)}
                          />
                        )
                      })}
                      {Object.entries(placed).map(([id, cells]) => {
                        const top = Math.min(...cells.map(([r]) => r))
                        const left = Math.min(...cells.map(([, c]) => c))
                        const shape = cells.map(([r, c]): Cell => [r - top, c - left])
                        const [rows, cols] = extent(shape)
                        return (
                          <motion.div
                            key={id}
                            className="pk-placed"
                            style={{ top: `calc(var(--cell) * ${top})`, left: `calc(var(--cell) * ${left})`, width: `calc(var(--cell) * ${cols})`, height: `calc(var(--cell) * ${rows})` }}
                            initial={{ scale: 1.15, opacity: 0.6 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                          >
                            <PieceArt art={furniture.items[id].art} cells={shape} className="size-full" />
                          </motion.div>
                        )
                      })}
                    </div>
                  </Furniture>
                </div>

                {solved ? (
                  <motion.div className="pk-solved" data-testid="level-solved" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 * pace }}>
                    <p>
                      {furniture.name}: <b data-testid="level-points">{points} pkt</b>
                    </p>
                    <button type="button" className="pk-go" onClick={next} data-testid="next">
                      {levelIndex === LEVELS.length - 1 ? 'Podsumowanie' : 'Następny mebel'}
                    </button>
                  </motion.div>
                ) : (
                  <div className="pk-tray-wrap">
                    <div className="pk-tray" data-testid="tray">
                      {tray.map((p) => (
                        <TrayPiece key={p.id} id={p.id} name={furniture.items[p.id].name} art={furniture.items[p.id].art} cells={shapes[p.id]} selected={selected === p.id} onSelect={() => select(p.id)} />
                      ))}
                    </div>
                    <button type="button" className="pk-rotate" disabled={!selected} onClick={rotateSelected} data-testid="rotate">
                      Obróć <kbd>R</kbd>
                    </button>
                  </div>
                )}
              </div>
              <DragOverlay dropAnimation={null} modifiers={[anchorToPointer]}>
                {dragging ? (
                  <PieceArt
                    art={furniture.items[dragging].art}
                    cells={shapes[dragging]}
                    tag
                    className="pk-drag"
                    style={{ width: `calc(var(--cell) * ${extent(shapes[dragging])[1]})`, height: `calc(var(--cell) * ${extent(shapes[dragging])[0]})` }}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen
          slug="poukladani"
          score={total}
          maxScore={MAX_SCORE}
          summary={
            <ul className="text-sm">
              {scores.map((s, i) => (
                <li key={FURNITURE[i].kind}>
                  {FURNITURE[i].name}: {s} pkt
                </li>
              ))}
            </ul>
          }
          shareLine={scores.map((s) => (s === MAX_LEVEL_POINTS ? '🟩' : '🟨')).join('')}
          onRestart={restart}
        >
          <div className="pk-result">
            {scores.map((s, i) => {
              const layout = LEVELS[i]
              return (
                <figure key={FURNITURE[i].kind} data-testid="result-furniture">
                  <Furniture kind={FURNITURE[i].kind} rows={layout.length} cols={layout[0].length} closed mini>
                    <div className="pk-grid" />
                  </Furniture>
                  <figcaption>
                    <span>{FURNITURE[i].name}</span>
                    <b>{s} pkt</b>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/70">Dźwięki: Kenney (CC0) · Grafika: własne SVG · Postacie są fikcyjne</p>
    </MotionConfig>
  )
}
