import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { MAP_HEIGHT, MAP_WIDTH, project, unproject, type LatLng } from './logic'
import world from './world.json'

const MIN_ZOOM = 1
const MAX_ZOOM = 8
const CLICK_SLOP_PX = 6
const MERIDIANS = Array.from({ length: 13 }, (_, i) => i * 300)
const PARALLELS = [200, 500, 800, 1100]

type View = { zoom: number; cx: number; cy: number }
type Size = { width: number; height: number }

const clampZoom = (zoom: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))

/** Map units per screen pixel; zoom 1 fits the whole map into the frame. */
function unitsPerPx(size: Size, zoom: number) {
  return 1 / (Math.min(size.width / MAP_WIDTH, size.height / MAP_HEIGHT) * zoom)
}

function clampView(view: View, size: Size): View {
  const k = unitsPerPx(size, view.zoom)
  const halfW = (size.width * k) / 2
  const halfH = (size.height * k) / 2
  const clampAxis = (c: number, half: number, extent: number) => (half * 2 >= extent ? extent / 2 : Math.min(extent - half, Math.max(half, c)))
  return { zoom: view.zoom, cx: clampAxis(view.cx, halfW, MAP_WIDTH), cy: clampAxis(view.cy, halfH, MAP_HEIGHT) }
}

/** Zooms so that the map point under the screen offset (`px`, `py`) stays in place. */
function zoomAt(view: View, size: Size, zoom: number, px: number, py: number): View {
  const k = unitsPerPx(size, view.zoom)
  const pointX = view.cx + (px - size.width / 2) * k
  const pointY = view.cy + (py - size.height / 2) * k
  const nextZoom = clampZoom(zoom)
  const nextK = unitsPerPx(size, nextZoom)
  return clampView({ zoom: nextZoom, cx: pointX - (px - size.width / 2) * nextK, cy: pointY - (py - size.height / 2) * nextK }, size)
}

function arcPath(from: LatLng, to: LatLng) {
  const a = project(from)
  const b = project(to)
  const lift = Math.min(260, Math.hypot(b.x - a.x, b.y - a.y) * 0.3)
  return `M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - lift} ${b.x} ${b.y}`
}

function Pin({ point, k, color, testId }: { point: LatLng; k: number; color: string; testId: string }) {
  const { x, y } = project(point)
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} data-testid={testId} data-lat={point.lat} data-lng={point.lng} className="gm-pin">
      <ellipse cy="1" rx="6" ry="2.5" fill="rgb(0 0 0 / 0.3)" />
      <path d="M0 0 L-2 -16 H2 Z" fill="#6a6a72" />
      <circle cy="-20" r="8" fill={color} stroke="rgb(0 0 0 / 0.35)" strokeWidth="1.5" />
      <circle cx="-2.5" cy="-22.5" r="2.5" fill="#fff" opacity="0.7" />
    </g>
  )
}

