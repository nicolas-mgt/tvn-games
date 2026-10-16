import './poukladani.css'

export type BackdropMood = 'idle' | 'packing' | 'fit' | 'blocked' | 'solved' | 'result'

const COATS = [
  ['#3a5a8a', 230],
  ['#b0402a', 200],
  ['#6a7a3a', 250],
  ['#d8a23a', 170],
] as const

function Hallway() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="pk-layer">
      <rect width="1600" height="900" fill="#e9dcc3" />
      <path d="M0 0 H1600 V40 H0 Z" fill="#f4ecdc" />
      <rect y="560" width="1600" height="200" fill="#c9b48e" />
      <path d="M0 560 H1600" stroke="#a8916a" strokeWidth="8" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={20 + i * 100} y="590" width="80" height="140" rx="4" fill="none" stroke="#b39d76" strokeWidth="3" />
      ))}
      <rect y="760" width="1600" height="140" fill="#8a5a34" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${i * 150 - 40} 760 L${i * 150 + 60} 900`} stroke="#6e4628" strokeWidth="3" />
      ))}
      <path d="M800 0 V90" stroke="#555" strokeWidth="3" />
      <path d="M760 90 H840 L870 140 H730 Z" fill="#3a6a5a" />
      <ellipse cx="800" cy="146" rx="20" ry="8" className="pk-bulb" fill="#ffe9a8" />

      <rect x="130" y="250" width="300" height="20" rx="6" fill="#7a4a2a" />
      {COATS.map(([color, len], i) => {
        const x = 170 + i * 72
        return (
          <g key={i} className="pk-sway" style={{ animationDelay: `${-i * 0.7}s`, transformOrigin: `${x}px 262px` }}>
            <circle cx={x} cy="262" r="7" fill="#c9a24a" />
            <path d={`M${x - 26} 290 Q${x} 262 ${x + 26} 290 L${x + 34} ${290 + len} H${x - 34} Z`} fill={color} />
            <path d={`M${x} 280 V${290 + len}`} stroke="rgb(0 0 0 / 0.2)" strokeWidth="3" />
          </g>
        )
      })}
      <g>
        <path d="M150 770 h50 q10 0 10 -14 v-30 h-30 v24 h-30 Z" fill="#2a2a30" />
        <path d="M230 770 h50 q10 0 10 -14 v-30 h-30 v24 h-30 Z" fill="#2a2a30" />
        <path d="M330 772 h60 q8 0 8 -10 q0 -14 -24 -16 l-20 -12 h-24 Z" fill="#c03a2a" />
      </g>

      <ellipse cx="1330" cy="340" rx="100" ry="150" fill="#b98a4a" />
      <ellipse cx="1330" cy="340" rx="84" ry="134" fill="#cfe2ea" />
      <path d="M1280 260 L1320 220 M1290 300 L1360 230" stroke="#fff" strokeWidth="10" opacity="0.6" strokeLinecap="round" />
      <rect x="1460" y="200" width="140" height="560" fill="#9a6a40" />
      <rect x="1480" y="220" width="120" height="540" fill="#b07c4c" />
      <circle cx="1500" cy="500" r="9" fill="#d8b04a" />
      <rect x="1180" y="380" width="22" height="34" rx="4" fill="#f4ecdc" stroke="#c9b48e" strokeWidth="2" />

      <rect x="610" y="805" width="380" height="60" rx="10" fill="#7a5a3a" />
      <rect x="622" y="815" width="356" height="40" rx="6" fill="none" stroke="#a88a5a" strokeWidth="3" strokeDasharray="10 6" />
      <text x="800" y="845" textAnchor="middle" fontSize="28" fill="#d8bc8a" className="pk-sign">
        WITAMY
      </text>
    </svg>
  )
}

function KidsRoom() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="pk-layer">
      <defs>
        <pattern id="pk-stars" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="#bcd8ee" />
          <path d="M30 20 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1 Z" fill="#f6e08a" />
          <circle cx="90" cy="80" r="5" fill="#fff" opacity="0.8" />
          <circle cx="70" cy="30" r="3" fill="#fff" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#pk-stars)" />
      <path d="M0 140 Q200 190 400 140 T800 140 T1200 140 T1600 140" stroke="#8a6a9a" strokeWidth="3" fill="none" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 50 + i * 100
        const colors = ['#e85a5a', '#f2c230', '#4aa0e0', '#5ac07a']
        return <path key={i} d={`M${x - 22} ${150 + Math.sin(i) * 6} h44 l-22 40 Z`} fill={colors[i % 4]} />
      })}
      <rect y="740" width="1600" height="160" fill="#d9b483" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M0 ${760 + i * 18} H1600`} stroke="#c49c6a" strokeWidth="2" />
      ))}
      <ellipse cx="800" cy="840" rx="420" ry="52" fill="#e86a8a" />
      <ellipse cx="800" cy="840" rx="320" ry="38" fill="#f2c230" />
      <ellipse cx="800" cy="840" rx="210" ry="24" fill="#4aa0e0" />

      <rect x="40" y="560" width="420" height="190" rx="16" fill="#e8b65a" />
      <rect x="30" y="480" width="40" height="280" rx="10" fill="#c98a3a" />
      <rect x="430" y="540" width="40" height="220" rx="10" fill="#c98a3a" />
      <path d="M70 560 Q260 520 430 560 V680 H70 Z" fill="#5a9ae0" />
      <path d="M70 600 H430 M70 640 H430" stroke="#4a86c8" strokeWidth="6" />
      <ellipse cx="130" cy="545" rx="56" ry="26" fill="#fff" />
      <g>
        <circle cx="560" cy="752" r="30" fill="#e85a5a" />
        <path d="M534 740 Q560 760 586 740" stroke="#fff" strokeWidth="5" fill="none" />
      </g>
      <rect x="1060" y="720" width="34" height="34" fill="#5ac07a" />
      <rect x="1094" y="720" width="34" height="34" fill="#f2c230" />
      <rect x="1077" y="686" width="34" height="34" fill="#4aa0e0" />

      <rect x="1340" y="170" width="220" height="300" rx="6" fill="#fff" />
      <rect x="1356" y="186" width="188" height="268" fill="#2a3a6a" />
      <circle cx="1490" cy="250" r="26" fill="#f6e08a" />
      <circle cx="1502" cy="242" r="22" fill="#2a3a6a" />
      <path d="M1450 186 V454 M1356 320 H1544" stroke="#fff" strokeWidth="8" />
      <path d="M1320 160 Q1340 330 1310 480 H1360 V160 Z M1580 160 Q1560 330 1590 480 H1540 V160 Z" fill="#e86a8a" />
      <rect x="1190" y="610" width="140" height="140" rx="8" fill="#c98a3a" />
      <path d="M1240 610 L1225 540 H1295 L1280 610 Z" fill="#f6d27a" className="pk-lamp" />
      <rect x="1255" y="520" width="10" height="24" fill="#8a6a4a" />
    </svg>
  )
}

