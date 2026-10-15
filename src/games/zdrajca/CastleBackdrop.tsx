import './castle.css'

export type Mood = 'idle' | 'morning' | 'table' | 'reveal' | 'traitor' | 'loyal' | 'night' | 'result'

const WINDOWS = [
  { x: 210, y: 130, w: 210, h: 400 },
  { x: 1180, y: 130, w: 210, h: 400 },
]
const PANE_COLORS = ['#b8323a', '#2f5fb8', '#d9a62e', '#3a8a55', '#7a3fa0']
const CANDELABRA = [560, 1040]
const CANDLES = CANDELABRA.flatMap((x) => [
  { x: x - 42, y: 600 },
  { x, y: 572 },
  { x: x + 42, y: 600 },
])
const FIRE = { x: 800, y: 735 }
const BANNERS = [520, 1080]

function archPath({ x, y, w, h }: (typeof WINDOWS)[number]) {
  return `M${x} ${y + h} V${y + w / 2} Q${x} ${y} ${x + w / 2} ${y - 30} Q${x + w} ${y} ${x + w} ${y + w / 2} V${y + h} Z`
}

function Panes({ win }: { win: (typeof WINDOWS)[number] }) {
  const cols = 3
  const rows = 5
  const cw = win.w / cols
  const rh = (win.h - win.w / 2) / rows
  return (
    <g>
      {Array.from({ length: cols * rows }, (_, k) => {
        const c = k % cols
        const r = Math.floor(k / cols)
        return (
          <rect
            key={k}
            x={win.x + c * cw}
            y={win.y + win.w / 2 + r * rh}
            width={cw}
            height={rh}
            fill={PANE_COLORS[(c * 2 + r * 3) % PANE_COLORS.length]}
            opacity={(c + r) % 2 === 0 ? 0.55 : 0.32}
          />
        )
      })}
      <circle cx={win.x + win.w / 2} cy={win.y + win.w / 2 - 6} r={win.w / 2 - 24} fill="#d9a62e" opacity="0.45" />
      <path
        d={`M${win.x + win.w / 2} ${win.y + 16} L${win.x + win.w / 2 + 22} ${win.y + 64} L${win.x + win.w / 2} ${win.y + 112} L${win.x + win.w / 2 - 22} ${win.y + 64} Z`}
        fill="#b8323a"
        opacity="0.6"
      />
    </g>
  )
}

function Flame({ x, y, size, className, delay = 0 }: { x: number; y: number; size: number; className: string; delay?: number }) {
  return (
    <g className={`zd-flame ${className}`} style={{ transformOrigin: `${x}px ${y}px`, transitionDelay: `${delay}s` }}>
      <circle cx={x} cy={y - size * 0.6} r={size * 2.6} fill="url(#zd-glow)" className="zd-flame-glow" />
      <path
        className="zd-flame-outer"
        d={`M${x} ${y} C${x - size * 0.9} ${y} ${x - size * 0.8} ${y - size * 1.1} ${x} ${y - size * 2} C${x + size * 0.8} ${y - size * 1.1} ${x + size * 0.9} ${y} ${x} ${y} Z`}
        fill="#ff8a1f"
      />
      <path
        className="zd-flame-inner"
        d={`M${x} ${y} C${x - size * 0.45} ${y} ${x - size * 0.4} ${y - size * 0.6} ${x} ${y - size * 1.15} C${x + size * 0.4} ${y - size * 0.6} ${x + size * 0.45} ${y} ${x} ${y} Z`}
        fill="#ffe27a"
      />
    </g>
  )
}

