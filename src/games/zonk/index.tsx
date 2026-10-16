import '@fontsource/bebas-neue'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { pickN, pickOne, randomInt, shuffle } from '@/shared/daily'
import { Hud, MuteButton, ResultScreen } from '@/shared/GameShell'
import { loadJSON, saveJSON } from '@/shared/storage'
import { CashOffer, type Choice } from './CashOffer'
import data from './data.json'
import { Gate, type Item } from './Gate'
import { Host } from './Host'
import { addMontyResult, formatZl, hostOpens, remainingDoor, type MontyStats } from './logic'
import { play, sfx } from './sfx'
import { StudioBackdrop, type Mood } from './StudioBackdrop'

const ROUNDS = 5
const MONTY_KEY = 'tvn-games:zonk:monty'
const EMPTY_MONTY: MontyStats = { switchPlays: 0, switchWins: 0, stayPlays: 0, stayWins: 0 }
const PRIZES: Item[] = data.prizes
const ZONKS: Item[] = data.zonks
const ALL_DOORS = [0, 1, 2]

type Phase = 'lobby' | 'pick' | 'hostOpen' | 'decide' | 'reveal' | 'roundEnd' | 'result'
type Outcome = 'prize' | 'zonk' | 'cash'

type Round = {
  doors: Item[]
  prizeDoor: number
  cashOffer: number
  picked: number | null
  opened: number | null
  final: number | null
  revealed: number[]
  outcome: Outcome | null
}

function newRound(): Round {
  const prize = pickOne(PRIZES)
  const doors = shuffle([prize, ...pickN(ZONKS, 2)])
  return {
    doors,
    prizeDoor: doors.indexOf(prize),
    cashOffer: randomInt(Math.random, 2, 16) * 500,
    picked: null,
    opened: null,
    final: null,
    revealed: [],
    outcome: null,
  }
}

function hostLine(kind: keyof typeof data.host, vars: Record<string, string | number> = {}) {
  return pickOne(data.host[kind]).replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key]))
}

function moodFor(phase: Phase, outcome: Outcome | null): Mood {
  switch (phase) {
    case 'lobby':
      return 'idle'
    case 'pick':
    case 'decide':
      return 'pick'
    case 'hostOpen':
      return 'tension'
    case 'reveal':
      return outcome ?? 'tension'
    case 'roundEnd':
      return outcome ?? 'idle'
    case 'result':
      return 'result'
  }
}

