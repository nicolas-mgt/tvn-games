import { useId, type CSSProperties, type ReactNode } from 'react'
import type { Art, Cell } from './logic'

const U = 100
const INSET = 5
const RADIUS = 14

type Material = { base: string; edge: string; pattern?: () => ReactNode; size?: number; angle?: number }
type ArtSpec = Material & { detail: ReactNode }

const stripes = (color: string, width = 14) => () => <rect width={width} height="40" fill={color} />
const dots = (color: string, r = 3) => () => (
  <>
    <circle cx="10" cy="10" r={r} fill={color} />
    <circle cx="30" cy="30" r={r} fill={color} />
  </>
)
const quilt = (color: string) => () => <path d="M0 0 L40 40 M40 0 L0 40" stroke={color} strokeWidth="2" strokeDasharray="5 4" />
const channels = (color: string) => () => <path d="M0 20 H40 M0 0 H40" stroke={color} strokeWidth="3" />
const grain = (color: string) => () => <path d="M0 10 Q10 6 20 10 T40 10 M0 28 Q12 24 22 28 T40 28" stroke={color} strokeWidth="2" fill="none" />
const ripstop = (color: string) => () => <path d="M0 0 H40 V40 M20 0 V40 M0 20 H40" stroke={color} strokeWidth="1.5" fill="none" />
const weave = (color: string) => () => (
  <>
    <path d="M0 10 Q10 4 20 10 T40 10 M0 30 Q10 24 20 30 T40 30" stroke={color} strokeWidth="5" fill="none" />
    <path d="M10 0 V40 M30 0 V40" stroke={color} strokeWidth="2" opacity="0.6" />
  </>
)
const spines = (colors: string[]) => () => (
  <>
    {colors.map((color, i) => (
      <g key={i}>
        <rect x={i * 10} width="10" height="40" fill={color} />
        <path d={`M${i * 10} 8 h10 M${i * 10} 32 h10`} stroke="rgb(255 255 255 / 0.5)" strokeWidth="1.5" />
      </g>
    ))}
  </>
)
const studs = (color: string) => () => (
  <>
    <circle cx="10" cy="10" r="6" fill={color} />
    <circle cx="30" cy="30" r="6" fill={color} />
    <circle cx="30" cy="10" r="6" fill={color} />
    <circle cx="10" cy="30" r="6" fill={color} />
  </>
)
const puzzleLines = (color: string) => () => (
  <path d="M0 20 H14 a5 5 0 1 0 12 0 H40 M20 0 V14 a5 5 0 1 1 0 12 V40" stroke={color} strokeWidth="2" fill="none" />
)
const bands = (colors: string[]) => () => (
  <>
    {colors.map((color, i) => (
      <rect key={i} y={i * 10} width="40" height="10" fill={color} />
    ))}
  </>
)

