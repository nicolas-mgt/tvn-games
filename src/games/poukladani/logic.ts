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
