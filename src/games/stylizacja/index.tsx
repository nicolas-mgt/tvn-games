import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pickN } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { useCountdown } from '@/shared/useCountdown'
import data from './data.json'
import { JURY, jurorComment, jurorScore, MAX_JUROR_SCORE, SLOTS, type Item, type Outfit, type Slot, type Theme } from './logic'

const ROUNDS = 3
const ROUND_SECONDS = 60
const SLOT_LABELS: Record<Slot, string> = { glowa: 'Głowa', gora: 'Góra', dol: 'Dół', buty: 'Buty', dodatek: 'Dodatek' }
const ITEMS = data.items as Item[]

function DraggableItem({ item, onPick }: { item: Item; onPick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id })
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onPick}
      data-testid={`item-${item.id}`}
      title={`${item.name} (${item.tags.join(', ')})`}
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined}
      className={`flex flex-col items-center rounded-lg border bg-background p-1 text-[10px] leading-tight ${isDragging ? 'z-10 shadow-lg' : ''}`}
    >
      <span className="text-3xl">{item.emoji}</span>
      {item.name}
    </button>
  )
}

function SlotDrop({ slot, item, onClear }: { slot: Slot; item?: Item; onClear: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: slot })
  return (
    <button
      ref={setNodeRef}
      onClick={onClear}
      data-testid={`slot-${slot}`}
      className={`flex h-16 w-full items-center justify-between rounded-lg border-2 border-dashed px-3 ${isOver ? 'border-primary bg-primary/10' : ''}`}
    >
      <span className="text-xs text-muted-foreground">{SLOT_LABELS[slot]}</span>
      <span className="text-4xl">{item?.emoji ?? '·'}</span>
    </button>
  )
}

type RoundResult = { theme: Theme; outfit: Outfit; scores: number[] }

export default function StylizacjaGame() {
  const [themes, setThemes] = useState(() => pickN(data.themes, ROUNDS))
  const [round, setRound] = useState(0)
  const [outfit, setOutfit] = useState<Outfit>({})
  const [results, setResults] = useState<RoundResult[]>([])
  const theme = themes[round]
  const judged = results.length > round
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const { remaining, setRemaining } = useCountdown(ROUND_SECONDS, round < ROUNDS && !judged, judge)
  const total = results.reduce((sum, r) => sum + r.scores.reduce((a, b) => a + b, 0), 0)

  function judge() {
    if (judged) return
    setResults([...results, { theme, outfit, scores: JURY.map((j) => jurorScore(outfit, theme, j.bias(outfit))) }])
  }

  function equip(item: Item) {
    setOutfit({ ...outfit, [item.slot]: item })
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    const item = ITEMS.find((i) => i.id === active.id)
    if (item && over?.id === item.slot) equip(item)
  }

  function nextRound() {
    setRound(round + 1)
    setOutfit({})
    setRemaining(ROUND_SECONDS)
  }

  function restart() {
    setThemes(pickN(data.themes, ROUNDS))
    setRound(0)
    setOutfit({})
    setResults([])
    setRemaining(ROUND_SECONDS)
  }

  if (round >= ROUNDS) {
    return (
      <ResultScreen
        slug="stylizacja"
        score={total}
        maxScore={ROUNDS * JURY.length * MAX_JUROR_SCORE}
        summary={
          <ul className="text-sm">
            {results.map((r) => (
              <li key={r.theme.name}>
                {r.theme.name}: {SLOTS.map((s) => r.outfit[s]?.emoji ?? '▫️').join('')} → {r.scores.reduce((a, b) => a + b, 0)} pkt
              </li>
            ))}
          </ul>
        }
        shareLine={results.map((r) => SLOTS.map((s) => r.outfit[s]?.emoji ?? '▫️').join('')).join('\n')}
        onRestart={restart}
      />
    )
  }

  const result = results[round]
  return (
    <>
      <Hud items={[['Runda', `${round + 1}/${ROUNDS}`], ['Czas', `${Math.ceil(remaining)} s`], ['Punkty', total]]} />
      <Card>
        <CardContent className="flex flex-col gap-1 text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Temat stylizacji</p>
          <p className="text-2xl font-bold">{theme.name}</p>
        </CardContent>
      </Card>
      {result ? (
        <Card data-testid="jury">
          <CardContent className="flex flex-col gap-3">
            <p className="text-center text-4xl">{SLOTS.map((s) => result.outfit[s]?.emoji ?? '▫️').join(' ')}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {JURY.map((juror, i) => (
                <div key={juror.name} className="rounded-lg border p-3">
                  <p className="font-semibold">
                    {juror.emoji} {juror.name}: {result.scores[i]}/{MAX_JUROR_SCORE}
                  </p>
                  <p className="text-sm italic">„{jurorComment(juror.comments, result.scores[i])}”</p>
                </div>
              ))}
            </div>
            <Button onClick={nextRound}>{round === ROUNDS - 1 ? 'Podsumowanie' : 'Następny temat'}</Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl">🧍</span>
              {SLOTS.map((slot) => (
                <SlotDrop key={slot} slot={slot} item={outfit[slot]} onClear={() => setOutfit({ ...outfit, [slot]: undefined })} />
              ))}
              <Button className="w-full" onClick={judge}>
                Gotowe – do jury!
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">Przeciągnij ubranie na manekina albo kliknij, żeby założyć. Kliknij slot, żeby zdjąć.</p>
              {SLOTS.map((slot) => (
                <div key={slot} className="grid grid-cols-4 gap-1 sm:grid-cols-6">
                  {ITEMS.filter((i) => i.slot === slot).map((item) => (
                    <DraggableItem key={item.id} item={item} onPick={() => equip(item)} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </DndContext>
      )}
    </>
  )
}
