import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { matchesAnswer } from '@/shared/answer'
import { dailyRng, shuffle } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import categories from './data.json'
import { challengeable, createBoard, SIZE, type Tile } from './logic'

const SLUG = 'podloga'
const DUEL_SECONDS = 20
const PASS_PENALTY = 3
const TOKEN_BONUS = 5
const WINS_FOR_TOKEN = 3

type Category = (typeof categories)[number]
type Item = Category['items'][number] & { flag?: string; emoji?: string }

const categoryById = (id: string) => categories.find((c) => c.id === id)!

function ItemView({ item }: { item: Item }) {
  if (item.flag) {
    return <img src={`https://flagcdn.com/w320/${item.flag}.png`} alt="flaga" className="h-32 rounded border object-contain shadow" />
  }
  return <span className="text-8xl leading-none">{item.emoji}</span>
}

function Duel({ tile, tokens, onUseToken, onEnd }: { tile: Tile; tokens: number; onUseToken: () => void; onEnd: (won: boolean) => void }) {
  const category = categoryById(tile.categoryId)
  const [deck] = useState(() => shuffle(category.items as Item[]))
  const [itemIndex, setItemIndex] = useState(0)
  const [turn, setTurn] = useState<'player' | 'bot'>('player')
  const [playerTime, setPlayerTime] = useState(DUEL_SECONDS)
  const [botTime, setBotTime] = useState(DUEL_SECONDS)
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('Zaczynasz! Wpisz nazwę i naciśnij Enter.')
  const item = deck[itemIndex % deck.length]
  const loser = playerTime <= 0 ? 'player' : botTime <= 0 ? 'bot' : null

  useEffect(() => {
    if (loser) return
    const id = setInterval(() => {
      if (turn === 'player') setPlayerTime((t) => Math.max(0, t - 0.1))
      else setBotTime((t) => Math.max(0, t - 0.1))
    }, 100)
    return () => clearInterval(id)
  }, [turn, loser])

  useEffect(() => {
    if (loser) onEnd(loser === 'bot')
  }, [loser, onEnd])

  useEffect(() => {
    if (turn !== 'bot' || loser) return
    const delay = 1000 + Math.random() * 3000
    const id = setTimeout(() => {
      const answer = item.answers[0]
      if (Math.random() < tile.skill) {
        setMessage(`${tile.botName}: „${answer}!”`)
        setTurn('player')
      } else {
        setMessage(`${tile.botName}: „Pas!” (to było: ${answer})`)
        setBotTime((t) => Math.max(0, t - PASS_PENALTY))
      }
      setItemIndex((i) => i + 1)
    }, delay)
    return () => clearTimeout(id)
  }, [turn, itemIndex, loser, item, tile])

  function submit(event: FormEvent) {
    event.preventDefault()
    if (turn !== 'player') return
    if (matchesAnswer(input, item.answers)) {
      setMessage(`Dobrze! ${tile.botName} odpowiada…`)
      setTurn('bot')
      setItemIndex((i) => i + 1)
    } else {
      setMessage('Nie! Próbuj dalej albo pasuj.')
    }
    setInput('')
  }

  function pass() {
    setMessage(`Pas! To było: ${item.answers[0]}`)
    setPlayerTime((t) => Math.max(0, t - PASS_PENALTY))
    setItemIndex((i) => i + 1)
  }

  const clock = (label: string, time: number, active: boolean) => (
    <div className={`flex-1 rounded-lg border-2 p-3 text-center ${active ? 'border-primary bg-primary/10' : 'opacity-60'}`}>
      <p className="text-sm">{label}</p>
      <p className="text-3xl font-black tabular-nums">{time.toFixed(1)} s</p>
    </div>
  )

  return (
    <Card data-testid="duel">
      <CardContent className="flex flex-col items-center gap-4">
        <p className="font-semibold">
          Pojedynek z {tile.botName} · kategoria: {category.emoji} {category.name}
        </p>
        <div className="flex w-full gap-3">
          {clock('Ty', playerTime, turn === 'player')}
          {clock(tile.botName, botTime, turn === 'bot')}
        </div>
        <div className="flex h-36 items-center justify-center" data-testid="duel-item">
          <ItemView item={item} />
        </div>
        <p className="min-h-6 text-sm text-muted-foreground">{message}</p>
        <form onSubmit={submit} className="flex w-full gap-2">
          <Input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={turn !== 'player'}
            placeholder={turn === 'player' ? 'Co to jest?' : 'Czekaj na rywala…'}
            aria-label="Odpowiedź"
          />
          <Button type="submit" disabled={turn !== 'player'}>
            OK
          </Button>
          <Button type="button" variant="outline" onClick={pass} disabled={turn !== 'player'}>
            Pas (−{PASS_PENALTY} s)
          </Button>
        </form>
        {tokens > 0 && (
          <Button
            variant="secondary"
            onClick={() => {
              onUseToken()
              setPlayerTime((t) => t + TOKEN_BONUS)
            }}
          >
            🪙 Złoty żeton: +{TOKEN_BONUS} s ({tokens})
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default function PodlogaGame() {
  const [board, setBoard] = useState(() => createBoard(categories.map((c) => c.id), dailyRng(SLUG)))
  const [duelIndex, setDuelIndex] = useState<number | null>(null)
  const [winStreak, setWinStreak] = useState(0)
  const [tokens, setTokens] = useState(0)
  const [lostTo, setLostTo] = useState<Tile | null>(null)
  const owned = board.filter((t) => t.owner === 'player').length
  const targets = challengeable(board)

  function restart() {
    setBoard(createBoard(categories.map((c) => c.id), dailyRng(SLUG)))
    setDuelIndex(null)
    setWinStreak(0)
    setTokens(0)
    setLostTo(null)
  }

  function endDuel(won: boolean) {
    if (duelIndex === null) return
    if (won) {
      setBoard(board.map((t, i) => (i === duelIndex ? { ...t, owner: 'player' } : t)))
      const streak = winStreak + 1
      setWinStreak(streak % WINS_FOR_TOKEN)
      if (streak === WINS_FOR_TOKEN) setTokens(tokens + 1)
    } else {
      setLostTo(board[duelIndex])
    }
    setDuelIndex(null)
  }

  if (lostTo || owned === board.length) {
    return (
      <ResultScreen
        slug={SLUG}
        score={owned}
        maxScore={board.length}
        summary={
          lostTo
            ? `Przegrałeś pojedynek z ${lostTo.botName} (${categoryById(lostTo.categoryId).name}). Zajęte pola: ${owned}.`
            : 'Cała podłoga jest twoja! 🏆'
        }
        shareLine={Array.from({ length: SIZE }, (_, r) =>
          board.slice(r * SIZE, r * SIZE + SIZE).map((t) => (t.owner === 'player' ? '🟦' : '⬜')).join(''),
        ).join('\n')}
        onRestart={restart}
      />
    )
  }

  if (duelIndex !== null) {
    return (
      <Duel
        key={duelIndex}
        tile={board[duelIndex]}
        tokens={tokens}
        onUseToken={() => setTokens(tokens - 1)}
        onEnd={endDuel}
      />
    )
  }

  return (
    <>
      <Hud items={[['Twoje pola', `${owned}/${board.length}`], ['Seria wygranych', winStreak], ['Złote żetony', tokens]]} />
      <p className="text-sm text-muted-foreground">
        Wybierz sąsiednie pole i wyzwij rywala na pojedynek w jego kategorii. Każdy ma {DUEL_SECONDS} s na zegarze szachowym.
        {` ${WINS_FOR_TOKEN}`} wygrane z rzędu dają złoty żeton (+{TOKEN_BONUS} s). Jedna porażka kończy grę.
      </p>
      <div className="grid grid-cols-5 gap-1.5">
        {board.map((tile, i) => {
          const isTarget = targets.includes(i)
          const category = tile.owner === 'bot' ? categoryById(tile.categoryId) : null
          return (
            <button
              key={i}
              data-testid={`tile-${i}`}
              data-challengeable={isTarget}
              disabled={!isTarget}
              onClick={() => setDuelIndex(i)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 text-xs transition ${
                tile.owner === 'player'
                  ? 'border-blue-600 bg-blue-500 text-white'
                  : isTarget
                    ? 'cursor-pointer border-amber-500 bg-amber-50 hover:scale-105'
                    : 'border-muted bg-muted/60 text-muted-foreground'
              }`}
            >
              <span className="text-2xl">{category ? category.emoji : '🙂'}</span>
              <span className="truncate">{tile.owner === 'player' ? 'Ty' : tile.botName}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
