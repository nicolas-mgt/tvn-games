export type Cell = [row: number, col: number]
export type Piece = { id: string; cells: Cell[] }
export type Level = { rows: number; cols: number; pieces: Piece[] }

/** Levels are written as a solved board, so every level is guaranteed to be solvable. */
export const LEVELS = [
  ['AABB', 'ACCB', 'DCCE', 'DDEE'],
  ['AAABB', 'CDDBB', 'CDEEF', 'CGGEF', 'HHGFF'],
  ['AABBBC', 'ADDBCC', 'EEDFFC', 'EGGGFH', 'IIGJHH'],
]

export function normalize(cells: readonly Cell[]): Cell[] {
  const minRow = Math.min(...cells.map(([r]) => r))
  const minCol = Math.min(...cells.map(([, c]) => c))
  return cells.map(([r, c]): Cell => [r - minRow, c - minCol]).sort((a, b) => a[0] - b[0] || a[1] - b[1])
}

export function rotate(cells: readonly Cell[]): Cell[] {
  return normalize(cells.map(([r, c]): Cell => [c, -r]))
}

export function parseLevel(layout: readonly string[]): Level {
  const byLetter = new Map<string, Cell[]>()
  layout.forEach((line, r) => [...line].forEach((letter, c) => byLetter.set(letter, [...(byLetter.get(letter) ?? []), [r, c]])))
  const pieces = [...byLetter.entries()].map(([id, cells]) => ({ id, cells: normalize(cells) }))
  return { rows: layout.length, cols: layout[0].length, pieces }
}

/** The first cell of a shape (row-major) is the anchor that lands on the target cell. */
export function cellsAt(shape: readonly Cell[], [row, col]: Cell): Cell[] {
  const [anchorRow, anchorCol] = shape[0]
  return shape.map(([r, c]): Cell => [r - anchorRow + row, c - anchorCol + col])
}

export function fits(cells: readonly Cell[], level: Level, occupied: ReadonlySet<string>): boolean {
  return cells.every(([r, c]) => r >= 0 && c >= 0 && r < level.rows && c < level.cols && !occupied.has(`${r},${c}`))
}

export const MAX_LEVEL_POINTS = 100
const POINTS_PER_EXTRA_MOVE = 5
const MIN_LEVEL_POINTS = 20

export function levelPoints(placements: number, pieces: number): number {
  return Math.max(MIN_LEVEL_POINTS, MAX_LEVEL_POINTS - (placements - pieces) * POINTS_PER_EXTRA_MOVE)
}

export const MAX_SCORE = LEVELS.length * MAX_LEVEL_POINTS

export type Art =
  | 'kurtka'
  | 'parasole'
  | 'buty'
  | 'kalosze'
  | 'zakupy'
  | 'ksiazki'
  | 'klocki'
  | 'komiksy'
  | 'mis'
  | 'gry'
  | 'kolejka'
  | 'puzzle'
  | 'pilka'
  | 'torba'
  | 'walizka'
  | 'namiot'
  | 'walizeczka'
  | 'spiwor'
  | 'kosz'
  | 'materac'
  | 'lodowka'
  | 'parasol'
  | 'plecak'
export type FurnitureKind = 'szafa' | 'regal' | 'bagaznik'
export type Furniture = { kind: FurnitureKind; name: string; items: Record<string, { name: string; art: Art }> }

export const FURNITURE: Furniture[] = [
  {
    kind: 'szafa',
    name: 'Szafa w przedpokoju',
    items: {
      A: { name: 'Kurtka zimowa', art: 'kurtka' },
      B: { name: 'Parasole', art: 'parasole' },
      C: { name: 'Karton z butami', art: 'buty' },
      D: { name: 'Kalosze', art: 'kalosze' },
      E: { name: 'Torba na zakupy', art: 'zakupy' },
    },
  },
  {
    kind: 'regal',
    name: 'Regał w pokoju dziecka',
    items: {
      A: { name: 'Rząd książek', art: 'ksiazki' },
      B: { name: 'Pudło z klockami', art: 'klocki' },
      C: { name: 'Seria komiksów', art: 'komiksy' },
      D: { name: 'Miś', art: 'mis' },
      E: { name: 'Gry planszowe', art: 'gry' },
      F: { name: 'Kolejka drewniana', art: 'kolejka' },
      G: { name: 'Puzzle', art: 'puzzle' },
      H: { name: 'Piłka i skakanka', art: 'pilka' },
    },
  },
  {
    kind: 'bagaznik',
    name: 'Bagażnik przed wakacjami',
    items: {
      A: { name: 'Torba sportowa', art: 'torba' },
      B: { name: 'Duża walizka', art: 'walizka' },
      C: { name: 'Namiot', art: 'namiot' },
      D: { name: 'Mała walizka', art: 'walizeczka' },
      E: { name: 'Śpiwór', art: 'spiwor' },
      F: { name: 'Kosz piknikowy', art: 'kosz' },
      G: { name: 'Materac', art: 'materac' },
      H: { name: 'Lodówka turystyczna', art: 'lodowka' },
      I: { name: 'Parasol plażowy', art: 'parasol' },
      J: { name: 'Plecak', art: 'plecak' },
    },
  },
]

export type OrganizerMood = 'doubtful' | 'pleased' | 'proud'

/** `extraMoves` is placements minus pieces on the board; once the level is solved it equals the penalised moves in `levelPoints`. */
export function organizerMood(extraMoves: number): OrganizerMood {
  return extraMoves === 0 ? 'proud' : extraMoves <= 3 ? 'pleased' : 'doubtful'
}
