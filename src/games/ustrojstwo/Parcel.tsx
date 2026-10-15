import confetti from 'canvas-confetti'
import { motion } from 'motion/react'
import { useRef, useState, type PointerEvent } from 'react'
import { play } from './sfx'

export type ParcelStage = 'arrive' | 'cut' | 'open' | 'depart'

type ParcelProps = {
  gadgetId: string
  number: number
  total: number
  stage: ParcelStage
  onArrived: () => void
  onOpened: () => void
  onDeparted: () => void
}

/** Share of the tape that has to be cut before the flaps pop open. */
const CUT_TO_OPEN = 0.85
const TEAR_STEP = 0.04
const HIT_SLOP = 50
const FLAPS = [
  { side: 'front', delay: 0 },
  { side: 'back', delay: 0.12 },
  { side: 'left', delay: 0.3 },
  { side: 'right', delay: 0.38 },
] as const

type Range = [number, number]

/** The back flap faces the other way, so its local x axis runs right to left. */
function slitStyle([from, to]: Range, mirrored: boolean) {
  return { left: `${(mirrored ? 1 - to : from) * 100}%`, width: `${(to - from) * 100}%` }
}

export function Parcel({ gadgetId, number, total, stage, onArrived, onOpened, onDeparted }: ParcelProps) {
  const seamRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const lastTear = useRef(0)
  const [cut, setCut] = useState<Range | null>(null)
  const open = stage === 'open' || stage === 'depart'

  function finishCut() {
    const rect = seamRef.current?.getBoundingClientRect()
    if (rect) {
      confetti({
        particleCount: 70,
        spread: 80,
        startVelocity: 32,
        gravity: 1.1,
        scalar: 1.3,
        shapes: ['circle'],
        colors: ['#f4f1ea', '#e8e2d4', '#fde68a', '#fbcfe8'],
        origin: { x: (rect.left + rect.width / 2) / innerWidth, y: rect.top / innerHeight },
        disableForReducedMotion: true,
      })
    }
    FLAPS.forEach(({ delay }) => setTimeout(() => play('flap'), delay * 1000))
    setTimeout(() => play('reveal'), 450)
    setCut([0, 1])
    onOpened()
  }

  function fractionAt(event: PointerEvent): number | null {
    const rect = seamRef.current?.getBoundingClientRect()
    if (!rect || event.clientY < rect.top - HIT_SLOP || event.clientY > rect.bottom + HIT_SLOP) return null
    return Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  }

  function extendCut(fraction: number) {
    const next: Range = cut ? [Math.min(cut[0], fraction), Math.max(cut[1], fraction)] : [fraction, fraction]
    if (Math.abs(fraction - lastTear.current) >= TEAR_STEP) {
      play('tear', fraction)
      lastTear.current = fraction
    }
    if (next[1] - next[0] >= CUT_TO_OPEN) {
      dragging.current = false
      finishCut()
      return
    }
    setCut(next)
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (stage !== 'cut') return
    const fraction = fractionAt(event)
    if (fraction === null) return
    dragging.current = true
    lastTear.current = fraction
    event.currentTarget.setPointerCapture(event.pointerId)
    extendCut(fraction)
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current || stage !== 'cut') return
    const fraction = fractionAt(event)
    if (fraction !== null) extendCut(fraction)
  }

  return (
    <div
      className={`parcel-scene absolute inset-0 flex select-none items-end justify-center pb-[70px] sm:pb-[90px] ${stage === 'cut' ? 'cursor-crosshair touch-none' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => (dragging.current = false)}
      data-testid="parcel"
      data-stage={stage}
    >
      {stage === 'cut' && (
        <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-2 text-center">
          <motion.p
            className="marker text-3xl text-amber-200"
            animate={{ x: [-8, 8, -8] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            Przeciągnij nożykiem po taśmie →
          </motion.p>
          <button
            className="rounded-full border border-amber-200/40 bg-black/50 px-4 py-1 text-sm text-amber-100 backdrop-blur hover:bg-black/70"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={finishCut}
            data-testid="cut-button"
          >
            Rozetnij
          </button>
        </div>
      )}
      <motion.div
        initial={{ x: '100vw' }}
        animate={{ x: stage === 'arrive' ? 0 : stage === 'depart' ? '-100vw' : 0 }}
        transition={{ duration: 1.3, ease: [0.3, 0, 0.2, 1] }}
        onAnimationComplete={() => (stage === 'arrive' ? onArrived() : stage === 'depart' && onDeparted())}
      >
        <motion.div
          animate={stage === 'cut' && !cut ? { rotateZ: [0, -3, 3, -2, 0] } : { rotateZ: 0 }}
          transition={stage === 'cut' && !cut ? { duration: 0.6, repeat: Infinity, repeatDelay: 1.6 } : undefined}
        >
          <div className="parcel">
            <div className="parcel-bottom" />
            {FLAPS.map(({ side, delay }) => (
              <div key={side} className="parcel-wall" data-side={side}>
                <div className="parcel-face cardboard">
                  {(side === 'left' || side === 'right') && <div className="parcel-tape-down" />}
                  {side === 'front' && (
                    <div className="flex h-full flex-col items-center justify-end gap-1 pb-3">
                      <span className="marker text-xl text-red-800 sm:text-2xl">OSTROŻNIE!</span>
                      <div className="ship-label w-24 rounded-sm p-1 sm:w-28">
                        <div className="barcode" />
                        <p className="mt-0.5 text-[8px] font-bold tracking-widest">PL-{String(number).padStart(4, '0')}-UST</p>
                      </div>
                    </div>
                  )}
                  {side === 'right' && (
                    <div className="flex h-full flex-col items-center justify-center gap-1 pt-6">
                      <span className="marker text-3xl text-[#2a1a0c] sm:text-4xl">DO: Ty</span>
                      <span className="marker text-xl text-[#2a1a0c] sm:text-2xl">
                        Paczka {number}/{total}
                      </span>
                    </div>
                  )}
                </div>
                <div className="parcel-inner" />
                <motion.div
                  className="parcel-flap cardboard"
                  initial={{ rotateX: -90 }}
                  animate={{ rotateX: open ? -215 : -90 }}
                  transition={open ? { delay, type: 'spring', stiffness: 140, damping: 11 } : { duration: 0 }}
                >
                  {(side === 'front' || side === 'back') && (
                    <div ref={side === 'front' ? seamRef : undefined} className="parcel-tape" data-testid={side === 'front' ? 'tape' : undefined}>
                      {cut && <div className="parcel-slit" style={slitStyle(cut, side === 'back')} />}
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
            <motion.div
              className="parcel-gadget"
              initial={{ y: '20%', opacity: 0 }}
              animate={open ? { y: '-100%', opacity: 1 } : { y: '20%', opacity: 0 }}
              transition={{ delay: open ? 0.45 : 0, duration: 0.8, ease: [0.2, 1.4, 0.4, 1] }}
            >
              <div className="parcel-gadget-face">
                <img
                  src={`/ustrojstwo/items/${gadgetId}.jpg`}
                  alt=""
                  draggable={false}
                  data-gadget={gadgetId}
                  className="aspect-[4/3] w-full bg-neutral-900 object-contain"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
