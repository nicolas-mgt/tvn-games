export const MAX_POINTS_PER_CAR = 100

/** 100 points for an exact guess, minus one point per percent of error. */
export function priceScore(guess: number, actualPrice: number): number {
  const errorPercent = (Math.abs(guess - actualPrice) / actualPrice) * 100
  return Math.max(0, Math.round(MAX_POINTS_PER_CAR - errorPercent))
}
