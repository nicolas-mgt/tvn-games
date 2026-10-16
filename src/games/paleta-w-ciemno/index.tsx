import '@fontsource/bebas-neue'
import '@fontsource/caveat/700.css'
import confetti from 'canvas-confetti'
import { AnimatePresence, MotionConfig, motion, useAnimate, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { pickN } from '@/shared/daily'
import { MuteButton, ResultScreen } from '@/shared/GameShell'
import pallets from './data.json'
import { Dealer, type DealerState } from './Dealer'
import { BID_STEP, dealerLimits, dealersOnlyResult, formatZl, nextDealerBid, REVEAL_DELAY, REVEAL_STEP, type Leader } from './logic'
import { Pallet } from './Pallet'
import { play, sfx } from './sfx'
import { YardBackdrop, type Mood } from './YardBackdrop'

const START_BUDGET = 5000
const PALLETS_PER_GAME = 5
const DEALERS = ['Mirek „Złota Rączka”', 'Pani Basia', 'Seba z internetu']
const DEALER_SHORT = ['Mirek', 'Pani Basia', 'Seba']
const HOT_SHARE = 0.7
const COUNTER_BID_DELAY = 1400

type Phase = 'lobby' | 'arrive' | 'bidding' | 'waiting' | 'going' | 'reveal'
type Lot = (typeof pallets)[number] & { value: number; limits: number[] }
type Sale = { winner: Leader; price: number }

function dealLots(): Lot[] {
  return pickN(pallets, PALLETS_PER_GAME).map((pallet) => {
    const value = pallet.contents.reduce((sum, item) => sum + item.value, 0)
    return { ...pallet, value, limits: dealerLimits(value, DEALERS.length, Math.random) }
  })
}

function stampFor(sale: Sale) {
  if (sale.winner === 'player') return 'Kupione'
  if (sale.winner === null) return 'Bez kupca'
  return `Sprzedane: ${DEALER_SHORT[sale.winner]}`
}

export default function PaletaWCiemnoGame() {
  const [phase, setPhase] = useState<Phase>('lobby')
  const [lots, setLots] = useState(dealLots)
  const [index, setIndex] = useState(0)
  const [budget, setBudget] = useState(START_BUDGET)
  const [price, setPrice] = useState(0)
  const [leader, setLeader] = useState<Leader>(null)
  const [log, setLog] = useState<string[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [call, setCall] = useState<string | null>(null)
  const counterBidTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (counterBidTimer.current !== null) clearTimeout(counterBidTimer.current)
  }, [])
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const reducedMotion = useReducedMotion()
  const pace = reducedMotion ? 0.15 : 1
  const lot = lots[index]
  const sale = sales[index]
  const revealedSales = phase === 'going' ? sales.slice(0, index) : sales
  const profit = revealedSales.reduce((sum, s, i) => (s.winner === 'player' ? sum + lots[i].value - s.price : sum), 0)

  function arrive() {
    setPhase('arrive')
    play('beep')
    setTimeout(() => setPhase('bidding'), 1200 * pace)
  }

  function enterYard() {
    sfx.unlock()
    arrive()
  }

  function restart() {
    setLots(dealLots())
    setIndex(0)
    setBudget(START_BUDGET)
    setPrice(0)
    setLeader(null)
    setLog([])
    setSales([])
    arrive()
  }

  function reveal(result: Sale) {
    setPhase('reveal')
    setCall(null)
    play('foil')
    lot.contents.forEach((_, i) => setTimeout(() => play('tag'), (REVEAL_DELAY + i * REVEAL_STEP) * pace * 1000))
    setTimeout(
      () => {
        play('cash')
        if (result.winner !== 'player') return
        const gain = lot.value - result.price
        setTimeout(() => play(gain >= 0 ? 'good' : 'bad'), 300)
        if (gain > 0) {
          confetti({
            particleCount: 30,
            spread: 90,
            startVelocity: 30,
            gravity: 0.7,
            scalar: 1.8,
            shapes: [confetti.shapeFromText({ text: '💵', scalar: 1.8 })],
            origin: { y: 0.5 },
            disableForReducedMotion: true,
          })
        } else if (gain < 0 && !reducedMotion) {
          void animate(scope.current, { x: [0, -10, 8, -6, 3, 0] }, { duration: 0.45 })
        }
      },
      ((REVEAL_DELAY + lot.contents.length * REVEAL_STEP) * pace + 0.7) * 1000,
    )
  }

  function sell(result: Sale, lines: string[]) {
    setSales([...sales, result])
    if (result.winner === 'player') setBudget(budget - result.price)
    setLog([...log, ...lines])
    if (result.winner !== null) {
      setLeader(result.winner)
      setPrice(result.price)
    }
    setPhase('going')
    const step = 550 * pace
    setCall('Po raz pierwszy…')
    play('going')
    setTimeout(() => {
      setCall('Po raz drugi…')
      play('going')
    }, step)
    setTimeout(() => {
      setCall(result.winner === null ? 'Bez kupca!' : 'Sprzedane!')
      play('gavel')
    }, step * 2)
    setTimeout(() => reveal(result), step * 2 + 1000 * pace)
  }

  function bid(step: number) {
    if (phase !== 'bidding') return
    const offer = price + step
    play('bid')
    setPrice(offer)
    setLeader('player')
    setLog([...log, `Ty: ${formatZl(offer)}`])
    setPhase('waiting')
    counterBidTimer.current = setTimeout(() => {
      counterBidTimer.current = null
      const dealer = nextDealerBid(lot.limits, offer, 'player', Math.random)
      if (dealer === null) {
        sell({ winner: 'player', price: offer }, [`Ty: ${formatZl(offer)}`, 'Cisza na placu…'])
        return
      }
      const counter = offer + BID_STEP
      setLog((lines) => [...lines, `${DEALERS[dealer]}: ${formatZl(counter)}`])
      setPrice(counter)
      setLeader(dealer)
      setPhase('bidding')
      play('paddle')
    }, COUNTER_BID_DELAY)
  }

  function pass() {
    const result = dealersOnlyResult(lot.limits, price)
    if (result) sell(result, ['Pasujesz.', `${DEALERS[result.winner]} kupuje za ${formatZl(result.price)}.`])
    else sell({ winner: null, price: 0 }, ['Pasujesz.', 'Nikt nie chce tej palety.'])
  }

  function nextLot() {
    setIndex(index + 1)
    setPrice(0)
    setLeader(null)
    setLog([])
    if (index + 1 < lots.length) {
      arrive()
      return
    }
    if (profit > 0) confetti({ particleCount: 140, spread: 100, origin: { y: 0.4 }, colors: ['#f2b705', '#2f9e44', '#ffffff'], disableForReducedMotion: true })
  }

  function dealerState(dealer: number): DealerState {
    if (phase === 'reveal' && sale) return sale.winner === dealer ? 'won' : 'lost'
    if (leader === dealer) return 'bidding'
    if (price > 0 && lot.limits[dealer] < price + BID_STEP) return 'out'
    return 'idle'
  }

  function mood(): Mood {
    if (phase === 'lobby' || index >= lots.length) return 'idle'
    if (phase === 'arrive') return 'arrive'
    if (phase === 'reveal') {
      if (sale?.winner !== 'player') return 'reveal'
      return lot.value >= sale.price ? 'won' : 'lost'
    }
    return price > budget * HOT_SHARE ? 'hot' : 'bidding'
  }

  const finished = index >= lots.length
  const bought = sales.flatMap((s, i) => (s.winner === 'player' ? [{ lot: lots[i], price: s.price }] : []))

  return (
    <MotionConfig reducedMotion="user">
      <YardBackdrop mood={mood()} />
      <MuteButton sfx={sfx} />

      {phase === 'lobby' && (
        <motion.div
          className="pw-lobby mx-auto flex max-w-xl flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="pw-hand text-2xl text-amber-300">Plac za hurtownią · licytacja w ciemno</p>
          <h2 className="font-display text-7xl tracking-wider text-white sm:text-8xl">Paleta w ciemno</h2>
          <p className="text-white/80">
            Pięć zafoliowanych palet, lakoniczny list przewozowy i trzech handlarzy, którzy znają się na rzeczy. Masz 5 000 zł. Liczy się zysk, a co jest
            pod folią, zobaczysz dopiero po uderzeniu młotka.
          </p>
          <Button size="lg" className="h-14 px-10 font-display text-2xl tracking-widest" onClick={enterYard} data-testid="enter-yard">
            Wjeżdżam na plac
          </Button>
        </motion.div>
      )}

      {phase !== 'lobby' && !finished && (
        <div className="flex flex-col gap-4">
          <div className="pw-board" data-testid="board">
            <div>
              <span>Paleta</span>
              <strong>
                {index + 1}/{lots.length}
              </strong>
            </div>
            <div>
              <span>Budżet</span>
              <strong>{formatZl(budget)}</strong>
            </div>
            <div>
              <span>Zysk</span>
              <strong className={profit < 0 ? 'text-red-700' : undefined}>{formatZl(profit)}</strong>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_21rem] lg:grid-rows-[auto_1fr]">
            <div className="grid grid-cols-3 gap-1 lg:col-start-2 lg:row-start-1">
              {DEALERS.map((name, dealer) => (
                <Dealer key={name} variant={dealer} name={name} state={dealerState(dealer)} bid={leader === dealer ? price : undefined} />
              ))}
            </div>

            <div ref={scope} className="flex flex-col items-center gap-4 lg:col-start-1 lg:row-span-2 lg:row-start-1">
              <motion.div
                key={index}
                className="w-full"
                initial={{ x: '110vw' }}
                animate={{ x: 0 }}
                transition={{ duration: 1.1 * pace, ease: [0.2, 0.8, 0.3, 1] }}
              >
                <Pallet
                  number={index + 1}
                  description={lot.description}
                  stamp={sale && (phase === 'reveal' || call === 'Sprzedane!' || call === 'Bez kupca!') ? stampFor(sale) : undefined}
                  revealed={phase === 'reveal'}
                  contents={lot.contents}
                  paid={sale?.winner === 'player' ? sale.price : undefined}
                  pace={pace}
                />
              </motion.div>

              {phase !== 'reveal' ? (
                <div className="flex w-full max-w-xl flex-col items-center gap-3">
                  <div className="pw-price-board">
                    <span className="pw-price-label">{price === 0 ? 'Cena wywoławcza' : 'Aktualna cena'}</span>
                    <motion.span key={price} className="pw-price" data-testid="price" initial={{ scale: 1.25 }} animate={{ scale: 1 }}>
                      {formatZl(price === 0 ? BID_STEP : price)}
                    </motion.span>
                    <div className="pw-call-slot">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={call ?? 'leader'}
                          className={call ? 'pw-call' : 'text-sm text-white/70'}
                          initial={{ opacity: 0, scale: call ? 1.6 : 1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        >
                          {call ?? `Prowadzi: ${leader === null ? 'nikt' : leader === 'player' ? 'Ty' : DEALERS[leader]}`}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <p role="status" className="mt-2 min-h-10 max-w-xs text-center text-sm font-semibold text-amber-200" data-testid="bid-status">
                      {phase === 'waiting'
                        ? 'Twoja oferta prowadzi. Rywale zastanawiają się…'
                        : phase === 'bidding' && typeof leader === 'number'
                          ? `${DEALER_SHORT[leader]} przebija Twoją ofertę o ${formatZl(BID_STEP)}!`
                          : ''}
                    </p>
                  </div>
                  <div className="pw-paddle-panel">
                    <span className="pw-paddle-panel-number">1</span>
                    <Button className="pw-bid" onClick={() => bid(BID_STEP)} disabled={phase !== 'bidding' || price + BID_STEP > budget}>
                      +100 zł
                    </Button>
                    <Button className="pw-bid" onClick={() => bid(500)} disabled={phase !== 'bidding' || price + 500 > budget}>
                      +500 zł
                    </Button>
                    <Button variant="outline" className="pw-pass" onClick={pass} disabled={phase !== 'bidding'}>
                      Pas
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Button size="lg" className="h-12 px-8 font-display text-xl tracking-widest" onClick={nextLot} data-testid="next-lot">
                    {index === lots.length - 1 ? 'Podsumowanie' : 'Następna paleta'}
                  </Button>
                  <p className="max-w-2xl text-center text-[11px] text-white/60" data-testid="photo-credits">
                    Fot.:{' '}
                    {lot.contents.map((item, i) => (
                      <span key={item.id}>
                        {i > 0 && ' · '}
                        <a href={item.photo.source} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                          {item.photo.author}, {item.photo.license}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>

            <ul className="pw-log lg:col-start-2 lg:row-start-2" data-testid="auction-log">
              {log.length === 0 && <li className="text-black/40">Licytacja jeszcze się nie zaczęła.</li>}
              {log
                .map((line, i) => <li key={i}>{line}</li>)
                .reverse()}
            </ul>
          </div>
        </div>
      )}

      {finished && (
        <ResultScreen
          slug="paleta-w-ciemno"
          score={profit}
          summary={
            <ul className="text-sm">
              {bought.length === 0 && <li>Nic nie kupiłeś. Bezpiecznie, ale nudno.</li>}
              {bought.map(({ lot: l, price: p }, i) => (
                <li key={i}>
                  {l.emoji} {l.description} – kupione za {formatZl(p)}, warte {formatZl(l.value)} ({l.value - p >= 0 ? '+' : ''}
                  {formatZl(l.value - p)})
                </li>
              ))}
            </ul>
          }
          shareLine={sales.map((s, i) => (s.winner !== 'player' ? '⬜' : lots[i].value > s.price ? '💰' : '💸')).join('')}
          onRestart={restart}
        />
      )}

      <p className="mt-auto pt-6 text-center text-[11px] text-white/60">
        Dźwięki: Kenney (CC0) · Zdjęcia: Flickr i Wikimedia Commons, autorzy i licencje przy zdjęciach
      </p>
    </MotionConfig>
  )
}
