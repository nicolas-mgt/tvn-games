import { describe, expect, it } from 'vitest'
import { distanceKm, MAX_ROUND_SCORE, roundScore } from './gdzie-jest-martyna/logic'
import { priceScore } from './ile-za-grata/logic'
import { dealersOnlyResult, nextDealerBid } from './paleta-w-ciemno/logic'
import { distance, emojiImage } from './podloga/logic'
import { CITIES, cityPoints, isSettleable, MAX_DAY_POINTS, settle, type Temperatures } from './pogodynka/logic'
import { cellsAt, fits, LEVELS, parseLevel, rotate } from './poukladani/logic'
import { judgeMood } from './ukryte-kryterium/logic'
import gadgets from './ustrojstwo/data.json'
import zonk from './zonk/data.json'
import { addMontyResult, hostOpens, remainingDoor } from './zonk/logic'

describe('Gdzie jest Martyna', () => {
  it('measures great-circle distance', () => {
    expect(distanceKm({ lat: 52.23, lng: 21.01 }, { lat: 50.06, lng: 19.94 })).toBeCloseTo(252, -1)
    expect(distanceKm({ lat: 10, lng: 10 }, { lat: 10, lng: 10 })).toBe(0)
  })

  it('awards full points for a perfect guess and decays with distance', () => {
    expect(roundScore(0)).toBe(MAX_ROUND_SCORE)
    expect(roundScore(1400)).toBeGreaterThan(2000)
    expect(roundScore(1400)).toBeLessThan(3000)
    expect(roundScore(15000)).toBeLessThan(10)
  })
})

describe('Ile za tego grata', () => {
  it('scores by percentage error', () => {
    expect(priceScore(20000, 20000)).toBe(100)
    expect(priceScore(15000, 20000)).toBe(75)
    expect(priceScore(60000, 20000)).toBe(0)
  })
})

describe('Pogodynka', () => {
  const temps = (value: number) => Object.fromEntries(CITIES.map((c) => [c.id, value])) as Temperatures

  it('gives 10 points for exact guesses and loses 2 per degree', () => {
    expect(cityPoints(12, 12)).toBe(10)
    expect(cityPoints(10, 12.4)).toBe(5)
    expect(cityPoints(0, 20)).toBe(0)
  })

  it('settles only past, unsettled predictions', () => {
    const prediction = { targetDay: '2026-10-14', guesses: temps(10) }
    expect(isSettleable(prediction, '2026-10-15')).toBe(true)
    expect(isSettleable({ ...prediction, targetDay: '2026-10-15' }, '2026-10-15')).toBe(false)
    const settled = settle(prediction, temps(10))
    expect(settled.points).toBe(MAX_DAY_POINTS)
    expect(isSettleable(settled, '2026-10-20')).toBe(false)
  })
})

describe('Podłoga', () => {
  it('measures grid distance between tiles', () => {
    expect(distance(12, 12)).toBe(0)
    expect(distance(12, 13)).toBe(1)
    expect(distance(0, 24)).toBe(8)
    expect(distance(4, 20)).toBe(8)
  })

  it('maps emoji to OpenMoji file names without the variation selector', () => {
    expect(emojiImage('🐘')).toBe('/podloga/items/1F418.svg')
    expect(emojiImage('🐿️')).toBe('/podloga/items/1F43F.svg')
  })
})

describe('Co to za ustrojstwo', () => {
  it('has a credited photo for every gadget', () => {
    const photos = import.meta.glob('/public/ustrojstwo/items/*.jpg')
    expect(gadgets.filter((g) => !photos[`/public/ustrojstwo/items/${g.id}.jpg`]).map((g) => g.id)).toEqual([])
    expect(gadgets.filter((g) => !g.photo.author || !g.photo.license || !g.photo.source).map((g) => g.id)).toEqual([])
  })
})

describe('Ukryte kryterium', () => {
  it('picks the judge mood from the points', () => {
    expect(judgeMood(5)).toBe('impressed')
    expect(judgeMood(3)).toBe('neutral')
    expect(judgeMood(1)).toBe('bored')
    expect(judgeMood(0)).toBe('disgusted')
  })
})

describe('Zonk', () => {
  it('never opens the prize or the picked door', () => {
    for (let prize = 0; prize < 3; prize++) {
      for (let picked = 0; picked < 3; picked++) {
        const opened = hostOpens(prize, picked, Math.random)
        expect(opened).not.toBe(prize)
        expect(opened).not.toBe(picked)
        expect(remainingDoor(picked, opened)).not.toBe(picked)
      }
    }
  })

  it('tracks switch and stay results separately', () => {
    const empty = { switchPlays: 0, switchWins: 0, stayPlays: 0, stayWins: 0 }
    expect(addMontyResult(addMontyResult(empty, true, true), false, false)).toEqual({ switchPlays: 1, switchWins: 1, stayPlays: 1, stayWins: 0 })
  })

  it('has a credited photo for every prize and zonk', () => {
    const photos = import.meta.glob('/public/zonk/items/*.jpg')
    const items = [...zonk.prizes, ...zonk.zonks]
    expect(items.filter((i) => !photos[`/public/zonk/items/${i.id}.jpg`]).map((i) => i.id)).toEqual([])
    expect(items.filter((i) => !i.photo.author || !i.photo.license || !i.photo.source).map((i) => i.id)).toEqual([])
  })
})

describe('Paleta w ciemno', () => {
  it('only lets dealers outbid within their limit', () => {
    expect(nextDealerBid([500, 300], 400, 'player', () => 0)).toBe(0)
    expect(nextDealerBid([500, 300], 500, 'player', () => 0)).toBeNull()
    expect(nextDealerBid([500, 900], 500, 1, () => 0)).toBeNull()
  })

  it('sells to the top dealer one step above the runner-up', () => {
    expect(dealersOnlyResult([800, 500, 300], 200)).toEqual({ winner: 0, price: 600 })
    expect(dealersOnlyResult([800, 800], 200)).toEqual({ winner: 0, price: 800 })
    expect(dealersOnlyResult([50, 0], 0)).toBeNull()
  })
})

describe('Poukładani', () => {
  it('derives pieces that exactly cover each level', () => {
    for (const layout of LEVELS) {
      const level = parseLevel(layout)
      const occupied = new Set<string>()
      for (const piece of level.pieces) {
        const [row, col] = layout.flatMap((line, r) => [...line].flatMap((l, c) => (l === piece.id ? [[r, c]] : [])))[0]
        const cells = cellsAt(piece.cells, [row, col])
        expect(fits(cells, level, occupied)).toBe(true)
        cells.forEach(([r, c]) => occupied.add(`${r},${c}`))
      }
      expect(occupied.size).toBe(level.rows * level.cols)
    }
  })

  it('returns to the original shape after four rotations', () => {
    const shape = parseLevel(LEVELS[2]).pieces.find((p) => p.id === 'G')!.cells
    expect(rotate(rotate(rotate(rotate(shape))))).toEqual(shape)
    expect(rotate(shape)).not.toEqual(shape)
  })
})
