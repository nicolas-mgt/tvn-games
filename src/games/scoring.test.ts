import { describe, expect, it } from 'vitest'
import { playLeg, placeOf, slowestTeam, START_TEAMS, teamMood, travel, type Team } from './express-za-dolara/logic'
import { distanceKm, MAX_ROUND_SCORE, roundScore } from './gdzie-jest-martyna/logic'
import cars from './ile-za-grata/data.json'
import { dealerMood, priceScore } from './ile-za-grata/logic'
import pallets from './paleta-w-ciemno/data.json'
import { dealersOnlyResult, nextDealerBid } from './paleta-w-ciemno/logic'
import { distance, emojiImage } from './podloga/logic'
import { CITIES, cityPoints, isSettleable, MAX_DAY_POINTS, settle, type Temperatures } from './pogodynka/logic'
import { cellsAt, fits, LEVELS, parseLevel, rotate } from './poukladani/logic'
import { contestantMood } from './rajskie-rozdanie/logic'
import sciema from './sciema-z-ogloszenia/data.json'
import { reporterMood } from './sciema-z-ogloszenia/logic'
import { judgeMood } from './ukryte-kryterium/logic'
import { applyEffects, chefMood, endingFor, ownerMood, START_STATS, statLevel } from './uratuj-knajpe/logic'
import gadgets from './ustrojstwo/data.json'
import zonk from './zonk/data.json'
import { banish, gameStatus, PLAYER, residentMood, statementText, type Resident } from './zdrajca/logic'
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

  it('picks the dealer mood from the guess', () => {
    expect(dealerMood(20000, 20000)).toBe('impressed')
    expect(dealerMood(40000, 20000)).toBe('greedy')
    expect(dealerMood(10000, 20000)).toBe('offended')
  })

  it('has a credited photo for every car', () => {
    const photos = import.meta.glob('/public/ile-za-grata/cars/*.jpg')
    expect(cars.listings.filter((c) => !photos[`/public/ile-za-grata/cars/${c.id}.jpg`]).map((c) => c.id)).toEqual([])
    expect(cars.listings.filter((c) => !c.photo.author || !c.photo.license || !c.photo.source).map((c) => c.id)).toEqual([])
  })
})

describe('Ściema z ogłoszenia', () => {
  it('picks the reporter mood from the last click and the clock', () => {
    expect(reporterMood({ lastClick: 'hit', remaining: 30, reviewing: false })).toBe('pleased')
    expect(reporterMood({ lastClick: 'miss', remaining: 30, reviewing: false })).toBe('disappointed')
    expect(reporterMood({ lastClick: null, remaining: 5, reviewing: false })).toBe('alarmed')
    expect(reporterMood({ lastClick: null, remaining: 30, reviewing: false })).toBe('suspicious')
  })

  it('has a credited photo for every ad', () => {
    const photos = import.meta.glob('/public/sciema-z-ogloszenia/cars/*.jpg')
    expect(sciema.listings.filter((a) => !photos[`/public/sciema-z-ogloszenia/cars/${a.id}.jpg`]).map((a) => a.id)).toEqual([])
    expect(sciema.listings.filter((a) => !a.photo.author || !a.photo.license || !a.photo.source).map((a) => a.id)).toEqual([])
  })
})

describe('Rajskie Rozdanie', () => {
  it('picks the contestant mood from affection thresholds', () => {
    expect(contestantMood({ affection: 7, alive: true })).toBe('fan')
    expect(contestantMood({ affection: 6, alive: true })).toBe('neutral')
    expect(contestantMood({ affection: 4, alive: true })).toBe('neutral')
    expect(contestantMood({ affection: 3, alive: true })).toBe('cold')
  })

  it('lets a fresh reaction override the mood, but not elimination', () => {
    expect(contestantMood({ affection: 2, reaction: 'smitten', alive: true })).toBe('smitten')
    expect(contestantMood({ affection: 9, reaction: 'hurt', alive: false })).toBe('out')
  })
})

