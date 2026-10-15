import { addDays, todayKey } from './daily'

export type GameStats = {
  plays: number
  best: number
  lastPlayed: string | null
  streak: number
}

const EMPTY_STATS: GameStats = { plays: 0, best: 0, lastPlayed: null, streak: 0 }

export function loadJSON<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  return raw === null ? fallback : (JSON.parse(raw) as T)
}

export function saveJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

const statsKey = (slug: string) => `slop-games:stats:${slug}`

export function loadStats(slug: string): GameStats {
  return loadJSON(statsKey(slug), EMPTY_STATS)
}

export function nextStats(stats: GameStats, score: number, day: string): GameStats {
  const streak =
    stats.lastPlayed === day
      ? stats.streak
      : stats.lastPlayed === addDays(day, -1)
        ? stats.streak + 1
        : 1
  return {
    plays: stats.plays + 1,
    best: Math.max(stats.best, score),
    lastPlayed: day,
    streak,
  }
}

export function recordResult(slug: string, score: number, day = todayKey()) {
  const previous = loadStats(slug)
  const stats = nextStats(previous, score, day)
  saveJSON(statsKey(slug), stats)
  return { stats, isNewBest: score > previous.best }
}
