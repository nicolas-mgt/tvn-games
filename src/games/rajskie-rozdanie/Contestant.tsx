import { AnimatePresence, motion } from 'motion/react'
import type { Contestant, ContestantMood, Personality } from './logic'
import { MAX_AFFECTION } from './logic'
import { Heart } from './VillaBackdrop'

type Hair = 'long' | 'wavy' | 'curly' | 'short' | 'buzz' | 'swept' | 'ponytail'
type Outfit = 'top' | 'shirt' | 'tank'
type Accessory = 'sunglassesHead' | 'cap' | 'flowerBand' | 'hibiscus' | 'shades' | 'butterfly' | 'none'

type Look = { skin: string; hair: Hair; hairColor: string; outfit: Outfit; color: string; accessory: Accessory; female: boolean; broad?: boolean }

const LOOKS: Record<string, Look> = {
  Kamila: { skin: '#e8b48f', hair: 'long', hairColor: '#6b1f2a', outfit: 'top', color: '#e03a3e', accessory: 'sunglassesHead', female: true },
  Dawid: { skin: '#c98e64', hair: 'short', hairColor: '#4a2f1d', outfit: 'shirt', color: '#1f9e8f', accessory: 'cap', female: false },
  Wiktoria: { skin: '#f2c9a8', hair: 'wavy', hairColor: '#e8c15a', outfit: 'top', color: '#f07bb0', accessory: 'flowerBand', female: true },
  Patryk: { skin: '#b97a52', hair: 'buzz', hairColor: '#2a1c14', outfit: 'tank', color: '#f5f5f5', accessory: 'none', female: false, broad: true },
  Oliwia: { skin: '#8d5a3b', hair: 'curly', hairColor: '#1d1410', outfit: 'top', color: '#f28a2e', accessory: 'hibiscus', female: true },
  Maks: { skin: '#e3a982', hair: 'swept', hairColor: '#9a6a3a', outfit: 'shirt', color: '#7a4fc9', accessory: 'shades', female: false },
  Natalia: { skin: '#f0c3a0', hair: 'ponytail', hairColor: '#7a4a28', outfit: 'tank', color: '#4fc79a', accessory: 'butterfly', female: true },
  Ty: { skin: '#d9b08c', hair: 'short', hairColor: '#3a3a44', outfit: 'shirt', color: '#5b6b8a', accessory: 'none', female: false },
}

const PERSONALITY: Record<Personality, [male: string, female: string]> = {
  lojalny: ['lojalny', 'lojalna'],
  intrygant: ['intrygant', 'intrygantka'],
  zazdrosny: ['zazdrosny', 'zazdrosna'],
}

function personalityLabel(c: Contestant) {
  return PERSONALITY[c.personality][LOOKS[c.name].female ? 1 : 0]
}

const INK = '#2b1d14'

const BROWS: Record<ContestantMood, string> = {
  neutral: 'M45 49 Q50 47 55 49 M65 49 Q70 47 75 49',
  fan: 'M45 47 Q50 44 55 47 M65 47 Q70 44 75 47',
  cheerful: 'M45 46 Q50 43 55 46 M65 46 Q70 43 75 46',
  smitten: 'M45 46 Q50 43 55 46 M65 46 Q70 43 75 46',
  cold: 'M45 47 L55 51 M65 51 L75 47',
  jealous: 'M45 48 L55 52 M65 50 L75 46',
  hurt: 'M45 51 L55 47 M65 47 L75 51',
  out: 'M45 50 L55 49 M65 49 L75 50',
}

const MOUTHS: Record<ContestantMood, string> = {
  neutral: 'M53 73 Q60 76 67 73',
  fan: 'M51 71 Q60 80 69 71',
  cheerful: 'M50 70 Q60 85 70 70 Z',
  smitten: 'M50 70 Q60 82 70 70',
  cold: 'M53 76 Q60 72 67 76',
  jealous: 'M53 75 Q57 72 61 75 Q64 77 67 73',
  hurt: 'M52 77 Q60 70 68 77',
  out: 'M54 75 H66',
}

