import { dailyRng, pickN } from '@/shared/daily'
import words from './data.json'

export const SLUG = 'to-pan-tego-nie-wie'
export const WORDS_PER_GAME = 5
export const ATTEMPTS = 3
export const MAX_SCORE = WORDS_PER_GAME * ATTEMPTS
export const DAILY_KEY = 'tvn-games:to-pan:last-daily'

export type Mode = 'daily' | 'practice'
export type Entry = (typeof words)[number]

export function entriesFor(mode: Mode): Entry[] {
  return mode === 'daily' ? pickN(words, WORDS_PER_GAME, dailyRng(SLUG)) : pickN(words, WORDS_PER_GAME)
}

export function pointsFor(attemptsUsed: number, solved: boolean): number {
  return solved ? ATTEMPTS + 1 - attemptsUsed : 0
}

/** Letter tiles after `wrongs` misses: `null` = no tiles yet, `''` = hidden letter, `' '` = gap between words. */
export function hintFor(word: string, wrongs: number): string[] | null {
  if (wrongs < 1) return null
  return [...word].map((char, i) => (char === ' ' ? ' ' : i === 0 && wrongs >= 2 ? char : ''))
}

export const LOOKS = {
  hair: ['short', 'pigtails', 'curly', 'bob', 'spiky'] as const,
  hairColor: ['#3a2414', '#8a4a20', '#e0b050', '#1a1a1a', '#c0502a'],
  shirt: ['#e8504a', '#3a8ad0', '#f2b830', '#5ab060', '#9a5ad0', '#f07ab0'],
  skin: ['#f6d2b0', '#e8b890', '#c88a60'],
}
export type Look = {
  hair: (typeof LOOKS.hair)[number]
  hairColor: string
  shirt: string
  skin: string
  glasses: boolean
}

export function lookFor(kidName: string): Look {
  let hash = 0
  for (const char of kidName) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  const pick = <T>(items: readonly T[], salt: number) => items[(hash >>> salt) % items.length]
  return {
    hair: pick(LOOKS.hair, 0),
    hairColor: pick(LOOKS.hairColor, 3),
    shirt: pick(LOOKS.shirt, 6),
    skin: pick(LOOKS.skin, 9),
    glasses: (hash >>> 12) % 4 === 0,
  }
}

export type Phase = 'lobby' | 'definition' | 'correct' | 'reveal' | 'result'
export type KidMood = 'talking' | 'giggle' | 'proud' | 'shrug'
export type HostMood = 'smile' | 'laugh' | 'cheer' | 'sympathy'

export function kidMood(phase: Phase, wrongFlash: boolean): KidMood {
  if (phase === 'correct') return 'proud'
  if (phase === 'reveal') return 'shrug'
  return wrongFlash ? 'giggle' : 'talking'
}

export function hostMood(phase: Phase, wrongFlash: boolean): HostMood {
  if (phase === 'correct') return 'cheer'
  if (phase === 'reveal') return 'sympathy'
  return wrongFlash ? 'laugh' : 'smile'
}

export const HOST_LINES: Record<'definition' | 'wrong' | 'correct' | 'reveal', readonly string[]> = {
  definition: ['Posłuchajmy eksperta!', 'No to słuchamy uważnie.', 'Nasz gość ma wyjaśnienie.'],
  wrong: ['Ojej, nie to! Jeszcze raz.', 'Prawie! Ale nie.', 'Dzieci się śmieją, próbujemy dalej!'],
  correct: ['Brawo! Rysunek wędruje do ciebie!', 'Jest! Ekspert zadowolony.', 'Trafione! Kawa smakuje lepiej.'],
  reveal: ['Nic straconego, dorośli też nie wiedzą.', 'Następnym razem się uda!', 'Trudne było, przyznajmy.'],
}

export function hostLine(kind: keyof typeof HOST_LINES, index: number): string {
  const lines = HOST_LINES[kind]
  return lines[index % lines.length]
}
