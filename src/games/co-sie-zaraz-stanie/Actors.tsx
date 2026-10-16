import type { ReactNode } from 'react'
import type { Actor, Kind } from './logic'

const SKIN = '#f0c8a0'
const GLASS = '#a8d0e8'
const TIRE = '#1a1a20'

type SpriteProps = { color: string; pose: NonNullable<Actor['pose']> }

function Wheel({ x, r = 18 }: { x: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${-r})`}>
      <circle r={r} fill={TIRE} />
      <circle r={r * 0.45} fill="#9aa0aa" />
    </g>
  )
}

function Lights({ front, back, y }: { front: number; back: number; y: number }) {
  return (
    <>
      <rect x={front - 10} y={y} width="12" height="9" rx="3" fill="#fff2a8" />
      <rect x={back - 2} y={y} width="10" height="9" rx="3" fill="#e8323a" />
    </>
  )
}

function Car({ color }: SpriteProps) {
  return (
    <g>
      <path d="M-100 -22 V-46 Q-98 -56 -84 -58 L-50 -62 L-28 -86 H34 L62 -60 L92 -54 Q102 -50 102 -38 V-22 Z" fill={color} stroke="#0003" strokeWidth="3" />
      <path d="M-22 -80 H-2 V-62 H-42 Z M6 -80 H30 L52 -62 H6 Z" fill={GLASS} />
      <Lights front={100} back={-100} y={-48} />
      <Wheel x={-58} />
      <Wheel x={60} />
    </g>
  )
}

function Suv({ color }: SpriteProps) {
  return (
    <g>
      <path d="M-110 -24 V-74 Q-110 -96 -88 -98 H44 L74 -66 L104 -60 Q112 -56 112 -44 V-24 Z" fill={color} stroke="#0003" strokeWidth="3" />
      <path d="M-96 -88 H-40 V-66 H-96 Z M-32 -88 H8 V-66 H-32 Z M16 -88 H40 L62 -66 H16 Z" fill={GLASS} />
      <path d="M-80 -102 H40" stroke="#2a2a30" strokeWidth="5" />
      <Lights front={110} back={-110} y={-56} />
      <Wheel x={-66} r={22} />
      <Wheel x={66} r={22} />
    </g>
  )
}

function Sportscar({ color }: SpriteProps) {
  return (
    <g>
      <path d="M-104 -18 V-36 L-90 -44 L-30 -50 L-6 -68 H36 L70 -46 L104 -36 V-18 Z" fill={color} stroke="#0003" strokeWidth="3" />
      <path d="M-104 -46 H-80 V-56 H-104 Z" fill="#1a1a20" />
      <path d="M0 -62 H32 L58 -46 H-18 Z" fill={GLASS} />
      <path d="M-60 -36 H50" stroke="#1a1a20" strokeWidth="4" opacity="0.5" />
      <Lights front={102} back={-104} y={-40} />
      <Wheel x={-62} r={17} />
      <Wheel x={64} r={17} />
    </g>
  )
}

function Van({ color }: SpriteProps) {
  return (
    <g>
      <path d="M-120 -24 V-122 Q-120 -132 -108 -132 H64 Q78 -132 86 -116 L112 -70 Q120 -62 120 -50 V-24 Z" fill={color} stroke="#0003" strokeWidth="3" />
      <path d="M68 -120 H76 L104 -72 H68 Z" fill={GLASS} />
      <path d="M-108 -110 H52 V-80 H-108 Z" fill={GLASS} opacity="0.6" />
      <path d="M-20 -78 V-28" stroke="#0004" strokeWidth="3" />
      <Lights front={118} back={-120} y={-58} />
      <Wheel x={-76} r={22} />
      <Wheel x={78} r={22} />
    </g>
  )
}

function Truck({ color }: SpriteProps) {
  return (
    <g>
      <rect x="-150" y="-150" width="210" height="118" rx="6" fill="#e8e8ec" stroke="#0003" strokeWidth="3" />
      <path d="M68 -32 V-128 Q68 -136 76 -136 H118 Q130 -136 136 -120 L150 -80 V-32 Z" fill={color} stroke="#0003" strokeWidth="3" />
      <path d="M80 -124 H116 L130 -88 H80 Z" fill={GLASS} />
      <rect x="-150" y="-34" width="300" height="10" fill="#3a3a44" />
      <Lights front={148} back={-150} y={-60} />
      <Wheel x={-110} r={22} />
      <Wheel x={-62} r={22} />
      <Wheel x={110} r={22} />
    </g>
  )
}

function Bus({ color }: SpriteProps) {
  return (
    <g>
      <rect x="-190" y="-140" width="380" height="116" rx="14" fill={color} stroke="#0003" strokeWidth="3" />
      {[-170, -110, -50, 10, 70].map((x) => (
        <rect key={x} x={x} y="-126" width="50" height="40" rx="5" fill={GLASS} />
      ))}
      <rect x="140" y="-126" width="40" height="92" rx="5" fill={GLASS} />
      <path d="M140 -80 V-34" stroke="#0004" strokeWidth="3" />
      <rect x="-186" y="-80" width="324" height="8" fill="#fff" opacity="0.6" />
      <Lights front={188} back={-190} y={-52} />
      <Wheel x={-120} r={22} />
      <Wheel x={120} r={22} />
    </g>
  )
}

function Tractor({ color }: SpriteProps) {
  return (
    <g>
      <path d="M-50 -60 H70 V-94 H24 V-60" fill={color} stroke="#0003" strokeWidth="3" />
      <path d="M-56 -60 V-140 H10 V-60 Z" fill="none" stroke="#2a2a30" strokeWidth="6" />
      <rect x="-50" y="-134" width="54" height="66" fill={GLASS} opacity="0.5" />
      <rect x="-60" y="-146" width="76" height="12" rx="4" fill={color} />
      <rect x="48" y="-124" width="8" height="30" fill="#2a2a30" />
      <Wheel x={-40} r={44} />
      <Wheel x={56} r={24} />
    </g>
  )
}

function Person({ color, pose }: SpriteProps) {
  const legs = { walk: 'M0 -46 L-11 0 M0 -46 L10 0', run: 'M4 -46 L-20 -6 L-30 -6 M4 -46 L22 -18 L30 0', wave: 'M0 -46 L-6 0 M0 -46 L6 0' }[pose]
  const arms = {
    walk: 'M0 -80 L-10 -54 M0 -80 L10 -54',
    run: 'M6 -80 L-12 -66 L-20 -76 M6 -80 L22 -64 L32 -74',
    wave: 'M0 -80 L-10 -52',
  }[pose]
  const lean = pose === 'run' ? 'rotate(10)' : undefined
  return (
    <g strokeLinecap="round" fill="none" transform={lean}>
      <path d={legs} stroke="#2a3a5a" strokeWidth="9" />
      <path d="M0 -84 V-46" stroke={color} strokeWidth="18" />
      <path d={arms} stroke={color} strokeWidth="7" />
      {pose === 'wave' && (
        <g className="cz-wave">
          <path d="M2 -80 L18 -104 L20 -122" stroke={color} strokeWidth="7" />
          <circle cx="20" cy="-126" r="6" fill={SKIN} />
        </g>
      )}
      <circle cy="-97" r="13" fill={SKIN} />
      <path d="M-12 -102 Q0 -116 12 -102" stroke="#4a3020" strokeWidth="6" />
    </g>
  )
}

function Scooter({ color }: SpriteProps) {
  return (
    <g strokeLinecap="round" fill="none">
      <path d="M-30 -12 H26 L20 -106 M10 -106 H32" stroke="#3a3a44" strokeWidth="6" />
      <Wheel x={-30} r={9} />
      <Wheel x={26} r={9} />
      <path d="M-6 -60 L-14 -14 M-6 -60 L4 -14" stroke="#2a3a5a" strokeWidth="9" />
      <path d="M-4 -96 L-6 -60" stroke={color} strokeWidth="18" />
      <path d="M-2 -92 L22 -102" stroke={color} strokeWidth="7" />
      <circle cx="0" cy="-110" r="13" fill={SKIN} />
      <path d="M-14 -114 Q0 -130 14 -114 Z" fill="#e8e8ec" stroke="#3a3a44" strokeWidth="3" />
    </g>
  )
}

function Cow() {
  return (
    <g>
      <path d="M-70 -40 V0 M-48 -40 V0 M36 -40 V0 M56 -40 V0" stroke="#3a3a3a" strokeWidth="10" strokeLinecap="round" />
      <rect x="-82" y="-96" width="150" height="62" rx="26" fill="#f4f4f0" stroke="#3a3a3a" strokeWidth="3" />
      <path d="M-50 -94 q20 10 6 30 q-24 0 -26 -20 Z M10 -80 q24 -8 30 12 q-14 16 -30 4 Z" fill="#2a2a2a" />
      <path d="M-82 -80 q-14 10 -10 34" stroke="#3a3a3a" strokeWidth="4" fill="none" />
      <g transform="translate(78 -92)">
        <rect x="-14" y="-10" width="38" height="44" rx="14" fill="#f4f4f0" stroke="#3a3a3a" strokeWidth="3" />
        <rect x="-8" y="20" width="34" height="18" rx="9" fill="#f0a8b0" />
        <circle cx="10" cy="4" r="3.5" fill="#1a1a1a" />
        <path d="M-12 -8 l-10 -10 M20 -8 l8 -12" stroke="#d8c8a0" strokeWidth="5" strokeLinecap="round" />
      </g>
      <path d="M-30 -36 q10 10 20 0" fill="#f0a8b0" />
    </g>
  )
}

function Duck({ size, body }: { size: number; body: string }) {
  return (
    <g transform={`scale(${size})`}>
      <path d="M-4 -4 v4 h6 M6 -4 v4 h6" stroke="#f08a20" strokeWidth="3" fill="none" />
      <ellipse cx="0" cy="-18" rx="24" ry="15" fill={body} />
      <path d="M-24 -22 l-10 -6 l6 12 Z" fill={body} />
      <circle cx="18" cy="-38" r="11" fill={body === '#f4f4f0' ? '#2a7a4a' : body} />
      <path d="M27 -38 l12 3 l-12 4 Z" fill="#f08a20" />
      <circle cx="21" cy="-41" r="2.2" fill="#1a1a1a" />
      <path d="M-12 -20 q12 8 22 -2" stroke="#0002" strokeWidth="3" fill="none" />
    </g>
  )
}

function Deer() {
  return (
    <g>
      <path d="M-46 -50 L-70 -10 M-34 -50 L-50 0 M36 -50 L60 -14 M48 -50 L74 -24" stroke="#7a4a2a" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="0" cy="-66" rx="62" ry="26" fill="#9a6a3a" />
      <ellipse cx="-50" cy="-76" rx="12" ry="8" fill="#f4e8d8" />
      <path d="M44 -80 L66 -118" stroke="#9a6a3a" strokeWidth="18" strokeLinecap="round" />
      <g transform="translate(70 -124)">
        <ellipse cx="10" cy="4" rx="20" ry="11" fill="#9a6a3a" />
        <circle cx="12" cy="0" r="2.5" fill="#1a1a1a" />
        <circle cx="29" cy="6" r="3" fill="#1a1a1a" />
        <path d="M-2 -6 l-14 -24 m6 10 l-12 -4 M6 -8 l2 -28 m-1 12 l10 -8" stroke="#d8c8a0" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    </g>
  )
}

function Cart() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-56 -84 L-40 -84 L-26 -30 H38 L50 -70 H-34" stroke="#9aa8b8" strokeWidth="5" />
      <path d="M-22 -70 L-14 -30 M0 -70 V-30 M22 -70 L18 -30 M-30 -50 H44" stroke="#9aa8b8" strokeWidth="3" />
      <path d="M-26 -30 L-20 -12 H36" stroke="#9aa8b8" strokeWidth="4" />
      <rect x="-64" y="-90" width="16" height="10" rx="3" fill="#e8323a" stroke="none" />
      <circle cx="-16" cy="-6" r="6" fill={TIRE} />
      <circle cx="30" cy="-6" r="6" fill={TIRE} />
    </g>
  )
}

function Roofbox() {
  return (
    <g>
      <path d="M-66 -6 Q-70 -40 -30 -44 H40 Q72 -40 66 -6 Z" fill="#1e2026" stroke="#3a3e4a" strokeWidth="3" />
      <path d="M-40 -32 H40" stroke="#4a4e5a" strokeWidth="3" />
      <rect x="-56" y="-6" width="112" height="6" fill="#3a3e4a" />
    </g>
  )
}

function Gauge() {
  return (
    <g>
      <path d="M20 -260 V10 M360 -260 V10" stroke="#8a8a90" strokeWidth="5" strokeDasharray="10 5" />
      <rect x="0" y="10" width="380" height="60" rx="4" fill="#f2c830" stroke="#1a1a1a" strokeWidth="3" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${18 + i * 48} 10 l26 0 l-26 60 h-22 Z`} fill="#1a1a1a" />
      ))}
      <rect x="130" y="22" width="120" height="36" rx="6" fill="#fff" />
      <text x="190" y="52" textAnchor="middle" fontSize="32" fill="#1a1a1a" className="cz-sign">
        2,1 m
      </text>
    </g>
  )
}

function Tree() {
  return (
    <g transform="scale(0.7)">
      <rect x="-12" y="-110" width="24" height="110" fill="#6a4a2a" />
      <circle cx="0" cy="-170" r="70" fill="#3a8a3a" />
      <circle cx="-44" cy="-130" r="44" fill="#4a9a40" />
      <circle cx="46" cy="-136" r="46" fill="#2e7a34" />
    </g>
  )
}

const SPRITES: Record<Kind, (props: SpriteProps) => ReactNode> = {
  car: Car,
  suv: Suv,
  sportscar: Sportscar,
  van: Van,
  truck: Truck,
  bus: Bus,
  tractor: Tractor,
  scooter: Scooter,
  person: Person,
  cow: Cow,
  duck: () => <Duck size={1} body="#f4f4f0" />,
  duckling: () => <Duck size={0.6} body="#ffd84a" />,
  deer: Deer,
  cart: Cart,
  roofbox: Roofbox,
  gauge: Gauge,
  tree: Tree,
}

export function ActorSprite({ actor }: { actor: Actor }) {
  const Sprite = SPRITES[actor.kind]
  return <Sprite color={actor.color ?? '#d8323a'} pose={actor.pose ?? 'walk'} />
}
