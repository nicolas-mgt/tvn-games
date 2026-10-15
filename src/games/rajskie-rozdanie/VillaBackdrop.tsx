import './villa.css'

export type Mood = 'idle' | 'day' | 'date' | 'campfire' | 'gossip' | 'ceremony' | 'farewell' | 'result'

const WINDOWS = [
  { x: 975, y: 470, w: 56, h: 90 },
  { x: 1065, y: 470, w: 56, h: 90 },
  { x: 1250, y: 470, w: 56, h: 90 },
  { x: 1050, y: 290, w: 46, h: 62 },
  { x: 1140, y: 290, w: 46, h: 62 },
  { x: 1230, y: 290, w: 46, h: 62 },
]
const DOOR = { x: 1150, y: 450, w: 70, h: 120 }
const TORCHES = [
  { x: 110, top: 610 },
  { x: 560, top: 640 },
  { x: 1040, top: 640 },
  { x: 1500, top: 610 },
]
const FIRE = { x: 800, y: 845 }
const PALMS = [
  { x: 190, height: 560, lean: 70 },
  { x: 660, height: 420, lean: -40 },
  { x: 1470, height: 500, lean: -80 },
]
const LEAF_ANGLES = [-170, -135, -95, -55, -15, 25, 160]
const STARS = Array.from({ length: 46 }, (_, i) => ({ x: (i * 397) % 1600, y: (i * 151) % 360, r: i % 5 === 0 ? 2.4 : 1.4 }))
const HEARTS = [8, 19, 31, 47, 58, 71, 83, 93]

