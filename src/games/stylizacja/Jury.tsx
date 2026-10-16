import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { JURY, jurorComment, jurorMood, type JurorId, type JurorMood } from './logic'

const INK = '#2b1d14'

function Face({ mood, skin, eyes = true }: { mood: JurorMood; skin: string; eyes?: boolean }) {
  const brows = {
    thrilled: 'M58 68 Q66 62 74 68 M86 68 Q94 62 102 68',
    ok: 'M58 70 Q66 67 74 70 M86 70 Q94 67 102 70',
    unimpressed: 'M58 70 L74 74 M86 74 L102 70',
  }[mood]
  return (
    <g>
      <ellipse cx="80" cy="84" rx="27" ry="33" fill={skin} />
      <path d={brows} stroke={INK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      {eyes &&
        (mood === 'thrilled' ? (
          <path d="M60 81 Q66 75 72 81 M88 81 Q94 75 100 81" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : (
          <g fill={INK}>
            <circle cx="66" cy="81" r="3.3" />
            <circle cx="94" cy="81" r="3.3" />
            {mood === 'unimpressed' && <path d="M61 78 H71 M89 78 H99" stroke={skin} strokeWidth="3" />}
          </g>
        ))}
      {mood === 'thrilled' && (
        <g fill="#ff8a8a" opacity="0.5">
          <ellipse cx="60" cy="94" rx="6" ry="3.5" />
          <ellipse cx="100" cy="94" rx="6" ry="3.5" />
        </g>
      )}
      {mood === 'thrilled' && <path d="M66 98 Q80 116 94 98 Z" fill="#7a2630" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />}
      {mood === 'ok' && <path d="M69 101 Q80 107 91 101" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />}
      {mood === 'unimpressed' && <path d="M69 106 Q80 99 91 104" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />}
    </g>
  )
}

function Projektantka({ mood }: { mood: JurorMood }) {
  return (
    <>
      <path d="M48 100 Q40 50 80 46 Q122 48 116 108 L100 100 Q104 70 80 68 Q60 70 60 104 Z" fill="#6a3a9a" />
      <path d="M22 200 Q22 140 80 132 Q138 140 138 200 Z" fill="#1f1f24" />
      <rect x="68" y="110" width="24" height="26" fill="#f0c3a0" />
      <rect x="64" y="124" width="32" height="18" rx="6" fill="#1f1f24" />
      <Face mood={mood} skin="#f0c3a0" />
      <g fill="none" stroke="#d8323a" strokeWidth="4">
        <circle cx="66" cy="81" r="10" />
        <circle cx="94" cy="81" r="10" />
        <path d="M76 81 H84" />
      </g>
      <path d="M50 52 Q62 26 92 30 Q118 34 114 48 Q84 40 50 52 Z" fill="#1f1f24" />
      <circle cx="104" cy="30" r="4" fill="#1f1f24" />
    </>
  )
}

function Babcia({ mood }: { mood: JurorMood }) {
  return (
    <>
      <path d="M22 200 Q22 140 80 132 Q138 140 138 200 Z" fill="#b89ad8" />
      <path d="M80 136 V200" stroke="#9a7ac0" strokeWidth="3" />
      <rect x="68" y="110" width="24" height="26" fill="#f3cfae" />
      <g fill="#fbf8f0" stroke="#d8d0c0" strokeWidth="1">
        {[-24, -16, -8, 0, 8, 16, 24].map((dx) => (
          <circle key={dx} cx={80 + dx} cy={138 + Math.abs(dx) * -0.25 + 6} r="4" />
        ))}
      </g>
      <g fill="#d8d8d8">
        {[48, 56, 104, 112].map((x) => (
          <circle key={x} cx={x} cy="72" r="11" />
        ))}
      </g>
      <Face mood={mood} skin="#f3cfae" />
      <ellipse cx="80" cy="50" rx="44" ry="10" fill="#4a3a6a" />
      <path d="M58 50 Q58 22 80 22 Q102 22 102 50 Z" fill="#5a4a7a" />
      <circle cx="98" cy="40" r="7" fill="#f29ab4" />
      <circle cx="98" cy="40" r="3" fill="#ffd34d" />
    </>
  )
}

function Influencer({ mood }: { mood: JurorMood }) {
  return (
    <>
      <path d="M22 200 Q22 140 80 132 Q138 140 138 200 Z" fill="#2fd0a0" />
      <path d="M62 136 Q80 160 98 136" stroke="#1fa080" strokeWidth="5" fill="none" />
      <rect x="68" y="110" width="24" height="26" fill="#e8b48e" />
      <Face mood={mood} skin="#e8b48e" />
      <path d="M54 70 Q50 34 80 36 Q100 24 116 40 Q112 50 104 52 Q86 44 66 56 Z" fill="#f2d36a" />
      <path d="M132 180 L146 70" stroke="#3a3a40" strokeWidth="4" strokeLinecap="round" />
      <rect x="134" y="44" width="22" height="34" rx="4" fill="#1f1f24" />
      <rect x="137" y="48" width="16" height="24" rx="2" fill="#7fd0ff" />
      <circle cx="132" cy="182" r="8" fill="#e8b48e" />
    </>
  )
}

function Krytyk({ mood }: { mood: JurorMood }) {
  return (
    <>
      <path d="M22 200 Q22 140 80 132 Q138 140 138 200 Z" fill="#2a2a34" />
      <rect x="64" y="118" width="32" height="24" rx="8" fill="#2a2a34" />
      <rect x="68" y="108" width="24" height="16" fill="#e3a982" />
      <Face mood={mood} skin="#e3a982" />
      <path d="M54 76 Q52 60 58 56 M106 76 Q108 60 102 56" stroke="#b8b8b8" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g fill="none" stroke="#3a3a40" strokeWidth="2.5">
        <rect x="58" y="76" width="16" height="11" rx="2" />
        <rect x="86" y="76" width="16" height="11" rx="2" />
        <path d="M74 81 H86" />
      </g>
      <rect x="28" y="160" width="34" height="40" rx="2" fill="#fbf6e8" stroke="#bdb39a" strokeWidth="2" transform="rotate(-10 45 180)" />
      <path d="M34 172 H54 M34 180 H52 M34 188 H50" stroke="#9aa3ad" strokeWidth="1.5" transform="rotate(-10 45 180)" />
    </>
  )
}

const FIGURES: Record<JurorId, (props: { mood: JurorMood }) => ReactNode> = {
  projektantka: Projektantka,
  babcia: Babcia,
  influencer: Influencer,
  krytyk: Krytyk,
}

export function JurorFigure({ juror, mood }: { juror: JurorId; mood: JurorMood }) {
  const Figure = FIGURES[juror]
  return (
    <svg viewBox="0 0 160 200" className="st-juror-svg" aria-hidden>
      <g key={mood} className="st-react">
        <Figure mood={mood} />
      </g>
    </svg>
  )
}

type Props = { scores: number[]; raised: number }

export function Jury({ scores, raised }: Props) {
  const shownTotal = scores.slice(0, raised).reduce((a, b) => a + b, 0)
  return (
    <div className="st-jury-panel">
      <div className="st-jury">
        {JURY.map((juror, i) => {
          const up = i < raised
          const score = scores[i]
          const mood = up ? jurorMood(score) : 'ok'
          return (
            <figure key={juror.id} className="st-juror" data-testid="juror" data-juror={juror.id} data-mood={up ? mood : 'waiting'} data-score={up ? score : ''}>
              <div className="st-paddle-slot">
                {up && (
                  <motion.div className="st-paddle" data-score={score} initial={{ y: 40, opacity: 0, rotate: -8 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
                    {score}
                  </motion.div>
                )}
              </div>
              <JurorFigure juror={juror.id} mood={mood} />
              <figcaption>
                <b>{juror.name}</b>
                <span>{juror.role}</span>
              </figcaption>
              {up && (
                <motion.p className="st-bubble" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  „{jurorComment(juror.comments, score)}”
                </motion.p>
              )}
            </figure>
          )
        })}
      </div>
      <div className="st-scoreboard" data-testid="round-total" data-value={raised === scores.length ? shownTotal : ''}>
        <span>Suma rundy</span>
        <b>{shownTotal}</b>
        <span>/ {scores.length * 10}</span>
      </div>
    </div>
  )
}
