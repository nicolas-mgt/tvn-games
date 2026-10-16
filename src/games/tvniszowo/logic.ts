import { addDays, pickOne, shuffle, type Rng } from '@/shared/daily'
import data from './data.json'
import lineData from './lines.json'

export type TierId = 'primetime' | 'oczywista' | 'stalywidz' | 'koneser' | 'archiwum' | 'zloty'
export type Tier = { name: string; score: number; share: string; blurb: string; depth: number; color: string }
export type Answer = { name: string; aliases?: string[]; tier: TierId; note?: string }
export type Question = { id: string; category: string; prompt: string; hint?: string; sources: string[]; answers: Answer[] }
export type Mode = 'daily' | 'unlimited'
export type Phase = 'lobby' | 'preview' | 'answering' | 'feedback' | 'result'
export type MatchResult = { kind: 'exact' | 'fuzzy'; answer: Answer } | { kind: 'partial' | 'none' }
export type RoundResult = { questionId: string; raw: string | null; answer: string | null; tier: TierId | null; score: number }
export type ArchivistMood = 'calm' | 'focused' | 'worried' | 'doubtful' | 'pleased' | 'amazed' | 'starstruck' | 'sad'
export type LineGroup = keyof typeof lineData

export const SLUG = 'tvniszowo'
export const DAILY_KEY = 'tvn-games:tvniszowo:last-daily'
export const ROUNDS = 7
export const PREVIEW_SECONDS = 3
export const ANSWER_SECONDS = 25
export const WARN_SECONDS = 5
/** Day that the daily schedule counts as #1. */
export const LAUNCH_DAY = '2026-10-15'

/** Rarity levels from the most obvious to the most niche; `depth` places them in the archive shaft (0 = top, 1 = bottom). */
export const TIERS: Record<TierId, Tier> = {
  primetime: { name: 'Prime time', score: 10, share: '📺', blurb: 'Odpowiedź, którą zna każdy widz.', depth: 0.08, color: '#ffd166' },
  oczywista: { name: 'Oczywista nieoczywistość', score: 15, share: '🤡', blurb: 'Wszyscy myślą, że to rzadkie. Wszyscy.', depth: 0.2, color: '#ff8f5a' },
  stalywidz: { name: 'Stały widz', score: 30, share: '🛋️', blurb: 'Solidnie – kanapa zna Twój kształt.', depth: 0.38, color: '#4fd1a5' },
  koneser: { name: 'Koneser', score: 60, share: '🎬', blurb: 'Naprawdę rzadkie. Szacunek.', depth: 0.6, color: '#5aa9ff' },
  archiwum: { name: 'Archiwum', score: 85, share: '📼', blurb: 'Głęboko w archiwum. Mało kto tu schodzi.', depth: 0.81, color: '#b48cff' },
  zloty: { name: 'Złoty przycisk', score: 100, share: '🌟', blurb: 'Jeden na milion. Ukryty skarb tej rundy!', depth: 0.96, color: '#ffe066' },
}
export const TIER_IDS = Object.keys(TIERS) as TierId[]
export const MISS = { name: 'Pudło', share: '⬛', blurb: 'Czas minął – zegar okazał się szybszy.', color: '#5b6280' }
export const MAX_SCORE = ROUNDS * TIERS.zloty.score

const SCORE_BANDS: { min: number; verdict: string }[] = [
  { min: 450, verdict: 'Jeden na milion. Złoty przycisk dla Ciebie!' },
  { min: 351, verdict: 'Archiwista. Masz klucz do magazynu taśm.' },
  { min: 251, verdict: 'Koneser. Pamiętasz więcej niż program telewizyjny.' },
  { min: 151, verdict: 'Stały widz. Kanapa zna Twój kształt.' },
  { min: 0, verdict: 'Widz okazjonalny. Pilot wciąż szuka właściwego kanału.' },
]

export const QUESTIONS = data as Question[]
const LINES: Record<LineGroup, string[]> = lineData

export function verdictFor(score: number): string {
  return SCORE_BANDS.find((band) => score >= band.min)!.verdict
}

export function totalScore(results: readonly RoundResult[]): number {
  return results.reduce((sum, result) => sum + result.score, 0)
}

export function shareFor(result: RoundResult): string {
  return result.tier ? TIERS[result.tier].share : MISS.share
}

export function dayNumber(day: string): number {
  let number = 1
  while (addDays(LAUNCH_DAY, number - 1) < day) number++
  return number
}

/** One question per category first, repeats of a category only after that. */
export function dealQuestions(rng: Rng): Question[] {
  const shuffled = shuffle(QUESTIONS, rng)
  const seen = new Set<string>()
  const firstPass = shuffled.filter((q) => !seen.has(q.category) && seen.add(q.category))
  const rest = shuffled.filter((q) => !firstPass.includes(q))
  return [...firstPass, ...rest].slice(0, ROUNDS)
}

export function roundResult(question: Question, answer: Answer | null, raw: string | null): RoundResult {
  return { questionId: question.id, raw, answer: answer?.name ?? null, tier: answer?.tier ?? null, score: answer ? TIERS[answer.tier].score : 0 }
}

export function pickLine(group: LineGroup, rng: Rng = Math.random): string {
  return pickOne(LINES[group], rng)
}

