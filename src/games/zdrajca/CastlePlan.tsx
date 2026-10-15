import { AnimatePresence, motion } from 'motion/react'
import { useSyncExternalStore } from 'react'
import { LOCATIONS, PLAYER, statementText, TRAITOR_HIDEOUT, type Day, type Resident } from './logic'
import { ResidentToken } from './Resident'

type Box = { x: number; y: number; w: number; h: number }
type Layout = { width: number; height: number; tower: Box; rooms: Box[]; r: number; gap: number; rowGap: number; top: number }

const WIDE: Layout = {
  width: 1000,
  height: 430,
  tower: { x: 400, y: 8, w: 200, h: 70 },
  rooms: LOCATIONS.map((_, i) => ({ x: 10 + i * 247, y: 96, w: 233, h: 326 })),
  r: 27,
  gap: 72,
  rowGap: 86,
  top: 92,
}
const COMPACT: Layout = {
  width: 400,
  height: 580,
  tower: { x: 10, y: 6, w: 380, h: 50 },
  rooms: LOCATIONS.map((_, i) => ({ x: 10 + (i % 2) * 195, y: 66 + Math.floor(i / 2) * 257, w: 185, h: 247 })),
  r: 23,
  gap: 56,
  rowGap: 66,
  top: 74,
}

