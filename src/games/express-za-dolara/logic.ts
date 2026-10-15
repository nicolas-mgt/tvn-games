import { randomInt, type Rng } from '@/shared/daily'

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

export type Transport = 'autostop' | 'praca' | 'bus'
export type Team = { name: string; emoji: string; hours: number; alive: boolean }

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

export const PLACE_POINTS = [100, 60, 30]
export const POINTS_PER_LEG_WHEN_OUT = 10
