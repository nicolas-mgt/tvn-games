import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { matchesAnswer } from '@/shared/answer'
import { shuffle } from '@/shared/daily'
import { categoryById } from './categories'
import { emojiImage, itemImage, PLAYER_COLOR, type Tile } from './logic'
import { play } from './sfx'
import type { Mood } from './StudioBackdrop'

const DUEL_SECONDS = 20
const PASS_PENALTY = 3
const DANGER_SECONDS = 5
const END_PAUSE_MS = 1600
export const TOKEN_BONUS = 5

type Side = 'player' | 'bot'
type Popup = { id: number; side: Side; text: string }

function Clock({ label, color, time, active, lost, popups, onPopupDone }: {
  label: string
  color: string
  time: number
  active: boolean
  lost: boolean
  popups: Popup[]
  onPopupDone: (id: number) => void
}) {
  const danger = active && time <= DANGER_SECONDS
  return (
    <div
      className={`relative rounded-xl border-2 bg-black/60 px-3 py-2 text-center backdrop-blur transition-all duration-300 ${
        active ? 'scale-[1.03]' : 'opacity-50'
      } ${lost ? 'opacity-25 grayscale' : ''}`}
      style={{ borderColor: active ? (danger ? '#ef4444' : color) : 'rgb(255 255 255 / 0.15)', boxShadow: active ? `0 0 28px ${danger ? '#ef4444' : color}` : 'none' }}
      data-testid={`clock-${label === 'Ty' ? 'player' : 'bot'}`}
    >
      <p className="font-display text-lg tracking-widest text-white/80">{label}</p>
      <motion.p
        className="led-text font-display text-5xl tabular-nums sm:text-7xl"
        style={{ color: danger ? '#f87171' : color }}
        animate={danger ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={danger ? { duration: 0.5, repeat: Infinity } : undefined}
      >
        {time.toFixed(1)}
      </motion.p>
      {popups.map((p) => (
        <motion.span
          key={p.id}
          className="led-text absolute inset-x-0 top-1/2 font-display text-4xl text-red-400"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.9 }}
          onAnimationComplete={() => onPopupDone(p.id)}
        >
          {p.text}
        </motion.span>
      ))}
    </div>
  )
}

type DuelProps = {
  tile: Tile
  tokens: number
  onUseToken: () => void
  onMood: (mood: Mood) => void
  onEnd: (won: boolean) => void
}

