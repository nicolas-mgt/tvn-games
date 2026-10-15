import './danie.css'
import type { ReactNode } from 'react'

export type StudioMood = 'idle' | 'reveal' | 'wrong' | 'close' | 'correct' | 'fail' | 'result'

const JARS = [
  ['#e08a3a', '#f2d36a', '#b8322e', '#6f9a3a'],
  ['#f4efe0', '#7a4a2a', '#e8b04a', '#c2563a'],
  ['#5f8a3a', '#f2c94c', '#9a3a2a', '#d8cbb0'],
]

function Shelves({ x }: { x: number }) {
  return (
    <g>
      {JARS.map((row, r) => {
        const y = 230 + r * 120
        return (
          <g key={r}>
            {row.map((fill, i) => {
              const jx = x + 18 + i * 60
              const h = 62 - ((i + r) % 3) * 10
              return (
                <g key={i}>
                  <rect x={jx} y={y - h} width="44" height={h} rx="8" fill="#dfe9ee" opacity="0.35" />
                  <rect x={jx + 3} y={y - h * 0.75} width="38" height={h * 0.75 - 3} rx="6" fill={fill} />
                  <rect x={jx + 4} y={y - h - 10} width="36" height="12" rx="3" fill={['#8a939d', '#b0302a', '#2f6f4a'][(i + r) % 3]} />
                  <rect x={jx + 8} y={y - h * 0.55} width="28" height="14" rx="2" fill="#fbf6e8" />
                </g>
              )
            })}
            <rect x={x} y={y} width="260" height="12" rx="3" fill="#8a5a3a" />
            <path d={`M${x + 20} ${y + 12} l14 22 M${x + 240} ${y + 12} l-14 22`} stroke="#5a3a20" strokeWidth="6" />
          </g>
        )
      })}
    </g>
  )
}

function Lamp({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 0 V120`} stroke="#3a4048" strokeWidth="4" />
      <polygon className="dp-cone" points={`${x - 40},160 ${x + 40},160 ${x + 190},640 ${x - 190},640`} fill="#fff4c8" />
      <path d={`M${x - 50} 160 L${x - 26} 118 H${x + 26} L${x + 50} 160 Z`} fill="url(#dp-steel)" stroke="#6a737d" strokeWidth="3" />
      <ellipse className="dp-bulb" cx={x} cy="162" rx="26" ry="7" fill="#fff6d0" />
    </g>
  )
}

function Burner({ x, children }: { x: number; children?: ReactNode }) {
  return (
    <g>
      <ellipse cx={x} cy="646" rx="62" ry="10" fill="#2a2e34" />
      <g className="dp-burner" style={{ transformOrigin: `${x}px 646px` }}>
        {[-36, -18, 0, 18, 36].map((dx, i) => (
          <path
            key={dx}
            className="dp-flame"
            style={{ animationDelay: `${-i * 0.13}s` }}
            d={`M${x + dx - 9} 646 Q${x + dx - 8} 628 ${x + dx} 614 Q${x + dx + 8} 628 ${x + dx + 9} 646 Z`}
            fill={i % 2 ? '#ffb02e' : '#4aa8ff'}
          />
        ))}
      </g>
      {children}
    </g>
  )
}

function Pot({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 58} y="560" width="116" height="80" rx="8" fill="url(#dp-steel)" stroke="#6a737d" strokeWidth="3" />
      <rect x={x - 66} y="552" width="132" height="12" rx="6" fill="#aab3bd" />
      <path d={`M${x - 66} 580 h-16 M${x + 66} 580 h16`} stroke="#3a4048" strokeWidth="8" strokeLinecap="round" />
      <g className="dp-steam" fill="#fff" opacity="0.7">
        {[-30, 0, 30].map((dx, i) => (
          <circle key={dx} cx={x + dx} cy="540" r="12" style={{ animationDelay: `${-i * 0.6}s` }} />
        ))}
      </g>
    </g>
  )
}

function Pan({ x }: { x: number }) {
  return (
    <g>
      <ellipse cx={x} cy="626" rx="76" ry="16" fill="#2a2e34" />
      <ellipse cx={x} cy="622" rx="66" ry="11" fill="#4a5058" />
      <path d={`M${x + 70} 624 L${x + 170} 608`} stroke="#1f2228" strokeWidth="12" strokeLinecap="round" />
      <g fill="#e8b04a">
        <circle cx={x - 20} cy="619" r="9" />
        <circle cx={x + 12} cy="622" r="8" />
        <circle cx={x + 34} cy="617" r="7" fill="#6f9a3a" />
      </g>
    </g>
  )
}

function Counter() {
  return (
    <g>
      <rect y="640" width="1600" height="30" fill="url(#dp-steel)" />
      <rect y="670" width="1600" height="230" fill="url(#dp-steel-v)" />
      <g stroke="#7a838d" strokeWidth="3">
        {[300, 560, 800, 1040, 1300].map((x) => (
          <path key={x} d={`M${x} 676 V900`} />
        ))}
      </g>
      <g fill="#2a2e34" stroke="#8a939d" strokeWidth="3">
        {[150, 210, 270, 1330, 1390, 1450].map((x) => (
          <circle key={x} cx={x} cy="720" r="16" />
        ))}
      </g>
      <g fill="#3a4048">
        {[420, 680, 920, 1180].map((x) => (
          <rect key={x} x={x - 50} y="730" width="100" height="10" rx="5" />
        ))}
      </g>
    </g>
  )
}

function Prep() {
  return (
    <g>
      <rect x="640" y="618" width="220" height="24" rx="6" fill="#c08a52" stroke="#8a5a30" strokeWidth="3" />
      <path d="M690 616 H800 L830 606 Q838 612 820 618 Z" fill="#dfe6ec" stroke="#8a939d" strokeWidth="2" />
      <rect x="800" y="610" width="44" height="10" rx="4" fill="#2a2e34" />
      <g fill="#5f9a3a">
        <circle cx="670" cy="612" r="7" />
        <circle cx="682" cy="608" r="6" />
        <circle cx="694" cy="612" r="6" />
      </g>
      <g fill="#fff" stroke="#c8ced6" strokeWidth="2">
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx="930" cy={634 - i * 7} rx="56" ry="9" />
        ))}
      </g>
    </g>
  )
}

function Flour({ burst }: { burst: number }) {
  return (
    <g>
      <path d="M1310 640 L1320 566 Q1350 550 1380 566 L1390 640 Z" fill="#efe2c0" stroke="#bfae84" strokeWidth="3" />
      <text x="1350" y="612" textAnchor="middle" className="dp-sign-text" fontSize="20" fill="#8a5a30">
        MĄKA
      </text>
      {burst > 0 && (
        <g key={burst} className="dp-flour" fill="#fbf8f0">
          {[
            [1350, 560, 26],
            [1320, 540, 20],
            [1380, 536, 22],
            [1340, 515, 18],
            [1370, 500, 14],
            [1305, 505, 12],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} style={{ animationDelay: `${i * 0.04}s` }} />
          ))}
        </g>
      )}
    </g>
  )
}

function Sign() {
  return (
    <g className="dp-sign">
      <path d="M680 0 V40 M920 0 V40" stroke="#3a4048" strokeWidth="4" />
      <rect x="600" y="40" width="400" height="96" rx="16" fill="#2a0f12" stroke="#ff4d5a" strokeWidth="6" className="dp-neon" />
      <text x="800" y="112" textAnchor="middle" className="dp-sign-text dp-neon-text" fontSize="70" fill="#ffe8a8">
        DANIE DNIA
      </text>
      <g className="dp-stars" fill="#ffd34d">
        {[
          [570, 60],
          [1030, 70],
          [585, 130],
          [1020, 140],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 14} L${x + 4} ${y - 4} L${x + 14} ${y} L${x + 4} ${y + 4} L${x} ${y + 14} L${x - 4} ${y + 4} L${x - 14} ${y} L${x - 4} ${y - 4} Z`} style={{ animationDelay: `${-i * 0.3}s` }} />
        ))}
      </g>
    </g>
  )
}

