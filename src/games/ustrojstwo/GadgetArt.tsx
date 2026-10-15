import type { ReactNode } from 'react'

const INK = '#1f1a17'
const C = {
  yellow: '#f6c445',
  yellowDark: '#d9a520',
  paper: '#f4f1ea',
  steel: '#b9c4cc',
  steelDark: '#7d8a94',
  red: '#e5533d',
  blue: '#4a90c8',
  teal: '#6cc4b8',
  green: '#5fae5a',
  wood: '#d39a5c',
  woodDark: '#a8703a',
  pink: '#f2a7b6',
  fluff: '#ece6d8',
  rubber: '#3d3a3a',
  orange: '#f08a3c',
  hole: '#2a2420',
}

type Point = [number, number]

function quad(p0: Point, c: Point, p1: Point, t: number): Point {
  const u = 1 - t
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]
}

const STEPS = [0.12, 0.22, 0.32, 0.42, 0.5, 0.58, 0.68, 0.78, 0.88]

function slipper(x: number, y: number) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[4, 13, 22, 31, 40, 49].map((cx) => (
        <circle key={cx} cx={cx} cy={30} r={6} fill={C.fluff} />
      ))}
      <path d="M0 26 Q0 6 18 4 L34 6 Q52 10 54 26 Z" fill={C.blue} />
      <path d="M18 4 Q22 16 38 12" fill="none" />
    </g>
  )
}

function boot(x: number, y: number) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M2 0 L2 28 Q2 36 10 36 L26 36 Q32 36 32 30 Q32 23 25 23 L16 23 L16 0 Z" fill={C.red} />
      <ellipse cx={9} cy={0} rx={7} ry={2.5} fill={C.hole} />
      <rect x={0} y={8} width={18} height={6} rx={2} fill={C.steelDark} />
    </g>
  )
}