export function Duel({ tile, tokens, onUseToken, onMood, onEnd }: DuelProps) {
  const category = categoryById(tile.categoryId)
  const [deck] = useState(() => shuffle(category.items))
  const [itemIndex, setItemIndex] = useState(0)
  const [turn, setTurn] = useState<Side>('player')
  const [playerTime, setPlayerTime] = useState(DUEL_SECONDS)
  const [botTime, setBotTime] = useState(DUEL_SECONDS)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [bubble, setBubble] = useState<string | null>(null)
  const [hint, setHint] = useState('Zaczynasz! Wpisz, co widzisz, i naciśnij Enter.')
  const [popups, setPopups] = useState<Popup[]>([])
  const [flash, setFlash] = useState<{ key: number; color: string } | null>(null)
  const [cardScope, animateCard] = useAnimate()
  const item = deck[itemIndex % deck.length]
  const loser: Side | null = playerTime <= 0 ? 'player' : botTime <= 0 ? 'bot' : null
  const activeTime = turn === 'player' ? playerTime : botTime
  const activeSecond = Math.ceil(activeTime)

  useEffect(() => {
    if (loser) return
    const id = setInterval(() => {
      if (turn === 'player') setPlayerTime((t) => Math.max(0, t - 0.1))
      else setBotTime((t) => Math.max(0, t - 0.1))
    }, 100)
    return () => clearInterval(id)
  }, [turn, loser])

  useEffect(() => {
    if (!loser && activeSecond <= DANGER_SECONDS) play('tick')
  }, [activeSecond, loser])

  const callbacks = useRef({ onMood, onEnd })
  useEffect(() => {
    callbacks.current = { onMood, onEnd }
  })

  useEffect(() => {
    callbacks.current.onMood(!loser && activeSecond <= DANGER_SECONDS ? 'danger' : 'duel')
  }, [activeSecond, loser])

  useEffect(() => {
    if (!loser) return
    play('buzzer')
    const id = setTimeout(() => callbacks.current.onEnd(loser === 'bot'), END_PAUSE_MS)
    return () => clearTimeout(id)
  }, [loser])

  useEffect(() => {
    for (const ahead of [1, 2]) new Image().src = itemImage(deck[(itemIndex + ahead) % deck.length])
  }, [deck, itemIndex])

  useEffect(() => {
    if (turn !== 'bot' || loser) return
    const id = setTimeout(() => {
      const answer = item.answers[0]
      if (Math.random() < tile.skill) {
        setBubble(`${answer}!`)
        setFlash({ key: Date.now(), color: tile.color })
        play('correct')
        setTurn('player')
        setHint('Twoja kolej!')
      } else {
        setBubble('Pas!')
        addPopup('bot')
        play('pass')
        setBotTime((t) => Math.max(0, t - PASS_PENALTY))
      }
      setItemIndex((i) => i + 1)
    }, 1000 + Math.random() * 3000)
    return () => clearTimeout(id)
  }, [turn, itemIndex, loser, item, tile])

  function addPopup(side: Side) {
    setPopups((list) => [...list, { id: Date.now() + Math.random(), side, text: `−${PASS_PENALTY} s` }])
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (turn !== 'player' || loser) return
    if (matchesAnswer(input, item.answers)) {
      play('correct')
      setFlash({ key: Date.now(), color: '#22c55e' })
      setHint(`Dobrze! Teraz ${tile.botName}…`)
      setBubble(null)
      setTurn('bot')
      setItemIndex((i) => i + 1)
    } else {
      play('wrong')
      setHint('Nie! Próbuj dalej albo pasuj.')
      void animateCard(cardScope.current, { x: [0, -16, 16, -10, 10, 0] }, { duration: 0.4 })
    }
    setInput('')
  }

  function pass() {
    if (turn !== 'player' || loser) return
    play('pass')
    addPopup('player')
    setHint(`Pas! To było: ${item.answers[0]}`)
    setPlayerTime((t) => Math.max(0, t - PASS_PENALTY))
    setItemIndex((i) => i + 1)
  }

  const removePopup = (id: number) => setPopups((list) => list.filter((p) => p.id !== id))
  const playerTurn = turn === 'player' && !loser

  useEffect(() => {
    if (playerTurn) inputRef.current?.focus({ preventScroll: true })
  }, [playerTurn])

  return (
    <div className="flex flex-col items-center gap-4" data-testid="duel">
      <div className="flex items-center gap-2 text-white/80">
        <img src={emojiImage(category.emoji)} alt="" className="size-7" />
        <span className="font-display text-2xl tracking-widest">
          Pojedynek · {category.name}
        </span>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-2 gap-3">
        <Clock
          label="Ty"
          color={PLAYER_COLOR}
          time={playerTime}
          active={turn === 'player' && !loser}
          lost={loser === 'player'}
          popups={popups.filter((p) => p.side === 'player')}
          onPopupDone={removePopup}
        />
        <Clock
          label={tile.botName}
          color={tile.color}
          time={botTime}
          active={turn === 'bot' && !loser}
          lost={loser === 'bot'}
          popups={popups.filter((p) => p.side === 'bot')}
          onPopupDone={removePopup}
        />
      </div>

      <div className="relative flex h-52 w-full max-w-sm items-center justify-center sm:h-60">
        <div ref={cardScope} className="relative size-full">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={itemIndex}
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white p-6 shadow-[0_0_60px_rgb(255_255_255/0.25)]"
              initial={{ x: 220, rotate: 8, opacity: 0 }}
              animate={{ x: 0, rotate: 0, opacity: 1 }}
              exit={{ x: -220, rotate: -8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              data-testid="duel-item"
            >
              <img
                src={itemImage(item)}
                data-flag={item.flag}
                data-emoji={item.emoji}
                alt="Co to jest?"
                className={item.flag ? 'max-h-full rounded border object-contain shadow' : 'size-full object-contain'}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
          {flash && (
            <motion.div
              key={flash.key}
              className="pointer-events-none absolute -inset-2 rounded-3xl border-4"
              style={{ borderColor: flash.color, boxShadow: `0 0 40px ${flash.color}` }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </div>
        <AnimatePresence>
          {(turn === 'bot' || bubble) && !loser && (
            <motion.div
              key={turn === 'bot' && !bubble ? 'thinking' : `said-${itemIndex}`}
              className="absolute -right-2 -top-4 rounded-2xl rounded-bl-none px-3 py-1.5 font-semibold text-white shadow-lg sm:-right-16"
              style={{ background: tile.color }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              data-testid="bot-bubble"
            >
              {turn === 'bot' && !bubble ? (
                <span className="flex gap-1 py-1">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="size-2 rounded-full bg-white"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </span>
              ) : (
                bubble
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="min-h-6 text-sm text-white/70">
        {loser ? (loser === 'bot' ? `${tile.botName} nie zdąży! Pole jest twoje!` : 'Koniec czasu!') : hint}
      </p>
      <form onSubmit={submit} className="flex w-full max-w-xl gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!playerTurn}
          placeholder={playerTurn ? 'Co to jest?' : 'Czekaj na rywala…'}
          aria-label="Odpowiedź"
          className="h-12 bg-black/50 text-lg"
        />
        <Button type="submit" disabled={!playerTurn} className="h-12">
          OK
        </Button>
        <Button type="button" variant="outline" onClick={pass} disabled={!playerTurn} className="h-12">
          Pas (−{PASS_PENALTY} s)
        </Button>
      </form>
      {tokens > 0 && !loser && (
        <Button
          variant="secondary"
          className="gap-2"
          onClick={() => {
            onUseToken()
            play('token')
            setPlayerTime((t) => t + TOKEN_BONUS)
          }}
        >
          <img src={emojiImage('🪙')} alt="" className="size-5" />
          Złoty żeton: +{TOKEN_BONUS} s ({tokens})
        </Button>
      )}
    </div>
  )
}