describe('Zdrajca', () => {
  it('builds statements with gendered forms and instrumental names', () => {
    expect(statementText('Lady Pamela', 'Kuchnia', ['Ty', 'Lokaj Alfred', 'Major Ryszard'])).toBe('Byłam w Kuchni z Tobą, Lokajem Alfredem i Majorem Ryszardem.')
    expect(statementText('Profesor Wit', 'Ogród', [])).toBe('Byłem w Ogrodzie sam.')
  })

  const calm = { alive: true, unmasked: false, votesAgainst: 0, votedByPlayer: false, accusesPlayer: false }
  const castle = (roles: Resident['role'][], dead: number[] = []): Resident[] =>
    roles.map((role, i) => ({ name: `R${i}`, role, alive: !dead.includes(i) }))

  it('picks the resident mood in priority order', () => {
    expect(residentMood(calm)).toBe('calm')
    expect(residentMood({ ...calm, accusesPlayer: true })).toBe('suspicious')
    expect(residentMood({ ...calm, accusesPlayer: true, votesAgainst: 2 })).toBe('nervous')
    expect(residentMood({ ...calm, votesAgainst: 3, votedByPlayer: true })).toBe('offended')
    expect(residentMood({ ...calm, votedByPlayer: true, unmasked: true })).toBe('sly')
    expect(residentMood({ ...calm, unmasked: true, alive: false })).toBe('out')
  })

  it('ends the game when traitors are gone, outnumber loyals or the player dies', () => {
    expect(gameStatus(castle(['lojalny', 'zdrajca', 'lojalny', 'zdrajca', 'lojalny']))).toBe('ongoing')
    expect(gameStatus(castle(['lojalny', 'zdrajca', 'lojalny', 'zdrajca'], [1, 3]))).toBe('win')
    expect(gameStatus(castle(['lojalny', 'zdrajca', 'lojalny', 'zdrajca'], [2]))).toBe('lose')
    expect(gameStatus(castle(['lojalny', 'zdrajca', 'lojalny', 'lojalny', 'lojalny'], [PLAYER]))).toBe('lose')
  })

  it('banishes the resident with the most votes', () => {
    expect(banish([{ voter: 0, target: 2 }, { voter: 1, target: 2 }, { voter: 2, target: 1 }], () => 0)).toBe(2)
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
  it('has a credited photo for every pallet item', () => {
    const photos = import.meta.glob('/public/paleta-w-ciemno/items/*.jpg')
    const items = pallets.flatMap((p) => p.contents)
    expect(items.filter((i) => !photos[`/public/paleta-w-ciemno/items/${i.id}.jpg`]).map((i) => i.id)).toEqual([])
    expect(items.filter((i) => !i.photo.author || !i.photo.license || !i.photo.source).map((i) => i.id)).toEqual([])
  })

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

describe('Express za dolara', () => {
  const seq = (...values: number[]) => {
    let i = 0
    return () => values[i++ % values.length]
  }
  const teams = (...hours: (number | null)[]): Team[] => hours.map((h, i) => ({ name: `T${i}`, hours: h ?? 0, alive: h !== null }))

  it('prices each transport', () => {
    expect(travel('autostop', () => 0)).toEqual({ hours: 3, money: 0 })
    expect(travel('autostop', () => 0.999)).toEqual({ hours: 14, money: 0 })
    expect(travel('praca', Math.random)).toEqual({ hours: 9, money: 1 })
    expect(travel('bus', Math.random)).toEqual({ hours: 5, money: -3 })
  })

  it('finds the slowest racing team, first one on a tie', () => {
    expect(slowestTeam(teams(10, 10, 5))).toBe(0)
    expect(slowestTeam(teams(null, 10, 5))).toBe(1)
  })

  it('ranks teams by hours with shared places on a tie', () => {
    expect(placeOf(teams(8, 5, 8), 0)).toBe(2)
    expect(placeOf(teams(8, 5, 8), 1)).toBe(1)
    expect(placeOf(teams(8, null, 3), 0)).toBe(2)
  })

  it('adds the daily dollar and bot hours on a quiet leg', () => {
    const result = playLeg({ teams: START_TEAMS, leg: 0, money: 1, amulet: false }, 'praca', seq(0.9, 0, 0.99))
    expect(result.event).toBeNull()
    expect(result.money).toBe(3)
    expect(result.teams.map((t) => t.hours)).toEqual([9, 5, 11])
    expect(result.eliminated).toBeNull()
  })

  it('applies a drawn event', () => {
    const result = playLeg({ teams: START_TEAMS, leg: 0, money: 3, amulet: false }, 'bus', seq(0.1, 0.3, 0, 0))
    expect(result.event?.id).toBe('amulet')
    expect(result.amulet).toBe(true)
    expect(result.money).toBe(1)
  })

  it('eliminates the slowest team after leg 2 unless the player has the amulet', () => {
    const state = { teams: START_TEAMS, leg: 1, money: 1 }
    const out = playLeg({ ...state, amulet: false }, 'praca', seq(0.9, 0, 0))
    expect(out.eliminated).toBe(0)
    expect(out.teams[0].alive).toBe(false)
    const saved = playLeg({ ...state, amulet: true }, 'praca', seq(0.9, 0, 0))
    expect(saved).toMatchObject({ eliminated: null, saved: true, amulet: false })
    expect(saved.teams.every((t) => t.alive)).toBe(true)
  })

  it('picks team moods in priority order', () => {
    const base = { alive: true, place: 1, saved: false, eliminatedNow: false }
    expect(teamMood({ ...base, eliminatedNow: true, saved: true })).toBe('out')
    expect(teamMood({ ...base, place: 3, saved: true })).toBe('cheer')
    expect(teamMood(base)).toBe('happy')
    expect(teamMood({ ...base, place: 2 })).toBe('tired')
    expect(teamMood({ ...base, place: 3 })).toBe('worried')
  })
})

describe('Uratuj knajpę', () => {
  it('clamps stats to 0–10', () => {
    expect(applyEffects(START_STATS, { jakosc: 2, kasa: -1 })).toEqual({ jakosc: 5, atmosfera: 3, kasa: 2 })
    expect(applyEffects({ jakosc: 9, atmosfera: 1, kasa: 3 }, { jakosc: 3, atmosfera: -2 })).toEqual({ jakosc: 10, atmosfera: 0, kasa: 3 })
    expect(applyEffects(START_STATS)).toEqual(START_STATS)
  })

  it('maps stats to three room levels', () => {
    expect([0, 3, 4, 6, 7, 10].map(statLevel)).toEqual([0, 0, 1, 1, 2, 2])
  })

  it('picks the ending by score thresholds', () => {
    expect(endingFor(30).min).toBe(19)
    expect(endingFor(19).min).toBe(19)
    expect(endingFor(18).min).toBe(15)
    expect(endingFor(15).min).toBe(15)
    expect(endingFor(11).min).toBe(11)
    expect(endingFor(10).min).toBe(0)
    expect(endingFor(0).min).toBe(0)
  })

  it('picks the chef mood in priority order', () => {
    expect(chefMood(null)).toBe('stern')
    expect(chefMood({ text: '', ending: 'kluski', effects: { jakosc: 3 } })).toBe('appalled')
    expect(chefMood({ text: '', effects: { jakosc: 2, atmosfera: 1, kasa: -1 } })).toBe('delighted')
    expect(chefMood({ text: '', effects: { jakosc: 2, atmosfera: -1 } })).toBe('approving')
    expect(chefMood({ text: '', effects: { kasa: 1, atmosfera: -1 } })).toBe('stern')
    expect(chefMood({ text: '', effects: { atmosfera: -2 } })).toBe('appalled')
  })

  it('picks the owner mood by the sign of the effects', () => {
    expect(ownerMood({ text: '', effects: { atmosfera: 2 } })).toBe('happy')
    expect(ownerMood({ text: '', effects: { kasa: 1, atmosfera: -1 } })).toBe('neutral')
    expect(ownerMood({ text: '', effects: { jakosc: -2, kasa: -1 } })).toBe('upset')
    expect(ownerMood({ text: '', ending: 'kluski' })).toBe('upset')
  })
})