export function archivistMood({
  phase,
  tier = null,
  secondsLeft = ANSWER_SECONDS,
  rejected = false,
  score = 0,
}: {
  phase: Phase
  tier?: TierId | null
  secondsLeft?: number
  rejected?: boolean
  score?: number
}): ArchivistMood {
  if (phase === 'answering') return rejected ? 'doubtful' : secondsLeft <= WARN_SECONDS ? 'worried' : 'focused'
  if (phase === 'feedback') {
    if (!tier) return 'sad'
    if (tier === 'zloty') return 'starstruck'
    return TIERS[tier].depth >= TIERS.koneser.depth ? 'amazed' : 'pleased'
  }
  if (phase === 'result') return score >= 351 ? 'starstruck' : score >= 251 ? 'amazed' : score >= 151 ? 'pleased' : 'sad'
  return 'calm'
}

// Answer matching: ignores case, Polish letters, punctuation, word order and "https://www.",
// and forgives small typos (those need a confirmation from the player).

const PL_CHARS: Record<string, string> = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' }
const PARTIAL_STOPWORDS = new Set(['show', 'program', 'polska', 'gwiazdy'])

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (ch) => PL_CHARS[ch])
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^\s*(?:https?:\/\/)?(?:www\.)?/, '')
    .replace(/&/g, ' i ')
    .replace(/[^a-z0-9.]+/g, ' ')
    .split(' ')
    .map((token) => token.replace(/^\.+|\.+$/g, '')) // dots survive only inside words (tvn24.pl)
    .filter(Boolean)
    .join(' ')
}

const sortedKey = (key: string) => key.split(' ').sort().join(' ')
const digitsOf = (key: string) => key.replace(/\D/g, '')

/** "You Can Dance – Po prostu tańcz!" → "You Can Dance", "Agent (program)" → "Agent". */
function shortForms(text: string): string[] {
  const forms: string[] = []
  const withoutParens = text.replace(/\s*\([^)]*\)/g, '').trim()
  if (withoutParens !== text) forms.push(withoutParens)
  const head = withoutParens.split(/\s[–—-]\s|:\s|\.\s/)[0]
  if (head !== withoutParens) forms.push(head)
  return forms
}

/** Every key an answer can be hit with; priority 0 = full name or alias, 1 = short form. */
export function keysFor(answer: Answer): { key: string; priority: number }[] {
  const keys: { key: string; priority: number }[] = []
  const add = (text: string, priority: number) => {
    const key = normalize(text)
    if (key.length < 2) return
    keys.push({ key, priority }, { key: sortedKey(key), priority })
  }
  for (const text of [answer.name, ...(answer.aliases ?? [])]) {
    add(text, 0)
    for (const form of shortForms(text)) if (normalize(form).length >= 4) add(form, 1)
  }
  return keys
}

type MatchIndex = { keys: Map<string, { answer: Answer; priority: number }>; tokens: string[][] }
const indexCache = new WeakMap<Question, MatchIndex>()

function indexFor(question: Question): MatchIndex {
  const cached = indexCache.get(question)
  if (cached) return cached
  const keys: MatchIndex['keys'] = new Map()
  const tokens: string[][] = []
  for (const answer of question.answers) {
    for (const { key, priority } of keysFor(answer)) {
      const existing = keys.get(key)
      if (!existing || priority < existing.priority) keys.set(key, { answer, priority })
      tokens.push(key.split(' '))
    }
  }
  const index = { keys, tokens }
  indexCache.set(question, index)
  return index
}

function typoLimit(length: number): number {
  if (length <= 4) return 0
  if (length <= 8) return 1
  return 2
}

function levenshtein(a: string, b: string, limit: number): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      rowMin = Math.min(rowMin, row[j])
    }
    if (rowMin > limit) return limit + 1
    prev = row
  }
  return prev[b.length]
}

export function matchAnswer(question: Question, input: string): MatchResult {
  const norm = normalize(input)
  if (!norm) return { kind: 'none' }
  const { keys, tokens } = indexFor(question)

  const direct = keys.get(norm) ?? keys.get(sortedKey(norm))
  if (direct) return { kind: 'exact', answer: direct.answer }

  let best: { distance: number; priority: number; answer: Answer } | null = null
  for (const candidate of new Set([norm, sortedKey(norm)])) {
    for (const [key, entry] of keys) {
      const limit = typoLimit(key.length)
      if (!limit || Math.abs(key.length - candidate.length) > limit) continue
      if (digitsOf(key) !== digitsOf(candidate)) continue // "tvn7" is not a typo of "tvn24"
      const distance = levenshtein(candidate, key, limit)
      if (distance > limit) continue
      if (!best || distance < best.distance || (distance === best.distance && entry.priority < best.priority)) {
        best = { distance, priority: entry.priority, answer: entry.answer }
      }
    }
  }
  if (best) return { kind: 'fuzzy', answer: best.answer }

  const inputTokens = norm.split(' ')
  const meaningful = inputTokens.every((t) => t.length >= 4 && !PARTIAL_STOPWORDS.has(t))
  if (meaningful && tokens.some((t) => t.length > inputTokens.length && inputTokens.every((it) => t.includes(it)))) return { kind: 'partial' }
  return { kind: 'none' }
}
