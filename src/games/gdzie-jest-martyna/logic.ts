export const MAX_ROUND_SCORE = 5000

const EARTH_RADIUS_KM = 6371

export type LatLng = { lat: number; lng: number }

export function distanceKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

/** Full points at the exact spot, about half at 1400 km, near zero beyond 10 000 km. */
export function roundScore(km: number): number {
  return Math.round(MAX_ROUND_SCORE * Math.exp(-km / 2000))
}

export const ROUNDS = 5
export const MAX_SCORE = ROUNDS * MAX_ROUND_SCORE
export const CLOSE_KM = 500
const NEAR_KM = 2500

/** Equirectangular projection onto the map viewBox `0 0 3600 1400`, cropped to latitudes 80°N–60°S. */
export const MAP_WIDTH = 3600
export const MAP_HEIGHT = 1400
const MAP_SCALE = 10
const MAP_TOP_LAT = 80

export function project({ lat, lng }: LatLng): { x: number; y: number } {
  return { x: (lng + 180) * MAP_SCALE, y: (MAP_TOP_LAT - lat) * MAP_SCALE }
}

export function unproject(x: number, y: number): LatLng {
  return { lat: MAP_TOP_LAT - y / MAP_SCALE, lng: x / MAP_SCALE - 180 }
}

export type TravelerMood = 'curious' | 'thrilled' | 'pleased' | 'worried'

export function travelerMood(km: number): Exclude<TravelerMood, 'curious'> {
  return km <= CLOSE_KM ? 'thrilled' : km <= NEAR_KM ? 'pleased' : 'worried'
}