function Parking({ night }: { night: boolean }) {
  const windows = [] as { x: number; y: number; lit: boolean }[]
  for (let row = 0; row < 8; row++)
    for (let col = 0; col < 22; col++) windows.push({ x: 40 + col * 70, y: 170 + row * 56, lit: (row * 7 + col * 13) % 5 < (night ? 4 : 2) })
  const sky = night ? 'pk-sky-night' : 'pk-sky-dusk'
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="pk-layer">
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? '#0c1230' : '#2a3a7a'} />
          <stop offset="0.7" stopColor={night ? '#2a2a5a' : '#e88a5a'} />
          <stop offset="1" stopColor={night ? '#3a3a6a' : '#f6c27a'} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${sky})`} />
      {night && [120, 380, 700, 1020, 1300, 1500].map((x, i) => <circle key={x} cx={x} cy={40 + (i % 3) * 30} r="2.5" fill="#fff" />)}
      <rect x="10" y="140" width="1580" height="520" fill={night ? '#4a4a5e' : '#9a96a0'} />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M10 ${140 + i * 58} H1590`} stroke={night ? '#3a3a4c' : '#86828c'} strokeWidth="3" />
      ))}
      {windows.map((w, i) => (
        <rect key={i} x={w.x} y={w.y} width="40" height="34" fill={w.lit ? '#f6d27a' : night ? '#22223a' : '#4a5a7a'} className={w.lit ? 'pk-window' : undefined} />
      ))}
      <rect x="0" y="660" width="1600" height="40" fill="#8a8a90" />
      <rect x="0" y="700" width="1600" height="200" fill="#3a3a42" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${i * 200} 720 L${i * 200 - 60} 900`} stroke="#e8e8e8" strokeWidth="6" />
      ))}
      <path d="M240 700 V300 Q240 270 270 270 H310" stroke="#2a2a30" strokeWidth="12" fill="none" />
      <path d="M300 262 H350 L340 284 H310 Z" fill="#2a2a30" />
      <polygon points="325,284 260,700 390,700" fill="#ffe9a8" opacity="0.12" className="pk-lamp" />
      <ellipse cx="1420" cy="430" rx="110" ry="140" fill={night ? '#1e3a2a' : '#3a7a4a'} />
      <rect x="1410" y="540" width="20" height="160" fill="#5a3a2a" />
    </svg>
  )
}

export function Backdrop({ mood, level }: { mood: BackdropMood; level: number }) {
  const scene = mood === 'result' ? 'result' : String(level)
  return (
    <div className="pk-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-testid="backdrop" data-mood={mood} data-level={level}>
      <div className="pk-scene" data-active={scene === '0'}>
        <Hallway />
      </div>
      <div className="pk-scene" data-active={scene === '1'}>
        <KidsRoom />
      </div>
      <div className="pk-scene" data-active={scene === '2'}>
        <Parking night={false} />
      </div>
      <div className="pk-scene" data-active={scene === 'result'}>
        <Parking night />
      </div>
      <div className="pk-tint" />
      <div className="pk-spot" />
      <div className="pk-vignette" />
    </div>
  )
}
