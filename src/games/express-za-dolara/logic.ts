import { pickOne, randomInt, type Rng } from '@/shared/daily'
import events from './data.json'

export const STOPS = [
  { name: 'Bali', x: 370, y: 230 },
  { name: 'Jawa', x: 320, y: 215 },
  { name: 'Bromo', x: 280, y: 195 },
  { name: 'Kuala Lumpur', x: 80, y: 45 },
  { name: 'Malakka', x: 105, y: 80 },
  { name: 'Singapur', x: 140, y: 115 },
]
export const LEGS = STOPS.length - 1
export const ELIMINATION_AFTER_LEGS = [2, 4]
export const BUS_PRICE = 3
export const EVENT_CHANCE = 0.4
export const PLACE_POINTS = [100, 60, 30]
export const POINTS_PER_LEG_WHEN_OUT = 10

export type Transport = 'autostop' | 'praca' | 'bus'
export type Team = { name: string; hours: number; alive: boolean }
export type TravelEvent = { id: string; text: string; hours?: number; money?: number; amulet?: boolean }
export type EventKind = 'hours+' | 'hours-' | 'money+' | 'money-' | 'amulet'

export const PLAYER = 0
export const START_TEAMS: Team[] = [
  { name: 'Wy', hours: 0, alive: true },
  { name: 'Siostry z Mazur', hours: 0, alive: true },
  { name: 'Ojciec i syn', hours: 0, alive: true },
]
export const TEAM_COLORS = ['#e8433a', '#2f6fd8', '#2f9e55']
export const TRANSPORTS: { id: Transport; label: string; hint: string }[] = [
  { id: 'autostop', label: 'Autostop', hint: 'za darmo, 3–14 h' },
  { id: 'praca', label: 'Praca za przejazd', hint: '9 h, +$1' },
  { id: 'bus', label: 'Płatny bus', hint: `5 h, −$${BUS_PRICE}` },
]
export const EVENTS: TravelEvent[] = events

export function travel(transport: Transport, rng: Rng): { hours: number; money: number } {
  if (transport === 'autostop') return { hours: randomInt(rng, 3, 14), money: 0 }
  if (transport === 'praca') return { hours: 9, money: 1 }
  return { hours: 5, money: -BUS_PRICE }
}

export function botLegHours(rng: Rng): number {
  return randomInt(rng, 5, 11)
}

/** Index of the slowest team still in the race. */
export function slowestTeam(teams: readonly Team[]): number {
  return teams.reduce((slowest, team, i) => (team.alive && (slowest < 0 || team.hours > teams[slowest].hours) ? i : slowest), -1)
}

/** 1-based place of a team among those still racing. */
export function placeOf(teams: readonly Team[], index: number): number {
  return teams.filter((t) => t.alive && t.hours < teams[index].hours).length + 1
}

export function eventKind(event: TravelEvent): EventKind {
  if (event.amulet) return 'amulet'
  if (event.money) return event.money > 0 ? 'money+' : 'money-'
  return (event.hours ?? 0) > 0 ? 'hours+' : 'hours-'
}

export type LegState = { teams: Team[]; leg: number; money: number; amulet: boolean }
export type LegResult = {
  trip: { hours: number; money: number }
  event: TravelEvent | null
  /** Hours each team spent on this leg (0 for teams already out). */
  legHours: number[]
  teams: Team[]
  money: number
  amulet: boolean
  eliminated: number | null
  saved: boolean
}

/** Resolves one leg: the player's trip and event, bot times, the daily dollar and a possible elimination. */
export function playLeg({ teams, leg, money, amulet }: LegState, transport: Transport, rng: Rng): LegResult {
  const trip = travel(transport, rng)
  let hours = trip.hours
  let cash = money + trip.money
  let hasAmulet = amulet
  const event = rng() < EVENT_CHANCE ? pickOne(EVENTS, rng) : null
  if (event) {
    hours = Math.max(1, hours + (event.hours ?? 0))
    cash = Math.max(0, cash + (event.money ?? 0))
    if (event.amulet) hasAmulet = true
  }

  const legHours = teams.map((t, i) => (!t.alive ? 0 : i === PLAYER ? hours : botLegHours(rng)))
  let next = teams.map((t, i) => (t.alive ? { ...t, hours: t.hours + legHours[i] } : t))
  let eliminated: number | null = null
  let saved = false
  if (ELIMINATION_AFTER_LEGS.includes(leg + 1)) {
    const slowest = slowestTeam(next)
    if (slowest === PLAYER && hasAmulet) {
      hasAmulet = false
      saved = true
    } else {
      eliminated = slowest
      next = next.map((t, i) => (i === slowest ? { ...t, alive: false } : t))
    }
  }
  return { trip, event, legHours, teams: next, money: cash + 1, amulet: hasAmulet, eliminated, saved }
}

export type TeamMood = 'happy' | 'tired' | 'worried' | 'cheer' | 'out'

export function teamMood({ alive, place, saved, eliminatedNow }: { alive: boolean; place: number; saved: boolean; eliminatedNow: boolean }): TeamMood {
  if (!alive || eliminatedNow) return 'out'
  if (saved) return 'cheer'
  if (place === 1) return 'happy'
  return place === 2 ? 'tired' : 'worried'
}
