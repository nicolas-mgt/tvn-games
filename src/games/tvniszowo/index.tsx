import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { dailyRng, todayKey } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { loadJSON, saveJSON } from '@/shared/storage'
import { useCountdown } from '@/shared/useCountdown'
import { ArchiveBackdrop, type Mood } from './ArchiveBackdrop'
import { Archivist } from './Archivist'
import {
  ANSWER_SECONDS,
  archivistMood,
  DAILY_KEY,
  dayNumber,
  dealQuestions,
  matchAnswer,
  MAX_SCORE,
  MISS,
  pickLine,
  PREVIEW_SECONDS,
  QUESTIONS,
  roundResult,
  ROUNDS,
  shareFor,
  SLUG,
  TIER_IDS,
  TIERS,
  totalScore,
  verdictFor,
  WARN_SECONDS,
  type Answer,
  type Mode,
  type Phase,
  type Question,
  type RoundResult,
} from './logic'
import { Shaft } from './Shaft'
import { play, sfx } from './sfx'
import { Cassette, TapeShelf, TierTape } from './Tapes'

type Message = { text: string; kind: 'error' | 'confirm' }

function dailyLabel() {
  const day = todayKey()
  const [y, m, d] = day.split('-').map(Number)
  return `Ramówka #${dayNumber(day)} · ${new Date(y, m - 1, d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}`
}

