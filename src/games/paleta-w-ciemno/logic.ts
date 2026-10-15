import { pickOne, type Rng } from '@/shared/daily'

export const BID_STEP = 100

export type Leader = 'player' | number | null

/** Each dealer silently values a pallet at 0.5–1.2× its real worth, rounded down to the bid step. */
export function dealerLimits(value: number, dealers: number, rng: Rng): number[] {
  return Array.from({ length: dealers }, () => Math.floor((value * (0.5 + rng() * 0.7)) / BID_STEP) * BID_STEP)
}

/** A random dealer who can still afford to outbid the leader, or null if nobody will. */
export function nextDealerBid(limits: readonly number[], price: number, leader: Leader, rng: Rng): number | null {
  const willing = limits.flatMap((limit, i) => (i !== leader && limit >= price + BID_STEP ? [i] : []))
  return willing.length > 0 ? pickOne(willing, rng) : null
}

/** When the player drops out, the highest limit wins at one step above the runner-up (capped at its own limit). */
export function dealersOnlyResult(limits: readonly number[], price: number): { winner: number; price: number } | null {
  const order = limits.map((limit, i) => ({ limit, i })).sort((a, b) => b.limit - a.limit)
  const [top, second] = order
  if (!top || top.limit < Math.max(price, BID_STEP)) return null
  const runnerUp = Math.max(price, second ? second.limit + BID_STEP : BID_STEP)
  return { winner: top.i, price: Math.min(top.limit, runnerUp) }
}
