import { motion } from 'motion/react'
import type { SVGProps } from 'react'
import type { TeamMood } from './logic'

type Look = {
  skin: string
  hair: 'short' | 'ponytail' | 'long'
  hairColor: string
  top: string
  hat?: 'bucket' | 'cap' | 'wreath'
  extra?: 'backpack' | 'map' | 'mustache'
}

const TEAMS: Record<string, { people: [Look, Look]; childSecond?: boolean }> = {
  Wy: {
    people: [
      { skin: '#e3a982', hair: 'short', hairColor: '#4a2f1d', top: '#f28a2e', extra: 'backpack' },
      { skin: '#f2c9a8', hair: 'ponytail', hairColor: '#e8c15a', top: '#1f9e8f', extra: 'map' },
    ],
  },
  'Siostry z Mazur': {
    people: [
      { skin: '#f0c3a0', hair: 'long', hairColor: '#9a6a3a', top: '#d8323a', hat: 'wreath' },
      { skin: '#f0c3a0', hair: 'long', hairColor: '#9a6a3a', top: '#d8323a', hat: 'wreath' },
    ],
  },
  'Ojciec i syn': {
    people: [
      { skin: '#d9a07a', hair: 'short', hairColor: '#6a6a6a', top: '#6b7a3a', hat: 'bucket', extra: 'mustache' },
      { skin: '#e3b08c', hair: 'short', hairColor: '#4a2f1d', top: '#2f6fd8', hat: 'cap' },
    ],
    childSecond: true,
  },
}

const INK = '#2b1d14'

function Face({ mood }: { mood: TeamMood }) {
  const eyes =
    mood === 'cheer' ? (
      <path d="M-11 -96 Q-7 -101 -3 -96 M3 -96 Q7 -101 11 -96" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    ) : mood === 'out' ? (
      <path d="M-11 -97 Q-7 -94 -3 -97 M3 -97 Q7 -94 11 -97" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    ) : mood === 'tired' ? (
      <path d="M-11 -97 H-3 M3 -97 H11" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
    ) : (
      <g fill={INK}>
        <circle cx="-7" cy="-97" r="2.6" />
        <circle cx="7" cy="-97" r="2.6" />
      </g>
    )
  const mouth = {
    happy: 'M-7 -86 Q0 -80 7 -86',
    cheer: 'M-8 -87 Q0 -75 8 -87 Z',
    tired: 'M-5 -84 H5',
    worried: 'M-7 -84 Q-4 -87 -1 -84 Q2 -81 5 -84',
    out: 'M-7 -82 Q0 -88 7 -82',
  }[mood]
  return (
    <g>
      {mood === 'worried' && <path d="M-12 -103 L-3 -106 M3 -106 L12 -103" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />}
      {eyes}
      <path d={mouth} stroke={INK} strokeWidth="2.4" fill={mood === 'cheer' ? '#7a2630' : 'none'} strokeLinecap="round" strokeLinejoin="round" />
      {mood === 'tired' && <path d="M17 -108 Q13 -101 17 -99 Q21 -101 17 -108 Z" fill="#5bc0eb" />}
    </g>
  )
}