function Scene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="zd-layer" aria-hidden>
      <defs>
        <pattern id="zd-stones" width="120" height="60" patternUnits="userSpaceOnUse">
          <rect width="120" height="60" fill="#4b4540" />
          <path d="M0 30 H120 M0 60 H120 M40 0 V30 M100 0 V30 M10 30 V60 M70 30 V60" stroke="#352f2b" strokeWidth="3" />
          <rect x="44" y="4" width="52" height="22" fill="#544d47" />
          <rect x="74" y="34" width="40" height="22" fill="#433d38" />
        </pattern>
        <pattern id="zd-tartan" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#7a1c22" />
          <rect x="14" width="12" height="40" fill="#1f4a35" opacity="0.8" />
          <rect y="14" width="40" height="12" fill="#1f4a35" opacity="0.8" />
          <rect x="19" width="2" height="40" fill="#d9a62e" />
          <rect y="19" width="40" height="2" fill="#d9a62e" />
        </pattern>
        <pattern id="zd-floor" width="160" height="70" patternUnits="userSpaceOnUse">
          <rect width="160" height="70" fill="#3b3631" />
          <path d="M0 0 H160 M80 0 V70 M0 70 H160" stroke="#2a2622" strokeWidth="4" />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#zd-stones)" />
      <rect width="1600" height="56" fill="#2a1d14" />
      {[0, 400, 800, 1200].map((x) => (
        <rect key={x} x={x + 150} y="0" width="40" height="110" fill="#2a1d14" />
      ))}

      {WINDOWS.map((w) => (
        <g key={w.x}>
          <path d={archPath(w)} fill="#1b2340" stroke="#2e2924" strokeWidth="22" />
          <path d={archPath(w)} fill="none" stroke="#6b6158" strokeWidth="6" />
          <rect x={w.x - 20} y={w.y + w.h} width={w.w + 40} height="22" fill="#5c544c" />
        </g>
      ))}

      {BANNERS.map((x) => (
        <g key={x} className="zd-banner">
          <rect x={x - 6} y="70" width={152} height="10" fill="#6b4a2f" />
          <path d={`M${x} 80 H${x + 140} V340 L${x + 70} 380 L${x} 340 Z`} fill="url(#zd-tartan)" />
          <circle cx={x + 70} cy="200" r="30" fill="#d9a62e" opacity="0.9" />
          <path d={`M${x + 70} 178 L${x + 82} 210 L${x + 58} 210 Z`} fill="#7a1c22" />
        </g>
      ))}

      <g>
        <rect x="610" y="430" width="380" height="40" fill="#6b6158" />
        <rect x="630" y="470" width="340" height="300" fill="#5c544c" />
        <path d="M680 770 V560 Q800 480 920 560 V770 Z" fill="#160f0b" />
        <rect x="590" y="410" width="420" height="26" fill="#7a7068" />
        <path d={`M${FIRE.x - 70} 768 L${FIRE.x + 60} 748 M${FIRE.x - 60} 748 L${FIRE.x + 70} 768`} stroke="#4a2f1c" strokeWidth="16" strokeLinecap="round" />
        <ellipse cx={FIRE.x} cy="760" rx="60" ry="10" fill="#ff7a2a" opacity="0.5" className="zd-embers" />
      </g>
      <g>
        <path d="M800 260 L860 280 V340 Q860 390 800 410 Q740 390 740 340 V280 Z" fill="#7a1c22" stroke="#d9a62e" strokeWidth="6" />
        <path d="M720 250 L880 400 M880 250 L720 400" stroke="#9aa3ad" strokeWidth="8" strokeLinecap="round" />
        <path d="M800 300 V370 M772 334 H828" stroke="#d9a62e" strokeWidth="8" />
      </g>

      <g>
        <rect x="80" y="170" width="120" height="150" fill="#d9a62e" />
        <rect x="92" y="182" width="96" height="126" fill="#3a2a22" />
        <circle cx="140" cy="230" r="26" fill="#c99a7a" />
        <path d="M100 308 Q140 250 180 308 Z" fill="#1f3a5a" />
      </g>
      <g fill="#8a939e" stroke="#4a5058" strokeWidth="3">
        <circle cx="1480" cy="520" r="34" />
        <rect x="1468" y="512" width="24" height="6" fill="#2a2e33" />
        <path d="M1430 560 H1530 L1520 700 H1440 Z" />
        <path d="M1440 700 L1450 860 H1474 L1480 720 L1486 860 H1510 L1520 700 Z" />
        <path d="M1430 570 L1400 690 M1530 570 L1560 690" strokeWidth="18" />
        <path d="M1556 470 V860" stroke="#6b4a2f" strokeWidth="8" />
        <path d="M1546 460 L1556 420 L1566 460 Z" />
      </g>

      {CANDELABRA.map((x) => (
        <g key={x} fill="#b8892e">
          <rect x={x - 6} y="600" width="12" height="250" />
          <path d={`M${x - 46} 640 Q${x} 690 ${x + 46} 640`} stroke="#b8892e" strokeWidth="8" fill="none" />
          <path d={`M${x - 36} 860 L${x} 830 L${x + 36} 860 Z`} />
          {[-42, 0, 42].map((dx) => (
            <rect key={dx} x={x + dx - 7} y={dx === 0 ? 572 : 600} width="14" height={dx === 0 ? 70 : 42} fill="#efe3c4" />
          ))}
        </g>
      ))}

      <rect y="800" width="1600" height="100" fill="url(#zd-floor)" />
      <rect y="796" width="1600" height="8" fill="#2a2622" />
      <ellipse cx="800" cy="930" rx="560" ry="70" fill="#3a2414" />
      <ellipse cx="800" cy="920" rx="540" ry="56" fill="#5a3a22" />
    </svg>
  )
}

