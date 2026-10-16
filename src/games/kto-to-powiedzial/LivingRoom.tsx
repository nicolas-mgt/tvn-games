import './kto-to-powiedzial.css'

export type BackdropMood = 'idle' | 'quote' | 'correct' | 'wrong' | 'result'

const BLOCKS = [
  [140, 250, 80, 230],
  [230, 300, 70, 180],
  [310, 220, 100, 260],
]
const LIT_WINDOWS = BLOCKS.flatMap(([x, y, w, h], b) =>
  Array.from({ length: Math.floor(h / 26) * Math.floor(w / 22) }, (_, i) => {
    const cols = Math.floor(w / 22)
    return { x: x + 6 + (i % cols) * 22, y: y + 10 + Math.floor(i / cols) * 26, lit: (i * 7 + b * 3) % 5 < 2 }
  }),
)
const BOOK_COLORS = ['#b8432f', '#d9a441', '#3f6f8f', '#6a8a3a', '#8a4a7a', '#c97a3a', '#2f4f6f']

function Wall() {
  return (
    <>
      <defs>
        <pattern id="kt-paper" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="#6b4536" />
          <path d="M40 8 C52 24 52 32 40 40 C28 32 28 24 40 8 Z M40 72 C28 56 28 48 40 40 C52 48 52 56 40 72 Z" fill="#7d5341" />
          <circle cx="0" cy="40" r="5" fill="#7d5341" />
          <circle cx="80" cy="40" r="5" fill="#7d5341" />
        </pattern>
        <linearGradient id="kt-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3a24" />
          <stop offset="1" stopColor="#3a2414" />
        </linearGradient>
      </defs>
      <rect width="1600" height="700" fill="url(#kt-paper)" />
      <rect y="660" width="1600" height="40" fill="#4a2e1e" />
      <rect y="700" width="1600" height="200" fill="url(#kt-floor)" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${i * 200 - 100} 900 L${i * 200} 700`} stroke="#2e1c10" strokeWidth="3" opacity="0.6" />
      ))}
      <ellipse cx="800" cy="830" rx="560" ry="80" fill="#8a2f2f" />
      <ellipse cx="800" cy="830" rx="520" ry="66" fill="none" stroke="#d9a441" strokeWidth="6" strokeDasharray="18 12" />
    </>
  )
}

function Window() {
  return (
    <g>
      <rect x="110" y="130" width="330" height="390" rx="6" fill="#e8dcc0" />
      <rect x="126" y="146" width="298" height="358" fill="#0e1a36" />
      {BLOCKS.map(([x, y, w, h]) => (
        <rect key={x} x={x} y={y} width={w} height={h + 40} fill="#1c2848" />
      ))}
      {LIT_WINDOWS.map((w) => (
        <rect key={`${w.x}-${w.y}`} x={w.x} y={w.y} width="12" height="14" fill={w.lit ? '#ffd27a' : '#2a3658'} className={w.lit ? 'kt-lit' : undefined} />
      ))}
      <circle cx="380" cy="190" r="22" fill="#f4ecd0" />
      <path d="M275 146 V504 M126 325 H424" stroke="#e8dcc0" strokeWidth="12" />
      <path d="M90 120 q50 220 10 420 h-30 V120 Z M460 120 q-50 220 -10 420 h30 V120 Z" fill="#a8483a" />
      <rect x="70" y="108" width="410" height="18" rx="9" fill="#5a3a24" />
    </g>
  )
}

function Lamp() {
  return (
    <g>
      <path d="M560 300 V670" stroke="#3a2a1a" strokeWidth="8" />
      <ellipse cx="560" cy="676" rx="50" ry="10" fill="#3a2a1a" />
      <path className="kt-shade" d="M500 300 L620 300 L590 200 L530 200 Z" fill="#f2c870" />
    </g>
  )
}

function Shelf() {
  return (
    <g>
      <rect x="1200" y="170" width="300" height="500" fill="#5a3a24" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <rect x="1214" y={190 + k * 120} width="272" height="100" fill="#3a2414" />
          {Array.from({ length: k === 1 ? 4 : 8 }, (_, i) => (
            <rect key={i} x={1222 + i * 30} y={200 + k * 120 + ((i * 13) % 20)} width="24" height={90 - ((i * 13) % 20)} fill={BOOK_COLORS[(i + k * 3) % BOOK_COLORS.length]} />
          ))}
        </g>
      ))}
      <path d="M1380 300 q-20 -30 0 -70 q20 40 0 70 Z" fill="#3f8f8f" />
      <rect x="1360" y="290" width="40" height="20" rx="6" fill="#2f6f6f" />
      <circle cx="1450" cy="290" r="16" fill="#d9a441" />
      <path d="M1440 300 h20 l6 10 h-32 Z" fill="#b8822a" />
    </g>
  )
}

function Table() {
  return (
    <g>
      <rect x="600" y="790" width="400" height="22" rx="6" fill="#6a4426" />
      <path d="M630 812 V880 M970 812 V880" stroke="#4a2e1a" strokeWidth="12" />
      <g transform="translate(660 730) rotate(-8)">
        <path d="M0 60 L6 0 H86 L92 60 Z" fill="#e8b02a" />
        <path d="M6 0 L14 -10 H78 L86 0 Z" fill="#c8901a" />
        <text x="46" y="38" textAnchor="middle" fontSize="22" fill="#b8302a" className="kt-sign">
          CHIPSY
        </text>
      </g>
      <g transform="translate(860 772) rotate(12)">
        <rect width="90" height="22" rx="8" fill="#2a2a30" />
        <circle cx="16" cy="11" r="5" fill="#d03a3a" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={36 + i * 16} cy="11" r="4" fill="#8a8a94" />
        ))}
      </g>
    </g>
  )
}

export function Backdrop({ mood }: { mood: BackdropMood }) {
  return (
    <div className="kt-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-testid="backdrop" data-mood={mood}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="kt-layer">
        <Wall />
        <Window />
        <Lamp />
        <Shelf />
        <Table />
      </svg>
      <div className="kt-lamp-glow" />
      <div className="kt-tv-glow" />
      <div className="kt-onair-glow" />
      <div className="kt-tint" />
      <div className="kt-vignette" />
    </div>
  )
}
