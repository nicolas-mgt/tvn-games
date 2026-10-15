import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { Arrival, Elimination } from './Arrival'
import {
  LEGS,
  placeOf,
  PLACE_POINTS,
  PLAYER,
  playLeg,
  POINTS_PER_LEG_WHEN_OUT,
  START_TEAMS,
  STOPS,
  type LegResult,
  type Transport,
} from './logic'
import { Notebook } from './Notebook'
import { Postcard } from './Postcard'
import { play, sfx } from './sfx'
import { StopScene, type Mood } from './StopScene'
import { TeamFigure } from './Team'

type Phase = 'lobby' | 'choose' | 'travel' | 'event' | 'arrive' | 'elimination'
type Pending = LegResult & { transport: Transport }

const SECONDS_PER_HOUR = 0.2

function celebrate(colors: string[]) {
  for (const [n, x] of [0.25, 0.5, 0.75].entries()) {
    setTimeout(() => confetti({ particleCount: 80, spread: 360, startVelocity: 30, origin: { x, y: 0.3 }, colors, disableForReducedMotion: true }), n * 400)
  }
}

function Jar({ money }: { money: number }) {
  return (
    <span className="ex-jar" data-testid="money" data-value={money} aria-label={`Kasa: $${money}`}>
      <svg viewBox="0 0 30 36" aria-hidden>
        <rect x="6" y="2" width="18" height="5" rx="2" fill="#b8892e" />
        <path d="M4 9 H26 V30 Q26 34 22 34 H8 Q4 34 4 30 Z" fill="rgb(220 240 255 / 0.5)" stroke="#fff" strokeWidth="1.5" />
        {Array.from({ length: Math.min(money, 7) }, (_, i) => (
          <motion.ellipse key={i} cx={15 + ((i % 2) * 2 - 1) * 2} cy={31 - i * 3} rx="7" ry="2.4" fill="#ffd34d" stroke="#b8892e" initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} />
        ))}
      </svg>
      <b>${money}</b>
    </span>
  )
}

function Clock({ hours }: { hours: number }) {
  return (
    <span className="ex-clock" data-testid="hours" data-value={hours}>
      <svg viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="17" fill="#fff8e6" stroke="#6a4a2a" strokeWidth="3" />
        <g className="ex-clock-hand" style={{ transform: `rotate(${hours * 30}deg)` }}>
          <path d="M20 20 V8" stroke="#d8323a" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="20" cy="20" r="2.5" fill="#6a4a2a" />
      </svg>
      <b>{hours} h</b>
    </span>
  )
}

