import { motion, type PanInfo } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pickN, shuffle } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import headlines from './data.json'

const PER_KIND = 5
const SWIPE_THRESHOLD = 120

type Headline = (typeof headlines)[number]

function buildDeck(): Headline[] {
  const real = pickN(headlines.filter((h) => h.real), PER_KIND)
  const fake = pickN(headlines.filter((h) => !h.real), PER_KIND)
  return shuffle([...real, ...fake])
}

export default function PrawdaCzySciemaGame() {
  const [deck, setDeck] = useState(buildDeck)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const answered = answers.length > index
  const card = deck[index]
  const finished = index >= deck.length

  function answer(saysReal: boolean) {
    if (answered) return
    setAnswers([...answers, saysReal])
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') answer(true)
      if (event.key === 'ArrowLeft') answer(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) answer(true)
    else if (info.offset.x < -SWIPE_THRESHOLD) answer(false)
  }

  function restart() {
    setDeck(buildDeck())
    setIndex(0)
    setAnswers([])
  }

  const score = answers.filter((saysReal, i) => saysReal === deck[i].real).length

  if (finished) {
    const surprising = deck.find((h, i) => h.real && !answers[i]) ?? deck.find((h) => h.real)!
    return (
      <ResultScreen
        slug="prawda-czy-sciema"
        score={score}
        maxScore={deck.length}
        shareLine={deck.map((h, i) => (answers[i] === h.real ? '✅' : '❌')).join('')}
        summary={
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Najbardziej zaskakujący prawdziwy news:</p>
            <p className="font-semibold">„{surprising.headline}”</p>
          </div>
        }
        onRestart={restart}
      />
    )
  }

  const correct = answered && answers[index] === card.real
  return (
    <>
      <Hud items={[['Nagłówek', `${index + 1}/${deck.length}`], ['Trafione', score]]} />
      <p className="text-center text-sm text-muted-foreground">
        Przeciągnij w prawo = prawda, w lewo = ściema (albo strzałki ← →).
      </p>
      <div className="flex justify-center">
        <motion.div
          key={index}
          drag={answered ? false : 'x'}
          dragSnapToOrigin
          onDragEnd={onDragEnd}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: answered ? (answers[index] ? 4 : -4) : 0 }}
          whileDrag={{ rotate: 0, cursor: 'grabbing' }}
          className="w-full max-w-lg cursor-grab"
        >
          <Card className={answered ? (correct ? 'border-green-500' : 'border-red-500') : ''}>
            <CardContent className="flex min-h-48 flex-col justify-center gap-3 text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Pilne</p>
              <p className="text-2xl font-bold">{card.headline}</p>
              {answered && (
                <p className="text-sm">
                  {correct ? '✅ ' : '❌ '}
                  {card.explanation}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="flex justify-center gap-3">
        {answered ? (
          <Button onClick={() => setIndex(index + 1)}>Dalej</Button>
        ) : (
          <>
            <Button variant="destructive" onClick={() => answer(false)}>
              ← Ściema
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => answer(true)}>
              Prawda →
            </Button>
          </>
        )}
      </div>
    </>
  )
}
