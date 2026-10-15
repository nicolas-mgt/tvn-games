import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { matchesAnswer } from '@/shared/answer'
import { dailyRng, pickN, todayKey } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import words from './data.json'

const SLUG = 'to-pan-tego-nie-wie'
const WORDS_PER_GAME = 5
const ATTEMPTS = 3

type Entry = (typeof words)[number]
type Outcome = { attemptsUsed: number; solved: boolean }

const pointsFor = (outcome: Outcome) => (outcome.solved ? ATTEMPTS + 1 - outcome.attemptsUsed : 0)

export default function ToPanTegoNieWieGame() {
  const [isDaily, setIsDaily] = useState(true)
  const [entries, setEntries] = useState<Entry[]>(() => pickN(words, WORDS_PER_GAME, dailyRng(SLUG)))
  const [index, setIndex] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [guess, setGuess] = useState('')
  const [outcomes, setOutcomes] = useState<Outcome[]>([])

  const entry = entries[index]
  const done = outcomes.length > index
  const score = outcomes.reduce((sum, o) => sum + pointsFor(o), 0)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (done || !guess.trim()) return
    const used = attempts + 1
    const solved = matchesAnswer(guess, [entry.word, ...entry.aliases])
    setAttempts(used)
    setGuess('')
    if (solved || used === ATTEMPTS) setOutcomes([...outcomes, { attemptsUsed: used, solved }])
  }

  function next() {
    setIndex(index + 1)
    setAttempts(0)
  }

  function restart() {
    setIsDaily(false)
    setEntries(pickN(words, WORDS_PER_GAME))
    setIndex(0)
    setAttempts(0)
    setOutcomes([])
  }

  if (index >= entries.length) {
    return (
      <ResultScreen
        slug={SLUG}
        score={score}
        maxScore={WORDS_PER_GAME * ATTEMPTS}
        shareLine={outcomes.map((o) => (o.solved ? ['', '🥇', '🥈', '🥉'][o.attemptsUsed] : '❌')).join('')}
        summary={<p>Hasła: {entries.map((e) => e.word).join(', ')}</p>}
        onRestart={restart}
      />
    )
  }

  const hint = attempts >= 2 ? `Podpowiedź: zaczyna się na „${entry.word[0].toUpperCase()}”, ${entry.word.length} znaków` : null
  return (
    <>
      <Hud
        items={[
          ['Tryb', isDaily ? `hasła dnia ${todayKey()}` : 'trening'],
          ['Hasło', `${index + 1}/${entries.length}`],
          ['Punkty', score],
        ]}
      />
      <Card className="bg-gradient-to-b from-yellow-50 to-orange-50">
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm uppercase tracking-wide text-muted-foreground">🎙️ {entry.kid} tłumaczy:</p>
          <p className="text-center text-2xl font-semibold">„{entry.definition}”</p>
          {done ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-lg">
                {outcomes[index].solved ? `✅ Brawo! +${pointsFor(outcomes[index])} pkt` : '❌ Nie udało się.'} Hasło: <strong>{entry.word}</strong>
              </p>
              <Button onClick={next}>{index === entries.length - 1 ? 'Podsumowanie' : 'Następne hasło'}</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="O czym mowa?" autoFocus />
                <Button type="submit">Zgaduję</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Próba {attempts + 1}/{ATTEMPTS}
                {attempts > 0 && ' – jeszcze raz!'} {hint}
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </>
  )
}
