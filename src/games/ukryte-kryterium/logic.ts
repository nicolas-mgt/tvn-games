export const MAX_TASK_POINTS = 5

export type Metrics = Record<string, number>
export type Criterion = { reveal: string; score: (m: Metrics) => number }
export type TaskId = 'timer' | 'horse' | 'excuse' | 'monday' | 'circle'

export function clampPoints(raw: number): number {
  return Math.max(0, Math.min(MAX_TASK_POINTS, Math.round(raw)))
}

export const CRITERIA: Record<TaskId, Criterion[]> = {
  timer: [
    { reveal: 'Liczyła się precyzja: im bliżej 7,3 s, tym lepiej.', score: (m) => 5 - Math.abs(m.seconds - 7.3) * 2 },
    { reveal: 'Sędzia nagradzał cierpliwość: kto czekał dłużej, ten lepszy.', score: (m) => m.seconds / 3 },
    { reveal: 'Sędzia lubi impulsywnych: punkty za kliknięcie przed 3. sekundą.', score: (m) => (m.seconds < 3 ? 5 : 3 - m.seconds / 4) },
  ],
  horse: [
    { reveal: 'Im więcej atramentu, tym bardziej koń.', score: (m) => m.ink / 400 },
    { reveal: 'Sędzia ceni minimalizm: mniej kresek, więcej punktów.', score: (m) => (m.strokes === 0 ? 0 : 6 - m.strokes) },
    { reveal: 'Liczyła się szybkość: prawdziwy artysta rysuje konia w 5 sekund.', score: (m) => 5 - Math.max(0, m.seconds - 5) / 2 },
  ],
  excuse: [
    { reveal: 'Punkt za każdy wykrzyknik. Emocje przede wszystkim!', score: (m) => m.exclamations },
    { reveal: 'Sędzia liczył słowa dłuższe niż 6 liter. Elokwencja!', score: (m) => m.longWords },
    { reveal: 'Liczyła się dokładnie długość 50 znaków.', score: (m) => 5 - Math.abs(m.length - 50) / 3 },
  ],
  monday: [
    { reveal: 'Szczerość: nikt nie czuje się w poniedziałek lepiej niż na 20%.', score: (m) => (m.value <= 20 ? 5 : 5 - (m.value - 20) / 10) },
    { reveal: 'Wynagradzaliśmy toksyczny optymizm.', score: (m) => m.value / 20 },
    { reveal: 'Sędzia po prostu lubi liczbę 42.', score: (m) => 5 - Math.abs(m.value - 42) / 6 },
  ],
  circle: [
    { reveal: 'Im więcej kliknięć, tym lepiej. Klasyka.', score: (m) => m.clicks / 8 },
    { reveal: 'Sędzia szukał opanowania: idealnie 7 kliknięć.', score: (m) => 5 - Math.abs(m.clicks - 7) },
    { reveal: 'Prawdziwy mistrz nie klika wcale.', score: (m) => 5 - m.clicks / 2 },
  ],
}

export function judgeComment(points: number): string {
  if (points === MAX_TASK_POINTS) return 'Sędzia jest pod wrażeniem, choć nigdy tego nie przyzna.'
  if (points >= 3) return 'Poprawnie. Nudno, ale poprawnie.'
  if (points >= 1) return 'Sędzia westchnął głęboko i zapisał coś w notesie.'
  return 'Sędzia prosi, żebyś nigdy więcej tego nie robił.'
}

export function excuseMetrics(text: string): Metrics {
  return {
    length: text.length,
    exclamations: (text.match(/!/g) ?? []).length,
    longWords: text.split(/\s+/).filter((w) => w.replace(/[^\p{L}]/gu, '').length > 6).length,
  }
}
