import story from './data.json'

export type StatKey = 'jakosc' | 'atmosfera' | 'kasa'
export type Stats = Record<StatKey, number>
export type Choice = { text: string; effects?: Partial<Stats>; reaction?: string; ending?: string }
export type OwnerId = 'halina' | 'zbyszek' | 'marian' | 'kamil'
export type Scene = { id: string; title: string; text: string; cast: OwnerId[]; choices: Choice[] }
export type Ending = { min: number; title: string; text: string }
export type Level = 0 | 1 | 2
export type ChefMood = 'appalled' | 'stern' | 'approving' | 'delighted'
export type OwnerMood = 'neutral' | 'happy' | 'upset'

export const INTRO = story.intro
export const SCENES = story.scenes as Scene[]
export const ENDINGS: Ending[] = story.endings
export const START_STATS: Stats = { jakosc: 3, atmosfera: 3, kasa: 3 }
export const MAX_STAT = 10
export const MAX_SCORE = 3 * MAX_STAT
export const STAT_KEYS: StatKey[] = ['jakosc', 'atmosfera', 'kasa']
export const OWNER_NAMES: Record<OwnerId, string> = { halina: 'Pani Halina', zbyszek: 'Zbyszek', marian: 'Pan Marian', kamil: 'Kamil' }
export const STAT_LABELS: Record<StatKey, string> = { jakosc: 'Jakość', atmosfera: 'Atmosfera', kasa: 'Kasa' }

export function applyEffects(stats: Stats, effects: Partial<Stats> = {}): Stats {
  const next = { ...stats }
  for (const key of STAT_KEYS) next[key] = Math.min(MAX_STAT, Math.max(0, next[key] + (effects[key] ?? 0)))
  return next
}

export function totalScore(stats: Stats): number {
  return stats.jakosc + stats.atmosfera + stats.kasa
}

/** How renovated the room looks for a stat: 0–3 run-down, 4–6 improved, 7–10 renovated. */
export function statLevel(value: number): Level {
  return value >= 7 ? 2 : value >= 4 ? 1 : 0
}

export function endingFor(score: number): Ending {
  return ENDINGS.find((e) => score >= e.min) ?? ENDINGS[ENDINGS.length - 1]
}

function effectSum(choice: Choice): number {
  return STAT_KEYS.reduce((sum, key) => sum + (choice.effects?.[key] ?? 0), 0)
}

export function chefMood(choice: Choice | null): ChefMood {
  if (!choice) return 'stern'
  if (choice.ending) return 'appalled'
  const sum = effectSum(choice)
  if (sum >= 2) return 'delighted'
  if (sum === 1) return 'approving'
  return sum === 0 ? 'stern' : 'appalled'
}

export function ownerMood(choice: Choice): OwnerMood {
  if (choice.ending) return 'upset'
  const sum = effectSum(choice)
  return sum > 0 ? 'happy' : sum < 0 ? 'upset' : 'neutral'
}
