import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pickOne } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import events from './data.json'
import {
  botLegHours,
  BUS_PRICE,
  ELIMINATION_AFTER_LEGS,
  LEGS,
  placeOf,
  PLACE_POINTS,
  POINTS_PER_LEG_WHEN_OUT,
  slowestTeam,
  STOPS,
  travel,
  type Team,
  type Transport,
} from './logic'

const EVENT_CHANCE = 0.4
const START_TEAMS: Team[] = [
  { name: 'Wy', emoji: '🎒', hours: 0, alive: true },
  { name: 'Siostry z Mazur', emoji: '👯', hours: 0, alive: true },
  { name: 'Ojciec i syn', emoji: '👨‍👦', hours: 0, alive: true },
]
const TRANSPORTS: { id: Transport; label: string; hint: string }[] = [
  { id: 'autostop', label: '🤙 Autostop', hint: 'za darmo, 3–14 h' },
  { id: 'praca', label: '🧹 Praca za przejazd', hint: '9 h, +$1' },
  { id: 'bus', label: '🚌 Płatny bus', hint: `5 h, −$${BUS_PRICE}` },
]
const TEAM_COLORS = ['#ef4444', '#3b82f6', '#22c55e']

function RouteMap({ leg, teams }: { leg: number; teams: Team[] }) {
  return (
    <svg viewBox="0 0 420 260" className="w-full rounded-xl bg-sky-100" data-testid="route-map">
      <polyline points={STOPS.map((s) => `${s.x},${s.y}`).join(' ')} fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 6" />
      {STOPS.map((stop, i) => (
        <g key={stop.name}>
          <circle cx={stop.x} cy={stop.y} r="8" fill={i <= leg ? '#f59e0b' : '#fff'} stroke="#334155" strokeWidth="2" />
          <text x={stop.x} y={stop.y - 14} textAnchor="middle" fontSize="12" fontWeight="600">
            {stop.name}
          </text>
        </g>
      ))}
      {teams.map((team, i) =>
        team.alive ? (
          <text key={team.name} x={STOPS[leg].x + (i - 1) * 16} y={STOPS[leg].y + 26} textAnchor="middle" fontSize="16">
            {team.emoji}
          </text>
        ) : null,
      )}
      {teams.map((team, i) => (
        <rect key={team.name} x={10} y={180 + i * 22} width="8" height="8" fill={TEAM_COLORS[i]} opacity={team.alive ? 1 : 0.2} />
      ))}
      {teams.map((team, i) => (
        <text key={team.name} x={24} y={188 + i * 22} fontSize="11" opacity={team.alive ? 1 : 0.4}>
          {team.emoji} {team.name}: {team.hours} h{team.alive ? '' : ' (odpadli)'}
        </text>
      ))}
    </svg>
  )
}

export default function ExpressZaDolaraGame() {
  const [teams, setTeams] = useState(START_TEAMS)
  const [leg, setLeg] = useState(0)
  const [money, setMoney] = useState(1)
  const [amulet, setAmulet] = useState(false)
  const [log, setLog] = useState<string[]>(['Start na Bali! Macie $1 na dzień i plecak. Cel: Singapur.'])
  const [finished, setFinished] = useState(false)
  const player = teams[0]

  function restart() {
    setTeams(START_TEAMS)
    setLeg(0)
    setMoney(1)
    setAmulet(false)
    setLog(['Start na Bali! Macie $1 na dzień i plecak. Cel: Singapur.'])
    setFinished(false)
  }

  function go(transport: Transport) {
    const trip = travel(transport, Math.random)
    const lines = [`${STOPS[leg].name} → ${STOPS[leg + 1].name}: ${TRANSPORTS.find((t) => t.id === transport)!.label}, ${trip.hours} h.`]
    let hours = trip.hours
    let cash = money + trip.money
    let hasAmulet = amulet
    if (Math.random() < EVENT_CHANCE) {
      const event = pickOne(events)
      lines.push(`⚡ ${event.text}`)
      hours = Math.max(1, hours + (event.hours ?? 0))
      cash = Math.max(0, cash + (event.money ?? 0))
      if (event.amulet) hasAmulet = true
    }

    let next = teams.map((t, i) => (!t.alive ? t : { ...t, hours: t.hours + (i === 0 ? hours : botLegHours(Math.random)) }))
    const legsDone = leg + 1
    if (ELIMINATION_AFTER_LEGS.includes(legsDone)) {
      const slowest = slowestTeam(next)
      if (slowest === 0 && hasAmulet) {
        hasAmulet = false
        lines.push('🧿 Jesteście ostatni, ale amulet was ratuje! Nikt nie odpada.')
      } else {
        next = next.map((t, i) => (i === slowest ? { ...t, alive: false } : t))
        lines.push(slowest === 0 ? '❌ Dotarliście ostatni. Koniec wyprawy.' : `❌ Odpadają: ${next[slowest].name}.`)
      }
    }

    setTeams(next)
    setMoney(cash + 1)
    setAmulet(hasAmulet)
    setLeg(legsDone)
    setLog([...lines.reverse(), ...log])
    if (!next[0].alive || legsDone === LEGS) setFinished(true)
  }

  if (finished) {
    const place = player.alive ? placeOf(teams, 0) : null
    const score = place ? PLACE_POINTS[place - 1] : leg * POINTS_PER_LEG_WHEN_OUT
    return (
      <ResultScreen
        slug="express-za-dolara"
        score={score}
        maxScore={PLACE_POINTS[0]}
        summary={place ? `Singapur! Zajmujecie ${place}. miejsce z czasem ${player.hours} h.` : `Wyprawa skończyła się w: ${STOPS[leg].name}.`}
        shareLine={STOPS.slice(0, leg + 1).map(() => '🟧').join('') + (place === 1 ? '🏆' : '')}
        onRestart={restart}
      />
    )
  }

  return (
    <>
      <Hud items={[['Etap', `${leg + 1}/${LEGS}`], ['Kasa', `$${money}`], ['Amulet', amulet ? '🧿' : '–'], ['Wasz czas', `${player.hours} h`]]} />
      <RouteMap leg={leg} teams={teams} />
      <Card>
        <CardContent className="flex flex-col gap-3">
          <p className="font-semibold">
            Etap {STOPS[leg].name} → {STOPS[leg + 1].name}. Jak jedziecie?
            {ELIMINATION_AFTER_LEGS.includes(leg + 1) && ' ⚠️ Na mecie etapu najwolniejsza drużyna odpada!'}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {TRANSPORTS.map((t) => (
              <Button
                key={t.id}
                variant="outline"
                className="h-auto flex-col py-3"
                disabled={t.id === 'bus' && money < BUS_PRICE}
                data-testid={`transport-${t.id}`}
                onClick={() => go(t.id)}
              >
                <span>{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.hint}</span>
              </Button>
            ))}
          </div>
          <ul className="text-sm text-muted-foreground">
            {log.slice(0, 6).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
