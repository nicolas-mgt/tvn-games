import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Hud, ResultScreen } from '@/shared/GameShell'
import { banish, botVotes, createCastle, gameStatus, nightVictim, planDay, PLAYER, type Day, type Resident, type Vote } from './logic'

const POINTS_PER_TRAITOR = 50
const PENALTY_PER_LOYAL = 10

type Verdict = { votes: Vote[]; banished: number }

const LOCATIVE: Record<string, string> = { Biblioteka: 'Bibliotece', Kuchnia: 'Kuchni', Ogród: 'Ogrodzie', Piwnica: 'Piwnicy' }

function newGame() {
  const residents = createCastle(Math.random)
  return { residents, day: planDay(residents, Math.random) }
}

export default function ZdrajcaGame() {
  const [{ residents, day }, setState] = useState<{ residents: Resident[]; day: Day }>(newGame)
  const [dayNumber, setDayNumber] = useState(1)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [morningNews, setMorningNews] = useState('Pierwszy wieczór w zamku. Wśród was są dwaj zdrajcy, którzy spędzili popołudnie w Wieży.')
  const [banishedRoles, setBanishedRoles] = useState<Resident['role'][]>([])

  const status = gameStatus(residents)
  const caught = banishedRoles.filter((r) => r === 'zdrajca').length
  const wrong = banishedRoles.filter((r) => r === 'lojalny').length
  const score = Math.max(0, caught * POINTS_PER_TRAITOR - wrong * PENALTY_PER_LOYAL)
  const myCompanions = residents.flatMap((r, i) => (i !== PLAYER && r.alive && day.actual[i] === day.actual[PLAYER] ? [r.name] : []))

  function restart() {
    setState(newGame())
    setDayNumber(1)
    setVerdict(null)
    setMorningNews('Nowa gra. Wśród was znów są dwaj zdrajcy.')
    setBanishedRoles([])
  }

  function vote(target: number) {
    const votes = [{ voter: PLAYER, target }, ...botVotes(residents, day, Math.random)]
    const banished = banish(votes, Math.random)
    setVerdict({ votes, banished })
    setBanishedRoles([...banishedRoles, residents[banished].role])
    setState({ day, residents: residents.map((r, i) => (i === banished ? { ...r, alive: false } : r)) })
  }

  function night() {
    const victim = gameStatus(residents) === 'ongoing' ? nightVictim(residents, Math.random) : null
    const next = residents.map((r, i) => (i === victim ? { ...r, alive: false } : r))
    setState({ residents: next, day: planDay(next, Math.random) })
    setMorningNews(victim === null ? 'Noc minęła spokojnie.' : `Rano okazuje się, że ${residents[victim].name} został(a) zamordowany(a) przez zdrajców. 🗡️`)
    setDayNumber(dayNumber + 1)
    setVerdict(null)
  }

  if (status !== 'ongoing' && !verdict) {
    return (
      <ResultScreen
        slug="zdrajca"
        score={score}
        maxScore={2 * POINTS_PER_TRAITOR}
        summary={
          status === 'win'
            ? `Wszyscy zdrajcy wygnani w ${dayNumber - 1} dni! Niewinnie wygnanych: ${wrong}.`
            : residents[PLAYER].alive
              ? 'Zdrajcy przejęli zamek.'
              : 'Zamek wygnał właśnie ciebie. Zdrajcy dziękują za współpracę.'
        }
        shareLine={banishedRoles.map((r) => (r === 'zdrajca' ? '🗡️' : '😇')).join('')}
        onRestart={restart}
      >
        <p className="text-sm">
          Zdrajcy: {residents.filter((r) => r.role === 'zdrajca').map((r) => r.name).join(', ')}
        </p>
      </ResultScreen>
    )
  }

  return (
    <>
      <Hud items={[['Dzień', dayNumber], ['Żywi', residents.filter((r) => r.alive).length], ['Złapani zdrajcy', `${caught}/2`]]} />
      <Card>
        <CardContent className="flex flex-col gap-3">
          <p className="italic">{morningNews}</p>
          <p className="rounded-md bg-muted px-3 py-2 text-sm">
            🙂 Ty byłeś w <strong>{LOCATIVE[day.actual[PLAYER]]}</strong>
            {myCompanions.length > 0 ? ` razem z: ${myCompanions.join(', ')}` : ' – sam(a)'}
          </p>
          <ul className="flex flex-col gap-1" data-testid="statements">
            {day.statements.map((s) => (
              <li key={s.who} className="text-sm">
                {residents[s.who].emoji} <strong>{residents[s.who].name}</strong>: „Byłem/am w {LOCATIVE[s.claimed]}
                {s.companions.length > 0 ? ` z: ${s.companions.map((c) => (c === PLAYER ? 'Tobą' : residents[c].name)).join(', ')}` : ', sam(a)'}.”
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {verdict ? (
        <Card data-testid="verdict">
          <CardContent className="flex flex-col gap-2">
            <ul className="text-sm">
              {verdict.votes.map(({ voter, target }) => (
                <li key={voter}>
                  {residents[voter].name} → {residents[target].name}
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold">
              Wygnany: {residents[verdict.banished].name} – {residents[verdict.banished].role === 'zdrajca' ? 'ZDRAJCA! 🗡️' : 'lojalny… 😇'}
            </p>
            <Button onClick={night}>{gameStatus(residents) === 'ongoing' ? 'Zapada noc…' : 'Wynik'}</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Okrągły stół: kogo wygnać? Szukaj sprzecznych alibi.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {residents.map((r, i) =>
              i !== PLAYER && r.alive ? (
                <Button key={r.name} variant="outline" className="h-auto flex-col py-2" data-testid="suspect" onClick={() => vote(i)}>
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="whitespace-normal text-xs">{r.name}</span>
                </Button>
              ) : null,
            )}
          </div>
        </div>
      )}
    </>
  )
}
