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
