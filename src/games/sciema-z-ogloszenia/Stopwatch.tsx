import { URGENT_SECONDS } from './logic'

export function Stopwatch({ remaining, total }: { remaining: number; total: number }) {
  const urgent = remaining < URGENT_SECONDS
  const angle = (1 - remaining / total) * 360
  return (
    <div className="sc-stopwatch" data-testid="timer" data-urgent={urgent} data-remaining={Math.ceil(remaining)}>
      <svg viewBox="0 0 100 112" aria-hidden>
        <rect x="43" y="2" width="14" height="10" rx="2" fill="#adb5bd" />
        <rect x="70" y="12" width="10" height="8" rx="2" fill="#adb5bd" transform="rotate(40 75 16)" />
        <circle cx="50" cy="62" r="46" fill="#ced4da" />
        <circle cx="50" cy="62" r="40" fill="#fbfaf5" />
        <path d={describeArc(remaining / total)} fill={urgent ? 'rgb(201 42 42 / 0.25)' : 'rgb(28 63 160 / 0.15)'} />
        {Array.from({ length: 60 }, (_, i) => (
          <rect key={i} x="49.5" y="24" width="1" height={i % 5 === 0 ? 6 : 3} fill="#343a40" transform={`rotate(${i * 6} 50 62)`} />
        ))}
        <rect x="49" y="26" width="2" height="40" fill={urgent ? '#c92a2a' : '#1c1c1c'} transform={`rotate(${angle} 50 62)`} />
        <circle cx="50" cy="62" r="3.5" fill="#c92a2a" />
        <text x="50" y="86" textAnchor="middle" className="sc-stopwatch-readout">
          {Math.ceil(remaining)} s
        </text>
      </svg>
    </div>
  )
}

function describeArc(share: number) {
  if (share >= 1) return 'M50 22 A40 40 0 1 1 49.99 22 Z'
  const end = (1 - share) * 2 * Math.PI
  const x = 50 + 40 * Math.sin(end)
  const y = 62 - 40 * Math.cos(end)
  return `M50 62 L${x} ${y} A40 40 0 ${share > 0.5 ? 1 : 0} 1 50 22 Z`
}