export function WorldMap({
  guess,
  target,
  flightMs,
  onGuess,
  onFlightEnd,
}: {
  guess: LatLng | null
  /** Set when the answer is revealed: the plane flies from the guess to it. */
  target: LatLng | null
  flightMs: number
  onGuess?: (point: LatLng) => void
  onFlightEnd: () => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const arcRef = useRef<SVGPathElement>(null)
  const [size, setSize] = useState<Size>({ width: 640, height: 360 })
  const [view, setView] = useState<View>({ zoom: 1, cx: MAP_WIDTH / 2, cy: MAP_HEIGHT / 2 })
  const [flight, setFlight] = useState<{ t: number; x: number; y: number; angle: number } | null>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const moved = useRef(0)
  const sizeRef = useRef(size)
  const onFlightEndRef = useRef(onFlightEnd)

  useLayoutEffect(() => {
    onFlightEndRef.current = onFlightEnd
  })

  useLayoutEffect(() => {
    const frame = frameRef.current!
    const observer = new ResizeObserver(([entry]) => {
      const next = { width: entry.contentRect.width, height: entry.contentRect.height }
      sizeRef.current = next
      setSize(next)
      setView((v) => clampView(v, next))
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const frame = frameRef.current!
    function onWheel(event: WheelEvent) {
      event.preventDefault()
      const rect = frame.getBoundingClientRect()
      setView((v) => zoomAt(v, sizeRef.current, v.zoom * Math.exp(-event.deltaY * 0.0025), event.clientX - rect.left, event.clientY - rect.top))
    }
    frame.addEventListener('wheel', onWheel, { passive: false })
    return () => frame.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    if (!target || !guess) return
    const a = project(guess)
    const b = project(target)
    let frame = 0
    let start = 0
    function step(now: number) {
      if (!start) {
        start = now
        const s = sizeRef.current
        const zoom = clampZoom(Math.min((s.width * unitsPerPx(s, 1)) / (Math.abs(b.x - a.x) * 1.3 + 200), (s.height * unitsPerPx(s, 1)) / (Math.abs(b.y - a.y) * 1.3 + 300)))
        setView(clampView({ zoom, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 - 60 }, s))
      }
      const arc = arcRef.current
      const t = Math.min(1, (now - start) / flightMs)
      if (arc) {
        const length = arc.getTotalLength()
        const p = arc.getPointAtLength(length * t)
        const q = arc.getPointAtLength(Math.min(length, length * t + 1))
        const angle = t < 1 ? (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI : 0
        setFlight((f) => ({ t, x: p.x, y: p.y, angle: t < 1 ? angle : (f?.angle ?? 0) }))
      }
      if (t < 1) frame = requestAnimationFrame(step)
      else onFlightEndRef.current()
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, guess, flightMs])

  const k = unitsPerPx(size, view.zoom)
  const flying = flight !== null && flight.t < 1
  const viewW = size.width * k
  const viewH = size.height * k
  const viewBox = `${(view.cx - viewW / 2).toFixed(1)} ${(view.cy - viewH / 2).toFixed(1)} ${viewW.toFixed(1)} ${viewH.toFixed(1)}`

  function onPointerDown(event: ReactPointerEvent) {
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 1) moved.current = 0
  }

  function onPointerMove(event: ReactPointerEvent) {
    const prev = pointers.current.get(event.pointerId)
    if (!prev) return
    const rect = frameRef.current!.getBoundingClientRect()
    const others = [...pointers.current.entries()].filter(([id]) => id !== event.pointerId)
    const next = { x: event.clientX, y: event.clientY }
    if (others.length === 1) {
      const [, other] = others[0]
      const ratio = Math.hypot(next.x - other.x, next.y - other.y) / Math.max(1, Math.hypot(prev.x - other.x, prev.y - other.y))
      const midX = (next.x + other.x) / 2 - rect.left
      const midY = (next.y + other.y) / 2 - rect.top
      moved.current = Infinity
      setView((v) => zoomAt(v, size, v.zoom * ratio, midX, midY))
    } else if (others.length === 0) {
      moved.current += Math.hypot(next.x - prev.x, next.y - prev.y)
      if (moved.current >= CLICK_SLOP_PX) setView((v) => clampView({ zoom: v.zoom, cx: v.cx - (next.x - prev.x) * k, cy: v.cy - (next.y - prev.y) * k }, size))
    }
    pointers.current.set(event.pointerId, next)
  }

  function onPointerUp(event: ReactPointerEvent) {
    pointers.current.delete(event.pointerId)
  }

  function onClick(event: ReactMouseEvent) {
    if (moved.current >= CLICK_SLOP_PX) {
      moved.current = 0
      return
    }
    if (!onGuess) return
    const rect = frameRef.current!.getBoundingClientRect()
    const x = view.cx + (event.clientX - rect.left - size.width / 2) * k
    const y = view.cy + (event.clientY - rect.top - size.height / 2) * k
    if (x < 0 || x > MAP_WIDTH || y < 0 || y > MAP_HEIGHT) return
    onGuess(unproject(x, y))
  }

  function zoomBy(factor: number) {
    setView((v) => zoomAt(v, size, v.zoom * factor, size.width / 2, size.height / 2))
  }

  return (
    <div className="gm-map" data-interactive={Boolean(onGuess)}>
      <div ref={frameRef} className="gm-map-frame" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onClick={onClick}>
        <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="gm-map-svg" data-testid="guess-map" data-zoom={view.zoom.toFixed(2)}>
          <defs>
            <filter id="gm-watercolor" x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="6" />
            </filter>
          </defs>
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#cfdcd2" />
          <g stroke="#a8b8ae" strokeWidth="1" vectorEffect="non-scaling-stroke">
            {MERIDIANS.map((x) => (
              <path key={x} d={`M${x} 0 V${MAP_HEIGHT}`} vectorEffect="non-scaling-stroke" />
            ))}
            {PARALLELS.map((y) => (
              <path key={y} d={`M0 ${y} H${MAP_WIDTH}`} vectorEffect="non-scaling-stroke" strokeDasharray={y === 800 ? '6 4' : undefined} />
            ))}
          </g>
          <path d={world.d} fill="#e9d6a8" filter="url(#gm-watercolor)" opacity="0.85" />
          <path d={world.d} fill="none" stroke="#8a6a44" strokeWidth="0.8" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

          {guess && target && (
            <>
              <path ref={arcRef} d={arcPath(guess, target)} fill="none" stroke="transparent" />
              <path
                d={arcPath(guess, target)}
                fill="none"
                stroke="#c0362a"
                strokeWidth={2.5 * k}
                strokeLinecap="round"
                pathLength={flying ? 1 : undefined}
                strokeDasharray={flying ? `${flight.t} 1` : `${8 * k} ${6 * k}`}
                data-testid="flight-arc"
              />
            </>
          )}
          {guess && <Pin point={guess} k={k} color="#2f6fd0" testId="guess-marker" />}
          {target && flight?.t === 1 && <Pin point={target} k={k} color="#d0342a" testId="target-marker" />}
          {flying && (
            <g transform={`translate(${flight.x} ${flight.y}) rotate(${flight.angle}) scale(${k})`} data-testid="plane">
              <path d="M16 0 Q13 -2.5 8 -2.5 H-2 L-10 -18 H-15 L-9 -2.5 H-22 L-27 -9 H-30 L-28 0 L-30 9 H-27 L-22 2.5 H-9 L-15 18 H-10 L-2 2.5 H8 Q13 2.5 16 0 Z" fill="#fff" stroke="#3a2a1a" strokeWidth="1.5" />
            </g>
          )}
        </svg>
        <svg viewBox="-40 -40 80 80" className="gm-compass" aria-hidden="true">
          <circle r="36" fill="rgb(244 235 214 / 0.85)" stroke="#8a6a44" strokeWidth="1.5" />
          <path d="M0 -32 L6 0 L0 32 L-6 0 Z" fill="#8a6a44" />
          <path d="M-32 0 L0 -6 L32 0 L0 6 Z" fill="#b89a6a" />
          <path d="M0 -32 L6 0 H-6 Z" fill="#c0362a" />
          <text y="-22" textAnchor="middle" fontSize="11" fill="#fff" className="gm-sign">
            N
          </text>
        </svg>
      </div>
      <div className="gm-zoom">
        <button type="button" onClick={() => zoomBy(2)} disabled={view.zoom >= MAX_ZOOM} data-testid="map-zoom-in" aria-label="Przybliż">
          +
        </button>
        <button type="button" onClick={() => zoomBy(0.5)} disabled={view.zoom <= MIN_ZOOM} data-testid="map-zoom-out" aria-label="Oddal">
          −
        </button>
      </div>
    </div>
  )
}
