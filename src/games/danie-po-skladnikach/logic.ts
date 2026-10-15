import { dailyRng, pickOne } from '@/shared/daily'
import dishes from './data.json'
import icons from './icons.json'

export type Dish = {
  id: string
  name: string
  aliases: string[]
  ingredients: string[]
  photo: { author: string; license: string; source: string }
}
export type Mode = 'daily' | 'practice'
export type JurorId = 'szef' | 'cukierniczka' | 'molekularny'
export type JuryMood = 'disappointed' | 'doubtful' | 'pleased' | 'delighted'

export const SLUG = 'danie-po-skladnikach'
export const DAILY_KEY = 'slop-games:danie:last-daily'
export const MAX_POINTS = 6
export const DISHES: Dish[] = dishes
export const JURORS: JurorId[] = ['szef', 'cukierniczka', 'molekularny']
export const JUROR_NAMES: Record<JurorId, string> = { szef: 'Szef Wacław', cukierniczka: 'Pani Róża', molekularny: 'Kuba' }

const MOODS: JuryMood[] = ['disappointed', 'doubtful', 'pleased', 'delighted']
const JUROR_BIAS: Record<JurorId, number> = { szef: -1, cukierniczka: 1, molekularny: 0 }
const ICONS: Record<string, string | null> = icons

export function dishFor(mode: Mode): Dish {
  return mode === 'daily' ? pickOne(DISHES, dailyRng(SLUG)) : pickOne(DISHES)
}

export function dishScore(revealed: number, won: boolean): number {
  return won ? MAX_POINTS + 1 - revealed : 0
}

/** Fewer revealed ingredients make the jury happier; the head chef is one step stricter, the pastry chef one step warmer. */
export function juryMood({ revealed, outcome, juror }: { revealed: number; outcome: 'won' | 'lost' | null; juror: JurorId }): JuryMood {
  const base = outcome === 'lost' ? 0 : outcome === 'won' ? (revealed <= 2 ? 3 : revealed <= 4 ? 2 : 1) : revealed <= 3 ? 2 : 1
  return MOODS[Math.min(MOODS.length - 1, Math.max(0, base + JUROR_BIAS[juror]))]
}

/** OpenMoji file code for an ingredient, or null when it is shown as a handwritten hint. */
export function ingredientIcon(ingredient: string): string | null {
  const emoji = ICONS[ingredient]
  if (!emoji) return null
  return [...emoji]
    .map((ch) => ch.codePointAt(0)!.toString(16).toUpperCase())
    .filter((cp) => cp !== 'FE0F')
    .join('-')
}
