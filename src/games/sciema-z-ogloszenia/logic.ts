export const SECONDS_PER_AD = 45
export const URGENT_SECONDS = 10
export const POINTS_PER_FLAG = 2
export const FALSE_ALARM_PENALTY = 1

export type ReporterMood = 'neutral' | 'suspicious' | 'pleased' | 'disappointed' | 'alarmed'
export type Click = 'hit' | 'miss'

export function reporterMood({ lastClick, remaining, reviewing }: { lastClick: Click | null; remaining: number; reviewing: boolean }): ReporterMood {
  if (reviewing) return lastClick === 'hit' ? 'pleased' : 'disappointed'
  if (lastClick === 'hit') return 'pleased'
  if (lastClick === 'miss') return 'disappointed'
  if (remaining < URGENT_SECONDS) return 'alarmed'
  return 'suspicious'
}