export default function ExpressZaDolaraGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [teams, setTeams] = useState(START_TEAMS)
  const [leg, setLeg] = useState(0)
  const [money, setMoney] = useState(1)
  const [amulet, setAmulet] = useState(false)
  const [pending, setPending] = useState<Pending | null>(null)
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [finished, setFinished] = useState(false)
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const player = teams[PLAYER]
  const moving = pending !== null
  const shownTeams = pending ? pending.teams.map((t, i) => ({ ...t, alive: teams[i].alive })) : teams
  const shownMoney = pending && phase !== 'travel' && phase !== 'event' ? pending.money : money
  const shownAmulet = pending && phase !== 'travel' ? pending.amulet || pending.saved : amulet
  const legsDone = leg + 1
  const place = player.alive ? placeOf(teams, PLAYER) : null

  function start() {
    setTeams(START_TEAMS)
    setLeg(0)
    setMoney(1)
    setAmulet(false)
    setPending(null)
    setFinished(false)
    setPhase('choose')
  }

  function enter() {
    sfx.unlock()
    play('stamp')
    start()
  }

  function choose(transport: Transport) {
    const result = playLeg({ teams, leg, money, amulet }, transport, Math.random)
    setPending({ ...result, transport })
    setPhase('travel')
    play(transport === 'bus' ? 'horn' : transport === 'autostop' ? 'thumb' : 'coins')
    play(leg === 2 ? 'street' : 'jungle')
    play('tick')
    const travelMs = (Math.max(...result.legHours) * SECONDS_PER_HOUR * 1000 + 700) * pace
    setTimeout(() => {
      if (result.event) {
        setPhase('event')
        play('flip')
      } else arrive()
    }, travelMs)
  }

  function arrive() {
    setPhase('arrive')
    play('stamp')
    setTimeout(() => play('coins'), 500 * pace)
  }

  function afterArrival() {
    if (!pending) return
    if (pending.eliminated === null && !pending.saved) return commit()
    setPhase('elimination')
    setEnvelopeOpen(false)
    setTimeout(() => play('envelope'), 400 * pace)
    setTimeout(() => {
      setEnvelopeOpen(true)
      play(pending.eliminated === PLAYER ? 'bad' : 'good')
      if (pending.saved) celebrate(['#ffd34d', '#2f6fd8', '#fff'])
    }, 1600 * pace)
  }

  function commit() {
    if (!pending) return
    setTeams(pending.teams)
    setMoney(pending.money)
    setAmulet(pending.amulet)
    setLeg(legsDone)
    setPending(null)
    if (!pending.teams[PLAYER].alive || legsDone === LEGS) {
      setFinished(true)
      if (pending.teams[PLAYER].alive) {
        play('good')
        celebrate(['#ffd34d', '#ff5c8a', '#5fe0ea', '#fff'])
      }
      return
    }
    setPhase('choose')
  }

  function backdropMood(): Mood {
    if (finished) return 'result'
    if (phase === 'lobby') return 'idle'
    if (phase === 'arrive' && legsDone === LEGS) return 'finish'
    if (phase === 'arrive') return 'choose'
    return phase
  }

  const stop = finished || !moving ? leg : leg + 1
  const arriveLabel = pending && (pending.eliminated !== null || pending.saved) ? 'Otwórz kopertę' : legsDone === LEGS ? 'Wynik' : 'Dalej'

  return (
    <MotionConfig reducedMotion="user">
      <StopScene stop={stop} mood={backdropMood()} transport={pending?.transport ?? null} won={place !== null} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div className="ex-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="ex-hand text-3xl text-amber-200">Bali → Singapur · dolar dziennie</p>
          <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">Express za dolara</h2>
          <p className="text-white/90">
            Trzy drużyny, pięć etapów i plecak. Na każdym etapie wybieracie autostop, pracę za przejazd albo płatny bus. Po etapach 2 i 4 najwolniejsza drużyna odpada,
            a na trasie czekają niespodzianki.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enter} data-testid="start">
            Ruszamy w drogę
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && !finished && (
        <div className="flex flex-col gap-4">
          <header className="ex-bar" data-testid="bar">
            <strong className="ex-bar-title">
              <span>
                Etap <span data-testid="leg">{legsDone}</span>/{LEGS}
              </span>
              <em>
                {STOPS[leg].name} → {STOPS[legsDone].name}
              </em>
            </strong>
            <div className="ex-bar-stats">
              <Jar money={shownMoney} />
              <span className="ex-amulet" data-testid="amulet" data-has={shownAmulet} data-glow={phase === 'elimination' && envelopeOpen && pending?.saved} aria-label={shownAmulet ? 'Macie amulet' : 'Bez amuletu'}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="9" fill="#2f6fd8" stroke="#ffd34d" strokeWidth="2.5" />
                  <circle cx="12" cy="12" r="4" fill="#fff" />
                  <circle cx="12" cy="12" r="2" fill="#1a2a5a" />
                </svg>
              </span>
              <Clock hours={shownTeams[PLAYER].hours} />
            </div>
          </header>

          {(phase === 'choose' || phase === 'travel') && (
            <Notebook
              teams={shownTeams}
              positions={shownTeams.map(() => (moving ? legsDone : leg))}
              durations={shownTeams.map((_, i) => (pending ? pending.legHours[i] * SECONDS_PER_HOUR * pace : 0))}
              reached={moving ? legsDone : leg}
              leg={leg}
              money={money}
              choosing={phase === 'choose'}
              onChoose={choose}
            />
          )}

          <AnimatePresence>
            {phase === 'event' && pending?.event && <Postcard key="postcard" event={pending.event} onNext={arrive} />}
          </AnimatePresence>

          {phase === 'arrive' && pending && (
            <Arrival stop={STOPS[legsDone].name} day={legsDone} teams={shownTeams} legHours={pending.legHours} nextLabel={arriveLabel} onNext={afterArrival} />
          )}

          {phase === 'elimination' && pending && (
            <Elimination
              teams={shownTeams}
              eliminated={pending.eliminated}
              saved={pending.saved}
              open={envelopeOpen}
              nextLabel={pending.eliminated === PLAYER ? 'Wynik' : 'Dalej'}
              onNext={commit}
            />
          )}
        </div>
      )}

      {finished && (
        <ResultScreen
          slug="express-za-dolara"
          score={place ? PLACE_POINTS[place - 1] : leg * POINTS_PER_LEG_WHEN_OUT}
          maxScore={PLACE_POINTS[0]}
          summary={place ? `Singapur! Zajmujecie ${place}. miejsce z czasem ${player.hours} h.` : `Wyprawa skończyła się w: ${STOPS[leg].name}.`}
          shareLine={STOPS.slice(0, leg + 1).map(() => '🟧').join('') + (place === 1 ? '🏆' : '')}
          onRestart={start}
        >
          <div className="ex-podium">
            {place ? (
              teams
                .map((team, i) => ({ team, i }))
                .filter(({ team }) => team.alive)
                .sort((a, b) => a.team.hours - b.team.hours)
                .map(({ team, i }) => (
                  <div key={team.name} className="ex-podium-step" data-place={placeOf(teams, i)}>
                    <TeamFigure team={team.name} mood={i === PLAYER ? 'cheer' : 'happy'} className="ex-podium-face" />
                    <b>{placeOf(teams, i)}</b>
                  </div>
                ))
            ) : (
              <TeamFigure team="Wy" mood="out" className="ex-podium-face" />
            )}
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/70">Dźwięki: Kenney (CC0) · Postacie są fikcyjne</p>
    </MotionConfig>
  )
}
