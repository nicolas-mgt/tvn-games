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
