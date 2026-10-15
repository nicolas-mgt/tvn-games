import confetti from 'canvas-confetti'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getGame, type GameMeta } from '@/games/registry'
import { recordResult, type GameStats } from './storage'

export function GameShell({ game, children }: { game: GameMeta; children: ReactNode }) {
  if (game.immersive) {
    return (
      <div className="dark relative min-h-svh overflow-x-hidden text-foreground">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            ← Wszystkie gry
          </Link>
          <h1 className="font-display text-2xl tracking-wider text-white">{game.title}</h1>
        </header>
        <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">{children}</main>
      </div>
    )
  }
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-4 px-4 py-6">
      <header className="flex flex-wrap items-center gap-3">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Wszystkie gry
        </Link>
        <h1 className="flex-1 text-2xl font-bold">
          {game.emoji} {game.title}
        </h1>
        <Badge variant="secondary">inspiracja: {game.inspiration}</Badge>
      </header>
      <main className="flex flex-1 flex-col gap-4">{children}</main>
    </div>
  )
}

/** Compact status row shown above the play area. */
export function Hud({ items }: { items: [label: string, value: ReactNode][] }) {
  return (
    <div className="flex flex-wrap gap-2" data-testid="hud">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border bg-muted/50 px-3 py-1 text-sm">
          <span className="text-muted-foreground">{label}: </span>
          <span className="font-semibold tabular-nums">{value}</span>
        </div>
      ))}
    </div>
  )
}

type ResultScreenProps = {
  slug: string
  score: number
  maxScore?: number
  summary: ReactNode
  shareLine?: string
  onRestart?: () => void
  children?: ReactNode
}

export function ResultScreen({ slug, score, maxScore, summary, shareLine, onRestart, children }: ResultScreenProps) {
  const game = getGame(slug)
  const [result, setResult] = useState<{ stats: GameStats; isNewBest: boolean } | null>(null)
  const [copied, setCopied] = useState(false)
  const recorded = useRef(false)

  useEffect(() => {
    if (recorded.current) return
    recorded.current = true
    const saved = recordResult(slug, score)
    setResult(saved)
    if (saved.isNewBest && score > 0) confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } })
  }, [slug, score])

  const scoreText = maxScore === undefined ? `${score}` : `${score}/${maxScore}`
  const shareText = [`${game?.emoji ?? ''} ${game?.title ?? slug}: ${scoreText} ${game?.scoreLabel ?? ''}`, shareLine, location.href]
    .filter(Boolean)
    .join('\n')

  async function copyResult() {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
  }

  return (
    <Card data-testid="result-screen">
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Koniec gry</p>
        <p className="text-5xl font-black tabular-nums">
          {scoreText} <span className="text-xl font-semibold text-muted-foreground">{game?.scoreLabel}</span>
        </p>
        <div className="text-balance">{summary}</div>
        {shareLine && <pre className="rounded-md bg-muted px-3 py-2 text-lg">{shareLine}</pre>}
        {children}
        {result && (
          <p className="text-sm text-muted-foreground">
            {result.isNewBest && score > 0 ? '🏆 Nowy rekord! ' : `Rekord: ${result.stats.best}. `}
            Rozegrane: {result.stats.plays} · Seria dni: {result.stats.streak}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={copyResult}>
            {copied ? 'Skopiowano!' : 'Kopiuj wynik'}
          </Button>
          {onRestart && <Button onClick={onRestart}>Zagraj jeszcze raz</Button>}
        </div>
      </CardContent>
    </Card>
  )
}