const DRAWINGS: Record<string, ReactNode> = {
  'banana-slicer': (
    <>
      <path d="M12 40 Q60 106 108 40 L95 37 Q60 76 25 37 Z" fill={C.yellow} />
      {STEPS.map((t) => {
        const [x1, y1] = quad([12, 40], [60, 106], [108, 40], t)
        const [x2, y2] = quad([25, 37], [60, 76], [95, 37], t)
        return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={2} />
      })}
      <rect x={6} y={32} width={20} height={10} rx={4} fill={C.yellowDark} />
      <rect x={94} y={32} width={20} height={10} rx={4} fill={C.yellowDark} />
    </>
  ),
  'egg-separator': (
    <>
      <path d="M24 56 Q60 108 96 56 Z" fill={C.teal} />
      <ellipse cx={60} cy={56} rx={36} ry={10} fill={C.teal} />
      <ellipse cx={60} cy={56} rx={28} ry={6} fill={C.paper} />
      <path d="M32 66 Q36 74 42 78" fill="none" strokeWidth={5} stroke={C.hole} />
      <path d="M88 66 Q84 74 78 78" fill="none" strokeWidth={5} stroke={C.hole} />
      <path d="M96 56 L110 56 L110 70" fill="none" strokeWidth={6} />
      <path d="M96 56 L110 56 L110 70" fill="none" strokeWidth={3} stroke={C.teal} />
    </>
  ),
  'mustache-spoon': (
    <>
      <rect x={55} y={66} width={10} height={48} rx={5} fill={C.steel} />
      <ellipse cx={60} cy={40} rx={28} ry={32} fill={C.steel} />
      <path d="M32 40 A28 32 0 0 1 88 40 Z" fill={C.steelDark} />
      {[
        [48, 22], [60, 18], [72, 22], [42, 32], [54, 30], [66, 30], [78, 32],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.4} fill={C.hole} strokeWidth={0} />
      ))}
    </>
  ),
  'mop-slippers': (
    <>
      {slipper(6, 36)}
      {slipper(60, 52)}
    </>
  ),
  'beer-helmet': (
    <>
      <path d="M16 42 Q10 96 52 100" fill="none" strokeWidth={7} />
      <path d="M16 42 Q10 96 52 100" fill="none" strokeWidth={3} stroke={C.paper} />
      <path d="M104 42 Q110 96 68 100" fill="none" strokeWidth={7} />
      <path d="M104 42 Q110 96 68 100" fill="none" strokeWidth={3} stroke={C.paper} />
      <path d="M26 72 A34 34 0 0 1 94 72 Z" fill={C.red} />
      <path d="M22 72 L98 72" strokeWidth={5} />
      <path d="M44 42 Q60 34 76 42" fill="none" stroke={C.paper} strokeWidth={4} />
      <line x1={24} y1={56} x2={32} y2={58} />
      <line x1={96} y1={56} x2={88} y2={58} />
      <rect x={6} y={40} width={20} height={30} rx={3} fill={C.blue} />
      <rect x={94} y={40} width={20} height={30} rx={3} fill={C.green} />
      <ellipse cx={16} cy={40} rx={10} ry={3} fill={C.steel} />
      <ellipse cx={104} cy={40} rx={10} ry={3} fill={C.steel} />
    </>
  ),
  'ostrich-pillow': (
    <>
      <ellipse cx={60} cy={60} rx={46} ry={40} fill={C.steel} />
      <path d="M22 44 Q60 30 98 44" fill="none" strokeWidth={2} />
      <path d="M16 64 Q60 52 104 64" fill="none" strokeWidth={2} />
      <path d="M22 84 Q60 74 98 84" fill="none" strokeWidth={2} />
      <ellipse cx={32} cy={30} rx={8} ry={5} fill={C.hole} />
      <ellipse cx={88} cy={30} rx={8} ry={5} fill={C.hole} />
      <ellipse cx={60} cy={68} rx={10} ry={8} fill={C.hole} />
    </>
  ),
  'banana-case': (
    <>
      <path d="M8 40 Q60 124 112 40 Q106 26 94 30 Q60 50 26 30 Q14 26 8 40 Z" fill={C.yellow} />
      <path d="M14 38 Q60 92 106 38" fill="none" strokeWidth={2} strokeDasharray="5 4" />
      {[0.25, 0.4, 0.6, 0.75].map((t) => {
        const [cx, cy] = quad([14, 50], [60, 112], [106, 50], t)
        return <circle key={t} cx={cx} cy={cy} r={2.5} fill={C.yellowDark} strokeWidth={1.5} />
      })}
      <rect x={52} y={36} width={16} height={8} rx={2} fill={C.yellowDark} />
      <rect x={100} y={30} width={10} height={14} rx={3} fill={C.yellowDark} />
    </>
  ),
  'herb-scissors': (
    <>
      {[40, 48, 56, 64, 72].map((x) => (
        <path key={x} d={`M${x} 70 L${x} 22 L${x + 3} 14 L${x + 6} 22 L${x + 6} 70 Z`} fill={C.steel} strokeWidth={2} />
      ))}
      <rect x={36} y={62} width={48} height={10} rx={3} fill={C.steelDark} />
      <path d="M50 72 L42 88 M70 72 L78 88" strokeWidth={6} />
      <ellipse cx={38} cy={98} rx={15} ry={11} fill={C.green} />
      <ellipse cx={38} cy={98} rx={7} ry={5} fill={C.paper} />
      <ellipse cx={82} cy={98} rx={15} ry={11} fill={C.green} />
      <ellipse cx={82} cy={98} rx={7} ry={5} fill={C.paper} />
      <circle cx={60} cy={67} r={3} fill={C.paper} />
    </>
  ),
  'pasta-measure': (
    <>
      <rect x={10} y={32} width={100} height={60} rx={12} fill={C.wood} />
      <path d="M18 44 Q40 40 60 46 M60 80 Q84 86 102 80" fill="none" stroke={C.woodDark} strokeWidth={2} />
      {[
        [26, 6], [46, 9], [70, 12], [96, 15],
      ].map(([cx, r], i) => (
        <g key={cx}>
          <circle cx={cx - (i === 3 ? 4 : 0)} cy={58} r={r} fill={C.hole} />
          {Array.from({ length: i + 1 }, (_, d) => (
            <circle key={d} cx={cx - (i === 3 ? 4 : 0) - i * 3 + d * 6} cy={82} r={1.6} fill={INK} strokeWidth={0} />
          ))}
        </g>
      ))}
    </>
  ),
  'submarine-infuser': (
    <>
      <path d="M62 42 L62 24 L76 24" fill="none" strokeWidth={6} />
      <path d="M62 42 L62 24 L76 24" fill="none" strokeWidth={3} stroke={C.yellowDark} />
      <rect x={48} y={38} width={22} height={16} rx={4} fill={C.yellow} />
      <path d="M14 66 L6 56 L6 78 Z" fill={C.yellowDark} />
      <ellipse cx={60} cy={68} rx={44} ry={20} fill={C.yellow} />
      {[40, 60, 80].map((cx) => (
        <circle key={cx} cx={cx} cy={64} r={6} fill={C.blue} />
      ))}
      {[30, 42, 54, 66, 78, 90].map((cx) => (
        <circle key={cx} cx={cx} cy={80} r={1.8} fill={INK} strokeWidth={0} />
      ))}
    </>
  ),
  'dog-boots': (
    <>
      {boot(16, 14)}
      {boot(68, 14)}
      {boot(16, 66)}
      {boot(68, 66)}
    </>
  ),
  'corn-stripper': (
    <>
      <rect x={4} y={53} width={30} height={14} rx={6} fill={C.red} />
      <rect x={86} y={53} width={30} height={14} rx={6} fill={C.red} />
      <circle cx={60} cy={60} r={30} fill={C.steel} />
      <circle cx={60} cy={60} r={20} fill={C.hole} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        const tip = 13
        const base = 20
        const spread = 0.2
        const p = (r: number, ang: number) => `${60 + r * Math.cos(ang)} ${60 + r * Math.sin(ang)}`
        return <path key={i} d={`M${p(base, a - spread)} L${p(tip, a)} L${p(base, a + spread)} Z`} fill={C.paper} strokeWidth={1.5} />
      })}
    </>
  ),
  'apple-peeler': (
    <>
      <path d="M16 108 Q24 90 38 90 Q52 90 60 108 Z" fill={C.red} />
      <rect x={33} y={40} width={10} height={52} rx={3} fill={C.red} />
      <line x1={18} y1={46} x2={104} y2={46} strokeWidth={6} />
      <line x1={18} y1={46} x2={104} y2={46} strokeWidth={3} stroke={C.steel} />
      <path d="M18 46 L12 64" strokeWidth={5} />
      <circle cx={12} cy={68} r={6} fill={C.wood} />
      <path d="M104 40 L114 40 M104 52 L114 52" strokeWidth={4} />
      <path d="M43 82 L50 76 L54 82 L58 76 L62 82 L66 76 L70 80" fill="none" strokeWidth={2.5} />
      <path d="M70 80 L86 64" strokeWidth={4} />
      <rect x={82} y={56} width={14} height={8} rx={2} fill={C.steel} transform="rotate(-45 89 60)" />
    </>
  ),
  'tube-squeezer': (
    <>
      <circle cx={22} cy={62} r={14} fill={C.blue} />
      <circle cx={22} cy={62} r={5} fill={C.paper} />
      <rect x={32} y={50} width={72} height={24} rx={10} fill={C.blue} />
      <rect x={40} y={60} width={56} height={4} rx={2} fill={C.hole} strokeWidth={0} />
      <path d="M104 56 L112 56 L112 68 L104 68" fill={C.blue} />
    </>
  ),
  'usb-mug-warmer': (
    <>
      <path d="M88 70 Q112 70 106 44 Q102 28 108 20" fill="none" strokeWidth={4} />
      <rect x={100} y={4} width={16} height={18} rx={2} fill={C.steel} />
      <rect x={104} y={4} width={8} height={6} fill={C.hole} strokeWidth={0} />
      <path d="M14 66 L14 76 A38 14 0 0 0 90 76 L90 66" fill={C.rubber} />
      <ellipse cx={52} cy={66} rx={38} ry={14} fill={C.rubber} />
      <ellipse cx={52} cy={66} rx={26} ry={9} fill={C.orange} />
      <ellipse cx={52} cy={66} rx={14} ry={5} fill={C.yellow} strokeWidth={0} />
      <circle cx={80} cy={78} r={2.5} fill={C.green} strokeWidth={0} />
    </>
  ),
}

export const GADGET_ART: Record<string, ReactNode> = Object.fromEntries(
  Object.entries(DRAWINGS).map(([id, drawing]) => [
    id,
    <svg
      key={id}
      viewBox="0 0 120 120"
      className="size-full"
      stroke={INK}
      strokeWidth={3}
      strokeLinejoin="round"
      strokeLinecap="round"
      role="img"
      aria-label="Zawartość paczki"
      data-gadget={id}
    >
      {drawing}
    </svg>,
  ]),
)
