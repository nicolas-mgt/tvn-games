import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { randomInt } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { cellsAt, fits, LEVELS, levelPoints, MAX_LEVEL_POINTS, parseLevel, rotate, type Cell, type Level } from './logic'

const PIECE_STYLE: Record<string, { emoji: string; color: string }> = {
  A: { emoji: '📚', color: 'bg-amber-300' },
  B: { emoji: '👕', color: 'bg-sky-300' },
  C: { emoji: '🧸', color: 'bg-rose-300' },
  D: { emoji: '👟', color: 'bg-lime-300' },
  E: { emoji: '🎮', color: 'bg-violet-300' },
  F: { emoji: '🧺', color: 'bg-orange-300' },
  G: { emoji: '🎄', color: 'bg-emerald-300' },
  H: { emoji: '🧳', color: 'bg-fuchsia-300' },
  I: { emoji: '🏓', color: 'bg-cyan-300' },
  J: { emoji: '📦', color: 'bg-yellow-200' },
}

const key = ([r, c]: Cell) => `${r},${c}`

function randomShapes(level: Level): Record<string, Cell[]> {
  return Object.fromEntries(
    level.pieces.map((p) => {
      let cells = p.cells
      for (let i = randomInt(Math.random, 0, 3); i > 0; i--) cells = rotate(cells)
      return [p.id, cells]
    }),
  )
}