function arch({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`
}

function Palm({ x, height, lean }: (typeof PALMS)[number]) {
  const top = { x: x + lean, y: 880 - height }
  return (
    <g>
      <path
        d={`M${x - 14} 880 Q${x + lean * 0.2} ${880 - height * 0.5} ${top.x - 6} ${top.y} L${top.x + 6} ${top.y} Q${x + lean * 0.25 + 12} ${880 - height * 0.5} ${x + 14} 880 Z`}
        fill="#8a6440"
      />
      <path
        d={`M${x} 880 Q${x + lean * 0.22} ${880 - height * 0.5} ${top.x} ${top.y}`}
        fill="none"
        stroke="#6d4c2f"
        strokeWidth="22"
        strokeDasharray="4 22"
      />
      <g className="rr-fronds" style={{ transformOrigin: `${top.x}px ${top.y}px` }}>
        {LEAF_ANGLES.map((angle) => (
          <path
            key={angle}
            transform={`translate(${top.x} ${top.y}) rotate(${angle})`}
            d="M0 0 Q90 -46 190 34 Q120 6 70 22 Q40 10 0 0 Z"
            fill={angle % 2 === 0 ? '#2f8a4c' : '#257540'}
          />
        ))}
        <circle cx={top.x - 10} cy={top.y + 10} r="11" fill="#5b3a1e" />
        <circle cx={top.x + 9} cy={top.y + 13} r="10" fill="#6b4524" />
      </g>
    </g>
  )
}

function Flame({ x, y, size, className }: { x: number; y: number; size: number; className?: string }) {
  return (
    <g className={`rr-flame ${className ?? ''}`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <circle cx={x} cy={y - size * 0.6} r={size * 2.4} fill="url(#rr-glow)" className="rr-flame-glow" />
      <path
        className="rr-flame-outer"
        d={`M${x} ${y} C${x - size * 0.9} ${y} ${x - size * 0.8} ${y - size * 1.1} ${x} ${y - size * 2} C${x + size * 0.8} ${y - size * 1.1} ${x + size * 0.9} ${y} ${x} ${y} Z`}
        fill="#ff8a1f"
      />
      <path
        className="rr-flame-inner"
        d={`M${x} ${y} C${x - size * 0.45} ${y} ${x - size * 0.4} ${y - size * 0.6} ${x} ${y - size * 1.15} C${x + size * 0.4} ${y - size * 0.6} ${x + size * 0.45} ${y} ${x} ${y} Z`}
        fill="#ffe27a"
      />
    </g>
  )
}

export function Heart({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 22" width={size} aria-hidden>
      <path d="M12 21 C5 15 0 11 0 6 A6 6 0 0 1 12 4 A6 6 0 0 1 24 6 C24 11 19 15 12 21 Z" fill="#ff5c8a" />
    </svg>
  )
}

function Scene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="rr-layer" aria-hidden>
      <defs>
        <linearGradient id="rr-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f9bb8" />
          <stop offset="1" stopColor="#53cfd8" />
        </linearGradient>
        <linearGradient id="rr-pool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fe0ea" />
          <stop offset="1" stopColor="#1aa3c4" />
        </linearGradient>
        <pattern id="rr-planks" width="120" height="28" patternUnits="userSpaceOnUse">
          <rect width="120" height="28" fill="#b98352" />
          <rect y="26" width="120" height="2" fill="#8d5f37" />
          <rect x="70" width="2" height="26" fill="#9c6b40" />
        </pattern>
      </defs>
      <circle cx="1180" cy="150" r="58" className="rr-sun" />
      <rect y="470" width="1600" height="160" fill="url(#rr-sea)" />
      <path d="M1120 472 Q1200 420 1290 446 Q1350 410 1440 452 Q1500 458 1540 472 Z" fill="#2a6b55" />
      <g stroke="#c9f3f5" strokeWidth="3" strokeLinecap="round" opacity="0.6" className="rr-sparkle">
        <path d="M120 520 H190 M420 560 H470 M760 505 H840 M1460 540 H1520 M300 600 H350" />
      </g>
      <g className="rr-cloud">
        <path d="M1080 170 Q1090 120 1140 128 Q1170 90 1220 112 Q1270 100 1285 140 Q1330 150 1310 180 Z" fill="#dfe6ee" />
        <path d="M1150 200 Q1165 165 1205 172 Q1235 150 1265 172 Q1300 175 1290 205 Z" fill="#c8d1dc" />
      </g>

      <rect x="940" y="380" width="440" height="250" fill="#f6efe2" />
      <rect x="1010" y="250" width="300" height="130" fill="#efe6d6" />
      <rect x="920" y="370" width="480" height="16" fill="#d8cdb8" />
      <rect x="995" y="240" width="330" height="14" fill="#d8cdb8" />
      <g stroke="#d8cdb8" strokeWidth="5">
        {Array.from({ length: 16 }, (_, i) => (
          <line key={i} x1={1010 + i * 20} y1="345" x2={1010 + i * 20} y2="370" />
        ))}
        <line x1="1005" y1="345" x2="1315" y2="345" />
      </g>
      {WINDOWS.map((w) => (
        <path key={`${w.x}-${w.y}`} d={arch(w)} fill="#3d7f9a" stroke="#c9bda6" strokeWidth="5" />
      ))}
      <path d={arch(DOOR)} fill="#6b4a2f" stroke="#c9bda6" strokeWidth="5" />
      <path d="M1380 470 Q1420 430 1440 470 L1440 630 H1380 Z" fill="#e65f8a" opacity="0.85" />
      <g fill="#c2457a">
        <circle cx="1396" cy="470" r="12" />
        <circle cx="1420" cy="458" r="10" />
        <circle cx="1432" cy="486" r="11" />
      </g>

      {PALMS.map((p) => (
        <Palm key={p.x} {...p} />
      ))}

      <rect y="620" width="1600" height="280" fill="url(#rr-planks)" />
      <rect y="620" width="1600" height="10" fill="#8d5f37" />
      <path d="M270 665 H870 L920 750 H220 Z" fill="#e9dcc4" />
      <path d="M290 672 H852 L895 742 H245 Z" fill="url(#rr-pool)" />
      <g stroke="#c9fbff" strokeWidth="3" fill="none" strokeLinecap="round" className="rr-ripples">
        <path d="M330 690 Q360 684 390 690 T450 690" />
        <path d="M560 710 Q590 704 620 710 T680 710" />
        <path d="M720 690 Q750 684 780 690" />
        <path d="M400 728 Q430 722 460 728 T520 728" />
      </g>

      {[1110, 1260].map((x) => (
        <g key={x}>
          <path d={`M${x} 760 L${x + 110} 760 L${x + 140} 712 L${x + 128} 706 L${x + 102} 744 L${x} 744 Z`} fill="#f4f4f4" />
          <path d={`M${x + 4} 746 H${x + 104} L${x + 128} 710`} stroke="#3aa7c9" strokeWidth="9" fill="none" />
          <path d={`M${x + 10} 760 V780 M${x + 100} 760 V780`} stroke="#9aa3ad" strokeWidth="5" />
        </g>
      ))}
      <g>
        <line x1="1235" y1="780" x2="1235" y2="640" stroke="#d9d2c4" strokeWidth="6" />
        <path d="M1150 650 Q1235 590 1320 650 Z" fill="#ff7a59" />
        <path d="M1192 632 Q1235 596 1278 632" fill="#fff4dc" opacity="0.7" />
      </g>

      {TORCHES.map((t) => (
        <g key={t.x}>
          <rect x={t.x - 6} y={t.top} width="12" height={890 - t.top} fill="#6d4c2f" />
          {[0.18, 0.4].map((f) => (
            <rect key={f} x={t.x - 8} y={t.top + (890 - t.top) * f} width="16" height="6" fill="#4b3320" />
          ))}
          <path d={`M${t.x - 18} ${t.top - 4} L${t.x + 18} ${t.top - 4} L${t.x + 10} ${t.top + 22} L${t.x - 10} ${t.top + 22} Z`} fill="#a9773f" />
          <path d={`M${t.x - 18} ${t.top + 6} H${t.x + 18}`} stroke="#7b5329" strokeWidth="4" />
        </g>
      ))}
      <ellipse cx={FIRE.x} cy={FIRE.y} rx="86" ry="22" fill="#7a7068" />
      <ellipse cx={FIRE.x} cy={FIRE.y - 4} rx="66" ry="14" fill="#3a2a20" />
      <path d={`M${FIRE.x - 50} ${FIRE.y - 2} L${FIRE.x + 44} ${FIRE.y - 16} M${FIRE.x - 44} ${FIRE.y - 16} L${FIRE.x + 50} ${FIRE.y - 2}`} stroke="#5b3a1e" strokeWidth="12" strokeLinecap="round" />
    </svg>
  )
}

function Lights() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="rr-layer" aria-hidden>
      <defs>
        <radialGradient id="rr-glow">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <mask id="rr-crescent">
          <circle cx="380" cy="130" r="36" fill="#fff" />
          <circle cx="396" cy="120" r="32" fill="#000" />
        </mask>
      </defs>
      <g className="rr-stars">
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
        ))}
      </g>
      <g className="rr-moon">
        <circle cx="380" cy="130" r="36" fill="#fdf3c8" mask="url(#rr-crescent)" />
      </g>
      <g className="rr-windows">
        {WINDOWS.map((w) => (
          <path key={`${w.x}-${w.y}`} d={arch(w)} fill="#ffcf7a" />
        ))}
      </g>
      <path d="M290 672 H852 L895 742 H245 Z" fill="#38e1ff" className="rr-pool-glow" />
      {TORCHES.map((t, i) => (
        <Flame key={t.x} x={t.x} y={t.top - 2} size={22} className={`rr-torch rr-torch-${i}`} />
      ))}
      <Flame x={FIRE.x} y={FIRE.y - 8} size={42} className="rr-fire" />
    </svg>
  )
}

export function VillaBackdrop({ mood, won = false }: { mood: Mood; won?: boolean }) {
  return (
    <div
      className="rr-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      data-mood={mood}
      data-won={won}
      data-testid="villa-backdrop"
    >
      <div className="rr-sky" />
      <div className="rr-sky-dawn" />
      <Scene />
      <div className="rr-tint" />
      <div className="rr-night" />
      <Lights />
      <div className="rr-hearts">
        {HEARTS.map((left, i) => (
          <span key={left} style={{ left: `${left}%`, animationDelay: `${i * 0.35}s` }}>
            <Heart size={18 + (i % 3) * 8} />
          </span>
        ))}
      </div>
      <div className="rr-suitcase">
        <svg viewBox="0 0 60 60" width="64" aria-hidden>
          <rect x="6" y="16" width="48" height="36" rx="6" fill="#e65f8a" />
          <path d="M22 16 V8 H38 V16" stroke="#3a2a20" strokeWidth="4" fill="none" />
          <path d="M6 30 H54" stroke="#b8406a" strokeWidth="4" />
          <circle cx="16" cy="55" r="4" fill="#3a2a20" />
          <circle cx="44" cy="55" r="4" fill="#3a2a20" />
        </svg>
      </div>
      <div className="rr-vignette" />
    </div>
  )
}
