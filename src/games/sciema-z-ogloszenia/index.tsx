import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { shuffle } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { useCountdown } from '@/shared/useCountdown'
import listings from './data.json'

const SECONDS_PER_AD = 45
const POINTS_PER_FLAG = 2
const FALSE_ALARM_PENALTY = 1

export default function SciemaGame() {
  const [ads, setAds] = useState(() => shuffle(listings))
  const [index, setIndex] = useState(0)
  const [clicked, setClicked] = useState<Set<number>>(new Set())
  const [reviewing, setReviewing] = useState(false)
  const [score, setScore] = useState(0)
  const [totalFound, setTotalFound] = useState(0)

  const ad = ads[index]
  const finished = index >= ads.length
  const timer = useCountdown(SECONDS_PER_AD, !finished && !reviewing, () => setReviewing(true))

  const flagCount = ad ? ad.segments.filter((s) => s.flag).length : 0
  const foundCount = ad ? ad.segments.filter((s, i) => s.flag && clicked.has(i)).length : 0

  function clickSegment(i: number) {
    if (reviewing || clicked.has(i)) return
    const nextClicked = new Set(clicked).add(i)
    setClicked(nextClicked)
    if (ad.segments[i].flag) {
      setScore(score + POINTS_PER_FLAG)
      setTotalFound(totalFound + 1)
      if (foundCount + 1 === flagCount) setReviewing(true)
    } else {
      setScore(score - FALSE_ALARM_PENALTY)
    }
  }

  function nextAd() {
    setIndex(index + 1)
    setClicked(new Set())
    setReviewing(false)
    timer.setRemaining(SECONDS_PER_AD)
  }

  function restart() {
    setAds(shuffle(listings))
    setScore(0)
    setTotalFound(0)
    setIndex(0)
    setClicked(new Set())
    setReviewing(false)
    timer.setRemaining(SECONDS_PER_AD)
  }

  if (finished) {
    const allFlags = listings.reduce((sum, l) => sum + l.segments.filter((s) => s.flag).length, 0)
    return (
      <ResultScreen
        slug="sciema-z-ogloszenia"
        score={Math.max(0, score)}
        maxScore={allFlags * POINTS_PER_FLAG}
        summary={`Wyłapane czerwone flagi: ${totalFound}/${allFlags}. ${totalFound === allFlags ? 'Żaden handlarz cię nie oszuka.' : 'Kilka ściem się prześlizgnęło.'}`}
        onRestart={restart}
      />
    )
  }

  return (
    <>
      <Hud
        items={[
          ['Ogłoszenie', `${index + 1}/${ads.length}`],
          ['Flagi', `${foundCount}/${flagCount}`],
          ['Punkty', score],
          ['Czas', `${Math.ceil(timer.remaining)} s`],
        ]}
      />
      <Progress value={(timer.remaining / SECONDS_PER_AD) * 100} />
      <Card>
        <CardContent className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">🚘 {ad.title}</h2>
          <p className="text-sm text-muted-foreground">
            Kliknij zdania, które wyglądają na ściemę. Fałszywy alarm: −{FALSE_ALARM_PENALTY} pkt.
          </p>
          <div className="flex flex-col gap-1">
            {ad.segments.map((segment, i) => {
              const isClicked = clicked.has(i)
              const tone =
                isClicked && segment.flag
                  ? 'bg-red-100 border-red-400'
                  : isClicked
                    ? 'bg-muted line-through opacity-60'
                    : reviewing && segment.flag
                      ? 'bg-amber-100 border-amber-400'
                      : 'hover:bg-muted'
              return (
                <button
                  key={i}
                  data-testid="ad-segment"
                  data-flag={Boolean(segment.flag)}
                  onClick={() => clickSegment(i)}
                  className={`rounded-md border border-transparent px-2 py-1 text-left ${tone}`}
                >
                  {segment.text}
                  {(isClicked || reviewing) && segment.flag && (
                    <span className="mt-1 block text-sm text-red-700">🚩 {segment.flag}</span>
                  )}
                </button>
              )
            })}
          </div>
          {reviewing ? (
            <Button className="self-center" onClick={nextAd}>
              {index === ads.length - 1 ? 'Podsumowanie' : 'Następne ogłoszenie'}
            </Button>
          ) : (
            <Button variant="outline" className="self-center" onClick={() => setReviewing(true)}>
              Gotowe, nic więcej nie widzę
            </Button>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">Ogłoszenia są fikcyjne.</p>
    </>
  )
}
