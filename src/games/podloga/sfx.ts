import { loadJSON, saveJSON } from '@/shared/storage'

const SAMPLES = ['correct', 'wrong', 'pass', 'select', 'win', 'conquest', 'intro', 'lose', 'token'] as const
export type Sound = (typeof SAMPLES)[number] | 'tick' | 'buzzer'

const MUTED_KEY = 'slop-games:podloga:muted'

let context: AudioContext | null = null
const buffers = new Map<string, AudioBuffer>()
let muted = loadJSON(MUTED_KEY, false)

export function isMuted(): boolean {
  return muted
}

export function setMuted(value: boolean): void {
  muted = value
  saveJSON(MUTED_KEY, value)
}

/** Browsers only allow audio after a user gesture, so this is called from the first click. */
export function unlockAudio(): void {
  if (context) {
    void context.resume()
    return
  }
  context = new AudioContext()
  const ctx = context
  for (const name of SAMPLES) {
    fetch(`/podloga/sfx/${name}.mp3`)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => buffers.set(name, buffer))
      .catch((error: unknown) => console.error(`sfx ${name}:`, error))
  }
}

function tone(ctx: AudioContext, type: OscillatorType, frequency: number, duration: number, volume: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export function play(sound: Sound): void {
  if (muted || !context) return
  if (sound === 'tick') return tone(context, 'square', 1800, 0.04, 0.08)
  if (sound === 'buzzer') {
    tone(context, 'sawtooth', 110, 0.9, 0.25)
    return tone(context, 'square', 116, 0.9, 0.15)
  }
  const buffer = buffers.get(sound)
  if (!buffer) return
  const source = context.createBufferSource()
  source.buffer = buffer
  source.connect(context.destination)
  source.start()
}
