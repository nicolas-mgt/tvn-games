import { pickOne, shuffle, type Rng } from '@/shared/daily'

export const PLAYER = 0
export const LOCATIONS = ['Biblioteka', 'Kuchnia', 'Ogród', 'Piwnica']
export const TRAITOR_HIDEOUT = 'Wieża'
export const LOCATIVE: Record<string, string> = { Biblioteka: 'Bibliotece', Kuchnia: 'Kuchni', Ogród: 'Ogrodzie', Piwnica: 'Piwnicy' }
const FEMALE = new Set(['Hrabina Zofia', 'Lady Pamela', 'Influencerka Mia'])
export const gendered = (name: string, male: string, female: string) => (FEMALE.has(name) ? female : male)
export const POINTS_PER_TRAITOR = 50
export const PENALTY_PER_LOYAL = 10

export type Role = 'lojalny' | 'zdrajca'
export type Resident = { name: string; role: Role; alive: boolean }
export type Statement = { who: number; claimed: string; companions: number[] }
export type Day = { actual: Record<number, string>; statements: Statement[] }
export type Vote = { voter: number; target: number }

const BOTS = [
  { name: 'Hrabina Zofia' },
  { name: 'Kucharz Bogdan' },
  { name: 'Ogrodnik Staś' },
  { name: 'Lady Pamela' },
  { name: 'Profesor Wit' },
  { name: 'Influencerka Mia' },
  { name: 'Major Ryszard' },
  { name: 'Lokaj Alfred' },
]

export function createCastle(rng: Rng): Resident[] {
  const traitors = new Set(shuffle(BOTS.map((_, i) => i), rng).slice(0, 2))
  return [
    { name: 'Ty', role: 'lojalny', alive: true },
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

const INSTRUMENTAL: Record<string, string> = {
  Ty: 'Tobą',
  'Hrabina Zofia': 'Hrabiną Zofią',
  'Kucharz Bogdan': 'Kucharzem Bogdanem',
  'Ogrodnik Staś': 'Ogrodnikiem Stasiem',
  'Lady Pamela': 'Lady Pamelą',
  'Profesor Wit': 'Profesorem Witem',
  'Influencerka Mia': 'Influencerką Mią',
  'Major Ryszard': 'Majorem Ryszardem',
  'Lokaj Alfred': 'Lokajem Alfredem',
}

function withList(names: string[]) {
  const forms = names.map((n) => INSTRUMENTAL[n])
  return forms.length > 1 ? `${forms.slice(0, -1).join(', ')} i ${forms.at(-1)}` : forms[0]
}

export const shortName = (name: string) => (name === 'Ty' ? 'TY' : name.split(' ').at(-1)!)

export function statementText(name: string, room: string, companions: string[]) {
  const company = companions.length > 0 ? `z ${withList(companions)}` : gendered(name, 'sam', 'sama')
  return `${gendered(name, 'Byłem', 'Byłam')} w ${LOCATIVE[room]} ${company}.`
}

export const alibiText = (room: string, companions: string[]) =>
  `Byłeś w ${LOCATIVE[room]} ${companions.length > 0 ? `z ${withList(companions)}` : 'sam'}.`

export type ResidentMood = 'calm' | 'suspicious' | 'nervous' | 'offended' | 'sly' | 'out'

export function residentMood({
  alive,
  unmasked,
  votesAgainst,
  votedByPlayer,
  accusesPlayer,
}: {
  alive: boolean
  unmasked: boolean
  votesAgainst: number
  votedByPlayer: boolean
  accusesPlayer: boolean
}): ResidentMood {
  if (!alive) return 'out'
  if (unmasked) return 'sly'
  if (votedByPlayer) return 'offended'
  if (votesAgainst >= 2) return 'nervous'
  return accusesPlayer ? 'suspicious' : 'calm'
}
