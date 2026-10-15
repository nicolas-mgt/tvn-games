import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useRef, useState, type CSSProperties } from 'react'
import { Button } from '@/components/ui/button'
import { pickOne } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { Ceremony, type CeremonyStep } from './Ceremony'
import { ContestantFigure, ContestantTile } from './Contestant'
import {
  ACTIONS_PER_ROUND,
  botVote,
  CARDS,
  CEREMONIES,
  contestantMood,
  createVilla,
  MAX_AFFECTION,
  PLAYER,
  POINTS_PER_CEREMONY,
  randomNoise,
  runCeremony,
  type CardId,
  type CeremonyResult,
  type Reaction,
  type Villa,
} from './logic'
import { PowerCard } from './PowerCard'
import { play, sfx } from './sfx'
import { VillaBackdrop, type Mood } from './VillaBackdrop'

type Phase = 'lobby' | 'morning' | 'day' | CeremonyStep
type Flash = 'date' | 'campfire' | 'gossip'

const WELCOME = 'Witaj w Rajskiej Willi! Zdobądź sympatię i przetrwaj 5 ceremonii.'
const randomCard = () => pickOne(Object.keys(CARDS) as CardId[])

function ShellIcon({ used }: { used: boolean }) {
  return (
    <svg viewBox="0 0 40 36" width="20" className={used ? 'opacity-30' : ''} aria-hidden>
      <path d="M20 34 L4 18 Q4 4 20 2 Q36 4 36 18 Z" fill="#ffe1cf" stroke="#d98a6a" strokeWidth="2" />
      <path d="M20 34 V6 M20 34 L10 10 M20 34 L30 10" stroke="#d98a6a" strokeWidth="1.5" />
    </svg>
  )
}

