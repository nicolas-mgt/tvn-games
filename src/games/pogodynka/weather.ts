import { CITIES, type CityId, type Temperatures } from './logic'

export type Weather = {
  current: Temperatures
  dailyMax: Record<string, Temperatures>
  dailyCode: Record<string, Record<CityId, number>>
}

type OpenMeteoLocation = {
  current: { temperature_2m: number }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    weather_code: number[]
  }
}

export async function fetchWeather(): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: CITIES.map((c) => c.lat).join(','),
    longitude: CITIES.map((c) => c.lng).join(','),
    daily: 'temperature_2m_max,weather_code',
    current: 'temperature_2m',
    past_days: '31',
    forecast_days: '2',
    timezone: 'Europe/Warsaw',
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!response.ok) throw new Error(`Open-Meteo: ${response.status}`)
  const locations = (await response.json()) as OpenMeteoLocation[]
  const current = {} as Temperatures
  const dailyMax: Weather['dailyMax'] = {}
  const dailyCode: Weather['dailyCode'] = {}
  CITIES.forEach((city, i) => {
    current[city.id] = locations[i].current.temperature_2m
    locations[i].daily.time.forEach((day, d) => {
      dailyMax[day] ??= {} as Temperatures
      dailyMax[day][city.id] = locations[i].daily.temperature_2m_max[d]
      dailyCode[day] ??= {} as Record<CityId, number>
      dailyCode[day][city.id] = locations[i].daily.weather_code[d]
    })
  })
  return { current, dailyMax, dailyCode }
}
