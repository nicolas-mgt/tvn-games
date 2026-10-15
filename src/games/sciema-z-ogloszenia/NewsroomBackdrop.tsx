import './newsroom.css'

export type Mood = 'idle' | 'reading' | 'hit' | 'miss' | 'urgent' | 'review' | 'result'

const PINS = [
  { x: 14, y: 18 },
  { x: 58, y: 12 },
  { x: 86, y: 40 },
  { x: 36, y: 62 },
  { x: 74, y: 80 },
]

function Skyline() {
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMax slice" className="sc-skyline" aria-hidden>
      <path d="M0 200 V120 H30 V90 H62 V130 H90 V70 H120 V110 H150 V60 H186 V125 H214 V95 H246 V140 H270 V105 H300 V200 Z" fill="#0d1424" />
      {[38, 46, 54, 98, 106, 112, 158, 166, 174, 222, 230, 238].flatMap((x) =>
        [78, 92, 106, 120, 134, 148].map((y) => (x + y * 3) % 7 < 2 && <rect key={`${x}-${y}`} x={x} y={y} width="4" height="5" fill="#f5d27a" opacity="0.8" />),
      )}
    </svg>
  )
}

function CorkBoard() {
  return (
    <div className="sc-board">
      <div className="sc-clip sc-clip-1">
        <strong>AFERA NA GIEŁDZIE</strong>
        <span />
        <span />
        <span />
      </div>
      <div className="sc-clip sc-clip-2">
        <strong>Licznik cofnięty o 200 tys.</strong>
        <span />
        <span />
      </div>
      <div className="sc-polaroid sc-polaroid-1" />
      <div className="sc-polaroid sc-polaroid-2" />
      <div className="sc-note sc-note-1">Kto to jest „Niemiec”?!</div>
      <div className="sc-note sc-note-2">VIN???</div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="sc-string" aria-hidden>
        <polyline points={PINS.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#c92a2a" strokeWidth="0.6" />
      </svg>
      {PINS.map((p) => (
        <span key={`${p.x}-${p.y}`} className="sc-pin" style={{ left: `${p.x}%`, top: `${p.y}%` }} />
      ))}
    </div>
  )
}

export function NewsroomBackdrop({ mood }: { mood: Mood }) {
  return (
    <div className="sc-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-mood={mood} data-testid="newsroom-backdrop">
      <div className="sc-wall" />
      <div className="sc-window">
        <div className="sc-sky" />
        <Skyline />
        <div className="sc-rain" />
        <div className="sc-window-cross" />
      </div>
      <svg viewBox="0 0 100 100" className="sc-clock" aria-hidden>
        <circle cx="50" cy="50" r="46" fill="#f4efe1" stroke="#3a2a1e" strokeWidth="5" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="49" y="8" width="2" height="7" fill="#3a2a1e" transform={`rotate(${i * 30} 50 50)`} />
        ))}
        <rect x="48.5" y="26" width="3" height="26" fill="#1c1c1c" className="sc-clock-hour" />
        <rect x="49.25" y="14" width="1.5" height="38" fill="#1c1c1c" className="sc-clock-minute" />
        <circle cx="50" cy="50" r="3" fill="#c92a2a" />
      </svg>
      <CorkBoard />
      <div className="sc-blinds" />
      <div className="sc-police" />
      <div className="sc-desk" />
      <div className="sc-lamp">
        <div className="sc-lamp-cone" />
        <div className="sc-lamp-shade" />
        <div className="sc-lamp-stem" />
      </div>
      <svg viewBox="0 0 160 90" className="sc-typewriter" aria-hidden>
        <rect x="30" y="4" width="100" height="34" fill="#f4efe1" />
        <path d="M10 40 H150 L140 86 H20 Z" fill="#23272e" />
        <rect x="4" y="34" width="152" height="10" rx="5" fill="#3a3f46" />
        {[0, 1, 2].map((row) =>
          Array.from({ length: 10 - row }, (_, i) => <circle key={`${row}-${i}`} cx={38 + row * 6 + i * 10} cy={56 + row * 10} r="3.4" fill="#cfd4da" />),
        )}
      </svg>
      <div className="sc-mug">
        <span className="sc-steam" />
        <span className="sc-steam" />
      </div>
      <div className="sc-glow" />
      <div className="sc-vignette" />
    </div>
  )
}