export function Studio({ mood, burst }: { mood: StudioMood; burst: number }) {
  return (
    <div className="dp-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-testid="studio" data-mood={mood}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="dp-layer" aria-hidden>
        <defs>
          <pattern id="dp-tiles" width="80" height="40" patternUnits="userSpaceOnUse">
            <rect width="80" height="40" fill="#1f2a35" />
            <path d="M0 39 H80 M0 19 H80 M40 0 V19 M0 19 V39 M80 19 V39" stroke="#2c3a48" strokeWidth="2" />
          </pattern>
          <linearGradient id="dp-steel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8a939d" />
            <stop offset="0.5" stopColor="#eef3f7" />
            <stop offset="1" stopColor="#8a939d" />
          </linearGradient>
          <linearGradient id="dp-steel-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c8d0d8" />
            <stop offset="1" stopColor="#7a838d" />
          </linearGradient>
        </defs>
        <rect width="1600" height="640" fill="url(#dp-tiles)" />
        <rect width="1600" height="26" fill="#2a2e34" />
        <Sign />
        <Shelves x={40} />
        <Shelves x={1300} />
        <Counter />
        <Burner x={200}>
          <Pot x={200} />
        </Burner>
        <Burner x={1490}>
          <Pan x={1480} />
        </Burner>
        <Prep />
        <Flour burst={burst} />
        <g className="dp-smoke" fill="#9aa3ad">
          {[180, 220, 1420, 1460].map((x, i) => (
            <circle key={x} cx={x} cy="520" r="20" style={{ animationDelay: `${-i * 0.5}s` }} />
          ))}
        </g>
        {[200, 560, 1040, 1400].map((x) => (
          <Lamp key={x} x={x} />
        ))}
      </svg>
      <div className="dp-tint" />
      <div className="dp-vignette" />
    </div>
  )
}