function Eyes({ mood }: { mood: ContestantMood }) {
  if (mood === 'fan' || mood === 'cheerful')
    return <path d="M45 59 Q50 53 55 59 M65 59 Q70 53 75 59" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
  if (mood === 'out') return <path d="M45 58 Q50 61 55 58 M65 58 Q70 61 75 58" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
  if (mood === 'smitten')
    return (
      <g fill="#e8326a">
        {[50, 70].map((x) => (
          <path key={x} d={`M${x} 62 C${x - 7} 57 ${x - 5} 52 ${x} 55.5 C${x + 5} 52 ${x + 7} 57 ${x} 62 Z`} />
        ))}
      </g>
    )
  if (mood === 'cold')
    return (
      <g fill={INK}>
        <ellipse cx="50" cy="58" rx="3.6" ry="1.8" />
        <ellipse cx="70" cy="58" rx="3.6" ry="1.8" />
      </g>
    )
  const dx = mood === 'jealous' ? 2.2 : 0
  return (
    <g>
      <circle cx={50 + dx} cy="58" r="3.2" fill={INK} />
      <circle cx={70 + dx} cy="58" r="3.2" fill={INK} />
      {mood === 'jealous' && <path d="M45 55 L55 56 M65 56 L75 55" stroke={INK} strokeWidth="2" />}
      {mood === 'hurt' && <path d="M72 63 Q69 69 72 71 Q75 69 72 63 Z" fill="#5bc0eb" />}
    </g>
  )
}

function HairBack({ look }: { look: Look }) {
  const c = look.hairColor
  if (look.hair === 'long') return <path d="M31 58 Q28 22 60 22 Q92 22 89 58 L94 114 Q80 120 72 102 H48 Q40 120 26 114 Z" fill={c} />
  if (look.hair === 'wavy')
    return <path d="M31 58 Q28 22 60 22 Q92 22 89 58 Q98 74 90 88 Q100 102 88 114 Q78 110 72 100 H48 Q42 110 32 114 Q20 102 30 88 Q22 74 31 58 Z" fill={c} />
  if (look.hair === 'curly')
    return (
      <g fill={c}>
        {[
          [34, 40], [46, 28], [60, 24], [74, 28], [86, 40], [90, 56], [88, 72], [32, 72], [30, 56], [92, 86], [28, 86],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="13" />
        ))}
      </g>
    )
  if (look.hair === 'ponytail') return <circle cx="60" cy="22" r="13" fill={c} />
  return null
}

function HairFront({ look }: { look: Look }) {
  const c = look.hairColor
  switch (look.hair) {
    case 'buzz':
      return <path d="M34 50 Q34 30 60 30 Q86 30 86 50 Q78 38 60 38 Q42 38 34 50 Z" fill={c} opacity="0.85" />
    case 'swept':
      return <path d="M33 54 Q29 26 58 23 Q92 17 93 44 Q82 34 64 38 Q44 38 33 54 Z" fill={c} />
    case 'curly':
      return (
        <g fill={c}>
          <circle cx="44" cy="38" r="10" />
          <circle cx="58" cy="34" r="11" />
          <circle cx="73" cy="37" r="10" />
        </g>
      )
    case 'short':
      return <path d="M33 54 Q31 27 60 27 Q89 27 87 54 Q80 39 60 39 Q40 39 33 54 Z" fill={c} />
    default:
      return <path d="M33 58 Q32 28 60 28 Q88 28 87 58 Q82 40 66 38 Q60 46 46 42 Q37 46 33 58 Z" fill={c} />
  }
}

