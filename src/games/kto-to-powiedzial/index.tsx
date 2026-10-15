import { motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pickN } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import data from './data.json'

const QUOTES_PER_GAME = 10
const sourceById = Object.fromEntries(data.sources.map((s) => [s.id, s]))

export default function KtoToPowiedzialGame() {
  const [quotes, setQuotes] = useState(() => pickN(data.quotes, QUOTES_PER_GAME))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const quote = quotes[index]
  const answered = answers.length > index
  const score = answers.filter((answer, i) => answer === quotes[i].source).length

  function restart() {
    setQuotes(pickN(data.quotes, QUOTES_PER_GAME))
    setIndex(0)
    setAnswers([])
  }

  if (index >= quotes.length) {
    return (
      <ResultScreen
        slug="kto-to-powiedzial"
        score={score}
        maxScore={quotes.length}
        shareLine={quotes.map((q, i) => (answers[i] === q.source ? sourceById[q.source].emoji : '❌')).join('')}
        summary={score >= 8 ? 'Masz ucho do bełkotu jak mało kto.' : 'Granica między kanapą, telewizorem i generatorem jest cieńsza, niż myślisz.'}
        onRestart={restart}
      />
    )
  }

  return (
    <>
      <Hud items={[['Cytat', `${index + 1}/${quotes.length}`], ['Trafione', score]]} />
      <Card>
        <CardContent className="flex flex-col gap-5">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-2xl font-semibold italic"
          >
            „{quote.text}”
          </motion.blockquote>
          <div className="grid gap-2 sm:grid-cols-3">
            {data.sources.map((source) => {
              const isCorrect = source.id === quote.source
              const tone = !answered ? '' : isCorrect ? 'border-green-500 bg-green-50' : answers[index] === source.id ? 'border-red-500 bg-red-50' : 'opacity-50'
              return (
                <Button
                  key={source.id}
                  variant="outline"
                  className={`h-auto flex-col py-3 whitespace-normal ${tone}`}
                  disabled={answered}
                  data-correct={isCorrect}
                  onClick={() => setAnswers([...answers, source.id])}
                >
                  <span className="text-3xl">{source.emoji}</span>
                  {source.label}
                </Button>
              )
            })}
          </div>
          {answered && (
            <Button className="self-center" onClick={() => setIndex(index + 1)}>
              {index === quotes.length - 1 ? 'Podsumowanie' : 'Następny cytat'}
            </Button>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">Wszystkie cytaty są fikcyjne i nie zostały wypowiedziane przez prawdziwe osoby.</p>
    </>
  )
}
