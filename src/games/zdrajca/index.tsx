import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { CastleBackdrop, type Mood } from './CastleBackdrop'
import { CastlePlan, Statements } from './CastlePlan'
import {
  alibiText,
  banish,
  botVotes,
  createCastle,
  gameStatus,
  gendered,
  nightVictim,
  PENALTY_PER_LOYAL,
  planDay,
  PLAYER,
  POINTS_PER_TRAITOR,
  type Day,
  type Resident,
} from './logic'
import { ResidentFigure } from './Resident'
import { RoundTable, type Verdict } from './RoundTable'
import { play, sfx } from './sfx'

type Phase = 'lobby' | 'day' | 'table' | 'reveal' | 'verdict' | 'night'

const FIRST_NEWS = 'Pierwszy wieczór w zamku. Wśród was są dwaj zdrajcy, którzy spędzili popołudnie w Wieży.'
const NIGHT_MS = 2500

function newGame() {
  const residents = createCastle(Math.random)
  return { residents, day: planDay(residents, Math.random) }
}

function sparks() {
  confetti({ particleCount: 70, spread: 100, startVelocity: 28, gravity: 0.8, scalar: 0.7, origin: { x: 0.5, y: 0.45 }, colors: ['#ffd34d', '#d9a62e', '#fff3c4'], disableForReducedMotion: true })
}