function Accessory({ look }: { look: Look }) {
  switch (look.accessory) {
    case 'sunglassesHead':
      return (
        <g>
          <path d="M40 33 H80" stroke={INK} strokeWidth="2.5" />
          <rect x="40" y="29" width="16" height="9" rx="4" fill="#1d1d24" />
          <rect x="64" y="29" width="16" height="9" rx="4" fill="#1d1d24" />
        </g>
      )
    case 'cap':
      return (
        <g>
          <path d="M33 46 Q33 20 60 20 Q87 20 87 46 Z" fill="#2856b8" />
          <path d="M30 46 H98 Q96 52 84 52 H30 Z" fill="#1d3f8a" />
          <circle cx="60" cy="21" r="3" fill="#1d3f8a" />
        </g>
      )
    case 'flowerBand':
      return (
        <g>
          <path d="M33 42 Q60 28 87 42" stroke="#fff" strokeWidth="4" fill="none" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={84 + 6 * Math.cos((a * Math.PI) / 180)} cy={36 + 6 * Math.sin((a * Math.PI) / 180)} r="5" fill="#ff8fc0" />
          ))}
          <circle cx="84" cy="36" r="3.5" fill="#ffd34d" />
        </g>
      )
    case 'hibiscus':
      return (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={88 + 7 * Math.cos((a * Math.PI) / 180)}
              cy={54 + 7 * Math.sin((a * Math.PI) / 180)}
              rx="7"
              ry="5"
              transform={`rotate(${a} ${88 + 7 * Math.cos((a * Math.PI) / 180)} ${54 + 7 * Math.sin((a * Math.PI) / 180)})`}
              fill="#e8325a"
            />
          ))}
          <circle cx="88" cy="54" r="3" fill="#ffd34d" />
        </g>
      )
    case 'shades':
      return (
        <g>
          <path d="M42 57 H78" stroke={INK} strokeWidth="2.5" />
          <rect x="41" y="52" width="17" height="11" rx="4" fill="#1d1d24" />
          <rect x="62" y="52" width="17" height="11" rx="4" fill="#1d1d24" />
          <path d="M44 55 L49 54" stroke="#8fd7f0" strokeWidth="1.6" />
        </g>
      )
    case 'butterfly':
      return (
        <g transform="translate(82 30) rotate(20)">
          <ellipse cx="-5" cy="-3" rx="6" ry="5" fill="#5b8cff" />
          <ellipse cx="5" cy="-3" rx="6" ry="5" fill="#5b8cff" />
          <ellipse cx="-4" cy="4" rx="4" ry="3.5" fill="#9ab8ff" />
          <ellipse cx="4" cy="4" rx="4" ry="3.5" fill="#9ab8ff" />
          <rect x="-1" y="-6" width="2" height="13" rx="1" fill={INK} />
        </g>
      )
    default:
      return null
  }
}

function Body({ look }: { look: Look }) {
  const shoulders = look.broad ? 'M8 150 Q8 100 60 94 Q112 100 112 150 Z' : 'M18 150 Q20 104 60 96 Q100 104 102 150 Z'
  if (look.outfit === 'shirt')
    return (
      <g>
        <path d={shoulders} fill={look.color} />
        <path d="M48 96 L60 122 L72 96 Z" fill={look.skin} />
        <path d="M44 96 L54 116 L48 124 Z M76 96 L66 116 L72 124 Z" fill="#fff" opacity="0.85" />
        <g fill="#fff" opacity="0.35">
          <circle cx="30" cy="128" r="4" />
          <circle cx="88" cy="132" r="4" />
          <circle cx="42" cy="142" r="3" />
          <circle cx="80" cy="114" r="3" />
        </g>
      </g>
    )
  if (look.outfit === 'tank')
    return (
      <g>
        <path d={shoulders} fill={look.skin} />
        <path d={look.broad ? 'M30 150 L34 108 Q46 116 60 116 Q74 116 86 108 L90 150 Z' : 'M34 150 L38 108 Q48 116 60 116 Q72 116 82 108 L86 150 Z'} fill={look.color} />
        {look.broad && <path d="M16 128 Q22 112 30 118 M104 128 Q98 112 90 118" stroke="#8a5536" strokeWidth="2" fill="none" />}
      </g>
    )
  return (
    <g>
      <path d={shoulders} fill={look.skin} />
      <path d="M30 150 Q30 124 34 120 Q60 128 86 120 Q90 124 90 150 Z" fill={look.color} />
      <path d="M44 121 L50 100 M76 121 L70 100" stroke={look.color} strokeWidth="2.5" />
    </g>
  )
}