export default function ZonkGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [roundNumber, setRoundNumber] = useState(1)
  const [round, setRound] = useState(newRound)
  const [total, setTotal] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [monty, setMonty] = useState(() => loadJSON(MONTY_KEY, EMPTY_MONTY))
  const [line, setLine] = useState({ id: 0, text: hostLine('intro') })
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reducedMotion = useReducedMotion()
  const drumroll = reducedMotion ? 0.4 : 1.4

  function say(text: string) {
    setLine((current) => ({ id: current.id + 1, text }))
  }

  function revealAll(delayMs: number) {
    setTimeout(() => {
      play('curtain')
      setRound((r) => ({ ...r, revealed: ALL_DOORS }))
      setPhase('roundEnd')
    }, delayMs)
  }

  function enterStudio() {
    sfx.unlock()
    play('applause')
    setPhase('pick')
  }

  function pickDoor(door: number) {
    const opened = hostOpens(round.prizeDoor, door, Math.random)
    play('select')
    play('drumroll', drumroll)
    setRound({ ...round, picked: door, opened })
    setPhase('hostOpen')
    say(hostLine('opens', { picked: door + 1, door: opened + 1 }))
    setTimeout(() => {
      play('curtain')
      setTimeout(() => play('oops'), 400)
      setRound((r) => ({ ...r, revealed: [opened] }))
      setPhase('decide')
      say(hostLine('offer', { door: opened + 1, item: round.doors[opened].name, picked: door + 1 }))
    }, drumroll * 1000)
  }

  function decide(choice: Choice) {
    const picked = round.picked!
    const opened = round.opened!
    setPhase('reveal')

    if (choice === 'cash') {
      play('cash')
      confetti({
        particleCount: 40,
        spread: 100,
        startVelocity: 35,
        gravity: 0.6,
        scalar: 2,
        shapes: [confetti.shapeFromText({ text: '💵', scalar: 2 })],
        origin: { y: 0.6 },
        disableForReducedMotion: true,
      })
      setTotal(total + round.cashOffer)
      setLog([...log, `Runda ${roundNumber}: koperta ${formatZl(round.cashOffer)}`])
      setRound({ ...round, outcome: 'cash' })
      say(hostLine('cash'))
      revealAll(1200)
      return
    }

    const final = choice === 'switch' ? remainingDoor(picked, opened) : picked
    const won = final === round.prizeDoor
    const item = round.doors[final]
    const updatedMonty = addMontyResult(monty, choice === 'switch', won)
    saveJSON(MONTY_KEY, updatedMonty)
    setMonty(updatedMonty)
    setLog([...log, `Runda ${roundNumber}: ${item.name}${won ? ` (${formatZl(item.value ?? 0)})` : ' – ZONK!'}`])
    setRound({ ...round, final })
    say(hostLine('reveal', { door: final + 1 }))
    play('drumroll', drumroll)

    setTimeout(() => {
      play('curtain')
      setRound((r) => ({ ...r, revealed: [opened, final], outcome: won ? 'prize' : 'zonk' }))
      say(hostLine(won ? 'prize' : 'zonk', { item: item.name }))
      if (won) {
        setTotal((t) => t + (item.value ?? 0))
        play('fanfare')
        setTimeout(() => play('applause'), 300)
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.45 }, colors: ['#ffd84d', '#fff4c9', '#ff4fd8'], disableForReducedMotion: true })
      } else {
        setTimeout(() => play('trombone'), 350)
        if (!reducedMotion) void animate(scope.current, { x: [0, -12, 10, -7, 4, 0] }, { duration: 0.45 })
      }
      revealAll(1400)
    }, drumroll * 1000)
  }

  function nextRound() {
    if (roundNumber === ROUNDS) {
      setPhase('result')
      return
    }
    play('intro')
    setRoundNumber(roundNumber + 1)
    setRound(newRound())
    say(hostLine('intro'))
    setPhase('pick')
  }

  function restart() {
    setRoundNumber(1)
    setRound(newRound())
    setTotal(0)
    setLog([])
    say(hostLine('intro'))
    setPhase('pick')
  }

  const percent = (wins: number, plays: number) => (plays === 0 ? '–' : `${Math.round((wins / plays) * 100)}%`)
  const focusDoor = phase === 'hostOpen' ? round.opened : phase === 'reveal' && !round.outcome ? round.final : null
  const mood = moodFor(phase, round.outcome)

  return (
    <MotionConfig reducedMotion="user">
      <StudioBackdrop mood={mood} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div
          className="flex min-h-[60svh] flex-col items-center justify-center gap-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="zk-chroma font-mono text-sm tracking-[0.3em] text-amber-200">▶ STUDIO 1 · NA ŻYWO</p>
          <h2 className="zk-chroma font-display text-8xl tracking-wider text-white sm:text-9xl">Zonk!</h2>
          <p className="max-w-md text-white/75">
            Trzy bramki, jedna nagroda i dwa absurdalne zonki. Prowadzący zawsze odsłoni jednego zonka. Zostajesz przy swojej bramce, zamieniasz
            czy bierzesz kopertę z gotówką? Pięć rund.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enterStudio} data-testid="enter-studio">
            Wchodzę do studia
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && phase !== 'result' && (
        <div className="flex flex-col gap-6">
          <Hud items={[['Runda', `${roundNumber}/${ROUNDS}`], ['Wygrane', formatZl(total)]]} />
          <Host key={line.id} line={line.text} />
          <div
            ref={scope}
            className="zk-gates mx-auto grid w-full max-w-2xl grid-cols-3 gap-2.5 pt-4 sm:gap-6"
            data-mood={mood}
            data-focus={focusDoor !== null || undefined}
          >
            {round.doors.map((item, door) => (
              <Gate
                key={`${roundNumber}-${door}`}
                index={door}
                item={item}
                picked={door === (round.final ?? round.picked)}
                open={round.revealed.includes(door)}
                focus={door === focusDoor}
                disabled={phase !== 'pick'}
                onPick={() => pickDoor(door)}
              />
            ))}
          </div>

          <div className="flex min-h-[140px] flex-col items-center gap-4 pt-2">
            {phase === 'pick' && <p className="zk-chroma font-display text-2xl tracking-wider text-amber-100">Wybierz bramkę!</p>}
            {phase === 'decide' && round.picked !== null && round.opened !== null && (
              <CashOffer picked={round.picked} switchTo={remainingDoor(round.picked, round.opened)} cash={round.cashOffer} onDecide={decide} />
            )}
            {phase === 'roundEnd' && (
              <>
                <Button size="lg" className="h-12 px-8 font-display text-xl tracking-widest" onClick={nextRound} data-testid="next-round">
                  {roundNumber === ROUNDS ? 'Podsumowanie' : 'Następna runda'}
                </Button>
                <p className="max-w-2xl text-center text-[11px] text-white/50" data-testid="photo-credits">
                  Fot.:{' '}
                  {round.doors.map((item, door) => (
                    <span key={item.id}>
                      {door > 0 && ' · '}
                      <a href={item.photo.source} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                        {item.photo.author}, {item.photo.license}
                      </a>
                    </span>
                  ))}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen
          slug="zonk"
          score={total}
          summary={
            <ul className="space-y-1 text-left text-sm">
              {log.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          }
          onRestart={restart}
        >
          <p className="max-w-md text-sm text-muted-foreground">
            Twoje statystyki: zamiana wygrała {percent(monty.switchWins, monty.switchPlays)} razy, zostanie przy swoim{' '}
            {percent(monty.stayWins, monty.stayPlays)}. Teoretycznie zamiana wygrywa w 2/3 przypadków, bo prowadzący zawsze otwiera bramkę z zonkiem
            – to paradoks Monty’ego Halla.
          </p>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/40">
        Dźwięki: Kenney (CC0) · Zdjęcia: Flickr i Wikimedia Commons, autorzy i licencje przy zdjęciach
      </p>
    </MotionConfig>
  )
}
