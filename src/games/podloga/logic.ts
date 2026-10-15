import { shuffle, type Rng } from '@/shared/daily'

export const SIZE = 5
export const START_INDEX = 12

const BOT_NAMES = [
  'Ania', 'Bartek', 'Celina', 'Darek', 'Ewa', 'Filip', 'Grażyna', 'Henryk', 'Iza', 'Jacek', 'Kasia', 'Leszek',
  'Magda', 'Norbert', 'Ola', 'Piotr', 'Renata', 'Sławek', 'Tamara', 'Urszula', 'Wojtek', 'Zosia', 'Krystian', 'Lena',
]

export type Tile = { owner: 'player' | 'bot'; categoryId: string; botName: string; skill: number }

/** Bot tiles get categories round-robin, then the whole layout is shuffled with the (daily) RNG. */
export function createBoard(categoryIds: readonly string[], rng: Rng): Tile[] {
  const botTiles = shuffle(
    BOT_NAMES.map((botName, i) => ({
      owner: 'bot' as const,
      categoryId: categoryIds[i % categoryIds.length],
      botName,
      skill: 0.55 + rng() * 0.3,
    })),
    rng,
  )
  const board: Tile[] = [...botTiles]
  board.splice(START_INDEX, 0, { owner: 'player', categoryId: '', botName: 'Ty', skill: 0 })
  return board
}

export function neighbors(index: number): number[] {
  const row = Math.floor(index / SIZE)
  const col = index % SIZE
  return [
    row > 0 ? index - SIZE : -1,
    row < SIZE - 1 ? index + SIZE : -1,
    col > 0 ? index - 1 : -1,
    col < SIZE - 1 ? index + 1 : -1,
  ].filter((i) => i >= 0)
}

export function challengeable(board: readonly Tile[]): number[] {
  return board.flatMap((tile, i) =>
    tile.owner === 'bot' && neighbors(i).some((n) => board[n].owner === 'player') ? [i] : [],
  )
}