export function ContestantFigure({ name, mood, className }: { name: string; mood: ContestantMood; className?: string }) {
  const look = LOOKS[name]
  const blush = mood === 'fan' || mood === 'smitten' || mood === 'cheerful'
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden>
      <HairBack look={look} />
      <Body look={look} />
      <rect x="52" y="80" width="16" height="20" rx="6" fill={look.skin} />
      <ellipse cx="60" cy="58" rx="27" ry="30" fill={look.skin} />
      <ellipse cx="33" cy="60" rx="4" ry="6" fill={look.skin} />
      <ellipse cx="87" cy="60" rx="4" ry="6" fill={look.skin} />
      <HairFront look={look} />
      <path d={BROWS[mood]} stroke={look.hairColor === '#e8c15a' ? '#a4782c' : INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <Eyes mood={mood} />
      {blush && (
        <g fill="#ff6f91" opacity={mood === 'smitten' ? 0.6 : 0.35}>
          <ellipse cx="43" cy="67" rx="6" ry="3.5" />
          <ellipse cx="77" cy="67" rx="6" ry="3.5" />
        </g>
      )}
      <path
        d={MOUTHS[mood]}
        stroke={INK}
        strokeWidth="2.6"
        fill={mood === 'cheerful' ? '#7a2630' : 'none'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Accessory look={look} />
      {mood === 'cold' && <path d="M22 146 Q60 118 98 134 L98 146 Q60 134 30 150 Z" fill={look.skin} stroke="#00000033" strokeWidth="2" />}
    </svg>
  )
}

const BUBBLES: Partial<Record<ContestantMood, string>> = { hurt: 'psst…', jealous: 'hmpf!', cheerful: 'ha ha!' }

type TileProps = {
  contestant: Contestant
  mood: ContestantMood
  selected: boolean
  turned: boolean
  oracleTarget: string | null
  onClick: () => void
}

export function ContestantTile({ contestant, mood, selected, turned, oracleTarget, onClick }: TileProps) {
  const hearts = Math.round((contestant.affection / MAX_AFFECTION) * 5)
  return (
    <motion.button
      layout
      type="button"
      className="rr-tile"
      data-testid="contestant"
      data-mood={mood}
      data-selected={selected}
      onClick={onClick}
      animate={mood === 'cheerful' ? { y: [0, -14, 0, -8, 0] } : { y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <AnimatePresence>
        {oracleTarget && (
          <motion.span
            className="rr-oracle"
            data-testid="oracle"
            initial={{ opacity: 0, scale: 0.4, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <ContestantFigure name={oracleTarget} mood="neutral" className="rr-oracle-face" />
            <span className="rr-hand">{oracleTarget === 'Ty' ? 'na ciebie!' : oracleTarget}</span>
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {BUBBLES[mood] && (
          <motion.span
            key={mood}
            className="rr-bubble rr-hand"
            initial={{ opacity: 0, scale: 0.5, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {BUBBLES[mood]}
          </motion.span>
        )}
      </AnimatePresence>
      {mood === 'smitten' && (
        <span className="rr-burst" aria-hidden>
          {[-30, -10, 10, 30].map((x, i) => (
            <motion.span
              key={x}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 0], x, y: -70 - i * 8, scale: 1 }}
              transition={{ duration: 1.3, delay: i * 0.1 }}
            >
              <Heart size={16} />
            </motion.span>
          ))}
        </span>
      )}
      <motion.span className="rr-figure" animate={{ scaleX: turned ? -1 : 1 }} transition={{ duration: 0.3 }}>
        <ContestantFigure name={contestant.name} mood={mood} className="rr-bob" />
      </motion.span>
      <span className="rr-name">{contestant.name}</span>
      <span className="rr-trait">{personalityLabel(contestant)}</span>
      <span className="rr-meter" aria-label={`sympatia ${contestant.affection} na ${MAX_AFFECTION}`} data-testid="affection" data-value={contestant.affection}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < hearts ? '' : 'rr-heart-empty'}>
            <Heart size={13} />
          </span>
        ))}
      </span>
    </motion.button>
  )
}
