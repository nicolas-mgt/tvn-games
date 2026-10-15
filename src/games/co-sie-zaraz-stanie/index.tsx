import { motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pickN, shuffle } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import scenes from './data.json'

const SCENES_PER_GAME = 6

type Scene = (typeof scenes)[number]

function dealScenes(): Scene[] {
  return pickN(scenes, SCENES_PER_GAME).map((scene) => {
    const options = shuffle(scene.options)
    return { ...scene, options, answer: options.indexOf(scene.options[scene.answer]) }
  })
}

const BACKGROUNDS: Record<string, string> = {
  city: 'bg-slate-300',
  parking: 'bg-zinc-300',
  country: 'bg-green-300',
}

function SceneView({ scene, playing }: { scene: Scene; playing: boolean }) {
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl ${BACKGROUNDS[scene.background]}`}>
      <div className="absolute inset-x-0 top-[45%] h-[30%] bg-neutral-600">
        <div className="absolute inset-x-0 top-1/2 border-t-4 border-dashed border-white/80" />
      </div>
      {scene.actors.map((actor, i) => (
        <motion.span
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-5xl"
          initial={{ left: `${actor.x}%`, top: `${actor.y}%` }}
          animate={playing ? { left: `${actor.toX}%`, top: `${actor.toY}%` } : { left: `${actor.x}%`, top: `${actor.y}%` }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          {actor.emoji}
        </motion.span>
      ))}
      {!playing && (
        <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">⏸ PAUZA</div>
      )}
    </div>
  )
}

export default function CoSieZarazStanieGame() {
  const [deck, setDeck] = useState(dealScenes)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const scene = deck[index]
  const answered = answers.length > index
  const score = answers.filter((answer, i) => answer === deck[i].answer).length

  function restart() {
    setDeck(dealScenes())
    setIndex(0)
    setAnswers([])
  }

  if (index >= deck.length) {
    return (
      <ResultScreen
        slug="co-sie-zaraz-stanie"
        score={score}
        maxScore={deck.length}
        shareLine={deck.map((s, i) => (answers[i] === s.answer ? '🟢' : '🔴')).join('')}
        summary={score >= 5 ? 'Przewidujesz jak doświadczony instruktor jazdy.' : 'Na drodze dzieje się więcej, niż się wydaje. Zwolnij!'}
        onRestart={restart}
      />
    )
  }

  return (
    <>
      <Hud items={[['Nagranie', `${index + 1}/${deck.length}`], ['Trafione', score]]} />
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold">{scene.title}</h2>
            <p className="text-muted-foreground">{scene.setup}</p>
          </div>
          <SceneView key={index} scene={scene} playing={answered} />
          <div className="grid gap-2 sm:grid-cols-2">
            {scene.options.map((option, i) => {
              const tone = !answered ? '' : i === scene.answer ? 'border-green-500 bg-green-50' : i === answers[index] ? 'border-red-500 bg-red-50' : 'opacity-50'
              return (
                <Button
                  key={option}
                  variant="outline"
                  className={`h-auto py-3 whitespace-normal ${tone}`}
                  disabled={answered}
                  data-correct={i === scene.answer}
                  onClick={() => setAnswers([...answers, i])}
                >
                  {option}
                </Button>
              )
            })}
          </div>
          {answered && (
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm">🧑‍🏫 Ekspert: {scene.comment}</p>
              <Button onClick={() => setIndex(index + 1)}>{index === deck.length - 1 ? 'Podsumowanie' : 'Następne nagranie'}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
