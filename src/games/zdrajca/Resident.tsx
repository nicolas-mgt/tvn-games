import { useId, type SVGProps } from 'react'
import type { ResidentMood } from './logic'

type Hair = 'updo' | 'bun' | 'ponytail' | 'short' | 'slick' | 'bald' | 'grey'
type Accessory = 'featherHat' | 'toque' | 'strawHat' | 'pearls' | 'monocle' | 'phone' | 'epaulettes' | 'bowtie' | 'none'
type Look = { skin: string; hair: Hair; hairColor: string; cloak: string; collar: string; accessory: Accessory; mustache?: boolean; beard?: boolean }

const LOOKS: Record<string, Look> = {
  'Hrabina Zofia': { skin: '#f0cdb0', hair: 'updo', hairColor: '#b8b0a8', cloak: '#5a2a6a', collar: '#e8d8f0', accessory: 'featherHat' },
  'Kucharz Bogdan': { skin: '#e3a982', hair: 'short', hairColor: '#4a2f1d', cloak: '#2f4f3a', collar: '#f5f2ea', accessory: 'toque', mustache: true },
  'Ogrodnik Staś': { skin: '#c98e64', hair: 'short', hairColor: '#8a5a2a', cloak: '#4a6a2a', collar: '#c9b98a', accessory: 'strawHat' },
  'Lady Pamela': { skin: '#f6d6bd', hair: 'bun', hairColor: '#e8c15a', cloak: '#2a4a7a', collar: '#f0e6d8', accessory: 'pearls' },
  'Profesor Wit': { skin: '#e8b896', hair: 'bald', hairColor: '#d8d4cc', cloak: '#4a3a2a', collar: '#8a3a2a', accessory: 'monocle', beard: true },
  'Influencerka Mia': { skin: '#d9a07a', hair: 'ponytail', hairColor: '#e85a9a', cloak: '#c0406a', collar: '#ffffff', accessory: 'phone' },
  'Major Ryszard': { skin: '#e0a888', hair: 'grey', hairColor: '#8a8a8a', cloak: '#2a3a2a', collar: '#a8202a', accessory: 'epaulettes', mustache: true },
  'Lokaj Alfred': { skin: '#efc4a4', hair: 'slick', hairColor: '#16161c', cloak: '#1a1a22', collar: '#ffffff', accessory: 'bowtie' },
  Ty: { skin: '#d9b08c', hair: 'short', hairColor: '#3a3a44', cloak: '#3a4a6a', collar: '#d8c8a8', accessory: 'none' },
}

const INK = '#2b1d14'
const HOOD = '#5a0f16'

const BROWS: Record<ResidentMood, string> = {
  calm: 'M45 49 Q50 47 55 49 M65 49 Q70 47 75 49',
  suspicious: 'M45 46 Q50 43 55 46 M65 51 L75 49',
  nervous: 'M45 49 L55 45 M65 45 L75 49',
  offended: 'M45 46 L55 51 M65 51 L75 46',
  sly: 'M45 50 L55 52 M65 52 L75 50',
  out: 'M45 50 L55 49 M65 49 L75 50',
}

const MOUTHS: Record<ResidentMood, string> = {
  calm: 'M53 73 Q60 77 67 73',
  suspicious: 'M53 75 L67 73',
  nervous: 'M51 75 Q54 72 57 75 Q60 78 63 75 Q66 72 69 75',
  offended: 'M52 77 Q60 70 68 77',
  sly: 'M52 73 Q62 76 69 69',
  out: 'M54 75 H66',
}

function Eyes({ mood }: { mood: ResidentMood }) {
  if (mood === 'out') return <path d="M45 58 Q50 61 55 58 M65 58 Q70 61 75 58" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
  if (mood === 'sly') return <path d="M45 58 Q50 55 55 58 Z M65 58 Q70 55 75 58 Z" stroke={INK} strokeWidth="2.6" fill="#ffd34d" strokeLinejoin="round" />
  if (mood === 'suspicious')
    return (
      <g fill={INK}>
        <ellipse cx="52" cy="58" rx="3.6" ry="2" />
        <ellipse cx="72" cy="58" rx="3.6" ry="1.6" />
      </g>
    )
  if (mood === 'nervous')
    return (
      <g>
        <circle cx="50" cy="58" r="5" fill="#fff" stroke={INK} strokeWidth="1.5" />
        <circle cx="70" cy="58" r="5" fill="#fff" stroke={INK} strokeWidth="1.5" />
        <circle cx="50" cy="59" r="2.2" fill={INK} />
        <circle cx="70" cy="59" r="2.2" fill={INK} />
        <path d="M84 44 Q80 51 84 53 Q88 51 84 44 Z" fill="#5bc0eb" />
      </g>
    )
  return (
    <g fill={INK}>
      <circle cx="50" cy="58" r="3.2" />
      <circle cx="70" cy="58" r="3.2" />
    </g>
  )
}

