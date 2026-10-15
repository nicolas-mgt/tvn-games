import Fuse from 'fuse.js'

export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replaceAll('ł', 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Typo-tolerant check: "pierogi rskie" still matches "pierogi ruskie". */
export function matchesAnswer(input: string, acceptedAnswers: readonly string[]): boolean {
  const guess = normalizeAnswer(input)
  if (guess.length < 2) return false
  const accepted = acceptedAnswers.map(normalizeAnswer)
  if (accepted.includes(guess)) return true
  const fuse = new Fuse(accepted, { threshold: 0.3, includeScore: true })
  const [best] = fuse.search(guess)
  return best !== undefined && Math.abs(best.item.length - guess.length) <= 3
}