function Seal({ day }: { day: number }) {
  return (
    <span className="zd-seal" aria-hidden>
      {[-1, 1].map((side) => (
        <motion.svg
          key={`${day}-${side}`}
          viewBox="0 0 60 60"
          initial={{ x: 0, rotate: 0, opacity: 1 }}
          animate={{ x: side * 18, y: 10, rotate: side * 25, opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <clipPath id={`zd-seal-${side}`}>
            <rect x={side < 0 ? 0 : 30} width="30" height="60" />
          </clipPath>
          <g clipPath={`url(#zd-seal-${side})`}>
            <circle cx="30" cy="30" r="26" fill="#9a1c24" />
            <circle cx="30" cy="30" r="18" fill="none" stroke="#c23a42" strokeWidth="3" />
            <path d="M30 16 L34 28 L46 30 L34 32 L30 44 L26 32 L14 30 L26 28 Z" fill="#c23a42" />
          </g>
        </motion.svg>
      ))}
    </span>
  )
}

export default function ZdrajcaGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [{ residents, day }, setState] = useState<{ residents: Resident[]; day: Day }>(newGame)
  const [dayNumber, setDayNumber] = useState(1)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [revealed, setRevealed] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [morningNews, setMorningNews] = useState(FIRST_NEWS)
  const [banishedRoles, setBanishedRoles] = useState<Resident['role'][]>([])
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const status = gameStatus(residents)
  const finished = status !== 'ongoing' && phase === 'day'
  const caught = banishedRoles.filter((r) => r === 'zdrajca').length
  const wrong = banishedRoles.filter((r) => r === 'lojalny').length
  const score = Math.max(0, caught * POINTS_PER_TRAITOR - wrong * PENALTY_PER_LOYAL)
  const aliveCount = residents.filter((r) => r.alive).length
  const myCompanions = residents.flatMap((r, i) => (i !== PLAYER && r.alive && day.actual[i] === day.actual[PLAYER] ? [r.name] : []))
  const traitors = residents.filter((r) => r.role === 'zdrajca')

  function openMorning() {
    setPhase('day')
    play('seal')
  }

  function enterCastle() {
    sfx.unlock()
    play('door')
    openMorning()
  }

  function restart() {
    setState(newGame())
    setDayNumber(1)
    setVerdict(null)
    setSelected(null)
    setMorningNews('Nowa gra. Wśród was znów są dwaj zdrajcy.')
    setBanishedRoles([])
    openMorning()
  }

  function select(index: number) {
    setSelected(index)
    play('token')
  }

  function toTable() {
    setSelected(null)
    setPhase('table')
    play('crackle')
  }

  function vote(target: number) {
    const votes = [{ voter: PLAYER, target }, ...botVotes(residents, day, Math.random)]
    const banished = banish(votes, Math.random)
    const role = residents[banished].role
    setVerdict({ votes, banished })
    setRevealed(0)
    setPhase('reveal')
    play('heartbeat')
    const start = 900 * pace
    const step = 450 * pace
    votes.forEach((_, n) =>
      setTimeout(() => {
        setRevealed(n + 1)
        play('chalk')
      }, start + n * step),
    )
    setTimeout(
      () => {
        setPhase('verdict')
        play('gong')
        setTimeout(() => {
          play(role === 'zdrajca' ? 'good' : 'bad')
          if (role === 'zdrajca') sparks()
        }, 600 * pace)
      },
      start + votes.length * step + 500 * pace,
    )
    setBanishedRoles([...banishedRoles, role])
    setState({ day, residents: residents.map((r, i) => (i === banished ? { ...r, alive: false } : r)) })
  }

  function nextFromVerdict() {
    if (status !== 'ongoing') {
      if (status === 'win') sparks()
      setVerdict(null)
      setPhase('day')
      return
    }
    setPhase('night')
    play('wind')
    for (const n of [0, 1, 2]) setTimeout(() => play('snuff'), (300 + n * 600) * pace)
    setTimeout(() => play('heartbeat'), 1500 * pace)
    setTimeout(() => {
      const victim = nightVictim(residents, Math.random)
      const next = residents.map((r, i) => (i === victim ? { ...r, alive: false } : r))
      setState({ residents: next, day: planDay(next, Math.random) })
      setMorningNews(
        victim === null
          ? 'Noc minęła spokojnie.'
          : `Rano okazuje się, że ${residents[victim].name} ${gendered(residents[victim].name, 'został zamordowany', 'została zamordowana')} przez zdrajców.`,
      )
      setDayNumber(dayNumber + 1)
      setVerdict(null)
      openMorning()
    }, NIGHT_MS * pace)
  }

  function backdropMood(): Mood {
    if (finished) return 'result'
    if (phase === 'lobby') return 'idle'
    if (phase === 'day') return 'morning'
    if (phase === 'reveal') return 'reveal'
    if (phase === 'verdict' && verdict) return residents[verdict.banished].role === 'zdrajca' ? 'traitor' : 'loyal'
    return phase === 'night' ? 'night' : 'table'
  }

  return (
    <MotionConfig reducedMotion="user">
      <CastleBackdrop mood={backdropMood()} won={status === 'win'} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div className="zd-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="zd-hand text-3xl text-amber-200">Szkocki zamek · noc pierwsza</p>
          <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">Zdrajca</h2>
          <p className="text-white/90">
            Ośmioro gości, dwóch zdrajców. Każdego dnia goście mówią, gdzie byli i z kim. Zdrajcy siedzieli w zamkniętej Wieży, więc kłamią. Porównaj zeznania na
            planie zamku z tym, co sam widziałeś, i wygnaj zdrajców przy okrągłym stole. Nocą zdrajcy mordują.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enterCastle} data-testid="enter-castle">
            Wchodzę do zamku
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && !finished && (
        <div className="flex flex-col gap-4">
          <header className="zd-bar" data-testid="bar">
            <strong className="zd-bar-title">
              Zamek · Dzień <span data-testid="day">{dayNumber}</span>
            </strong>
            <div className="zd-bar-stats">
              <span>
                Żywi <b data-testid="alive">{aliveCount}</b>
              </span>
              <span>
                Złapani zdrajcy <b data-testid="caught">{caught}/2</b>
              </span>
            </div>
          </header>

          {phase === 'day' && (
            <>
              <motion.article key={dayNumber} className="zd-letter" data-testid="morning-letter" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                <Seal day={dayNumber} />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  <p className="zd-letter-kicker">Poranny list · Dzień {dayNumber}</p>
                  <p className="zd-letter-news" data-testid="morning-news">
                    {morningNews}
                  </p>
                  <p className="zd-alibi zd-hand" data-testid="my-alibi">
                    {alibiText(day.actual[PLAYER], myCompanions)}
                  </p>
                </motion.div>
              </motion.article>
              <p className="zd-hint">Złote linie: kogo widziałeś na własne oczy. Kliknij żeton, żeby zobaczyć zeznanie.</p>
              <CastlePlan residents={residents} day={day} selected={selected} onSelect={select} />
              <Statements residents={residents} day={day} selected={selected} onSelect={select} />
              <div className="zd-dock">
                <button type="button" className="zd-main" onClick={toTable} data-testid="to-table">
                  Do okrągłego stołu
                </button>
              </div>
            </>
          )}

          {(phase === 'table' || phase === 'reveal' || phase === 'verdict') && (
            <RoundTable
              residents={residents}
              step={phase}
              verdict={verdict}
              revealed={revealed}
              nextLabel={status === 'ongoing' ? 'Zapada noc…' : 'Wynik'}
              onVote={vote}
              onNext={nextFromVerdict}
            />
          )}

          <AnimatePresence>
            {phase === 'night' && (
              <motion.p className="zd-night-text zd-hand" data-testid="night" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Zapada noc. Świece gasną jedna po drugiej…
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {finished && (
        <ResultScreen
          slug="zdrajca"
          score={score}
          maxScore={2 * POINTS_PER_TRAITOR}
          summary={
            status === 'win'
              ? `Wszyscy zdrajcy wygnani w ${dayNumber} ${dayNumber === 1 ? 'dzień' : 'dni'}! Niewinnie wygnanych: ${wrong}.`
              : residents[PLAYER].alive
                ? `${morningNews} Zdrajcy przejęli zamek.`
                : 'Zamek wygnał właśnie ciebie. Zdrajcy dziękują za współpracę.'
          }
          shareLine={banishedRoles.map((r) => (r === 'zdrajca' ? '🗡️' : '😇')).join('')}
          onRestart={restart}
        >
          <div className="zd-finale">
            {residents[PLAYER].alive ? (
              traitors.map((r) => <ResidentFigure key={r.name} name={r.name} mood="sly" hooded className="zd-finale-face" />)
            ) : (
              <ResidentFigure name="Ty" mood="out" className="zd-finale-face" />
            )}
          </div>
          <p className="text-sm">Zdrajcy: {traitors.map((r) => r.name).join(', ')}</p>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/70">Dźwięki: Kenney (CC0) · Postacie są fikcyjne</p>
    </MotionConfig>
  )
}
