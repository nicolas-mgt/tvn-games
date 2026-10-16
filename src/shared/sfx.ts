import { loadJSON, saveJSON } from './storage'

/** Procedural sound; `amount` is an optional 0–1 parameter passed through `play`. */
type Synth = (ctx: AudioContext, amount: number) => void

export type Sfx<S extends string> = {
  /** Browsers only allow audio after a user gesture, so this is called from the first click. */
  unlock: () => void
  play: (sound: S, amount?: number) => void
  isMuted: () => boolean
  setMuted: (value: boolean) => void
}

/** Samples are loaded from `/<slug>/sfx/<name>.mp3`; mute state persists per game. */
export function createSfx<Sample extends string, Synthesized extends string = never>({
  slug,
  samples,
  synth,
}: {
  slug: string
  samples: readonly Sample[]
  synth?: Record<Synthesized, Synth>
}): Sfx<Sample | Synthesized> {
  const mutedKey = `tvn-games:${slug}:muted`
  const buffers = new Map<string, AudioBuffer>()
  let context: AudioContext | null = null
  let muted = loadJSON(mutedKey, false)

  return {
    unlock() {
      if (context) {
        void context.resume()
        return
      }
      context = new AudioContext()
      const ctx = context
      for (const name of samples) {
        fetch(`/${slug}/sfx/${name}.mp3`)
          .then((res) => res.arrayBuffer())
          .then((data) => ctx.decodeAudioData(data))
          .then((buffer) => buffers.set(name, buffer))
          .catch((error: unknown) => console.error(`sfx ${name}:`, error))
      }
    },
    play(sound, amount = 0) {
      if (muted || !context) return
      const procedural = synth?.[sound as Synthesized]
      if (procedural) return procedural(context, amount)
      const buffer = buffers.get(sound)
      if (!buffer) return
      const source = context.createBufferSource()
      source.buffer = buffer
      source.connect(context.destination)
      source.start()
    },
    isMuted: () => muted,
    setMuted(value) {
      muted = value
      saveJSON(mutedKey, value)
    },
  }
}

export function tone(
  ctx: AudioContext,
  type: OscillatorType,
  frequency: number,
  duration: number,
  volume: number,
  delay = 0,
): void {
  const start = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration)
}

/** White noise through a band-pass filter, for tearing, rumbling and similar textures. */
export function noise(ctx: AudioContext, frequency: number, duration: number, volume: number, q = 1, delay = 0): void {
  const start = ctx.currentTime + delay
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const source = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  source.buffer = buffer
  filter.type = 'bandpass'
  filter.frequency.value = frequency
  filter.Q.value = q
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  source.connect(filter).connect(gain).connect(ctx.destination)
  source.start(start)
}
