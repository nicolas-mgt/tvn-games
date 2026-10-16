import { pickN, shuffle, type Rng } from '@/shared/daily'

export const PER_KIND = 5
export const DECK_SIZE = PER_KIND * 2
export const SWIPE_THRESHOLD = 120

/** Always five real and five made-up headlines, in random order. */
export function buildDeck<T extends { real: boolean }>(headlines: readonly T[], rng: Rng = Math.random): T[] {
  const real = pickN(
    headlines.filter((h) => h.real),
    PER_KIND,
    rng,
  )
  const fake = pickN(
    headlines.filter((h) => !h.real),
    PER_KIND,
    rng,
  )
  return shuffle([...real, ...fake], rng)
}

export type AnchorMood = 'deadpan' | 'smug' | 'shocked'
export type SatiristMood = 'grin' | 'cheer' | 'mock'

/** `null` while the headline is still being read. */
export function hostMoods(correct: boolean | null): { anchor: AnchorMood; satirist: SatiristMood } {
  if (correct === null) return { anchor: 'deadpan', satirist: 'grin' }
  return correct ? { anchor: 'smug', satirist: 'cheer' } : { anchor: 'shocked', satirist: 'mock' }
}

/** The satirist's quip, keyed by whether the player was right and whether the headline was real. */
export const QUIPS: Record<'correct' | 'wrong', Record<'real' | 'fake', readonly string[]>> = {
  correct: {
    real: ['Tak, to się naprawdę wydarzyło. Świat jest dziwniejszy niż nasz scenariusz.', 'Trafione. Prawda bywa głupsza od ściemy.', 'Brawo. My też nie wierzyliśmy, dopóki nie sprawdziliśmy.'],
    fake: ['Ściema wykryta. Redakcja przeprasza, ale nie bardzo.', 'Nie dało się ciebie nabrać. Szkoda, mieliśmy już nagłówek na jutro.', 'Celnie. To zmyśliliśmy w przerwie na kawę.'],
  },
  wrong: {
    real: ['A jednak prawda. Rzeczywistość znowu przebiła satyrę.', 'Ściema? Niestety nie. To było w prawdziwych wiadomościach.', 'Pudło. Też byśmy nie uwierzyli, ale źródło nie kłamie.'],
    fake: ['Nabrane! Tego nie było nigdzie poza naszym biurkiem.', 'Kupione w całości. Mamy jeszcze na sprzedaż most.', 'Pudło. To wymyśliliśmy pięć minut przed wejściem na antenę.'],
  },
}

export function quipFor(correct: boolean, real: boolean, index: number): string {
  const lines = QUIPS[correct ? 'correct' : 'wrong'][real ? 'real' : 'fake']
  return lines[index % lines.length]
}
