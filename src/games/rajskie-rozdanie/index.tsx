import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pickOne } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { botVote, CEREMONIES, createVilla, MAX_AFFECTION, PLAYER, randomNoise, runCeremony, type CeremonyResult, type Villa } from './logic'

const ACTIONS_PER_ROUND = 2
const POINTS_PER_CEREMONY = 20

type CardId = 'immunitet' | 'podwojny' | 'kradziez' | 'wyrocznia'
const CARDS: Record<CardId, { emoji: string; name: string; text: string }> = {
  immunitet: { emoji: '🛡️', name: 'Immunitet', text: 'Na tej ceremonii nikt nie może na ciebie zagłosować.' },
  podwojny: { emoji: '✌️', name: 'Podwójny głos', text: 'Twój głos liczy się podwójnie.' },
  kradziez: { emoji: '💘', name: 'Kradzież partnera', text: 'Wybrana osoba zakochuje się w tobie, ale ktoś inny jest wściekły.' },
  wyrocznia: { emoji: '🔮', name: 'Rajska Wyrocznia', text: 'Widzisz, na kogo każdy zamierza głosować.' },
}

type Phase = 'actions' | 'vote' | 'result'

export default function RajskieRozdanieGame() {
  const [villa, setVilla] = useState<Villa>(() => createVilla(Math.random))
  const [ceremony, setCeremony] = useState(1)
  const [phase, setPhase] = useState<Phase>('actions')
  const [actionsLeft, setActionsLeft] = useState(ACTIONS_PER_ROUND)
  const [selected, setSelected] = useState<number | null>(null)
  const [card, setCard] = useState<CardId>(() => pickOne(Object.keys(CARDS) as CardId[]))
  const [cardPlayed, setCardPlayed] = useState(false)
  const [log, setLog] = useState<string[]>(['Witaj w Rajskiej Willi! Zdobądź sympatię i przetrwaj 5 ceremonii.'])
  const [result, setResult] = useState<CeremonyResult | null>(null)
  const [gameOver, setGameOver] = useState<{ survived: number } | null>(null)

  const { contestants } = villa
  const immune = cardPlayed && card === 'immunitet'
  const alive = contestants.map((c, i) => ({ c, i })).filter(({ c, i }) => c.alive && i !== PLAYER)

  function restart() {
    setVilla(createVilla(Math.random))
    setCeremony(1)
    setPhase('actions')
    setActionsLeft(ACTIONS_PER_ROUND)
    setSelected(null)
    setCard(pickOne(Object.keys(CARDS) as CardId[]))
    setCardPlayed(false)
    setLog(['Witaj w Rajskiej Willi! Zdobądź sympatię i przetrwaj 5 ceremonii.'])
    setResult(null)
    setGameOver(null)
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
      message = `Randka z ${contestants[target].name} przy basenie. ❤️${jealous.length > 0 ? ' Zazdrośnicy patrzą spode łba.' : ''}`
    } else if (kind === 'grupa') {
      alive.forEach(({ c, i }) => c.personality !== 'intrygant' && updateAffection(next, i, 1))
      message = 'Rozmowa przy ognisku. Prawie wszyscy cię polubili (intryganci udają).'
    } else if (kind === 'intryga' && target !== null) {
      alive.forEach(({ i }) => i !== target && (next.dislike[i][target] += 2))
      updateAffection(next, target, -3)
      const exposed = Math.random() < 0.3
      if (exposed) alive.forEach(({ i }) => updateAffection(next, i, -1))
      message = `Szepczesz o ${contestants[target].name}. ${exposed ? 'Ktoś to słyszał! Wszyscy patrzą na ciebie krzywo. 😬' : 'Plotka idzie w świat. 🐍'}`
    } else {
      return
    }
    setVilla(next)
    setLog([message, ...log])
    setActionsLeft(actionsLeft - 1)
  }

  function playCard() {
    if (card === 'kradziez') {
      if (selected === null) return
      const next: Villa = { ...villa, contestants: [...contestants] }
      updateAffection(next, selected, MAX_AFFECTION)
      const others = alive.filter(({ i }) => i !== selected)
      const angry = others.length > 0 ? pickOne(others) : null
      if (angry) updateAffection(next, angry.i, -4)
      setVilla(next)
      setLog([`${contestants[selected].name} jest w tobie zakochany(a)!${angry ? ` ${angry.c.name} jest wściekły(a).` : ''}`, ...log])
    }
    setCardPlayed(true)
  }

  function vote(target: number) {
    const outcome = runCeremony(villa, target, cardPlayed && card === 'podwojny', immune)
    setResult(outcome)
    setPhase('result')
    if (outcome.eliminated === PLAYER) return
    const next: Villa = { ...villa, contestants: [...contestants] }
    next.contestants[outcome.eliminated] = { ...contestants[outcome.eliminated], alive: false }
    setVilla(next)
  }

  function nextRound() {
    if (result?.eliminated === PLAYER) {
      setGameOver({ survived: ceremony - 1 })
      return
    }
    if (ceremony === CEREMONIES) {
      setGameOver({ survived: CEREMONIES })
      return
    }
    setVilla({ ...villa, noise: randomNoise(contestants.length, Math.random), datedLast: null })
    setCeremony(ceremony + 1)
    setPhase('actions')
    setActionsLeft(ACTIONS_PER_ROUND)
    setSelected(null)
    setCard(pickOne(Object.keys(CARDS) as CardId[]))
    setCardPlayed(false)
    setResult(null)
  }

  if (gameOver) {
    const won = gameOver.survived === CEREMONIES
    return (
      <ResultScreen
        slug="rajskie-rozdanie"
        score={gameOver.survived * POINTS_PER_CEREMONY}
        maxScore={CEREMONIES * POINTS_PER_CEREMONY}
        summary={won ? '🌴 Dotrwałeś do finału Rajskiej Willi!' : `Odpadłeś na ceremonii nr ${gameOver.survived + 1}. Walizki już spakowane.`}
        shareLine={'🌴'.repeat(gameOver.survived) + (won ? '🏆' : '🧳')}
        onRestart={restart}
      />
    )
  }

  const showIntents = cardPlayed && card === 'wyrocznia'
  return (
    <>
      <Hud items={[['Ceremonia', `${ceremony}/${CEREMONIES}`], ['Akcje', actionsLeft], ['W willi', alive.length + 1]]} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {alive.map(({ c, i }) => (
          <button
            key={c.name}
            data-testid="contestant"
            onClick={() => (phase === 'vote' ? vote(i) : setSelected(i))}
            disabled={phase === 'result'}
            className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 text-sm transition ${
              selected === i && phase === 'actions' ? 'border-pink-500 bg-pink-50' : ''
            } ${phase === 'vote' ? 'cursor-pointer hover:border-red-500' : ''}`}
          >
            <span className="text-3xl">{c.emoji}</span>
            <span className="font-semibold">{c.name}</span>
            <Badge variant="outline">{c.personality}</Badge>
            <span title="sympatia do ciebie">
              {'❤️'.repeat(Math.round(c.affection / 2))}
              {'🤍'.repeat(5 - Math.round(c.affection / 2))}
            </span>
            {showIntents && <span className="text-xs">głosuje na: {contestants[botVote(villa, i, immune)].name}</span>}
          </button>
        ))}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-3">
          {phase === 'actions' && (
            <>
              <div className="rounded-md border border-dashed p-3">
                <p className="font-semibold">
                  Twoja karta: {CARDS[card].emoji} {CARDS[card].name}
                </p>
                <p className="text-sm text-muted-foreground">{CARDS[card].text}</p>
                <Button
                  size="sm"
                  className="mt-2"
                  variant="secondary"
                  disabled={cardPlayed || (card === 'kradziez' && selected === null)}
                  onClick={playCard}
                >
                  {cardPlayed ? 'Karta zagrana' : card === 'kradziez' ? 'Zagraj na zaznaczoną osobę' : 'Zagraj kartę'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {selected === null ? 'Kliknij uczestnika, żeby go wybrać.' : `Wybrano: ${contestants[selected].name}`}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button disabled={actionsLeft === 0 || selected === null} onClick={() => act('randka')}>
                  💕 Randka
                </Button>
                <Button disabled={actionsLeft === 0} onClick={() => act('grupa')}>
                  🔥 Rozmowa z grupą
                </Button>
                <Button disabled={actionsLeft === 0 || selected === null} variant="outline" onClick={() => act('intryga')}>
                  🐍 Intryga
                </Button>
                <Button variant="destructive" onClick={() => setPhase('vote')}>
                  Na ceremonię →
                </Button>
              </div>
            </>
          )}
          {phase === 'vote' && <p className="font-semibold">Ceremonia! Kliknij osobę, która według ciebie powinna opuścić willę.</p>}
          {phase === 'result' && result && (
            <div className="flex flex-col gap-2" data-testid="ceremony-result">
              <ul className="text-sm">
                {result.votes.map(({ voter, target }) => (
                  <li key={voter}>
                    {contestants[voter].name} → {contestants[target].name}
                  </li>
                ))}
              </ul>
              <p className="text-lg font-bold">
                {result.eliminated === PLAYER ? 'Willa zdecydowała: odpadasz! 🧳' : `Willę opuszcza: ${contestants[result.eliminated].name}`}
              </p>
              <Button onClick={nextRound}>{result.eliminated === PLAYER || ceremony === CEREMONIES ? 'Wynik' : 'Następny dzień'}</Button>
            </div>
          )}
          <ul className="text-sm text-muted-foreground">
            {log.slice(0, 4).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
