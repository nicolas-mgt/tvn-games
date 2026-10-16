import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { ActorSprite } from './Actors'
import { depthScale, facingOf, PLAY_SECONDS, poseAt, type Actor, type Background, type Scene as SceneData } from './logic'

export type ScenePhase = 'rewind' | 'paused' | 'playing' | 'verdict'

const WINDOWS = Array.from({ length: 24 }, (_, i) => ({ x: 40 + (i % 12) * 130, y: 70 + Math.floor(i / 12) * 90 }))
const PINES = [60, 210, 330, 470, 600, 860, 990, 1120, 1260, 1400, 1530]

function Road({ y, h, dash = true }: { y: number; h: number; dash?: boolean }) {
  return (
    <>
      <rect y={y} width="1600" height={h} fill="#55575f" />
      <rect y={y - 8} width="1600" height="8" fill="#c8c8c0" />
      <rect y={y + h} width="1600" height="8" fill="#c8c8c0" />
      {dash && <path d={`M0 ${y + h / 2} H1600`} stroke="#f4f4f0" strokeWidth="6" strokeDasharray="60 50" />}
    </>
  )
}

function City() {
  return (
    <>
      <rect width="1600" height="900" fill="#a8c8e8" />
      {[0, 260, 520, 780, 1040, 1300].map((x, i) => (
        <rect key={x} x={x} y={i % 2 ? 0 : 40} width="250" height="300" fill={['#c8a888', '#a8b0c0', '#d8c0a0'][i % 3]} />
      ))}
      {WINDOWS.map((w) => (
        <rect key={`${w.x}-${w.y}`} x={w.x} y={w.y + 40} width="60" height="50" rx="4" fill="#e8f0f8" opacity="0.8" />
      ))}
      <rect y="300" width="1600" height="160" fill="#b8b8b0" />
      {[1180, 1280, 1400, 1500].map((x) => (
        <ellipse key={x} cx={x} cy="290" rx="70" ry="40" fill="#4a8a3a" />
      ))}
      <Road y={460} h={160} />
      <rect y="628" width="1600" height="272" fill="#b8b8b0" />
      <g transform="translate(1060 300)">
        <rect x="-4" y="-150" width="8" height="150" fill="#3a3a44" />
        <circle cy="-160" r="26" fill="#f2c830" stroke="#3a3a44" strokeWidth="4" />
        <text y="-150" textAnchor="middle" fontSize="28" fill="#1a1a1a" className="cz-sign">
          A
        </text>
        <rect x="40" y="-110" width="180" height="110" fill="#8ac0e0" opacity="0.4" stroke="#3a3a44" strokeWidth="5" />
      </g>
    </>
  )
}

const crossLeft = (y: number) => 730 - 0.5556 * (y - 180)
const crossRight = (y: number) => 870 + 0.5556 * (y - 180)

function zebra(y0: number, y1: number) {
  const at = (y: number, f: number) => crossLeft(y) + (crossRight(y) - crossLeft(y)) * f
  return Array.from({ length: 7 }, (_, i) => {
    const [f0, f1] = [(i + 0.15) / 7, (i + 0.65) / 7]
    return `M${at(y0, f0)} ${y0} L${at(y0, f1)} ${y0} L${at(y1, f1)} ${y1} L${at(y1, f0)} ${y1} Z`
  }).join(' ')
}

function Intersection() {
  return (
    <>
      <rect width="1600" height="900" fill="#a8c8e8" />
      {[0, 180, 320, 520, 980, 1160, 1300, 1460].map((x, i) => (
        <rect key={x} x={x} y={90 + (i % 3) * 20} width="150" height={90 - (i % 3) * 20} fill={['#b8a898', '#a8b0c0', '#c8b8a0'][i % 3]} />
      ))}
      <rect y="180" width="1600" height="720" fill="#8ab060" />
      <rect y="372" width="1600" height="68" fill="#c0c0b8" />
      <rect y="620" width="1600" height="90" fill="#c0c0b8" />
      <rect y="440" width="1600" height="180" fill="#55575f" />
      <path d={`M${crossLeft(180)} 180 H${crossRight(180)} L${crossRight(900)} 900 H${crossLeft(900)} Z`} fill="#55575f" />
      <path d={zebra(400, 432)} fill="#f4f4f0" />
      <path d={zebra(632, 694)} fill="#f4f4f0" />
      <path d={`M0 530 H${crossLeft(530) - 30} M${crossRight(530) + 30} 530 H1600 M800 190 V390 M800 710 V900`} stroke="#f4f4f0" strokeWidth="6" strokeDasharray="60 50" />
      {[120, 300, 1300, 1480].map((x) => (
        <g key={x} transform={`translate(${x} 380)`}>
          <rect x="-5" y="-50" width="10" height="50" fill="#6a4a2a" />
          <circle cy="-70" r="34" fill="#4a8a3a" />
        </g>
      ))}
      <g transform="translate(380 720)">
        <rect x="-5" y="-120" width="10" height="120" fill="#3a3a44" />
        <path d="M0 -60 L-40 -130 H40 Z" fill="#fff" stroke="#e8323a" strokeWidth="9" strokeLinejoin="round" />
      </g>
    </>
  )
}

