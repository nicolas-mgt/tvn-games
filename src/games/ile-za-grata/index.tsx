import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { pickN } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import listings from './data.json'
import { MAX_POINTS_PER_CAR, priceScore } from './logic'

const CARS_PER_GAME = 10
const MIN_PRICE = 1000
const MAX_PRICE = 150000

const formatZl = (value: number) => `${value.toLocaleString('pl-PL')} zł`

export default function IleZaGrataGame() {
  const [cars, setCars] = useState(() => pickN(listings, CARS_PER_GAME))
  const [index, setIndex] = useState(0)
  const [guess, setGuess] = useState(30000)
  const [scores, setScores] = useState<number[]>([])
  const revealed = scores.length > index
  const car = cars[index]
  const total = scores.reduce((sum, value) => sum + value, 0)

  function restart() {
    setCars(pickN(listings, CARS_PER_GAME))
    setIndex(0)
    setScores([])
    setGuess(30000)
  }

  if (index >= cars.length) {
    return (
      <ResultScreen
        slug="ile-za-grata"
        score={total}
        maxScore={CARS_PER_GAME * MAX_POINTS_PER_CAR}
        summary={total > 700 ? 'Handlarz z ciebie jak się patrzy!' : 'Komis by cię zjadł żywcem. Ale za to masz duszę kupca.'}
        onRestart={restart}
      />
    )
  }

  return (
    <>
      <Hud items={[['Auto', `${index + 1}/${cars.length}`], ['Punkty', total]]} />
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <span className="text-7xl">{car.emoji}</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{car.title}</h2>
              <p className="text-sm text-muted-foreground">
                {car.year} · {car.mileage.toLocaleString('pl-PL')} km · {car.fuel}
              </p>
              <p className="mt-2 italic">„{car.description}”</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Za ile poszło? {formatZl(guess)}</label>
            <Slider
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={500}
              value={[guess]}
              disabled={revealed}
              onValueChange={([value]) => setGuess(value)}
            />
            <Input
              type="number"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={guess}
              disabled={revealed}
              onChange={(e) => setGuess(Number(e.target.value))}
              aria-label="Cena w złotych"
            />
          </div>
          {revealed ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <p>
                Sprzedane za <strong>{formatZl(car.price)}</strong>. Twoja wycena: {formatZl(guess)}.
              </p>
              <p className="text-2xl font-black">+{scores[index]} pkt</p>
              <Button onClick={() => setIndex(index + 1)}>{index === cars.length - 1 ? 'Podsumowanie' : 'Następne auto'}</Button>
            </div>
          ) : (
            <Button onClick={() => setScores([...scores, priceScore(guess, car.price)])}>Wyceniam!</Button>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">Ogłoszenia i ceny są fikcyjne.</p>
    </>
  )
}