function Lights() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="zd-layer" aria-hidden>
      <defs>
        <radialGradient id="zd-glow">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        {WINDOWS.map((w, i) => (
          <clipPath key={w.x} id={`zd-win-${i}`}>
            <path d={archPath(w)} />
          </clipPath>
        ))}
      </defs>
      {WINDOWS.map((w, i) => (
        <g key={w.x} clipPath={`url(#zd-win-${i})`}>
          <rect x={w.x} y={w.y - 40} width={w.w} height={w.h + 40} className="zd-glass-sky" />
          {i === 0 && <circle cx={w.x + 130} cy={w.y + 90} r="34" fill="#f4f1dc" className="zd-moon" />}
          <g className="zd-crows">
            {[0, 1, 2].map((k) => (
              <path
                key={k}
                d={`M${w.x - 40 - k * 60} ${w.y + 160 + k * 30} q12 -10 24 0 q12 -10 24 0`}
                stroke="#0c0c10"
                strokeWidth="5"
                fill="none"
                style={{ animationDelay: `${k * 0.7 + i * 1.3}s` }}
              />
            ))}
          </g>
          <g className="zd-fog">
            <ellipse cx={w.x + 40} cy={w.y + w.h - 60} rx="120" ry="30" fill="#c9cdd6" opacity="0.35" />
            <ellipse cx={w.x + 160} cy={w.y + w.h - 120} rx="100" ry="24" fill="#c9cdd6" opacity="0.25" />
          </g>
          <g className="zd-glass">
            <Panes win={w} />
          </g>
          <path
            d={`M${w.x + w.w / 3} ${w.y + w.w / 2} V${w.y + w.h} M${w.x + (2 * w.w) / 3} ${w.y + w.w / 2} V${w.y + w.h} M${w.x} ${w.y + w.w / 2} H${w.x + w.w}`}
            stroke="#1a1612"
            strokeWidth="5"
          />
        </g>
      ))}
      <g className="zd-beams">
        {WINDOWS.map((w) => (
          <path key={w.x} d={`M${w.x} ${w.y + w.h} H${w.x + w.w} L${w.x + w.w + 260} 900 H${w.x + 60} Z`} fill="url(#zd-beam)" />
        ))}
        <defs>
          <linearGradient id="zd-beam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9a62e" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="#2f5fb8" stopOpacity="0.2" />
            <stop offset="1" stopColor="#b8323a" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </g>
      <Flame x={FIRE.x} y={FIRE.y} size={46} className="zd-fire" />
      {CANDLES.map((c, i) => (
        <Flame key={`${c.x}-${c.y}`} x={c.x} y={c.y - 2} size={9} className="zd-candle" delay={i * 0.35} />
      ))}
    </svg>
  )
}

export function CastleBackdrop({ mood, won = false }: { mood: Mood; won?: boolean }) {
  return (
    <div className="zd-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-mood={mood} data-won={won} data-testid="castle-backdrop">
      <Scene />
      <div className="zd-tint" />
      <div className="zd-night" />
      <Lights />
      <div className="zd-flash" />
      <div className="zd-vignette" />
    </div>
  )
}