function Parking() {
  return (
    <>
      <rect width="1600" height="900" fill="#a8c8e8" />
      <rect y="30" width="1600" height="170" fill="#e8e0d0" />
      <rect x="560" y="50" width="480" height="64" rx="10" fill="#e8323a" />
      <text x="800" y="104" textAnchor="middle" fontSize="56" fill="#fff" className="cz-sign">
        MARKET
      </text>
      <rect x="300" y="130" width="1000" height="70" fill="#8ac0e0" opacity="0.6" />
      <rect y="200" width="1600" height="700" fill="#6a6c74" />
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} stroke="#f4f4f0" strokeWidth="6">
          <path d={`M${60 + i * 170} 300 l-14 90`} />
          <path d={`M${40 + i * 180} 600 l-30 170`} />
        </g>
      ))}
      <path d="M0 210 L1600 720" stroke="#7a7c84" strokeWidth="30" opacity="0.4" />
      <g transform="translate(150 215)" stroke="#9aa8b8" strokeWidth="4" fill="none">
        <path d="M0 0 V-40 H110 V0" />
        <path d="M0 -20 H110" />
      </g>
    </>
  )
}

function Country() {
  return (
    <>
      <rect width="1600" height="900" fill="#a8d0f0" />
      <circle cx="1400" cy="80" r="50" fill="#fff2a8" />
      <path d="M0 160 Q300 100 600 150 T1200 130 T1600 150 V900 H0 Z" fill="#8ab860" />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M0 ${200 + i * 34} H1600`} stroke="#d8c060" strokeWidth="14" opacity="0.6" />
      ))}
      <Road y={460} h={150} dash={false} />
      <rect y="618" width="1600" height="282" fill="#7aa850" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={20 + i * 120} y="660" width="10" height="60" fill="#8a6a4a" />
      ))}
      <path d="M0 676 H1600 M0 700 H1600" stroke="#8a6a4a" strokeWidth="6" />
    </>
  )
}

function Garage() {
  return (
    <>
      <rect width="1600" height="900" fill="#8a8c90" />
      <rect y="0" width="1600" height="240" fill="#a0a2a8" />
      <rect x="800" y="250" width="800" height="300" fill="#16181e" />
      <rect x="800" y="250" width="800" height="300" fill="url(#cz-garage-light)" />
      <rect x="800" y="236" width="800" height="14" fill="#f2c830" />
      <text x="420" y="130" textAnchor="middle" fontSize="44" fill="#1a1a1a" className="cz-sign">
        PARKING
      </text>
      <text x="420" y="190" textAnchor="middle" fontSize="54" fill="#1a1a1a" className="cz-sign">
        MAX 2,1 M
      </text>
      <path d="M0 520 H1600 V900 H0 Z" fill="#6a6c72" />
      <path d="M0 548 H1600" stroke="#f2c830" strokeWidth="8" strokeDasharray="40 30" />
      <path d="M0 700 L1600 640" stroke="#5a5c62" strokeWidth="20" opacity="0.5" />
    </>
  )
}

function Forest() {
  return (
    <>
      <rect width="1600" height="900" fill="url(#cz-dusk)" />
      <circle cx="1240" cy="90" r="34" fill="#f8e8c8" opacity="0.9" />
      {PINES.map((x, i) => (
        <path key={x} d={`M${x} ${60 + (i % 3) * 30} l-90 360 h180 Z`} fill={i % 2 ? '#1e3a2e' : '#24442e'} />
      ))}
      <rect y="420" width="1600" height="480" fill="#2a3a26" />
      <Road y={470} h={150} />
      <rect y="628" width="1600" height="272" fill="#24341e" />
      <g transform="translate(1000 470)">
        <rect x="-4" y="-120" width="8" height="120" fill="#3a3a44" />
        <path d="M0 -190 L44 -114 H-44 Z" fill="#f2c830" stroke="#e8323a" strokeWidth="7" strokeLinejoin="round" />
        <path d="M-16 -132 l10 -26 l14 -2 l6 -12 m-20 14 l-8 26" stroke="#1a1a1a" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </>
  )
}

const BACKGROUND_ART: Record<Background, () => ReactNode> = { city: City, intersection: Intersection, parking: Parking, country: Country, garage: Garage, forest: Forest }

function transformAt(actor: Actor, t: number) {
  const { x, y, lift, tilt } = poseAt(actor, t)
  const scale = depthScale(y)
  const flip = facingOf(actor) === 'left' ? -1 : 1
  return `translate(${x * 16} ${(y - lift) * 9}) rotate(${tilt * flip}) scale(${flip * scale} ${scale})`
}

function ActorView({ actor, moved, pace }: { actor: Actor; moved: boolean; pace: number }) {
  const ref = useRef<SVGGElement>(null)
  const reducedMotion = useReducedMotion()
  const moving = actor.x !== actor.toX || actor.y !== actor.toY

  useEffect(() => {
    const place = (t: number) => ref.current?.setAttribute('transform', transformAt(actor, t))
    if (!moved || reducedMotion || pace === 0) {
      place(moved ? 1 : 0)
      return
    }
    const controls = animate(0, 1, { duration: PLAY_SECONDS * pace, ease: 'linear', onUpdate: place })
    return () => controls.stop()
  }, [actor, moved, pace, reducedMotion])

  return (
    <g ref={ref} data-testid="actor" data-kind={actor.kind} className={moving ? 'cz-moving' : undefined} transform={transformAt(actor, 0)}>
      <g className={!moving ? undefined : actor.kind === 'deer' ? 'cz-gallop' : actor.kind === 'person' || actor.kind.startsWith('duck') ? 'cz-bob' : undefined}>
        <ActorSprite actor={actor} />
      </g>
    </g>
  )
}

function Shot({ scene, moved, pace }: { scene: SceneData; moved: boolean; pace: number }) {
  const Art = BACKGROUND_ART[scene.background]
  const actors = [...scene.actors].sort((a, b) => Math.max(a.y, a.toY) - Math.max(b.y, b.toY))
  return (
    <svg viewBox="0 0 1600 900" className="cz-shot" role="img" aria-label={scene.title}>
      <defs>
        <linearGradient id="cz-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a5a" />
          <stop offset="0.5" stopColor="#c86a5a" />
          <stop offset="1" stopColor="#f0b070" />
        </linearGradient>
          <linearGradient id="cz-beam-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff6c0" stopOpacity="0.45" />
            <stop offset="1" stopColor="#fff6c0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cz-garage-light" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a3c44" />
          <stop offset="1" stopColor="#16181e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Art />
      {actors.map((actor, i) => (
        <ActorView key={i} actor={actor} moved={moved} pace={pace} />
      ))}
      {scene.background === 'forest' && <rect width="1600" height="900" fill="#0a0a30" opacity="0.25" />}
    </svg>
  )
}

export function Snapshot({ scene }: { scene: SceneData }) {
  return <Shot scene={scene} moved pace={0} />
}

export function Scene({ scene, phase, stamp, impact, pace }: { scene: SceneData; phase: ScenePhase; stamp: string; impact: boolean; pace: number }) {
  const moved = phase === 'playing' || phase === 'verdict'
  return (
    <div className="cz-scene" data-testid="scene" data-phase={phase} data-impact={impact} data-background={scene.background}>
      <Shot scene={scene} moved={moved} pace={pace} />
      <div className="cz-scan" />
      <div className="cz-vignette" />
      <div className="cz-rec cz-mono">
        <i /> REC
      </div>
      <div className="cz-stamp cz-mono">{stamp}</div>
      <div className="cz-cam cz-mono">CAM 1 · 1080p</div>
      {phase === 'paused' && <div className="cz-pause cz-sign">❚❚ PAUZA</div>}
      {phase === 'playing' && <div className="cz-playing cz-sign">▶ ODTWARZANIE</div>}
      {phase === 'rewind' && (
        <div className="cz-rewind" data-testid="rewind">
          <span className="cz-sign">◀◀ PRZEWIJANIE</span>
        </div>
      )}
    </div>
  )
}
