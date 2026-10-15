import { motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { matchesAnswer } from '@/shared/answer'
import { dailyRng, pickOne, todayKey } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { loadJSON, saveJSON } from '@/shared/storage'
import dishes from './data.json'

const SLUG = 'danie-po-skladnikach'
const DAILY_KEY = 'slop-games:danie:last-daily'
const MAX_POINTS = 6

type Dish = (typeof dishes)[number]
type Mode = 'daily' | 'practice'

function dishFor(mode: Mode): Dish {
  return mode === 'daily' ? pickOne(dishes, dailyRng(SLUG)) : pickOne(dishes)
}

export default function DanieGame() {
  const dailyDone = loadJSON<string | null>(DAILY_KEY, null) === todayKey()
  const [mode, setMode] = useState<Mode>(dailyDone ? 'practice' : 'daily')
  const [dish, setDish] = useState(() => dishFor(dailyDone ? 'practice' : 'daily'))
  const [revealed, setRevealed] = useState(1)
  const [guesses, setGuesses] = useState<string[]>([])
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState<'won' | 'lost' | null>(null)

  function finish(outcome: 'won' | 'lost') {
    setResult(outcome)
    if (mode === 'daily') saveJSON(DAILY_KEY, todayKey())
  }

  function revealNext() {
    if (revealed === dish.ingredients.length) finish('lost')
    else setRevealed(revealed + 1)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!guess.trim()) return
    if (matchesAnswer(guess, [dish.name, ...dish.aliases])) {
      finish('won')
      return
    }
    setGuesses([...guesses, guess])
    setGuess('')
    revealNext()
  }

  function startPractice() {
    setMode('practice')
    setDish(dishFor('practice'))
    setRevealed(1)
    setGuesses([])
    setGuess('')
    setResult(null)
  }

  if (result) {
    const score = result === 'won' ? MAX_POINTS + 1 - revealed : 0
    const shareLine = Array.from({ length: MAX_POINTS }, (_, i) =>
      i < revealed - 1 ? '🟥' : i === revealed - 1 ? (result === 'won' ? '🟩' : '🟥') : '⬜',
    ).join('')
    return (
      <ResultScreen
        slug={SLUG}
        score={score}
        maxScore={MAX_POINTS}
        shareLine={shareLine}
        summary={
          <p>
            {result === 'won' ? 'Brawo! ' : 'Nie tym razem. '}To był: <strong>{dish.name}</strong>
            {mode === 'daily' && ' (danie dnia)'}
          </p>
        }
        onRestart={startPractice}
      />
    )
  }

  return (
    <>
      <Hud
        items={[
          ['Tryb', mode === 'daily' ? `danie dnia ${todayKey()}` : 'trening'],
          ['Do zdobycia', `${MAX_POINTS + 1 - revealed} pkt`],
        ]}
      />
      {dailyDone && mode === 'practice' && (
        <p className="text-sm text-muted-foreground">Dzisiejsze danie już za tobą – teraz trening na losowych daniach.</p>
      )}
      <Card>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-muted-foreground">Jurorzy odsłaniają składniki jeden po drugim. Co to za danie?</p>
          <div className="flex flex-col gap-2">
            {dish.ingredients.map((ingredient, i) =>
              i < revealed ? (
                <motion.div
                  key={ingredient}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-md border bg-amber-50 px-3 py-2 font-medium"
                  data-testid="ingredient"
                >
                  {i + 1}. {ingredient}
                </motion.div>
              ) : (
                <div key={ingredient} className="rounded-md border border-dashed px-3 py-2 text-muted-foreground">
                  {i + 1}. ???
                </div>
              ),
            )}
          </div>
          <form onSubmit={submit} className="flex gap-2">
            <Input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Wpisz nazwę dania…" autoFocus />
            <Button type="submit">Zgaduję</Button>
            <Button type="button" variant="outline" onClick={revealNext}>
              Kolejny składnik
            </Button>
          </form>
          {guesses.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {guesses.map((wrong, i) => (
                <Badge key={i} variant="destructive">
                  {wrong}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
