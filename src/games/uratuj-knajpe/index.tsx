import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ResultScreen } from '@/shared/GameShell'
import story from './data.json'

type StatKey = 'jakosc' | 'atmosfera' | 'kasa'
type Stats = Record<StatKey, number>
type Choice = { text: string; effects?: Partial<Stats>; reaction?: string; ending?: string }

const START_STATS: Stats = { jakosc: 3, atmosfera: 3, kasa: 3 }
const MAX_STAT = 10
const STAT_LABELS: [StatKey, string][] = [
  ['jakosc', '🍲 Jakość'],
  ['atmosfera', '😊 Atmosfera'],
  ['kasa', '💰 Kasa'],
]

function applyEffects(stats: Stats, effects: Partial<Stats> = {}): Stats {
  const next = { ...stats }
  for (const [key] of STAT_LABELS) next[key] = Math.min(MAX_STAT, Math.max(0, next[key] + (effects[key] ?? 0)))
  return next
}

export default function UratujKnajpeGame() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [stats, setStats] = useState(START_STATS)
  const [picked, setPicked] = useState<Choice | null>(null)

  function restart() {
    setSceneIndex(0)
    setStats(START_STATS)
    setPicked(null)
  }

  if (picked?.ending) {
    return (
      <ResultScreen slug="uratuj-knajpe" score={0} summary={<p>🍝 {picked.ending}</p>} shareLine="🍝🙈" onRestart={restart}>
        <p className="font-semibold">Zakończenie: Kluski na głowę</p>
      </ResultScreen>
    )
  }

  if (sceneIndex >= story.scenes.length) {
    const score = stats.jakosc + stats.atmosfera + stats.kasa
    const ending = story.endings.find((e) => score >= e.min)!
    return (
      <ResultScreen
        slug="uratuj-knajpe"
        score={score}
        summary={
          <>
            <p className="font-semibold">Powrót po miesiącu: {ending.title}</p>
            <p>{ending.text}</p>
          </>
        }
        shareLine={STAT_LABELS.map(([key, label]) => `${label.split(' ')[0]}${stats[key]}`).join(' ')}
        onRestart={restart}
      />
    )
  }

  const scene = story.scenes[sceneIndex]
  return (
    <>
      <div className="grid grid-cols-3 gap-3" data-testid="hud">
        {STAT_LABELS.map(([key, label]) => (
          <div key={key} className="flex flex-col gap-1 text-sm">
            <span>
              {label}: <strong>{stats[key]}</strong>
            </span>
            <Progress value={(stats[key] / MAX_STAT) * 100} />
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4">
          {sceneIndex === 0 && !picked && <p className="text-muted-foreground">{story.intro}</p>}
          <div>
            <p className="text-sm text-muted-foreground">
              Dzień {sceneIndex + 1}/{story.scenes.length}
            </p>
            <h2 className="text-xl font-bold">{scene.title}</h2>
            <p>{scene.text}</p>
          </div>
          {picked ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="italic">„{picked.reaction}”</p>
              <Button onClick={() => { setPicked(null); setSceneIndex(sceneIndex + 1) }}>
                {sceneIndex === story.scenes.length - 1 ? 'Wracamy po miesiącu…' : 'Następny dzień'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {scene.choices.map((choice: Choice) => (
                <Button
                  key={choice.text}
                  variant="outline"
                  className="h-auto justify-start py-3 text-left whitespace-normal"
                  data-testid="choice"
                  onClick={() => {
                    setStats(applyEffects(stats, choice.effects))
                    setPicked(choice)
                  }}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
