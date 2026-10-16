import { pickN, shuffle, type Rng } from '@/shared/daily'
import data from './data.json'

export const SCENES_PER_GAME = 6
export const PLAY_SECONDS = 2

export const KINDS = ['car', 'suv', 'sportscar', 'van', 'truck', 'bus', 'tractor', 'scooter', 'person', 'cow', 'duck', 'duckling', 'deer', 'cart', 'roofbox', 'gauge', 'tree'] as const
export const BACKGROUNDS = ['city', 'intersection', 'parking', 'country', 'garage', 'forest'] as const

export type Kind = (typeof KINDS)[number]
export type Background = (typeof BACKGROUNDS)[number]
export type Facing = 'left' | 'right'
export type Actor = {
  kind: Kind
  x: number
  y: number
  toX: number
  toY: number
  color?: string
  pose?: 'walk' | 'run' | 'wave'
  ease?: 'in' | 'out'
  facing?: Facing
  /** Fraction of the clip after which the actor stays at `toX`/`toY`. */
  stopAt?: number
}
export type Scene = {
  title: string
  setup: string
  background: Background
  effect?: 'crash' | 'brake' | 'horn'
  actors: Actor[]
  options: string[]
  answer: number
  comment: string
}

export const SCENES = data as Scene[]

/** Picks the scenes for one game and shuffles the options, keeping `answer` pointing at the same text. */
export function dealScenes(rng: Rng = Math.random): Scene[] {
  return pickN(SCENES, SCENES_PER_GAME, rng).map((scene) => {
    const options = shuffle(scene.options, rng)
    return { ...scene, options, answer: options.indexOf(scene.options[scene.answer]) }
  })
}

export function facingOf(actor: Actor): Facing {
  return actor.facing ?? (actor.toX < actor.x ? 'left' : 'right')
}

export type Phase = 'lobby' | 'rewind' | 'paused' | 'playing' | 'verdict' | 'result'
export type InstructorMood = 'calm' | 'facepalm' | 'approving'

export function instructorMood(phase: Phase, correct: boolean | null): InstructorMood {
  if (phase !== 'verdict' || correct === null) return 'calm'
  return correct ? 'approving' : 'facepalm'
}

/** Dashcam timestamp: today's date and the time from the scene title, or a stable time per recording. */
export function stampFor(scene: Scene, index: number, date: Date): string {
  const day = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
  const fromTitle = scene.title.match(/(\d{1,2}):(\d{2})/)
  const time = fromTitle ? `${fromTitle[1].padStart(2, '0')}:${fromTitle[2]}` : `${String(8 + ((index * 3) % 12)).padStart(2, '0')}:${String((index * 17 + 5) % 60).padStart(2, '0')}`
  return `${day} ${time}:00`
}