const compactQuery = '(max-width: 767px)'
function subscribeCompact(onChange: () => void) {
  const query = window.matchMedia(compactQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const isCompact = () => window.matchMedia(compactQuery).matches

function RoomIcon({ room, x, y }: { room: string; x: number; y: number }) {
  const ink = '#5a3a1e'
  return (
    <g transform={`translate(${x} ${y})`} stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round">
      {room === 'Biblioteka' && <path d="M-12 10 V-10 H-5 V10 M-3 10 V-12 H4 V10 M6 10 L10 -9 L15 -8 L11 10 M-15 10 H16" />}
      {room === 'Kuchnia' && <path d="M-13 -2 H13 V8 Q13 12 9 12 H-9 Q-13 12 -13 8 Z M-17 -2 H-13 M13 -2 H17 M-4 -7 Q-6 -11 -4 -14 M4 -7 Q2 -11 4 -14" />}
      {room === 'Ogród' && <path d="M0 12 V-2 M0 2 Q-9 0 -10 -8 Q-2 -8 0 2 M0 -2 Q8 -4 9 -12 Q1 -11 0 -2 M-12 12 H12" />}
      {room === 'Piwnica' && <path d="M-10 -12 H10 Q14 0 10 12 H-10 Q-14 0 -10 -12 Z M-12 -5 H12 M-12 5 H12" />}
      {room === TRAITOR_HIDEOUT && <path d="M-9 -2 V-7 Q-9 -14 0 -14 Q9 -14 9 -7 V-2 M-12 -2 H12 V12 H-12 Z M0 3 V7" />}
    </g>
  )
}

type Props = {
  residents: Resident[]
  day: Day
  selected: number | null
  onSelect: (index: number) => void
}

export function CastlePlan({ residents, day, selected, onSelect }: Props) {
  const layout = useSyncExternalStore(subscribeCompact, isCompact) ? COMPACT : WIDE
  const room = (i: number) => (i === PLAYER ? day.actual[PLAYER] : day.statements.find((s) => s.who === i)!.claimed)
  const alive = residents.flatMap((r, i) => (r.alive ? [i] : []))
  const positions = new Map<number, { x: number; y: number }>()
  LOCATIONS.forEach((location, k) => {
    const box = layout.rooms[k]
    alive
      .filter((i) => room(i) === location)
      .forEach((i, n) => {
        positions.set(i, { x: box.x + box.w / 2 + ((n % 3) - 1) * layout.gap, y: box.y + layout.top + Math.floor(n / 3) * layout.rowGap })
      })
  })
  const seen = alive.filter((i) => i !== PLAYER && day.actual[i] === day.actual[PLAYER])
  const statement = day.statements.find((s) => s.who === selected)
  const from = selected !== null ? positions.get(selected) : undefined
  const at = (p: { x: number; y: number }) => ({ left: `${(p.x / layout.width) * 100}%`, top: `${(p.y / layout.height) * 100}%` })
  const anchor = from ? (from.x < layout.width / 3 ? 'left' : from.x > (layout.width * 2) / 3 ? 'right' : 'center') : 'center'
  const arc = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    `M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - layout.r * 3.4} ${b.x} ${b.y}`
  const playerPos = positions.get(PLAYER)!

  return (
    <div className="zd-plan" data-testid="castle-plan">
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="zd-plan-svg">
        <g className="zd-tower">
          <rect x={layout.tower.x} y={layout.tower.y} width={layout.tower.w} height={layout.tower.h} rx="10" />
          <RoomIcon room={TRAITOR_HIDEOUT} x={layout.tower.x + 30} y={layout.tower.y + layout.tower.h / 2} />
          <text x={layout.tower.x + layout.tower.w / 2 + 10} y={layout.tower.y + layout.tower.h / 2 + 9} textAnchor="middle" className="zd-room-label">
            Wieża · ?
          </text>
        </g>
        {LOCATIONS.map((location, k) => {
          const box = layout.rooms[k]
          return (
            <g key={location} className="zd-room" data-room={location} data-mine={location === day.actual[PLAYER]}>
              <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="12" />
              <RoomIcon room={location} x={box.x + 26} y={box.y + 28} />
              <text x={box.x + 48} y={box.y + 38} className="zd-room-label">
                {location}
              </text>
            </g>
          )
        })}
        {seen.map((i) => (
          <motion.path
            key={`seen-${i}`}
            d={arc(playerPos, positions.get(i)!)}
            className="zd-line-seen"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
        ))}
        {from &&
          statement?.companions.flatMap((c) => {
            const to = positions.get(c)
            return to ? [<motion.path key={`claim-${selected}-${c}`} d={arc(from, to)} className="zd-line-claim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />] : []
          })}
        {alive.map((i) => {
          const p = positions.get(i)!
          const isPlayer = i === PLAYER
          return (
            <motion.g
              key={residents[i].name}
              className="zd-plan-token"
              data-testid="plan-token"
              data-room={room(i)}
              data-who={residents[i].name}
              data-selected={selected === i}
              role={isPlayer ? undefined : 'button'}
              tabIndex={isPlayer ? undefined : 0}
              aria-label={isPlayer ? 'Ty' : residents[i].name}
              onClick={isPlayer ? undefined : () => onSelect(i)}
              onKeyDown={isPlayer ? undefined : (e) => (e.key === 'Enter' || e.key === ' ') && onSelect(i)}
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.06, type: 'spring', stiffness: 300, damping: 18 }}
            >
              {isPlayer && <circle cx={p.x} cy={p.y} r={layout.r + 9} className="zd-player-ring" />}
              <ResidentToken name={residents[i].name} x={p.x} y={p.y} r={layout.r} />
              <text x={p.x} y={p.y + layout.r + 18} textAnchor="middle" className="zd-token-name">
                {isPlayer ? 'Ty' : residents[i].name.split(' ').at(-1)}
              </text>
            </motion.g>
          )
        })}
      </svg>
      <AnimatePresence>
        {statement && from && (
          <motion.p
            key={statement.who}
            className="zd-bubble zd-hand"
            data-anchor={anchor}
            style={at({ x: from.x, y: from.y - layout.r - 6 })}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            data-testid="plan-bubble"
          >
            {statementText(
              residents[statement.who].name,
              statement.claimed,
              statement.companions.map((c) => residents[c].name),
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Statements({ residents, day, selected, onSelect }: Props) {
  return (
    <ol className="zd-statements" data-testid="statements">
      {day.statements.map((s) => {
        const name = residents[s.who].name
        return (
          <li key={s.who}>
            <button type="button" data-selected={selected === s.who} data-room={s.claimed} data-who={name} onClick={() => onSelect(s.who)}>
              <b>{name}</b>
              <span className="zd-hand">„{statementText(name, s.claimed, s.companions.map((c) => residents[c].name))}”</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