const ART: Record<Art, ArtSpec> = {
  kurtka: {
    base: '#3a5a8a',
    edge: '#22385a',
    pattern: quilt('#5a7ab0'),
    detail: (
      <g>
        <path d="M28 18 Q50 4 72 18" stroke="#e8e0d0" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M50 22 V90" stroke="#c9c9d0" strokeWidth="4" />
        <path d="M46 24 h8 v8 h-8 Z" fill="#c9c9d0" />
        <rect x="22" y="58" width="18" height="12" rx="3" fill="#22385a" />
        <rect x="60" y="58" width="18" height="12" rx="3" fill="#22385a" />
      </g>
    ),
  },
  parasole: {
    base: '#2a2a3a',
    edge: '#111118',
    pattern: stripes('#c03a4a', 10),
    angle: 30,
    detail: (
      <g fill="none" strokeLinecap="round">
        <path d="M36 16 V70 Q36 84 24 84 Q14 84 14 74" stroke="#8a5a2a" strokeWidth="7" />
        <path d="M64 12 V66 Q64 80 76 80 Q86 80 86 70" stroke="#d8b04a" strokeWidth="7" />
      </g>
    ),
  },
  buty: {
    base: '#c89a5a',
    edge: '#8a6230',
    pattern: channels('#b8884a'),
    detail: (
      <g>
        <rect x="8" y="8" width="84" height="16" fill="#e0b878" />
        <rect x="18" y="38" width="64" height="40" rx="3" fill="#fffbe8" stroke="#8a6230" strokeWidth="2" />
        <path d="M26 66 h34 q12 0 14 -6 q0 -6 -10 -6 l-14 -8 h-12 Z" fill="#2a2a30" />
        <text x="72" y="52" fontSize="12" fill="#8a6230" textAnchor="middle" fontWeight="700">
          38
        </text>
      </g>
    ),
  },
  kalosze: {
    base: '#2f8a4a',
    edge: '#1a5a2a',
    pattern: dots('#3aa05a', 2.5),
    detail: (
      <g fill="#f2c230" stroke="#b08a1a" strokeWidth="2.5">
        <path d="M18 14 h20 v52 h14 q8 0 8 10 v6 h-42 Z" />
        <path d="M54 22 h20 v44 h12 q6 0 6 8 v8 h-38 Z" />
      </g>
    ),
  },
  zakupy: {
    base: '#e8dcc0',
    edge: '#a8946a',
    pattern: ripstop('#d8c8a0'),
    detail: (
      <g>
        <path d="M30 40 Q30 12 50 12 Q70 12 70 40" stroke="#4a8a4a" strokeWidth="6" fill="none" />
        <circle cx="50" cy="64" r="20" fill="#4a8a4a" />
        <path d="M40 70 Q44 52 62 54 Q58 72 40 70 Z M42 70 L58 58" fill="#bfe0a0" stroke="#2a5a2a" strokeWidth="2" />
      </g>
    ),
  },
  ksiazki: {
    base: '#8a3a2a',
    edge: '#4a2018',
    pattern: spines(['#8a3a2a', '#2a5a8a', '#d8a23a', '#3a7a4a']),
    detail: (
      <g>
        <rect x="30" y="18" width="40" height="64" rx="3" fill="#fffbe8" stroke="#4a2018" strokeWidth="3" />
        <text x="50" y="58" fontSize="20" textAnchor="middle" fill="#8a3a2a" fontWeight="800">
          ABC
        </text>
        <path d="M60 18 V40 l-5 -5 -5 5 V18" fill="#e04a4a" />
      </g>
    ),
  },
  klocki: {
    base: '#e04a3a',
    edge: '#8a2218',
    pattern: studs('#f06a5a'),
    detail: (
      <g stroke="#2a2a30" strokeWidth="2">
        <rect x="20" y="58" width="40" height="22" fill="#f2c230" />
        <rect x="44" y="36" width="40" height="22" fill="#2f6fd0" />
        <rect x="26" y="14" width="40" height="22" fill="#3aa05a" />
      </g>
    ),
  },
  komiksy: {
    base: '#f2c230',
    edge: '#a88218',
    pattern: spines(['#f2c230', '#e04a8a', '#2fb0e0', '#f07a2a']),
    detail: (
      <g>
        <path d="M50 8 L58 30 L82 24 L66 42 L88 56 L62 58 L66 84 L50 66 L34 84 L38 58 L12 56 L34 42 L18 24 L42 30 Z" fill="#fff" stroke="#e03a3a" strokeWidth="3" />
        <text x="50" y="54" fontSize="18" textAnchor="middle" fill="#e03a3a" fontWeight="900">
          POW!
        </text>
      </g>
    ),
  },
  mis: {
    base: '#a8703a',
    edge: '#6a4220',
    pattern: dots('#b8804a', 4),
    detail: (
      <g>
        <circle cx="28" cy="26" r="13" fill="#a8703a" stroke="#6a4220" strokeWidth="3" />
        <circle cx="72" cy="26" r="13" fill="#a8703a" stroke="#6a4220" strokeWidth="3" />
        <circle cx="28" cy="26" r="6" fill="#e8b88a" />
        <circle cx="72" cy="26" r="6" fill="#e8b88a" />
        <circle cx="50" cy="54" r="32" fill="#a8703a" stroke="#6a4220" strokeWidth="3" />
        <ellipse cx="50" cy="66" rx="14" ry="11" fill="#e8b88a" />
        <circle cx="38" cy="48" r="4" fill="#2a1a10" />
        <circle cx="62" cy="48" r="4" fill="#2a1a10" />
        <ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#2a1a10" />
        <path d="M44 70 q6 5 12 0" stroke="#2a1a10" strokeWidth="2" fill="none" />
      </g>
    ),
  },
  gry: {
    base: '#2a6aa0',
    edge: '#183e60',
    pattern: bands(['#2a6aa0', '#e0583a', '#3a9a5a', '#f2c230']),
    detail: (
      <g>
        <rect x="26" y="26" width="48" height="48" rx="9" fill="#fff" stroke="#2a2a30" strokeWidth="3" />
        {[
          [38, 38],
          [62, 38],
          [50, 50],
          [38, 62],
          [62, 62],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="#2a2a30" />
        ))}
      </g>
    ),
  },
  kolejka: {
    base: '#d8a868',
    edge: '#8a6430',
    pattern: grain('#c08e4e'),
    detail: (
      <g stroke="#3a2a1a" strokeWidth="2.5">
        <rect x="14" y="40" width="54" height="28" rx="3" fill="#e04a3a" />
        <rect x="46" y="22" width="22" height="20" fill="#2f6fd0" />
        <rect x="20" y="28" width="10" height="12" fill="#2a2a30" />
        <path d="M68 50 h12 l6 18 h-18 Z" fill="#f2c230" />
        <circle cx="28" cy="74" r="8" fill="#2a2a30" />
        <circle cx="56" cy="74" r="8" fill="#2a2a30" />
      </g>
    ),
  },
  puzzle: {
    base: '#8ac0e0',
    edge: '#4a7a9a',
    pattern: puzzleLines('#5a90b0'),
    detail: (
      <path
        d="M24 34 H40 a10 10 0 1 1 20 0 H76 V50 a10 10 0 1 0 0 20 V82 H24 V66 a10 10 0 1 1 0 -20 Z"
        fill="#f29ab4"
        stroke="#b05a7a"
        strokeWidth="3"
      />
    ),
  },
  pilka: {
    base: '#f4e6c8',
    edge: '#b0a07a',
    pattern: stripes('#e8a0a0', 6),
    angle: 45,
    detail: (
      <g>
        <circle cx="50" cy="50" r="30" fill="#e04a3a" stroke="#8a2218" strokeWidth="3" />
        <path d="M22 42 Q50 58 78 42 M24 62 Q50 76 76 62" stroke="#fff" strokeWidth="6" fill="none" />
      </g>
    ),
  },
  torba: {
    base: '#2a3a6a',
    edge: '#141e3a',
    pattern: ripstop('#3a4c80'),
    detail: (
      <g>
        <path d="M20 28 Q50 6 80 28" stroke="#111" strokeWidth="6" fill="none" />
        <path d="M14 60 Q50 40 86 56 Q60 54 40 68 Z" fill="#fff" />
        <path d="M12 34 H88" stroke="#c9c9d0" strokeWidth="4" strokeDasharray="4 3" />
      </g>
    ),
  },
  walizka: {
    base: '#d04a3a',
    edge: '#822a1e',
    pattern: stripes('#b83a2c', 6),
    size: 24,
    detail: (
      <g>
        <rect x="32" y="10" width="36" height="16" rx="6" fill="none" stroke="#2a2a30" strokeWidth="6" />
        <rect x="24" y="40" width="52" height="34" rx="4" fill="#f4e6c8" stroke="#822a1e" strokeWidth="2" transform="rotate(-6 50 57)" />
        <text x="50" y="62" fontSize="14" textAnchor="middle" fill="#2f6fd0" fontWeight="800" transform="rotate(-6 50 57)">
          HEL
        </text>
      </g>
    ),
  },
  namiot: {
    base: '#4a8a3a',
    edge: '#2a5a20',
    pattern: stripes('#3e7a30', 8),
    angle: 45,
    detail: (
      <g>
        <path d="M14 80 L50 18 L86 80 Z" fill="#f2c230" stroke="#2a5a20" strokeWidth="3" />
        <path d="M50 80 L42 80 L50 44 L58 80 Z" fill="#2a5a20" />
        <path d="M50 18 L50 8" stroke="#2a2a30" strokeWidth="3" />
      </g>
    ),
  },
  walizeczka: {
    base: '#8a5a32',
    edge: '#4a2e14',
    pattern: dots('#7a4c28', 2),
    detail: (
      <g>
        <rect x="34" y="10" width="32" height="14" rx="5" fill="none" stroke="#2a1a10" strokeWidth="6" />
        <rect x="28" y="22" width="10" height="70" fill="#5a3a1e" />
        <rect x="62" y="22" width="10" height="70" fill="#5a3a1e" />
        <rect x="26" y="50" width="14" height="10" rx="2" fill="#d8b04a" />
        <rect x="60" y="50" width="14" height="10" rx="2" fill="#d8b04a" />
      </g>
    ),
  },
  spiwor: {
    base: '#f07a2a',
    edge: '#9a4a12',
    pattern: channels('#d8661c'),
    detail: (
      <g>
        <circle cx="50" cy="50" r="28" fill="#d8661c" stroke="#9a4a12" strokeWidth="3" />
        <circle cx="50" cy="50" r="16" fill="#f4a060" stroke="#9a4a12" strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill="#9a4a12" />
        <path d="M50 78 q-6 8 -2 14 M54 78 q6 8 2 14" stroke="#2a2a30" strokeWidth="2.5" fill="none" />
      </g>
    ),
  },
  kosz: {
    base: '#c89a5a',
    edge: '#7a5428',
    pattern: weave('#a8783a'),
    detail: (
      <g>
        <path d="M22 44 Q50 2 78 44" stroke="#7a5428" strokeWidth="7" fill="none" />
        <path d="M14 44 H86 L78 60 H22 Z" fill="#fff" />
        <path d="M14 44 H86 L78 60 H22 Z" fill="url(#pk-gingham-red)" />
      </g>
    ),
  },
  materac: {
    base: '#2fb0e0',
    edge: '#1a6a8a',
    pattern: stripes('#8ad8f4', 12),
    size: 24,
    detail: (
      <g>
        <circle cx="50" cy="50" r="14" fill="#fff" stroke="#1a6a8a" strokeWidth="3" />
        <circle cx="50" cy="50" r="5" fill="#1a6a8a" />
        <path d="M30 80 q20 -8 40 0" stroke="#f2c230" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  lodowka: {
    base: '#f4f6f8',
    edge: '#7a8a9a',
    detail: (
      <g>
        <rect x="6" y="6" width="88" height="24" rx="6" fill="#2f6fd0" />
        <rect x="30" y="12" width="40" height="8" rx="4" fill="#f4f6f8" />
        <g stroke="#2f6fd0" strokeWidth="4" strokeLinecap="round">
          <path d="M50 42 V86 M31 53 L69 75 M31 75 L69 53" />
        </g>
      </g>
    ),
  },
  parasol: {
    base: '#f4e6c8',
    edge: '#b0a07a',
    pattern: stripes('#e04a3a', 10),
    angle: 90,
    detail: (
      <g>
        <path d="M12 52 Q50 4 88 52 Q76 44 63 52 Q50 44 37 52 Q24 44 12 52 Z" fill="#2fb0e0" stroke="#1a6a8a" strokeWidth="2.5" />
        <path d="M50 30 V90" stroke="#5a3a1e" strokeWidth="5" />
      </g>
    ),
  },
  plecak: {
    base: '#f08a2a',
    edge: '#9a5412',
    pattern: ripstop('#e07a1a'),
    detail: (
      <g>
        <path d="M30 20 Q50 4 70 20" stroke="#2a2a30" strokeWidth="5" fill="none" />
        <rect x="24" y="48" width="52" height="36" rx="8" fill="#d8701a" stroke="#9a5412" strokeWidth="2.5" />
        <path d="M24 60 H76" stroke="#2a2a30" strokeWidth="2.5" strokeDasharray="3 3" />
      </g>
    ),
  },
}

function shapeRects(cells: readonly Cell[]) {
  const set = new Set(cells.map(([r, c]) => `${r},${c}`))
  const bridge = 2 * INSET + 2 * RADIUS
  return cells.map(([r, c]) => ({
    key: `${r},${c}`,
    x: c * U + INSET,
    y: r * U + INSET,
    w: U - 2 * INSET + (set.has(`${r},${c + 1}`) ? bridge : 0),
    h: U - 2 * INSET + (set.has(`${r + 1},${c}`) ? bridge : 0),
  }))
}

/** Detail sits at the shape's centre when a cell-sized box fits there, otherwise in the cell nearest the centre. */
function detailOrigin(cells: readonly Cell[]): [number, number] {
  const set = new Set(cells.map(([r, c]) => `${r},${c}`))
  const cx = cells.reduce((s, [, c]) => s + c + 0.5, 0) / cells.length
  const cy = cells.reduce((s, [r]) => s + r + 0.5, 0) / cells.length
  const corners = [
    [cy - 0.45, cx - 0.45],
    [cy - 0.45, cx + 0.45],
    [cy + 0.45, cx - 0.45],
    [cy + 0.45, cx + 0.45],
  ]
  if (corners.every(([y, x]) => set.has(`${Math.floor(y)},${Math.floor(x)}`))) return [(cx - 0.5) * U, (cy - 0.5) * U]
  const [r, c] = [...cells].sort((a, b) => Math.hypot(a[0] + 0.5 - cy, a[1] + 0.5 - cx) - Math.hypot(b[0] + 0.5 - cy, b[1] + 0.5 - cx))[0]
  return [c * U, r * U]
}

export function PieceArt({ art, cells, tag = false, className, style }: { art: Art; cells: readonly Cell[]; tag?: boolean; className?: string; style?: CSSProperties }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const spec = ART[art]
  const rows = Math.max(...cells.map(([r]) => r)) + 1
  const cols = Math.max(...cells.map(([, c]) => c)) + 1
  const rects = shapeRects(cells)
  const [dx, dy] = detailOrigin(cells)
  const size = spec.size ?? 40
  const [anchorRow, anchorCol] = cells[0]
  return (
    <svg viewBox={`0 0 ${cols * U} ${rows * U}`} className={className} style={style} data-art={art} aria-hidden>
      <defs>
        <pattern id={`pk-${uid}`} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform={spec.angle ? `rotate(${spec.angle})` : undefined}>
          <rect width={size} height={size} fill={spec.base} />
          {spec.pattern?.()}
        </pattern>
      </defs>
      <g stroke={spec.edge} strokeWidth="8" fill={spec.edge}>
        {rects.map((r) => (
          <rect key={r.key} x={r.x} y={r.y} width={r.w} height={r.h} rx={RADIUS} />
        ))}
      </g>
      <g fill={`url(#pk-${uid})`}>
        {rects.map((r) => (
          <rect key={r.key} x={r.x} y={r.y} width={r.w} height={r.h} rx={RADIUS} />
        ))}
      </g>
      <g fill="#fff" opacity="0.18">
        {rects.map((r) => (
          <rect key={r.key} x={r.x + 6} y={r.y + 6} width={r.w - 12} height="10" rx="5" />
        ))}
      </g>
      <g transform={`translate(${dx} ${dy})`}>{spec.detail}</g>
      {tag && (
        <g transform={`translate(${anchorCol * U + 10} ${anchorRow * U + 10})`}>
          <path d="M0 8 L8 0 H30 V16 H8 Z" fill="#fffbe8" stroke="#2a2a30" strokeWidth="2" />
          <circle cx="8" cy="8" r="2.5" fill="#2a2a30" />
        </g>
      )}
    </svg>
  )
}

export function SharedPatterns() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <pattern id="pk-gingham-red" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="8" height="16" fill="#e04a3a" opacity="0.5" />
          <rect width="16" height="8" fill="#e04a3a" opacity="0.5" />
        </pattern>
      </defs>
    </svg>
  )
}
