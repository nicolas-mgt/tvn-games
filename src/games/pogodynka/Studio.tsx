import './pogodynka.css'

export type BackdropMood = 'idle' | 'forecast' | 'waiting' | 'settle' | 'result'

const ISOBARS = ['M0 120 q120 -60 240 0 t240 0', 'M0 170 q120 -50 240 10 t240 -10', 'M0 220 q110 -40 240 20 t240 -20', 'M0 270 q140 -30 240 10 t240 0']
const LAMPS = [260, 560, 1040, 1340]

function Screen({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 150)`}>
      <rect width="480" height="330" rx="14" fill="#0a1a3a" stroke="#2a4a8a" strokeWidth="6" />
      <rect x="10" y="10" width="460" height="310" rx="8" fill="url(#pg-screen)" />
      <g className="pg-isobars" stroke="#8ac0ff" strokeWidth="2.5" fill="none" opacity="0.55">
        {ISOBARS.map((d) => (
          <path key={d} d={d} strokeDasharray="14 10" />
        ))}
      </g>
      <text x="90" y="120" fontSize="56" fill="#ff6a5a" className="pg-sign" opacity="0.8">
        W
      </text>
      <text x="350" y="240" fontSize="56" fill="#6ab0ff" className="pg-sign" opacity="0.8">
        N
      </text>
    </g>
  )
}

export function Backdrop({ mood }: { mood: BackdropMood }) {
  return (
    <div className="pg-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-testid="backdrop" data-mood={mood}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="pg-layer">
        <defs>
          <linearGradient id="pg-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0e2050" />
            <stop offset="1" stopColor="#1e3a7a" />
          </linearGradient>
          <linearGradient id="pg-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1a4a9a" />
            <stop offset="1" stopColor="#0a2a6a" />
          </linearGradient>
          <linearGradient id="pg-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a2440" />
            <stop offset="1" stopColor="#0a1020" />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#pg-wall)" />
        <path d="M-100 640 Q800 -40 1700 640" stroke="#3a6ac8" strokeWidth="40" fill="none" opacity="0.35" />
        <path d="M-100 640 Q800 20 1700 640" stroke="#f2b830" strokeWidth="6" fill="none" opacity="0.6" />
        <Screen x={60} />
        <Screen x={1060} />
        <rect y="40" width="1600" height="22" fill="#2a2a34" />
        {LAMPS.map((x) => (
          <g key={x} transform={`translate(${x} 62)`}>
            <path d="M0 0 v20" stroke="#2a2a34" strokeWidth="6" />
            <rect x="-30" y="20" width="60" height="44" rx="8" fill="#3a3a44" />
            <ellipse cx="0" cy="64" rx="24" ry="6" fill="#fff4d0" className="pg-lamp" />
          </g>
        ))}
        <g transform="translate(1440 560)" className="pg-clock">
          <circle r="54" fill="#f4f6fa" stroke="#2a4a8a" strokeWidth="8" />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M0 -44 v8" stroke="#2a3a5a" strokeWidth="4" transform={`rotate(${i * 30})`} />
          ))}
          <path className="pg-clock-hour" d="M0 0 v-26" stroke="#2a3a5a" strokeWidth="6" strokeLinecap="round" />
          <path className="pg-clock-minute" d="M0 0 v-40" stroke="#e8504a" strokeWidth="4" strokeLinecap="round" />
        </g>
        <rect y="640" width="1600" height="260" fill="url(#pg-floor)" />
        <ellipse cx="800" cy="700" rx="560" ry="40" fill="#3a6ac8" opacity="0.18" />
        <g transform="translate(560 770)">
          <rect width="480" height="70" rx="10" fill="#e8504a" />
          <text x="240" y="50" textAnchor="middle" fontSize="44" fill="#fff" className="pg-sign">
            POGODA NA JUTRO
          </text>
        </g>
        <g transform="translate(150 560)">
          <path d="M60 110 L10 330 M60 110 L110 330 M60 110 V330" stroke="#3a3a44" strokeWidth="8" />
          <rect x="0" y="40" width="130" height="80" rx="10" fill="#2a2a34" />
          <rect x="130" y="58" width="50" height="44" rx="6" fill="#3a3a44" />
          <circle cx="40" cy="66" r="10" fill="#e8504a" className="pg-tally" />
        </g>
      </svg>
      <div className="pg-lights" />
      <div className="pg-spot" />
      <div className="pg-tint" />
    </div>
  )
}
