import { describe, expect, it } from 'vitest'
import { matchesAnswer } from './answer'
import { addDays, dailyRng, pickN, todayKey } from './daily'
import { nextStats } from './storage'

describe('daily seed', () => {
  it('gives the same sequence for the same game and day', () => {
    const a = dailyRng('danie', '2026-10-15')
    const b = dailyRng('danie', '2026-10-15')
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('differs between days', () => {
    expect(dailyRng('danie', '2026-10-15')()).not.toBe(dailyRng('danie', '2026-10-16')())
  })

  it('picks distinct items deterministically', () => {
    const items = [1, 2, 3, 4, 5, 6]
    const picked = pickN(items, 4, dailyRng('x', '2026-01-01'))
    expect(new Set(picked).size).toBe(4)
    expect(picked).toEqual(pickN(items, 4, dailyRng('x', '2026-01-01')))
  })

  it('formats and shifts day keys across month boundaries', () => {
    expect(todayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('nextStats', () => {
  const base = { plays: 3, best: 10, lastPlayed: '2026-10-14', streak: 2 }

  it('extends the streak on the next day and keeps the best score', () => {
    expect(nextStats(base, 5, '2026-10-15')).toEqual({ plays: 4, best: 10, lastPlayed: '2026-10-15', streak: 3 })
  })

  it('keeps the streak on the same day and resets it after a gap', () => {
    expect(nextStats(base, 12, '2026-10-14').streak).toBe(2)
    expect(nextStats(base, 12, '2026-10-20')).toMatchObject({ best: 12, streak: 1 })
  })
})

describe('matchesAnswer', () => {
  it('ignores case, diacritics and small typos', () => {
    expect(matchesAnswer('ŻÓŁW', ['żółw'])).toBe(true)
    expect(matchesAnswer('pierogi rskie', ['pierogi ruskie'])).toBe(true)
    expect(matchesAnswer('bigos', ['pierogi ruskie'])).toBe(false)
  })
})
