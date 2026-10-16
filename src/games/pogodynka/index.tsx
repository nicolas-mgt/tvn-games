import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { addDays, todayKey } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { loadJSON, saveJSON } from '@/shared/storage'
import {
  CITIES,
  cityPoints,
  countdownTo,
  formatTemp,
  isSettleable,
  MAX_DAY_POINTS,
  PREDICTIONS_KEY,
  PRESENTER_LINES,
  presenterMood,
  settle,
  startValues,
  WARMUP_KEY,
  weatherKind,
  type CityId,
  type Prediction,
  type PresenterMood,
  type Temperatures,
  type Warmup,
} from './logic'
import { Presenter } from './Presenter'
import { play, sfx } from './sfx'
import { Backdrop, type BackdropMood } from './Studio'
import { SettleBars, Thermometers } from './Thermometers'
import { fetchWeather, type Weather } from './weather'
import { WeatherMap } from './WeatherMap'

type Phase = 'lobby' | 'forecast' | 'warmup' | 'waiting' | 'settle' | 'result'
/** A finished round shown with bars: the real settlement or today's warm-up. */
type Round = {
  kind: 'settle' | 'warmup'
  day: string
  guesses: Temperatures
  actual: Temperatures
  points: number
}

const WEATHER_COLORS = ['#ffd34d', '#6ab0ff', '#f4f6fa', '#e8504a', '#3a9a5a']

function shortDay(day: string) {
  const [, month, date] = day.split('-')
  return `${date}.${month}`
}

function formatCountdown(ms: number) {
  const total = Math.floor(ms / 1000)
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
  return parts.map((n) => String(n).padStart(2, '0')).join(':')
}

function shareEmoji(points: number) {
  if (points === 10) return '🎯'
  if (points >= 6) return '🌤️'
  return points > 0 ? '🌧️' : '⛈️'
}