function HairBack({ look }: { look: Look }) {
  const c = look.hairColor
  if (look.hair === 'updo') return <ellipse cx="60" cy="30" rx="26" ry="18" fill={c} />
  if (look.hair === 'bun') return <circle cx="60" cy="20" r="14" fill={c} />
  if (look.hair === 'ponytail') return <path d="M80 34 Q104 40 98 84 Q92 70 84 60 Z" fill={c} />
  return null
}

function HairFront({ look }: { look: Look }) {
  const c = look.hairColor
  switch (look.hair) {
    case 'bald':
      return <path d="M33 62 Q32 44 38 42 L40 60 Z M87 62 Q88 44 82 42 L80 60 Z" fill={c} />
    case 'slick':
      return <path d="M33 54 Q31 26 60 26 Q89 26 87 54 Q84 36 62 34 Q44 34 33 54 Z" fill={c} />
    case 'grey':
      return <path d="M34 50 Q34 30 60 30 Q86 30 86 50 Q78 38 60 38 Q42 38 34 50 Z" fill={c} />
    case 'short':
      return <path d="M33 54 Q31 27 60 27 Q89 27 87 54 Q80 39 60 39 Q40 39 33 54 Z" fill={c} />
    default:
      return <path d="M33 58 Q32 28 60 28 Q88 28 87 58 Q82 40 66 38 Q60 46 46 42 Q37 46 33 58 Z" fill={c} />
  }
}

function Hat({ look }: { look: Look }) {
  switch (look.accessory) {
    case 'featherHat':
      return (
        <g>
          <path d="M70 26 Q96 2 104 8 Q94 18 78 30 Z" fill="#e8d8f0" />
          <ellipse cx="60" cy="32" rx="38" ry="7" fill="#3a1a4a" />
          <path d="M40 32 Q42 14 60 14 Q78 14 80 32 Z" fill="#3a1a4a" />
          <path d="M41 28 H79" stroke="#d9a62e" strokeWidth="3" />
        </g>
      )
    case 'toque':
      return (
        <g fill="#fafaf5" stroke="#d8d4c8" strokeWidth="1.5">
          <rect x="40" y="22" width="40" height="14" />
          <circle cx="46" cy="16" r="11" />
          <circle cx="60" cy="10" r="13" />
          <circle cx="74" cy="16" r="11" />
        </g>
      )
    case 'strawHat':
      return (
        <g>
          <ellipse cx="60" cy="34" rx="42" ry="8" fill="#e2c46a" />
          <path d="M40 34 Q42 16 60 16 Q78 16 80 34 Z" fill="#d9b456" />
          <path d="M41 30 H79" stroke="#a8323a" strokeWidth="4" />
        </g>
      )
    default:
      return null
  }
}

function Extras({ look }: { look: Look }) {
  switch (look.accessory) {
    case 'monocle':
      return (
        <g>
          <circle cx="70" cy="58" r="7" fill="none" stroke="#d9a62e" strokeWidth="2" />
          <path d="M76 62 Q82 80 76 96" stroke="#d9a62e" strokeWidth="1.2" fill="none" />
        </g>
      )
    case 'phone':
      return (
        <g>
          <ellipse cx="96" cy="112" rx="7" ry="6" fill={look.skin} />
          <rect x="88" y="86" width="16" height="26" rx="3" fill="#1d1d24" />
          <rect x="90" y="89" width="12" height="18" rx="1.5" fill="#8fd7f0" />
        </g>
      )
    case 'pearls':
      return (
        <g fill="#fbf7ee" stroke="#d8cfc0" strokeWidth="0.8">
          {[44, 50, 56, 62, 68, 74].map((x, i) => (
            <circle key={x} cx={x + 1} cy={108 - (i - 2.5) ** 2 * 0.7} r="3" />
          ))}
        </g>
      )
    case 'bowtie':
      return <path d="M50 96 L60 101 L70 96 V108 L60 103 L50 108 Z" fill="#a8202a" />
    case 'epaulettes':
      return (
        <g fill="#d9a62e">
          <rect x="16" y="108" width="24" height="8" rx="3" />
          <rect x="80" y="108" width="24" height="8" rx="3" />
          <path d="M18 116 V122 M24 116 V122 M30 116 V122 M36 116 V122 M84 116 V122 M90 116 V122 M96 116 V122 M102 116 V122" stroke="#d9a62e" strokeWidth="2" />
        </g>
      )
    default:
      return null
  }
}

