import { motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pickN } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import pallets from './data.json'
import { BID_STEP, dealerLimits, dealersOnlyResult, nextDealerBid, type Leader } from './logic'

const START_BUDGET = 5000
const PALLETS_PER_GAME = 5
const DEALERS = ['Mirek „Złota Rączka”', 'Pani Basia', 'Seba z internetu']

type Lot = (typeof pallets)[number] & { value: number; limits: number[] }
type Sale = { winner: Leader; price: number }

function dealLots(): Lot[] {
  return pickN(pallets, PALLETS_PER_GAME).map((pallet) => {
    const value = pallet.contents.reduce((sum, item) => sum + item.value, 0)
    return { ...pallet, value, limits: dealerLimits(value, DEALERS.length, Math.random) }
  })
}

const zl = (amount: number) => `${amount.toLocaleString('pl-PL')} zł`

export default function PaletaWCiemnoGame() {
  const [lots, setLots] = useState(dealLots)
  const [index, setIndex] = useState(0)
  const [budget, setBudget] = useState(START_BUDGET)
  const [price, setPrice] = useState(0)
  const [leader, setLeader] = useState<Leader>(null)
  const [log, setLog] = useState<string[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const lot = lots[index]
  const sale = sales[index]
  const profit = sales.reduce((sum, s, i) => (s.winner === 'player' ? sum + lots[i].value - s.price : sum), 0)

  function restart() {
    setLots(dealLots())
    setIndex(0)
    setBudget(START_BUDGET)
    setPrice(0)
    setLeader(null)
    setLog([])
    setSales([])
  }

  function close(result: Sale) {
    setSales([...sales, result])
    if (result.winner === 'player') setBudget(budget - result.price)
  }

  function bid(step: number) {
    const offer = price + step
    const dealer = nextDealerBid(lot.limits, offer, 'player', Math.random)
    if (dealer === null) {
      setLog([...log, `Ty: ${zl(offer)}`, 'Cisza na sali… Sprzedane!'])
      close({ winner: 'player', price: offer })
      return
    }
    const counter = offer + BID_STEP
    setLog([...log, `Ty: ${zl(offer)}`, `${DEALERS[dealer]}: ${zl(counter)}`])
    setPrice(counter)
    setLeader(dealer)
  }

  function pass() {
    const result = dealersOnlyResult(lot.limits, price)
    if (result) {
      setLog([...log, 'Pasujesz.', `${DEALERS[result.winner]} kupuje za ${zl(result.price)}.`])
      close(result)
    } else {
      setLog([...log, 'Pasujesz.', 'Nikt nie chce tej palety.'])
      close({ winner: null, price: 0 })
    }
  }

  function nextLot() {
    setIndex(index + 1)
    setPrice(0)
    setLeader(null)
    setLog([])
  }

  if (index >= lots.length) {
    const bought = sales.flatMap((s, i) => (s.winner === 'player' ? [{ lot: lots[i], price: s.price }] : []))
    return (
      <ResultScreen
        slug="paleta-w-ciemno"
        score={profit}
        summary={
          <ul className="text-sm">
            {bought.length === 0 && <li>Nic nie kupiłeś. Bezpiecznie, ale nudno.</li>}
            {bought.map(({ lot: l, price: p }, i) => (
              <li key={i}>
                {l.emoji} {l.description} – kupione za {zl(p)}, warte {zl(l.value)} ({l.value - p >= 0 ? '+' : ''}
                {zl(l.value - p)})
              </li>
            ))}
          </ul>
        }
        shareLine={sales.map((s, i) => (s.winner !== 'player' ? '⬜' : lots[i].value > s.price ? '💰' : '💸')).join('')}
        onRestart={restart}
      />
    )
  }

  return (
    <>
      <Hud items={[['Paleta', `${index + 1}/${lots.length}`], ['Budżet', zl(budget)], ['Zysk', zl(profit)]]} />
      <Card>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <span className={`text-8xl transition ${sale ? '' : 'blur-sm'}`}>{lot.emoji}</span>
          <p className="text-lg font-semibold">{lot.description}</p>
          {!sale && (
            <>
              <p className="text-3xl font-black tabular-nums" data-testid="price">
                {price === 0 ? 'Cena wywoławcza: 100 zł' : zl(price)}
              </p>
              <p className="text-sm text-muted-foreground">
                Prowadzi: {leader === null ? 'nikt' : leader === 'player' ? 'Ty' : DEALERS[leader]}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => bid(BID_STEP)} disabled={price + BID_STEP > budget}>
                  +100 zł
                </Button>
                <Button onClick={() => bid(500)} disabled={price + 500 > budget}>
                  +500 zł
                </Button>
                <Button variant="outline" onClick={pass}>
                  Pas
                </Button>
              </div>
            </>
          )}
          <ul className="flex flex-col gap-0.5 text-sm" data-testid="auction-log">
            {log.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          {sale && (
            <div className="flex w-full flex-col items-center gap-3">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">Zawartość palety</p>
              <ul className="grid w-full gap-1 sm:grid-cols-2">
                {lot.contents.map((item, i) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.35 }}
                    className="rounded-md border px-3 py-2 text-left"
                  >
                    {item.emoji} {item.name} – <strong>{zl(item.value)}</strong>
                  </motion.li>
                ))}
              </ul>
              <p className="font-semibold">
                Wartość: {zl(lot.value)}
                {sale.winner === 'player' && ` · twój wynik: ${lot.value - sale.price >= 0 ? '+' : ''}${zl(lot.value - sale.price)}`}
              </p>
              <Button onClick={nextLot}>{index === lots.length - 1 ? 'Podsumowanie' : 'Następna paleta'}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
