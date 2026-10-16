import './co-sie-zaraz-stanie.css'

export type BackdropMood = 'idle' | 'paused' | 'playing' | 'correct' | 'wrong' | 'result'

const POSTS = [-620, -380, -200, -90, 90, 200, 380, 620]
const WARNINGS = [
  { x: 330, color: '#ffb020', d: 'M-9 6 h18 l-3 -10 h-12 Z' },
  { x: 370, color: '#e8323a', d: 'M0 -9 v12 M0 7 v2' },
  { x: 410, color: '#ffb020', d: 'M-8 -6 h16 v10 h-16 Z M-4 4 v4 M4 4 v4' },
  { x: 450, color: '#3ad06a', d: 'M-9 0 l5 -5 v3 h8 v4 h-8 v3 Z' },
]

function Gauge({ x, label }: { x: number; label: string }) {
  return (
    <g transform={`translate(${x} 655)`}>
      <circle r="62" fill="#0c0e14" stroke="#3a3e4a" strokeWidth="5" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d="M0 -52 v10" stroke="#8a90a0" strokeWidth="3" transform={`rotate(${-120 + i * 30})`} className="cz-tick" />
      ))}
      <text y="30" textAnchor="middle" fontSize="13" fill="#8a90a0" className="cz-sign">
        {label}
      </text>
      <path d="M0 0 v-46" stroke="#ff5a3a" strokeWidth="4" strokeLinecap="round" className="cz-needle" />
      <circle r="7" fill="#3a3e4a" />
    </g>
  )
}

export function Backdrop({ mood }: { mood: BackdropMood }) {
  return (
    <div className="cz-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-testid="backdrop" data-mood={mood}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="cz-layer">
        <defs>
          <linearGradient id="cz-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a5a8a" />
            <stop offset="1" stopColor="#a8b8c8" />
          </linearGradient>
          <linearGradient id="cz-dash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2d36" />
            <stop offset="1" stopColor="#0e1016" />
          </linearGradient>
          <filter id="cz-blur">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <g filter="url(#cz-blur)">
          <rect width="1600" height="900" fill="url(#cz-sky)" />
          <path d="M0 400 Q200 330 420 380 T860 360 T1300 370 T1600 350 V420 H0 Z" fill="#4a6a5a" />
          <rect y="410" width="1600" height="490" fill="#5a7a4a" />
          <path d="M770 410 H830 L1500 900 H100 Z" fill="#4a4c54" />
          <path d="M800 410 L800 900" stroke="#f4f4f0" strokeWidth="10" strokeDasharray="30 40" className="cz-lane" />
          {POSTS.map((dx) => (
            <path key={dx} d={`M${800 + dx * 0.15} 420 L${800 + dx * 1.3} 640`} stroke="#d8d8d0" strokeWidth="6" strokeDasharray="8 30" className="cz-lane" />
          ))}
        </g>

        <path fillRule="evenodd" fill="#15171e" d="M0 0 H1600 V900 H0 Z M200 70 Q800 30 1400 70 L1570 580 Q800 520 30 580 Z" />
        <path d="M200 70 Q800 30 1400 70" stroke="#2a2d36" strokeWidth="10" fill="none" />

        <g transform="translate(800 0)">
          <rect x="-12" y="0" width="24" height="70" fill="#2a2d36" />
          <rect x="-150" y="66" width="300" height="78" rx="24" fill="#20232c" stroke="#3a3e4a" strokeWidth="5" />
          <rect x="-136" y="78" width="272" height="54" rx="16" fill="#6a7a8a" opacity="0.7" />
          <rect x="-50" y="148" width="100" height="56" rx="12" fill="#101218" />
          <circle cx="-14" cy="176" r="18" fill="#1e2a3a" stroke="#4a5a6a" strokeWidth="4" />
          <circle cx="-14" cy="176" r="7" fill="#3a6a9a" />
          <circle cx="28" cy="164" r="6" fill="#e8323a" className="cz-led" />
          <g className="cz-freshener">
            <path d="M60 144 V220" stroke="#d8d8d0" strokeWidth="2" />
            <path d="M60 220 l-22 40 h12 l-16 30 h52 l-16 -30 h12 Z" fill="#3a9a4a" />
          </g>
        </g>

        <path d="M0 610 Q800 520 1600 610 V900 H0 Z" fill="url(#cz-dash)" />
        <path d="M0 610 Q800 520 1600 610" stroke="#3a3e4a" strokeWidth="6" fill="none" />

        <g>
          <path d="M240 600 Q390 560 540 600 V720 H240 Z" fill="#0e1016" />
          <Gauge x={320} label="KM/H" />
          <Gauge x={460} label="RPM" />
          <g className="cz-warnings">
            {WARNINGS.map((w) => (
              <path key={w.x} d={w.d} transform={`translate(${w.x} 610)`} stroke={w.color} strokeWidth="3" fill="none" strokeLinecap="round" />
            ))}
          </g>
        </g>

        <g transform="translate(800 640)">
          <rect x="-110" y="-10" width="220" height="110" rx="12" fill="#0a0c12" stroke="#3a3e4a" strokeWidth="4" />
          <rect x="-98" y="2" width="196" height="86" rx="6" className="cz-screen" />
          <text y="58" textAnchor="middle" fontSize="34" className="cz-sign cz-screen-text">
            REC ●
          </text>
          <g transform="translate(0 150)" className="cz-hazard">
            <rect x="-34" y="-26" width="68" height="52" rx="10" fill="#2a2d36" stroke="#4a4e5a" strokeWidth="3" />
            <path d="M0 -14 L15 12 H-15 Z" fill="none" stroke="#e8323a" strokeWidth="5" strokeLinejoin="round" className="cz-hazard-icon" />
          </g>
          {[-170, 170].map((dx) => (
            <g key={dx} transform={`translate(${dx} 30)`}>
              <rect x="-40" y="-26" width="80" height="52" rx="10" fill="#0e1016" />
              {[-14, 0, 14].map((dy) => (
                <path key={dy} d={`M-30 ${dy} H30`} stroke="#2a2d36" strokeWidth="5" />
              ))}
            </g>
          ))}
          <circle cx="0" cy="-40" r="8" className="cz-ok" />
        </g>

        <g transform="translate(390 860)">
          <circle r="250" fill="none" stroke="#0a0b10" strokeWidth="40" />
          <path d="M-240 20 L-70 40 M240 20 L70 40 M0 80 V240" stroke="#0a0b10" strokeWidth="36" />
          <circle r="80" fill="#14161c" stroke="#2a2d36" strokeWidth="6" />
        </g>

        <path d="M1100 720 Q1300 690 1520 720 V800 Q1300 780 1100 800 Z" fill="#1a1c24" stroke="#2a2d36" strokeWidth="4" />
      </svg>
      <div className="cz-glow" />
      <div className="cz-hazard-glow" />
      <div className="cz-tint" />
    </div>
  )
}
