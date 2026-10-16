import { shuffle, type Rng } from '@/shared/daily'

export const SIZE = 5
export const START_INDEX = 12
export const PLAYER_COLOR = '#facc15'

const BOT_NAMES = [
  'Ania', 'Bartek', 'Celina', 'Darek', 'Ewa', 'Filip', 'Grażyna', 'Henryk', 'Iza', 'Jacek', 'Kasia', 'Leszek',
  'Magda', 'Norbert', 'Ola', 'Piotr', 'Renata', 'Sławek', 'Tamara', 'Urszula', 'Wojtek', 'Zosia', 'Krystian', 'Lena',
]

export type Tile = { owner: 'player' | 'bot'; categoryId: string; botName: string; skill: number; color: string }

/** Neon hues spread around the wheel, skipping yellows so the player's gold stays unique. */
function botColor(i: number): string {
  let hue = (190 + i * 47) % 360
  if (hue > 30 && hue < 90) hue += 60
  return `hsl(${hue} 70% 45%)`
}

/** Bot tiles get categories round-robin, then the whole layout is shuffled with the (daily) RNG. */
export function createBoard(categoryIds: readonly string[], rng: Rng): Tile[] {
  const botTiles = shuffle(
    BOT_NAMES.map((botName, i) => ({
      owner: 'bot' as const,
      categoryId: categoryIds[i % categoryIds.length],
      botName,
      skill: 0.55 + rng() * 0.3,
      color: botColor(i),
    })),
    rng,
  )
  const board: Tile[] = [...botTiles]
  board.splice(START_INDEX, 0, { owner: 'player', categoryId: '', botName: 'Ty', skill: 0, color: PLAYER_COLOR })
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

/** Grid (Manhattan) distance between two tiles, used to stagger light waves across the floor. */
export function distance(a: number, b: number): number {
  return Math.abs(Math.floor(a / SIZE) - Math.floor(b / SIZE)) + Math.abs((a % SIZE) - (b % SIZE))
}

export function challengeable(board: readonly Tile[]): number[] {
  return board.flatMap((tile, i) =>
    tile.owner === 'bot' && neighbors(i).some((n) => board[n].owner === 'player') ? [i] : [],
  )
}

/** OpenMoji file names are the upper-case code points without the emoji variation selector. */
export function emojiImage(emoji: string): string {
  const code = [...emoji]
    .map((ch) => ch.codePointAt(0)!.toString(16).toUpperCase())
    .filter((cp) => cp !== 'FE0F')
    .join('-')
  return `${import.meta.env.BASE_URL}podloga/items/${code}.svg`
}

export function itemImage(item: { flag?: string; emoji?: string }): string {
  return item.flag ? `https://flagcdn.com/w320/${item.flag}.png` : emojiImage(item.emoji!)
}