function Cloak({ look, hooded }: { look: Look; hooded: boolean }) {
  const cloak = hooded ? HOOD : look.cloak
  return (
    <g>
      <path d="M10 150 Q14 104 60 94 Q106 104 110 150 Z" fill={cloak} />
      <path d="M40 150 L48 98 Q60 104 72 98 L80 150 Z" fill={look.collar} />
      <path d="M40 150 L48 98 L56 150 Z M80 150 L72 98 L64 150 Z" fill={cloak} opacity="0.85" />
      <circle cx="60" cy="100" r="5" fill="#d9a62e" stroke="#8a6a1a" strokeWidth="1.5" />
      {!hooded && <path d="M28 104 Q60 90 92 104 Q60 98 28 104 Z" fill={cloak} stroke="#00000033" strokeWidth="1.5" />}
    </g>
  )
}

type FigureProps = { name: string; mood: ResidentMood; hooded?: boolean } & SVGProps<SVGSVGElement>

const FACE_VIEWBOX = '16 4 88 88'

export function ResidentFigure({ name, mood, hooded = false, ...svg }: FigureProps) {
  const look = LOOKS[name]
  return (
    <svg viewBox="0 0 120 150" aria-hidden {...svg}>
      {hooded ? <path d="M22 100 Q14 52 30 30 Q60 0 90 30 Q106 52 98 100 Z" fill={HOOD} /> : <HairBack look={look} />}
      <Cloak look={look} hooded={hooded} />
      <rect x="52" y="80" width="16" height="18" rx="6" fill={look.skin} />
      <ellipse cx="60" cy="58" rx="27" ry="30" fill={look.skin} />
      <ellipse cx="33" cy="60" rx="4" ry="6" fill={look.skin} />
      <ellipse cx="87" cy="60" rx="4" ry="6" fill={look.skin} />
      {!hooded && <HairFront look={look} />}
      {look.beard && <path d="M36 66 Q38 96 60 100 Q82 96 84 66 Q78 80 60 82 Q42 80 36 66 Z" fill={look.hairColor} />}
      <path d={BROWS[mood]} stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <Eyes mood={mood} />
      {look.mustache && <path d="M48 70 Q54 64 60 69 Q66 64 72 70 Q66 73 60 71 Q54 73 48 70 Z" fill={look.hairColor} />}
      <path d={MOUTHS[mood]} stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {hooded ? (
        <>
          <path d="M30 60 Q30 22 60 22 Q90 22 90 60 Q84 36 60 34 Q36 36 30 60 Z" fill={HOOD} />
          <path d="M34 54 Q60 40 86 54 Q60 46 34 54 Z" fill="#000" opacity="0.35" />
        </>
      ) : (
        <Hat look={look} />
      )}
      <Extras look={look} />
    </svg>
  )
}

/** Round face medallion; `x`/`y`/`r` place it inside a parent SVG. */
export function ResidentToken({ name, x, y, r, hooded = false }: { name: string; x: number; y: number; r: number; hooded?: boolean }) {
  const clip = useId()
  return (
    <g className="zd-medal">
      <clipPath id={clip}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
      <circle cx={x} cy={y} r={r + 4} fill="#d9a62e" stroke="#6b4a1a" strokeWidth="2" />
      <circle cx={x} cy={y} r={r} fill="#efe3c4" />
      <g clipPath={`url(#${CSS.escape(clip)})`}>
        <ResidentFigure name={name} mood={hooded ? 'sly' : 'calm'} hooded={hooded} x={x - r} y={y - r} width={r * 2} height={r * 2} viewBox={FACE_VIEWBOX} />
      </g>
    </g>
  )
}
