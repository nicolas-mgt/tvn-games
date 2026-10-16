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
  /** Fractions of the clip between which the actor travels from `x`/`y` to `toX`/`toY`. */
  startAt?: number
  stopAt?: number
  /** Height above the ground at depth `y`, in the same units as `y` (a box on a van roof). */
  lift?: number
  /** After `stopAt` the actor falls from `lift` to the ground. */
  drop?: boolean
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

const EASINGS = {
  in: (p: number) => p * p,
  out: (p: number) => 1 - (1 - p) ** 2,
  inOut: (p: number) => (p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) ** 2),
}
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const lerp = (from: number, to: number, p: number) => from + (to - from) * p
export const DROP_TIME = 0.2

/** Sprite scale at depth `y`: the farther up the frame, the smaller. */
export function depthScale(y: number): number {
  return 0.3 + y * 0.022
}

/** Where the actor is at clip time `t` (0–1): position, height above the ground and tilt in degrees. */
export function poseAt(actor: Actor, t: number) {
  const start = actor.startAt ?? 0
  const stop = actor.stopAt ?? 1
  const p = EASINGS[actor.ease ?? 'inOut'](clamp01((t - start) / (stop - start)))
  const fall = actor.drop ? EASINGS.in(clamp01((t - stop) / DROP_TIME)) : 0
  return { x: lerp(actor.x, actor.toX, p), y: lerp(actor.y, actor.toY, p), lift: (actor.lift ?? 0) * (1 - fall), tilt: fall * 14 }
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