export default function TvniszowoGame() {
  const [dailyDone, setDailyDone] = useState(() => loadJSON<string | null>(DAILY_KEY, null) === todayKey())
  const [phase, setPhase] = useState<Phase>('lobby')
  const [mode, setMode] = useState<Mode>('daily')
  const [questions, setQuestions] = useState<Question[]>([])
  const [round, setRound] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const [guess, setGuess] = useState('')
  const [pending, setPending] = useState<{ raw: string; answer: Answer } | null>(null)
  const [message, setMessage] = useState<Message | null>(null)
  const [rejects, setRejects] = useState(0)
  const [rejected, setRejected] = useState(false)
  const [line, setLine] = useState(() => pickLine('lobby'))
  const [urgentLine, setUrgentLine] = useState(() => pickLine('urgent'))
  const inputRef = useRef<HTMLInputElement>(null)
  const reactionToken = useRef(0)
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const preview = useCountdown(PREVIEW_SECONDS, phase === 'preview', () => {
    setPhase('answering')
    setLine(pickLine('answering'))
    play('lamp')
  })
  const answerClock = useCountdown(ANSWER_SECONDS, phase === 'answering', () => finishRound(null, null))
  const secondsLeft = Math.ceil(answerClock.remaining)
  const urgent = phase === 'answering' && secondsLeft <= WARN_SECONDS

  useEffect(() => {
    if (phase === 'answering') inputRef.current?.focus({ preventScroll: true })
  }, [phase])

  useEffect(() => {
    if (urgent && secondsLeft > 0) play('tick')
  }, [urgent, secondsLeft])

  const question = questions[round]
  const last = results[round] as RoundResult | undefined
  const score = totalScore(results)

  function startGame(next: Mode) {
    sfx.unlock()
    setMode(next)
    setQuestions(dealQuestions(next === 'daily' ? dailyRng(SLUG) : Math.random))
    setResults([])
    startRound(0)
  }

  function startRound(index: number) {
    setRound(index)
    setPhase('preview')
    preview.setRemaining(PREVIEW_SECONDS)
    answerClock.setRemaining(ANSWER_SECONDS)
    setGuess('')
    setPending(null)
    setMessage(null)
    setRejected(false)
    setLine(pickLine('preview'))
    setUrgentLine(pickLine('urgent'))
    play('insert')
    setTimeout(() => play('reel'), 250 * pace)
  }

  function react(text: string, kind: Message['kind']) {
    setMessage({ text, kind })
    if (kind === 'confirm') return
    setRejects((n) => n + 1)
    setRejected(true)
    inputRef.current?.select()
    const token = ++reactionToken.current
    setTimeout(() => {
      if (reactionToken.current === token) setRejected(false)
    }, 1400)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (phase !== 'answering') return
    const text = guess.trim()
    if (!text) return
    if (pending?.raw === text) return finishRound(pending.answer, text)
    setPending(null)
    const match = matchAnswer(question, text)
    if (match.kind === 'exact') return finishRound(match.answer, text)
    if (match.kind === 'fuzzy') {
      setPending({ raw: text, answer: match.answer })
      react(`Chodziło o „${match.answer.name}”? Enter – potwierdź, albo popraw.`, 'confirm')
      setLine(pickLine('confirm'))
      play('confirm')
      return
    }
    play('reject')
    if (match.kind === 'partial') {
      react('Blisko! Wpisz pełną nazwę.', 'error')
      setLine(pickLine('partial'))
    } else {
      react(`„${text}” – nie ma tego w naszym archiwum. Próbuj dalej!`, 'error')
      setLine(pickLine('reject'))
    }
  }

  function changeGuess(value: string) {
    setGuess(value)
    if (pending && value.trim() !== pending.raw) {
      setPending(null)
      setMessage(null)
    }
  }

  function finishRound(answer: Answer | null, raw: string | null) {
    if (phase !== 'answering' || results.length !== round) return
    const result = roundResult(question, answer, raw)
    setResults([...results, result])
    setPhase('feedback')
    setPending(null)
    setMessage(null)
    setRejected(false)
    if (!result.tier) {
      play('bad')
      setLine(pickLine('miss'))
      return
    }
    const tier = TIERS[result.tier]
    const rare = tier.depth >= TIERS.koneser.depth
    play('descend', tier.depth)
    setLine(pickLine(result.tier === 'zloty' ? 'gold' : rare ? 'rare' : 'hit'))
    setTimeout(
      () => {
        if (result.tier === 'zloty') {
          play('gold')
          play('good')
          confetti({ particleCount: 140, spread: 100, origin: { y: 0.4 }, colors: ['#ffe066', '#ffd166', '#fff6c8'], disableForReducedMotion: true })
        } else if (rare) play('good')
        else play('hit', TIER_IDS.indexOf(result.tier!) / (TIER_IDS.length - 1))
      },
      (300 + tier.depth * 600) * pace,
    )
  }

  function nextRound() {
    if (round + 1 < ROUNDS) return startRound(round + 1)
    setPhase('result')
    setLine(pickLine('result'))
    if (mode === 'daily') {
      saveJSON(DAILY_KEY, todayKey())
      setDailyDone(true)
    }
  }

  function backdropMood(): Mood {
    if (phase === 'lobby') return 'idle'
    if (phase === 'result') return 'result'
    if (phase === 'preview') return 'preview'
    if (phase === 'answering') return urgent ? 'urgent' : 'answering'
    if (!last?.tier) return 'miss'
    return last.tier === 'zloty' ? 'gold' : 'hit'
  }

  const mood = archivistMood({ phase, tier: last?.tier ?? null, secondsLeft, rejected, score })
  const modeLabel = mode === 'daily' ? dailyLabel() : 'Bez limitu'
  const lastAnswer = last?.answer ? question?.answers.find((a) => a.name === last.answer) : undefined

  return (
    <MotionConfig reducedMotion="user">
      <ArchiveBackdrop mood={backdropMood()} tierColor={last?.tier ? TIERS[last.tier].color : undefined} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div className="ar-lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Archivist mood="calm" line={line} />
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="ar-hand text-3xl text-amber-200">Podziemia TVN · magazyn taśm</p>
            <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">TVNiszowo</h2>
            <p className="text-white/90">
              Siedem pytań o programy, seriale i kanały TVN. Każda poprawna odpowiedź się liczy, ale im rzadsza, tym więcej punktów. Na pytanie masz 25 sekund, a pomyłki nic nie kosztują.
            </p>
            <ul className="ar-legend" data-testid="legend">
              {TIER_IDS.map((id) => (
                <li key={id}>
                  <TierTape tier={id} />
                </li>
              ))}
            </ul>
            {dailyDone ? (
              <p className="ar-hand text-2xl text-amber-200" data-testid="practice-note">
                Dzisiejsza ramówka zaliczona. Następna o północy, a teraz możesz grać bez limitu.
              </p>
            ) : (
              <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={() => startGame('daily')} data-testid="start">
                Schodzę do archiwum
              </Button>
            )}
            <Button variant={dailyDone ? 'default' : 'outline'} size="lg" className="font-display text-xl tracking-widest" onClick={() => startGame('unlimited')} data-testid="start-unlimited">
              Bez limitu
            </Button>
            {!dailyDone && <p className="text-sm text-white/70">{dailyLabel()}: te same pytania dla wszystkich graczy.</p>}
          </div>
        </motion.div>
      )}

      {question && phase !== 'lobby' && phase !== 'result' && (
        <div className="ar-game" data-phase={phase}>
          <header className="ar-bar">
            <strong data-testid="mode">{modeLabel}</strong>
            <TapeShelf results={results} current={round} />
            <span className="ar-score" data-testid="score" data-value={score}>
              {score} pkt
            </span>
          </header>

          <div className="ar-stage">
            <div className="ar-host">
              <Archivist mood={mood} line={urgent && !message ? urgentLine : line} />
            </div>

            <div className="ar-desk">
              <article className="ar-card" data-testid="question-card" data-phase={phase} data-question={question.id}>
                <div className="ar-card-head">
                  <span className="ar-card-stamp ar-sign">{question.category}</span>
                  <span className="ar-card-no">
                    Runda {round + 1} z {ROUNDS}
                  </span>
                </div>
                <h3 className="ar-card-prompt">{question.prompt}</h3>
                {question.hint && <p className="ar-card-hint ar-hand">{question.hint}</p>}
                {phase === 'preview' && (
                  <div className="ar-loading" data-testid="preview">
                    <div className="ar-loading-box">
                      <span className="ar-sign">Ładowanie taśmy…</span>
                      <b className="ar-sign">{Math.ceil(preview.remaining)}</b>
                    </div>
                  </div>
                )}
              </article>

              {phase !== 'feedback' ? (
                <form onSubmit={submit} className="ar-form" data-shake={rejects % 2} data-rejects={rejects}>
                  <Input
                    ref={inputRef}
                    value={guess}
                    onChange={(e) => changeGuess(e.target.value)}
                    disabled={phase !== 'answering'}
                    placeholder={phase === 'answering' ? 'Wpisz odpowiedź…' : 'Za chwilę…'}
                    className="ar-input"
                    autoComplete="off"
                    enterKeyHint="send"
                    data-testid="answer"
                  />
                  <Button type="submit" className="ar-submit font-display text-xl tracking-wider" disabled={phase !== 'answering'} data-testid="submit">
                    {pending ? 'Potwierdzam' : 'Szukaj'}
                  </Button>
                  <p className="ar-message" data-testid="message" data-kind={message?.kind} aria-live="polite">
                    {message?.text}
                  </p>
                </form>
              ) : (
                last && (
                  <motion.section
                    className="ar-feedback"
                    data-testid="feedback"
                    data-tier={last.tier ?? 'miss'}
                    style={{ '--ar-c': last.tier ? TIERS[last.tier].color : MISS.color } as CSSProperties}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 * pace }}
                  >
                    <TierTape tier={last.tier} showScore={false} />
                    <p className="ar-feedback-answer">
                      {lastAnswer ? (
                        <>
                          <strong>{lastAnswer.name}</strong>
                          {lastAnswer.note && ` – ${lastAnswer.note}`}
                        </>
                      ) : (
                        'Brak odpowiedzi'
                      )}
                    </p>
                    <p className="ar-hand text-xl">{last.tier ? TIERS[last.tier].blurb : MISS.blurb}</p>
                    <p className="ar-feedback-score ar-sign" data-testid="round-score" data-value={last.score}>
                      +{last.score}
                    </p>
                    <Button autoFocus onClick={nextRound} className="ar-next font-display text-xl tracking-wider" data-testid="next">
                      {round + 1 < ROUNDS ? 'Dalej' : 'Wyniki'}
                    </Button>
                  </motion.section>
                )
              )}
            </div>

            <div className="ar-timer">
              <Cassette remaining={phase === 'preview' ? ANSWER_SECONDS : answerClock.remaining} total={ANSWER_SECONDS} running={phase === 'answering'} warn={urgent} />
            </div>
            <div className="ar-depth">
              <Shaft tier={last?.tier ?? null} state={phase === 'feedback' ? (last?.tier ? 'hit' : 'miss') : 'waiting'} />
            </div>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen
          slug={SLUG}
          score={score}
          maxScore={MAX_SCORE}
          shareLine={`${mode === 'daily' ? `Ramówka #${dayNumber(todayKey())}` : 'Bez limitu'} ${results.map(shareFor).join('')}`}
          summary={
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold" data-testid="verdict">
                {verdictFor(score)}
              </p>
              {mode === 'daily' && <p className="text-sm text-white/70">Następna ramówka o północy.</p>}
            </div>
          }
          onRestart={() => startGame('unlimited')}
        >
          <div className="ar-result">
            <Archivist mood={mood} line={line} />
            <ol className="ar-rounds" data-testid="rounds">
              {results.map((result, i) => (
                <RoundSheet key={result.questionId} result={result} question={questions[i]} />
              ))}
            </ol>
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/70">
        Dźwięki: Kenney (CC0) · Pytania: Wikipedia i tvn.pl, źródła w ściądze po grze · Mechanika: krillion.io · Pani Halinka jest fikcyjna · {QUESTIONS.length} pytań w archiwum
      </p>
    </MotionConfig>
  )
}

