import { pickOne, shuffle, type Rng } from '@/shared/daily'

export const PLAYER = 0
export const LOCATIONS = ['Biblioteka', 'Kuchnia', 'Ogród', 'Piwnica']
export const TRAITOR_HIDEOUT = 'Wieża'

export type Role = 'lojalny' | 'zdrajca'
export type Resident = { name: string; emoji: string; role: Role; alive: boolean }
export type Statement = { who: number; claimed: string; companions: number[] }
export type Day = { actual: Record<number, string>; statements: Statement[] }
export type Vote = { voter: number; target: number }

const BOTS = [
  { name: 'Hrabina Zofia', emoji: '👒' },
  { name: 'Kucharz Bogdan', emoji: '👨‍🍳' },
  { name: 'Ogrodnik Staś', emoji: '🧑‍🌾' },
  { name: 'Lady Pamela', emoji: '💅' },
  { name: 'Profesor Wit', emoji: '🧐' },
  { name: 'Influencerka Mia', emoji: '🤳' },
  { name: 'Major Ryszard', emoji: '🎖️' },
  { name: 'Lokaj Alfred', emoji: '🤵' },
]

export function createCastle(rng: Rng): Resident[] {
  const traitors = new Set(shuffle(BOTS.map((_, i) => i), rng).slice(0, 2))
  return [
    { name: 'Ty', emoji: '🙂', role: 'lojalny', alive: true },
    ...BOTS.map((bot, i) => ({ ...bot, role: traitors.has(i) ? ('zdrajca' as const) : ('lojalny' as const), alive: true })),
  ]
}

const aliveIndexes = (residents: readonly Resident[]) => residents.flatMap((r, i) => (r.alive ? [i] : []))

/** Loyal residents tell the full truth about where and with whom they were; traitors invent a location. */
export function planDay(residents: readonly Resident[], rng: Rng): Day {
  const actual: Record<number, string> = {}
  for (const i of aliveIndexes(residents)) actual[i] = residents[i].role === 'zdrajca' ? TRAITOR_HIDEOUT : pickOne(LOCATIONS, rng)

  const statements = aliveIndexes(residents)
    .filter((i) => i !== PLAYER)
    .map((who) => {
      if (residents[who].role === 'lojalny') {
        const companions = aliveIndexes(residents).filter((j) => j !== who && actual[j] === actual[who])
        return { who, claimed: actual[who], companions }
      }
      const claimed = pickOne(LOCATIONS, rng)
      const peopleThere = aliveIndexes(residents).filter((j) => actual[j] === claimed)
      const companions = peopleThere.length > 0 && rng() < 0.6 ? [pickOne(peopleThere, rng)] : []
      return { who, claimed, companions }
    })
  return { actual, statements }
}

/** Loyal bots vote for anyone who claimed their room without being there; traitors gang up on one loyal. */
export function botVotes(residents: readonly Resident[], day: Day, rng: Rng): Vote[] {
  const alive = aliveIndexes(residents)
  const loyalBots = alive.filter((i) => i !== PLAYER && residents[i].role === 'lojalny')
  const traitorTarget = loyalBots.length === 0 || rng() < 0.3 ? PLAYER : pickOne(loyalBots, rng)
  return alive
    .filter((voter) => voter !== PLAYER)
    .map((voter) => {
      if (residents[voter].role === 'zdrajca') return { voter, target: traitorTarget }
      const liars = day.statements.filter((s) => s.who !== voter && s.claimed === day.actual[voter] && day.actual[s.who] !== s.claimed)
      if (liars.length > 0) return { voter, target: pickOne(liars, rng).who }
      return { voter, target: pickOne(alive.filter((i) => i !== voter), rng) }
    })
}

export function banish(votes: readonly Vote[], rng: Rng): number {
  const counts = new Map<number, number>()
  for (const { target } of votes) counts.set(target, (counts.get(target) ?? 0) + 1)
  const top = Math.max(...counts.values())
  return pickOne([...counts.entries()].filter(([, n]) => n === top).map(([target]) => target), rng)
}

export function nightVictim(residents: readonly Resident[], rng: Rng): number | null {
  const victims = aliveIndexes(residents).filter((i) => i !== PLAYER && residents[i].role === 'lojalny')
  return victims.length > 0 ? pickOne(victims, rng) : null
}

export function gameStatus(residents: readonly Resident[]): 'win' | 'lose' | 'ongoing' {
  const alive = residents.filter((r) => r.alive)
  const traitors = alive.filter((r) => r.role === 'zdrajca').length
  if (!residents[PLAYER].alive) return 'lose'
  if (traitors === 0) return 'win'
  return traitors >= alive.length - traitors ? 'lose' : 'ongoing'
}
