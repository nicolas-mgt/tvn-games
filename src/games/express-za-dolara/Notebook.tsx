import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { BUS_PRICE, ELIMINATION_AFTER_LEGS, STOPS, TEAM_COLORS, TRANSPORTS, type Team, type Transport } from './logic'
import { Pawn } from './Team'

function Land() {
  return (
    <g fill="#efe0b4" stroke="#b89a5a" strokeWidth="1.5">
      <path d="M20 20 Q60 10 90 30 Q120 60 150 100 Q160 130 140 135 Q110 120 90 90 Q60 60 30 50 Z" />
      <path d="M0 90 Q40 110 80 150 Q110 190 90 200 Q50 170 20 140 Q0 120 0 110 Z" />
      <path d="M200 190 Q260 180 330 205 Q345 220 320 228 Q260 222 205 210 Z" />
      <path d="M352 222 Q372 216 390 228 Q378 242 356 238 Z" />
      <path d="M200 60 Q260 40 300 70 Q310 110 270 130 Q230 120 210 100 Z" />
    </g>
  )
}

const ICONS: Record<Transport, ReactNode> = {
  autostop: (
    <svg viewBox="0 0 90 70" aria-hidden>
      <rect x="6" y="8" width="62" height="40" rx="3" fill="#c99a5a" stroke="#8a6a3a" strokeWidth="2" transform="rotate(-6 37 28)" />
      <text x="36" y="34" textAnchor="middle" className="ex-sign-text" transform="rotate(-6 37 28)">
        SINGAPUR?
      </text>
      <path d="M66 52 V40 Q66 34 72 34 H80 Q86 34 86 40 V52 Q86 60 78 60 H72 Q66 60 66 52 Z" fill="#e3a982" />
      <path d="M74 34 V14 Q74 8 79 8 Q84 8 84 14 V36" fill="#e3a982" stroke="#b97a52" strokeWidth="1.5" />
    </svg>
  ),
  praca: (
    <svg viewBox="0 0 90 70" aria-hidden>
      <path d="M30 6 Q45 16 60 6" stroke="#6a4a2a" strokeWidth="3" fill="none" />
      <path d="M28 14 H62 L70 66 H20 Z" fill="#4f9fd8" stroke="#2a6a9a" strokeWidth="2" />
      <path d="M14 26 L28 18 M76 26 L62 18" stroke="#2a6a9a" strokeWidth="3" />
      <rect x="34" y="38" width="22" height="14" rx="2" fill="#2a6a9a" />
      <circle cx="45" cy="26" r="4" fill="#ffd34d" />
    </svg>
  ),
  bus: (
    <svg viewBox="0 0 90 70" aria-hidden>
      <rect x="6" y="14" width="78" height="42" rx="4" fill="#ffe9b0" stroke="#c99a3a" strokeWidth="2" />
      <path d="M62 14 V56" stroke="#c99a3a" strokeWidth="2" strokeDasharray="4 3" />
      <text x="34" y="32" textAnchor="middle" className="ex-ticket-text">
        BUS
      </text>
      <text x="34" y="48" textAnchor="middle" className="ex-ticket-sub">
        Jawa · KL · SG
      </text>
      <circle cx="73" cy="35" r="7" fill="#2fa8a0" />
    </svg>
  ),
}

type Props = {
  teams: Team[]
  /** Stop index each team stands at (or is travelling to). */
  positions: number[]
  durations: number[]
  reached: number
  leg: number
  money: number
  choosing: boolean
  onChoose: (transport: Transport) => void
}

export function Notebook({ teams, positions, durations, reached, leg, money, choosing, onChoose }: Props) {
  const warn = ELIMINATION_AFTER_LEGS.includes(leg + 1)
  return (
    <section className="ex-notebook" data-testid="notebook">
      <div className="ex-page ex-page-map">
        <svg viewBox="0 0 420 260" className="ex-map" data-testid="route-map">
          <rect width="420" height="260" fill="#cfe6e8" />
          <path d="M0 0 H420 V260 H0 Z" fill="url(#ex-hatch)" opacity="0.4" />
          <defs>
            <pattern id="ex-hatch" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0 10 L10 0" stroke="#9cc3c8" strokeWidth="1" />
            </pattern>
          </defs>
          <Land />
          {STOPS.slice(1).map((stop, k) => {
            const from = STOPS[k]
            const d = `M${from.x} ${from.y} Q${(from.x + stop.x) / 2} ${Math.min(from.y, stop.y) - 24} ${stop.x} ${stop.y}`
            return (
              <g key={stop.name}>
                <path d={d} stroke="#8a7a5a" strokeWidth="2" strokeDasharray="5 5" fill="none" />
                {k < reached && (
                  <motion.path
                    d={d}
                    stroke="#d8323a"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: k === reached - 1 ? Math.max(...durations, 0.6) : 0 }}
                  />
                )}
              </g>
            )
          })}
          {STOPS.map((stop, i) => (
            <g key={stop.name} className="ex-stamp" data-reached={i <= reached}>
              <rect x={stop.x - 9} y={stop.y - 9} width="18" height="18" rx="2" />
              <text
                x={stop.y > 150 ? stop.x : stop.x + 22}
                y={stop.y > 150 ? stop.y + 26 : stop.y + 5}
                textAnchor={stop.y > 150 ? 'middle' : 'start'}
                className="ex-stop-label"
              >
                {stop.name}
              </text>
            </g>
          ))}
          {teams.map((team, i) =>
            team.alive ? (
              <motion.g
                key={team.name}
                data-testid="pawn"
                data-team={team.name}
                initial={false}
                animate={{ x: STOPS[positions[i]].x + (i - 1) * 13, y: STOPS[positions[i]].y - 4 }}
                transition={{ duration: durations[i] ?? 0, ease: 'easeInOut' }}
              >
                <Pawn x={0} y={0} color={TEAM_COLORS[i]} label={team.name === 'Wy' ? 'W' : team.name[0]} />
              </motion.g>
            ) : null,
          )}
        </svg>
        <ul className="ex-legend">
          {teams.map((team, i) => (
            <li key={team.name} data-out={!team.alive}>
              <i style={{ background: TEAM_COLORS[i] }} />
              {team.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="ex-page ex-page-choice">
        <p className="ex-page-title ex-hand">
          {STOPS[leg].name} → {STOPS[leg + 1].name}. Jak jedziecie?
        </p>
        {warn && (
          <p className="ex-warning ex-hand" data-testid="elimination-warning">
            Na mecie etapu najwolniejsza drużyna odpada!
          </p>
        )}
        <div className="ex-choices">
          {TRANSPORTS.map((t) => {
            const broke = t.id === 'bus' && money < BUS_PRICE
            return (
              <button
                key={t.id}
                type="button"
                className="ex-choice"
                data-testid={`transport-${t.id}`}
                data-broke={broke}
                disabled={!choosing || broke}
                onClick={() => onChoose(t.id)}
              >
                <span className="ex-choice-icon">{ICONS[t.id]}</span>
                <b>{t.label}</b>
                <span className="ex-hand">{broke ? `brakuje $${BUS_PRICE - money}` : t.hint}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
