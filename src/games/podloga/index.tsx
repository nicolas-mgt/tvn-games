import '@fontsource/bebas-neue'
import confetti from 'canvas-confetti'
import { MotionConfig, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { dailyRng } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { CATEGORIES, categoryById } from './categories'
import { Duel, TOKEN_BONUS } from './Duel'
import { Floor, type Wave } from './Floor'
import { challengeable, createBoard, PLAYER_COLOR, SIZE, type Tile } from './logic'
import { isMuted, play, setMuted, unlockAudio } from './sfx'
import { StudioBackdrop, type Mood } from './StudioBackdrop'

const SLUG = 'podloga'
const WINS_FOR_TOKEN = 3
const WIN_MOOD_MS = 1500

type Phase = 'lobby' | 'intro' | 'floor' | 'zoom' | 'duel' | 'result'

const newBoard = () => createBoard(CATEGORIES.map((c) => c.id), dailyRng(SLUG))

export default function PodlogaGame() {
  const [board, setBoard] = useState(newBoard)
  const [phase, setPhase] = useState<Phase>('lobby')
  const [mood, setMood] = useState<Mood>('intro')
  const [duelIndex, setDuelIndex] = useState<number | null>(null)
  const [wave, setWave] = useState<Wave | null>(null)
  const [winStreak, setWinStreak] = useState(0)
  const [tokens, setTokens] = useState(0)
  const [lostTo, setLostTo] = useState<Tile | null>(null)
  const [muted, setMutedState] = useState(isMuted)
  const owned = board.filter((t) => t.owner === 'player').length

  useEffect(() => {
    if (mood !== 'win' || phase === 'result') return
    const id = setTimeout(() => setMood('floor'), WIN_MOOD_MS)
    return () => clearTimeout(id)
  }, [mood, phase])

  function enterStudio() {
    unlockAudio()
    play('intro')
    setPhase('intro')
  }

  function restart() {
    setBoard(newBoard())
    setDuelIndex(null)
    setWave(null)
    setWinStreak(0)
    setTokens(0)
    setLostTo(null)
    setMood('intro')
    play('intro')
    setPhase('intro')
  }

  function pick(index: number) {
    play('select')
    setDuelIndex(index)
    setPhase('zoom')
  }

  function endDuel(won: boolean) {
    if (duelIndex === null) return
    if (!won) {
      play('lose')
      setMood('lose')
      setLostTo(board[duelIndex])
      setPhase('result')
      return
    }
    const next = board.map((t, i) => (i === duelIndex ? { ...t, owner: 'player' as const, color: PLAYER_COLOR } : t))
    const streak = winStreak + 1
    setBoard(next)
    setWinStreak(streak % WINS_FOR_TOKEN)
    if (streak === WINS_FOR_TOKEN) {
      setTokens(tokens + 1)
      setTimeout(() => play('token'), 700)
    }
    play('win')
    setTimeout(() => play('conquest'), 350)
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#facc15', '#ffffff', '#f472b6'] })
    setWave({ origin: duelIndex, key: Date.now() })
    setMood('win')
    setPhase(next.every((t) => t.owner === 'player') ? 'result' : 'floor')
  }

  function toggleMute() {
    setMuted(!muted)
    setMutedState(!muted)
  }

  return (
    <MotionConfig reducedMotion="user">
      <StudioBackdrop mood={mood} />
      <button
        onClick={toggleMute}
        className="fixed right-4 top-2 z-30 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-sm text-white backdrop-blur hover:bg-black/70"
        aria-label={muted ? 'Włącz dźwięk' : 'Wycisz'}
        data-testid="mute"
      >
        {muted ? '🔇 Dźwięk' : '🔊 Dźwięk'}
      </button>

      {phase === 'lobby' && (
        <motion.div
          className="flex min-h-[60svh] flex-col items-center justify-center gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="led-text font-display text-7xl tracking-wider text-yellow-300 sm:text-8xl">Podłoga</h2>
          <p className="max-w-md text-white/80">
            25 pól, 24 rywali i zegar szachowy. Wyzywaj sąsiadów na pojedynki w ich kategoriach i zajmij całą podłogę.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enterStudio} data-testid="enter-studio">
            Wejdź do studia
          </Button>
        </motion.div>
      )}

      {(phase === 'intro' || phase === 'floor' || phase === 'zoom') && (
        <>
          <Hud items={[['Twoje pola', `${owned}/${board.length}`], ['Seria wygranych', `${winStreak}/${WINS_FOR_TOKEN}`], ['Złote żetony', tokens]]} />
          <p className="text-sm text-white/70">
            Wybierz pulsujące pole i wyzwij rywala w jego kategorii. Każdy ma 20 s na zegarze. {WINS_FOR_TOKEN} wygrane z rzędu dają
            złoty żeton (+{TOKEN_BONUS} s). Jedna porażka kończy grę.
          </p>
          <Floor
            board={board}
            targets={phase === 'floor' ? challengeable(board) : []}
            intro={phase === 'intro'}
            wave={wave}
            zoomTo={phase === 'zoom' ? duelIndex : null}
            onPick={pick}
            onIntroDone={() => {
              setPhase('floor')
              setMood('floor')
            }}
            onZoomed={() => {
              setPhase('duel')
              setMood('duel')
            }}
          />
        </>
      )}

      {phase === 'duel' && duelIndex !== null && (
        <Duel key={duelIndex} tile={board[duelIndex]} tokens={tokens} onUseToken={() => setTokens(tokens - 1)} onMood={setMood} onEnd={endDuel} />
      )}

      {phase === 'result' && (
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
            board.slice(r * SIZE, r * SIZE + SIZE).map((t) => (t.owner === 'player' ? '🟨' : '⬛')).join(''),
          ).join('\n')}
          onRestart={restart}
        />
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/40">
        Grafiki: OpenMoji (CC BY-SA 4.0) · Dźwięki: Kenney (CC0) · Flagi: flagcdn.com
      </p>
    </MotionConfig>
  )
}
