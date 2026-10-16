import { pickN, randomInt, shuffle, type Rng } from '@/shared/daily'

export const QUOTES_PER_GAME = 10
export const SOURCE_IDS = ['celebryta', 'rodzina', 'generator'] as const
export type SourceId = (typeof SOURCE_IDS)[number]

/** 4/3/3 split, with a random source getting the extra quote, shuffled together. */
export function buildDeck<T extends { source: string }>(quotes: readonly T[], rng: Rng = Math.random): T[] {
  const bonus = randomInt(rng, 0, SOURCE_IDS.length - 1)
  const picked = SOURCE_IDS.flatMap((source, i) =>
    pickN(
      quotes.filter((q) => q.source === source),
      i === bonus ? 4 : 3,
      rng,
    ),
  )
  return shuffle(picked, rng)
}

export type CastMood = 'waiting' | 'proud' | 'denying' | 'watching' | 'eyeroll'

/** `answer` is `null` before the player picks a source. */
export function castMood(id: SourceId, answer: string | null, source: string): CastMood {
  if (answer === null) return 'waiting'
  if (id === source) return 'proud'
  if (id === 'rodzina' && answer !== source) return 'eyeroll'
  return id === answer ? 'denying' : 'watching'
}

/** What the real source says once revealed, keyed by whether the player guessed right. */
export const REACTIONS: Record<SourceId, Record<'correct' | 'wrong', readonly string[]>> = {
  celebryta: {
    correct: ['Tak, to moje! Cytujcie śmiało, tylko z oznaczeniem.', 'Oczywiście, że ja. Kto inny mówiłby tak pięknie?', 'Mój menedżer zaraz to wrzuci na kubki.'],
    wrong: ['Pomylić mnie? To boli bardziej niż brak zaproszenia na galę.', 'Ja to powiedziałam! Proszę zapisać i oprawić w ramkę.', 'Kochanie, to był mój cytat roku.'],
  },
  rodzina: {
    correct: ['No, to nasze. Halina, słyszałaś? Jesteśmy w telewizji!', 'Tak, to tata. On tak zawsze przy kolacji.', 'Babcia mówi, że to ona, ale to był dziadek.'],
    wrong: ['Panie, to my! Prosto z kanapy, bez scenariusza.', 'Jak to nie my? Mamy świadków, cały blok słyszał.', 'Przecież tak się mówi u nas w domu od zawsze.'],
  },
  generator: {
    correct: ['BIP. Potwierdzam autorstwo. Synergia osiągnięta.', 'BIP. Wygenerowano z dumą w 0,02 sekundy.', 'BIP. Twoja trafność skalowalnie rośnie.'],
    wrong: ['BIP. Błąd rozpoznania. Ja to wygenerowałem.', 'BIP. Pomyliłeś bełkot z mądrością. To częste.', 'BIP. Mój algorytm czuje się niedoceniony.'],
  },
}

export function reactionFor(source: SourceId, correct: boolean, index: number): string {
  const lines = REACTIONS[source][correct ? 'correct' : 'wrong']
  return lines[index % lines.length]
}
