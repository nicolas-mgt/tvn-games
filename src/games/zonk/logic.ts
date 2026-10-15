import type { Rng } from '@/shared/daily'

export const DOOR_COUNT = 3

/** The host always opens a losing door the player did not pick. */
export function hostOpens(prizeDoor: number, pickedDoor: number, rng: Rng): number {
  const candidates = [0, 1, 2].filter((door) => door !== prizeDoor && door !== pickedDoor)
  return candidates[Math.floor(rng() * candidates.length)]
}

export function remainingDoor(pickedDoor: number, openedDoor: number): number {
  return [0, 1, 2].find((door) => door !== pickedDoor && door !== openedDoor)!
}

export type MontyStats = { switchPlays: number; switchWins: number; stayPlays: number; stayWins: number }

export function addMontyResult(stats: MontyStats, switched: boolean, won: boolean): MontyStats {
  return switched
    ? { ...stats, switchPlays: stats.switchPlays + 1, switchWins: stats.switchWins + Number(won) }
    : { ...stats, stayPlays: stats.stayPlays + 1, stayWins: stats.stayWins + Number(won) }
}
