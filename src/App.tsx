import { Suspense } from 'react'
import { createBrowserRouter, Link, RouterProvider, useParams } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GAME_CATEGORIES, GAMES, getGame } from '@/games/registry'
import { GameShell } from '@/shared/GameShell'
import { loadStats } from '@/shared/storage'

function HubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black">TVN Games</h1>
        <p className="text-muted-foreground">
          20 prostych gier przeglądarkowych inspirowanych jesienną ramówką grupy TVN. Wersja POC.
        </p>
      </header>
      {GAME_CATEGORIES.map((category) => (
        <section key={category} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">{category}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GAMES.filter((game) => game.category === category).map((game) => {
              const stats = loadStats(game.slug)
              return (
                <Link key={game.slug} to={`/gra/${game.slug}`} data-testid={`game-tile-${game.slug}`}>
                  <Card className="h-full gap-3 py-4 transition hover:border-primary hover:shadow-md">
                    <CardHeader className="px-4">
                      <CardTitle className="text-base">
                        {game.emoji} {game.title}
                      </CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                      <div className="flex flex-wrap gap-1 pt-1">
                        <Badge variant="secondary">{game.inspiration}</Badge>
                        <Badge variant="outline">{game.size}</Badge>
                        {stats.plays > 0 && (
                          <Badge variant="outline">
                            rekord: {stats.best} {game.scoreLabel}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

function GamePage() {
  const { slug = '' } = useParams()
  const game = getGame(slug)
  if (!game) {
    return (
      <div className="p-8">
        Nie ma takiej gry. <Link to="/">Wróć do listy</Link>
      </div>
    )
  }
  return (
    <GameShell game={game}>
      <Suspense fallback={<p className="text-muted-foreground">Ładowanie gry…</p>}>
        <game.Component key={game.slug} />
      </Suspense>
    </GameShell>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <HubPage /> },
  { path: '/gra/:slug', element: <GamePage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
