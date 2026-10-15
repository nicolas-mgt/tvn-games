import { shuffle, type Rng } from '@/shared/daily'

export const PLAYER = 0
export const CEREMONIES = 5
export const MAX_AFFECTION = 10
export const ACTIONS_PER_ROUND = 2
export const POINTS_PER_CEREMONY = 20

export type CardId = 'immunitet' | 'podwojny' | 'kradziez' | 'wyrocznia'
export const CARDS: Record<CardId, { name: string; text: string }> = {
  immunitet: { name: 'Immunitet', text: 'Na tej ceremonii nikt nie może na ciebie zagłosować.' },
  podwojny: { name: 'Podwójny głos', text: 'Twój głos liczy się podwójnie.' },
  kradziez: { name: 'Kradzież partnera', text: 'Wybrana osoba zakochuje się w tobie, ale ktoś inny jest wściekły.' },
  wyrocznia: { name: 'Rajska Wyrocznia', text: 'Widzisz, na kogo każdy zamierza głosować.' },
}

export type Personality = 'lojalny' | 'intrygant' | 'zazdrosny'

export type Contestant = {
  name: string
  personality: Personality
  /** How much this bot likes the player (unused for the player entry). */
  affection: number
  alive: boolean
}

export type Villa = {
  contestants: Contestant[]
  /** dislike[voter][target] between bots, 0–10. */
  dislike: number[][]
  /** Per-round random tie-breaker, regenerated before each ceremony. */
  noise: number[][]
  datedLast: number | null
}

const BOTS: Omit<Contestant, 'affection' | 'alive'>[] = [
  { name: 'Kamila', personality: 'intrygant' },
  { name: 'Dawid', personality: 'lojalny' },
  { name: 'Wiktoria', personality: 'zazdrosny' },
  { name: 'Patryk', personality: 'lojalny' },
  { name: 'Oliwia', personality: 'intrygant' },
  { name: 'Maks', personality: 'zazdrosny' },
  { name: 'Natalia', personality: 'lojalny' },
]

export function randomNoise(size: number, rng: Rng): number[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => rng() * 2))
}

export function createVilla(rng: Rng): Villa {
  const bots = shuffle(BOTS, rng).map((bot) => ({ ...bot, affection: 4 + Math.floor(rng() * 3), alive: true }))
  const contestants: Contestant[] = [{ name: 'Ty', personality: 'lojalny', affection: 0, alive: true }, ...bots]
  const size = contestants.length
  const dislike = Array.from({ length: size }, (_, v) => Array.from({ length: size }, (_, t) => (v === t ? 0 : 2 + rng() * 6)))
  return { contestants, dislike, noise: randomNoise(size, rng), datedLast: null }
}

function dislikeOf(villa: Villa, voter: number, target: number): number {
  const bot = villa.contestants[voter]
  let value = target === PLAYER ? MAX_AFFECTION - bot.affection : villa.dislike[voter][target]
  if (target === PLAYER && bot.personality === 'lojalny' && bot.affection >= 7) return -Infinity
  if (target === PLAYER && bot.personality === 'zazdrosny' && villa.datedLast !== null && villa.datedLast !== voter) value += 2
  const noise = villa.noise[voter][target] * (bot.personality === 'intrygant' ? 2 : 1)
  return value + noise
}

export function botVote(villa: Villa, voter: number, playerImmune: boolean): number {
  const candidates = villa.contestants
    .map((c, i) => ({ c, i }))
    .filter(({ c, i }) => c.alive && i !== voter && !(i === PLAYER && playerImmune))
  return candidates.reduce((best, cur) => (dislikeOf(villa, voter, cur.i) > dislikeOf(villa, voter, best.i) ? cur : best)).i
}

export type CeremonyResult = { votes: { voter: number; target: number }[]; eliminated: number }

export function runCeremony(villa: Villa, playerVote: number, doubleVote: boolean, playerImmune: boolean): CeremonyResult {
  const votes = villa.contestants.flatMap((c, voter) =>
    c.alive && voter !== PLAYER ? [{ voter, target: botVote(villa, voter, playerImmune) }] : [],
  )
  votes.unshift({ voter: PLAYER, target: playerVote })
  const counts = new Map<number, number>()
  for (const { voter, target } of votes) counts.set(target, (counts.get(target) ?? 0) + (voter === PLAYER && doubleVote ? 2 : 1))
  const [eliminated] = [...counts.entries()].reduce((best, cur) => {
    if (cur[1] !== best[1]) return cur[1] > best[1] ? cur : best
    return villa.noise[PLAYER][cur[0]] > villa.noise[PLAYER][best[0]] ? cur : best
  })
  return { votes, eliminated }
}

export type Reaction = 'smitten' | 'jealous' | 'hurt' | 'cheerful'
export type ContestantMood = 'fan' | 'neutral' | 'cold' | 'out' | Reaction

export function contestantMood({ affection, reaction, alive }: { affection: number; reaction?: Reaction; alive: boolean }): ContestantMood {
  if (!alive) return 'out'
  if (reaction) return reaction
  if (affection >= 7) return 'fan'
  return affection <= 3 ? 'cold' : 'neutral'
}
