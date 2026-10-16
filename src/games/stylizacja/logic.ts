export const SLOTS = ['glowa', 'gora', 'dol', 'buty', 'dodatek'] as const
export type Slot = (typeof SLOTS)[number]
export type Item = { id: string; slot: string; emoji: string; name: string; tags: string[] }
export type Theme = { name: string; wanted: string[]; forbidden: string[] }
export type Outfit = Partial<Record<Slot, Item>>

export type Phase = 'lobby' | 'dressing' | 'runway' | 'jury' | 'result'
export type JurorId = 'projektantka' | 'babcia' | 'influencer' | 'krytyk'
export type JurorMood = 'thrilled' | 'ok' | 'unimpressed'
export type ModelMood = 'calm' | 'focused' | 'nervous' | 'proud' | 'happy' | 'sad'

export const ROUNDS = 3
export const ROUND_SECONDS = 60
export const URGENT_SECONDS = 10
export const MAX_JUROR_SCORE = 10
export const SLOT_LABELS: Record<Slot, string> = { glowa: 'Głowa', gora: 'Góra', dol: 'Dół', buty: 'Buty', dodatek: 'Dodatek' }

const WANTED_POINTS = 2
const FORBIDDEN_PENALTY = 3
const EMPTY_SLOT_PENALTY = 2

export function themeFit(outfit: Outfit, theme: Theme): number {
  return SLOTS.reduce((sum, slot) => {
    const item = outfit[slot]
    if (!item) return sum - EMPTY_SLOT_PENALTY
    const wanted = item.tags.filter((t) => theme.wanted.includes(t)).length
    const forbidden = item.tags.filter((t) => theme.forbidden.includes(t)).length
    return sum + wanted * WANTED_POINTS - forbidden * FORBIDDEN_PENALTY
  }, 0)
}

const countTag = (outfit: Outfit, tag: string) => SLOTS.filter((slot) => outfit[slot]?.tags.includes(tag)).length

export const JURY: { id: JurorId; name: string; role: string; bias: (outfit: Outfit) => number; comments: [low: string, mid: string, high: string] }[] = [
  {
    id: 'projektantka',
    name: 'Wiktoria',
    role: 'Projektantka awangardowa',
    bias: (o) => countTag(o, 'ekstrawagancki') * 1.5 - countTag(o, 'casual'),
    comments: ['Nuda. Widziałam to w każdym centrum handlowym.', 'Jest odwaga, ale za mało szaleństwa.', 'Rewolucja! Chcę to na wybiegu w Paryżu.'],
  },
  {
    id: 'babcia',
    name: 'Babcia Jadzia',
    role: 'Babcia z klasą',
    bias: (o) => countTag(o, 'elegancki') + countTag(o, 'retro') - countTag(o, 'ekstrawagancki') * 1.5,
    comments: ['Dziecko, tak to się na pogrzeb sąsiada nie chodzi.', 'Ładnie, ale załóż coś na głowę, zimno.', 'Jak za moich czasów! Wzruszyłam się.'],
  },
  {
    id: 'influencer',
    name: 'Kacper',
    role: 'Influencer',
    bias: (o) => countTag(o, 'glamour') * 1.5 + countTag(o, 'letni') * 0.5 - countTag(o, 'retro'),
    comments: ['Nie wrzuciłbym tego nawet na close friends.', 'Okej, może być na story.', 'Viral! Już wołam fotografa.'],
  },
  {
    id: 'krytyk',
    name: 'Zenon',
    role: 'Surowy krytyk',
    bias: () => -1,
    comments: ['Temat? Jaki temat? Pan zgubił temat.', 'Poprawnie. Nic więcej nie powiem.', 'Hmm. Muszę przyznać… trafione.'],
  },
]

export function jurorScore(outfit: Outfit, theme: Theme, bias: number): number {
  return Math.max(1, Math.min(MAX_JUROR_SCORE, Math.round(5 + themeFit(outfit, theme) * 0.5 + bias)))
}

export function jurorComment(comments: readonly [string, string, string], score: number): string {
  return comments[score <= 4 ? 0 : score <= 7 ? 1 : 2]
}

export const MAX_SCORE = ROUNDS * JURY.length * MAX_JUROR_SCORE
const HAPPY_ROUND_TOTAL = 24

export function jurorMood(score: number): JurorMood {
  return score >= 8 ? 'thrilled' : score >= 5 ? 'ok' : 'unimpressed'
}

/** `roundTotal` is the jury sum for one round (0–40); null while the paddles are still going up. */
export function modelMood({ phase, remaining, roundTotal }: { phase: Phase; remaining: number; roundTotal: number | null }): ModelMood {
  if (phase === 'lobby') return 'calm'
  if (phase === 'dressing') return remaining <= URGENT_SECONDS ? 'nervous' : 'focused'
  if (phase === 'runway' || roundTotal === null) return 'proud'
  return roundTotal >= HAPPY_ROUND_TOTAL ? 'happy' : 'sad'
}