/** One finished round with an expandable list of every correct answer, rarest first. */
function RoundSheet({ result, question }: { result: RoundResult; question: Question }) {
  const color = result.tier ? TIERS[result.tier].color : MISS.color
  return (
    <li className="ar-round" style={{ '--ar-c': color } as CSSProperties} data-tier={result.tier ?? 'miss'}>
      <details>
        <summary data-testid="round-head">
          <span className="ar-round-text">
            <span className="ar-round-prompt">{question.prompt}</span>
            <span className="ar-round-answer">{result.answer ? `Twoja odpowiedź: ${result.answer} · ${TIERS[result.tier!].name}` : 'Brak odpowiedzi'}</span>
          </span>
          <b className="ar-sign">+{result.score}</b>
        </summary>
        <div className="ar-sheet" data-testid="answer-sheet">
          {[...TIER_IDS].reverse().map((id) => {
            const answers = question.answers.filter((a) => a.tier === id)
            if (!answers.length) return null
            return (
              <section key={id}>
                <TierTape tier={id} />
                <ul>
                  {answers.map((a) => (
                    <li key={a.name} data-mine={a.name === result.answer}>
                      {a.name}
                      {a.note && <small> – {a.note}</small>}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
          <p className="ar-sources">
            Źródła:{' '}
            {question.sources.map((url, i) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                [{i + 1}]
              </a>
            ))}
          </p>
        </div>
      </details>
    </li>
  )
}
