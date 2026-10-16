import type { CSSProperties, ReactNode } from 'react'
import './prawda-czy-sciema.css'

export type BackdropMood = 'idle' | 'reading' | 'swipe-true' | 'swipe-false' | 'correct' | 'wrong' | 'result'

const MAP = { x: 430, y: 96, width: 740, height: 270, step: 13 }
const CONTINENTS = [
  [0.2, 0.32, 0.13, 0.19],
  [0.36, 0.1, 0.05, 0.07],
  [0.29, 0.72, 0.06, 0.2],
  [0.5, 0.26, 0.05, 0.09],
  [0.53, 0.6, 0.08, 0.21],
  [0.71, 0.3, 0.18, 0.17],
  [0.78, 0.55, 0.05, 0.08],
  [0.86, 0.78, 0.06, 0.07],
]
const MAP_DOTS: [number, number][] = []
for (let y = MAP.y; y <= MAP.y + MAP.height; y += MAP.step) {
  for (let x = MAP.x; x <= MAP.x + MAP.width; x += MAP.step) {
    const u = (x - MAP.x) / MAP.width
    const v = (y - MAP.y) / MAP.height
    if (CONTINENTS.some(([cx, cy, rx, ry]) => ((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2 <= 1)) MAP_DOTS.push([x, y])
  }
}
const LIGHTS = [180, 470, 800, 1130, 1420]
const GLITCH_BARS = [
  [70, 30, '#ff3b5c'],
  [150, 14, '#3bd6ff'],
  [210, 44, '#ffffff'],
  [300, 18, '#ff3b5c'],
  [380, 26, '#3bd6ff'],
] as const
const CREDITS = ['Szkiełko i oko', 'Prowadzili:', 'Prezenterka i Satyryk', 'Depesze: Wikipedia', 'oraz nasza wyobraźnia', 'Dobranoc!']

function Ceiling() {
  return (
    <>
      <defs>
        <linearGradient id="ps-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="26" fill="#060a18" />
      <path d="M0 26 H1600" stroke="#1c2848" strokeWidth="4" />
      {LIGHTS.map((x) => (
        <g key={x}>
          <path className="ps-cone" d={`M${x - 22} 40 L${x - 150} 640 H${x + 150} L${x + 22} 40 Z`} fill="url(#ps-cone)" />
          <rect x={x - 26} y="22" width="52" height="22" rx="4" fill="#1a2440" />
          <rect x={x - 18} y="40" width="36" height="6" rx="2" fill="#fff3c8" />
        </g>
      ))}
    </>
  )
}

function Screen({ x, y, width, height, children }: { x: number; y: number; width: number; height: number; children?: ReactNode }) {
  return (
    <g>
      <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} rx="10" fill="#0a0f1e" />
      <rect x={x} y={y} width={width} height={height} rx="4" fill="url(#ps-screen)" />
      {children}
      <rect className="ps-glow" x={x} y={y} width={width} height={height} rx="4" />
      <rect x={x} y={y} width={width} height={height} rx="4" fill="url(#ps-scanlines)" opacity="0.5" />
    </g>
  )
}

function VideoWall() {
  return (
    <>
      <defs>
        <linearGradient id="ps-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#123072" />
          <stop offset="1" stopColor="#0a1a44" />
        </linearGradient>
        <pattern id="ps-scanlines" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="2" fill="#000" opacity="0.35" />
        </pattern>
        <clipPath id="ps-main-clip">
          <rect x="390" y="66" width="820" height="400" rx="4" />
        </clipPath>
      </defs>

      <Screen x={110} y={140} width={240} height={290}>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={140} y={200 + i * 52} width={180 - i * 34} height="26" rx="3" fill="#2f63c8" opacity="0.7" />
        ))}
        <text x="230" y="182" textAnchor="middle" fontSize="34" fill="#ffd23a" className="ps-sign">
          KRAJ
        </text>
      </Screen>
      <Screen x={1250} y={140} width={240} height={290}>
        <circle cx="1370" cy="270" r="74" fill="none" stroke="#2f63c8" strokeWidth="10" opacity="0.7" />
        <path d="M1370 270 V200 M1370 270 L1420 300" stroke="#9ec0ff" strokeWidth="8" strokeLinecap="round" />
        <text x="1370" y="400" textAnchor="middle" fontSize="34" fill="#ffd23a" className="ps-sign">
          ŚWIAT
        </text>
      </Screen>

      <Screen x={390} y={66} width={820} height={400}>
        <g className="ps-map">
          {MAP_DOTS.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.6" fill="#5f8fe8" />
          ))}
        </g>
        <g className="ps-logo">
          <rect x="560" y="384" width="480" height="64" rx="8" fill="#c8102e" />
          <circle cx="604" cy="416" r="20" fill="none" stroke="#fff" strokeWidth="5" />
          <circle cx="604" cy="416" r="7" fill="#fff" />
          <path d="M618 432 l14 14" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <text x="820" y="432" textAnchor="middle" fontSize="44" fill="#fff" className="ps-sign">
            SZKIEŁKO I OKO
          </text>
        </g>
        <g clipPath="url(#ps-main-clip)">
          <g className="ps-glitch">
            {GLITCH_BARS.map(([y, h, color]) => (
              <rect key={y} x="390" y={66 + y} width="820" height={h} fill={color} opacity="0.55" />
            ))}
          </g>
          <g className="ps-credits">
            {CREDITS.map((line, i) => (
              <text key={line} x="800" y={520 + i * 70} textAnchor="middle" fontSize={i === CREDITS.length - 1 ? 72 : 40} fill={i === CREDITS.length - 1 ? '#ffd23a' : '#fff'} className="ps-sign">
                {line}
              </text>
            ))}
          </g>
        </g>
      </Screen>
    </>
  )
}

