import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { MotionConfig, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { shuffle } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import { useCountdown } from '@/shared/useCountdown'
import data from './data.json'
import { type Click, FALSE_ALARM_PENALTY, POINTS_PER_FLAG, reporterMood, SECONDS_PER_AD, URGENT_SECONDS } from './logic'
import { NewsroomBackdrop, type Mood } from './NewsroomBackdrop'
import { Printout } from './Printout'
import { Reporter } from './Reporter'
import { play, sfx } from './sfx'
import { Stopwatch } from './Stopwatch'

type Phase = 'lobby' | 'arrive' | 'reading' | 'review'
type Ending = 'allFound' | 'done' | 'timeout'

const ALL_FLAGS = data.listings.reduce((sum, ad) => sum + ad.segments.filter((s) => s.flag).length, 0)
const MAX_SCORE = ALL_FLAGS * POINTS_PER_FLAG

const pickLine = (lines: string[]) => lines[Math.floor(Math.random() * lines.length)]

export default function SciemaGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [ads, setAds] = useState(() => shuffle(data.listings))
  const [index, setIndex] = useState(0)
  const [clicked, setClicked] = useState<Set<number>>(new Set())
  const [score, setScore] = useState(0)
  const [totalFound, setTotalFound] = useState(0)
  const [lastClick, setLastClick] = useState<Click | null>(null)
  const [outcome, setOutcome] = useState<Click | null>(null)
  const [line, setLine] = useState<string | null>(null)
  const [stamp, setStamp] = useState<string | null>(null)
  const clickToken = useRef(0)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1

  const ad = ads[index]
  const finished = index >= ads.length
  const flagCount = ad ? ad.segments.filter((s) => s.flag).length : 0
  const foundCount = ad ? ad.segments.filter((s, i) => s.flag && clicked.has(i)).length : 0
  const timer = useCountdown(SECONDS_PER_AD, phase === 'reading', () => finishAd(clicked, 'timeout'))
  const second = Math.ceil(timer.remaining)

  useEffect(() => {
    if (phase === 'reading' && second <= URGENT_SECONDS && second > 0) play('tick')
  }, [phase, second])

  function arrive() {
    setPhase('arrive')
    setLine(null)
    timer.setRemaining(SECONDS_PER_AD)
    play('paper')
    setTimeout(() => play('pin'), 750 * pace)
    setTimeout(() => {
      setPhase('reading')
      setLine(pickLine(data.comments.reading))
    }, 1000 * pace)
  }

  function enterNewsroom() {
    sfx.unlock()
    arrive()
  }

  function restart() {
    setAds(shuffle(data.listings))
    setIndex(0)
    setScore(0)
    setTotalFound(0)
    setClicked(new Set())
    setStamp(null)
    arrive()
  }

  function flashReaction(click: Click) {
    const token = ++clickToken.current
    setLastClick(click)
    setTimeout(() => {
      if (clickToken.current === token) setLastClick(null)
    }, 1400)
  }

  function finishAd(nowClicked: Set<number>, ending: Ending) {
    const found = ad.segments.filter((s, i) => s.flag && nowClicked.has(i)).length
    const falseAlarms = ad.segments.filter((s, i) => !s.flag && nowClicked.has(i)).length
    const complete = found === flagCount
    setPhase('review')
    setOutcome(complete ? 'hit' : 'miss')
    setLine(pickLine(ending === 'timeout' ? data.comments.timeout : complete ? data.comments.allFound : data.comments.missed))
    if (ending === 'timeout') play('buzz')
    setTimeout(
      () => {
        setStamp(complete ? `Ściema ${found}/${flagCount}` : `Przeoczone: ${flagCount - found}`)
        play('stamp')
        setTimeout(() => {
          play(complete ? 'good' : 'bad')
          play('type')
        }, 300)
        if (complete && falseAlarms === 0) {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.45 }, colors: ['#c92a2a', '#f8f4e3', '#1c1c1c'], disableForReducedMotion: true })
        }
      },
      (ending === 'allFound' ? 700 : 300) * pace,
    )
  }

  function clickSegment(i: number) {
    if (phase !== 'reading' || clicked.has(i)) return
    const nowClicked = new Set(clicked).add(i)
    setClicked(nowClicked)
    if (ad.segments[i].flag) {
      setScore(score + POINTS_PER_FLAG)
      setTotalFound(totalFound + 1)
      play('marker')
      flashReaction('hit')
      setLine(pickLine(data.comments.hit))
      if (foundCount + 1 === flagCount) finishAd(nowClicked, 'allFound')
    } else {
      setScore(score - FALSE_ALARM_PENALTY)
      play('wrong')
      flashReaction('miss')
      setLine(pickLine(data.comments.miss))
      if (!reducedMotion) void animate(scope.current, { x: [0, -8, 6, -4, 2, 0] }, { duration: 0.4 })
    }
  }

  function nextAd() {
    setIndex(index + 1)
    setClicked(new Set())
    setStamp(null)
    setLastClick(null)
    if (index + 1 < ads.length) {
      arrive()
      return
    }
    if (score >= MAX_SCORE * 0.8) confetti({ particleCount: 140, spread: 100, origin: { y: 0.4 }, disableForReducedMotion: true })
  }

  function backdropMood(): Mood {
    if (finished) return 'result'
    if (phase === 'lobby' || phase === 'arrive') return 'idle'
    if (phase === 'review') return 'review'
    if (lastClick) return lastClick
    return timer.remaining < URGENT_SECONDS ? 'urgent' : 'reading'
  }

  const reviewing = phase === 'review'
  const mood = reporterMood({ lastClick: reviewing ? outcome : lastClick, remaining: timer.remaining, reviewing })

  return (
    <MotionConfig reducedMotion="user">
      <NewsroomBackdrop mood={backdropMood()} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div
          className="sc-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="sc-hand text-2xl text-amber-300">Kurier Śledczy · dyżur nocny</p>
          <h2 className="font-display text-6xl tracking-wider text-white sm:text-8xl">Ściema z ogłoszenia</h2>
          <p className="text-white/80">
            Pięć ogłoszeń samochodowych i redakcyjny stoper. Zakreśl zdania, które są ściemą: +{POINTS_PER_FLAG} pkt za trafienie, −{FALSE_ALARM_PENALTY} pkt
            za fałszywy alarm. Na każde ogłoszenie masz {SECONDS_PER_AD} sekund.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enterNewsroom} data-testid="enter-newsroom">
            Wchodzę do redakcji
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && !finished && (
        <div className="flex flex-col gap-4">
          <header className="sc-masthead" data-testid="masthead">
            <strong className="sc-masthead-title">Kurier Śledczy</strong>
            <div className="sc-masthead-stats">
              <span>
                Ogłoszenie <b>{index + 1}/{ads.length}</b>
              </span>
              <span>
                Flagi <b>{foundCount}/{flagCount}</b>
              </span>
              <span>
                Punkty <b data-testid="score">{score}</b>
              </span>
            </div>
          </header>

          <div className="sc-stage">
            <aside className="sc-stage-sidebar">
              <div className="sc-stage-reporter">
                <Reporter mood={mood} line={line} />
              </div>
              <div className="sc-actions">
                {reviewing ? (
                  <Button size="lg" className="h-12 w-full cursor-pointer px-3 font-display text-xl tracking-widest" onClick={nextAd} disabled={!stamp} data-testid="next-ad">
                    {index === ads.length - 1 ? 'Podsumowanie' : 'Następne ogłoszenie'}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    className="sc-done h-12 w-full cursor-pointer whitespace-normal px-3"
                    onClick={() => finishAd(clicked, 'done')}
                    disabled={phase !== 'reading'}
                    data-testid="done"
                  >
                    Gotowe, nic więcej nie widzę
                  </Button>
                )}
              </div>
              <div className="sc-stage-timer">
                <Stopwatch remaining={timer.remaining} total={SECONDS_PER_AD} />
              </div>
            </aside>
            <div ref={scope} className="sc-stage-printout">
              <motion.div
                key={index}
                initial={{ y: '-110vh', rotate: -8 }}
                animate={{ y: 0, rotate: -1 }}
                transition={{ duration: 0.8 * pace, ease: [0.2, 0.8, 0.3, 1] }}
              >
                <Printout ad={ad} number={index + 1} clicked={clicked} reviewing={reviewing} stamp={stamp} pace={pace} onSegment={clickSegment} />
              </motion.div>

            </div>
          </div>
        </div>
      )}

      {finished && (
        <ResultScreen
          slug="sciema-z-ogloszenia"
          score={Math.max(0, score)}
          maxScore={MAX_SCORE}
          summary={`Wyłapane czerwone flagi: ${totalFound}/${ALL_FLAGS}. ${totalFound === ALL_FLAGS ? 'Żaden handlarz cię nie oszuka.' : 'Kilka ściem się prześlizgnęło.'}`}
          onRestart={restart}
        >
          <div className="mx-auto w-full max-w-xs">
            <Reporter
              mood={totalFound === ALL_FLAGS ? 'pleased' : 'neutral'}
              line={totalFound === ALL_FLAGS ? 'Masz etat w redakcji od jutra.' : 'Nieźle jak na pierwszy dyżur. Wracaj jutro.'}
            />
          </div>
        </ResultScreen>
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/60">
        Dźwięki: Kenney (CC0) · Zdjęcia: Wikimedia Commons, autorzy przy zdjęciach · Ogłoszenia są fikcyjne
      </p>
    </MotionConfig>
  )
}