function Person({ look, mood, x, scale }: { look: Look; mood: TeamMood; x: number; scale: number }) {
  const armsUp = mood === 'cheer'
  return (
    <g transform={`translate(${x} 150) scale(${scale})`}>
      {look.extra === 'backpack' && <rect x="-30" y="-70" width="20" height="44" rx="6" fill="#6a4a2a" />}
      {look.hair === 'long' && <path d="M-21 -98 Q-24 -60 -18 -58 H18 Q24 -60 21 -98 Z" fill={look.hairColor} />}
      {look.hair === 'ponytail' && <path d="M16 -110 Q34 -100 26 -72 Q22 -88 14 -96 Z" fill={look.hairColor} />}
      <path d={armsUp ? 'M-20 -66 L-34 -118 M20 -66 L34 -118' : 'M-22 -66 L-28 -20 M22 -66 L28 -20'} stroke={look.top} strokeWidth="11" strokeLinecap="round" />
      <path d="M-24 0 V-56 Q-24 -72 0 -74 Q24 -72 24 -56 V0 Z" fill={look.top} />
      {look.extra === 'backpack' && <path d="M-14 -72 V-30 M14 -72 V-30" stroke="#6a4a2a" strokeWidth="5" />}
      <rect x="-6" y="-80" width="12" height="10" fill={look.skin} />
      <circle cx="0" cy="-96" r="20" fill={look.skin} />
      <path d="M-20 -98 Q-20 -118 0 -118 Q20 -118 20 -98 Q12 -108 0 -108 Q-12 -108 -20 -98 Z" fill={look.hairColor} />
      <Face mood={mood} />
      {look.extra === 'mustache' && <path d="M-9 -88 Q-4 -92 0 -89 Q4 -92 9 -88 Q4 -86 0 -87 Q-4 -86 -9 -88 Z" fill={look.hairColor} />}
      {look.hat === 'bucket' && (
        <g fill="#c9b98a" stroke="#8a7a4a" strokeWidth="1.5">
          <path d="M-30 -108 Q0 -100 30 -108 L22 -114 H-22 Z" />
          <path d="M-18 -112 Q-18 -128 0 -128 Q18 -128 18 -112 Z" />
        </g>
      )}
      {look.hat === 'cap' && (
        <g>
          <path d="M-20 -104 Q-20 -122 0 -122 Q20 -122 20 -104 Z" fill="#e8323a" />
          <path d="M8 -106 H34 Q32 -101 22 -101 H8 Z" fill="#b8202a" />
        </g>
      )}
      {look.hat === 'wreath' && (
        <g>
          {[-18, -9, 0, 9, 18].map((dx, i) => (
            <circle key={dx} cx={dx} cy={-112 + Math.abs(dx) * 0.3} r="5" fill={['#ffd34d', '#ff8fc0', '#ffffff', '#ff8fc0', '#ffd34d'][i]} />
          ))}
        </g>
      )}
      {look.extra === 'map' && !armsUp && (
        <g>
          <rect x="-16" y="-48" width="34" height="24" fill="#f4ecd0" stroke="#a8925a" strokeWidth="1.5" transform="rotate(-8 0 -36)" />
          <path d="M-10 -40 Q0 -30 12 -42" stroke="#d8323a" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
        </g>
      )}
    </g>
  )
}

type FigureProps = { team: string; mood: TeamMood } & SVGProps<SVGSVGElement>

export function TeamFigure({ team, mood, ...svg }: FigureProps) {
  const { people, childSecond } = TEAMS[team]
  return (
    <svg viewBox="0 -10 160 160" aria-hidden {...svg}>
      <Person look={people[0]} mood={mood} x={52} scale={1} />
      <Person look={people[1]} mood={mood} x={110} scale={childSecond ? 0.78 : 0.96} />
    </svg>
  )
}

export function Host({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 140 170" className={className} aria-hidden>
      <path d="M40 170 V108 Q40 92 70 90 Q100 92 100 108 V170 Z" fill="#e8dcc0" />
      <path d="M60 92 L70 112 L80 92 Z" fill="#d8323a" />
      <rect x="64" y="76" width="12" height="16" fill="#e8b48f" />
      <circle cx="70" cy="60" r="22" fill="#e8b48f" />
      <path d="M48 62 Q46 34 70 34 Q94 34 92 62 Q96 86 88 96 Q86 70 80 52 Q70 46 60 52 Q54 70 52 96 Q44 86 48 62 Z" fill="#3a2214" />
      <g fill="#2b1d14">
        <circle cx="62" cy="60" r="2.6" />
        <circle cx="78" cy="60" r="2.6" />
      </g>
      <path d="M63 71 Q70 76 77 71" stroke="#2b1d14" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="40" rx="40" ry="8" fill="#c9a86a" />
      <path d="M48 40 Q48 18 70 18 Q92 18 92 40 Z" fill="#d9b87a" />
      <path d="M49 34 H91" stroke="#6a4a2a" strokeWidth="4" />
      <path d="M100 112 L118 128" stroke="#e8dcc0" strokeWidth="12" strokeLinecap="round" />
      <g transform="translate(104 118) rotate(-12)">
        <rect width="40" height="28" rx="2" fill="#c8102e" />
        <motion.path d="M0 0 L20 14 L40 0 Z" fill="#9a0c24" initial={false} animate={{ opacity: open ? 0 : 1 }} />
        <motion.path d="M0 0 L20 -16 L40 0 Z" fill="#9a0c24" initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: 0.15 }} />
        {!open && <circle cx="20" cy="14" r="4" fill="#ffd34d" />}
      </g>
    </svg>
  )
}

export function Pawn({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="10" rx="10" ry="4" fill="#000" opacity="0.2" />
      <path d="M-8 10 Q-8 -2 0 -4 Q8 -2 8 10 Z" fill={color} stroke="#fff" strokeWidth="1.5" />
      <circle cx="0" cy="-10" r="7" fill={color} stroke="#fff" strokeWidth="1.5" />
      <text x="0" y="-7" textAnchor="middle" className="ex-pawn-label">
        {label}
      </text>
    </g>
  )
}