export default function RajskieRozdanieGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [villa, setVilla] = useState<Villa>(() => createVilla(Math.random))
  const [ceremony, setCeremony] = useState(1)
  const [actionsLeft, setActionsLeft] = useState(ACTIONS_PER_ROUND)
  const [selected, setSelected] = useState<number | null>(null)
  const [card, setCard] = useState<CardId>(randomCard)
  const [cardPlayed, setCardPlayed] = useState(false)
  const [log, setLog] = useState<string[]>([WELCOME])
  const [result, setResult] = useState<CeremonyResult | null>(null)
  const [revealed, setRevealed] = useState(0)
  const [gameOver, setGameOver] = useState<{ survived: number } | null>(null)
  const [reactions, setReactions] = useState<Record<number, Reaction>>({})
  const [exposed, setExposed] = useState(false)
  const [flash, setFlash] = useState<Flash | null>(null)
  const reactionToken = useRef(0)
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const { contestants } = villa
  const immune = cardPlayed && card === 'immunitet'
  const doubleVote = cardPlayed && card === 'podwojny'
  const alive = contestants.map((c, i) => ({ c, i })).filter(({ c, i }) => c.alive && i !== PLAYER)
  const day = phase === 'morning' || phase === 'day'

  function startMorning() {
    setPhase('morning')
    play('card')
    setTimeout(() => setPhase('day'), 1100 * pace)
  }

  function enterVilla() {
    sfx.unlock()
    startMorning()
  }

  function restart() {
    setVilla(createVilla(Math.random))
    setCeremony(1)
    setActionsLeft(ACTIONS_PER_ROUND)
    setSelected(null)
    setCard(randomCard())
    setCardPlayed(false)
    setLog([WELCOME])
    setResult(null)
    setGameOver(null)
    startMorning()
  }

  function react(next: Record<number, Reaction>, nextFlash: Flash, turned = false) {
    const token = ++reactionToken.current
    setReactions(next)
    setFlash(nextFlash)
    setExposed(turned)
    setTimeout(() => {
      if (reactionToken.current !== token) return
      setReactions({})
      setFlash(null)
      setExposed(false)
    }, 1600)
  }

  function updateAffection(next: Villa, index: number, delta: number) {
    const bot = next.contestants[index]
    next.contestants[index] = { ...bot, affection: Math.max(0, Math.min(MAX_AFFECTION, bot.affection + delta)) }
  }

  function act(kind: 'randka' | 'grupa' | 'intryga') {
    const next: Villa = { ...villa, contestants: [...contestants], dislike: villa.dislike.map((row) => [...row]) }
    const target = selected
    let message = ''
    if (kind === 'randka' && target !== null) {
      updateAffection(next, target, 3)
      next.datedLast = target
      const jealous = alive.filter(({ c, i }) => c.personality === 'zazdrosny' && i !== target)
      jealous.forEach(({ i }) => updateAffection(next, i, -1))
      message = `Randka z ${contestants[target].name} przy basenie.${jealous.length > 0 ? ' Zazdrośnicy patrzą spode łba.' : ''}`
      react({ ...Object.fromEntries(jealous.map(({ i }) => [i, 'jealous'])), [target]: 'smitten' }, 'date')
      play('clink')
      play('heart')
    } else if (kind === 'grupa') {
      const fans = alive.filter(({ c }) => c.personality !== 'intrygant')
      fans.forEach(({ i }) => updateAffection(next, i, 1))
      message = 'Rozmowa przy ognisku. Prawie wszyscy cię polubili (intryganci udają).'
      react(Object.fromEntries(fans.map(({ i }) => [i, 'cheerful'])), 'campfire')
      play('crackle')
    } else if (kind === 'intryga' && target !== null) {
      alive.forEach(({ i }) => i !== target && (next.dislike[i][target] += 2))
      updateAffection(next, target, -3)
      const wasExposed = Math.random() < 0.3
      if (wasExposed) alive.forEach(({ i }) => updateAffection(next, i, -1))
      message = `Szepczesz o ${contestants[target].name}. ${wasExposed ? 'Ktoś to słyszał! Wszyscy patrzą na ciebie krzywo.' : 'Plotka idzie w świat.'}`
      react({ [target]: 'hurt' }, 'gossip', wasExposed)
      play('whisper')
    } else {
      return
    }
    setVilla(next)
    setLog([message, ...log])
    setActionsLeft(actionsLeft - 1)
  }

  function playCard() {
    play('play')
    if (card === 'kradziez') {
      if (selected === null) return
      const next: Villa = { ...villa, contestants: [...contestants] }
      updateAffection(next, selected, MAX_AFFECTION)
      const others = alive.filter(({ i }) => i !== selected)
      const angry = others.length > 0 ? pickOne(others) : null
      if (angry) updateAffection(next, angry.i, -4)
      setVilla(next)
      setLog([`${contestants[selected].name} jest w tobie zakochany(a)!${angry ? ` ${angry.c.name} jest wściekły(a).` : ''}`, ...log])
      react({ ...(angry ? { [angry.i]: 'jealous' as const } : {}), [selected]: 'smitten' }, 'date')
      play('heart')
    }
    setCardPlayed(true)
  }

  function goToCeremony() {
    setSelected(null)
    setPhase('ceremony')
    play('crackle')
  }

  function vote(target: number) {
    const outcome = runCeremony(villa, target, doubleVote, immune)
    setResult(outcome)
    setRevealed(0)
    setPhase('reveal')
    play('drum')
    const start = 1300 * pace
    const step = 550 * pace
    outcome.votes.forEach((_, n) =>
      setTimeout(() => {
        setRevealed(n + 1)
        play('shell')
      }, start + n * step),
    )
    setTimeout(
      () => {
        setPhase('farewell')
        play('out')
        setTimeout(() => play(outcome.eliminated === PLAYER ? 'bad' : 'good'), 700 * pace)
      },
      start + outcome.votes.length * step + 600 * pace,
    )
    if (outcome.eliminated === PLAYER) return
    const next: Villa = { ...villa, contestants: [...contestants] }
    next.contestants[outcome.eliminated] = { ...contestants[outcome.eliminated], alive: false }
    setVilla(next)
  }

  function celebrate() {
    for (const [n, x] of [0.2, 0.5, 0.8].entries()) {
      setTimeout(
        () => confetti({ particleCount: 90, spread: 360, startVelocity: 32, origin: { x, y: 0.3 }, colors: ['#ffd34d', '#ff5c8a', '#5fe0ea', '#fff'], disableForReducedMotion: true }),
        n * 450,
      )
    }
  }

  function nextRound() {
    if (result?.eliminated === PLAYER) {
      setGameOver({ survived: ceremony - 1 })
      return
    }
    if (ceremony === CEREMONIES) {
      setGameOver({ survived: CEREMONIES })
      celebrate()
      return
    }
    setVilla({ ...villa, noise: randomNoise(contestants.length, Math.random), datedLast: null })
    setCeremony(ceremony + 1)
    setActionsLeft(ACTIONS_PER_ROUND)
    setSelected(null)
    setCard(randomCard())
    setCardPlayed(false)
    setResult(null)
    startMorning()
  }

  function backdropMood(): Mood {
    if (gameOver) return 'result'
    if (phase === 'lobby') return 'idle'
    if (phase === 'farewell') return 'farewell'
    if (phase === 'ceremony' || phase === 'reveal') return 'ceremony'
    return flash ?? 'day'
  }

  const won = gameOver?.survived === CEREMONIES
  const showIntents = cardPlayed && card === 'wyrocznia'
  const mid = (alive.length - 1) / 2

  return (
    <MotionConfig reducedMotion="user">
      <VillaBackdrop mood={backdropMood()} won={won} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div className="rr-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="rr-hand text-3xl text-amber-200">Rajska Willa · nowy sezon</p>
          <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">Rajskie Rozdanie</h2>
          <p className="text-white/90">
            Siedmioro rywali, basen i ceremonia co wieczór. Za dnia masz {ACTIONS_PER_ROUND} akcje: randkę, rozmowę przy ognisku albo intrygę, do tego jedną kartę
            mocy. Wieczorem willa głosuje, kto ją opuszcza. Przetrwaj {CEREMONIES} ceremonii.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enterVilla} data-testid="enter-villa">
            Wchodzę do willi
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && !gameOver && (
        <div className="flex flex-col gap-4">
          <header className="rr-bar" data-testid="bar">
            <strong className="rr-bar-title">
              <span className="rr-rec" /> Rajska Willa <em>na żywo</em>
            </strong>
            <div className="rr-bar-stats">
              <span>
                Dzień <b data-testid="day">{ceremony}/{CEREMONIES}</b>
              </span>
              <span className="rr-bar-actions" aria-label={`Akcje: ${actionsLeft}`} data-testid="actions" data-value={actionsLeft}>
                Akcje
                {Array.from({ length: ACTIONS_PER_ROUND }, (_, i) => (
                  <ShellIcon key={i} used={i >= actionsLeft} />
                ))}
              </span>
              <span>
                W willi <b>{alive.length + 1}</b>
              </span>
            </div>
          </header>

          {day ? (
            <>
              <p className="rr-prompt rr-hand">
                {selected === null ? 'Kliknij uczestnika, żeby go wybrać.' : `Wybrano: ${contestants[selected].name}`}
              </p>
              <div className="rr-terrace">
                {alive.map(({ c, i }, n) => (
                  <div key={c.name} className="rr-terrace-spot" style={{ '--arc': `${(n - mid) ** 2 * 4}px` } as CSSProperties}>
                    <ContestantTile
                      contestant={c}
                      mood={contestantMood({ affection: c.affection, reaction: reactions[i], alive: true })}
                      selected={selected === i}
                      turned={exposed}
                      oracleTarget={showIntents ? contestants[botVote(villa, i, immune)].name : null}
                      onClick={() => setSelected(i)}
                    />
                  </div>
                ))}
              </div>
              <div className="rr-dock">
                <PowerCard
                  key={ceremony}
                  card={card}
                  played={cardPlayed}
                  needsTarget={card === 'kradziez'}
                  disabled={phase !== 'day' || (card === 'kradziez' && selected === null)}
                  onPlay={playCard}
                />
                <div className="rr-actions">
                  <button type="button" className="rr-sign rr-sign-date" disabled={phase !== 'day' || actionsLeft === 0 || selected === null} onClick={() => act('randka')} data-testid="action-randka">
                    Randka
                    <small>+3 sympatii, zazdrośnicy −1</small>
                  </button>
                  <button type="button" className="rr-sign rr-sign-fire" disabled={phase !== 'day' || actionsLeft === 0} onClick={() => act('grupa')} data-testid="action-grupa">
                    Ognisko
                    <small>+1 u wszystkich poza intrygantami</small>
                  </button>
                  <button type="button" className="rr-sign rr-sign-gossip" disabled={phase !== 'day' || actionsLeft === 0 || selected === null} onClick={() => act('intryga')} data-testid="action-intryga">
                    Intryga
                    <small>reszta zwraca się przeciw celowi</small>
                  </button>
                  <button type="button" className="rr-sign rr-sign-go" disabled={phase !== 'day'} onClick={goToCeremony} data-testid="to-ceremony">
                    Na ceremonię
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Ceremony
              contestants={contestants}
              step={phase as CeremonyStep}
              result={result}
              revealed={revealed}
              doubleVote={doubleVote}
              nextLabel={result?.eliminated === PLAYER || ceremony === CEREMONIES ? 'Wynik' : 'Następny dzień'}
              onVote={vote}
              onNext={nextRound}
            />
          )}

          <div className="rr-lower-third" data-testid="log">
            <span className="rr-lower-tag">Z willi</span>
            <motion.p key={log.length} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
              {log[0]}
            </motion.p>
            {log.slice(1, 3).map((line, i) => (
              <p key={log.length - 1 - i} className="rr-lower-old">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {gameOver && (
        <ResultScreen
          slug="rajskie-rozdanie"
          score={gameOver.survived * POINTS_PER_CEREMONY}
          maxScore={CEREMONIES * POINTS_PER_CEREMONY}
          summary={won ? 'Dotrwałeś do finału Rajskiej Willi!' : `Odpadłeś na ceremonii nr ${gameOver.survived + 1}. Walizki już spakowane.`}
          shareLine={'🌴'.repeat(gameOver.survived) + (won ? '🏆' : '🧳')}
          onRestart={restart}
        >
          <div className="rr-finale">
            {won ? (
              [{ c: contestants[PLAYER], i: PLAYER }, ...alive].map(({ c, i }) => (
                <ContestantFigure key={c.name} name={c.name} mood={i === PLAYER ? 'cheerful' : 'fan'} className="rr-finale-face" />
              ))
            ) : (
              <ContestantFigure name="Ty" mood="hurt" className="rr-finale-face" />
            )}
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/70">Dźwięki: Kenney (CC0) · Uczestnicy są fikcyjni</p>
    </MotionConfig>
  )
}
