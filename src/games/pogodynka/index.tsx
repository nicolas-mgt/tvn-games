import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { addDays, todayKey } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { loadJSON, saveJSON } from '@/shared/storage'
import { CITIES, cityPoints, isSettleable, MAX_DAY_POINTS, settle, type CityId, type Prediction, type Temperatures } from './logic'

const STORAGE_KEY = 'slop-games:pogodynka:predictions'

type Weather = { current: Temperatures; dailyMax: Record<string, Temperatures> }

type OpenMeteoLocation = {
  current: { temperature_2m: number }
  daily: { time: string[]; temperature_2m_max: number[] }
}

async function fetchWeather(): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: CITIES.map((c) => c.lat).join(','),
    longitude: CITIES.map((c) => c.lng).join(','),
    daily: 'temperature_2m_max',
    current: 'temperature_2m',
    past_days: '31',
    forecast_days: '1',
    timezone: 'Europe/Warsaw',
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!response.ok) throw new Error(`Open-Meteo: ${response.status}`)
  const locations = (await response.json()) as OpenMeteoLocation[]
  const current = {} as Temperatures
  const dailyMax: Record<string, Temperatures> = {}
  CITIES.forEach((city, i) => {
    current[city.id] = locations[i].current.temperature_2m
    locations[i].daily.time.forEach((day, d) => {
      dailyMax[day] ??= {} as Temperatures
      dailyMax[day][city.id] = locations[i].daily.temperature_2m_max[d]
    })
  })
  return { current, dailyMax }
}

export default function PogodynkaGame() {
  const today = todayKey()
  const tomorrow = addDays(today, 1)
  const [predictions, setPredictions] = useState(() => loadJSON<Prediction[]>(STORAGE_KEY, []))
  const [weather, setWeather] = useState<Weather | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [justSettled, setJustSettled] = useState<Prediction | null>(null)
  const [draft, setDraft] = useState<Record<CityId, string>>({ warszawa: '', krakow: '', gdansk: '', wroclaw: '', poznan: '' })

  function save(next: Prediction[]) {
    setPredictions(next)
    saveJSON(STORAGE_KEY, next)
  }

  useEffect(() => {
    fetchWeather()
      .then((fetched) => {
        setWeather(fetched)
        const stored = loadJSON<Prediction[]>(STORAGE_KEY, [])
        const settledNow: Prediction[] = []
        const updated = stored.map((p) => {
          const actual = fetched.dailyMax[p.targetDay]
          if (!isSettleable(p, today) || !actual) return p
          const settled = settle(p, actual)
          settledNow.push(settled)
          return settled
        })
        if (settledNow.length > 0) {
          setPredictions(updated)
          saveJSON(STORAGE_KEY, updated)
          setJustSettled(settledNow[settledNow.length - 1])
        }
      })
      .catch((e: Error) => setError(e.message))
  }, [today])

  const forTomorrow = predictions.find((p) => p.targetDay === tomorrow)
  const history = predictions.filter((p) => p.points !== undefined).slice(-7).reverse()

  function submit(event: FormEvent) {
    event.preventDefault()
    const guesses = Object.fromEntries(CITIES.map((c) => [c.id, Number(draft[c.id])])) as Temperatures
    save([...predictions, { targetDay: tomorrow, guesses }])
  }

  if (justSettled) {
    return (
      <ResultScreen
        slug="pogodynka"
        score={justSettled.points!}
        maxScore={MAX_DAY_POINTS}
        summary={
          <ul className="text-sm">
            <li className="mb-1 font-semibold">Rozliczenie typów na {justSettled.targetDay}</li>
            {CITIES.map((c) => (
              <li key={c.id}>
                {c.name}: typ {justSettled.guesses[c.id]}°C, było {justSettled.actual![c.id]}°C →{' '}
                {cityPoints(justSettled.guesses[c.id], justSettled.actual![c.id])} pkt
              </li>
            ))}
          </ul>
        }
        onRestart={() => setJustSettled(null)}
      />
    )
  }

  const allFilled = CITIES.every((c) => draft[c.id].trim() !== '' && !Number.isNaN(Number(draft[c.id])))
  return (
    <>
      <Hud items={[['Dziś', today], ['Typujesz na', tomorrow], ['Rozliczone dni', history.length]]} />
      {error && <p className="text-sm text-red-600">Nie udało się pobrać pogody: {error}</p>}
      <Card>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Wytypuj jutrzejszą <strong>temperaturę maksymalną</strong>. Rozliczenie nastąpi pojutrze na podstawie danych
            Open-Meteo – wróć i sprawdź wynik. Za każde miasto do {MAX_DAY_POINTS / CITIES.length} pkt (−2 pkt za każdy stopień
            różnicy).
          </p>
          {forTomorrow ? (
            <div className="flex flex-col gap-1" data-testid="pending-prediction">
              <p className="font-semibold">Twój typ na {tomorrow} jest zapisany ✅</p>
              {CITIES.map((c) => (
                <p key={c.id}>
                  {c.name}: {forTomorrow.guesses[c.id]}°C
                </p>
              ))}
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-2 sm:grid-cols-2">
              {CITIES.map((c) => (
                <label key={c.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                  <span>
                    {c.name}
                    {weather && (
                      <span className="block text-xs text-muted-foreground">teraz: {weather.current[c.id]}°C</span>
                    )}
                  </span>
                  <Input
                    type="number"
                    step="0.5"
                    min={-40}
                    max={45}
                    className="w-24"
                    value={draft[c.id]}
                    onChange={(e) => setDraft({ ...draft, [c.id]: e.target.value })}
                    aria-label={`Maksimum ${c.name}`}
                  />
                </label>
              ))}
              <Button type="submit" disabled={!allFilled} className="sm:col-span-2">
                Zapisz typy na jutro
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      {history.length > 0 && (
        <Card>
          <CardContent>
            <h2 className="mb-2 font-semibold">Ostatnie rozliczenia</h2>
            <ul className="text-sm">
              {history.map((p) => (
                <li key={p.targetDay}>
                  {p.targetDay}: {p.points}/{MAX_DAY_POINTS} pkt
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  )
}
