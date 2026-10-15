import './komis.css'

export type Mood = 'idle' | 'arrive' | 'inspect' | 'good' | 'bad' | 'result'

const BULBS = Array.from({ length: 13 }, (_, i) => {
  const x = 40 + i * 76.6
  const t = (x - 500) / 500
  return { x, y: 30 + 51 * (1 - t * t) }
})

const PENNANT_COLORS = ['#e03131', '#f2b705', '#1971c2', '#f8f9fa', '#2f9e44']

function Blocks() {
  return (
    <svg viewBox="0 0 1000 220" preserveAspectRatio="xMidYMax slice" className="gr-blocks" aria-hidden>
      <path d="M0 220 V120 H120 V60 H260 V130 H330 V40 H470 V110 H560 V70 H700 V140 H760 V50 H900 V100 H1000 V220 Z" fill="#241a3a" />
      {[130, 160, 190, 220].flatMap((x) =>
        [76, 100, 124, 148, 172].map((y) => (x * y) % 7 < 3 && <rect key={`${x}-${y}`} x={x} y={y} width="10" height="12" fill="#ffd977" opacity="0.75" />),
      )}
      {[345, 375, 405, 435].flatMap((x) =>
        [56, 80, 104, 128, 152, 176].map((y) => (x + y) % 5 < 2 && <rect key={`${x}-${y}`} x={x} y={y} width="10" height="12" fill="#ffe8a3" opacity="0.7" />),
      )}
      {[775, 805, 835, 865].flatMap((x) =>
        [66, 90, 114, 138, 162].map((y) => (x * 3 + y) % 7 < 3 && <rect key={`${x}-${y}`} x={x} y={y} width="10" height="12" fill="#a5d8ff" opacity="0.55" />),
      )}
    </svg>
  )
}

function Office() {
  return (
    <div className="gr-office">
      <div className="gr-neon" data-testid="neon">
        KOMIS <span>U ZBYSZKA</span>
      </div>
      <div className="gr-window" />
      <div className="gr-office-door" />
      <div className="gr-ac" />
    </div>
  )
}

function ParkedCar({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="0 0 220 90" className={className} aria-hidden>
      <path d="M10 62 Q8 44 30 40 L62 36 Q80 14 108 12 H140 Q160 14 176 36 L200 42 Q214 46 212 62 Z" fill={color} />
      <path d="M72 36 Q86 20 106 19 H124 V36 Z M130 19 H140 Q154 21 166 36 H130 Z" fill="#1d2433" opacity="0.85" />
      <rect x="98" y="22" width="22" height="12" fill="#fff36b" />
      <circle cx="56" cy="64" r="15" fill="#111" />
      <circle cx="166" cy="64" r="15" fill="#111" />
      <circle cx="56" cy="64" r="6" fill="#555" />
      <circle cx="166" cy="64" r="6" fill="#555" />
    </svg>
  )
}

export function KomisBackdrop({ mood }: { mood: Mood }) {
  return (
    <div className="gr-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-mood={mood} data-testid="komis-backdrop">
      <div className="gr-sky" />
      <div className="gr-stars" />
      <Blocks />
      <div className="gr-fence">
        <div className="gr-banner">SKUP AUT ZA GOTÓWKĘ · 600 100 200</div>
      </div>
      <Office />
      <div className="gr-lamp">
        <div className="gr-lamp-head" />
        <div className="gr-lamp-cone" />
      </div>
      <div className="gr-gravel" />
      <ParkedCar className="gr-car gr-car-left" color="#3b2f4f" />
      <ParkedCar className="gr-car gr-car-right" color="#2c3b52" />
      <svg viewBox="0 0 1000 140" preserveAspectRatio="xMidYMin slice" className="gr-strings" aria-hidden>
        <g className="gr-bunting">
          <path d="M0 8 Q500 70 1000 8" fill="none" stroke="#222" strokeWidth="1.5" />
          {Array.from({ length: 24 }, (_, i) => {
            const x = 20 + i * 41
            const t = (x - 500) / 500
            const y = 8 + 31 * (1 - t * t)
            return <path key={i} d={`M${x - 14} ${y} L${x + 14} ${y} L${x} ${y + 26} Z`} fill={PENNANT_COLORS[i % PENNANT_COLORS.length]} />
          })}
        </g>
        <g className="gr-bulb-string">
          <path d="M0 30 Q500 132 1000 30" fill="none" stroke="#111" strokeWidth="2" />
          {BULBS.map(({ x, y }, i) => (
            <g key={i}>
              <rect x={x - 3} y={y - 2} width="6" height="6" fill="#333" />
              <circle cx={x} cy={y + 10} r="7" className="gr-bulb" style={{ animationDelay: `${(i % 4) * 0.4}s` }} />
            </g>
          ))}
        </g>
      </svg>
      <div className="gr-headlights" />
      <div className="gr-glow" />
      <div className="gr-shade" />
      <div className="gr-vignette" />
    </div>
  )
}
