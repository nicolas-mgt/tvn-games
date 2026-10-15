import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { shuffle } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import gadgets from './data.json'

type Gadget = (typeof gadgets)[number]
type Question = Gadget & { options: string[] }

function buildQuestions(): Question[] {
  return shuffle(gadgets).map((gadget) => ({ ...gadget, options: shuffle([gadget.answer, ...gadget.decoys]) }))
}

export default function UstrojstwoGame() {
  const [questions, setQuestions] = useState(buildQuestions)
  const [index, setIndex] = useState(0)
  const [opened, setOpened] = useState(false)
  const [chosen, setChosen] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const streak = index + (chosen === question?.answer ? 1 : 0)

  function next() {
    if (chosen !== question.answer || index === questions.length - 1) {
      setFinished(true)
      return
    }
    setIndex(index + 1)
    setOpened(false)
    setChosen(null)
  }

  function restart() {
    setQuestions(buildQuestions())
    setIndex(0)
    setOpened(false)
    setChosen(null)
    setFinished(false)
  }

  if (finished) {
    const perfect = streak === questions.length
    return (
      <ResultScreen
        slug="ustrojstwo"
        score={streak}
        maxScore={questions.length}
        summary={
          perfect
            ? 'Wszystkie paczki rozpoznane! Kurier wręcza ci order.'
            : `Seria skończyła się na: ${question.emoji} ${question.look}`
        }
        onRestart={restart}
      />
    )
  }

  return (
    <>
      <Hud items={[['Seria', streak], ['Paczka', `${index + 1}/${questions.length}`]]} />
      <Card>
        <CardContent className="flex flex-col items-center gap-5">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.button
                key="box"
                data-testid="open-box"
                onClick={() => setOpened(true)}
                className="flex flex-col items-center gap-2"
                whileHover={{ rotate: [0, -6, 6, 0] }}
                exit={{ scale: 1.4, opacity: 0 }}
              >
                <span className="text-8xl">📦</span>
                <span className="text-sm text-muted-foreground">Kliknij, żeby otworzyć paczkę</span>
              </motion.button>
            ) : (
              <motion.div
                key={`gadget-${index}`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="text-8xl">{question.emoji}</span>
                <p className="max-w-md text-lg">{question.look}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {opened && (
            <div className="grid w-full gap-2 sm:grid-cols-2">
              {question.options.map((option) => {
                const isAnswer = option === question.answer
                const state = chosen === null ? '' : isAnswer ? 'border-green-500 bg-green-50' : option === chosen ? 'border-red-500 bg-red-50' : 'opacity-60'
                return (
                  <Button
                    key={option}
                    variant="outline"
                    className={`h-auto whitespace-normal py-3 ${state}`}
                    disabled={chosen !== null}
                    data-correct={isAnswer}
                    onClick={() => setChosen(option)}
                  >
                    {option}
                  </Button>
                )
              })}
            </div>
          )}
          {chosen && (
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="font-semibold">{chosen === question.answer ? '✅ Zgadza się!' : '❌ Pudło!'}</p>
              <p className="max-w-md text-sm text-muted-foreground">{question.fact}</p>
              <Button onClick={next}>{chosen === question.answer ? 'Następna paczka' : 'Zobacz wynik'}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
