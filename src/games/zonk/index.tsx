import { motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pickN, pickOne, randomInt, shuffle } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { loadJSON, saveJSON } from '@/shared/storage'
import data from './data.json'
import { addMontyResult, hostOpens, remainingDoor, type MontyStats } from './logic'

const ROUNDS = 5
const MONTY_KEY = 'slop-games:zonk:monty'
const EMPTY_MONTY: MontyStats = { switchPlays: 0, switchWins: 0, stayPlays: 0, stayWins: 0 }

type Item = { name: string; emoji: string; value?: number }

type Round = {
  doors: Item[]
  prizeDoor: number
  cashOffer: number
  picked: number | null
  opened: number | null
  final: number | 'cash' | null
}

function newRound(): Round {
  const prize = pickOne(data.prizes)
  const zonks = pickN(data.zonks, 2)
  const doors = shuffle([prize, ...zonks])
  return {
    doors,
    prizeDoor: doors.indexOf(prize),
    cashOffer: randomInt(Math.random, 2, 16) * 500,
    picked: null,
    opened: null,
    final: null,
  }
}

const formatZl = (value: number) => `${value.toLocaleString('pl-PL')} zł`

export default function ZonkGame() {
  const [roundNumber, setRoundNumber] = useState(1)
  const [round, setRound] = useState(newRound)
  const [total, setTotal] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [monty, setMonty] = useState(() => loadJSON(MONTY_KEY, EMPTY_MONTY))
  const [finished, setFinished] = useState(false)

  function pickDoor(door: number) {
    setRound({ ...round, picked: door, opened: hostOpens(round.prizeDoor, door, Math.random) })
  }

  function decide(choice: 'stay' | 'switch' | 'cash') {
    const picked = round.picked!
    const opened = round.opened!
    if (choice === 'cash') {
      setRound({ ...round, final: 'cash' })
      setTotal(total + round.cashOffer)
      setLog([...log, `Runda ${roundNumber}: gotówka ${formatZl(round.cashOffer)}`])
      return
    }
    const final = choice === 'switch' ? remainingDoor(picked, opened) : picked
    const won = final === round.prizeDoor
    const item = round.doors[final]
    const updatedMonty = addMontyResult(monty, choice === 'switch', won)
    saveJSON(MONTY_KEY, updatedMonty)
    setMonty(updatedMonty)
    setRound({ ...round, final })
    if (won) setTotal(total + (item.value ?? 0))
    setLog([...log, `Runda ${roundNumber}: ${item.emoji} ${item.name}${won ? ` (${formatZl(item.value ?? 0)})` : ' – ZONK!'}`])
  }

  function nextRound() {
    if (roundNumber === ROUNDS) {
      setFinished(true)
      return
    }
    setRoundNumber(roundNumber + 1)
    setRound(newRound())
  }

  function restart() {
    setRoundNumber(1)
    setRound(newRound())
    setTotal(0)
    setLog([])
    setFinished(false)
  }

  const percent = (wins: number, plays: number) => (plays === 0 ? '–' : `${Math.round((wins / plays) * 100)}%`)

  if (finished) {
    return (
      <ResultScreen
        slug="zonk"
        score={total}
        summary={
          <ul className="space-y-1 text-left text-sm">
            {log.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        }
        onRestart={restart}
      >
        <p className="max-w-md text-sm text-muted-foreground">
          Twoje statystyki: zamiana wygrała {percent(monty.switchWins, monty.switchPlays)} razy, zostanie przy
          swoim {percent(monty.stayWins, monty.stayPlays)}. Teoretycznie zamiana wygrywa w 2/3 przypadków, bo
          prowadzący zawsze otwiera bramkę z zonkiem – to paradoks Monty’ego Halla.
        </p>
      </ResultScreen>
    )
  }

  const revealAll = round.final !== null
  return (
    <>
      <Hud items={[['Runda', `${roundNumber}/${ROUNDS}`], ['Wygrane', formatZl(total)]]} />
      <Card>
        <CardContent className="flex flex-col gap-6">
          <p className="text-center text-lg font-medium">
            {round.picked === null && 'Wybierz bramkę! Za jedną z nich czeka nagroda.'}
            {round.picked !== null && !revealAll && (
              <>
                Prowadzący otwiera bramkę nr {round.opened! + 1}… a tam {round.doors[round.opened!].emoji}{' '}
                {round.doors[round.opened!].name}! Zostajesz przy nr {round.picked + 1}, zamieniasz czy bierzesz{' '}
                {formatZl(round.cashOffer)}?
              </>
            )}
            {round.final === 'cash' && `Bierzesz gotówkę: ${formatZl(round.cashOffer)}. Zobacz, co cię ominęło.`}
            {typeof round.final === 'number' &&
              (round.final === round.prizeDoor
                ? `Brawo! Wygrywasz: ${round.doors[round.final].name}!`
                : 'ZONK! 🙈')}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {round.doors.map((item, door) => {
              const isOpen = revealAll || door === round.opened
              const isChosen = door === round.picked || door === round.final
              return (
                <motion.button
                  key={door}
                  data-testid={`door-${door}`}
                  disabled={round.picked !== null}
                  onClick={() => pickDoor(door)}
                  animate={{ rotateY: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex aspect-[3/4] flex-col items-center justify-center rounded-xl border-4 p-2 text-center ${
                    isChosen ? 'border-amber-400' : 'border-transparent'
                  } ${isOpen ? 'bg-amber-50' : 'bg-gradient-to-b from-sky-500 to-indigo-700 text-white'}`}
                >
                  <span style={{ transform: isOpen ? 'rotateY(180deg)' : undefined }} className="flex flex-col items-center">
                    {isOpen ? (
                      <>
                        <span className="text-5xl">{item.emoji}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                      </>
                    ) : (
                      <span className="text-5xl font-black">{door + 1}</span>
                    )}
                  </span>
                </motion.button>
              )
            })}
          </div>
          {round.picked !== null && !revealAll && (
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => decide('stay')}>
                Zostaję przy nr {round.picked + 1}
              </Button>
              <Button onClick={() => decide('switch')}>Zamieniam</Button>
              <Button variant="secondary" onClick={() => decide('cash')}>
                Biorę {formatZl(round.cashOffer)}
              </Button>
            </div>
          )}
          {revealAll && (
            <Button className="self-center" onClick={nextRound}>
              {roundNumber === ROUNDS ? 'Podsumowanie' : 'Następna runda'}
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  )
}
