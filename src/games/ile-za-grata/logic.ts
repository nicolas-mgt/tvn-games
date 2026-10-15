export const MAX_POINTS_PER_CAR = 100
export const MIN_PRICE = 1000
export const MAX_PRICE = 150000
export const PRICE_STEP = 500

export type VerdictMood = 'neutral' | 'impressed' | 'greedy' | 'offended'
export type DealerMood = VerdictMood | 'thinking'

export function priceScore(guess: number, actualPrice: number): number {
  const errorPercent = (Math.abs(guess - actualPrice) / actualPrice) * 100
  return Math.max(0, Math.round(MAX_POINTS_PER_CAR - errorPercent))
}

export function dealerMood(guess: number, actualPrice: number): VerdictMood {
  const error = (guess - actualPrice) / actualPrice
  if (Math.abs(error) <= 0.1) return 'impressed'
  if (error > 0.3) return 'greedy'
  if (error < -0.3) return 'offended'
  return 'neutral'
}

export const formatZl = (amount: number) => `${amount.toLocaleString('pl-PL')} zł`
