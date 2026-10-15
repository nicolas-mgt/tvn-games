import type { SVGProps } from 'react'
import type { ChefMood, OwnerId, OwnerMood } from './logic'

const INK = '#2b1d14'

type ChefProps = { mood: ChefMood; kluski?: boolean } & SVGProps<SVGSVGElement>

export function Chef({ mood, kluski = false, ...svg }: ChefProps) {
  const brows = {
    appalled: 'M70 78 Q80 66 92 74 M108 74 Q120 66 130 78',
    stern: 'M70 76 L92 82 M108 82 L130 76',
    approving: 'M70 78 Q81 72 92 78 M108 74 Q119 66 130 72',
    delighted: 'M70 74 Q81 68 92 74 M108 74 Q119 68 130 74',
  }[mood]
  const mouth = {
    appalled: <ellipse cx="100" cy="124" rx="9" ry="12" fill="#7a2630" />,
    stern: <path d="M86 124 H114" stroke={INK} strokeWidth="4" strokeLinecap="round" />,
    approving: <path d="M86 120 Q100 130 114 120" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />,
    delighted: <path d="M82 116 Q100 140 118 116 Z" fill="#7a2630" stroke={INK} strokeWidth="3" strokeLinejoin="round" />,
  }[mood]
  return (
    <svg viewBox="0 0 200 240" aria-hidden data-mood={mood} {...svg}>
      <path d="M30 240 Q30 170 100 164 Q170 170 170 240 Z" fill="#fbfbf6" stroke="#d8d8d0" strokeWidth="3" />
      <path d="M100 168 V240" stroke="#d8d8d0" strokeWidth="3" />
      {[186, 206, 226].map((y) => (
        <g key={y} fill="#c9c9c0">
          <circle cx="86" cy={y} r="4" />
          <circle cx="114" cy={y} r="4" />
        </g>
      ))}
      <rect x="88" y="138" width="24" height="26" fill="#f0c3a0" />
      <path d="M64 100 Q60 40 100 38 Q140 40 136 100 Q140 128 128 132 L126 96 Q100 84 74 96 L72 132 Q60 128 64 100 Z" fill="#c9783a" />
      <ellipse cx="100" cy="100" rx="34" ry="42" fill="#f0c3a0" />
      <path d="M66 86 Q70 52 100 50 Q132 52 134 86 Q120 66 100 66 Q80 66 66 86 Z" fill="#c9783a" />
      <path d={brows} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      <g fill="none" stroke="#c0202a" strokeWidth="5">
        <circle cx="81" cy="96" r="15" fill="#fff" fillOpacity="0.35" />
        <circle cx="119" cy="96" r="15" fill="#fff" fillOpacity="0.35" />
        <path d="M96 96 H104" />
      </g>
      {mood === 'delighted' ? (
        <path d="M74 98 Q81 91 88 98 M112 98 Q119 91 126 98" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      ) : (
        <g fill={INK}>
          <circle cx="81" cy="97" r={mood === 'appalled' ? 5 : 4} />
          <circle cx="119" cy="97" r={mood === 'appalled' ? 5 : 4} />
        </g>
      )}
      {(mood === 'delighted' || mood === 'approving') && (
        <g fill="#ff8a8a" opacity="0.5">
          <ellipse cx="74" cy="116" rx="8" ry="5" />
          <ellipse cx="126" cy="116" rx="8" ry="5" />
        </g>
      )}
      {mouth}
      <path d="M78 162 Q100 178 122 162 L130 176 Q100 196 70 176 Z" fill="#d8323a" />
      <path d="M100 176 L88 206 L100 198 L112 206 Z" fill="#b0202a" />
      <g fill="#fff" opacity="0.8">
        <circle cx="86" cy="172" r="2.5" />
        <circle cx="112" cy="174" r="2.5" />
        <circle cx="100" cy="182" r="2.5" />
      </g>
      {kluski && (
        <g className="kn-kluski">
          <path d="M58 70 Q60 30 100 26 Q140 30 142 70 Q120 60 100 62 Q80 60 58 70 Z" fill="#f2e6c4" stroke="#c9b080" strokeWidth="3" />
          {[70, 88, 106, 124].map((x, i) => (
            <circle key={x} cx={x} cy={38 + (i % 2) * 8} r="10" fill="#fbf2d8" stroke="#c9b080" strokeWidth="2" />
          ))}
          <path d="M66 70 Q62 96 68 110 M134 70 Q138 92 132 104" stroke="#8a5a2a" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  )
}

type Look = { skin: string; top: string; hair: string; hat?: 'scarf' | 'toque' | 'cap'; mustache?: boolean; apron?: boolean; vest?: boolean }

const LOOKS: Record<OwnerId, Look> = {
  halina: { skin: '#f0c3a0', top: '#4f7fc0', hair: '#7a4a2a', hat: 'scarf', apron: true },
  zbyszek: { skin: '#e3a982', top: '#f4f1e6', hair: '#3a2614', hat: 'toque', mustache: true },
  marian: { skin: '#e8b48e', top: '#c8d8e8', hair: '#b8b8b8', mustache: true, vest: true },
  kamil: { skin: '#f0c3a0', top: '#3a8a5a', hair: '#5a3a20', hat: 'cap' },
}

type OwnerProps = { who: OwnerId; mood: OwnerMood; pot?: boolean } & SVGProps<SVGSVGElement>

export function Owner({ who, mood, pot = false, ...svg }: OwnerProps) {
  const look = LOOKS[who]
  const mouth = { neutral: 'M50 92 H70', happy: 'M48 89 Q60 100 72 89', upset: 'M48 96 Q60 86 72 96' }[mood]
  return (
    <svg viewBox="0 0 120 170" aria-hidden data-who={who} data-mood={mood} {...svg}>
      <path d="M14 170 Q14 116 60 112 Q106 116 106 170 Z" fill={look.top} />
      {look.vest && <path d="M30 120 L52 170 H30 Q22 140 30 120 Z M90 120 L68 170 H90 Q98 140 90 120 Z" fill="#7a4a2a" />}
      {look.apron && <path d="M38 124 H82 V170 H38 Z" fill="#fbfbf6" stroke="#d8d8d0" strokeWidth="2" />}
      {who === 'zbyszek' && <ellipse cx="74" cy="146" rx="9" ry="6" fill="#d8b05a" opacity="0.6" />}
      <rect x="52" y="100" width="16" height="14" fill={look.skin} />
      <ellipse cx="60" cy="76" rx="26" ry="30" fill={look.skin} />
      <path d="M34 72 Q34 44 60 44 Q86 44 86 72 Q76 58 60 58 Q44 58 34 72 Z" fill={look.hair} />
      {mood === 'upset' ? (
        <path d="M44 66 L56 70 M64 70 L76 66" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M44 66 Q50 63 56 66 M64 66 Q70 63 76 66" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      <g fill={INK}>
        <circle cx="50" cy="75" r="3" />
        <circle cx="70" cy="75" r="3" />
      </g>
      <path d={mouth} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      {look.mustache && <path d="M44 86 Q52 80 60 85 Q68 80 76 86 Q68 90 60 88 Q52 90 44 86 Z" fill={look.hair} />}
      {look.hat === 'scarf' && (
        <g>
          <path d="M30 76 Q28 38 60 36 Q92 38 90 76 Q84 54 60 52 Q36 54 30 76 Z" fill="#d8323a" />
          <path d="M84 70 L98 96 L86 92 Z" fill="#d8323a" />
          {[44, 60, 76].map((x) => (
            <circle key={x} cx={x} cy="46" r="3.5" fill="#ffd34d" />
          ))}
        </g>
      )}
      {look.hat === 'toque' && (
        <g fill="#fff" stroke="#d8d8d0" strokeWidth="2">
          <rect x="38" y="36" width="44" height="18" />
          <path d="M34 38 Q26 14 46 14 Q50 0 60 4 Q72 -2 76 12 Q96 12 86 38 Z" />
        </g>
      )}
      {look.hat === 'cap' && (
        <g>
          <path d="M34 62 Q34 40 60 40 Q86 40 86 62 Z" fill="#2a2a2a" />
          <path d="M34 60 H14 Q16 54 28 54 H34 Z" fill="#1a1a1a" />
        </g>
      )}
      {pot && (
        <g className="kn-pot">
          <path d="M70 118 H118 L112 150 H76 Z" fill="#8a939d" stroke="#5a636d" strokeWidth="3" />
          <path d="M66 118 H122" stroke="#5a636d" strokeWidth="6" strokeLinecap="round" />
        </g>
      )}
    </svg>
  )
}
