import './yard.css'

export type Mood = 'idle' | 'arrive' | 'bidding' | 'hot' | 'won' | 'lost' | 'reveal'

function PalletStack() {
  return (
    <svg viewBox="0 0 140 120" className="pw-stack" aria-hidden>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(${i % 2 ? 4 : 0} ${100 - i * 18})`}>
          <rect x="0" y="0" width="130" height="5" fill="#c9a06a" />
          <rect x="0" y="11" width="130" height="5" fill="#b88d58" />
          {[0, 58, 116].map((x) => (
            <rect key={x} x={x} y="5" width="14" height="6" fill="#8f6a3e" />
          ))}
        </g>
      ))}
    </svg>
  )
}

function Forklift() {
  return (
    <svg viewBox="0 0 200 160" className="pw-forklift" aria-hidden>
      <path d="M10 40 V150 M22 40 V150" stroke="#3b3b3b" strokeWidth="6" />
      <path d="M0 146 H60 M0 138 H60" stroke="#6b6b6b" strokeWidth="5" />
      <rect x="28" y="88" width="120" height="44" rx="6" fill="#f2b705" />
      <rect x="120" y="70" width="52" height="62" rx="8" fill="#d99a00" />
      <path d="M56 88 V30 H118 L132 88" fill="none" stroke="#2f2f2f" strokeWidth="6" strokeLinejoin="round" />
      <rect x="70" y="58" width="22" height="30" rx="4" fill="#2f2f2f" />
      <circle cx="80" cy="50" r="9" fill="#e9b48a" />
      <path d="M70 46 Q80 34 90 46 Z" fill="#f2b705" />
      <rect x="138" y="22" width="8" height="10" rx="2" fill="#ff7a00" className="pw-beacon" />
      <circle cx="58" cy="136" r="18" fill="#222" />
      <circle cx="58" cy="136" r="7" fill="#777" />
      <circle cx="140" cy="138" r="16" fill="#222" />
      <circle cx="140" cy="138" r="6" fill="#777" />
    </svg>
  )
}

export function YardBackdrop({ mood }: { mood: Mood }) {
  return (
    <div className="pw-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-mood={mood} data-testid="yard-backdrop">
      <div className="pw-sky" />
      <div className="pw-sun" />
      <div className="pw-cloud pw-cloud-1" />
      <div className="pw-cloud pw-cloud-2" />
      <div className="pw-cloud pw-cloud-3" />
      <div className="pw-wall">
        <div className="pw-roof" />
        <div className="pw-logo">HURT-POL</div>
        <div className="pw-door pw-door-left" />
        <div className="pw-door pw-door-right" />
        <div className="pw-sign">Licytacja palet · sob. 10:00</div>
      </div>
      <div className="pw-dock" />
      <div className="pw-asphalt">
        <div className="pw-lines" />
        <div className="pw-oil" />
      </div>
      <PalletStack />
      <Forklift />
      <div className="pw-heat" />
      <div className="pw-shade" />
      <div className="pw-tint" />
      <div className="pw-vignette" />
    </div>
  )
}