export default function PogodynkaGame() {
  const today = todayKey()
  const tomorrow = addDays(today, 1)
  const yesterday = addDays(today, -1)
  const [predictions, setPredictions] = useState(() => loadJSON<Prediction[]>(PREDICTIONS_KEY, []))
  const [warmup, setWarmup] = useState(() => loadJSON<Warmup | null>(WARMUP_KEY, null))
  const [weather, setWeather] = useState<Weather | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('lobby')
  const [draft, setDraft] = useState<Temperatures | null>(null)
  const [active, setActive] = useState<CityId | null>(null)
  const [round, setRound] = useState<Round | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  useEffect(() => {
    fetchWeather()
      .then(setWeather)
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    if (phase !== 'waiting') return
    const refresh = () => setNow(new Date())
    const first = setTimeout(refresh, 0)
    const timer = setInterval(refresh, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [phase])

  const forTomorrow = predictions.find((p) => p.targetDay === tomorrow)
  const toSettle = weather ? predictions.find((p) => isSettleable(p, today) && weather.dailyMax[p.targetDay]) : undefined
  const warmupDone = warmup?.day === today
  const lobbyState = toSettle ? 'settle' : forTomorrow ? 'saved' : error ? 'error' : weather ? 'none' : 'loading'

  function savePredictions(next: Prediction[]) {
    setPredictions(next)
    saveJSON(PREDICTIONS_KEY, next)
  }

  function enterForecast(nextPhase: 'forecast' | 'warmup') {
    sfx.unlock()
    setDraft(startValues(weather!.current))
    setActive(null)
    setPhase(nextPhase)
    play('jingle')
    const codes = Object.values(weather!.dailyCode[nextPhase === 'forecast' ? tomorrow : yesterday] ?? {})
    setTimeout(() => play(codes.some((c) => weatherKind(c) === 'rain') ? 'rain' : 'wind'), 900 * pace)
  }

  function showRound(next: Round) {
    setRound(next)
    setRevealed(false)
    setPhase('settle')
    play('jingle')
    CITIES.forEach((_, i) => setTimeout(() => play('rise'), (0.3 + i * 0.6) * pace * 1000))
    setTimeout(
      () => {
        setRevealed(true)
        play(next.points >= 25 ? 'good' : 'bad')
        if (next.points >= 40)
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
            colors: WEATHER_COLORS,
            disableForReducedMotion: true,
          })
      },
      (0.3 + CITIES.length * 0.6 + 0.4) * pace * 1000,
    )
  }

  function start() {
    sfx.unlock()
    if (toSettle) {
      const settled = settle(toSettle, weather!.dailyMax[toSettle.targetDay])
      savePredictions(predictions.map((p) => (p === toSettle ? settled : p)))
      showRound({
        kind: 'settle',
        day: settled.targetDay,
        guesses: settled.guesses,
        actual: settled.actual!,
        points: settled.points!,
      })
      return
    }
    if (forTomorrow) {
      setPhase('waiting')
      play('tick')
      return
    }
    enterForecast('forecast')
  }

  function submit() {
    play('click')
    if (phase === 'forecast') {
      savePredictions([...predictions, { targetDay: tomorrow, guesses: draft! }])
      setPhase('waiting')
      ;[0, 1, 2].forEach((i) => setTimeout(() => play('tick'), i * 300 * pace))
      return
    }
    const actual = weather!.dailyMax[yesterday]
    const points = settle({ targetDay: yesterday, guesses: draft! }, actual).points!
    const done = { day: today, points }
    setWarmup(done)
    saveJSON(WARMUP_KEY, done)
    showRound({
      kind: 'warmup',
      day: yesterday,
      guesses: draft!,
      actual,
      points,
    })
  }

  function backToLobby() {
    play('click')
    setPhase('lobby')
    setRound(null)
  }

  function backdropMood(): BackdropMood {
    if (phase === 'lobby') return 'idle'
    if (phase === 'warmup') return 'forecast'
    return phase
  }

  function currentMood(): PresenterMood {
    if (phase === 'forecast' || phase === 'warmup') return 'pointing'
    if (phase === 'waiting') return 'waiting'
    if (phase === 'settle') return revealed ? presenterMood(round!.points) : 'pointing'
    if (phase === 'result') return presenterMood(round!.points)
    return 'neutral'
  }

  function modeLabel() {
    if (phase === 'warmup' || round?.kind === 'warmup') return `Rozgrzewka: ${shortDay(yesterday)}`
    if (phase === 'settle') return `Rozliczenie ${shortDay(round!.day)}`
    return `Prognoza na ${shortDay(tomorrow)}`
  }

  function mapState(): {
    codes: Record<CityId, number> | null
    bubbles: Record<CityId, string> | null
  } {
    const codesFor = (day: string) => weather?.dailyCode[day] ?? null
    const bubblesOf = (values: Temperatures, format: (id: CityId) => string = (id) => formatTemp(values[id])) => Object.fromEntries(CITIES.map((c) => [c.id, format(c.id)])) as Record<CityId, string>
    if (phase === 'forecast') return { codes: codesFor(tomorrow), bubbles: bubblesOf(draft!) }
    if (phase === 'warmup') return { codes: codesFor(yesterday), bubbles: bubblesOf(draft!) }
    if (phase === 'waiting')
      return {
        codes: codesFor(tomorrow),
        bubbles: bubblesOf(forTomorrow!.guesses),
      }
    if (phase === 'settle')
      return {
        codes: codesFor(round!.day),
        bubbles: revealed ? bubblesOf(round!.actual, (id) => `+${cityPoints(round!.guesses[id], round!.actual[id])}`) : bubblesOf(round!.guesses),
      }
    return { codes: codesFor(tomorrow), bubbles: null }
  }

  const mood = currentMood()

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop mood={backdropMood()} />
      <MuteButton sfx={sfx} />

      <div className="pg-game">
        {phase === 'lobby' && (
          <motion.div className="pg-lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="pg-lobby-head">
              <Presenter mood={mood} line={PRESENTER_LINES.neutral} />
              <div className="pg-lobby-text">
                <p className="pg-hand text-3xl text-[#ffd34d]">Studio pogody · na żywo</p>
                <h2 className="font-display text-6xl tracking-wider text-white sm:text-7xl">Pogodynka</h2>
                <p>
                  Wytypuj termometrami jutrzejszą temperaturę maksymalną w pięciu miastach. Rozliczymy cię po zakończeniu jutrzejszego dnia prawdziwymi danymi: za miasto do{' '}
                  {MAX_DAY_POINTS / CITIES.length} pkt, minus 2 za każdy stopień różnicy. Na rozgrzewkę zgadnij, jak było wczoraj – wynik od razu.
                </p>
              </div>
            </div>
            <p className="pg-status" data-testid="lobby-status" data-state={lobbyState}>
              {
                {
                  settle: toSettle && `Twój typ na ${shortDay(toSettle.targetDay)} czeka na rozliczenie!`,
                  saved: `Typ na ${shortDay(tomorrow)} zapisany. Rozliczenie po jego zakończeniu.`,
                  none: 'Brak typu na jutro – synoptycy czekają.',
                  error: `Nie udało się pobrać pogody: ${error}`,
                  loading: 'Łączymy się z satelitą…',
                }[lobbyState]
              }
            </p>
            <div className="pg-lobby-actions">
              <button type="button" className="pg-start pg-sign" onClick={start} disabled={lobbyState === 'loading' || lobbyState === 'error'} data-testid="start">
                {toSettle ? `Rozlicz typ z ${shortDay(toSettle.targetDay)}` : forTomorrow ? 'Zobacz swój typ' : 'Typuj pogodę na jutro'}
              </button>
              {warmupDone ? (
                <p className="pg-warmup-done" data-testid="warmup-done">
                  Dzisiejsza rozgrzewka: {warmup.points}/{MAX_DAY_POINTS} pkt
                </p>
              ) : (
                <button type="button" className="pg-secondary pg-sign" onClick={() => enterForecast('warmup')} disabled={!weather?.dailyMax[yesterday]} data-testid="warmup">
                  Rozgrzewka: jak było wczoraj?
                </button>
              )}
            </div>
          </motion.div>
        )}

        {phase !== 'lobby' && phase !== 'result' && (
          <>
            <header className="pg-bar">
              <strong className="pg-bar-title pg-sign" data-testid="mode">
                {modeLabel()}
              </strong>
              {phase === 'settle' && revealed && (
                <span className="pg-stat" data-testid="score" data-value={round!.points}>
                  Wynik{' '}
                  <b>
                    {round!.points}/{MAX_DAY_POINTS}
                  </b>
                </span>
              )}
            </header>
            <div className="pg-stage">
              <WeatherMap {...mapState()} active={active} />
              <Presenter mood={mood} line={phase === 'settle' && !revealed ? 'Sprawdzamy, ile było naprawdę…' : PRESENTER_LINES[mood]} />
            </div>

            {(phase === 'forecast' || phase === 'warmup') && (
              <div className="pg-panel">
                <p className="pg-panel-title">{phase === 'forecast' ? 'Ile stopni będzie jutro w najcieplejszym momencie dnia?' : 'Ile stopni było wczoraj w najcieplejszym momencie dnia?'}</p>
                <Thermometers values={draft!} onChange={(id, value) => setDraft({ ...draft!, [id]: value })} onFocusCity={setActive} />
                <button type="button" className="pg-start pg-sign" onClick={submit} data-testid="submit">
                  {phase === 'forecast' ? 'Zapisz prognozę' : 'Sprawdzam'}
                </button>
              </div>
            )}

            {phase === 'waiting' && (
              <div className="pg-panel" data-testid="pending-prediction">
                <p className="pg-panel-title">Twój typ na {shortDay(tomorrow)} jest zapisany</p>
                <ul className="pg-guesses">
                  {CITIES.map((c) => (
                    <li key={c.id}>
                      {c.name} <b className="pg-sign">{formatTemp(forTomorrow!.guesses[c.id])}</b>
                    </li>
                  ))}
                </ul>
                <p className="pg-countdown">
                  Rozliczenie możliwe za{' '}
                  <b className="pg-sign" data-testid="countdown">
                    {formatCountdown(countdownTo(tomorrow, now))}
                  </b>
                </p>
                <button type="button" className="pg-secondary pg-sign" onClick={backToLobby} data-testid="back">
                  Wróć do studia
                </button>
              </div>
            )}

            {phase === 'settle' && round && (
              <div className="pg-panel">
                <SettleBars guesses={round.guesses} actual={round.actual} pace={pace} />
                {revealed && (
                  <motion.button
                    type="button"
                    className="pg-start pg-sign"
                    onClick={round.kind === 'settle' ? () => setPhase('result') : backToLobby}
                    data-testid="settle-next"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {round.kind === 'settle' ? 'Podsumowanie' : 'Wróć do studia'}
                  </motion.button>
                )}
              </div>
            )}
          </>
        )}

        {phase === 'result' && round && (
          <ResultScreen
            slug="pogodynka"
            score={round.points}
            maxScore={MAX_DAY_POINTS}
            shareLine={CITIES.map((c) => shareEmoji(cityPoints(round.guesses[c.id], round.actual[c.id]))).join('')}
            summary={
              <ul className="text-sm">
                <li className="mb-1 font-semibold">Rozliczenie typów na {shortDay(round.day)}</li>
                {CITIES.map((c) => (
                  <li key={c.id}>
                    {c.name}: typ {formatTemp(round.guesses[c.id])}, było {formatTemp(round.actual[c.id])} → {cityPoints(round.guesses[c.id], round.actual[c.id])} pkt
                  </li>
                ))}
              </ul>
            }
            onRestart={backToLobby}
          >
            <Presenter mood={mood} line={PRESENTER_LINES[mood]} />
          </ResultScreen>
        )}

        <p className="pg-footer text-center text-[11px]">Dane: Open-Meteo (CC BY 4.0) · Mapa: Natural Earth (domena publiczna) · Dźwięki: Kenney (CC0) · Prezenterka jest fikcyjna</p>
      </div>
    </MotionConfig>
  )
}
