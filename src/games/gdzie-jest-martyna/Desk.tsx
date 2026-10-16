import './gdzie-jest-martyna.css'

export type BackdropMood = 'idle' | 'guess' | 'reveal' | 'close' | 'far' | 'result'

const PLANKS = Array.from({ length: 7 }, (_, i) => i * 130)

function Wood() {
  return (
    <>
      <defs>
        <linearGradient id="gm-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6a4026" />
          <stop offset="0.5" stopColor="#7c4c2c" />
          <stop offset="1" stopColor="#653c22" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#gm-wood)" />
      {PLANKS.map((y, i) => (
        <g key={y}>
          <path d={`M0 ${y} H1600`} stroke="#4a2a16" strokeWidth="4" />
          {[0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M0 ${y + 30 + k * 32} C300 ${y + 18 + k * 32 + (i % 2) * 14}, 700 ${y + 44 + k * 32}, 1000 ${y + 28 + k * 32} S1400 ${y + 40 + k * 32}, 1600 ${y + 26 + k * 32}`}
              stroke="#5a3420"
              strokeWidth="2"
              fill="none"
              opacity="0.55"
            />
          ))}
          <ellipse cx={(i * 397) % 1500 + 60} cy={y + 64} rx="26" ry="9" fill="none" stroke="#4e2c18" strokeWidth="2" opacity="0.6" />
        </g>
      ))}
    </>
  )
}

function LeftProps() {
  return (
    <>
      <g transform="translate(70 90) rotate(-12)">
        <rect width="190" height="260" rx="12" fill="#7a1e2a" />
        <rect x="8" y="8" width="174" height="244" rx="8" fill="none" stroke="#c9a24a" strokeWidth="2" opacity="0.7" />
        <circle cx="95" cy="110" r="38" fill="none" stroke="#d8b45a" strokeWidth="4" />
        <path d="M57 110 H133 M95 72 C75 95 75 125 95 148 C115 125 115 95 95 72" stroke="#d8b45a" strokeWidth="3" fill="none" />
        <text x="95" y="200" textAnchor="middle" fontSize="22" fill="#d8b45a" className="gm-sign">
          PASZPORT
        </text>
      </g>

      <g transform="translate(180 470)">
        <circle r="92" fill="#3a2a1a" />
        <circle r="82" fill="#d9ccae" />
        <circle r="82" fill="none" stroke="#8a6a3a" strokeWidth="3" />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d="M0 -80 V-70" stroke="#5a4a32" strokeWidth={i % 4 ? 2 : 4} transform={`rotate(${i * 22.5})`} />
        ))}
        {['N', 'E', 'S', 'W'].map((d, i) => (
          <text key={d} x="0" y="-52" textAnchor="middle" fontSize="20" fill="#3a2a1a" className="gm-sign" transform={`rotate(${i * 90})`}>
            {d}
          </text>
        ))}
        <g className="gm-needle">
          <path d="M0 -58 L9 0 L0 6 L-9 0 Z" fill="#c0362a" />
          <path d="M0 58 L9 0 L0 -6 L-9 0 Z" fill="#f4ecdc" stroke="#8a7a5a" strokeWidth="1" />
          <circle r="5" fill="#3a2a1a" />
        </g>
      </g>

      <g transform="translate(40 640) rotate(8)">
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${k * 24} ${k * 34}) rotate(${k * -6})`}>
            <rect width="250" height="96" rx="6" fill={k ? '#f4ecdc' : '#e6dcc4'} />
            <rect width="62" height="96" rx="6" fill={k ? '#2f6fa0' : '#c0563a'} />
            <path d="M62 0 V96" stroke="#fff" strokeWidth="2" strokeDasharray="5 5" />
            <text x="31" y="56" textAnchor="middle" fontSize="20" fill="#fff" className="gm-sign">
              {k ? 'KRK' : 'WAW'}
            </text>
            <text x="80" y="32" fontSize="16" fill="#3a2a1a" className="gm-sign">
              BOARDING PASS
            </text>
            <path d="M80 50 H230 M80 66 H190 M80 82 H210" stroke="#8a7a5a" strokeWidth="3" />
          </g>
        ))}
      </g>
    </>
  )
}

function RightProps() {
  return (
    <>
      <g transform="translate(1440 160)">
        <ellipse cx="6" cy="10" rx="96" ry="96" fill="rgb(0 0 0 / 0.25)" />
        <circle r="92" fill="#e8e0d0" />
        <circle r="74" fill="#5a3218" />
        <circle r="74" fill="none" stroke="#3a2010" strokeWidth="6" />
        <ellipse cx="-18" cy="-20" rx="26" ry="12" fill="#8a5a34" opacity="0.6" className="gm-steam" />
        <path d="M90 -20 q50 0 50 40 t-50 40" stroke="#e8e0d0" strokeWidth="18" fill="none" />
      </g>

      <g transform="translate(1330 330) rotate(64)">
        <rect width="300" height="20" fill="#f2c230" />
        <path d="M300 0 L340 10 L300 20 Z" fill="#e8c890" />
        <path d="M330 7 L340 10 L330 13 Z" fill="#2a2a2a" />
        <rect x="-30" width="30" height="20" rx="3" fill="#e86a8a" />
        <rect x="-4" width="10" height="20" fill="#b8b8c0" />
      </g>

      <g transform="translate(1350 560) rotate(-9)">
        <rect width="230" height="300" fill="#efe6cf" />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M${k * 77 + 77} 0 V300`} stroke="#d4c6a4" strokeWidth="2" />
        ))}
        <path d="M0 150 H230" stroke="#d4c6a4" strokeWidth="2" />
        <path d="M20 40 C80 80 120 30 160 120 S200 220 220 280" stroke="#c0402a" strokeWidth="6" fill="none" />
        <path d="M10 200 C70 170 120 230 230 190" stroke="#e8a83a" strokeWidth="5" fill="none" />
        <path d="M60 0 C70 90 40 180 90 300" stroke="#5a9ac0" strokeWidth="8" fill="none" opacity="0.7" />
        <circle cx="160" cy="120" r="9" fill="#2a2a2a" />
      </g>
    </>
  )
}

function Notebook() {
  return (
    <g>
      <rect x="276" y="56" width="1060" height="820" rx="18" fill="rgb(0 0 0 / 0.35)" />
      <rect x="260" y="40" width="1080" height="820" rx="18" fill="#3a2a22" />
      <rect x="280" y="52" width="512" height="796" rx="6" fill="#f2e8d2" />
      <rect x="808" y="52" width="512" height="796" rx="6" fill="#f4ebd6" />
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d={`M300 ${110 + i * 31} H772 M828 ${110 + i * 31} H1300`} stroke="#c9d6e0" strokeWidth="1.5" />
      ))}
      <path d="M340 52 V848" stroke="#e8a0a0" strokeWidth="2" />
      <rect x="788" y="52" width="24" height="796" fill="rgb(60 40 20 / 0.3)" />
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse key={i} cx="800" cy={90 + i * 54} rx="14" ry="6" fill="none" stroke="#9a9aa4" strokeWidth="4" />
      ))}
    </g>
  )
}

function OpenPassport() {
  return (
    <g>
      <rect x="320" y="70" width="980" height="780" rx="20" fill="#5a141e" />
      <rect x="340" y="86" width="466" height="748" rx="8" fill="#e8dcc0" />
      <rect x="814" y="86" width="466" height="748" rx="8" fill="#ebe0c6" />
      <path d="M810 86 V834" stroke="#b8a888" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M340 ${130 + i * 60} Q573 ${110 + i * 60} 806 ${130 + i * 60} M814 ${130 + i * 60} Q1047 ${150 + i * 60} 1280 ${130 + i * 60}`} stroke="#d8c8a6" strokeWidth="2" fill="none" />
      ))}
      <circle cx="573" cy="460" r="150" fill="none" stroke="#d0bc94" strokeWidth="3" />
      <circle cx="1047" cy="460" r="150" fill="none" stroke="#d0bc94" strokeWidth="3" />
    </g>
  )
}

export function Backdrop({ mood }: { mood: BackdropMood }) {
  return (
    <div className="gm-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-testid="backdrop" data-mood={mood}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="gm-layer">
        <Wood />
        <LeftProps />
        <RightProps />
        <g className="gm-desk-notebook">
          <Notebook />
        </g>
        <g className="gm-desk-passport">
          <OpenPassport />
        </g>
      </svg>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="gm-layer">
        <path
          className="gm-plane-shadow"
          d="M60 0 Q50 -8 30 -8 H-10 L-40 -70 H-58 L-36 -8 H-90 L-110 -36 H-122 L-112 0 L-122 36 H-110 L-90 8 H-36 L-58 70 H-40 L-10 8 H30 Q50 8 60 0 Z"
          fill="rgb(10 6 2 / 0.3)"
        />
      </svg>
      <div className="gm-lamp" />
      <div className="gm-tint" />
      <div className="gm-rain" />
      <div className="gm-vignette" />
    </div>
  )
}
