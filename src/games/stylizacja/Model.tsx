import { AnimatePresence, motion } from 'motion/react'
import type { SVGProps } from 'react'
import { SLOTS, type ModelMood, type Outfit, type Slot } from './logic'
import { ItemBack, ItemLayer } from './Wardrobe'

const INK = '#2b1d14'
const SKIN = '#e8b48e'
const SKIN_DARK = '#c98f68'
const LAYER_ORDER: Slot[] = ['buty', 'dol', 'gora', 'dodatek', 'glowa']

function Face({ mood }: { mood: ModelMood }) {
  const brows = {
    calm: 'M86 47 Q91 44 96 47 M104 47 Q109 44 114 47',
    focused: 'M86 45 L96 49 M104 49 L114 45',
    nervous: 'M86 48 Q91 42 96 45 M104 45 Q109 42 114 48',
    proud: 'M86 46 Q91 43 96 46 M104 44 Q109 40 114 44',
    happy: 'M86 45 Q91 41 96 45 M104 45 Q109 41 114 45',
    sad: 'M86 46 L96 49 M104 49 L114 46',
  }[mood]
  const mouth = {
    calm: <path d="M94 70 Q100 74 106 70" stroke="#a0404a" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    focused: <path d="M95 71 H105" stroke="#a0404a" strokeWidth="2.5" strokeLinecap="round" />,
    nervous: <path d="M93 71 q2.5 -3 5 0 t5 0 t5 0" stroke="#a0404a" strokeWidth="2.2" fill="none" strokeLinecap="round" />,
    proud: <path d="M93 69 Q101 76 108 67" stroke="#a0404a" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    happy: <path d="M92 68 Q100 80 108 68 Z" fill="#a0303a" stroke="#7a2026" strokeWidth="1.5" strokeLinejoin="round" />,
    sad: <path d="M94 73 Q100 68 106 73" stroke="#a0404a" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
  }[mood]
  const pupil = mood === 'focused' ? 1.5 : 0
  return (
    <g>
      <path d={brows} stroke="#3a2214" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {mood === 'happy' || mood === 'proud' ? (
        <path d="M87 56 Q91 52 95 56 M105 56 Q109 52 113 56" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <ellipse cx="91" cy="56" rx="4" ry="3.4" fill="#fff" />
          <ellipse cx="109" cy="56" rx="4" ry="3.4" fill="#fff" />
          <circle cx={91 + pupil} cy="56" r="2.2" fill={INK} />
          <circle cx={109 + pupil} cy="56" r="2.2" fill={INK} />
        </g>
      )}
      <path d="M100 58 Q98 64 101 65" stroke={SKIN_DARK} strokeWidth="1.5" fill="none" />
      {(mood === 'happy' || mood === 'calm' || mood === 'proud') && (
        <g fill="#ff8a8a" opacity="0.45">
          <ellipse cx="86" cy="65" rx="5" ry="3" />
          <ellipse cx="114" cy="65" rx="5" ry="3" />
        </g>
      )}
      {mood === 'nervous' && <path d="M121 42 q3 6 0 8 q-3 -2 0 -8 Z" fill="#7fd0ff" stroke="#4aa0d0" strokeWidth="1" className="st-sweat" />}
      {mood === 'sad' && <path d="M112 60 q2 5 0 7 q-2 -2 0 -7 Z" fill="#7fd0ff" />}
      {mouth}
    </g>
  )
}

type Props = { outfit: Outfit; mood: ModelMood } & SVGProps<SVGSVGElement>

export function Model({ outfit, mood, ...svg }: Props) {
  const slotData = Object.fromEntries(SLOTS.map((slot) => [`data-slot-${slot}`, outfit[slot]?.id ?? '']))
  return (
    <svg viewBox="0 0 200 400" data-testid="model" data-mood={mood} {...slotData} {...svg}>
      {outfit.dodatek && <ItemBack id={outfit.dodatek.id} />}
      <path d="M76 60 Q74 26 100 25 Q126 26 124 60 L127 88 Q116 92 111 82 H89 Q84 92 73 88 Z" fill="#4a2a1a" />
      <g stroke={SKIN} strokeLinecap="round" fill="none">
        <path d="M88 216 L86 364" strokeWidth="15" />
        <path d="M112 216 L114 364" strokeWidth="15" />
        <path d="M70 110 Q61 118 60 150 L58 226" strokeWidth="12" />
        <path d="M130 110 Q139 118 140 150 L142 226" strokeWidth="12" />
      </g>
      <ellipse cx="84" cy="370" rx="10" ry="5" fill={SKIN} />
      <ellipse cx="116" cy="370" rx="10" ry="5" fill={SKIN} />
      <path d="M70 104 Q100 97 130 104 L126 192 Q124 205 128 218 H72 Q76 205 74 192 Z" fill="#c9ccd4" />
      <path d="M72 212 H128 L127 238 H104 L100 230 L96 238 H73 Z" fill="#b0b4be" />
      <rect x="92" y="78" width="16" height="24" rx="4" fill={SKIN} />
      <ellipse cx="100" cy="58" rx="21" ry="25" fill={SKIN} />
      <Face mood={mood} />
      <path d="M78 54 Q81 31 100 30 Q119 31 122 54 Q113 40 98 41 Q86 43 78 54 Z" fill="#4a2a1a" />
      <AnimatePresence initial={false}>
        {LAYER_ORDER.filter((slot) => slot !== 'glowa' && outfit[slot]).map((slot) => (
          <Layer key={`${slot}-${outfit[slot]!.id}`} id={outfit[slot]!.id} />
        ))}
      </AnimatePresence>
      <circle cx="58" cy="232" r="6.5" fill={SKIN} />
      <circle cx="142" cy="232" r="6.5" fill={SKIN} />
      <AnimatePresence initial={false}>{outfit.glowa && <Layer key={`glowa-${outfit.glowa.id}`} id={outfit.glowa.id} />}</AnimatePresence>
    </svg>
  )
}

function Layer({ id }: { id: string }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: -16, scale: 1.08 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
    >
      <ItemLayer id={id} />
    </motion.g>
  )
}
