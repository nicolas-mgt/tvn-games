export const CITIES = [
  { id: 'warszawa', name: 'Warszawa', lat: 52.23, lng: 21.01 },
  { id: 'krakow', name: 'Kraków', lat: 50.06, lng: 19.94 },
  { id: 'gdansk', name: 'Gdańsk', lat: 54.35, lng: 18.65 },
  { id: 'wroclaw', name: 'Wrocław', lat: 51.11, lng: 17.03 },
  { id: 'poznan', name: 'Poznań', lat: 52.41, lng: 16.93 },
] as const

export type CityId = (typeof CITIES)[number]['id']
export type Temperatures = Record<CityId, number>

export type Prediction = {
  targetDay: string
  guesses: Temperatures
  actual?: Temperatures
  points?: number
}

export const MAX_CITY_POINTS = 10
export const MAX_DAY_POINTS = MAX_CITY_POINTS * CITIES.length

/** 10 points for a perfect guess, minus 2 points per degree of error. */
export function cityPoints(guess: number, actual: number): number {
  return Math.max(0, MAX_CITY_POINTS - Math.round(Math.abs(guess - actual) * 2))
}

export function isSettleable(prediction: Prediction, today: string): boolean {
  return prediction.actual === undefined && prediction.targetDay < today
}

export function settle(prediction: Prediction, actual: Temperatures): Prediction {
  const points = CITIES.reduce((sum, city) => sum + cityPoints(prediction.guesses[city.id], actual[city.id]), 0)
  return { ...prediction, actual, points }
}

export const MIN_TEMP = -20
export const MAX_TEMP = 40

export function formatTemp(value: number) {
  return `${String(value).replace('.', ',')}°`
}

/** Starting slider value: the current temperature rounded to half a degree. */
export function startValues(current: Temperatures): Temperatures {
  return Object.fromEntries(CITIES.map((c) => [c.id, Math.round(current[c.id] * 2) / 2])) as Temperatures
}

export const PREDICTIONS_KEY = 'tvn-games:pogodynka:predictions'
export const WARMUP_KEY = 'tvn-games:pogodynka:warmup'
export type Warmup = { day: string; points: number }

/** Milliseconds until local midnight after `targetDay`, when its maximum can be settled. */
export function countdownTo(targetDay: string, now: Date): number {
  const [y, m, d] = targetDay.split('-').map(Number)
  return Math.max(0, new Date(y, m - 1, d + 1).getTime() - now.getTime())
}

export type WeatherKind = 'sun' | 'partly' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm'

/** Maps a WMO weather code from Open-Meteo to an icon. */
export function weatherKind(code: number): WeatherKind {
  if (code <= 1) return 'sun'
  if (code === 2) return 'partly'
  if (code === 45 || code === 48) return 'fog'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloud'
}

export type PresenterMood = 'neutral' | 'pointing' | 'waiting' | 'delighted' | 'pleased' | 'unsure' | 'oops'

export function presenterMood(points: number | null): PresenterMood {
  if (points === null) return 'neutral'
  if (points >= 40) return 'delighted'
  if (points >= 25) return 'pleased'
  if (points >= 10) return 'unsure'
  return 'oops'
}

export const PRESENTER_LINES: Record<PresenterMood, string> = {
  neutral: 'Dzień dobry, zapraszam na prognozę. Dziś to ty jesteś synoptykiem.',
  pointing: 'Przesuwamy termometry. Na mapie widać, czego spodziewają się synoptycy.',
  waiting: 'Typ zapisany. Rozliczymy go, gdy jutrzejszy dzień się skończy.',
  delighted: 'Prognoza jak z instytutu! Synoptycy mogą się uczyć.',
  pleased: 'Bardzo przyzwoicie, większość stopni się zgadza.',
  unsure: 'Hm, tym razem pogoda trochę cię zaskoczyła.',
  oops: 'Cóż, aura miała inne plany. Jutro kolejna szansa!',
}

export const MAP_W = 580
export const MAP_H = 570
const SCALE = 88
const LNG_COS = Math.cos((52 * Math.PI) / 180)

/** Equirectangular projection of Poland into the map viewBox (same formula as poland.json). */
export function project(lat: number, lng: number): { x: number; y: number } {
  return { x: (lng - 13.8) * LNG_COS * SCALE, y: (55.2 - lat) * SCALE }
}
