import './stylizacja.css'

export type BackdropMood = 'idle' | 'dressing' | 'urgent' | 'runway' | 'jury' | 'result'

const HANGERS = [
  ['#d8323a', 70],
  ['#2f6fd0', 110],
  ['#f2c230', 90],
  ['#2f9e55', 120],
  ['#f29ab4', 80],
  ['#1f1f24', 130],
  ['#b07a4a', 100],
] as const

function Rack({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 300 H${x + 300} M${x + 10} 300 V720 M${x + 290} 300 V720 M${x - 10} 720 H${x + 30} M${x + 270} 720 H${x + 310}`} stroke="#9aa3ad" strokeWidth="8" strokeLinecap="round" />
      <circle cx={x + 2} cy="730" r="10" fill="#3a3a40" />
      <circle cx={x + 298} cy="730" r="10" fill="#3a3a40" />
      {HANGERS.map(([color, len], i) => {
        const hx = x + 30 + i * 40
        return (
          <g key={i} className="st-hanger" style={{ animationDelay: `${-i * 0.4}s`, transformOrigin: `${hx}px 300px` }}>
            <path d={`M${hx} 300 q0 -8 6 -8 M${hx - 18} 318 L${hx} 304 L${hx + 18} 318`} stroke="#c8ced6" strokeWidth="3" fill="none" />
            <path d={`M${hx - 18} 318 H${hx + 18} L${hx + 22} ${330 + len} H${hx - 22} Z`} fill={color} opacity="0.92" />
          </g>
        )
      })}
    </g>
  )
}

function Mirror() {
  const bulbs = [] as [number, number][]
  for (let i = 0; i < 6; i++) bulbs.push([110 + i * 52, 150], [110 + i * 52, 560])
  for (let i = 1; i < 8; i++) bulbs.push([84, 150 + i * 51.25], [396, 150 + i * 51.25])
  return (
    <g>
      <rect x="70" y="136" width="340" height="438" rx="12" fill="#3a2a30" stroke="#c99a3a" strokeWidth="6" />
      <rect x="104" y="170" width="272" height="370" rx="6" fill="#8fa8b8" />
      <path d="M130 190 L210 190 L140 300 Z M300 380 L360 320 L360 400 Z" fill="#fff" opacity="0.25" />
      <g className="st-bulbs">
        {bulbs.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="11" fill="#fff4c0" stroke="#e0b25a" strokeWidth="2" style={{ animationDelay: `${-(i % 5) * 0.25}s` }} />
        ))}
      </g>
      <rect x="40" y="574" width="400" height="26" fill="#6a3f4a" />
      <rect x="60" y="600" width="18" height="130" fill="#4a2a30" />
      <rect x="402" y="600" width="18" height="130" fill="#4a2a30" />
      <g>
        <rect x="140" y="548" width="16" height="26" rx="3" fill="#d8323a" />
        <rect x="170" y="540" width="22" height="34" rx="4" fill="#f29ab4" />
        <circle cx="181" cy="536" r="6" fill="#c8ced6" />
        <path d="M300 574 l10 -40 l6 0 l-4 40 Z" fill="#b07a4a" />
        <ellipse cx="350" cy="568" rx="20" ry="6" fill="#f2c230" />
      </g>
    </g>
  )
}

function Backstage() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="st-layer" aria-hidden>
      <rect width="1600" height="740" fill="#3a2440" />
      <g stroke="#45304a" strokeWidth="4">
        {Array.from({ length: 20 }, (_, i) => (
          <path key={i} d={`M${i * 80 + 40} 0 V740`} />
        ))}
      </g>
      <rect y="740" width="1600" height="160" fill="#2a1a24" />
      <path d="M0 740 H1600" stroke="#1a1018" strokeWidth="6" />
      <path d="M560 0 Q600 300 570 740 H460 Q500 300 440 0 Z M1040 0 Q1000 300 1030 740 H1140 Q1100 300 1160 0 Z" fill="#8a1a2a" />
      <g stroke="#6a1020" strokeWidth="5" fill="none">
        <path d="M470 0 Q520 300 490 740 M520 0 Q560 300 530 740 M1130 0 Q1080 300 1110 740 M1080 0 Q1040 300 1070 740" />
      </g>
      <Mirror />
      <Rack x={1200} />
      <g className="st-onstage">
        <rect x="690" y="40" width="220" height="70" rx="10" fill="#2a0f12" stroke="#5a2a2a" strokeWidth="5" />
        <text x="800" y="90" textAnchor="middle" className="st-sign-text st-onstage-text" fontSize="44">
          NA SCENĘ!
        </text>
        <circle className="st-alarm" cx="660" cy="75" r="16" fill="#5a1a1a" />
        <circle className="st-alarm" cx="940" cy="75" r="16" fill="#5a1a1a" />
      </g>
    </svg>
  )
}

function Runway() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="st-layer" aria-hidden>
      <rect width="1600" height="900" fill="#0f0f1c" />
      <g fill="#24243a">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={i * 140 - 20} y="0" width="60" height="520" opacity="0.5" />
        ))}
      </g>
      <polygon points="700,0 900,0 1050,900 550,900" fill="#fff6d8" opacity="0.08" className="st-spot" />
      <path d="M640 420 H960 L1160 900 H440 Z" fill="#e8e4ee" />
      <path d="M640 420 H960 L1160 900 H440 Z" fill="url(#st-runway-shine)" />
      <path d="M800 420 V900" stroke="#cfc8da" strokeWidth="4" strokeDasharray="20 16" />
      <defs>
        <linearGradient id="st-runway-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#c8c0d8" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((row) =>
        Array.from({ length: 8 }, (_, i) => {
          const left = i < 4
          const x = left ? 60 + i * 95 + row * 30 : 1200 + (i - 4) * 95 - row * 30
          const y = 560 + row * 110
          return (
            <g key={`${row}-${i}`} fill="#1a1a2a">
              <circle cx={x} cy={y} r="24" />
              <path d={`M${x - 40} ${y + 90} Q${x - 40} ${y + 26} ${x} ${y + 26} Q${x + 40} ${y + 26} ${x + 40} ${y + 90} Z`} />
              {(i + row) % 3 === 0 && (
                <g className="st-camera">
                  <rect x={x + (left ? 14 : -38)} y={y + 4} width="24" height="16" rx="3" fill="#3a3a4a" />
                  <circle className="st-flash" cx={x + (left ? 26 : -26)} cy={y + 12} r="9" fill="#fff" style={{ animationDelay: `${((i * 7 + row * 3) % 10) * 0.13}s` }} />
                </g>
              )}
            </g>
          )
        }),
      )}
      <g className="st-jury-table">
        <rect x="560" y="300" width="480" height="60" rx="8" fill="#2a2a40" stroke="#c99a3a" strokeWidth="4" />
        <text x="800" y="342" textAnchor="middle" className="st-sign-text" fontSize="34" fill="#f2c230">
          JURY
        </text>
      </g>
    </svg>
  )
}

export function Backdrop({ mood }: { mood: BackdropMood }) {
  return (
    <div className="st-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-testid="backdrop" data-mood={mood}>
      <div className="st-backstage">
        <Backstage />
      </div>
      <div className="st-runway">
        <Runway />
      </div>
      <div className="st-tint" />
      <div className="st-vignette" />
    </div>
  )
}