function Floor() {
  return (
    <>
      <defs>
        <linearGradient id="ps-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141c38" />
          <stop offset="1" stopColor="#04060e" />
        </linearGradient>
      </defs>
      <rect y="560" width="1600" height="340" fill="url(#ps-floor)" />
      <path d="M0 560 H1600" stroke="#2a3a6a" strokeWidth="3" />
      {[-600, -300, 0, 300, 600].map((dx) => (
        <path key={dx} d={`M${800 + dx * 0.4} 560 L${800 + dx * 1.6} 900`} stroke="#1c2848" strokeWidth="2" />
      ))}
      <rect className="ps-glow ps-reflection" x="390" y="580" width="820" height="120" rx="4" />
    </>
  )
}

function Camera() {
  return (
    <g transform="translate(150 560)">
      <path d="M60 150 L0 340 M60 150 L120 340 M60 150 V330" stroke="#2a3248" strokeWidth="10" strokeLinecap="round" />
      <rect x="0" y="40" width="150" height="100" rx="12" fill="#1e2538" />
      <rect x="150" y="62" width="70" height="56" rx="6" fill="#2a3248" />
      <circle cx="220" cy="90" r="24" fill="#0b0f1c" stroke="#3a4462" strokeWidth="5" />
      <circle cx="214" cy="84" r="6" fill="#5f8fe8" opacity="0.5" />
      <rect x="20" y="58" width="60" height="36" rx="4" fill="#0f1a36" />
      <circle className="ps-tally" cx="128" cy="58" r="8" fill="#ff2a3a" />
      <path d="M40 140 L-30 230" stroke="#2a3248" strokeWidth="8" strokeLinecap="round" />
    </g>
  )
}

function LightStand() {
  return (
    <g transform="translate(1400 520)">
      <path d="M40 80 V370 M40 370 L-20 380 M40 370 L100 380" stroke="#2a3248" strokeWidth="8" strokeLinecap="round" />
      <rect x="-10" y="0" width="100" height="84" rx="10" fill="#1e2538" transform="rotate(-14 40 40)" />
      <rect x="0" y="12" width="80" height="58" rx="6" fill="#fff3c8" opacity="0.85" transform="rotate(-14 40 40)" />
    </g>
  )
}

export function Backdrop({ mood }: { mood: BackdropMood }) {
  return (
    <div className="ps-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-testid="backdrop" data-mood={mood}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="ps-layer">
        <rect width="1600" height="900" fill="#0b1430" />
        <Ceiling />
        <VideoWall />
        <Floor />
        <Camera />
        <LightStand />
      </svg>
      <div className="ps-noise" />
      <div className="ps-vignette" />
    </div>
  )
}

/** The „PILNE” news ticker pinned to the bottom of the screen. */
export function Ticker({ text }: { text: string }) {
  return (
    <div className="ps-ticker" data-testid="ticker">
      <span className="ps-ticker-label ps-sign">Pilne</span>
      <div className="ps-ticker-track">
        <p key={text} className="ps-ticker-text" style={{ '--ps-ticker-duration': `${8 + text.length * 0.12}s` } as CSSProperties}>
          {text}
        </p>
      </div>
    </div>
  )
}
