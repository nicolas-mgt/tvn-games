import { describe, expect, it } from 'vitest'
import { DISHES, dishScore, ingredientIcon, juryMood } from './danie-po-skladnikach/logic'
import dishIcons from './danie-po-skladnikach/icons.json'
import { playLeg, placeOf, slowestTeam, START_TEAMS, teamMood, travel, type Team } from './express-za-dolara/logic'
import martynaPlaces from './gdzie-jest-martyna/data.json'
import { distanceKm, MAX_ROUND_SCORE, MAX_SCORE as MARTYNA_MAX_SCORE, project, roundScore, travelerMood, unproject } from './gdzie-jest-martyna/logic'
import cars from './ile-za-grata/data.json'
import { dealerMood, priceScore } from './ile-za-grata/logic'
import pallets from './paleta-w-ciemno/data.json'
import { dealersOnlyResult, nextDealerBid } from './paleta-w-ciemno/logic'
import { distance, emojiImage } from './podloga/logic'
import { CITIES, cityPoints, countdownTo, isSettleable, MAP_H, MAP_W, MAX_DAY_POINTS, presenterMood, project as projectPoland, settle, weatherKind, type Temperatures } from './pogodynka/logic'
import ktoData from './kto-to-powiedzial/data.json'
import { buildDeck as buildQuoteDeck, castMood, QUOTES_PER_GAME, SOURCE_IDS } from './kto-to-powiedzial/logic'
import { cellsAt, fits, FURNITURE, LEVELS, MAX_SCORE, organizerMood, parseLevel, rotate } from './poukladani/logic'
import headlines from './prawda-czy-sciema/data.json'
import toPanWords from './to-pan-tego-nie-wie/data.json'
import { entriesFor, hintFor, LOOKS, lookFor, pointsFor } from './to-pan-tego-nie-wie/logic'
import { buildDeck, DECK_SIZE, hostMoods, PER_KIND } from './prawda-czy-sciema/logic'
import { contestantMood } from './rajskie-rozdanie/logic'
import sciema from './sciema-z-ogloszenia/data.json'
import { reporterMood } from './sciema-z-ogloszenia/logic'
import { judgeMood } from './ukryte-kryterium/logic'
import { applyEffects, chefMood, endingFor, ownerMood, START_STATS, statLevel } from './uratuj-knajpe/logic'
import stylizacja from './stylizacja/data.json'
import { jurorMood, jurorScore, SLOTS, themeFit, type Item, type Outfit } from './stylizacja/logic'
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
    expect(MARTYNA_MAX_SCORE).toBe(25000)
  })

  it('projects onto the map and back', () => {
    const warsaw = project({ lat: 52.23, lng: 21.01 })
    expect(warsaw.x).toBeCloseTo(2010.1)
    expect(warsaw.y).toBeCloseTo(277.7)
    const { x, y } = project({ lat: -33.9, lng: 151.2 })
    const back = unproject(x, y)
    expect(back.lat).toBeCloseTo(-33.9)
    expect(back.lng).toBeCloseTo(151.2)
  })

  it('maps distance to the traveler mood', () => {
    expect(travelerMood(0)).toBe('thrilled')
    expect(travelerMood(500)).toBe('thrilled')
    expect(travelerMood(501)).toBe('pleased')
    expect(travelerMood(2500)).toBe('pleased')
    expect(travelerMood(2501)).toBe('worried')
  })

  it('has a unique id and a credited photo for every place', () => {
    const photos = import.meta.glob('/public/gdzie-jest-martyna/places/*.jpg')
    expect(new Set(martynaPlaces.map((p) => p.id)).size).toBe(martynaPlaces.length)
    expect(martynaPlaces.filter((p) => !photos[`/public/gdzie-jest-martyna/places/${p.id}.jpg`]).map((p) => p.id)).toEqual([])
    expect(martynaPlaces.filter((p) => !p.photo.author || !p.photo.license || !p.photo.source).map((p) => p.id)).toEqual([])
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

describe('To Pan tego nie wie', () => {
  it('scores 3, 2 or 1 point by attempt and nothing when unsolved', () => {
    expect([1, 2, 3].map((n) => pointsFor(n, true))).toEqual([3, 2, 1])
    expect(pointsFor(3, false)).toBe(0)
  })

  it('reveals the length, then the first letter, keeping gaps between words', () => {
    expect(hintFor('kawa', 0)).toBeNull()
    expect(hintFor('kawa', 1)).toEqual(['', '', '', ''])
    expect(hintFor('kawa', 2)).toEqual(['k', '', '', ''])
    expect(hintFor('rachunek za prąd', 2)?.map((t) => t || '_').join('')).toBe('r_______ __ ____')
  })

  it('gives every kid a stable, valid look', () => {
    for (const { kid } of toPanWords) {
      const look = lookFor(kid)
      expect(lookFor(kid)).toEqual(look)
      expect(LOOKS.hair).toContain(look.hair)
      expect(LOOKS.hairColor).toContain(look.hairColor)
      expect(LOOKS.shirt).toContain(look.shirt)
      expect(LOOKS.skin).toContain(look.skin)
    }
  })

  it('deals the same daily words twice and has 30 complete entries', () => {
    expect(entriesFor('daily').map((e) => e.word)).toEqual(entriesFor('daily').map((e) => e.word))
    expect(new Set(toPanWords.map((e) => e.word)).size).toBe(30)
    expect(toPanWords.filter((e) => !e.kid || !e.definition || !Array.isArray(e.aliases))).toEqual([])
  })
})

describe('Kto to powiedział', () => {
  it('deals 10 unique quotes split 4/3/3 between the sources', () => {
    for (let i = 0; i < 200; i++) {
      const deck = buildQuoteDeck(ktoData.quotes)
      expect(deck).toHaveLength(QUOTES_PER_GAME)
      expect(new Set(deck.map((q) => q.id)).size).toBe(QUOTES_PER_GAME)
      const counts = SOURCE_IDS.map((s) => deck.filter((q) => q.source === s).length).sort()
      expect(counts).toEqual([3, 3, 4])
    }
  })

  it('has ten quotes per known source with unique ids', () => {
    expect(new Set(ktoData.quotes.map((q) => q.id)).size).toBe(ktoData.quotes.length)
    expect(ktoData.sources.map((s) => s.id)).toEqual([...SOURCE_IDS])
    for (const source of SOURCE_IDS) expect(ktoData.quotes.filter((q) => q.source === source)).toHaveLength(10)
  })

  it('sets each cast member mood from the answer', () => {
    expect(castMood('celebryta', null, 'generator')).toBe('waiting')
    expect(castMood('generator', 'generator', 'generator')).toBe('proud')
    expect(castMood('celebryta', 'generator', 'generator')).toBe('watching')
    expect(castMood('celebryta', 'celebryta', 'generator')).toBe('denying')
    expect(castMood('generator', 'celebryta', 'generator')).toBe('proud')
    expect(castMood('rodzina', 'celebryta', 'generator')).toBe('eyeroll')
    expect(castMood('rodzina', 'rodzina', 'generator')).toBe('eyeroll')
    expect(castMood('rodzina', 'generator', 'generator')).toBe('watching')
    expect(castMood('rodzina', 'celebryta', 'rodzina')).toBe('proud')
  })
})

describe('Prawda czy ściema', () => {
  it('always deals five real and five made-up headlines', () => {
    for (let i = 0; i < 200; i++) {
      const deck = buildDeck(headlines)
      expect(deck).toHaveLength(DECK_SIZE)
      expect(new Set(deck.map((h) => h.id)).size).toBe(DECK_SIZE)
      expect(deck.filter((h) => h.real)).toHaveLength(PER_KIND)
    }
  })

  it('links a Wikipedia source for every real headline and none for made-up ones', () => {
    expect(new Set(headlines.map((h) => h.id)).size).toBe(headlines.length)
    expect(headlines.filter((h) => h.real).length).toBeGreaterThanOrEqual(PER_KIND)
    expect(headlines.filter((h) => !h.real).length).toBeGreaterThanOrEqual(PER_KIND)
    expect(headlines.filter((h) => h.real && !/^https:\/\/(en|pl)\.wikipedia\.org\/wiki\//.test(h.source ?? '')).map((h) => h.id)).toEqual([])
    expect(headlines.filter((h) => !h.real && h.source).map((h) => h.id)).toEqual([])
  })

  it('sets the hosts mood from the answer', () => {
    expect(hostMoods(null)).toEqual({ anchor: 'deadpan', satirist: 'grin' })
    expect(hostMoods(true)).toEqual({ anchor: 'smug', satirist: 'cheer' })
    expect(hostMoods(false)).toEqual({ anchor: 'shocked', satirist: 'mock' })
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

  it('maps WMO weather codes to icons', () => {
    expect([0, 1, 2, 3, 45, 61, 81, 73, 95].map(weatherKind)).toEqual(['sun', 'sun', 'partly', 'cloud', 'fog', 'rain', 'rain', 'snow', 'storm'])
  })

  it('picks the presenter mood from the points', () => {
    expect([null, 50, 40, 39, 25, 24, 10, 9, 0].map(presenterMood)).toEqual(['neutral', 'delighted', 'delighted', 'pleased', 'pleased', 'unsure', 'unsure', 'oops', 'oops'])
  })

  it('places every city on the map in geographic order', () => {
    const at = Object.fromEntries(CITIES.map((c) => [c.id, projectPoland(c.lat, c.lng)]))
    for (const { x, y } of Object.values(at)) {
      expect(x).toBeGreaterThan(0)
      expect(x).toBeLessThan(MAP_W)
      expect(y).toBeGreaterThan(0)
      expect(y).toBeLessThan(MAP_H)
    }
    expect(at.gdansk.y).toBeLessThan(at.krakow.y)
    expect(at.poznan.x).toBeLessThan(at.warszawa.x)
  })

  it('counts down to midnight after the target day', () => {
    expect(countdownTo('2026-10-17', new Date(2026, 9, 17, 23, 0))).toBe(60 * 60 * 1000)
    expect(countdownTo('2026-10-17', new Date(2026, 9, 18, 0, 0, 1))).toBe(0)
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

  it('gives every piece of every level a named item and art', () => {
    expect(FURNITURE).toHaveLength(LEVELS.length)
    LEVELS.forEach((layout, i) => {
      const ids = parseLevel(layout).pieces.map((p) => p.id).sort()
      expect(Object.keys(FURNITURE[i].items).sort()).toEqual(ids)
    })
    const arts = FURNITURE.flatMap((f) => Object.values(f.items).map((item) => item.art))
    expect(new Set(arts).size).toBe(arts.length)
    expect(MAX_SCORE).toBe(300)
  })

  it('maps extra moves to the organizer mood', () => {
    expect(organizerMood(0)).toBe('proud')
    expect(organizerMood(1)).toBe('pleased')
    expect(organizerMood(3)).toBe('pleased')
    expect(organizerMood(4)).toBe('doubtful')
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

describe('Danie po składnikach', () => {
  it('scores 7 minus revealed ingredients on a win', () => {
    expect(dishScore(1, true)).toBe(6)
    expect(dishScore(6, true)).toBe(1)
    expect(dishScore(6, false)).toBe(0)
  })

  it('makes the jury happier with fewer ingredients, with per-juror bias', () => {
    expect(juryMood({ revealed: 2, outcome: 'won', juror: 'molekularny' })).toBe('delighted')
    expect(juryMood({ revealed: 2, outcome: 'won', juror: 'szef' })).toBe('pleased')
    expect(juryMood({ revealed: 4, outcome: 'won', juror: 'molekularny' })).toBe('pleased')
    expect(juryMood({ revealed: 6, outcome: 'won', juror: 'cukierniczka' })).toBe('pleased')
    expect(juryMood({ revealed: 6, outcome: 'lost', juror: 'szef' })).toBe('disappointed')
    expect(juryMood({ revealed: 6, outcome: 'lost', juror: 'cukierniczka' })).toBe('doubtful')
    expect(juryMood({ revealed: 3, outcome: null, juror: 'molekularny' })).toBe('pleased')
    expect(juryMood({ revealed: 5, outcome: null, juror: 'szef' })).toBe('disappointed')
    expect(juryMood({ revealed: 1, outcome: null, juror: 'cukierniczka' })).toBe('delighted')
  })

  it('maps every ingredient to an OpenMoji file or a hint', () => {
    const files = import.meta.glob('/public/danie-po-skladnikach/icons/*.svg')
    const ingredients = [...new Set(DISHES.flatMap((d) => d.ingredients))]
    expect(ingredients.filter((i) => !(i in dishIcons))).toEqual([])
    expect(ingredients.map(ingredientIcon).filter((code) => code && !files[`/public/danie-po-skladnikach/icons/${code}.svg`])).toEqual([])
    expect(ingredientIcon('jajko')).toBe('1F95A')
    expect(ingredientIcon('duszone kilka dni')).toBeNull()
  })

  it('has a credited photo for every dish', () => {
    const photos = import.meta.glob('/public/danie-po-skladnikach/dishes/*.jpg')
    expect(DISHES.filter((d) => !photos[`/public/danie-po-skladnikach/dishes/${d.id}.jpg`]).map((d) => d.id)).toEqual([])
    expect(DISHES.filter((d) => !d.photo?.author || !d.photo.license || !d.photo.source).map((d) => d.id)).toEqual([])
  })
})

describe('Stylizacja w 60 sekund', () => {
  const items = stylizacja.items as Item[]
  const item = (id: string) => items.find((i) => i.id === id)!
  const theme = (name: string) => stylizacja.themes.find((t) => t.name === name)!

  it('scores theme fit with wanted, forbidden and empty slots', () => {
    expect(themeFit({}, theme('Gala w operze'))).toBe(-10)
    expect(themeFit({ gora: item('koszula') }, theme('Rozmowa o pracę w korpo'))).toBe(-4)
    expect(themeFit({ glowa: item('czapka') }, theme('Gala w operze'))).toBe(-11)
  })

  it('keeps juror scores between 1 and 10 and applies bias', () => {
    const gala = theme('Gala w operze')
    const best: Outfit = { glowa: item('korona'), gora: item('plaszcz'), dol: item('sukienka'), buty: item('szpilki'), dodatek: item('torebka') }
    expect(jurorScore({}, gala, 0)).toBe(1)
    expect(jurorScore(best, gala, 0)).toBe(10)
    const half: Outfit = { gora: item('koszula'), dol: item('sukienka') }
    expect(jurorScore(half, gala, 2) - jurorScore(half, gala, 0)).toBe(2)
  })

  it('maps juror scores to moods', () => {
    expect([1, 4, 5, 7, 8, 10].map(jurorMood)).toEqual(['unimpressed', 'unimpressed', 'ok', 'ok', 'thrilled', 'thrilled'])
  })

  it('has consistent themes and items', () => {
    expect(stylizacja.themes.filter((t) => !t.wanted.length || !t.forbidden.length).map((t) => t.name)).toEqual([])
    expect(items.filter((i) => !(SLOTS as readonly string[]).includes(i.slot)).map((i) => i.id)).toEqual([])
  })
})