function ShapeGrid({ id, cells }: { id: string; cells: Cell[] }) {
  const rows = Math.max(...cells.map(([r]) => r)) + 1
  const cols = Math.max(...cells.map(([, c]) => c)) + 1
  const filled = new Set(cells.map(key))
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, 1.5rem)` }}>
      {Array.from({ length: rows * cols }, (_, i) => {
        const cell: Cell = [Math.floor(i / cols), i % cols]
        if (!filled.has(key(cell))) return <span key={i} />
        const isAnchor = key(cell) === key(cells[0])
        return (
          <span key={i} className={`flex size-6 items-center justify-center rounded-sm text-xs ${PIECE_STYLE[id].color} ${isAnchor ? 'ring-2 ring-black' : ''}`}>
            {isAnchor ? PIECE_STYLE[id].emoji : ''}
          </span>
        )
      })}
    </div>
  )
}

function TrayPiece({ id, cells, selected, onSelect }: { id: string; cells: Cell[]; selected: boolean; onSelect: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      data-testid={`piece-${id}`}
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 10 } : undefined}
      className={`rounded-lg border-2 bg-background p-2 ${selected ? 'border-primary' : 'border-transparent'}`}
    >
      <ShapeGrid id={id} cells={cells} />
    </button>
  )
}

function BoardCell({ cell, owner, preview, onClick, onHover }: {
  cell: Cell
  owner?: string
  preview: 'ok' | 'bad' | null
  onClick: () => void
  onHover: () => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: key(cell) })
  const tone = owner ? PIECE_STYLE[owner].color : preview === 'ok' ? 'bg-green-200' : preview === 'bad' ? 'bg-red-200' : 'bg-stone-100'
  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      onMouseEnter={onHover}
      data-testid={`cell-${cell[0]}-${cell[1]}`}
      className={`flex aspect-square items-center justify-center rounded-sm border text-lg ${tone} ${isOver ? 'ring-2 ring-primary' : ''}`}
    >
      {owner ? PIECE_STYLE[owner].emoji : ''}
    </button>
  )
}

export default function PoukladaniGame() {
  const [levelIndex, setLevelIndex] = useState(0)
  const [level, setLevel] = useState(() => parseLevel(LEVELS[0]))
  const [shapes, setShapes] = useState(() => randomShapes(level))
  const [placed, setPlaced] = useState<Record<string, Cell[]>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [hover, setHover] = useState<Cell | null>(null)
  const [placements, setPlacements] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const ownerOf = new Map(Object.entries(placed).flatMap(([id, cells]) => cells.map((c) => [key(c), id] as const)))
  const occupied = new Set(ownerOf.keys())
  const solved = Object.keys(placed).length === level.pieces.length
  const tray = level.pieces.filter((p) => !placed[p.id])
  const previewCells = selected && hover ? cellsAt(shapes[selected], hover) : []
  const previewOk = previewCells.length > 0 && fits(previewCells, level, occupied)
  const previewKeys = new Set(previewCells.map(key))

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'r' && selected) setShapes((s) => ({ ...s, [selected]: rotate(s[selected]) }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  function loadLevel(index: number) {
    const next = parseLevel(LEVELS[index])
    setLevelIndex(index)
    setLevel(next)
    setShapes(randomShapes(next))
    setPlaced({})
    setSelected(null)
    setPlacements(0)
  }

  function place(id: string, at: Cell) {
    const cells = cellsAt(shapes[id], at)
    if (!fits(cells, level, occupied)) return
    setPlaced({ ...placed, [id]: cells })
    setPlacements(placements + 1)
    setSelected(null)
  }

  function clickCell(cell: Cell) {
    const owner = ownerOf.get(key(cell))
    if (owner) {
      const { [owner]: _removed, ...rest } = placed
      setPlaced(rest)
      setSelected(owner)
    } else if (selected) {
      place(selected, cell)
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over) return
    const [r, c] = String(over.id).split(',').map(Number)
    place(String(active.id), [r, c])
  }

  function finishLevel() {
    setScores([...scores, levelPoints(placements, level.pieces.length)])
    if (levelIndex < LEVELS.length - 1) loadLevel(levelIndex + 1)
    else setLevelIndex(LEVELS.length)
  }

  if (levelIndex >= LEVELS.length) {
    const total = scores.reduce((a, b) => a + b, 0)
    return (
      <ResultScreen
        slug="poukladani"
        score={total}
        maxScore={LEVELS.length * MAX_LEVEL_POINTS}
        summary={`Wszystkie szafy poukładane! Punkty za poziomy: ${scores.join(', ')}.`}
        shareLine={scores.map((s) => (s === MAX_LEVEL_POINTS ? '🟩' : '🟨')).join('')}
        onRestart={() => {
          setScores([])
          loadLevel(0)
        }}
      />
    )
  }

  return (
    <>
      <Hud items={[['Szafa', `${levelIndex + 1}/${LEVELS.length}`], ['Ruchy', placements], ['Klocki', `${Object.keys(placed).length}/${level.pieces.length}`]]} />
      <p className="text-sm text-muted-foreground">
        Wybierz klocek, obróć go (klawisz R lub przycisk) i kliknij pole szafy – pole z obwódką trafia w klikniętą kratkę. Możesz też
        przeciągać. Kliknij ułożony klocek, żeby go zdjąć.
      </p>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
          <div
            className="grid gap-0.5 rounded-lg border-4 border-amber-800 bg-amber-900 p-1"
            style={{ gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))` }}
            onMouseLeave={() => setHover(null)}
            data-testid="board"
          >
            {Array.from({ length: level.rows * level.cols }, (_, i) => {
              const cell: Cell = [Math.floor(i / level.cols), i % level.cols]
              return (
                <BoardCell
                  key={i}
                  cell={cell}
                  owner={ownerOf.get(key(cell))}
                  preview={previewKeys.has(key(cell)) ? (previewOk ? 'ok' : 'bad') : null}
                  onClick={() => clickCell(cell)}
                  onHover={() => setHover(cell)}
                />
              )
            })}
          </div>
          <Card>
            <CardContent className="flex flex-col gap-3">
              {solved ? (
                <div className="flex flex-col items-center gap-2 text-center" data-testid="level-solved">
                  <p className="text-lg font-bold">Upchnięte! 🎉</p>
                  <p>Za ten poziom: {levelPoints(placements, level.pieces.length)} pkt</p>
                  <Button onClick={finishLevel}>{levelIndex === LEVELS.length - 1 ? 'Podsumowanie' : 'Następna szafa'}</Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {tray.map((p) => (
                      <TrayPiece key={p.id} id={p.id} cells={shapes[p.id]} selected={selected === p.id} onSelect={() => setSelected(p.id)} />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    disabled={!selected}
                    onClick={() => selected && setShapes({ ...shapes, [selected]: rotate(shapes[selected]) })}
                  >
                    ⟳ Obróć (R)
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DndContext>
    </>
  )
}
